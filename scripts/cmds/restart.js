const fs = require("fs").promises;

module.exports = {
    config: {
        name: "إعادة_تشغيل",
        aliases: ["restart", "إعادة تشغيل", "ريستارت"],
        version: "1.2",
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
            // تسجيل بدء إعادة التشغيل
            await message.reply(getLang("restarting"));

            // حفظ حالة إعادة التشغيل في ملف
            const rebootData = {
                threadID: message.threadID,
                timestamp: Date.now()
            };
            await fs.writeFile('reboot.json', JSON.stringify(rebootData, null, 4));

            // إعادة تشغيل البوت
            process.exit(1); // هذا يقوم بإيقاف العملية الحالية وإعادة تشغيل البوت

        } catch (e) {
            message.reply(getLang("error"));
        }
    }
};

// دالة لتفقد ملف إعادة التشغيل عند بدء البوت
const checkRebootFile = async (api) => {
    try {
        const rebootData = await fs.readFile('reboot.json', 'utf8');
        const { threadID, timestamp } = JSON.parse(rebootData);

        // احتساب الوقت المستغرق منذ إعادة التشغيل
        const timeTaken = ((Date.now() - timestamp) / 1000).toFixed(2);

        // إرسال رسالة تأكيد أن البوت قد أُعيد تشغيله
        await api.sendMessage(`✅ | تم إعادة تشغيل البوت بنجاح! الوقت المستغرق: ${timeTaken} ثانية.`, threadID);

        // حذف ملف إعادة التشغيل بعد إرسال الرسالة
        await fs.unlink('reboot.json');
    } catch (error) {
        // لا يوجد ملف أو حدث خطأ في القراءة
        console.error("لم يتم العثور على ملف إعادة التشغيل أو حدث خطأ:", error.message);
    }
};

// استدعاء الدالة عند بدء تشغيل البوت
checkRebootFile(api);
