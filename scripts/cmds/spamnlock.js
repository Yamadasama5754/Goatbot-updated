const { getTime } = global.utils;

let autobanEnabled = true;
let sensitiveWords = ["شاذ", "زبي", "قحبة", "بوت فاشل", "بوت خرا", "بوت غبي", "بوت حمار", "فاشل", "قود", "بوت كرنج"];

module.exports = {
    config: {
        name: "حضر",
        version: "1.6",
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
            en: "الأوامر:\n- الحظر تشغيل/إيقاف\n- الحظر قائمة\n- الحظر إضافة [كلمة]\n- الحظر إزالة [كلمة]\n- الحظر مسح"
        },
        commands: [
            {
                command: "تشغيل",
                description: {
                    en: "تشغيل حضر الكلمات نابية"
                }
            },
            {
                command: "إيقاف",
                description: {
                    en: "إيقاف حضر الكلمات نابية"
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
            },
            {
                command: "مسح",
                description: {
                    en: "مسح جميع الكلمات النابية من القائمة"
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
                message.reply("✅ | تم تفعيل حضر الكلمات نابية");
                break;

            case "إيقاف":
                autobanEnabled = false;
                message.reply("❌ | تم تعطيل حضر الكلمات نابية");
                break;

            case "إضافة": {
                const wordsToAdd = args.slice(1).join(" ");
                if (!wordsToAdd) return message.reply("⚠️ | يرجى تحديد الكلمات التي تريد إضافتها.");

                const wordsArray = wordsToAdd.split(/,\s*/);
                wordsArray.forEach(word => {
                    if (!sensitiveWords.includes(word.toLowerCase())) {
                        sensitiveWords.push(word.toLowerCase());
                    }
                });
                message.reply(`✅ | تم إضافة الكلمات: "${wordsArray.join(', ')}" إلى القائمة.`);
                break;
            }

            case "إزالة": {
                const wordsToRemove = args.slice(1).join(" ");
                if (!wordsToRemove) return message.reply("⚠️ | يرجى تحديد الكلمات التي تريد إزالتها.");

                const wordsArray = wordsToRemove.split(/,\s*/);
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

            case "مسح":
                sensitiveWords = [];
                message.reply("✅ | تم مسح جميع الكلمات النابية من القائمة.");
                break;

            default:
                return message.reply("⚠️ | أمر غير معروف. يرجى استخدام الأوامر الصحيحة.");
        }
    },

    onChat: async function ({ event, message, usersData }) {
        if (!autobanEnabled) return;

        const content = event.body.toLowerCase();
        const containsSensitiveWord = sensitiveWords.some(word => content.includes(word));

        if (containsSensitiveWord) {
            const uid = event.senderID;

            // لا تطرد إذا كان المستخدم هو صاحب المعرف المحدد
            if (uid === "100092990751389") return;

            const userData = await usersData.get(uid);
            const name = userData.name || "المستخدم";

            // تحقق مما إذا كان البوت أدمن في المجموعة
            if (!event.isGroup) {
                message.reply("⚠️ | المرجو إعطاء البوت صلاحيات الأدمن ليقوم بطرد المخالفين.");
            } else if (event.isGroup && event.adminIDs && event.adminIDs.includes(global.data.botID)) {
                try {
                    message.reply(`❌ | ${name} تم طرده لاستخدامه كلمات غير لائقة.`);
                    await message.removeParticipant(uid);
                } catch (error) {
                    message.reply(`⚠️ | حدث خطأ أثناء محاولة طرد ${name}.`);
                    console.error(`Error removing participant ${uid}:`, error);
                }
            } else {
                message.reply("⚠️ | لا يمكنني طرد المستخدمين. يرجى إعطائي صلاحيات الأدمن.");
            }
        }
    }
};
