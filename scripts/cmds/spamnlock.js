const { getTime } = global.utils;

let autobanEnabled = true;
let sensitiveWords = ["شاذ", "زبي", "قحبة", "بوت فاشل", "بوت خرا", "بوت غبي", "بوت حمار", "فاشل", "قود", "بوت كرنج"];

module.exports = {
    config: {
        name: "الحظر",
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
                    en: "إضافة كلمات نابية"
                }
            },
            {
                command: "إزالة",
                description: {
                    en: "إزالة كلمات نابية"
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
                const wordsToAdd = args.slice(1).join(" "); // استخدام join لدمج الكلمات في جملة واحدة
                if (!wordsToAdd) return message.reply("⚠️ | يرجى تحديد الكلمات التي تريد إضافتها.");

                const wordsArray = wordsToAdd.split(/,\s*/); // تقسيم الكلمات باستخدام فاصلة
                wordsArray.forEach(word => {
                    if (!sensitiveWords.includes(word.toLowerCase())) {
                        sensitiveWords.push(word.toLowerCase());
                    }
                });
                message.reply(`✅ | تم إضافة الكلمات: "${wordsArray.join(', ')}" إلى القائمة.`);
                break;
            }

            case "إزالة": {
                const wordsToRemove = args.slice(1).join(" "); // استخدام join لدمج الكلمات في جملة واحدة
                if (!wordsToRemove) return message.reply("⚠️ | يرجى تحديد الكلمات التي تريد إزالتها.");

                const wordsArray = wordsToRemove.split(/,\s*/); // تقسيم الكلمات باستخدام فاصلة
                let removedWords = [];
                wordsArray.forEach(word => {
                    const index = sensitiveWords.indexOf(word.toLowerCase());
                    if (index > -1) {
                        sensitiveWords.splice(index, 1);
                        removedWords.push(word);
                    }
                });

                if (removedWords.length > 0) {
                    message.reply(`✅ | تم إزالة الكلمات: "${removedWords.join(', ')}" من القائمة.`);
                } else {
                    message.reply(`❌ | لم يتم العثور على أي كلمات في القائمة.`);
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
