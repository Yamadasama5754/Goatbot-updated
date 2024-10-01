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

        const fbLink = `https://www.facebook.com/profile.php?id=${uid}`;
        const profilePicURL = userInfo[targetID].profileUrl || "";
        const userStatus = userInfo[targetID].isOnline ? "متصل 🟢" : "غير متصل 🔴";
        const areFriends = userInfo[targetID].isFriend ? "نعم ✅" : "لا ❌";
        const socialMediaLinks = userInfo[targetID].socialMediaLinks || "هذا المستخدم ليس لديه أي حسابات للتواصل الإجتماعي على فيسبوك";

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

        🔗 روابط وسائل التواصل الاجتماعي الإضافية:
        ${socialMediaLinks}
        `;

        api.sendMessage(userInfoMessage, threadID, (error, info) => {
          if (!error) {
            api.sendTypingIndicator(threadID);
            setTimeout(() => {
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

    if (event.type === "message_reply") {
      // إذا كان هناك رد على رسالة
      const repliedUID = event.messageReply.senderID;
      getUserInfo(repliedUID);
    } else {
      // إذا لم يكن هناك رد
      api.sendMessage("استخدام الأمر غير صالح. إستخدم لمعلوماتك `معلومات` او الرد على رسالة مستخدم لمعلوماته.", threadID, messageID);
    }
  },
};
