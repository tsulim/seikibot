const Discord = require('discord.js');
const moment = require('moment');
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

// Check calendarEvents
function CheckEvents(){
    console.log("Checking Reminders...");
    var currentDate = moment().format('YYYY-MM-DD')
    var currentTime = moment().format('HH:mm').split(':')
    var currentTimeMinutes = (60 * parseInt(currentTime[0])) + parseInt(currentTime[1]);

    var infoArray = [];

    calendarEvent.findAll({
        where: {
            eventDate: currentDate,
            status: "ongoing",
        }
    }).then((events) => {
        events.forEach(event => {
            infoArray[0] = event.eventName;
            infoArray[1] = event.eventDate;
            infoArray[2] = event.eventStart;
            infoArray[3] = event.channelID;
            infoArray[4] = event.serverID;

            eventStartMinutesArr = [];
            eventStartMinutesArr = infoArray[2].split(':');
            var eventStartMinutes = (60 * parseInt(eventStartMinutesArr[0])) + parseInt(eventStartMinutesArr[1]);
            console.log(eventStartMinutes)
            if ( (((eventStartMinutes - 720) == currentTimeMinutes) ||
                    ((eventStartMinutes - 60) == currentTimeMinutes) ||
                    ((eventStartMinutes - 30) == currentTimeMinutes) ||
                    ((eventStartMinutes - 10) == currentTimeMinutes)) &&
                currentDate == infoArray[1]) {
    
                console.log("reminder sent");
                SendReminder(infoArray[0], infoArray[1], infoArray[2], infoArray[3], (eventStartMinutes - currentTimeMinutes));
            } else if ((eventStartMinutes == currentTimeMinutes) &&
            currentDate == infoArray[1]) {
                calendarEvent.update({
                    eventName: infoArray[0],
                    eventDate: infoArray[1],
                    eventStart: infoArray[2],
                    channelID: infoArray[3],
                    serverID: infoArray[4],
                    status: "completed",
                });
                console.log("reminder sent");
                SendReminder(infoArray[0], infoArray[1], infoArray[2], infoArray[3], (eventStartMinutes - currentTimeMinutes));
            }
        });
    })
}

function SendReminder(eventName, eventDate, eventStart, channelID, MinutesToEvent){
    channel = bot.channels.find(channel => channel.id === channelID)
    channel.send({
        embed: {
            color: 342145,
            author: {
                name: "Reminder: " + eventName + " in : "+ MinutesToEvent +" minutes!",
            },
            title: eventName,
            fields: [{
                name: "Date",
                value: eventDate
                },
                {
                name: "Time",
                value: eventStart
                },
            ],
            timestamp: new Date(),
            footer: {
                icon_url: bot.avatarURL,

            }
        },
    });
}

setInterval(function() {
    CheckEvents();
}, 59000);

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

	// if (!bot.commands.has(commandName)) return;

    if (commandName == 'create') {
		var eventArr = new Array();

        //Splitting message to get individual variables
        eventArr = msg.content.substring(8).split(", ");
    
        var name = args.slice(0,(args.length-2)).join(" ");
        var date = moment(args[args.length-2]).format('YYYY-MM-DD');
        var start = args[args.length-1];
        var channelid = msg.channel.id;
        var serverid = msg.guild.id;

        if (!moment(date, moment.ISO_8601).isValid()|| !/\d\d:\d\d/.test(start)) {
          msg.channel.send("Please follow this date and time format \n Date : `` YYYY-MM-DD`` \n Start Time : ``HH:MM`` ");

        } else {
            var today = new Date();
            dateArray = date.split('-');
            var currentTime = moment().format('HH:mm').split(':');
            var currentTimeMinutes = (60 * parseInt(currentTime[0])) + parseInt(currentTime[1]);
            eventStartMinutesArr = start.split(':');
            var eventStartMinutes = (60 * parseInt(eventStartMinutesArr[0])) + parseInt(eventStartMinutesArr[1]);

            if (parseInt(dateArray[0]) < today.getFullYear()){
                msg.channel.send('Invalid date!');
            } else if (parseInt(dateArray[0]) == today.getFullYear() && parseInt(dateArray[1]) < (today.getMonth() + 1)) {
                msg.channel.send('Invalid date!');
            } else if ((parseInt(dateArray[1]) == (today.getMonth() + 1)) && parseInt(dateArray[2]) < today.getDate()) {
                msg.channel.send('Invalid date!');
            } else if ((parseInt(dateArray[2]) == today.getDate()) && currentTimeMinutes > eventStartMinutes) {
                msg.channel.send('Invalid time!');
            } else {
                msg.channel.send({
                    embed: {
                        color: 342145,
                        author: {
                            name: "A new event has been created: " + name + "!",
                        },
                        title: name,
                        fields: [{
                            name: "Date",
                            value: date
                            },
                            {
                            name: "Start",
                            value: start
                            },  
                        ],
                        timestamp: new Date(),
                        footer: {
                            icon_url: msg.author.avatarURL,            
                        }
                    }
                });
        
                console.log("Event array: " + eventArr);
    
                calendarEvent.create({
                    eventName: name,
                    eventDate: date,
                    eventStart: start,
                    channelID: channelid,
                    serverID: serverid,
                    status: "ongoing",
                });
            };
		};
	} else if (commandName == 'listevent'){
        calendarEvent.findAll({
            where: {
                serverID: msg.guild.id,
                status: "ongoing",
            }
        }).then((events) => {
            let eventlist = [];
            events.forEach(event => {
                eventlist.push({
                    name: event.eventName,
                    value: event.eventDate,
                });
            });
            if (eventlist.length > 0){
                console.log(events != [])
                msg.channel.send({
                    embed: {
                        color: 342145,
                        title: "List of Events:",
                        fields: eventlist,
                        timestamp: new Date(),
                        footer: {
                            icon_url: bot.avatarURL,
                        }
                    },
                });
            } else {
                msg.channel.send('There are no events in this server!');
            }
        })
        .catch(err =>{
            console.log(err)
            msg.channel.send('There are no events in this server!')
        })
    } else if (commandName == "choose") {
        var choices = []
        var choice = []
        args.forEach(arg => {
            if (arg == "|") {
                choicestring = choice.join(' ')
                console.log(choicestring)
                choices.push(choicestring);
                choice = []
            } else {
                choice.push(arg)
                console.log(choice)
            }
        })
        console.log(choices)
        var result = choices[Math.floor(Math.random() * choices.length)];
        msg.channel.send("<:PikaThink:682148895945785345> | <@" + msg.author.id + ">, I choose " + result)
    } else {
		try {
			bot.commands.get(commandName).execute(msg, args);
		} catch (error) {
			console.error(error);
			msg.reply('there was an error trying to execute that command!');
		}
	};
});
