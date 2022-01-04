module.exports = {
    name: 'remove',
    description: ``,
    alias: [],
    run: async (message, args, client, guildQueue) => {
        guildQueue.remove(parseInt(args[0])-1);
        message.channel.send('Usunięte :D')
        

    },
};