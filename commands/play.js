const embedGen = require('../handlers/embedGen');
const discord = require('discord.js');

module.exports = {
    name: 'play',
    description: `Komenda od puszczania muzyki :D`,
    alias: ['p'],
    run: async (message, args, client, guildQueue) => {
        if(!message.member.voice.channel) return message.channel.send("Join to the voice channel first!");
        let queue;
        if(!guildQueue){
        queue = client.player.createQueue(message.guild.id);
        await queue.join(message.member.voice.channel);
        queue.setData({paused: 0});
        }else{
            queue = guildQueue;
        }
        if(!args.join(' ').includes('playlist')){
            await queue.play(args.join(' ')).catch(_ => {
            if(!guildQueue) queue.stop();
            });
            let embed = new discord.MessageEmbed();
            embedGen(embed, queue);
            if(guildQueue == null){
                let msg = await message.channel.send({embeds: [embed]});
                queue.setData({msg: msg});
                msg.react('⏯️');
                msg.react('⏭️');
                msg.react('🔀');                
            }else{
                guildQueue.data.msg.edit({embeds: [embed]})
            }
            embed.spliceFields(0,5);
        }else{
            await queue.playlist(args.join(' ')).catch(_ => {
            if(!guildQueue) queue.stop();
            });
            let embed = new discord.MessageEmbed();
            embedGen(embed, queue);
            if(guildQueue == null){
                let msg = await message.channel.send({embeds: [embed]});
                queue.setData({msg: msg});
                msg.react('⏯️');
                msg.react('⏭️');
                msg.react('🔀');                
            }else{
                guildQueue.data.msg.edit({embeds: [embed]})
            }
            embed.spliceFields(0,5);
        }
    },
};