const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs");

module.exports = {
    config: {
        name: "مطلوب",
        aliases: ["wanted"],
        version: "1.0",
        author: "HUSSEIN YACOUBI",
        countDown: 5,
        role: 0,
        shortDescription: "صورتك على ملصق المطلوبين",
        longDescription: "صورتك على ملصق المطلوبين",
        category: "متعة",
        guide: "{pn} مطلوب"
    },

    onStart: async function ({ message, event, args }) {
        const mention = Object.keys(event.mentions);

        // If no mention, apply the effect to the user who sent the message
        const one = event.senderID;
        const two = mention[0] || one;  // If no mention, use senderID for both

        bal(one, two).then(ptth => {
            message.reply({ 
                body: "", 
                attachment: fs.createReadStream(ptth) 
            });
        });
    }
};

async function bal(one, two) {
    let avone = await jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
    avone.circle();

    let avtwo = await jimp.read(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
    avtwo.circle();

    // Path for the output image
    let pth = "toilet.png";

    // New image URL and coordinates based on your specification
    let img = await jimp.read("https://i.imgur.com/2FarLuj.jpg");

    // Resize and composite images based on the new coordinates
    img.resize(600, 800)
        .composite(avone.resize(345, 300), 120, 200)
        .composite(avtwo.resize(345, 300), 120, 200); // Same position for both avatars

    await img.writeAsync(pth);
    return pth;
}
