module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run() {
    await this.client.wait(1000);
    this.client.appInfo = await this.client.fetchApplication();
    setInterval(async () => {
      this.client.appInfo = await this.client.fetchApplication();
    }, 60000);
    const guild = this.client.guilds.cache.get(this.client.config.guildID);
		if(guild) {
			await guild.members.fetch();
			console.log(`${guild.name} Üyeleri fetchlendi`)
		}
    let kanal = this.client.channels.cache.filter(x => x.type === "voice" && x.id === this.client.config.channels.botVoiceChannel);
  
    setInterval(() => {
        const customStatus = this.client.config.botStatus
        const reloadStatus = Math.floor(Math.random() * (customStatus.length));
        this.client.user.setPresence({ activity: {
      name: customStatus[reloadStatus]
     },
      status: "dnd" 
     });
        kanal.map(channel => {
          if (channel.id === this.client.config.channels.botVoiceChannel) {
            if (channel.members.some(member => member.id === this.client.user.id)) return;
            if (!this.client.channels.cache.get(this.client.config.channels.botVoiceChannel)) return;
            this.client.channels.cache.get(channel.id).join().then(x => console.log("Bot başarılı bir şekilde ses kanalına bağlandı")).catch(() => console.log("Bot ses kanalına bağlanırken bir sorun çıktı Lütfen Yetkileri kontrol ediniz!"));
          } else return;
        });
      }, 10000);    
      this.client.logger.log(`${this.client.user.tag}, kullanıma hazır ${this.client.users.cache.size} kullanıcı, ${this.client.guilds.cache.size} sunucu.`, "ready");

      }
};
