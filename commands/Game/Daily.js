const {Discord, Message, MessageAttachment, MessageEmbed} = require('discord.js')
const Command = require('../../base/Command')
const oyun = require('../../models/game')
let limit = new Map();
class Daily extends Command {
    constructor(client) {
        super(client, {
            name: "daily",
            aliases: ["günlük", "bugün","gunluk"], 
        });
    }

    async run(message, args, perm) {
	    if (!message.guild) return;
		//let kanallar = this.client.config.channels.GameChannel
	if (message.channel.id == this.client.config.channels.generalChat) return message.reply(`Bu komutu chat kanalında kullanamazsın.`).then(x => x.delete({timeout: 10000}));

	
    let randomizeCoin = Math.floor(Math.random() * 450) + 1
     oyun.findOne({sunucu: message.guild.id, user: message.author.id}, async(err, data) => { 
        if(!data) return message.reply(`Hey! Dur biraz, günlük hediyeni alman ve oyunlarımızı oynabilmen için ilk önce kendi coin hesabını oluşturman gerekiyor. \n\`!hesapoluştur\` yazarak kendi hesabını oluşturabilirsin.`)
            /*   let newData = new oyun({user: message.author.id, sunucu: message.guild.id}, {$inc: {coin: randomizeCoin}, $set: {coinTime: Date.now()}}, {upsert: true})
               newData.save().catch();*/
               
        
        let timeout = 1000*60*60*24
        let gunluk = data.coinTime
        if (gunluk !== null && timeout - (Date.now() - gunluk) > 0) {
            let time = ms(timeout - (Date.now() - gunluk));
            message.reply(`Hey! Dur, günlük hediyeni zaten almışsın. Günlük hediyeni tekrardan alabilmen için ${time.hours} saat ${time.minutes} dakika ${time.seconds} saniye daha beklemelisin.`)
        } else {
        
            data.sunucu = message.guild.id;
            data.user = message.author.id;
            data.coin = (data.coin + randomizeCoin)
            data.coinTime = Date.now()
            data.save().catch();
            message.reply(`${this.client.emojis.cache.find(x => x.name === this.client.config.emoji.Money)}| Bugünlük **${randomizeCoin}** coin aldın!`)
        }   
        
    }) 
}}
module.exports = Daily;



function ms(milliseconds) {
    return {
        days: Math.trunc(milliseconds / 86400000),
        hours: Math.trunc(milliseconds / 3600000) % 24,
        minutes: Math.trunc(milliseconds / 60000) % 60,
        seconds: Math.trunc(milliseconds / 1000) % 60,
        milliseconds: Math.trunc(milliseconds) % 1000,
        microseconds: Math.trunc(milliseconds * 1000) % 1000,
        nanoseconds: Math.trunc(milliseconds * 1e6) % 1000
    };
}