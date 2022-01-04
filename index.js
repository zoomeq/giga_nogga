(async () => {
    require('dotenv').config()
    const Discord = require('discord.js');
    const client = new Discord.Client({intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_VOICE_STATES, Discord.Intents.FLAGS.GUILD_WEBHOOKS, Discord.Intents.FLAGS.GUILD_INVITES]});
    client.commands = new Discord.Collection();
    const prefix = process.env.PREFIX;
    const token = process.env.BOT_TOKEN;
    const fs = require('fs');
    const delay = (msec) => new Promise((resolve) => setTimeout(resolve, msec));
    const clientId = process.env.CLIENTID;
    const ttvToken = process.env.TTVTOKEN;
    const {ApiClient} = require('twitch');
    const {StaticAuthProvider} = require('twitch-auth');
    const authProvider = new StaticAuthProvider(clientId, ttvToken);
    const apiClient = new ApiClient({authProvider});
    const CronJob = require('cron').CronJob;
    const db = require('quick.db');
    const logs = require('discord-logs');
    const {Player} = require('discord-music-player');
    const player = new Player(client);
    
    client.player = player;
    logs(client);
    
    const messhook = new Discord.WebhookClient({url: process.env.MESSHOOK});
    const voicehook = new Discord.WebhookClient({url: process.env.VOICEHOOK});
    const TTVChannel = new Discord.WebhookClient({url: process.env.TTVCHANNEL});
    
    const commandFiles = fs.readdirSync(`./commands`).filter(file => file.endsWith(`.js`));

    for(const file of commandFiles) {
        const commandN = require(`./commands/${file}`);
        client.commands.set(commandN.name, commandN);
    }
    
    client.login(token);
    
    
    
    async function isStreamLive(userName){
        const user = await apiClient.helix.users.getUserByName(userName);
        if(!user){
            return false;
        }
        return user.getStream();
    }
    
    client.once('ready', async () => {
        console.log('Ready!');
        console.log('Loaded commands:');
        for(const command of client.commands){
            console.log(command.name);
        };
        
        //stream checker
        var xayoo = new CronJob('0 */1 * * * *', async () => {
            let streamStatus = await isStreamLive('Xayoo_').catch((error) => {
                console.error(error);
                return;
            });
            let user = 'xayoo'
            let a = db.get(user).toString();
            if(streamStatus != null && a == 'false'){
                try{
                    TTVChannel.send('Xayoo właśnie odpalił streama:\nhttps://www.twitch.tv/xayoo_',{
                        username: 'Stream Checker',
                        avatarURL: client.user.avatarURL({dynamic: true}),
                    });
                } catch (error){
                    console.error(error);
                };
                db.delete(user);
                db.push(user, 'true');
            }else if(streamStatus == null && a == 'true'){
                db.delete(user);
                db.push(user, 'false');
            } 
        });
        xayoo.start();
        
        var popo = new CronJob('20 */1 * * * *', async () => {
            let streamStatus = await isStreamLive('Popo').catch((error) => {
                console.error(error);
                return;
            });;
            let user = 'popo'
            let a = db.get(user).toString();
            if(streamStatus != null && a == 'false'){
                try{
                    TTVChannel.send('Popo właśnie odpalił streama:\nhttps://www.twitch.tv/popo',{
                        username: 'Stream Checker',
                        avatarURL: client.user.avatarURL({dynamic: true}),
                    });
                } catch (error){
                    console.error(error);
                };
                db.delete(user);
                db.push(user, 'true');
            }else if(streamStatus == null && a == 'true'){
                db.delete(user);
                db.push(user, 'false');
            }
        });
        popo.start();
    
        var vysotzky = new CronJob('40 */1 * * * *', async () => {
            let streamStatus = await isStreamLive('vysotzky').catch((error) => {
                console.error(error);
                return;
            });;
            let user = 'vysotzky'
            let a = db.get(user).toString();
            if(streamStatus != null && a == 'false'){
                try{
                    TTVChannel.send('Vysotzky właśnie odpalił streama:\nhttps://www.twitch.tv/vysotzky',{
                        username: 'Stream Checker',
                        avatarURL: client.user.avatarURL({dynamic: true}),
                    });
                } catch (error){
                    console.error(error);
                };
                db.delete(user);
                db.push(user, 'true');
            }else if(streamStatus == null && a == 'true'){
                db.delete(user);
                db.push(user, 'false');
            }
        });
        vysotzky.start();
    
    });
    
    // globalThis.nowPlaying
    // client.player.on('songFirst', async (queue, song) => {
    //   globalThis.nowPlaying = await client.musicChannel.send(`Aktualnie leci: ${song.name}`)
    // })
    // client.player.on('songChanged', (queue, newSong, oldSong) => {
    //   globalThis.nowPlaying.edit(`Aktualnie leci: ${newSong.name}\nPoprzednio: ${oldSong.name}`)
    // })
    

      
      client.on("messageCreate", async message => {
        if (message.channel.type == "dm" || message.author.bot) return;
        if (!message.content.startsWith(prefix)) return;
        
        let args = message.content.slice(prefix.length).trim().split(/ +/g);
        let commandN = args.shift().toLowerCase();
        let guildQueue = client.player.getQueue(message.guild.id);
        const command = client.commands.get(commandN)
            || client.commands.find(cmd => cmd.alias && cmd.alias.includes(commandN));

        if(!command) return message.channel.send(`Nie ma takiej komendy!`);;
        try {
            command.run(message, args, client, guildQueue);
        } catch (error) {
            console.error(error);
            message.reply('Wystąpił nieoczekiwany błąd podczas wykonywania komendy... :c');
        }
        
        // if(command == 'patchnote' && message.author.id == '477859542588456993'){
        //     let version = args.shift();
        //     let note = args.join(' ');
            
        //     let embed = new Discord.MessageEmbed();
        //     embed.setColor('#FF0000')
        //     embed.setAuthor(message.author.username,message.author.avatarURL())
        //     embed.setTitle(`BOT PATCHNOTE v${version}`)
        //     embed.setDescription(`${note}`);
            
        //     let channel = message.guild.channels.cache.get('772805875768229929');
        //     channel.send({embeds: [embed]});
        //     embed.spliceFields(0,1);
        //     message.channel.bulkDelete(1);
        // }
        // if(command == 'play' || command == 'p'){
        //     if(!message.member.voice.channel) return message.channel.send("Najpierw dołącz do kanału głosowego :D");
        //     client.musicChannel = message.channel
        //     let queue = client.player.createQueue(message.guild.id);
        //     await queue.join(message.member.voice.channel);
        //     if(!args.join(' ').includes('playlist')){
        //       await queue.play(args.join(' ')).catch(_ => {
        //         if(!guildQueue) queue.stop();
        //       })
        //     }else{
        //       await queue.playlist(args.join(' ')).catch(_ => {
        //         if(!guildQueue) queue.stop();
        //       });
        //     }
        // }
        // if(command === 'skip') {
        //     guildQueue.skip();
        //     message.channel.send('Pominięte :D')
        // }
        // if(command === 'leave') {
        //     guildQueue.stop();
        // }
        // if(command === 'queue') {
        //     let embed = new Discord.MessageEmbed();
        //     embed.setColor('RANDOM')
        //         .setTitle('Aktualna kolejka');
        //     let j = 10
        //     if(guildQueue.songs.length < 10){
        //         j = guildQueue.songs.length
        //     }
        //     for(let i = 0; i < j; i++){
        //         embed.addField(`${i+1}. ${guildQueue.songs[i].name}`,'\u200b',false);
        //     }
        //     message.channel.send({embeds: [embed]});
        //     embed.spliceFields(0, j)
        // }
        // if(command === 'remove') {
        //     guildQueue.remove(parseInt(args[0])-1);
        //     message.channel.send('Usunięte :D')
        // }
        // if(command === 'shuffle') {
        //     guildQueue.shuffle();
        //     message.channel.send('Pomieszałem trochę w kolejce :p')
        // }
        
        
      });
    
    
    // LOGI
    //      MESSAGE
    
    client.on("messageUpdate", async (oldmess, newmess) => {
        if(oldmess.author.bot || oldmess.guild.id != '619100495423864842') return;
        let oContent = oldmess.content, nContent = newmess.content, author = oldmess.author, channelId = oldmess.channel.id;
        if(!oContent) oContent = '-----';
        if(!nContent) nContent = '-----';
        if(!author) author = '-----';
        if(!channelId) channelId = '-----';
        const embed = {
            color: 0x2ae3f7,
            author: {
                name: `Message edited!`,
                icon_url: oldmess.author.avatarURL({dynamic: true}).toString(),
            },
            fields: [
                {
                    name: `Old message:`,
                    value: oContent,
                    inline: false
                },
                {
                    name: `New message:`,
                    value: nContent,
                    inline: false
                },
                {
                    name: `Message author:`,
                    value: `<@${author.id}>`,
                    inline: false
                },
                {
                    name: `Channel:`,
                    value: `<#${channelId}>`,
                    inline: false
                },
            ],
            timestamp: Date.now()
        };
        try{
        messhook.send({
            username: client.user.username+'-logger',
            avatarURL: client.user.avatarURL({dynamic: true}),
            embeds: [embed],
        })
        } catch (error){
            console.error(error);
        };
    });
    
    client.on("messageDelete", async (message) => {
        if(message.author.bot || message.guild.id != '619100495423864842') return;
        let content = message.content, author = message.author, channelId = message.channel.id;
        if(!content) content = '-----';
        if(!author) author = '-----';
        if(!channelId) channelId = '-----'
        const embed = {
            author: {
                name: `Message deleted!`, 
                icon_url: message.author.avatarURL({dynamic: true}).toString()
            },
            color: 0x188894,
            fields:[
                {
                    name: `Message:`,
                    value: content,
                    inline: false
                },
                {
                    name: `Message author:`,
                    value: `<@${author.id}>`,
                    inline: false
                },
                {
                    name: `Channel:`,
                    value: `<#${channelId}>`,
                    inline: false
                },
            ],
            timestamp: Date.now()
        };
            try{
            messhook.send({
                username: client.user.username+'-logger',
                avatarURL: client.user.avatarURL({dynamic: true}),
                embeds: [embed],
            })
        } catch(error){
            console.error(error);
        };
    });
    
    client.on("messageDeleteBulk", async (message) => {
        if(message.last().author.bot  || message.last().guild.id != '619100495423864842') return;
        let content = message.last().content, author = message.last().author, channelId = message.last().channel.id;
        if(!content) content = '-----';
        if(!author) author = '-----';
        if(!channelId) channelId = '-----'
        const embed = {
            author: {
                name: `Message deleted (BULK)!`,
                icon_url: message.last().author.avatarURL({dynamic: true}).toString()
            },
            color: 0x074045,
            fields: [
                {
                    name: `Last message author:`,
                    value: `<@${author.id}>`,
                    inline: false
                },
                {
                    name: `Last message content:`,
                    value: `${content}`,
                    inline: false
                },
                {
                    name: `Channel:`,
                    value: `<#${channelId}>`,
                    inline: false
                },
            ],
            timestamp: Date.now()
        };
            try{
                messhook.send({
                    username: client.user.username+'-logger',
                    avatarURL: client.user.avatarURL({dynamic: true}),
                    embeds: [embed],
                })
            } catch(error){
                console.error(error);
            };
    });
    
    // //      VOICE
    
    client.on("voiceChannelJoin", (member, vcchannel) => {
        if(vcchannel.guild.id != '619100495423864842') return;
        let uId = member.user.id, vc = vcchannel.name;
        if(!uId) uId = '-----';
        if(!vc) vc = '-----';
        const embed = {
            author:{
                name: `User joined voice channel!`,
                icon_url: member.user.avatarURL({dynamic: true}).toString()
            },
            color: 0x59eae4,
            fields:[
                {
                    name: `User:`,
                    value: `<@${uId}>`,
                    inline: false
                },
                {
                    name: `Channel:`,
                    value: `${vc}`,
                    inline: false
                },
            ],
            timestamp: Date.now(),
        };
            try{
                voicehook.send({
                    username: client.user.username+'-logger',
                    avatarURL: client.user.avatarURL({dynamic: true}),
                    embeds: [embed],
                });
            } catch(error){
                console.error(error);
            };
    });
    
    client.on("voiceChannelLeave", (member, channel) => {
        if(channel.guild.id != '619100495423864842') return;
        let uId = member.user.id, vc = channel.name;
        if(!uId) uId = '-----';
        if(!vc) vc = '-----';
            const embed = {
                author:{
                    name: `User left voice channel!`,
                    icon_url: member.user.avatarURL({dynamic: true}).toString()
                },
                color: 0xe4380b,
                fields:[
                    {
                        name: `User:`,
                        value: `<@${uId}>`,
                        inline: false
                    },
                    {
                        name: `Channel:`,
                        value: `${vc}`,
                        inline: false
                    },
                ],
                timestamp: Date.now(),
            };
            try{
                voicehook.send({
                    username: client.user.username+'-logger',
                    avatarURL: client.user.avatarURL({dynamic: true}),
                    embeds: [embed],
                });
            } catch(error){
                console.error(error);
            };
    });
    
    client.on("voiceChannelSwitch", (member, oldchannel, newchannel) => {
        if(oldchannel.guild.id != '619100495423864842') return;
        let uId = member.user.id, ovc = oldchannel.name, nvc = newchannel.name;
        if(!uId) uId = '-----';
        if(!ovc) ovc = '-----';
        if(!nvc) ovc = '-----';
        const embed = {
            author: {
                name: `User switched voice channel!`,
                icon_url: member.user.avatarURL({dynamic: true}).toString()
            },
            color: 0x24e124,
            fields: [
                {
                    name: `User:`,
                    value: `<@${uId}>`,
                    inline: false
                },
                {
                    name: `Previous channel:`,
                    value: `${ovc}`,
                    inline: false
                },
                {
                    name: `Actual channel:`,
                    value: `${nvc}`,
                    inline: false
                },
            ],
            timestamp: Date.now()
        };
            try{    
                voicehook.send({
                    username: client.user.username+'-logger',
                    avatarURL: client.user.avatarURL({dynamic: true}),
                    embeds: [embed],
                });
            } catch(error){
                console.error(error);
            };
    });
    
    
    
    client.on("error", (e) => console.error(e));
    client.on("warn", (e) => console.warn(e));
    client.on("debug", (e) => console.info(e));
    
    
    return;
    })();
    
