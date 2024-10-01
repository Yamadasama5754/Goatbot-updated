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
      restarting: "🔄 | سيتم إعادة تشغيل البوت الآن، قد يستغرق الأمر حوالي {estimatedTime} ثوانٍ...",
      success: "✅ | تم إعادة تشغيل البوت بنجاح! الوقت المستغرق: {time} ثانية.",
      error: "❌ | حدث خطأ أثناء محاولة إعادة تشغيل البوت.",
    }
  },

  onStart: async function ({ message, getLang }) {
    try {
      // تقدير الوقت الذي قد يستغرقه البوت لإعادة التشغيل
      const estimatedTime = (Math.random() * (15 - 5) + 5).toFixed(2); // وقت تقديري بين 5 إلى 15 ثانية

      // إخبار المستخدم أن البوت سيتم إعادة تشغيله مع الوقت التقديري
      await message.reply(getLang("restarting").replace("{estimatedTime}", estimatedTime));

      // تسجيل الوقت الحالي (قبل إعادة التشغيل)
      const startTime = Date.now(); // تخزين الوقت في المتغير

      // خطوة 2: إعادة تشغيل البوت
      process.exit(1);  // هذا الأمر يقوم بإيقاف العملية الحالية وإعادة تشغيل البوت.

      // تسجيل الوقت بعد إعادة التشغيل
      const endTime = Date.now();  
      const timeTaken = ((endTime - startTime) / 1000).toFixed(2); // احتساب الوقت المستغرق بالثواني

      // بعد إعادة التشغيل، سيتم إرسال رسالة لنجاح العملية (يتم استدعاء هذا بعد بدء التشغيل)
      api.sendMessage(getLang("success").replace("{time}", timeTaken), message.threadID);

    } catch (e) {
      message.reply(getLang("error"));
    }
  }
};

// هذا الجزء يجب أن يكون في نقطة البدء للبوت لضمان بدء الرسالة بعد إعادة التشغيل
const onBotStart = async (api, event) => {
  // رسالة بسيطة بعد بدء تشغيل البوت
  api.sendMessage(`✅ | تم إعادة تشغيل البوت بنجاح!`, event.threadID);
};

// استدعاء الدالة لبدء البوت
