module.exports = {
    name: 'skip',
    description: `Pomija piosenkę  :D`,
    alias: [],
    run: async (message, args, client, guildQueue) => {
        guildQueue.skip();
        message.channel.send('Pominięte :D')
        

    },
};