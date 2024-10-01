let commandsRole = {}; // تخزين دور كل أمر

module.exports = {
    config: {
        name: "الدور",
        version: "1.0",
        author: "yamada",
        countDown: 5,
        role: 2,  // 2 للمطورين
        shortDescription: {
            en: "تعديل دور الأوامر"
        },
        longDescription: {
            en: "هذا الأمر يسمح لك بتغيير دور أمر معين (عضو، أدمن، أو مطور) أو إعادته إلى حالته الأصلية"
        },
        category: "الإدارة",
        guide: {
            en: "الأوامر:\n- {pn} [اسم_الأمر] [0/1/2]: لتغيير الدور.\n- {pn} [اسم_الأمر] الأصل: لإعادة الدور للحالة الأصلية."
        }
    },

    langs: {
        en: {
            roleUpdated: "✅ | تم تعديل دور الأمر '{commandName}' إلى {roleName}.",
            roleReset: "🔄 | تم إعادة الأمر '{commandName}' إلى دوره الأصلي.",
            nonChangeable: "❌ | الأمر '{commandName}' غير قابل لتغيير دوره.",
            commandNotFound: "❌ | الأمر '{commandName}' غير موجود.",
            invalidRole: "⚠️ | يرجى اختيار دور صحيح: 0 (للأعضاء)، 1 (لأدمن الكروب)، أو 2 (للمطورين).",
            missingArgs: "⚠️ | يرجى تحديد اسم الأمر والدور الذي تريد تغييره."
        }
    },

    onStart: async function ({ args, message, getLang, commands }) {
        const commandName = args[0]; // اسم الأمر
        const roleType = args[1]; // الدور: 0، 1، 2، أو "الأصل"

        if (!commandName || !roleType) {
            return message.reply(getLang("missingArgs"));
        }

        const command = commands.get(commandName); // الحصول على تفاصيل الأمر
        if (!command) {
            return message.reply(getLang("commandNotFound").replace("{commandName}", commandName));
        }

        // التأكد مما إذا كان يمكن تغيير دور الأمر
        if (command.config.role === "غير قابل للتغيير") {
            return message.reply(getLang("nonChangeable").replace("{commandName}", commandName));
        }

        if (roleType === "الأصل") {
            if (commandsRole[commandName]) {
                delete commandsRole[commandName]; // حذف التعديل وإعادة الأمر لدوره الأصلي
                command.config.role = command.config.originalRole; // إرجاع الدور الأصلي
                return message.reply(getLang("roleReset").replace("{commandName}", commandName));
            }
        } else {
            let newRole;
            switch (roleType) {
                case "0":
                    newRole = 0; // للأعضاء
                    break;
                case "1":
                    newRole = 1; // لأدمن الكروب
                    break;
                case "2":
                    newRole = 2; // للمطورين
                    break;
                default:
                    return message.reply(getLang("invalidRole"));
            }

            commandsRole[commandName] = newRole; // تخزين الدور الجديد
            command.config.role = newRole; // تعديل دور الأمر
            const roleNames = ["الأعضاء", "أدمن الكروب", "المطورين"];
            return message.reply(getLang("roleUpdated")
                .replace("{commandName}", commandName)
                .replace("{roleName}", roleNames[newRole]));
        }
    }
};
