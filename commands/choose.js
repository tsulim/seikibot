module.exports = {
    name: 'choose',
    description: 'Makes a choice for you. Split your options with |',
    execute(msg, args) {
        var choices = args.split('|');
        var result = (choices[Math.floor(Math.random() * choices.length)]).trim();
        msg.channel.send("<:PikaThink:682148895945785345> | <@" + msg.author.id + ">, I choose " + result)
    },
  };
  