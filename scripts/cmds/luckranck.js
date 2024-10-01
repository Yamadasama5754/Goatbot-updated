let roles = {
    admin: "admin",  // دور المشرف
    member: "member", // دور الأعضاء
    developer: "developer" // دور المطور
};

let defaultRole = roles.member; // الدور الافتراضي

module.exports = {
    config: {
        name: "الدور",
        version: "1.0",
        author: "YourName",
        countDown: 5,
        role: 2, // 2 يعني المطور فقط
        shortDescription: {
            en: "تغيير الدور",
        },
        longDescription: {
            en: "استخدم الأمر لتغيير دور المستخدمين.",
        },
        category: "الإدارة",
        guide: {
            en: "{pn} [اسم الأمر] [0|1|2]: لتغيير دور الأمر.\n{pn} [اسم الأمر] reset: لإعادة الأمر للدور الافتراضي."
        }
    },

    onStart: async function ({ args, message, getLang }) {
        const commandName = args[0];
        const newRole = args[1];

        try {
            if (!commandName) {
                return message.reply("⚠️ | يرجى تحديد اسم الأمر.");
            }

            if (newRole === "reset") {
                // إعادة الأمر للدور الافتراضي
                message.reply(`✅ | تم إعادة الدور للأمر "${commandName}" إلى الدور الافتراضي.`);
                // هنا يمكنك إضافة الكود لإعادة تعيين الدور في حال كان لديك تخزين للدور
                return;
            }

            const roleNumber = parseInt(newRole, 10);

            // التحقق من قيمة الدور الجديدة
            if (![0, 1, 2].includes(roleNumber)) {
                return message.reply("⚠️ | الدور غير صحيح. استخدم 0 للأعضاء، 1 للمشرفين، 2 للمطورين.");
            }

            let roleMessage;

            switch (roleNumber) {
                case 0:
                    roleMessage = "الأعضاء";
                    break;
                case 1:
                    roleMessage = "المشرفين";
                    break;
                case 2:
                    roleMessage = "المطورين";
                    break;
            }

            message.reply(`✅ | تم تعديل الدور للأمر "${commandName}" إلى ${roleMessage}.`);
            // هنا يمكنك إضافة الكود لتحديث الدور في حال كان لديك تخزين للدور

        } catch (error) {
            console.error("حدث خطأ أثناء تنفيذ الأمر:", error);
            message.reply("❌ | حدث خطأ أثناء تنفيذ الأمر. يرجى المحاولة مرة أخرى.");
        }
    }
};
