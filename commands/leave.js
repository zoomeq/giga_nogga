module.exports = {
    name: 'leave',
    description: ``,
    alias: [],
    run: async (message, args, client, guildQueue) => {
        guildQueue.stop();
        

    },
};