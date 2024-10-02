module.exports = {
  config: {
    name: 'حضر',
    version: '1.0',
    author: 'Kshitiz',
    countDown: 5,
    role: 0,
    shortDescription: 'حضر الأعضاء الذين يستخدمون كلمات ممنوعة',
    longDescription: '',
    category: 'إدارة',
    guide: {
      en: '{p}{n}',
    }
  },
  onChat: async function ({ api, event }) {
    const threadID = event.threadID;
    const messageBody = event.body.toLowerCase();

    // الكلمات المحظورة
    const bannedWords = ["قود", "زامل", "كلب", "بوت"];

    // التحقق من وجود كلمات محظورة في الرسالة
    if (bannedWords.some(word => messageBody.includes(word))) {
      const adminID = event.senderID; // معرف المستخدم المرسل
      const botID = api.getCurrentUserID(); // معرف البوت

      // التحقق مما إذا كان البوت أدمن
      const threadInfo = await api.getThreadInfo(threadID);
      const isBotAdmin = threadInfo.adminIDs.some(admin => admin.id === botID);

      if (isBotAdmin) {
        // طرد العضو
        api.removeUserFromGroup(event.senderID, threadID);
        api.sendMessage(`✅ | تم طردك من المجموعة بسبب استخدام كلمة محظورة.`, event.senderID);
      } else {
        // إذا لم يكن البوت أدمن
        api.sendMessage("❗ | يحتاج البوت إلى أن يكون أدمن لطرد الأعضاء.", threadID);
      }
    }
  }
};
