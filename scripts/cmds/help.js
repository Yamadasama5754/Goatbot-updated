module.exports.config = {
  name: "مساعدة",
  version: "1.0.2",
  hasPermission: 0,
  credits: "Mirai Team & Mod by Yan Maglinte",
  description: "مرشدة المبتدئين",
  usePrefix: false,
  commandCategory: "الأوامر",
  usages: "[تعرض لك الأوامر]",
  cooldowns: 5,
  envConfig: {
		autoUnsend: true,
		delayUnsend: 60
	}
};

module.exports.languages = {
  en: {
    moduleInfo:
      "「 %1 」\n%2\n\n❯ إستخدام: %3\n❯ فئة: %4\n❯ وقت الانتظار: %5 ثواني(s)\n❯ إذن: %6\n\n» رمز الوحدة بواسطة %7 ",
    helpList:
      `◖هناك %1 أوامر و %2 الفئات على هذا الروبوت.`,
    guideList:
      `◖Use: "%1${this.config.name} أمر" لمعرفة كيفية استخدام هذا الأمر!\n◖نوع: "%1${this.config.name} ‹page_number›" لإظهار محتويات تلك الصفحة!`,
    user: "مستخدم",
    adminGroup: "المشرف عن المجموعة",
    adminBot: "مشرف البوت",
  },
};


module.exports.handleEvent = function ({ api, event, getText }) {
  const { commands } = global.client;
  const { threadID, messageID, body } = event;  

  if (!body || typeof body == "undefined" || body.indexOf("مساعدة") != 0)
    return;
  const splitBody = body.slice(body.indexOf("مساعدة")).trim().split(/\s+/);
  if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase())) return;
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const command = commands.get(splitBody[1].toLowerCase());
  const prefix = threadSetting.hasOwnProperty("PREFIX")
    ? threadSetting.PREFIX
    : global.config.PREFIX;
  return api.sendMessage(
    getText(
      "moduleInfo",
      command.config.name,
      command.config.description,
      `${prefix}${command.config.name} ${
        command.config.usages ? command.config.usages : ""
      }`,
      command.config.commandCategory,
      command.config.cooldowns,
      command.config.hasPermission === 0
        ? getText("user")
        : command.config.hasPermission === 1
        ? getText("adminGroup")
        : getText("adminBot"),
      command.config.credits
    ),
    threadID,
    messageID
  );
};

module.exports.run = async function ({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const command = commands.get((args[0] || "").toLowerCase());
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
  const prefix = threadSetting.hasOwnProperty("PREFIX")
    ? threadSetting.PREFIX
    : global.config.PREFIX;

  if (!command) {
    const commandList = Array.from(commands.values());
    const categories = new Set(commandList.map((cmd) => cmd.config.commandCategory.toLowerCase()));
    const categoryCount = categories.size;

    const categoryNames = Array.from(categories);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(categoryNames.length / itemsPerPage);

    let currentPage = 1;
    if (args[0]) {
      const parsedPage = parseInt(args[0]);
      if (
        !isNaN(parsedPage) &&
        parsedPage >= 1 &&
        parsedPage <= totalPages
      ) {
        currentPage = parsedPage;
      } else {
        return api.sendMessage(
          `◖أُووبس! لقد ذهبت بعيداً جداً! الرجاء اختيار صفحة بين 1 و ${totalPages}◗`,
          threadID,
          messageID
        );
      }
    }
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const visibleCategories = categoryNames.slice(startIdx, endIdx);

    let msg = "";
    for (let i = 0; i < visibleCategories.length; i++) {
      const category = visibleCategories[i];
      const categoryCommands = commandList.filter(
        (cmd) =>
          cmd.config.commandCategory.toLowerCase() === category
      );
      const commandNames = categoryCommands.map((cmd) => cmd.config.name);
      const numberFont = [
        "❶",
        "❷",
        "❸",
        "❹",
        "❺",
        "❻",
        "❼",
        "❽",
        "❾",
        "❿",
      ];
      msg += `╭[ ${numberFont[i]} ]─❍ ${
        category.charAt(0).toUpperCase() + category.slice(1)
      }\n╰─◗ ${commandNames.join(", ")}\n\n`;
    }

    const numberFontPage = [
      "❶",
      "❷",
      "❸",
      "❹",
      "❺",
      "❻",
      "❼",
      "❽",
      "❾",
      "❿",
      "⓫",
      "⓬",
      "⓭",
      "⓮",
      "⓯",
      "⓰",
      "⓱",
      "⓲",
      "⓳",
      "⓴",
    ];
    msg += `
│ صفحة ${numberFontPage[currentPage - 1]} من ${
      numberFontPage[totalPages - 1]
    } │\n\n`;
    msg += getText("قائمة المساعدة", commands.size, categoryCount, prefix);

    const axios = require("axios");
    const fs = require("fs-extra");
    const imgP = [];
    const img = [
      "https://i.imgur.com/n2sUcSJ.jpg",
      "https://i.imgur.com/R7XCiBg.jpg",
      "https://i.imgur.com/CYXpgsh.jpg",
      "https://i.imgur.com/zrbw25E.jpg",
      "https://i.imgur.com/6YD7JrG.jpg",
      "https://i.imgur.com/o31NBYc.jpg",
      "https://i.imgur.com/PSP7cWj.png"
    ];
    const path = __dirname + "/cache/menu.png";
    const rdimg = img[Math.floor(Math.random() * img.length)];

    const { data } = await axios.get(rdimg, {
      responseType: "arraybuffer",
    });

    fs.writeFileSync(path, Buffer.from(data, "utf-8"));
    imgP.push(fs.createReadStream(path));
    const config = require("./../../config.json")
    const msgg = {
  body: `\n |الأوامر و الفئة│\n\n‣ مالك البوت: ${config.DESIGN.Admin}\n\n` + msg + `\n◖مجموع الصفحات المتوفرة: ${totalPages}.\n` + `\n\n│ مرشد  │\n\n` + getText("قائمة الإرشاد", config.PREFIX),
  attachment: imgP,
};

    const sentMessage = await api.sendMessage(msgg, threadID, messageID);

    if (autoUnsend) {
      setTimeout(async () => {
        await api.unsendMessage(sentMessage.messageID);
      }, delayUnsend * 1000);
    }
  } else {
    return api.sendMessage(
      getText(
        "moduleInfo",
        command.config.name,
        command.config.description,
        `${prefix}${command.config.name} ${
          command.config.usages ? command.config.usages : ""
        }`,
        command.config.commandCategory,
        command.config.cooldowns,
        command.config.hasPermission === 0
          ? getText("مستخدم")
          : command.config.hasPermission === 1
          ? getText("مشرف عن المجموعة")
          : getText("مشرف البوت"),
        command.config.credits
      ),
      threadID, messageID
    );
  }
};
