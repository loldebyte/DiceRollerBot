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
    if (message.content.indexOf(config.prefix) !== 0) return;
    if (message.content.match(/&\d{1,}d\d{1,}/) == null) {
      if (message.content.match(/&help/) != null) {
        message.channel.send("USAGE : &xdy to roll x y-sided dices");
        return;
      } else return;
    };

    const args = message.content.slice(config.prefix.length).trim().split(/d/);
    const command = args.shift().toLowerCase();
    const numberOfRolls = Number(command);
    const dice          = Number(args.shift().toLowerCase());

    rollArray = [];
    for (var i=0; i<numberOfRolls; i++) {
      rollArray.push(randomInt(1,dice));
    }

    message.channel.send("Rolling " + numberOfRolls + " dice of " + dice);
    message.channel.send(rollArray.toString());
  });

  client.login(config.token);