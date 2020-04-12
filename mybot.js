const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

function randomInt(low, high) {
  return Math.floor(Math.random() * (high - low) + low)
}

client.on("ready", () => {
  console.log("I am ready!");
  client.user.setActivity("Tabletop RPGs", {type: "PLAYING"});
});

client.on("message", (message) => {

    if (message.author.bot) return;
    if (message.content.indexOf(config.prefix) !== 0) return; // /&test \d{1,}d\d{1,} \d{1,} .*/

    const args = message.content.slice(config.prefix.length).trim().split(/ /);
    const command = args.shift().toLowerCase();
    switch (command) {
      case "help":
        message.channel.send("USAGE : &xdy to roll x y-sided dices");
        break;
      case "test":
        break;

      default:
        if (message.content.match(/&\d{1,}d\d{1,}/) == null) {
          message.channel.send("This is not a valid command, please enter " + config.prefix + "help for usage guidelines !");
          return;
        }

        roll          = command.split(/d/);
        numberOfRolls = Number(roll.shift());
        dice          = Number(roll.shift());

        rollArray = [];
        for (var i=0; i<numberOfRolls; i++) {
          rollArray.push(randomInt(1,dice+1));
        }
    
        message.channel.send("Rolling " + numberOfRolls + " dice of " + dice);
        message.channel.send(rollArray.toString());
        break;
    }

  });

  client.login(config.token);