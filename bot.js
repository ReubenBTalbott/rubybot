var version = '0.4.1';
var prefix = 'r.';
var fs = require('fs');
var readline = require('readline');
const Discord = require("discord.js");
const client = new Discord.Client();
client.login("MzQ1MjkwMTQzMTIyNDU2NTg1.DG5IBg.c4mQJTyx1kVPfJ9xOKtpTqtJFfM");
client.on('ready', () => {
  client.user.setPresence({ game: { name: 'r.help | v' + version, type: 0 } });
  console.log('Ready');
});
// client.on("channelCreate", (channel) => {
//   channel.send('First!');
// });
client.on("message", (message) => {
  function permission() {
    if(message.guild != null) { // If interaction is not in a DM
      if(message.member.hasPermission("MANAGE_MESSAGES") || message.author.username == 'chip') {return true;}
    }
  }
  function notRuby() { if(message.author.id != "rubybot") { return true; } else { return false; } }
  if(message.guild != null) { // If interaction is not in a DM
    var date = new Date();
    var datevalues = [ // Timestamp
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    ];
    var text = message.channel.name + ' - ' + message.author.username + ': "' + message.content + '"'; // Format Log Message
    var timestamp = '(' + datevalues[1] + '/' + datevalues[2] + ' - ' + datevalues[3] + ':' + datevalues[4] + ') '; // Format Log Timestamp
    var filename = 'logs/' + message.guild.id + '.txt'; // Filename to log to

    fs.appendFile(filename, timestamp + text + '\n', function (err) { // Log message
      if (err) throw err;
      // console.log(message.guild + ' / ' + message.id + ' / ' + text); // Console log it
    });
    if(message.content.toLowerCase().startsWith(prefix + 'pm') && permission()) { // Message log
      message.delete();
      message.author.send('Here is the log, up to ' + timestamp, {files: [filename]});
      console.log(message.author.username + ' requested a copy of the "' + message.guild + '" log up to ' + timestamp);
    }
  }

  //
  // COMMANDS
  //
  // if(message.member.roles.has(message.member.roles.find('name', 'Muted'))) {
  //   message.channel.send('Oh look you\'re muted! #testing');
  // }
  if(message.content.toLowerCase().startsWith(prefix + 'help')) {
    let embed = new Discord.RichEmbed();
    embed.setColor('#e76044');
    embed.addField('Commands', '**r.info** Information about the bot.')
    embed.addField('People', '**r.reuben**\n**r.chip**\n**r.william**\n');
    embed.addField('Moderator Commands', '**r.pm** Sends you a copy of the server log.\n**r.talk** Send a message as Rubybot.\n**r.clear** Delete 2-100 messages from the selected channel.');
    message.channel.send({embed});
  }
  if(message.content.startsWith(prefix + 'kill') && message.author.username == "Blue_Ruby") { console.log(message.author.username + ' used `' + prefix + 'kill` to shut down.'); exit(); }
  if(message.content.startsWith(prefix + 'reuben')) { message.channel.send('**<@126133666194653184>** is awesome! He\'s my owner. He hosts me and did a little coding help!'); }
  if(message.content.startsWith(prefix + 'musicalbird')) { message.channel.send('**<@320654624556056586>** Is one of **<@250756376073207819>** coding friends!'); }
  if(message.content.startsWith(prefix + 'william')) { message.channel.send('**<@174234835479560192>** is Reuben\'s little brother. (...nothing to say)'); }
  if(message.content.startsWith(prefix + 'chip')) { message.channel.send('**<@250756376073207819>** is my dev. He coded all them little functions. If you want all them little functions type `' + prefix + 'help` to see them all!'); }
  if(message.content.startsWith(prefix + 'tj')) { message.channel.send('TJ is one of chips friends'); }
  if(message.content.startsWith(prefix + 'talk') && permission() && notRuby()) {
    message.delete();
    var editedMessage = message.content.replace(prefix + 'talk ', '');
    message.channel.send(editedMessage);
    console.log(message.author.username + ' just sent a message as Rubybot: ' + editedMessage);
  }
  if(message.content.startsWith(prefix + 'info')) {
    let embed = new Discord.RichEmbed();
    embed.setColor('#e76044');
    embed.addField('Rubybot Info', 'Join our **Discord server**: https://discord.io/ruby\n**Invite the bot**: http://bit.ly/rubybot\nOn **' + client.guilds.size + ' servers**.\nVersion **v' + version + '**.');
    message.channel.send({embed});
  }
  if(message.content.startsWith(prefix + 'clear') && permission()) {
    message.delete();
    var count = parseInt(message.content.replace(prefix + 'clear ', ''));
    if(typeof(count) == 'number') {
      if(count >= 2 && count <= 100) {
        message.channel.bulkDelete(count);
        console.log(message.author.username + ' just deleted ' + count + ' messages from "' + message.channel.name + '" in "' + message.guild + '"');
      } else {
        message.author.send('Your action `r.clear ' + count + '` failed; you must provide between 2 and 100 messages to delete. Note that messages older than 2 weeks cannot be deleted.');
        console.log(message.author.username + ' executed a failed bulk message delete action. Message count was ' + count + ' and therefore invalid.');
      }
    }
  }
});
client.on('guildMemberAdd', (member) => {
  var text = 'New member joined: "' + member.user.username + '"';
  var date = new Date();
  var datevalues = [ // Timestamp
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ];
  var timestamp = '(' + datevalues[1] + '/' + datevalues[2] + ' - ' + datevalues[3] + ':' + datevalues[4] + ') '; // Format Log Timestamp
  var filename = 'logs/' + member.guild.id + '.txt'; // Filename to log to

  fs.appendFile(filename, timestamp + text + '\n', function (err) { // Log message
    if (err) throw err;
  });
});
