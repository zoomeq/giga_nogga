module.exports = {
    name: 'play',
    description: `Komenda od puszczania muzyki :D`,
    alias: ['p'],
    run: async (message, args, client, guildQueue) => {
        if(!message.member.voice.channel) return message.channel.send("Najpierw dołącz do kanału głosowego :D");
        let queue = client.player.createQueue(message.guild.id);
        await queue.join(message.member.voice.channel);
        if(!args.join(' ').includes('playlist')){
            await queue.play(args.join(' ')).catch(_ => {
            if(!guildQueue) queue.stop();
            })
        }else{
            await queue.playlist(args.join(' ')).catch(_ => {
            if(!guildQueue) queue.stop();
            });
        }
    },
};