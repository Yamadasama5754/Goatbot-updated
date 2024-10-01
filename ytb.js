const axios = require("axios");
const fs = require("fs-extra");
const { getStreamFromURL, downloadFile, formatNumber } = global.utils;
const path = require("path");

async function searchYoutube(query) {
  try {
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=AIzaSyC_CVzKGFtLAqxNdAZ_EyLbL0VRGJ-FaMU&type=video&maxResults=6`);
    return response.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.high.url
    }));
  } catch (error) {
    throw new Error(`Failed to search YouTube: ${error.message}`);
  }
}

async function getVideoInfo(url) {
  try {
    const response = await axios.get(`https://www.samirxpikachu.run.place/ytb?url=${url}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch video info: ${error.message}`);
  }
}

async function downloadThumbnail(url, index) {
  const tempPath = path.join(__dirname, "tmp", `thumbnail_${index}.jpg`);
  await downloadFile(url, tempPath);
  return tempPath;
}

module.exports = {
  config: {
    name: "يوتيوب",
    version: "3.22",
    author: "NTKhang & Fixed by Samir Œ",
    countDown: 5,
    role: 0,
    description: {
      vi: "Tải video, audio hoặc xem thông tin video trên YouTube",
      en: "قم بتنزيل الفيديو أو الأغاني أو عرض معلومات الفيديو على يوتيوب"
    },
    category: "وسائط",
    guide: {
      vi: "   {pn} [video|-v] [<tên video>|<link video>]: dùng để tải video từ youtube."
        + "\n   {pn} [audio|-a] [<tên video>|<link video>]: dùng để tải audio từ youtube"
        + "\n   {pn} [info|-i] [<tên video>|<link video>]: dùng để xem thông tin video từ youtube"
        + "\n   Ví dụ:"
        + "\n    {pn} -v Fallen Kingdom"
        + "\n    {pn} -a Fallen Kingdom"
        + "\n    {pn} -i Fallen Kingdom",
      en: "   {pn} [مقطع|فيديو] [<إسم الفيديو>|<رابط الفيديو>]: إستخدم لتنزيل المقاطع يوتيوب"
      + "\n   {pn} [أوديو|أغنية] [<إسم الفيديو>|<رابط الفيديو>]: إستخدم من أجل تنزيل الاغاني من يوتيوب"
      + "\n   {pn} [معلومات|بيانات] [<إسم المقطع>|<رابط المقطع>]: قم بإستخدام لعرض معلومات الفيديو على اليوتيوب"
      + "\n   Example:"
      + "\n    {pn} مقطع fifty fifty copied"
      + "\n    {pn} أغنية fifty fifty copied"
      + "\n    {pn} معلومات fifty fifty copied"
    }
  },

  langs: {
    vi: {
      error: "❌ Đã xảy ra lỗi: %1",
      noResult: "⭕ Không có kết quả tìm kiếm nào phù hợp với từ khóa %1",
      choose: "%1\n\nReply tin nhắn với số để chọn hoặc nội dung bất kì để gỡ",
      video: "video",
      audio: "âm thanh",
      downloading: "⬇️ Đang tải xuống %1 \"%2\"",
      downloading2: "⬇️ Đang tải xuống %1 \"%2\"\n🔃 Tốc độ: %3MB/s\n⏸️ Đã tải: %4/%5MB (%6%)\n⏳ Ước tính thời gian còn lại: %7 giây",
      noVideo: "⭕ Rất tiếc, không tìm thấy video nào có dung lượng nhỏ hơn 83MB",
      noAudio: "⭕ Rất tiếc, không tìm thấy audio nào có dung lượng nhỏ hơn 26MB",
      info: "💠 Tiêu đề: %1\n🏪 Kênh: %2\n⏱ Thời lượng: %3\n🔠 ID: %4\n🔗 Link: %5"
    },
    en: {
      error: "❌ | حدث خطأ : %1",
      noResult: "⭕ لم يتم إيجاد مفطع بالنسبة للكلمة المعطاة : %1",
      choose: "%1قم بالرد على الرقم بالفيديو الذي تريد تحميله و مشاهدته ",
      video: "المقطع",
      audio: "الأغنية",
      downloading: "⬇️ جاري التحميل %1 \"%2\"",
      downloading2: "⬇️ جاري التحميل %1 \"%2\"\n🔃 السرعة: %3 ميغابايت في الثانية \n⏸️ تم التحميل : %4/%5 ميغابايت (%6%)\n⏳ الوقت المقدر المتبقي : %7 ثانية ",
      noVideo: "⭕ |عذرًا، لم يتم العثور على فيديو بحجم أقل من 83 ميجابايت",
      noAudio: "⭕ |عذرًا، لم يتم العثور على ملف صوتي بحجم أقل من 26 ميجابايت",
      info: "💠 | العنوان : %1\n🏪 | القناة : %2\n⏱ | المدة : %3\n🔠 | المعرف : %4\n🔗 | الرابط : %5"
    }
  },

  onStart: async function ({ args, message, event, commandName, getLang }) {
    let type;
    switch (args[0]) {
      case "مقطع":
      case "فيديو":
        type = "video";
        break;
      case "اغنية":
      case "موسيقى":
      case "غني":
      case "صوت":
        type = "audio";
        break;
      case "معلومات":
      case "بيانات":
        type = "info";
        break;
      default:
        return message.SyntaxError();
    }

    const input = args.slice(1).join(" ");
    if (!input) return message.SyntaxError();

    const youtubeRegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;

    if (youtubeRegex.test(input)) {
      try {
        const videoInfo = await getVideoInfo(input);
        await handle({ type, videoInfo, message, getLang });
      } catch (err) {
        return message.reply(getLang("error", err.message));
      }
    } else {
      try {
        const searchResults = await searchYoutube(input);
        if (searchResults.length === 0) {
          return message.reply(getLang("noResult", input));
        }

        let msg = "";
        for (let i = 0; i < searchResults.length; i++) {
          msg += `${i + 1}. ${searchResults[i].title} - ${searchResults[i].channel}\n\n`;
        }

        const thumbnailPaths = await Promise.all(
          searchResults.map((result, index) => downloadThumbnail(result.thumbnail, index))
        );

        const response = await message.reply({
          body: getLang("choose", msg),
          attachment: thumbnailPaths.map(path => fs.createReadStream(path))
        });


        thumbnailPaths.forEach(path => fs.unlink(path).catch(console.error));

        if (response && response.messageID) {
          global.GoatBot.onReply.set(response.messageID, {
            commandName,
            messageID: response.messageID,
            author: event.senderID,
            type,
            searchResults
          });
        } else {
          console.error("Failed to get messageID from response");
          return message.reply(getLang("error", "Failed to process the request"));
        }

      } catch (err) {
        console.error(err);
        return message.reply(getLang("error", err.message));
      }
    }
  },

  onReply: async function ({ message, event, getLang, Reply }) {
    const { type, searchResults, messageID } = Reply;
    const choice = parseInt(event.body);

    if (isNaN(choice) || choice < 1 || choice > searchResults.length) {
      return message.reply(getLang("error", "Invalid choice"));
    }


    await message.unsend(messageID);

    const selectedVideo = searchResults[choice - 1];
    const videoUrl = `https://www.youtube.com/watch?v=${selectedVideo.id}`;

    try {
      const videoInfo = await getVideoInfo(videoUrl);
      await handle({ type, videoInfo, message, getLang });
    } catch (err) {
      return message.reply(getLang("error", err.message));
    }
  }
};

