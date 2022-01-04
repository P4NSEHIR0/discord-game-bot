const { MessageEmbed } = require("discord.js")

module.exports = class {
    constructor(client) {
        this.client = client;
    }
  
    async run(menu) {
        if(menu.values[0] == 'game') {

           menu.reply.send(`
\`\`\`
Oyun Botu Komutları
- !account: Oyun hesabını oluşturursun!
- !money: Coin miktarını öğrenirsin!
- !moneysend: Arkadaşlarına coin yollarsın!
- !daily: 24 saatte sadece 1 kere hediyeni (coin) alırsın!
- !cf: Coin döndürürsün, kazanırsan 2 kat para alırsın!
- !s: Slot çevirirsin, kazanırsan 2 kat para alırsın!
- !market: Kazandığın coinleri markette harcayabilirsin!

UNUTMA: genel chat üzerindeki ilerleyişinize göre chate aralıklar ile resim içerisinde bir kod atılır, o kodu herkesden önce yazan hediye coin kazanır!
\`\`\`
`,true)

        }
/*
        if(menu.values[0] == 'stat') {

            menu.reply.send(`
\`\`\`
Stat Botu Komutları
- !me: Text-Voice verilerinizi görürsünüz!
- !kanallar: Bulunduğunuz kanalları ve kanal verilerini görürsünüz!
- !top: Sunucunun Top10 listesini görüntülersiniz!
- !toptext: Sadece text Top10 listesini görürsünüz!
- !topvoice: Sadece voice Top10 listesini görürsünüz!
\`\`\``,true)

        }*/
    }
        
      
      
      
    }