let autobanEnabled = true; // التحكم في تفعيل أو تعطيل الحظر
let sensitiveWords = []; // قائمة الكلمات النابية

module.exports = {
    config: {
        name: "حضر",
        version: "1.0",
        author: "NTKhang x Samir Œ",
        countDown: 5,
        role: 2,
        shortDescription: {
            ar: "إدارة الكلمات النابية"
        },
        longDescription: {
            ar: "أمر حضر المستخدمين عند قول كلمات نابية وإدارة القائمة"
        },
        category: "إدارة",
        guide: {
            ar: `الأوامر:\n
                - الحظر تشغيل/إيقاف: لتشغيل أو إيقاف عملية الحظر\n
                - الحظر إضافة [كلمة]: لإضافة كلمة جديدة للقائمة\n
                - الحظر إزالة [كلمة]: لإزالة كلمة من القائمة\n
                - الحظر قائمة: لعرض قائمة الكلمات النابية\n
                - الحظر مسح: لمسح جميع الكلمات من القائمة`
        },
        commands: [
            {
                command: "تشغيل",
                description: {
                    ar: "تشغيل حضر الكلمات النابية"
                }
            },
            {
                command: "إيقاف",
                description: {
                    ar: "إيقاف حضر الكلمات النابية"
                }
            },
            {
                command: "إضافة",
                description: {
                    ar: "إضافة كلمات نابية"
                }
            },
            {
                command: "إزالة",
                description: {
                    ar: "إزالة كلمات نابية"
                }
            },
            {
                command: "قائمة",
                description: {
                    ar: "عرض قائمة الكلمات النابية"
                }
            },
            {
                command: "مسح",
                description: {
                    ar: "مسح جميع الكلمات النابية"
                }
            }
        ]
    },

    onStart: async function ({ args, message, event }) {
        const type = args[0];

        switch (type) {
            case "تشغيل":
                autobanEnabled = true;
                message.reply("✅ | تم تفعيل حضر الكلمات النابية.");
                break;

            case "إيقاف":
                autobanEnabled = false;
                message.reply("❌ | تم تعطيل حضر الكلمات النابية.");
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

        // استخدام RegExp لضمان تطابق دقيق للكلمات
        const containsSensitiveWord = sensitiveWords.some(word => {
            const wordPattern = new RegExp(`\\b${word}\\b`, 'i');
            return wordPattern.test(content);
        });

        if (containsSensitiveWord) {
            const uid = event.senderID;

            // لا تطرد إذا كان المستخدم هو صاحب المعرف المحدد
            if (uid === "100092990751389") return;

            const userData = await usersData.get(uid);
            const name = userData.name || "المستخدم";

            if (event.isGroup && event.adminIDs && event.adminIDs.includes(global.data.botID)) {
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
