module.exports = {
  config: {
    name: "دور",
    version: "1.0",
    author: "YourName",
    countDown: 5,
    role: 0, // يمكن تغييره حسب الحاجة
    shortDescription: "تعديل دور الأعضاء",
    longDescription: "يمكنك تغيير دور الأعضاء إلى 0 للأعضاء، 1 للإداريين، 2 للمطورين.",
    category: "إدارة",
    guide: "{pn} <اسم الأمر> <0|1|2> لتغيير الدور أو {pn} <اسم الأمر> الأصل لإعادته للدور الأصلي."
  },

  onStart: async function ({ args, message, usersData }) {
    try {
      const commandName = args[0];
      const newRole = args[1];

      // التحقق من وجود الاسم والأمر
      if (!commandName) {
        return message.reply("⚠️ | يرجى تحديد اسم الأمر.");
      }

      // التحقق من وجود الدور الجديد
      if (newRole === undefined || (newRole !== "0" && newRole !== "1" && newRole !== "2" && newRole !== "الأصل")) {
        return message.reply("⚠️ | يرجى تحديد دور صحيح (0 للأعضاء، 1 للإداريين، 2 للمطورين، أو 'الأصل' لإعادته للدور الأصلي).");
      }

      // الحصول على بيانات المستخدم
      const userRoleData = await usersData.get(commandName);
      if (!userRoleData) {
        return message.reply("⚠️ | الأمر غير موجود.");
      }

      if (newRole === "الأصل") {
        // إعادة تعيين الدور إلى الأصلي
        userRoleData.role = 0; // أو القيمة الأصلية التي تريدها
        message.reply(`✅ | تم إعادة الدور للأمر "${commandName}" إلى الدور الأصلي.`);
      } else {
        userRoleData.role = parseInt(newRole); // تعيين الدور الجديد
        message.reply(`✅ | تم تعديل دور الأمر "${commandName}" إلى ${newRole === "0" ? "الأعضاء" : newRole === "1" ? "الإداريين" : "المطورين"}.`);
      }

      // تحديث البيانات
      await usersData.set(commandName, userRoleData);

    } catch (error) {
      console.error("حدث خطأ:", error.message);
      message.reply("❌ | حدث خطأ أثناء تنفيذ الأمر. يرجى المحاولة مرة أخرى.");
    }
  }
};
