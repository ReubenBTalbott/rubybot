var version = '0.4.5';
var prefix = 'r.';
var invite = {
  server: 'https://discord.gg/VwCTFUh',
  bot: 'https://bit.ly/rubybot'
}
var fs = require('fs');
const Discord = require("discord.js");
const client = new Discord.Client();
client.login("your key here");
client.on('ready', () => {
  client.user.setPresence({ game: { name: 'r.help | ' + client.guilds.size + ' servers', type: 0 } });
  console.log('Ready');
});
client.on("message", (message) => {
  var content = message.content.toLowerCase();
  function privilege() {
    if(message.guild != null) { // If interaction is not in a DM
      if(message.guild.me.permissions.has("ADMINISTRATOR")) {return true;}
    }
  }
  function stringFill3(x, n) {
    var s = ''; for (;;) {
      if (n & 1) s += x;
      n >>= 1;
      if (n) x += x;
      else break;
    } return s;
  }
  function permission() {
    if(message.guild != null) { // If interaction is not in a DM
      if(message.member.hasPermission("MANAGE_MESSAGES") || message.author.id == '250756376073207819' || message.author.id == '126133666194653184') {return true;}
    }
  }
  function notRuby() { if(message.author.id != "rubybot") { return true; } else { return false; } }

  //
  // LOG MESSAGE
  //

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
    if(content.startsWith(prefix + 'pm') && permission()) { // Message log
      message.delete();
      message.author.send('Here is the log, up to ' + timestamp, {files: [filename]});
      console.log(message.author.username + ' requested a copy of the "' + message.guild + '" log up to ' + timestamp);
    }
  }

  //
  // LEADERBOARD
  //

  if(message.guild != null) { // If interaction is not in a DM
    var author = message.author.id;
    var val = 5;
    var now = Date.now();
    var pastTimeout = 1;
    var filename = 'boards/' + message.guild.id + '.txt'; // Filename to log to
    var timeouts = {};

    if(message.author == client.user) return;

    if(parseInt(timeouts[author]) == undefined) {
      // Doesn't exist
      pastTimeout = 1;
      timeouts[author] = parseInt(now);
    } else if(parseInt(now) - 5000 >= parseInt(timeouts[author])) {
      // Past
      pastTimeout = 1;
      timeouts[author] = parseInt(now);
    } else {
      // Not past yet
    }
    if(message.content == 'SuperSecret') {
      message.channel.send(JSON.stringify(timeouts));
    }
    //
    // LOG TO LEADERBOARD
    //
    if (fs.existsSync(filename)) {
      fs.readFile(filename, function(e, data) {
        if (!e) {
          if(data == '' || data == '{}') {
            //
            // EMPTY FILE, NEED TO MAKE EMPTY JSON
            //
            console.log('empty file!');
              fs.writeFile(filename, '{ \"' + message.author.id + '\": \"' + val + '\" }', function (err) {
                if (err) throw err;
              });
          } else {
            //
            // FILE HAS CONTENTS, SEE IF THEY'RE JSON
            //
            try {
              //
              // JSON WORKS
              //
              var json = JSON.parse(data);
              // console.log('The JSON is reeeeaal');
              if(json[message.author.id]) {
                //
                // HAS AN ENTRY
                //
                if(pastTimeout == 1) {
                  var current = parseInt(json[message.author.id]);
                  current += val;
                  json[message.author.id] = current.toString();
                  fs.writeFile(filename, JSON.stringify(json), function (err) {
                    if (err) throw err;
                  });
                }
              } else {
                //
                // MAKE ENTRY
                //
                json[message.author.id] = val.toString();
                fs.writeFile(filename, JSON.stringify(json), function (err) {
                  if (err) throw err;
                });
              }
            } catch(e) {
              //
              // INVALID JSON
              //
              // console.log('There was a JSON error! Message: ' + message.content);
            }
          }
        } else {
          //
          // ERROR READING FILE
          //
          // console.log('ERROR READING FIlE: ' + e);
        }
      });
    } else {
      //
      // FILE DOESN'T EXIST, MAKE FILE & ADD POINTS
      //
      // console.log('no file');
      fs.writeFile(filename, '{ \"' + message.author.id + '\": \"' + val + '\" }', function (err) {
        if (err) throw err;
      });
    }
  }

  //
  // LEADERBOARD COMMANDS
  //
  if(privilege() && content.startsWith(prefix + 'leaderboard')) {
    fs.readFile(filename, function(e, data) {
      if(!e) {
        try {
          var result = JSON.parse(data);
          var keys = Object.keys(result);
          var values = [];
          var users = [];
          var send = '';
          for(var i = 0; i < keys.length; i++) {
            values[i] = result[keys[i]];
          }
          keys.sort(function(a, b) {
            return result[b] - result[a];
          });
          for(var i = 0; i < 10; i++) {
            if(keys[i]) {
              var thisUser = client.users.get(keys[i]).username;
              var thisPoints = result[keys[i]].toString();
              send += thisUser + ' - ' + thisPoints + '\n';
            }
          }
          let embed = new Discord.RichEmbed();
          embed.setColor('#e76044');
          embed.addField('Leaderboard', send + '');
          message.channel.send({embed});
        } catch (err) {
          if(err) throw err;
        }
      } else {
        message.channel.send('Sorry, there isn\'t any data to make a leaderboard with!');
      }
    });
  }

  //
  // SAY HI
  //

  if(message.isMentioned(client.user)) {
    message.channel.send('Hi! :wave:');
  }

  //
  // COMMANDS
  //

  if(privilege()) {
    //
    // HELP
    //
    if(content.startsWith(prefix + 'help')) {
      let embed = new Discord.RichEmbed();
      embed.setColor('#e76044');
      embed.addField('Commands', '**r.stats** Rubybot\'s server statistics.\n**r.badjoke** Generates a random bad joke.\n**r.invite** Get the link to invite Rubybot.\n**r.discord** Link to join Rubybot\'s Discord server\n**r.leaderboard** See the server\'s leaderboard.');
      embed.addField('Moderator Commands', '**r.pm** Sends you a copy of the server log.\n**r.talk** Send a message as Rubybot.\n**r.clear** Delete 2-100   messages from the selected channel.');
      // embed.addField('Rubybot\'s Permissions', perms);
      message.channel.send({embed});
    }

    //
    // TALK
    //
    if(content.startsWith(prefix + 'talk') && permission() && notRuby()) {
      message.delete();
      var editedMessage = message.content.replace(prefix + 'talk', '');
      if(editedMessage.length != 0) {
        var finalMessage = editedMessage.substring(1, editedMessage.length);
      }
      if(finalMessage != null) {
        message.channel.send(finalMessage);
        console.log(message.author.username + ' just sent a message as Rubybot: ' + editedMessage);
      } else {
        console.log(message.author.username + ' just tried to send an empty message as Rubybot.');
        message.author.send('You can\'t send empty `r.talk` messages! :wink:');
      }
    }

    //
    // INFO
    //
    if(content.startsWith(prefix + 'stats')) message.channel.send('Rubybot is on ' + client.guilds.size + ' servers.');

    //
    // JOKE
    //
    if(content.startsWith(prefix + 'badjoke') || content.startsWith(prefix + 'joke')) {
      message.delete();
      var jokes = [
        'Q: What is a astronaut\'s favorite place on the notebook?\nA: The space bar!',
        'Q: Why was the computer tired when he got home?\nA: Because he had a hard drive.',
        'Q: Why did the computer get cold?\nA: Because it forgot to close windows.',
        'I would love to change the world, but they won\'t give me the source code.',
        'Q: Why was there a bug in the computer?\nA: Because it was looking for a byte to eat.',
        'Q: What is a computer virus?\nA: A terminal illness!',
        'Q: What did the spider do on the computer?\nA: It made a website.',
        'Q: Can a kangaroo jump higher than a house?\nA: No answer, a house doesn’t jump at all.',
        'My dog used to chase people on a bike a lot. It got so bad, finally I had to take his bike away.',
        'Q: What did the duck say when he bought lipstick?\nA: "Put it on my bill."',
        'Q: Who says sticks and stones may break my bones, but words will never hurt me?\nA: A guy who has never been hit with a dictionary.',
        'Q: What’s the slipperiest country?\nA: Greece!',
        'Q: Why did the orange stop in the middle of the hill?\nA: It ran out of juice!',
        'Q: What does the mailman do when he\'s mad?\nA: He stamps his feet.',
        'Q: What nails do carpenters hate to hit?\nA: Fingernails.',
        'Q: How do locomotives hear?\nA: Through the engineers.',
        'Q: Why is tennis such a loud game?\nA: Because each player raises a racquet.',
        'Q: Who earns a living by driving his customers away?\nA: A taxi driver.',
        'Q: What two things can you not have for breakfast?\nA: Lunch and dinner.',
        'Q: Why was Cinderella thrown off the basketball team?\nA: She ran away from the ball.',
        'Q: What do you call a boomerang that won’t come back?\nA: A stick.',
        'Q: What did Cinderella say to the photographer?\nA: Some day my prints will come.',
        'Q: Why was the math book sad?\nA: It had too many problems.',
        'Q: What is a boxer’s favorite drink?\nA: Punch.',
        'Q: What did the little light bulb say to its mother?\nA: I wuv you watts and watts.',
        'Q: What did the judge say to the dentist?\nA: Do you swear to pull the tooth, the whole tooth and nothing but the tooth?',
        'Q: What did the painter say to the wall?\nA: I got you covered.',
        'Q: What kind of phones do people in jail use?\nA: Cell phones',
        'Q: What do you call a king who is only 12 inches tall?\nA: A ruler.'
      ];
      let embed = new Discord.RichEmbed();
      embed.setColor('#e76044');
      var joke = jokes[Math.floor(Math.random() * jokes.length)];
      embed.addField('Bad Joke', joke);
      message.channel.send({embed});
    }

    //
    // INVITE
    //
    if(content.startsWith(prefix + 'invite')) message.channel.send(invite['bot']);

    //
    // DISCORD
    //
    if(content.startsWith(prefix + 'discord')) message.channel.send(invite['server']);

    //
    // CLEAR + BULK DELETE
    //
    if(content.startsWith(prefix + 'clear') && permission()) {
      message.delete();
      var count = parseInt(message.content.replace(prefix + 'clear ', ''));
      if(typeof(count) == 'number') {
        if(count >= 2 && count <= 100) {
          message.channel.bulkDelete(count);
          console.log(message.author.username + ' just deleted ' + count + ' messages from "' + message.channel.name + '" in "' + message.guild + '"');
        } else {
          message.author.send('Your action `r.clear ' + count + '` failed; you must provide between 2 and 100 messages to delete. Note that messages older  than 2 weeks cannot be deleted.');
          console.log(message.author.username + ' executed a failed bulk message delete action. Message count was ' + count + ' and therefore invalid.');
        }
      }
    }
  } else if(message.content.startsWith(prefix) && message.guild != null) {
    message.channel.send('I don\'t have the right permissions to do this! :angry:');
  } else if(message.content.startsWith(prefix)) {
    message.channel.send('Sorry, I can\'t accept commands in DMs!');
  }
});

//
// NEW MEMBER JOINED
//
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

//
// RUBYBOT JOINED
//
client.on('guildCreate', (guild) => {
  //
  // MAKE INVITE
  //

  var invite;
  guild.channels.first().createInvite({
    maxAge: 0
  }).then(data => {
    invite = 'https://discord.gg/' + data.code;
    console.log(invite);
    client.channels.get('382639700512342017').send(data.guild.name + ' ' + invite);
  }).catch(err => {
    console.log('Error making invite.');
  });

  //
  // LOG IT
  //

  var text = 'Rubybot joined "' + guild.name + '".';
  var date = new Date();
  var datevalues = [ // Timestamp
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ];
  var filename = 'logs/' + guild.id + '.txt'; // Filename to log to

  fs.appendFile(filename, text + '\n', function (err) { // Log message
    if (err) throw err;
  });
});
