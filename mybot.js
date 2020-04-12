const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

function randomInt(low, high) {
  return Math.floor(Math.random() * (high - low) + low)
}

function lower(a, b) {
  return (a < b);
}

function greater(a, b) {
  return (a > b);
}

function doRolls(rollCommand) {
  roll          = rollCommand.split(/d/);
  numberOfRolls = Number(roll.shift().toLowerCase());
  dice          = Number(roll.shift().toLowerCase());

  rollArray = [];
  for (var i=0; i<numberOfRolls; i++) {
    rollArray.push(randomInt(1,dice+1));
  }

  return rollArray();
}

function getNbRolls(rollCommand) {
  roll          = rollCommand.split(/d/);
  numberOfRolls = Number(roll.shift().toLowerCase());
  return numberOfRolls;
}

function testAgainstSummedRolls(rollCommand, test, comparisonFunction) {
  rolls = doRolls(rollCommand);
  nbRolls = getNbRolls(rollCommand);

  rollval = 0;
  for (var i=0; i<nbRolls; i++) {
    rollval += rolls.shift();
  }

  return comparisonFunction(rollval, test);
}

function multipleTests(rollCommand, test, comparisonFunction) {

}

client.on("ready", () => {
  console.log("I am ready!");
  client.user.setActivity("Tabletop RPGs", {type: "Playing"});
});

client.on("message", (message) => {

    if (message.author.bot) return;
    if (message.content.indexOf(config.prefix) !== 0) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ /);
    const command = args.shift().toLowerCase();
    switch (command) {
      case "help":
        message.channel.send("USAGE : &xdy to roll x y-sided dices");
        break;

      case "test":
        if (message.content.match(/&test \d{1,}d\d{1,} \d{1,}.*/) == null) {
          message.channel.send("ERROR : unexpected arguments or arguments missing, please use &help for usage guidelines !");
          return;
        } else {
          roll           = args.shift().toLowerCase();
          testTreshold   = args.shift().toLowerCase();
          testComp       = args.shift();
          if (testComp !== undefined) {
            testComp = testComp.toLowerCase();
          }
          testAgainstSum = args.shift(); // test if arg is there with testSum === undefined
          if (testAgainstSum !== undefined) {
            testAgainstSum = testAgainstSum.toLowerCase();
          }

          if (testComp === undefined) {
            comparison = lower;
          } else {
            switch (testComp) {
              case "l":
              case "lower":
              case "b":
              case "below":
              case "low":
              case "d":
              case "down":
                comparison = lower;
                break;
              case "a":
              case "above":
              case "g":
              case "gt":
              case "greater":
              case "great":
                comparison = greater;
                break;

              default:
                message.channel.send("ERROR : unexpected argument, please use &help for usage guidelines !");
                return;
            }
            if (testAgainstSum === undefined) {
              testFunc = testAgainstSummedRolls;
            }
            else {
              switch (testAgainstSum) {
                case "y":
                case "yes":
                case "o":
                case "oui":
                case "sum":
                case "s":
                  testFunc = testAgainstSummedRolls;
                  break;
                case "n":
                case "no":
                case "m":
                case "multiple":
                case "multi":
                case "non":
                  testFunc = multipleTests;
                  break;
                
                default:
                  message.channel.send("ERROR : unexpected argument, please use &help for usage guidelines !");
                  return;
              }
            }

          }

          success = testFunc(roll, testTreshold, comparison);
          if (success.length >1) {
            // TO DO
            // multi test output here
          } else {
            // TO DO
            // single summed-roll test output here
          }
        }
        break;

      default:
        if (message.content.match(/&\d{1,}d\d{1,}/) == null) {
          message.channel.send("This is not a valid command, please enter " + config.prefix + "help for usage guidelines !");
          return;
        }

        rollArray = doRolls(command);
    
        message.channel.send("Rolling " + numberOfRolls + " dice of " + dice);
        message.channel.send(rollArray.toString());
        break;
    }

  });

  client.login(config.token);