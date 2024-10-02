const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "سجن",
    version: "1.1",
    author: "your love",
    countDown: 5,
    role: 0,
    shortDescription: "صورة لسجن",
    longDescription: "قم بوضع الأعضاء في السجن",
    category: "متعة",
    guide: {
      en: "{pn} <رسالة>"
    }
  },

  langs: {
    vi: {
      noReply: "يجب الرد على رسالة الشخص الذي تريد سجنه"
    },
    en: {
      noReply: "✨ يجب الرد على رسالة الشخص الذي تود سجنه 🙂"
    }
  },

  onStart: async function ({ event, message, usersData, args, getLang }) {
    const uid1 = event.senderID;
    const uid2 = event.messageReply?.senderID; // الحصول على ID المرسل في الرسالة التي تم الرد عليها
    if (!uid2)
      return message.reply(getLang("noReply"));
      
    const avatarURL1 = await usersData.getAvatarUrl(uid1);
    const avatarURL2 = await usersData.getAvatarUrl(uid2);
    const img = await new DIG.Jail().getImage(avatarURL2);
    const pathSave = `${__dirname}/tmp/${uid2}_Jail.png`;
    fs.writeFileSync(pathSave, Buffer.from(img));
    
    const content = args.join(' ');
    message.reply({
      body: `${content || "مرحبا بالمجرم في السجن 😈"} 🚔`,
      attachment: fs.createReadStream(pathSave)
    }, () => fs.unlinkSync(pathSave));
  }
};
