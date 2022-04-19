function embedGen(embed, guildQueue){
    let song1, song2, song3, song4, songNum;
    if(guildQueue.songs[0] != null){
        song1 = guildQueue.songs[0].name;
    }else{
        song1 = '-----';
    }
    if(guildQueue.songs[1] != null){
        song2 = guildQueue.songs[1].name;
    }else{
        song2 = '-----';
    }
    if(guildQueue.songs[2] != null){
        song3 = guildQueue.songs[2].name;
    }else{
        song3 = '-----';
    }
    if(guildQueue.songs[3] != null){
        song4 = guildQueue.songs[3].name;
    }else{
        song4 = '-----';
    }
    if(guildQueue.songs[4] != null){
        songNum = (guildQueue.songs.length - 4);
    }else{
        songNum = '0';
    }
    embed.setTitle('Music Panel');
    embed.addField('Now Playing:', song1, false);
    embed.addField('Next:', `${song2}\n${song3}\n${song4}\n...and ${songNum} more`, false);
    return embed;
};

module.exports =  embedGen;