module.exports = {
  config: {
    name: "اعادة_تشغيل",
    aliases: ["restart","رستارت", "رست"],
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

      // سيتم تجاهل الكود أدناه لأن العملية ستخرج
    } catch (e) {
      message.reply(getLang("error"));
    }
  }
};

// يجب أن يتم استدعاء هذا الجزء بعد أن يتم بدء تشغيل البوت
const onBotStart = async (api, threadID) => {
  const endTime = Date.now();
  const timeTaken = 1; // وقت ثابت هنا بسبب قلة الدقة

  // إرسال رسالة من البوت بعد بدء التشغيل
  api.sendMessage(`✅ | تم إعادة تشغيل البوت بنجاح!`, threadID);
};

// تأكد من استدعاء دالة onBotStart بعد بدء التشغيل الفعلي للبوت
