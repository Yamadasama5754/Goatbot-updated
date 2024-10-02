const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
 config: {
 name: "تطقيم",
 aliases: ["coupledp"],
 version: "1.0",
 author: "ArYAN",
 countDown: 5,
 role: 0,
 shortDescription: {
 en: "تطقيمات"
 },
 longDescription: {
 en: "تطقيمات"
 },
 category: "متعة",
 guide: {
 en: "{pn}"
 }
 },

 onStart: async function ({ api, event, args }) {
 try {
 // Make the API call and expect the response in the specified format
 const { data } = await axios.get(
 "https://c-v3.onrender.com/v1/cdp/get"
 );

 const maleImg = await axios.get(data.male, { responseType: "arraybuffer" });
 fs.writeFileSync(__dirname + "/tmp/img1.png", Buffer.from(maleImg.data, "utf-8"));
 const femaleImg = await axios.get(data.female, { responseType: "arraybuffer" });
 fs.writeFileSync(__dirname + "/tmp/img2.png", Buffer.from(femaleImg.data, "utf-8"));

 const msg = "●═══════❍═══════●\nإليك التطقيم الخاص بك\n●═══════❍═══════●";
 const allImages = [
 fs.createReadStream(__dirname + "/tmp/img1.png"),
 fs.createReadStream(__dirname + "/tmp/img2.png")
 ];

 return api.sendMessage({
 body: msg,
 attachment: allImages
 }, event.threadID, event.messageID);
 } catch (error) {
 console.error(error);
 }
 }
};
