module.exports = {
    name: 'help',
    description: 'Show all commands',
    execute(msg, args) {
        if (args[0] == "create") {
            msg.channel.send({embed: {
                color: 0x0080ff,
                title: "Help",
                description: "Create a reminder for your event",
                fields: [{
                    name: "Usage:",
                    value: "`-create <event name> <eventDate> <eventTime>`",
                    },
                    {
                    name: "Example:",
                    value: "`-create Example event name 2020-09-23 14:00`",
                    }
                ],
                timestamp: new Date(),
                footer: {
                    icon_url: "https://cdn.discordapp.com/avatars/516303284873461760/e1a7397683aed74e04b46e2be2c03913.png?size=1024",
                    text: "© Example",
                }            
            }});
        } else if (args[0] == "listevent") {
            msg.channel.send({embed: {
                color: 0x0080ff,
                title: "Help",
                description: "List you down all the ongoing events in your server",
                fields: [{
                    name: "Usage:",
                    value: "`-listevent`",
                    },
                ],
                timestamp: new Date(),
                footer: {
                    icon_url: "https://cdn.discordapp.com/avatars/516303284873461760/e1a7397683aed74e04b46e2be2c03913.png?size=1024",
                    text: "© Example",
                }            
            }});
        } else if (args[0] == "choose") {
            msg.channel.send({embed: {
                color: 0x0080ff,
                title: "Help",
                description: "Makes a choice for you. Split your options with |",
                fields: [{
                    name: "Usage:",
                    value: "`-choose one | two`",
                    },
                ],
                timestamp: new Date(),
                footer: {
                    icon_url: "https://cdn.discordapp.com/avatars/516303284873461760/e1a7397683aed74e04b46e2be2c03913.png?size=1024",
                    text: "© Example",
                }            
            }});
        } else {
            // msg.channel.send("m - minutes, s - seconds, d - days.\n\t{@User}");
            msg.channel.send({embed: {
                color: 0x0080ff,
                // author: {
                //     name: "Tsu",
                //     icon_url: "https://cdn.discordapp.com/avatars/516303284873461760/e1a7397683aed74e04b46e2be2c03913.png?size=1024",
                // },
                title: "Command List",
                description: "Still working on the bot but here are the working and available commands for you :D",
                fields: [{
                    name: "Available Commands",
                    value: "`help` `create` `listevent` `choose`",
                }],
                timestamp: new Date(),
                footer: {
                    icon_url: "https://cdn.discordapp.com/avatars/516303284873461760/e1a7397683aed74e04b46e2be2c03913.png?size=1024",
                    text: "© Example",
                }            
            }});
        }
    },
};