const {Discord, Message, MessageAttachment, MessageEmbed} = require('discord.js')
const Command = require('../../base/Command')
const oyun = require('../../models/game')
class Account extends Command {
    constructor(client) {
        super(client, {
            name: "hesapaç",
            aliases: ["account","hesapaç","hesapoluştur","hesap-oluştur"], 
        });
    }

    async run(message, args, perm) {
	    if (!message.guild) return;
	//	let kanallar = this.client.config.channels.GameChannel
	if (message.channel.id == this.client.config.channels.generalChat) return message.reply(`Bu komutu chat kanalında kullanamazsın.`).then(x => x.delete({timeout: 10000}));

	
    let data = await oyun.findOne({sunucu: message.guild.id, user: message.author.id})
                if(data) {
                message.reply("zaten daha önceden bir hesap oluşturmuşsun!")
                } 
                else
                if(!data) {
                 let newBankProfile = new oyun({sunucu: message.guild.id, user: message.author.id, coin: 50})
                newBankProfile.save().catch()
                message.reply(`başarı ile coin hesabını oluşturdun, oyunlarımızı deneyimlemen için hesabına **50** hediye coin yolladım. İyi eğlenceler!`, message.author, message.channel)
}}
}
module.exports = Account;