async function handle({ type, videoInfo, message, getLang }) {
  const { id, title, duration, author, image, videos, audios } = videoInfo;

  if (type === "video") {
    const MAX_SIZE = 83 * 1024 * 1024;
    let msgSend;
    try {
      msgSend = await message.reply(getLang("downloading", getLang("video"), title));
    } catch (err) {
      console.error("Failed to send download message:", err);
    }

    try {
      const path = __dirname + `/tmp/${id}.mp4`;
      await downloadFile(videos, path);
      const stats = await fs.stat(path);

      if (stats.size > MAX_SIZE) {
        fs.unlinkSync(path);
        return message.reply(getLang("noVideo"));
      }

      await message.reply({
        body: title,
        attachment: fs.createReadStream(path)
      });
      fs.unlinkSync(path);
      if (msgSend && msgSend.messageID) {
        await message.unsend(msgSend.messageID).catch(console.error);
      }
    } catch (e) {
      console.error("Error in video handling:", e);
      return message.reply(getLang("error", e.message));
    }
  } else if (type === "audio") {
    const MAX_SIZE = 26 * 1024 * 1024;
    let msgSend;
    try {
      msgSend = await message.reply(getLang("downloading", getLang("audio"), title));
    } catch (err) {
      console.error("Failed to send download message:", err);
    }

    try {
      const path = __dirname + `/tmp/${id}.mp3`;
      await downloadFile(audios, path);
      const stats = await fs.stat(path);

      if (stats.size > MAX_SIZE) {
        fs.unlinkSync(path);
        return message.reply(getLang("noAudio"));
      }

      await message.reply({
        body: title,
        attachment: fs.createReadStream(path)
      });
      fs.unlinkSync(path);
      if (msgSend && msgSend.messageID) {
        await message.unsend(msgSend.messageID).catch(console.error);
      }
    } catch (e) {
      console.error("Error in audio handling:", e);
      return message.reply(getLang("error", e.message));
    }
  } else if (type === "info") {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    const time = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    const msg = getLang("info", title, author, time, id, `https://youtu.be/${id}`);

    await message.reply({
      body: msg,
      attachment: await getStreamFromURL(image)
    });
  }
}
