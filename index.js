const { Client, Collection, DiscordAPIError, MessageAttachment, MessageEmbed } = require("discord.js");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const klaw = require("klaw");
const path = require("path");
const keys = require("./config")
const logs = require("discord-logs");
const Discord = require("discord.js")
const cron = require("cron")
const Canvas = require('canvas')
const oyun = require('./models/game')
const mongoose = require("mongoose")
class Can extends Client {
  constructor(options) {
    super(options);
    this.commands = new Collection();
    this.config = require("./config.js");
    this.aliases = new Collection();
    this.logger = require("./modules/Logger");

    this.wait = require("util").promisify(setTimeout);
  }

  loadCommand(commandPath, commandName) {
    try {
      const props = new (require(`${commandPath}${path.sep}${commandName}`))(
        this
      );
      this.logger.log(`Yüklenen Komut: ${props.help.name}. ✔`, "log");
      props.conf.location = commandPath;
      if (props.init) {
        props.init(this);
      }
      this.commands.set(props.help.name, props);
      props.conf.aliases.forEach(alias => {
        this.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      return `Komut yüklenirken hata oluştu: ${commandName}: ${e}`;
    }
  }

  async unloadCommand(commandPath, commandName) {
    let command;
    if (this.commands.has(commandName)) {
      command = this.commands.get(commandName);
    } else if (this.aliases.has(commandName)) {
      command = this.commands.get(this.aliases.get(commandName));
    }
    if (!command)
      return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;

    if (command.shutdown) {
      await command.shutdown(this);
    }
    delete require.cache[
      require.resolve(`${commandPath}${path.sep}${commandName}.js`)
    ];
    return false;
  }





  async clean(text) {
    if (text && text.constructor.name == "Promise") text = await text;
    if (typeof text !== "string")
      text = require("util").inspect(text, { depth: 1 });

    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
      .replace(
        this.token,
        keys.BotToken
      );

    return text;
  }

  async üye(search, guild) {
    let member = null;
    if (!search || typeof search !== "string") return;
    if (search.match(/^<@!?(\d+)>$/)) {
      let id = search.match(/^<@!?(\d+)>$/)[1];
      member = await guild.members.fetch(id).catch(() => { });
      if (member) return member;
    }
    if (search.match(/^!?([^#]+)#(\d+)$/)) {
      guild = await guild.fetch();
      member = guild.members.cache.find(m => m.user.tag === search);
      if (member) return member;
    }
    member = await guild.members.fetch(search).catch(() => { });
    return member;
  }

  async client_üye(search) {
    let user = null;
    if (!search || typeof search !== "string") return;
    if (search.match(/^!?([^#]+)#(\d+)$/)) {
      let id = search.match(/^!?([^#]+)#(\d+)$/)[1];
      user = this.users.fetch(id).catch(err => { });
      if (user) return user;
    }
    user = await this.users.fetch(search).catch(() => { });
    return user;
  }

  
}

const client = new Can();

const { ButtonCollector } = require("discord-buttons");
require("discord-buttons")(client)

logs(client);
const init = async () => {
  klaw("./commands").on("data", item => {
    const cmdFile = path.parse(item.path);
    if (!cmdFile.ext || cmdFile.ext !== ".js") return;
    const response = client.loadCommand(
      cmdFile.dir,
      `${cmdFile.name}${cmdFile.ext}`
    );
    if (response) client.logger.error(response);
  });

  const evtFiles = await readdir("./events/");
  client.logger.log(`Toplam ${evtFiles.length} event yükleniyor.`, "log");
  evtFiles.forEach(file => {
    const eventName = file.split(".")[0];
    client.logger.log(`Yüklenen Event: ${eventName} ✔`);
    const event = new (require(`./events/${file}`))(client);
    client.on(eventName, (...args) => event.run(...args));
    delete require.cache[require.resolve(`./events/${file}`)];
  });

client.login(keys.BotToken);
mongoose.connect(keys.MongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
.then(client.logger.log("Mongo Bağlantısı Kuruldu ✔", "log"));
};

init();

// Alp Er Tunga öldü mü?

let randomCode = 0;
let code = ["SXWizGIR", "8ndY6F9c", "A9TpSDEm", "oC5NosPp", "IMdVwueS", "L9VLoxdn", "NxzDMilS", "XLf2a19l", "Ghwq6XRF", "rp3fAgYE", "bNpPiVwv", "FvxaVhYC", "9NF5mOnK", "JDcy8dxd", "2gZw4kN4", "HUohjTBy", "Jbi201az", "N3aj3Ozl", "RT32DRbC", "Vr16uWwI", "JsOMXiRB", "0T3aKJau", "s2FCSDbH", "CyqMvsiP", "YMcefzHX", "q6JIsbOL", "xzlKLO8S", "s7v9Sn3q", "RYGcP07P", "H2mXmkrK", "r4jSitYX", "w0ZxWbvu", "PLLKS95O", "JlSPZowk", "Lz3mGGk4", "uoexnbIt", "8TIYWL0W", "dapBGA1f", "tx7JV874", "Rb0br6bJ", "GsHgZoXJ", "yPpxTin0", "UQg4ks6C", "shWBZYdQ", "oB7QvtyK", "tDU9Ixs6", "QTTHCDFr", "CDGX1mOE", "6astq7zV", "EE7O39gT", "0gWHaxAj", "h1DWDIgL", "WeHVZm0f", "e2q4LoAi", "1HYWvZ0h", "Bg7Wyjb6", "sROrbsJ0", "SD7NQTZM", "T9zaDSvf", "Vme8Bgz3", "sowM8fLl", "QMrr7PGV", "fdTrcdl4", "8ILc5qFG", "udKaTZH2", "05tOV0qk", "6UOYpOpy", "bX5PJQJM", "zDwGQMGB", "1Q2wthFf", "RXq0YGjs", "Ky84fSy2", "yZUuaV1q", "LJ83wAOr", "y4AYsom0", "vh3jprUt", "FY5nKTH5", "FzjeCgsD", "o8PA2DNC", "DRIw7wQT", "oUU5TeOk", "UBoDW1Ht", "Ks8k4UJb", "pPSfsFaL", "FOquHRXd", "Jx1Bj03I", "C7bmOCaV", "0vHBrpky", "7JHgfwht", "kyRjbWU9", "AoD3RATy", "uuuyPVjD", "Mmbg1Tbm", "hTZTVBds", "iklrpBY6", "jwRDA3YF", "ueShTxpE", "N4FJ64QN", "bk0VY8FH", "yMe1DqWt", "3ko2jgGQ", "J3qyEU57", "dwbsqliH", "VUwoIXsG", "fOL4L06f", "9qopeSe5", "xhtYKLlY", "gk44eHXd", "thylyqyy", "lcS4YpLO", "HIkaUItK", "okhwH7sy", "sSwlHQpy", "ImQteQfx", "ihUd12Di", "sTwuDasg", "moPGiXOM", "4BQQ2zcl", "nTEuzePE", "UewhDwFl", "UpfvNiaM", "ekkqIYoF", "VQrPJPmJ", "bmPX4t9l", "i2nCmSmL", "EQiJA817", "JyLgt7aa", "bly8tC3E", "8A1nW1R4", "umBCNRuo", "dEpY18tW", "Rk2gl68U", "TEfQVPpw", "R7HhOBQH", "Nutw1ZX4", "WH6nKUwD", "wuwPjRRV", "7OyNM0l3", "tik9z2cI", "lU1gtfyZ", "jARSWNWz", "PYEJZIFS", "iWwRlyAr", "etMBLKi9", "66Owejre", "xkdPbU4I", "TMTAvMKG", "UdflFRH5", "qChtkszu", "6tfQFx8S", "Ni9pOXQ5", "tAIWXNuV", "TcDo5WZo", "bPxhwP4b", "AMRs6IrB", "E2aiykZg", "utg0jeDy", "5J597DO4", "gVAJiVJm", "ZA2iPC5h", "CDVOXeOw", "EReGcLU7", "PkdVyKyp", "AovSWrF2", "RolC0YZX", "P1pxESXE", "7Wyh3Ayt",
"gROEZzX9", "uDaEz46n", "2119DPCS", "l9U064rn", "jC6VA8IM", "yxAW1GoE", "jWJSRb51", "RogPBRHF", "X2JHHJPo", "jvab0zHS", "51R3o2yO", "T6g7zv7C", "f5ynfRow", "VoZxwYj6", "37BiBQ3Q", "O4H8jjYC", "3SvtQ9td", "yEGbeas9", "OKerDx3K", "HOgauKqD", "V6nhK6sG", "7vzSzdPu", "hCca0Hzf", "jeJDSFtc", "8PaPPfMp", "V5ajpOvL", "HQtvacUX", "IfHlMvOy", "MKC0t9aS", "zjHwP6rF", "ezUEV2t7", "6ebzmvnj", "nf4XgPrk", "hz9EhvAh", "NCQsSWIV", "d8zmb39Z", "GyEiseFi", "yNR52u4O", "D4BE3qM4", "FZtKTIkV", "SM9oyvtn", "AG7fFS9o", "d0pdXrJo", "EcOWxooc", "CQ9NtaPi", "Xdda54I8", "VEpSelF9", "GBPFkQsR", "7NEkiqvH", "ayF6Qo2F", "YLmAGWsL", "llpRbkng", "iNyaXBa8", "ATExo41K", "VcJDX9i0", "65Jvrx1S", "U1lZAe7J", "K5N1yxZw", "fWPzeaK8", "bHykKGbh", "YLovfeHC", "Xs6PMXc3", "OVXBnSKy", "5T0fc80D", "tr1MeAew", "yyDEzVkA", "1ozcwg14", "ZkWGWe3x", "3dTSDskq", "hFRgzHUe", "UT5wey5f", "JDLC3H3s", "3qzfK8v1", "e5df4WPO", "zAAGmanz", "G0ZJDxks", "7dtkhF7j", "t2boDkKv", "tujUyGwH", "kEV3imXL", "EDnu83m0", "IkaKKzzJ", "CyjOr2qg", "wngB65yi", "bdBTn3oj", "RakfEiLx", "g5hKDezb", "JUwAieAi", "7CdkIQ9S", "1nPuT4Sb", "OzhLB0bT", "go3VLG1u", "EvsJBTBt", "0LWW2Ypu", "umIbuzjT", "u6L3cJxD", "ccIr10Wy", "3DYuwYyL", "nW29B8s8", "gh44Assl", "zvyKTmmi", "TycVVRSU", "y1nfnDJj", "UvTJFoVV", "35oa4a8H", "GCxO0zKQ", "xaOGYEEo", "BE1dCB3U", "ZV9pXOqF", "JhGw8dzq", "GMvOBKoA", "88rXUzsg", "u35BB8Bb", "5z5AqgVO", "SBcJyVkw", "CJlW3YEq", "VBeMkLaU", "5GdmvekF", "JpYKfVwF", "8FHa2Yhk", "0PoQRHm6", "PGuugFFK", "csR6YS0O", "cpOudACq", "IxMehAji", "v2T7iN2a", "s9udyqsd", "EKxeotEy", "K2BS7y3v", "V8D8zRp7", "hTZEP2p2", "5phvzcVu", "PUOhmy4m", "48kLWrbX", "JH3F6BD6", "PubVXgSN", "KXkuQJgV", "tBUPOHwo", "IjQKnHqx", "42VGCizm", "Xcsr4alz", "5Tyf1OZD", "CE4hmbUc", "v24q92t7", "CCKXPCzZ", "G7SnYpI3", "cr1OkvM8", "Ng0XuI6j", "lNoE6Je7", "KMhMclyp", "QyU6mFLk", "S0ZcEqI5", "JO0YOZXi", "A0sBWBxP", "UKNIFleX", "hOMMkWOG", "eLuVliIb", "xdAaBJrm", "3nd6FWgU", "fqXZwj0Z", "8t3QENGG", "xV99eJFX", "htCGW5aN", "XlE3bnAY", "M0E8So8u", "Zflim9td", "UQOwpn1R", "oOwjDbSy", "mGnMaEki", 
"2gE112l4", "tAjiswUZ", "Mf04ngY8", "shVQNVld", "9kifTpks", "QCCCbZ5X", "0tCbZyt6", "sJdCxL18", "1CcEnmUE", "jG6NTJc2", "CyuJtg9y", "5exegAdN", "oPnuD4RZ", "Eq4Bz0P1", "bCqazq9A", "sxGwCL8i", "b2gA9nSU", "J3rrGepj", "CtrJQGka", "BodjY3fs", "pZeVzY3N", "ryn6Wxcd", "Gf5dcs0D", "nB2Ej8di", "dCaFEWIo", "boHPYP9P", "jw8pXwX7", "h4dRS68l", "9hbuXsxh", "VRjxFCrF", "CiNRMkay", "F3kPpqEO", "jFgMIRxF", "gDGqApMi", "xuPYosMe", "xc7LXuH6", "OAcgy1rd", "NqAvBCjm", "v40qeRgJ", "SAWa29Ab", 
"ZERt7caO", "pVW5GwMo", "ClH7ZWH2", "vswJhyC1", "d550IeLA", "kqeHDi9c", "1XAYNZen", "6CcTkok8", "AnImT2As", "LslFTCyw", "2IKYY9Nh", "O82h3fWC", "AfKP1TYl", "OrpAHiWM", "hGofgzRh", "mkPAMS33", "NVPKc4cU", "edSTE2AF", "BWhqSQAr", "O2lm3nGc", "Zg6VZjx4", "iwF113SB", "JucvDYDh", "wutas71e", "CXLhZkMA", "6v2FrueH", "7CPxw51G", "y2JR0kAI", "g7Ybf84A", "0tq5JMCv", "1KamVJJ4", "BA3zYOmE", "oscdKARt", "8UI2Eozj", "huN9U7wn", "WKF59cbF", "pjNjobuF", "c4lGfh1w", "qgLDGTLr", "9MuCbEuZ", "9bPzVjOc", "nL8Z3BJh", "t8RgxMWV", "NKK2AY53", "PNq8Aov4", "LWfcV37Z", "4VfuAW7f", "6iOPUYxc", "HHlH64Bo", "bOPtljop", "2v728tiQ", "pYArPwpE", "9tQnM8ST", "pQxYTIYj", "doUYmS2T", "wHCmNUD3", "H3QxY2Wo", "EUcvgcu4", "Rtn313eq", "VMCGAq4D", "4pgr0OXG", "qOG7f38V", "KIKuWfQD", "DEmAn6J2", "yreVwQex", "MbA0WVy6", "qGp8mADc", "5v1V5Zix", "Q9w9u0oJ", "40RcB8aH", "j7RJqs4z", "L7C7JMaT", "4WethXf6", "wcFkKBia", "xNWQqkDg", "BCUtKG8S", "8iQTZXiV", "YPtoh6SZ", "1u7D3uvK", "bWweSMwX", "h0REE6fg", "1vBO9MmY", "GQDuiMLG", "eb9Wpd3P", "0lhTeWd6", "rHYR9TRP", "hOA7nnoS", "fKrMIC7D", "rAZLFQEq", "T2GnJrFl", "XpPdI6P6", "C7zHCZoH", "BFwaN2Ko", "ZoOhIyO8", "q8CjvgVs", "6YtNcFxs", "BLHNbAhl", "C5fjXvPf", "yZD3ncNu", "vy5tJgJc", "XUpqkkU1", "L4bRSnQc", "qWCGFSvH", "E6h6gaxP", "1PZNjC72", "3O8gANso", "OVwzsT4w", "SuBRP09a", "PxkfaCUp", "hP0l5rP1", "DGejc32q", "0ePwjELV", "M7jRws4y", "xmG2sM1q", "RaSetyqY", "26ADI94o", "4cWfGHDK", "374Irirv", "a6Vb79bM", "VV0QFDi4", "70wYvF5F", "9FfLtb0F", "QjypCOKL", "nzQcNwZN", "MZYREYV2", "Lps8khUz", "k4hK4BDN", "BZ7J4xmr", "3RxAtTAu", "6GOGB6I0", "pngvra9g", "1soEfJHc", "rOcTIcyb", "9jpfknm1", "3NVhKhoR", "5omPmagy", "Mc7tGMl7", "H8Kji7I4", "J0MJ7ZBe", "x5x2qU11", "BtLXDhDy", "UaIctj16", "48tE4DmU", "eRvUgYki", "YyN5x4cx", "HyFyrfvG", "2IdbAIfk", "MdRnkvKv", "BBRfbPZC", "mwhIds7F", "Rxqe8JXI", "lkEGV8re", "YlCrFse4", "GFi6qZVZ", "HkGdExhb", "SJoqmljX", "2SBv6dEY", "cRfK2551", "P5hS2Mrk", "qPCPDLaM", "6vzJcsnp", "BHzfYr7e", "Loprzw8A", "R6gqyRPk", "VzAuE76v", "OruX0ssU", "dcLdODIV", "9ytI7qWZ", "5rFgJepr", 
"13vFJXBR", "lmBBIOBi", "CIChboS0", "MHlnrfry", "z8jy2v5m", "DvK90Zhz", "FrwtCnDp", "GQHhZIqj", "qqmE27Fh", "pJkXZOR0", "FYWmV1H9", "3Qw3YMom", "k5Ga03jv", "IlkKHlxE", "XxQzSrja", "03Hc93uP", "LXqWGte0", "akC9foJT", "qkc3lzOc", "hAUC6bHF", "BZYfkUjE", "rS7hFmrL", "4aYXr5ad", "9gyZYaxP", "Towe8YxO", "lT04a0Z4", "OVbYFX9d", "XhZv048n", "cwXPayMC", "esUS6ZAB", "XUsRaotH", "vwoo43ue", "LEvIneNY", "Qn1q7iQv", "4w3bAaR8", "FDJkguxn", "iZqJNYqS", "K083NdEw", "h2GxLvCa", "JfgV0RQF", "Gbn9VEB2", "MawR9qjz", "GynzKMeO", "dk46VLRm", "WHF2SZUf", "rZBWyGcX", "yjk5aetb", "XcbrrXWi", "cZooMlwO", "H0gzv5lG", "iBG7xQjs", "BS5LFzsk", "LrBVTA4J", "xfnYUbCw", "8ITxZhpI", "79dctKDT", "RSJMMANR", "u9hc2ZC9", "97Hv6Smf", "yR93HRYI", "uOgQHKVA", "QR0JawQO", "WMZNO8o9", "wytE8hif", "MrYNfsr8", "4OgfoALl", "wNWlhBhX", "n0gJc8ZF", "2f3bM4gV", "80fEFT9K", "bd4JBPLv", "uT8kuJiF", "GWdcYYp6", "0nUoK6d5", "gj3ueXRC", "47GxLLwX", "0Lb5SeTi", "IxNnXdKm", "yfVi4RjC", "OqafPm4l", "0L7MngAq", "j3OasSnj", "G7l69r80", "k6y3BlkJ", "u7aQV94P", "NQzWzZHK", "JrMzEF34", "ItdwlJun", "0Cm2lDgg", "rkNb5JMw", "Lq64WJ8V", "BzG4vVuk", "3UrPUU5l", "NDUtp25x", "TmcPHL3E", "ln0O5oUX", "SbNwKwzI", "lhEjzUwO", "XkMDnLjS", "UN5gsljr", "Gil6VG20", "8S6QhX3T", "wgD54HV4", "nCEobKgX", "biR3YbQK", "fDH2ELyz", "myWx9KBb", "NgR3EsJn", "UuyYDgH6", "HdLBomQa", "oy1eQPxp", "W5r7lwF6", "937vZEoY", "8cSwpEEh", "exqv9iXx", "zCXULjJZ", "IVW3raox", "x9sacbbd", "gaXg5gNO", "2fF4mwEv", "wzgitZNv", "vx8sG1YF", "EByMzuzc", "Gy1eXLKo", "htiV5I9W", "wpHl31HQ", "Nn3xKXCo", "JM3v6L9i", "sJUpKXOv", "IfyXJhmN", "H9SDAEnv", "a4J0CVS6", "bmULn2Ws", "8N0S2ZXi", "ForM9djT", "tZUfTa4N", "5l9lhXoB", "6nP4w6th", "juB14zCv", "Dazd0ENm", "Zu1jAGsi", "6REsbgQi", "1t3oEbRe", "ypaEG60D", "ULDCWIBb", "icUyahTm", "szmabbpP", "tBdsaJia", "AOH0ATz9", "nZ7uJ4cs", "xzoplGKF", "zFRmMlX2", "tAQLC1di", "yfeLocQd", "hKKrkPel", "Muz9t6Wi", "C0kcaLvH", "iym6mdWE", "u1WtIo0X", "OzbcUh82", "GaPcz9Hw", "0vYGr2JF", "tgTEVv1H", "svfftKUX", "3mx3Db6q", "UYEpsqRR", "krgRzqCU", "dFQ7X668", "dTsGQa3L", 
"8xJELNLA", "0SjwA5R2", "eGKhYjPK", "9rw2YoVT", "N5szZLF8", "DVkLxdO7", "AlBXnpvt", "4gOEGeG7", "vpB4fHKK", "oLdtGRx2", "b6MeR3fu", "o0jfI7vG", "iGKOKdT8", "cZCIARrm", "RlEXjJ8Z", "JtoiPCff", "9ITWFIwP", "HSPew6uY", "N9rKhXZh", "CvzqvqNy", "hAKu59wm", "lIoHyLZX", "ZLz14xEc", "gwLf1Eie", "VEb4le42", "UQRaJP10", "Y5dzvH86", "vAKTGhWA", "Q5iDfujM", "VDO1vyIY", "7Gokjtg0", "gj7ZIBXC", "GJPVEVqT", "QhcRa9g4", "QJquTEAt", "AS46CL0H", "cElCsSrI", "LrSGNRx9", "JKRC3hTx", "1g879bsO", "piLo3w7G", "Wa08FF7j", "mrR7lttZ", "d84vT8DX", "Rfb89IHv", "KDGI5ZUi", "KLe7eoJ7", "vCy1khw6", "NFpYTcFN", "XP75yisL", "JPNSOhXA", "Uvkw6NPb", "5Ci4aGhU", "kBkE8FlK", "tE2A8N3U", "EZekOw0M", "ytrwmfbH", "HdAplEr4", "EzGjf4WZ", "rJgOR3ir", "tTatcwHu", "VuE4iWcd", "jh0P0GJg", "rfiWbh3H", "OQKG9DLk", "T5Djl1f1", "DxrEZFGA", "65fXnzJo", "YPxgAxZ7", "a9PlV3bL", "ptumdOyN", "xKlXzh15", "rSg4WV0M", "KYel3pr1", "8HHq5VjQ", "TA7EDrrx", "HyeKgdKj", "WeUZZE46", "UKy385I6", "jIr1Xr4z", "Jt66nucL", "WHhxnal9", "rv1fdWpW", "gDoKPKsb", "Vj8DaZAv", "X3e3LFvK", "RhOF38AF", "KL1EEpgM", "2E5Yaoac", "gLiUKQli", "SI2R2o2p", "S4KHzhmp", "2tIiBQsK", "a2Nto8H5", "kWysPsM4", "gW9WUy2g", "CxJw6zXp", "pxarLzU2", "DtmEpPmK", "qF8Czgbc", "BLFmjRa0", "3XyMWZGm", "WuGAmaIW", "EaHCtGsF", "PjlgqcV9", "KncKDwlE", "bVVuzGm6", "HkSPqdPJ", "7mGm9kDF", "7LcFsUgM", "wLOB6WS5", "ePnoJVAY", "wLALP7Tu", "YgA2PqDw", "xEaB7pDd", "BfQ2UXdc", "9rxN4tVp", "7THsOYVi", "VR1BEp90", "MQixP5jx", "JRDc5ggT", "uk8jwGLD", "ZG0XkSpi", "SrEFw7Js", "u8VMGHin", "3wH5GQ2C", "G6bn6B80", "6phEjcQc", "HfaXEUNg", "BRLHUpgs", "vtkxgSbo", "JcJZoOyF", "OdcqrZXD", "jT7j1lwW", "skeo0dTf", "VYa7bk9V", "vOLfP3FB", "1JHFQ64n", "WNDtxVPm", "BcAbJCRP", "fKrsuiNn", "PyctluJP", "k84Zjezu", "fZ4gnFf5", "zAMlnCCr", "IfYtwgth", "Q5rd54lm", "TxDAbeE5", "gWEdVNcv", "zCMAP6il", "DQ7csWw7", "FrzkqMYx", "6F0Mo2fk", "3KNzMztu", "xHkPM3Sb", "CqysSaMx", "heNCVf5p", "cPTbNSPE", "EwnsOgyi", "cVRCzHjB", "FKiFVvgP", "vsYnx5am", "AUyKQp1S", "DJFw1qGd", "FLLxBmla", "oCCXGz45", "dEypGaqI", "5bZmso5V", "0Yi6gFYo", 
"0pOb1rVo", "ZpF9v7D6", "kv7Cp4oA", "5AgXAdLm", "G1oZ39Kq", "ohpH7mE6", "9J7eu0XG", "QiiorZmE", "tFTJnZmp", "n5Q2fiI7", "n83UwLPj", "kUOfv0Cn", "ljwpqFwm", "8EcCSKrb", "LwoUQ7Rx", "9pBAo6Cs", "ji4AzqFO", "fvtnuxYK", "gxD7wLBD", "KnufUj14", "fcHEldOt", "kroOhnEM", "lDbYcE4W", "fNfCIaxd", "aTBDuuy1", "VIwEqjde", "BuBu41yb", "3qv1d45V", "jOLEH6lG", "uGWoUQJr", "3PjsNBno", "sbXSA7Jg", "rPH7zZap", "c6vul9zI", "2jDtmHVQ", "Nfzx0EoU", "4nVDJHH7", "3pyOPzTj", "VPuFI2cD", "H0Tomell", "qsn08qrL", "pFem4yDG", "bQo5vv8k", "HnT9ATSD", "hb2WPiI6", "yGOzZHay", "bIDGsPRP", "moMgbTbD", "HBPk4ZT0", "38KgY7tw", "pxXZlDw1", "wXnnnZ5t", "OGHw0XLf", "pIGoNrtj", "5xhP3EzL", "EceI8j1U", "YdekU4eV", "0ghhc02a", "4ZkWuDh4", "Uo9uZ3iH", "ulrLkQ33", "EkzpX8gb", "lUS2mk38", "vXXUaGZI", "YjKnc1Z1", "m4xg8C6R", "ioojVUVG", "g7yH6El8", "ICAS4YSe", "Nx4N3w3v", "M1kifGM1", "tsxy07VS", "THsayWb2", "HQaWi0nK", "xKXE4xfK", "LjO80r1P", "D5qXE3pf", "daxhawYf", "gpN3tlBJ", "b7ddhDRb", "y39jguS7", "fgVpxDbv", "D68ej0Y0", "Q4hadRPq", "37TmwYaC", "2lLlpfYb", "qEP59ImK", "Nc7LdPb6", "H1VBx3yO", "betW5PXO", "40KQhvw9", "xqkQmPVJ", "GnlC2YKF", "MFCS4PPi", "3taQy58L", "pTnb75db", "6mnEE3ow", "JsYC1Xdl", "oLSKcFrC", "0OP6COiy", "BZKLs6tv", "a4Xkv5Lf", "FzlWOoUo", "tMGrfQyV", 
"IDObLl7j", "2MLJOHxq", "OwwePOSJ", "uvHPAUnX", "K1zGhVu6", "EcjDCzBS", "zoTucAZ9", "MOdnDkXc", "hQYKn2Jq", "eeY4cWl6", "Qw9Z7jhf", "oZrTQWgA", "BpnfB8r8"]

client.on("message", async msg => {
if (msg.channel.id == client.config.channels.generalChat && !msg.author.bot && client.config.Prefix.some(x => !msg.content.startsWith(x))) {
  randomCode++;
  if (randomCode >= client.config.codeMessage) {
    randomCode = 0;
    let zadeCode = code[Math.floor(Math.random() * code.length)];
    const canvas = Canvas.createCanvas(700, 500);
    const ctx = canvas.getContext("2d")
    const arkaplan = await Canvas.loadImage("https://cdn.discordapp.com/attachments/908328093549228043/925450426868961290/yazkazan.png")
    ctx.drawImage(arkaplan, 0, 0, canvas.width, canvas.height)
    ctx.strokeRect(0, 0, canvas.width, canvas.height)
    ctx.font = "75px Sans-serif"
    ctx.fillStyle = "#f0f0f0"
    ctx.fillText(`${zadeCode}`, 170, 285)

    const sabitle = new MessageAttachment(canvas.toBuffer(), "yazkazan.png")
   let can =  msg.channel.send(`${client.emojis.cache.find(x => x.name === client.config.emoji.Money)} **|** Aşadağıda verilen **resimdeki kodu** ilk sen yaz ve hediye coin kazan. **HIZLI OL!!!**\n`, sabitle)


    const coinOnay = await msg.channel.awaitMessages((m) => [zadeCode].some(cevap => m.content.includes(cevap)), {max: 1, time: 15000 })
    if(coinOnay.size < 1 ) {
      (await can).delete()
     return  msg.channel.send(`15 saniye içerisinde kimse cevap veremedeği için işlem iptal oldu.`).then(x => x.delete({timeout:7500}))
      }
    let cevaplama = coinOnay.first()
    if(cevaplama.content.includes(zadeCode)) {
        let randomizeCoin = Math.floor(Math.random() * 450) + 1

        let data = await oyun.findOne({sunucu: msg.guild.id, user: msg.author.id})

        if(!data) { 
        let newData = new oyun({sunucu: msg.guild.id, user: msg.author.id, coin: randomizeCoin})
        newData.save().catch(err => console.log(`Oyuncuza yaz kazandan para eklenemedi (yeni data açılamadı) !\nSorun:` + err))
        } else {data.sunucu = msg.guild.id;data.user = msg.author.id; data.coin = (data.coin + randomizeCoin); data.save();}
        (await can).delete()
        msg.channel.send(/*new MessageEmbed().setAuthor(msg.guild.name, msg.guild.iconURL({dynamic: true, size: 2048}))
        .setDescription(*/`
${client.emojis.cache.find(x => x.name === client.config.emoji.Money)} **|** Tebrikler! ${msg.author}, verdiğimiz kodu herkesten önce sen yazarak bizden **${randomizeCoin}** coin kazandın. Paranı katlamak için oyunlarımızı oynayabilirsin!`).then(x => x.delete({timeout:10000}))

      }
          }
}
});

client
  .on("disconnect", () => client.logger.warn("Bot is disconnecting..."))
  .on("reconnecting", () => client.logger.log("Bot reconnecting...", "log"))
  .on("error", e => client.logger.error(e))
  .on("warn", info => client.logger.warn(info));


process.on("uncaughtException", err => {
  const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
  console.error("Beklenmedik yakalanamayan hata: ", errorMsg);
  process.exit(1);
});

process.on("unhandledRejection", err => {
  console.error("Promise Hatası: ", err);
});





