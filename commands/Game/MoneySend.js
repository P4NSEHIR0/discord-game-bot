const {Discord, Message, MessageAttachment, MessageEmbed} = require('discord.js')
const Command = require('../../base/Command')
const oyun = require('../../models/game')
let limit = new Map();
class MoneySend extends Command {
    constructor(client) {
        super(client, {
            name: "send",
            aliases: ["paragonder", "paragönder","para-gönder","para-gonder","coingönder","moneysend"], 
        });
    }

    async run(message, args, perm) {
	    if (!message.guild) return;
		let kanallar = this.client.config.channels.GameChannel
	if (!kanallar.includes(message.channel.name)) return message.reply(`${kanallar.map(x => `Bu botu yalnızca ${this.client.channels.cache.find(chan => chan.name == x)} kanallarında kullanabilirsin`)}.`).then(x => x.delete({timeout: 10000}));

	
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!member) return message.reply(`Bir üye etiketle ve tekrardan dene.`)

    if(member.id === message.author.id) return message.reply("Kendine para gönderemezsin!")
    let betCoin = Number(args[1])
    if(!betCoin || !Number(args[1])) return message.reply(`Göndermek istediğin coin miktarını girmelisin!`)
    let data = await oyun.findOne({sunucu: message.guild.id, user: member.id})
    let can = await oyun.findOne({sunucu: message.guild.id, user: message.author.id})
    if(can.coin < betCoin) return message.reply("belirttiğin miktarda coinin yok")

   
           
       if(!data) { /*let newBankProfile = new oyun({sunucu: message.guild.id, user: member.id, coin: betCoin})
          newBankProfile.save().catch()*/
            message.reply(`para göndermek istediğin **${member.user.username}** kişisinin bir coin hesabı yok! Lütfen kendisinden \`!hesapoluştur\` komutu ile bir hesap oluşturmasını isteyip daha sonra tekrardan para göndermeyi dene.`)
            } else {
                data.sunucu = message.guild.id;
                data.user = member.id;
                data.coin = (data.coin + betCoin);
                data.save();
                message.reply(`Belirttiğin **${member.user.username}** kişisine başarı ile **${betCoin}** miktar coin gönderdin`)
                can.sunucu = message.guild.id;
                can.user = message.author.id;
                can.coin = (can.coin - betCoin);
                can.save();
        }
       
}}
module.exports = MoneySend;
