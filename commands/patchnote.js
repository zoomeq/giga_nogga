const Discord = require('discord.js');

module.exports = {
    name: 'patchnote',
    description: `No patchnote i tyle :D`,
    alias: [],
    run: async (message, args, client, guildQueue) => {
        if(message.author.id == '477859542588456993'){
            let version = args.shift();
            let note = args.join(' ');
            
            let embed = new Discord.MessageEmbed();
            embed.setColor('#FF0000')
            embed.setAuthor(message.author.username,message.author.avatarURL())
            embed.setTitle(`BOT PATCHNOTE v${version}`)
            embed.setDescription(`${note}`);
            
            let channel = message.guild.channels.cache.get('772805875768229929');
            channel.send({embeds: [embed]});
            embed.spliceFields(0,1);
            message.channel.bulkDelete(1);
        }
    },
};