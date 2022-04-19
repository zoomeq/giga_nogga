module.exports = {
    name: 'remove',
    description: ``,
    alias: [],
    run: async (message, args, client, guildQueue) => {
        guildQueue.remove(parseInt(args[0])-1);
        client.player.emit('songChanged', guildQueue);

    },
};