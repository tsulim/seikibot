const Discord = require('discord.js');
const botCommands = require('./commands');

const bot = new Discord.Client();
bot.commands = new Discord.Collection();

Object.keys(botCommands).map(key => {
	bot.commands.set(botCommands[key].name, botCommands[key]);
});

// env file
require('dotenv').config();

const TOKEN = process.env.TOKEN;
const prefix = process.env.prefix;
const ownerID = process.env.ownerID;
const classRemindChannel = process.env.classRemindChannel;

// mySQL
const seikiDB = require('./config/DBConnection');
const calendarEvent = require('./models/calendarEvent');

bot.login(TOKEN);

// Bot on Ready
bot.on('ready', () => {
	console.info(`Logged in as ${bot.user.tag}!`);
    bot.user.setActivity("your every move", { type: "WATCHING" });
    // Connects to MySQL database
    seikiDB.setUpDB(false); // To set up database with new tables set(True)
});

// Bot on Message
bot.on('message', msg => {
    // if message from bots, return
    if (msg.author.bot) return;
    
    // DM channel, if ppl message there
    if (msg.channel.type === "dm" && msg.author.id === ownerID) {
        if (msg.author.id === ownerID) {
            if (msg.content.startsWith('-classreminder')) {
                const args = msg.content.slice(14).split(",");
                const title = args.shift();
                const reminderinfo = args.shift();
                const reminderchannel = bot.channels.find(channel => channel.id === classRemindChannel);
                reminderchannel.send({
                    embed: {
                        color: 342145,
                        title: title,
                        fields: [{
                            name: "Info",
                            value: reminderinfo
                            }
                        ],
                        timestamp: new Date(),
                        footer: {
                            icon_url: msg.author.avatarURL,            
                        }
                    }
                });
                return;
            } else if (msg.content.startsWith('-')) {
                msg.reply("Hey! A command!");
                return;
            } else {
                msg.reply("Command: `-classreminder` reminderinfo")
            }
        } else return;
    };

    // Bot get pinged
	if (msg.content.includes(bot.user.id)) {
        // Send acknowledgement message
        msg.channel.send("Hey! Who mentioned me")
    }

    // Message does not start with command prefix, return
	if (!msg.content.startsWith(prefix)) return;

    // splits msg content into an Array called args
	const args = msg.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();     // Command name is pushed into a variable
	console.info(`Called command: ${commandName}`);     // print commandname

	if (!bot.commands.has(commandName)) return;

    try {
        bot.commands.get(commandName).execute(msg, args);
    } catch (error) {
        console.error(error);
        msg.reply('there was an error trying to execute that command!');
    }
});
