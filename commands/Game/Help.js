const {Discord, Message, MessageAttachment, MessageEmbed} = require('discord.js')
const { MessageMenuOption,  MessageMenu, MessageActionRow } = require("discord-buttons");
const Command = require('../../base/Command')
const oyun = require('../../models/game')

let limit = new Map();
class Help extends Command {
    constructor(client) {
        super(client, {
            name: "yardım",
            aliases: ["help","bilgi","komut", "komutlar"], 
        });
    }

    async run(message, args, perm) {
	    if (!message.guild) return;
		//let kanallar = this.client.config.channels.GameChannel
		if (message.channel.id == this.client.config.channels.generalChat) return message.reply(`Bu komutu chat kanalında kullanamazsın.`).then(x => x.delete({timeout: 10000}));

	
	const can = new MessageMenuOption()
	.setLabel('Oyun Komutları')
	.setEmoji('🕹️')
	.setValue('game')
	.setDescription('Oyun Komutları')

	const can1 = new MessageMenuOption()
	.setLabel('Stat Komutları')
	.setEmoji('🔊')
	.setValue('stat')
	.setDescription('Stat Komutları')

	const select = new MessageMenu()
	.setID('select1')
	.setPlaceholder('Komut kategorisi seçin')
	.addOption(can)
	.addOption(can1)


 const Row1 = new MessageActionRow()
 .addComponent(select)   

await message.reply('Lütfen komutlarını öğrenmek istediğiniz kategoriyi seçin!', { components: [Row1] });
/*message.channel.send(
new MessageEmbed()
.setAuthor(""+message.guild.name+""+message.guild.iconURL()+"")
.setThumbnail(""+message.author.avatarURL()+"")
.addField("Game Botu Komutları", `
\`!account\`: Coin hesabınızı oluşturmayı sağlar, sadece bir kere kullanabilirsin!
\`!money\`: Coin miktarını öğrenirsin!
\`!moneysend\`: Arkadaşlarına coin yollarsın!
\`!daily\`: Günlük hediyeni (coin) alırsın, unutma bu komutu 24 saatte sadece bir kez kullanabilirsin!
\`!cf\`: Coin döndürmenize yarar. Eğer kazanırsan oynadığın paranın 2 katını alırsın, kaybedersen oynadığın paranı kaybedersin!
\`!s\`: Slot çevirirsin, kazanırsan oynadığın paranın 2 katını alırsın, kaybedersen oynadığın paranın hepsini kaybedersin!
\`!market\`: Oyun oynayarak kazandığın coin ile marketten bir şeyler satın alabilirsin! (Spotify, Netflix, Nitro)
`)
.addField("Stat Botu Komutları", `
Şuan için mevcut değil
`)
.setColor("RANDOM")
.setFooter(""+message.author.tag+" tarafından istendi!")
)*/
}
}
module.exports = Help;
