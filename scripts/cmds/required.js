const axios = require('axios');
const Jimp = require("jimp");
const fs = require("fs-extra");

module.exports = {
    config: {
        name: "مطلوب",
        aliases: ["wanted"],
        version: "1.0",
        author: "حسين يعقوبي",
        countDown: 5,
        role: 0,
        shortDescription: "وضع صورتك على ملصق المطلوبين",
        longDescription: "",
        category: "متعة",
        guide: {
            vi: "{pn}",
            en: "{pn}"
        }
    },

    onStart: async function ({ api, event, args }) {
        // تأكد من وجود معرف المستخدم
        const uid = args.length > 0 ? Object.keys(event.mentions) : event.senderID;
        const imagePath = await generateWantedImage(uid);
        api.sendMessage({ attachment: fs.createReadStream(imagePath) }, event.threadID);
    }
};

async function generateWantedImage(uid) {
    const pathImg = __dirname + "/cache/wanted.png";
    const pathAva = __dirname + "/cache/avt.png";

    try {
        // جلب الصورة الشخصية
        const Avatar = (
            await axios.get(
                `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`,
                { responseType: "arraybuffer" }
            )
        ).data;

        fs.writeFileSync(pathAva, Buffer.from(Avatar, "utf-8"));

        // جلب الصورة المطلوبة
        const getWanted = (
            await axios.get(`https://i.imgur.com/2FarLuj.jpg`, {
                responseType: "arraybuffer",
            })
        ).data;

        fs.writeFileSync(pathImg, Buffer.from(getWanted, "utf-8"));

        // قراءة الصور باستخدام Jimp
        const baseImage = await Jimp.read(pathImg);
        const baseAva = await Jimp.read(pathAva);

        baseImage.resize(600, 800); // تغيير حجم الصورة المطلوبة
        baseImage.composite(baseAva.resize(345, 300), 120, 200); // دمج الصورة الشخصية مع الصورة المطلوبة

        await baseImage.writeAsync(pathImg); // حفظ الصورة النهائية

        fs.removeSync(pathAva); // حذف الصورة الشخصية من المجلد

        return pathImg; // إرجاع مسار الصورة النهائية
    } catch (error) {
        console.error("حدث خطأ أثناء إنشاء الصورة:", error);
        return null; // إرجاع null في حالة حدوث خطأ
    }
}
