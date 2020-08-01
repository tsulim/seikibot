module.exports = {
    name: 'help',
    description: 'Show all commands',
    execute(msg, args) {
        msg.channel.send({embed: {
            color: 0x0080ff,
            title: "Command List",
            description: "Still working on the bot but here are the working and available commands for you :D",
            fields: [{
                name: "Available Commands",
                value: "`help` `ping`",
            }],
            timestamp: new Date(),
            footer: {
                icon_url: "https://cdn.discordapp.com/avatars/516303284873461760/e1a7397683aed74e04b46e2be2c03913.png?size=1024",
                text: "© Example",
            }            
        }});
    },
};