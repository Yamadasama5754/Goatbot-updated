module.exports = {
  config: {
    name: "إعادة_تشغيل",
    aliases: ["restart", "إعادة تشغيل", "ريستارت"],
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

  onStart: async function ({ message, getLang }) {
    try {
      // خطوة 1: إخبار المستخدم أن البوت سيتم إعادة تشغيله
      await message.reply(getLang("restarting"));

      // تسجيل الوقت الحالي (قبل إعادة التشغيل)
      const startTime = Date.now(); // تخزين الوقت في المتغير

      // خطوة 2: إعادة تشغيل البوت
      process.exit(1);  // هذا الأمر يقوم بإيقاف العملية الحالية وإعادة تشغيل البوت.

      // بعد إعادة التشغيل
      const endTime = Date.now();  
      const timeTaken = ((endTime - startTime) / 1000).toFixed(2); // احتساب الوقت المستغرق بالثواني

      // استخدم هذا الكود لإرسال رسالة من البوت بعد بدء التشغيل
      api.sendMessage(getLang("success").replace("{time}", timeTaken), message.threadID);

    } catch (e) {
      message.reply(getLang("error"));
    }
  }
};

// هذا الجزء يجب أن يكون في نقطة البدء للبوت لضمان بدء الرسالة بعد إعادة التشغيل
const onBotStart = async (api, event) => {
  // يمكن استخدام هذا الكود لإرسال رسالة من البوت بعد بدء التشغيل
  api.sendMessage(`✅ | تم إعادة تشغيل البوت بنجاح!`, event.threadID);
};

// استدعاء الدالة لبدء البوت
onBotStart(api, event);
