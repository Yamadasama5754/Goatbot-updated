const fs = require("fs-extra");
const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");
const { shortenURL } = global.utils; // تأكد من أن shortenURL موجود في utils

module.exports = {
  threadStates: {},
  config: {
    name: 'تلقائي',
    version: '1.0',
    author: 'Kshitiz',
    countDown: 5,
    role: 0,
    shortDescription: 'تحميل تلقائي لفيديوهات الريلز ل إنستجرام',
    longDescription: '',
    category: 'وسائط',
    guide: {
      en: '{p}{n}',
    }
  },
  onStart: async function ({ api, event }) {
    const threadID = event.threadID;

    if (!this.threadStates[threadID]) {
      this.threadStates[threadID] = {};
    }

    if (event.body.toLowerCase().includes('تلقائي')) {
      api.sendMessage(" ✅ | تم تشغيل مود التحميل التلقائي للفيديوهات عن طريق الروابط بالنسبة ل إنستجرام و فيسبوك و تيك توك", event.threadID, event.messageID);
    }
  },
  onChat: async function ({ api, event }) {
    if (this.checkLink(event.body)) {
      const { url } = this.checkLink(event.body);
      console.log(`Attempting to download from URL: ${url}`);
      this.downLoad(url, api, event);
    }
  },
  downLoad: function (url, api, event) {
    const time = Date.now();
    const path = __dirname + `/cache/${time}.mp4`;

    if (url.includes("instagram")) {
      this.downloadInstagram(url, api, event, path);
    } else if (url.includes("facebook") || url.includes("fb.watch")) {
      this.downloadFacebook(url, api, event, path);
    } else if (url.includes("tiktok")) {
      this.downloadTikTok(url, api, event, path);
    }
  },
  downloadInstagram: async function (url, api, event, path) {
    try {
      const res = await this.getLink(url, api, event, path);
      const response = await axios({
        method: "GET",
        url: res,
        responseType: "arraybuffer"
      });
      fs.writeFileSync(path, Buffer.from(response.data, "utf-8"));
      if (fs.statSync(path).size / 1024 / 1024 > 25) {
        return api.sendMessage(" ❌ | الفيديو كبير جدا للتحميله", event.threadID, () => fs.unlinkSync(path), event.messageID);
      }

      const shortUrl = await shortenURL(res);
      const messageBody = `✅ | تم تحميل الفيديو 🔗 : ${shortUrl}`;

      api.sendMessage({
        body: messageBody,
        attachment: fs.createReadStream(path)
      }, event.threadID, () => fs.unlinkSync(path), event.messageID);
    } catch (err) {
      console.error(err);
      api.sendMessage("❌ | حدث خطأ أثناء تحميل الفيديو.", event.threadID, event.messageID);
    }
  },
  downloadFacebook: async function (url, api, event, path) {
    try {
      const res = await fbDownloader(url);
      if (res.success && res.download && res.download.length > 0) {
        const videoUrl = res.download[0].url;
        const response = await axios({
          method: "GET",
          url: videoUrl,
          responseType: "stream"
        });
        if (response.headers['content-length'] > 87031808) {
          return api.sendMessage("❌ | الفيديو كبير جدا للتحميله", event.threadID, () => fs.unlinkSync(path), event.messageID);
        }
        response.data.pipe(fs.createWriteStream(path));
        response.data.on('end', async () => {
          const shortUrl = await shortenURL(videoUrl);
          const messageBody = `✅ | تم تحميل الفيديو 🔗 : ${shortUrl}`;

          api.sendMessage({
            body: messageBody,
            attachment: fs.createReadStream(path)
          }, event.threadID, () => fs.unlinkSync(path), event.messageID);
        });
      } else {
        api.sendMessage("❌ | لم يتم العثور على فيديو في الرابط.", event.threadID, event.messageID);
      }
    } catch (err) {
      console.error(err);
      api.sendMessage("❌ | حدث خطأ أثناء تحميل الفيديو.", event.threadID, event.messageID);
    }
  },
  downloadTikTok: async function (url, api, event, path) {
    try {
      const res = await this.getLink(url, api, event, path);
      const response = await axios({
        method: "GET",
        url: res,
        responseType: "arraybuffer"
      });
      fs.writeFileSync(path, Buffer.from(response.data, "utf-8"));
      if (fs.statSync(path).size / 1024 / 1024 > 25) {
        return api.sendMessage("❌ | الفيديو كبير جدا للتحميله", event.threadID, () => fs.unlinkSync(path), event.messageID);
      }

      const shortUrl = await shortenURL(res);
      const messageBody = `✅ |  تم تحميل الفيديو 🔗 : ${shortUrl}`;

      api.sendMessage({
        body: messageBody,
        attachment: fs.createReadStream(path)
      }, event.threadID, () => fs.unlinkSync(path), event.messageID);
    } catch (err) {
      console.error(err);
      api.sendMessage("❌ | حدث خطأ أثناء تحميل الفيديو.", event.threadID, event.messageID);
    }
  },
  getLink: function (url, api, event, path) {
    return new Promise((resolve, reject) => {
      if (url.includes("instagram")) {
        axios({
          method: "GET",
          url: `https://insta-kshitiz.onrender.com/insta?url=${encodeURIComponent(url)}`
        })
        .then(res => {
          console.log(`API Response: ${JSON.stringify(res.data)}`);
          if (res.data.url) {
            resolve(res.data.url);
          } else {
            reject(new Error("Invalid response from the API"));
          }
        })
        .catch(err => reject(err));
      } else if (url.includes("facebook") || url.includes("fb.watch")) {
        fbDownloader(url).then(res => {
          if (res.success && res.download && res.download.length > 0) {
            const videoUrl = res.download[0].url;
            resolve(videoUrl);
          } else {
            reject(new Error("Invalid response from the Facebook downloader"));
          }
        }).catch(err => reject(err));
      } else if (url.includes("tiktok")) {
        this.queryTikTok(url).then(res => {
          resolve(res.downloadUrls);
        }).catch(err => reject(err));
      } else {
        reject(new Error("Unsupported platform. Only Instagram, Facebook, and TikTok are supported."));
      }
    });
  },
  queryTikTok: async function (url) {
    try {
      const res = await axios.get("https://ssstik.io/en");
      const s_tt = res.data.split('s_tt = ')[1].split(',')[0];
      const { data: result } = await axios({
        url: "https://ssstik.io/abc?url=dl",
        method: "POST",
        data: qs.stringify({
          id: url,
          locale: 'en',
          tt: s_tt
        }),
        headers: {
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.33"
        }
      });

      const $ = cheerio.load(result);
      if (result.includes('<div class="is-icon b-box warning">')) {
        throw {
          status: "error",
          message: $('p').text()
        };
      }

      const allUrls = $('.result_overlay_buttons > a');
      const format = {
        status: 'success',
        title: $('.maintext').text()
      };

      const slide = $(".slide");
      if (slide.length !== 0) {
        const url = [];
        slide.each((index, element) => {
          url.push($(element).attr('href'));
        });
        format.downloadUrls = url;
        return format;
      }

      format.downloadUrls = $(allUrls[0]).attr('href');
      return format;
    } catch (err) {
      console.error('Error in TikTok Downloader:', err);
      return {
        status: "error",
        message: "An error occurred while downloading from TikTok"
      };
    }
  },
  checkLink: function (url) {
    if (
      url.includes("instagram") ||
      url.includes("facebook") ||
      url.includes("fb.watch") ||
      url.includes("tiktok")
    ) {
      return {
        url: url
      };
    }

    const fbWatchRegex = /fb\.watch\/[a-zA
