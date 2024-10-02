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
  onStart: async function ({ api, event }) {
    const threadID = event.threadID;
    const messageBody = event.body.toLowerCase();
    
    // الكلمات المحظورة
    const bannedWords = ["قود", "زامل", "كلب", "بوت"];
    
    // التحقق من وجود كلمات محظورة في الرسالة
    if (bannedWords.some(word => messageBody.includes(word))) {
      const adminID = event.senderID; // معرف المستخدم المرسل
      const botID = api.getCurrentUserID(); // معرف البوت

      // التحقق مما إذا كان البوت أدمن
      const adminStatus = await api.getThreadAdmin(threadID);
      if (!adminStatus.includes(botID)) {
        return api.sendMessage("❌ | أحتاج أن أكون أدمن لطرد الأعضاء.", threadID, event.messageID);
      }
      
      // طرد المستخدم
      return api.removeUserFromGroup(event.senderID, threadID)
        .then(() => api.sendMessage(`✅ | تم طرد ${event.senderID} بسبب استخدام كلمات ممنوعة.`, threadID, event.messageID))
        .catch(err => console.error("Error removing user: ", err));
    }
  }
};
