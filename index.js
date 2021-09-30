const axios = require('axios');
const config = require('./config.json')

lastgame = ``
playerstatus = ``
prevmessage = ``
content = ``

function checkplayer() {
    axios.get(`https://api.mojang.com/users/profiles/minecraft/${config.username}`, {
                
            }, {
                headers: {
                    'Host': 'api.mojang.com',
                }
            }).then(res => {
                playeruuid = res.data.id
                axios.get(`https://api.hypixel.net/status?key=${config.apikey}&uuid=${playeruuid}`, {
                            
                        }, {
                            headers: {
                                'Host': 'api.hypixel.net',
                            }
                        }).then(res => {
                            //console.log(res.data.player.lastLogin + ' : ' + res.data.player.lastLogout)
                            lastgame = res.data.session.gameType
                            content = ``
                            if(res.data.session.online){
                                playerstatus = `online`

                                console.log(`${config.username} is ${playerstatus}`)
                                content = content += `${config.username} is ${playerstatus}\n`

                                if(res.data.session.map){
                                    console.log(`On map ${res.data.session.map}`)
                                    content = content += `On map ${res.data.session.map}\n`;
                                }
                                if(res.data.session.gameType){
                                    console.log(`Playing ${res.data.session.gameType}`)
                                    content = content += `Playing ${res.data.session.gameType}\n`;
                                }
                                if(res.data.session.mode){
                                    console.log(`In mode ${res.data.session.mode}\n`)
                                    content = content += `In mode ${res.data.session.mode}\n`;
                                }
                                
                                
                                if(config.RepeatSameMessages != `yes` && prevmessage == content){
                                    return
                                }
                                axios.post(`${config.webhook}`, {
                                    "username" : config.username,
                                    "content" : content,
                                    "avatar_url" : "https://www.mc-heads.net/avatar/" + config.username
                                    }, {
                                        headers: {
                                            'Host': 'discord.com',
                                        }
                                    }).then(res => {
                                        prevmessage = content
                                })
                            }else{
                                playerstatus = `offline`
                                console.log(`${config.username} is offline`)
                                if(config.RepeatSameMessages != `yes` && prevmessage == content){
                                    return
                                }
                                axios.post(`${config.webhook}`, {
                                    "username" : config.username,
                                    "content" : config.username + " is " + playerstatus,
                                    "avatar_url" : "https://www.mc-heads.net/avatar/" + config.username
                                    }, {
                                        headers: {
                                            'Host': 'discord.com',
                                        }
                                    }).then(res => {
                                })
                            }
                            
                        })
            })
}

setInterval(function() {
    checkplayer()
}, 4000);