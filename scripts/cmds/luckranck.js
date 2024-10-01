module.exports = {
    config: {
        name: "الدور",
        version: "1.0",
        author: "YourName",
        countDown: 5,
        role: 2,
        shortDescription: "تغيير دور الأمر",
        longDescription: "قم بتغيير دور الوصول إلى الأوامر إلى الأعضاء، الأدمن أو المطورين",
        category: "إدارة",
        guide: "الدور [اسم الأمر] [0/1/2/الأصل]"
    },

    onStart: async function ({ args, event, message, commands, getLang, threadsData }) {
        try {
            // تحقق من وجود المدخلات المطلوبة
            if (args.length < 2) {
                return message.reply("⚠️ | يرجى تحديد اسم الأمر والدور.");
            }

            const commandName = args[0];
            const newRole = args[1];

            // تحقق مما إذا كان الأمر موجودًا
            const command = commands.get(commandName);
            if (!command) {
                return message.reply(`❌ | الأمر "${commandName}" غير موجود.`);
            }

            // تأكد من أن الدور صالح (0 للأعضاء، 1 للأدمن، 2 للمطور)
            const validRoles = ["0", "1", "2", "الأصل"];
            if (!validRoles.includes(newRole)) {
                return message.reply("⚠️ | يرجى اختيار دور صحيح (0: الأعضاء، 1: الأدمن، 2: المطور، أو الأصل).");
            }

            // إذا كان الدور "الأصل"، إعادة الدور إلى الدور الأصلي المخزن في config
            if (newRole === "الأصل") {
                command.config.role = command.config.originalRole || 0;
                return message.reply(`🔄 | تم إعادة الدور الأصلي للأمر "${commandName}".`);
            }

            // تعديل الدور
            if (!command.config.originalRole) {
                // حفظ الدور الأصلي إن لم يكن محفوظًا
                command.config.originalRole = command.config.role;
            }

            // تعيين الدور الجديد
            command.config.role = parseInt(newRole);

            let roleText = "";
            switch (newRole) {
                case "0":
                    roleText = "الأعضاء";
                    break;
                case "1":
                    roleText = "الأدمن";
                    break;
                case "2":
                    roleText = "المطور";
                    break;
            }

            return message.reply(`✅ | تم تعديل دور الأمر "${commandName}" إلى ${roleText}.`);

        } catch (error) {
            console.error("Error in command 'الدور':", error);
            return message.reply("❌ | حدث خطأ أثناء محاولة تغيير الدور.");
        }
    }
};
