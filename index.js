(async () => {
    const Discord = require('discord.js');
    const client = new Discord.Client();
    client.commands = new Discord.Collection();
    const prefix = process.env.PREFIX;
    const token = process.env.BOT_TOKEN;
    const delay = (msec) => new Promise((resolve) => setTimeout(resolve, msec));
    const clientId = process.env.CLIENTID;
    const ttvToken = process.env.TTVTOKEN;
    const {ApiClient} = require('twitch');
    const {StaticAuthProvider} = require('twitch-auth');
    const authProvider = new StaticAuthProvider(clientId, ttvToken);
    const apiClient = new ApiClient({authProvider});
    const CronJob = require('cron').CronJob;
    const db = require('quick.db');
    const voice = require('@discordjs/voice');
    const logs = require('discord-logs');
    const fetch = require('node-fetch');
    logs(client);
    
    const messhook = new Discord.WebhookClient('883438311543279626',process.env.MESSHOOK);
    const voicehook = new Discord.WebhookClient('883439406701240390',process.env.VOICEHOOK);
    const banshook = new Discord.WebhookClient('883439928258723900',process.env.BANSHOOK);
    const TTVChannel = new Discord.WebhookClient('894977695316848650',process.env.TTVCHANNEL);
    const play = require('play-dl');
    let player = voice.createAudioPlayer();
    
    
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
                    TTVChannel.send('@here\nXayoo właśnie odpalił streama:\nhttps://www.twitch.tv/xayoo_',{
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
                    TTVChannel.send('@here\nPopo właśnie odpalił streama:\nhttps://www.twitch.tv/popo',{
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
                    TTVChannel.send('@here\nVysotzky właśnie odpalił streama:\nhttps://www.twitch.tv/vysotzky',{
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
    
      

      
      client.on("message", async message => {
        if (message.author.bot) return;
        if (!message.content.startsWith(prefix)) return;
        
        let args = message.content.slice(prefix.length).trim().split(/ +/);
        let command = args.shift().toLowerCase();
        
        if(command == 'patchnote' && message.author.id == '477859542588456993'){
            let version = args.shift();
            let note = args.join(' ');
            
            let embed = new Discord.MessageEmbed();
            embed.setColor('#FF0000')
            embed.setAuthor(message.author.username,message.author.avatarURL())
            embed.setTitle(`BOT PATCHNOTE v${version}`)
            embed.setDescription(`${note}`);
            
            let channel = message.guild.channels.cache.get('772805875768229929');
            channel.send(embed);
            embed.spliceFields(0,1);
            message.channel.bulkDelete(1);
        }
        
        
      });
    
    
    // LOGI
    //      MESSAGE
    
    client.on("messageUpdate", async (oldmess, newmess) => {
        if(oldmess.author.bot) return;
        let oContent = oldmess.content, nContent = newmess.content, author = oldmess.author, channelId = oldmess.channel.id;
        if(!oContent) oContent = '-----';
        if(!nContent) nContent = '-----';
        if(!author) author = '-----';
        if(!channelId) channelId = '-----';
        const embed = new Discord.MessageEmbed()
            .setAuthor(`Message edited!`, oldmess.author.avatarURL({dynamic: true}))
            .setColor(`2ae3f7`)
            .addFields(
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
            )
            .setTimestamp(Date.now())
        try{
        messhook.send({
            username: client.user.username+'-logger',
            avatarURL: client.user.avatarURL({dynamic: true}),
            embeds: [embed],
        }).then(() => {
            embed.spliceFields(0,4);
        });
        } catch (error){
            console.error(error);
        };
    });
    
    client.on("messageDelete", async (message) => {
        if(message.author.bot) return;
        let content = message.content, author = message.author, channelId = message.channel.id;
        if(!content) content = '-----';
        if(!author) author = '-----';
        if(!channelId) channelId = '-----'
        const embed = new Discord.MessageEmbed()
            .setAuthor(`Message deleted!`, message.author.avatarURL({dynamic: true}))
            .setColor(`188894`)
            .addFields(
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
            )
            .setTimestamp(Date.now())
            try{
            messhook.send({
                username: client.user.username+'-logger',
                avatarURL: client.user.avatarURL({dynamic: true}),
                embeds: [embed],
            }).then(() => {
                embed.spliceFields(0,3);
            });
        } catch(error){
            console.error(error);
        };
    });
    
    client.on("messageDeleteBulk", async (message) => {
        if(message.last().author.bot) return;
        let content = message.last().content, author = message.last().author, channelId = message.last().channel.id;
        if(!content) content = '-----';
        if(!author) author = '-----';
        if(!channelId) channelId = '-----'
        const embed = new Discord.MessageEmbed()
            .setAuthor(`Message deleted (BULK)!`, message.last().author.avatarURL({dynamic: true}))
            .setColor(`074045`)
            .addFields(
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
            )
            .setTimestamp(Date.now())
            try{
                messhook.send({
                    username: client.user.username+'-logger',
                    avatarURL: client.user.avatarURL({dynamic: true}),
                    embeds: [embed],
                }).then(() => {
                    embed.spliceFields(0,3);
                });
            } catch(error){
                console.error(error);
            };
    });
    
    //      VOICE
    
    client.on("voiceChannelJoin", (member, vcchannel) => {
        let uId = member.user.id, vc = vcchannel.name;
        if(!uId) uId = '-----';
        if(!vc) vc = '-----';
        const embed = new Discord.MessageEmbed()
            .setAuthor(`User joined voice channel!`, member.user.avatarURL({dynamic: true}))
            .setColor(`59eae4`)
            .addFields(
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
            )
            .setTimestamp(Date.now())
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
        let uId = member.user.id, vc = channel.name;
        if(!uId) uId = '-----';
        if(!vc) vc = '-----';
        const embed = new Discord.MessageEmbed()
            .setAuthor(`User left voice channel!`, member.user.avatarURL({dynamic: true}))
            .setColor(`e4380b`)
            .addFields(
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
            )
            .setTimestamp(Date.now())
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
        let uId = member.user.id, ovc = oldchannel.name, nvc = newchannel.name;
        if(!uId) uId = '-----';
        if(!ovc) ovc = '-----';
        if(!nvc) ovc = '-----';
        const embed = new Discord.MessageEmbed()
            .setAuthor(`User switched voice channel!`, member.user.avatarURL({dynamic: true}))
            .setColor(`24e124`)
            .addFields(
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
            )
            .setTimestamp(Date.now())
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
    
    //      BANS
    
    client.on("guildBanAdd", (guild, user) => {
        const embed = new Discord.MessageEmbed()
            .setAuthor(`User banned on server!`, user.avatarURL({dynamic: true}))
            .setColor(`980f1f`)
            .addFields(
                {
                    name: `User:`,
                    value: `${user.tag}\n${user}`,
                    inline: false
                },
            )
            .setTimestamp(Date.now())
    
            try{
                banshook.send({
                    username: client.user.username+'-logger',
                    avatarURL: client.user.avatarURL({dynamic: true}),
                    embeds: [embed],
                });
            } catch(error){
                console.error(error);
            };
        
    });
    
    client.on("guildBanRemove", (guild, user) => {
        const embed = new Discord.MessageEmbed()
            .setAuthor(`User unbanned on server!`, user.avatarURL({dynamic: true}))
            .setColor(`2ce709`)
            .addFields(
                {
                    name: `User:`,
                    value: `${user.tag}\n${user}`,
                    inline: false
                },
            )
            .setTimestamp(Date.now())
    
            try{
                banshook.send({
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
    