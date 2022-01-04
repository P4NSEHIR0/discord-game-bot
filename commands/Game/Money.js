const {Discord, Message, MessageAttachment, MessageEmbed} = require('discord.js')
const Command = require('../../base/Command')
const oyun = require('../../models/game')
let limit = new Map();
class Money extends Command {
    constructor(client) {
        super(client, {
            name: "coin",
            aliases: ["para", "money", "cash", "param", "balance"], 
        });
    }

    async run(message, args, perm) {
	    if (!message.guild) return;
		let kanallar = this.client.config.channels.GameChannel
	if (!kanallar.includes(message.channel.name)) return message.reply(`${kanallar.map(x => `Bu botu yalnızca ${this.client.channels.cache.find(chan => chan.name == x)} kanallarında kullanabilirsin`)}.`).then(x => x.delete({timeout: 10000}));

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if(!member) { 
        oyun.findOne({sunucu: message.guild.id, user: message.author.id}, async(err, res) => {
            if(!res) return message.reply(`Hey! Dur biraz, para miktarını öğrenebilmen için ilk önce kendi coin hesabını oluşturman gerekiyor. \n\`!hesapoluştur\` yazarak kendi hesabını oluşturabilirsin.`)
        message.reply(`${this.client.emojis.cache.find(x => x.name === this.client.config.emoji.Money)}| toplamda **${res.coin}** coine sahipsin!`)
       })}

       if(member) { 
        oyun.findOne({sunucu: message.guild.id, user: member.id}, async(err, res) => {
            if(!res) return message.reply(`Belirttiğin **${member.user.username}** kişisinin bir coin hesabı yok. Kendisinden \`!hesapoluştur\` komutu ile bir coin hesabı oluşturmasını isteyip daha sonra tekrardan deneyebilirsin.`)
            message.reply(`${this.client.emojis.cache.find(x => x.name === this.client.config.emoji.Money)}| **${member.user.username}** toplamda **${res.coin}** coine sahip!`)
       })}
}}
module.exports = Money;
