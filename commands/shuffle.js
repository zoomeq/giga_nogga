module.exports = {
    name: 'shuffle',
    description: ``,
    alias: [],
    run: async (message, args, client, guildQueue) => {
        guildQueue.shuffle();
        message.channel.send('Pomieszałem trochę w kolejce :p')
        

    },
};