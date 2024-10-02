let autobanEnabled = true;  // تفعيل أو تعطيل خاصية الطرد التلقائي
let sensitiveWords = ["شاذ", "زبي", "قحبة", "بوت فاشل", "بوت خرا", "بوت غبي", "بوت حمار", "فاشل", "قود", "بوت كرنج"];  // الكلمات النابية الافتراضية

module.exports = {
    config: {
        name: "حضر",  // اسم الأمر
        version: "1.1",
        author: "Samir",
        countDown: 5,
        role: 2,
        shortDescription: {
            en: "حظر تلقائي للمستخدمين",
        },
        longDescription: {
            en: "أمر يقوم بطرد المستخدمين تلقائيًا إذا استخدموا كلمات نابية"
        },
        category: "إدارة",
        guide: {
            en: "الأوامر:\n- الحظر تشغيل/إيقاف\n- الحظر قائمة\n- الحظر إضافة [كلمة]\n- الحظر إزالة [كلمة]\n- الحظر مسح"
        },
        commands: [
            {
                command: "تشغيل",
                description: {
                    en: "تشغيل حضر الكلمات النابية"
                }
            },
            {
                command: "إيقاف",
                description: {
                    en: "إيقاف حضر الكلمات النابية"
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

    onStart: async function ({ args, message, event }) {
        const command = args[0];
        switch (command) {
            case "تشغيل":
                autobanEnabled = true;
                return message.reply("✅ | تم تفعيل حضر الكلمات النابية بنجاح.");
            
            case "إيقاف":
                autobanEnabled = false;
                return message.reply("❌ | تم تعطيل حضر الكلمات النابية.");
            
            case "إضافة": {
                const wordsToAdd = args.slice(1).join(" ");
                if (!wordsToAdd) return message.reply("⚠️ | يرجى تحديد الكلمات التي تريد إضافتها.");

                const wordsArray = wordsToAdd.split(/,\s*/);
                wordsArray.forEach(word => {
                    if (!sensitiveWords.includes(word.toLowerCase())) {
                        sensitiveWords.push(word.toLowerCase());
                    }
                });
                return message.reply(`✅ | تم إضافة الكلمات: "${wordsArray.join(', ')}" إلى قائمة الكلمات النابية.`);
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
                    return message.reply(`✅ | تم إزالة الكلمات: "${removedWords.join(', ')}" من القائمة.`);
                } else {
                    return message.reply(`❌ | لم يتم العثور على أي كلمات في القائمة.`);
                }
            }
            
            case "قائمة":
                const wordList = sensitiveWords.length > 0 ? sensitiveWords.join(", ") : "لا توجد كلمات نابية مضافة.";
                return message.reply(`📜 | قائمة الكلمات النابية: ${wordList}`);
            
            case "مسح":
                sensitiveWords = [];
                return message.reply("✅ | تم مسح جميع الكلمات النابية من القائمة.");
            
            default:
                return message.reply("⚠️ | أمر غير معروف. يرجى استخدام الأوامر الصحيحة.");
        }
    },

    onChat: async function ({ event, message, usersData }) {
        if (!autobanEnabled) return;  // إذا كانت الخاصية معطلة، لا تفعل شيئًا

        const content = event.body.toLowerCase();

        // استخدم Regular Expressions للتحقق من وجود كلمات نابية
        const containsSensitiveWord = sensitiveWords.some(word => {
            const wordPattern = new RegExp(`\\b${word}\\b`, 'i');  // البحث عن الكلمة بشكل دقيق
            return wordPattern.test(content);
        });

        if (containsSensitiveWord) {
            const uid = event.senderID;

            // تجاهل الطرد للمستخدمين المحددين (مثل مالك البوت)
            if (uid === "100092990751389") return;

            const userData = await usersData.get(uid);
            const name = userData.name || "المستخدم";

            // تحقق مما إذا كان البوت أدمن في المجموعة
            if (!event.isGroup) {
                return message.reply("⚠️ | المرجو إعطاء البوت صلاحيات الأدمن ليقوم بطرد المخالفين.");
            } else if (event.isGroup && event.adminIDs && event.adminIDs.map(admin => admin.id).includes(global.data.botID)) {
                try {
                    message.reply(`❌ | ${name} تم طرده لاستخدامه كلمات غير لائقة.`);
                    await message.removeParticipant(uid);  // طرد المستخدم
                } catch (error) {
                    message.reply(`⚠️ | حدث خطأ أثناء محاولة طرد ${name}.`);
                    console.error(`Error removing participant ${uid}:`, error);
                }
            } else {
                return message.reply("⚠️ | لا يمكنني طرد المستخدمين. يرجى إعطائي صلاحيات الأدمن.");
            }
        }
    }
};
