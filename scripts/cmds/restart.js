module.exports = {
  config: {
    name: "اعادة_تشغيل",
    aliases: ["restart", "رست", "rest"],
    version: "1.1",
    author: "YourName",
    countDown: 5,
    role: 2,  // 2 يعني المطور فقط
    shortDescription: {
      en: "إعادة تشغيل البوت",
    },
    longDescription: {
      en: "هذا الأمر مخصص فقط للمطورين لإعادة تشغيل البوت",
    },
    category: "النظام",
    guide: {
      en: "{pn}: قم بإعادة تشغيل البوت"
    }
  },

  langs: {
    en: {
      restarting: "🔄 | سيتم إعادة تشغيل البوت الآن...",
      success: "✅ | تم إعادة تشغيل البوت بنجاح! الوقت المستغرق: {time} ثانية.",
      error: "❌ | حدث خطأ أثناء محاولة إعادة تشغيل البوت.",
    }
  },

  onStart: async function ({ message, getLang, api, event }) {
    try {
      // خطوة 1: إخبار المستخدم أن البوت سيتم إعادة تشغيله
      await message.reply(getLang("restarting"));

      // تسجيل الوقت الحالي (قبل إعادة التشغيل)
      const startTime = Date.now(); // تخزين الوقت في المتغير

      // خطوة 2: إعادة تشغيل البوت بعد مهلة قصيرة
      setTimeout(() => {
        process.exit(1);  // إعادة تشغيل البوت.
      }, 3000); // فترة 3 ثوانٍ قبل إعادة التشغيل.

      // إرسال رسالة عند بدء التشغيل
      setTimeout(() => {
        const endTime = Date.now();  
        const timeTaken = ((endTime - startTime) / 1000).toFixed(2); // احتساب الوقت المستغرق بالثواني
        api.sendMessage(getLang("success").replace("{time}", timeTaken), event.threadID);
      }, 5000); // فترة 5 ثوانٍ لضمان أن الرسالة ترسل بعد بدء التشغيل.
    } catch (e) {
      message.reply(getLang("error"));
    }
  }
};
