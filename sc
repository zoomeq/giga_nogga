(async () => {
    const Discord = require('discord.js');
    const client = new Discord.Client({ intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        Discord.Intents.FLAGS.GUILD_PRESENCES,
        Discord.Intents.FLAGS.GUILD_MEMBERS
    ]});
    const { prefix, token } = require("./config.json");
    const voice = require('@discordjs/voice');
    const play = require('play-dl');
    const delay = (msec) => new Promise((resolve) => setTimeout(resolve, msec));
    const clientId = 'shfsszr89h2ads7wekxa0wz2droq4a';
    const ttvToken = 'pvjvh3bzcwc6vgjo8hlqn2r5mbr8pw'
    const {ApiClient} = require('twitch');
    const {StaticAuthProvider} = require('twitch-auth');
    const authProvider = new StaticAuthProvider(clientId, ttvToken);
    const apiClient = new ApiClient({authProvider});
    const CronJob = require('cron').CronJob;
    const db = require('quick.db');
    const logs = require('discord-logs');

    logs(client);
    let player = voice.createAudioPlayer();
    client.login(token);

    const messhook = new Discord.WebhookClient({url: 'https://discord.com/api/webhooks/883438311543279626/VWaLA2Za2NWyzyjWBpXN4rqf2eFOUmeBtc7coLWQ6m33H21_sIxx-dUFc1RYGCoHY9TP'});
    const voicehook = new Discord.WebhookClient({url: 'https://discord.com/api/webhooks/883439406701240390/s65GFxF7SkikTxqyKytD6NbuoaoBSYP5m5dHVHbtD_wPw5B8_Z-MdjH9Og0dcckXucAc'});
    const banshook = new Discord.WebhookClient({url: 'https://discord.com/api/webhooks/883439928258723900/AG6Yssmll2arRBW4yrWfZrjZcG3EIIwiTqx69Re8O30Glj4VsQvp3ZHiAOYRSyaUXWix'});

    // async function getGuild(){
    //     return client.guilds.fetch('619100495423864842');
    // }
    
    // let guild = await getGuild();
    // let channel = await guild.channels.fetch('882321742729711637');
    // async function isStreamLive(userName){
    //     const user = await apiClient.helix.users.getUserByName(userName);
    //     if(!user){
    //         return false;
    //     }
    //     return user.getStream();
    // }
    
    client.once("ready", () => {
      console.log("Ready!");
    });
    let args, connection, serverQueue = {
      songs: [],
      durations: []
    };
    
    player.on(voice.AudioPlayerStatus.Idle, () => {
      if(!serverQueue.songs[1]) return connection.destroy();
      serverQueue.songs.shift();
      player.play(serverQueue.songs[0]);
    })
    
    client.on("messageCreate", async message => {
      if (message.author.bot) return;
      if (!message.content.startsWith(prefix)) return;
      
      args = message.content.slice(prefix.length).trim().split(/ +/);
      let command = args.shift().toLowerCase();
    
      
      if (command == 'play') {
        let vc = message.member.voice.channel;
        if(!vc) return message.channel.send('Najpierw dołącz do kanału głosowego!');
        let songS = args.join(' '), type, songAr, song;
        if(songS.includes('spotify')) return message.channel.send('Sorry, nie obsługuję jeszcze spoti :p');
        if(songS.includes('soundcloud')) return message.channel.send('Sorry, nie obsługuję jeszcze soundclouda :p');
        if(!type || type == 'yt_video'){
          songAr = await play.search(songS, {limit: 1});
          song = songAr[0];
        }else if(type == 'yt_playlist'){
          return message.channel.send('Sorry, nie obsługuję jeszcze playlist :p');
        }
        let stream = await play.stream(song.url);
        let resource = voice.createAudioResource(stream.stream, {
          inputType: stream.type
        });
        message.channel.send(`Właśnie dodałem do kolejki: ${song.url}`)
    
        serverQueue.songs.push(resource);
        serverQueue.durations.push(song.durationInSec)
        if(!connection){
          connection = voice.joinVoiceChannel({
            channelId: vc.id,
            guildId: vc.guild.id,
            adapterCreator: vc.guild.voiceAdapterCreator,
          });
          connection.subscribe(player);
          player.play(serverQueue.songs[0]);
        }
        
        
      } else if (command == 'skip') {
        if(!serverQueue.songs[1]){
          message.channel.send(`Nie było czego pomijać, rozłączyłem się.`)
          return connection.destroy();
        }
        serverQueue.songs.shift();
        player.play(serverQueue.songs[0]);
        message.channel.send(`Pomienięte!`);
      } else if (command == 'stop') {
        serverQueue.songs = [];
        serverQueue.durations = [];
        connection.destroy();
      } else {
        message.channel.send("Podaj prawidłową komendę!");
      }
    });
    
    
    
    
    
    
    })();
    