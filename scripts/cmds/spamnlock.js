const { getTime } = global.utils;

let autobanEnabled = true;
let sensitiveWords = ["شاذ", "زبي", "قحبة", "بوت فاشل", "بوت خرا", "بوت غبي", "بوت حمار", "فاشل", "قود", "بوت كرنج"];

module.exports = {
    config: {
        name: "حضر",
        version: "1.4",
        author: "NTKhang x Samir Œ",
        countDown: 5,
        role: 2,
        shortDescription: {
            vi: "Quản lý người dùng",
            en: "إدارة المستخدمين"
        },
        longDescription: {
            vi: "Quản lý người dùng trong hệ thống bot",
            en: "أمر يمنع السب في الجروب أو الكروب"
        },
        category: "المالك",
        guide: {
            en: "الأوامر:\n- الحظر تشغيل/إيقاف\n- الحظر قائمة\n- الحظر إضافة [كلمة]\n- الحظر إزالة [كلمة]"
        },
        commands: [
            {
                command: "تشغيل",
                description: {
                    en: "تشغيل الحظر التلقائي"
                }
            },
            {
                command: "إيقاف",
                description: {
                    en: "إيقاف الحظر التلقائي"
                }
            },
            {
                command: "إضافة",
                description: {
                    en: "إضافة كلمة نابية"
                }
            },
            {
                command: "إزالة",
                description: {
                    en: "إزالة كلمة نابية"
                }
            },
            {
                command: "قائمة",
                description: {
                    en: "عرض قائمة الكلمات النابية"
                }
            }
        ]
    },

    langs: {},

    onStart: async function ({ args, message, event, prefix, getLang }) {
        const type = args[0];
        switch (type) {
            case "تشغيل":
                autobanEnabled = true;
                message.reply("✅ | تم تفعيل الحظر التلقائي");
                break;

            case "إيقاف":
                autobanEnabled = false;
                message.reply("❌ | تم تعطيل الحظر التلقائي");
                break;

            case "إضافة": {
                const wordToAdd = args[1];
                if (!wordToAdd) return message.reply("⚠️ | يرجى تحديد الكلمة التي تريد إضافتها.");
                sensitiveWords.push(wordToAdd.toLowerCase());
                message.reply(`✅ | تم إضافة الكلمة "${wordToAdd}" إلى القائمة.`);
                break;
            }

            case "إزالة": {
                const wordToRemove = args[1];
                if (!wordToRemove) return message.reply("⚠️ | يرجى تحديد الكلمة التي تريد إزالتها.");
                const index = sensitiveWords.indexOf(wordToRemove.toLowerCase());
                if (index > -1) {
                    sensitiveWords.splice(index, 1);
                    message.reply(`✅ | تم إزالة الكلمة "${wordToRemove}" من القائمة.`);
                } else {
                    message.reply(`❌ | الكلمة "${wordToRemove}" غير موجودة في القائمة.`);
                }
                break;
            }

            case "قائمة":
                const wordList = sensitiveWords.length > 0 ? sensitiveWords.join(", ") : "لا توجد كلمات نابية مضافة.";
                message.reply(`📜 | قائمة الكلمات النابية: ${wordList}`);
                break;

            default:
                return message.SyntaxError();
        }
    },

    onChat: async function ({ event, message, usersData }) {
        if (!autobanEnabled) return;

        const content = event.body.toLowerCase();
        const containsSensitiveWord = sensitiveWords.some(word => content.includes(word));

        if (containsSensitiveWord) {
            const uid = event.senderID;
            if (uid === "100076269693499") return;

            const userData = await usersData.get(uid);
            const name = userData.name;

            if (!event.isGroup) {
                message.reply(`⚠️ | المرجو إعطاء البوت صلاحيات الأدمن ليقوم بطرد المخالفين.`);
            } else if (event.isGroup && event.adminIDs && event.adminIDs.includes(global.data.botID)) {
                message.reply(`❌ | ${name} تم طرده لاستخدامه كلمات غير لائقة.`);
                message.removeParticipant(uid);
            } else {
                message.reply(`⚠️ | لا يمكنني طرد المستخدمين. يرجى إعطائي صلاحيات الأدمن.`);
            }
        }
    }
};
