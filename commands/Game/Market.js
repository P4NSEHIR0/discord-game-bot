const {Discord, Message, MessageAttachment, MessageEmbed} = require('discord.js')
const Command = require('../../base/Command')
const oyun = require('../../models/game')
let limit = new Map();
class Market extends Command {
    constructor(client) {
        super(client, {
            name: "market",
            aliases: ["market","bakkal","bakkalamca"], 
        });
    }

    async run(message, args, perm) {
	    if (!message.guild) return;
		//let kanallar = this.client.config.channels.GameChannel
		if (message.channel.id == this.client.config.channels.generalChat) return message.reply(`Bu komutu chat kanalında kullanamazsın.`).then(x => x.delete({timeout: 10000}));

	   
}
}
module.exports = Market;
