const axios = require('axios');

// config 
const apiKey = "";
const maxTokens = 500;
const numberGenerateImage = 4;
const maxStorageMessage = 4;

if (!global.temp.openAIUsing)
	global.temp.openAIUsing = {};
if (!global.temp.openAIHistory)
	global.temp.openAIHistory = {};

const { openAIUsing, openAIHistory } = global.temp;

module.exports = {
	config: {
		name: "gpt",
		version: "1.4",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		description: {
			vi: "GPT chat",
			en: "تكلم مع gpt-3"
		},
		category: "box chat",
		guide: {
			vi: "   {pn} <draw> <nội dung> - tạo hình ảnh từ nội dung"
				+ "\n   {pn} <clear> - xóa lịch sử chat với gpt"
				+ "\n   {pn} <nội dung> - chat với gpt",
			en: "   {pn} <draw> <content> - create image from content"
				+ "\n   {pn} <clear> - clear chat history with gpt"
				+ "\n   {pn} <content> - chat with gpt"
		}
	},

	langs: {
		vi: {
			apiKeyEmpty: "Vui lòng cung cấp api key cho openai tại file scripts/cmds/gpt.js",
			invalidContentDraw: "Vui lòng nhập nội dung bạn muốn vẽ",
			yourAreUsing: "Bạn đang sử dụng gpt chat, vui lòng chờ quay lại sau khi yêu cầu trước kết thúc",
			processingRequest: "Đang xử lý yêu cầu của bạn, quá trình này có thể mất vài phút, vui lòng chờ",
			invalidContent: "Vui lòng nhập nội dung bạn muốn chat",
			error: "Đã có lỗi xảy ra\n%1",
			clearHistory: "Đã xóa lịch sử chat của bạn với gpt"
		},
		en: {
			apiKeyEmpty: "يرجى تقديم مفتاح API لـ openai على ملف scripts/cmds/gpt.js",
			invalidContentDraw: "الرجاء إدخال المحتوى الذي تريد رسمه",
			yourAreUsing: "أنت تستخدم دردشة gpt، يرجى الانتظار حتى انتهاء الطلب السابق",
			processingRequest: "جاري معالجة طلبك، قد تستغرق هذه العملية بضع دقائق، يرجى الانتظار",
			invalidContent: "الرجاء إدخال المحتوى الذي تريد الدردشة",
			error: "لقد حدث خطأ\n%1",
			clearHistory: "لقد تم حذف سجل الدردشة الخاص بك مع gpt"
		}
	},

	onStart: async function ({ message, event, args, getLang, prefix, commandName }) {
		if (!apiKey)
			return message.reply(getLang('apiKeyEmpty', prefix));

		switch (args[0]) {
			case 'صورة':
			case 'الصورة':
			case 'image': {
				if (!args[1])
					return message.reply(getLang('invalidContentDraw'));
				if (openAIUsing[event.senderID])
					return message.reply(getLang("yourAreUsing"));

				openAIUsing[event.senderID] = true;

				let sending;
				try {
					sending = message.reply(getLang('processingRequest'));
					const responseImage = await axios({
						url: "https://api.openai.com/v1/images/generations",
						method: "POST",
						headers: {
							"Authorization": `Bearer ${apiKey}`,
							"Content-Type": "application/json"
						},
						data: {
							prompt: args.slice(1).join(' '),
							n: numberGenerateImage,
							size: '1024x1024'
						}
					});
					const imageUrls = responseImage.data.data;
					const images = await Promise.all(imageUrls.map(async (item) => {
						const image = await axios.get(item.url, {
							responseType: 'stream'
						});
						image.data.path = `${Date.now()}.png`;
						return image.data;
					}));
					return message.reply({
						attachment: images
					});
				}
				catch (err) {
					const errorMessage = err.response?.data.error.message || err.message;
					return message.reply(getLang('error', errorMessage || ''));
				}
				finally {
					delete openAIUsing[event.senderID];
					message.unsend((await sending).messageID);
				}
			}
			case 'clear': {
				openAIHistory[event.senderID] = [];
				return message.reply(getLang('clearHistory'));
			}
			default: {
				if (!args[0])
					return message.reply(getLang('invalidContent'));

				handleGpt(event, message, args, getLang, commandName);
			}
		}
	},

	onReply: async function ({ Reply, message, event, args, getLang, commandName }) {
		const { author } = Reply;
		if (author != event.senderID)
			return;

		handleGpt(event, message, args, getLang, commandName);
	}
};

async function askGpt(event) {
	const response = await axios({
		url: "https://api.openai.com/v1/chat/completions",
		method: "POST",
		headers: {
			"Authorization": `Bearer ${apiKey}`,
			"Content-Type": "application/json"
		},
		data: {
			model: "gpt-3.5-turbo",
			messages: openAIHistory[event.senderID],
			max_tokens: maxTokens,
			temperature: 0.7
		}
	});
	return response;
}

async function handleGpt(event, message, args, getLang, commandName) {
	try {
		openAIUsing[event.senderID] = true;

		if (
			!openAIHistory[event.senderID] ||
			!Array.isArray(openAIHistory[event.senderID])
		)
			openAIHistory[event.senderID] = [];

		if (openAIHistory[event.senderID].length >= maxStorageMessage)
			openAIHistory[event.senderID].shift();

		openAIHistory[event.senderID].push({
			role: 'user',
			content: args.join(' ')
		});

		const response = await askGpt(event);
		const text = response.data.choices[0].message.content;

		openAIHistory[event.senderID].push({
			role: 'assistant',
			content: text
		});

		return message.reply(text, (err, info) => {
			global.GoatBot.onReply.set(info.messageID, {
				commandName,
				author: event.senderID,
				messageID: info.messageID
			});
		});
	}
	catch (err) {
		const errorMessage = err.response?.data.error.message || err.message || "";
		return message.reply(getLang('error', errorMessage));
	}
	finally {
		delete openAIUsing[event.senderID];
	}
            }
