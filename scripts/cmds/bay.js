const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");
module.exports = {
	config: {
		name: "غادري",
		aliases: ["اخرجي"],
		version: "1.0",
		author: "Sandy",
		countDown: 5,
		role: 2,
		shortDescription: "البوت سوف يترك المجموعة",
		longDescription: "",
		category: "المالك",
		guide: {
			vi: "{pn} [tid,blank]",
			en: "{pn} [تيد,فارغ]"
		}
	},

	onStart: async function ({ api,event,args, message }) {
 var id;
 if (!args.join(" ")) {
 id = event.threadID;
 } else {
 id = parseInt(args.join(" "));
 }
 return api.sendMessage('وداعا يا أصدقاء ليس بيدي لكن المالك أراد أن أغادر وداعا إعتنو بأنفسكم 🙂🫶🩷', id, () => api.removeUserFromGroup(api.getCurrentUserID(), id))
		}
	};
