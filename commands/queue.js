const Discord = require('discord.js');

module.exports = {
    name: '',
    description: ``,
    alias: [],
    run: async (message, args, client, guildQueue) => {
        let embed = new Discord.MessageEmbed();
            embed.setColor('RANDOM')
                .setTitle('Aktualna kolejka');
            let j = 10
            if(guildQueue.songs.length < 10){
                j = guildQueue.songs.length
            }
            for(let i = 0; i < j; i++){
                embed.addField(`${i+1}. ${guildQueue.songs[i].name}`,'\u200b',false);
            }
            message.channel.send({embeds: [embed]});
            embed.spliceFields(0, j)
        

    },
};