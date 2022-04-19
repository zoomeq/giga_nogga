module.exports = {
    name: 'shuffle',
    description: ``,
    alias: [],
    run: async (message, args, client, guildQueue) => {
        guildQueue.shuffle();
        client.player.emit('songChanged', guildQueue);
        

    },
};