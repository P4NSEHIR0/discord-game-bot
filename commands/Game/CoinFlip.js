const {Discord, Message, MessageAttachment, MessageEmbed} = require('discord.js')
const Command = require('../../base/Command')
const oyun = require('../../models/game')
class CoinFlip extends Command {
    constructor(client) {
        super(client, {
            name: "coinflip",
            aliases: ["coinflip", "coin-flip", "cf"], 
        });
    }

    async run(message, args, perm) {
	    if (!message.guild) return;
		let kanallar = this.client.config.channels.GameChannel
	if (!kanallar.includes(message.channel.name)) return message.reply(`${kanallar.map(x => `Bu botu yalnızca ${this.client.channels.cache.find(chan => chan.name == x)} kanallarında kullanabilirsin`)}.`).then(x => x.delete({timeout: 10000}));

	
      let betCoin = Number(args[0])
        if(!betCoin || !Number(args[0])) return message.reply(`Kaç coin ile oynamak istiyorsun?`)
        if(betCoin >= 50000) return message.reply("50.000 coinden fazla bir coin ile oyun oynamayazsın")

        oyun.findOne({sunucu: message.guild.id, user: message.author.id}, async(err, res) => {
            if(!res) return message.reply(`Hey! Dur biraz, oyunlarımızı oynayabilmen için ilk önce kendi coin hesabını oluşturman gerekiyor. \n\`!hesapoluştur\` yazarak kendi hesabını oluşturabilirsin.`)
         else { 
            if(res.coin < betCoin) return message.reply(`Belirttiğin miktarda coinin yok! Belirttiğin miktarda coin ile oynayabilmek için \`${betCoin - res.coin}\` daha coine ihtiyacın var. Coin sayın (**${res.coin}** coin)`) 
            let mesaj = await message.channel.send(`
**${message.member.displayName}, \`${betCoin}\`** coin ile madeni para döndürüyor ${this.client.emojis.cache.find(x => x.name === this.client.config.emoji.CoinFlip)}`)

            setTimeout(() => { 
            //    mesaj.delete();

            let randomizeCoinCal = Math.floor(Math.random() * 10) + 1;
            if(randomizeCoinCal <= 5) {
                res.coin = (res.coin - betCoin)
                res.save();
                mesaj.edit(`
${message.author}, oynadığın **${betCoin}** coini kayıp ettin >:C`)
            } else {
                let carpma = betCoin * 2
                res.coin = (res.coin + carpma)
                res.save();
                mesaj.edit(`
${message.author}, **${carpma}** coin kazandın! ${this.client.emojis.cache.find(x => x.name === this.client.config.emoji.Coin)}`)

                
            }


            }, 2000)
        }})

}}
module.exports = CoinFlip;
