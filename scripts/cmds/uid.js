module.exports = {
  config: {
    name: "معلومات",
    version: "1.0.1",
    author: "Arjhil",
    longDescription: "الحصول على معلومات المستخدم.",
    shortDescription: "الحصول على معلومات المستخدم.",
    category: "خدمات",
    countdown: 5,
  },

  onStart: async function ({ api, event, args }) {
    let { threadID, senderID, messageID } = event;

    const getUserInfo = async (targetID) => {
      try {
        const userInfo = await api.getUserInfo(targetID);
        const userName = userInfo[targetID].name || "الاسم غير متوفر";
        const uid = targetID;
        const gender = userInfo[targetID].gender || "الجنس غير متوفر";
        const birthday = userInfo[targetID].birthday || "عيد ميلاد غير متوفر";

        // Construct Facebook profile link
        const fbLink = `https://www.facebook.com/profile.php?id=${uid}`;

        // Get profile picture URL
        const profilePicURL = userInfo[targetID].profileUrl || "";

        // Get user status (online, offline, idle)
        const userStatus = userInfo[targetID].isOnline ? "متصل 🟢" : "غير متصل 🔴";

        // Check friendship status (friends or not)
        const areFriends = userInfo[targetID].isFriend ? "نعم ✅" : "لا ❌";

        const userInfoMessage = `
        🌟 معلومات المستخدم 🌟

        📝 الإسم: ${userName}
        🆔 آيدي: ${uid}
        👤 النوع: ${gender}
        🎂 تاريخ الإزدياد: ${birthday}
        📊 الحالة: ${userStatus}
        🤝 الأصدقاء: ${areFriends}
        🌐 رابط فيسبوك: ${fbLink}

        🖼 صورة البروفايل: ${profilePicURL}
        `;

        api.sendMessage(userInfoMessage, threadID, (error, info) => {
          if (!error) {
            api.sendTypingIndicator(threadID);

            // Add a delay to simulate typing
            setTimeout(() => {
              // Add emoji reactions to the message
              api.setMessageReaction("❤", info.messageID);
              api.setMessageReaction("😊", info.messageID);
              api.setMessageReaction("👍", info.messageID);
            }, 1000);
          }
        });
      } catch (error) {
        console.error(error);
        api.sendMessage("حدث خطأ أثناء جلب معلومات المستخدم.", threadID, messageID);
      }
    };

    if (event.messageReply) {
      // إذا كان المستخدم قد رد على رسالة شخص آخر
      const repliedUserID = event.messageReply.senderID;
      getUserInfo(repliedUserID);
    } else if (!args[0]) {
      // إذا لم يتم تقديم UID، استخدم UID للمرسل
      getUserInfo(senderID);
    } else {
      api.sendMessage("استخدام الأمر غير صالح. استخدم `معلومات` أو `معلومات @منشن`.", threadID, messageID);
    }
  },
};
