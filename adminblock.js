const fs = require("fs-extra");
const { config } = global.GoatBot;
const { client } = global;

module.exports = {
	config: {
		name: "المطور_فقط",
		aliases: ["block", "فقط_المطور", "تقييد"],
		version: "1.2",
		author: "Deadlin Ackerman",
		countDown: 5,
		role: 2,
		shortDescription: {
			vi: "bật/tắt chỉ admin sử dụng bot",
			en: "تفعيل✅/تعطيل❌"
		},
		longDescription: {
			vi: "bật/tắt chế độ chỉ admin mới có thể sử dụng bot",
			en: "تفعيل✅/تعطيل❌ "
		},
		category: "المالك",
		guide: {
			en: "{pn} [تفعيل ✅| تعطيل❌]"
		}
	},

	langs: {
		vi: {
			turnedOn: "Đã bật chế độ chỉ admin mới có thể sử dụng bot",
			turnedOff: "Đã tắt chế độ chỉ admin mới có thể sử dụng bot",
			syntaxError: "Sai cú pháp, chỉ có thể dùng {pn} on hoặc {pn} off"
		},
		en: {
			turnedOn: "✅| تم تغعيل مي المطور_فقط إستخدام البوت !",
			turnedOff: "✅| تم تعطيل المطور_فقط إستخدام البوت !",
			syntaxError: "هناك خطأ في بناء الجملة, إستخدم {pn} تفعيل✅ {pn} تعطيل ❌"
		}
	},

	onStart: function ({ args, message, getLang  }) {
		if (args[0] == "تشغيل") {
			config.adminOnly.enable = true;
			message.reply(getLang("turnedOn"));
			fs.writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
		}
		else if (args[0] == "ايقاف") {
			config.adminOnly.enable = false;
			message.reply(getLang("turnedOff"));
			fs.writeFileSync(client.dirConfig, JSON.stringify(config, null, 2));
		}
		else
			return message.reply(getLang("syntaxError"));
	}
};
