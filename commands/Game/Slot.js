const {Discord, Message, MessageAttachment, MessageEmbed} = require('discord.js')
const Command = require('../../base/Command')
const oyun = require('../../models/game')
let limit = new Map();
class Slot extends Command {
    constructor(client) {
        super(client, {
            name: "slots",
            aliases: ["slot", "s"], 
        });
    }
    async run(message, args, perm) {
	    if (!message.guild) return;
		let kanallar = this.client.config.channels.GameChannel
	if (!kanallar.includes(message.channel.name)) return message.reply(`${kanallar.map(x => `Bu botu yalnızca ${this.client.channels.cache.find(chan => chan.name == x)} kanallarında kullanabilirsin`)}.`).then(x => x.delete({timeout: 10000}));

	
    const slot = [this.client.emojis.cache.find(x => x.name === this.client.config.emoji.Kalp), this.client.emojis.cache.find(x => x.name === this.client.config.emoji.Patlıcan), this.client.emojis.cache.find(x => x.name === this.client.config.emoji.Kiraz)] 

    let betCoin = Number(args[0])
    if(!betCoin || !Number(args[0])) return message.reply(`Kaç coin ile oynamak istiyorsun ?`)
    if(betCoin >= 50000) return message.reply("50.000 coinden fazla bir coin ile oyun oynamayazsın")


    let slotgif1 = this.client.emojis.cache.find(x => x.name === this.client.config.emoji.ZadeSlot)
    let slotgif2 = this.client.emojis.cache.find(x => x.name === this.client.config.emoji.ZadeSlot)
    let slotgif3 = this.client.emojis.cache.find(x => x.name === this.client.config.emoji.ZadeSlot)

    let mainslot1 = slot[Math.floor(Math.random() * slot.length)];
    let mainslot2 = slot[Math.floor(Math.random() * slot.length)];
    let mainslot3 = slot[Math.floor(Math.random() * slot.length)];

/*
oyun.findOne({sunucu: message.guild.id, user: message.author.id}, async(err, res) => {
if(!res) return message.reply(`Daha önce hiç oynamamışsın hesap açtırarak işe başlayabilirsin.\n\`!hesapaç\` yazman yeterli olacaktır.`)
if(!res.coin) return message.reply(`Hiç coinin yok!`) 
if(res.coin < betCoin) return message.reply(`Bu miktarla oynayabilmek için \`${betCoin - res.coin}\` daha coine ihtiyacın var.`) 
})*/

let data = await oyun.findOne({sunucu: message.guild.id, user: message.author.id}, async(err, res) => {
    if(!res) return message.reply(`Hey! Dur biraz, oyunlarımızı oynabilmen için ilk önce kendi coin hesabını oluşturman gerekiyor. \n\`!hesapoluştur\` yazarak kendi hesabını oluşturabilirsin.`)
    if(!res.coin) return message.reply(`Hiç coinin yok!`) 
    if(res.coin < betCoin) return message.reply(`Bu miktarla oynayabilmek için \`${betCoin - res.coin}\` daha coine ihtiyacın var.`) 

let slotMessage = await message.channel.send(`
\`___SLOTS___\`
  ${slotgif1} ${slotgif2} ${slotgif3}
**\`|         |\`**
**\`|         |\`**
`)


setTimeout(() => {
if(mainslot1 === mainslot2 && mainslot1 === mainslot3 ) {
let carpma = betCoin * 2
data.coin = (data.coin + carpma)
data.save();

slotMessage.edit(`
\`___SLOTS___\`
  ${mainslot1} ${mainslot2} ${mainslot3}
\`|         |\`
\`|         |\`
**${message.member.displayName}** $${carpma} coin kazandı!`)
} else {
data.coin = (data.coin - betCoin)
data.save();
slotMessage.edit(`
\`___SLOTS___\`
  ${mainslot1} ${mainslot2} ${mainslot3}
**\`|         |\`**
**\`|         |\`**
**${message.member.displayName}**  $${betCoin} coin kayıp ettin. :/`)
}
}, 2500)


})
}}
module.exports = Slot;
