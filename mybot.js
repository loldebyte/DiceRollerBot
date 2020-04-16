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
  let rollz         = rollCommand;
  rollz             = rollz.split(/d/);
  let numberOfRolls = Number(rollz.shift());
  let dice          = Number(rollz.shift());

  let rollArray = [];
  for (var i=0; i<numberOfRolls; i++) {
    rollArray.push(randomInt(1,dice+1));
  }

  return rollArray;
}

function getNbRolls(rollCommand) {
  let roll          = rollCommand.split(/d/);
  let numberOfRolls = Number(roll.shift().toLowerCase());
  return numberOfRolls;
}

function getDice(rollCommand) {
  let roll = rollCommand.split(/d/);
  return Number(roll[1]);
}

function testAgainstSummedRolls(rollCommand, test, comparisonFunction, value) {
  let rolls = doRolls(rollCommand);
  let rollsBackup = [...rolls];
  let nbRolls = getNbRolls(rollCommand);

  let rollval = 0;
  for (var i=0; i<nbRolls; i++) {
    rollval += rolls.shift();
  }
  value.push(rollval);
  value.push(rollsBackup);

  return [comparisonFunction(rollval, Number(test))];
}

function multipleTests(rollCommand, test, comparisonFunction, value) {
  let rolls = doRolls(rollCommand);
  let nbRolls = getNbRolls(rollCommand);

  value.push(nbRolls);
  value.push(rolls);
  let results = []
  for (const roll in rolls) {
    results.push(comparisonFunction(rolls[roll], Number(test)));
  }
  return results;
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
          let roll           = args.shift().toLowerCase();
          let testTreshold   = args.shift().toLowerCase();
          let testComp       = args.shift();
          
          if (testComp !== undefined) { // if testComp === undefined, it means the argument was omitted
            testComp = testComp.toLowerCase();
          }
          let testAgainstSum = args.shift();
          if (testAgainstSum !== undefined) {
            testAgainstSum = testAgainstSum.toLowerCase();
          }

          if (testComp === undefined) {
            comparison = lower;
            testFunc = testAgainstSummedRolls;
            comparisonMessage = "less than";
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
                comparisonMessage = "less than";
                break;
              case "a":
              case "above":
              case "g":
              case "gt":
              case "greater":
              case "great":
                comparison = greater;
                comparisonMessage = "more than";
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
          let rollResult = [];
          let success = [];
          let rollBackup = roll;
          success = testFunc(roll, testTreshold, comparison, rollResult);
          message.channel.send(success.toString());
          message.channel.send(success.length);
          if (success.length > 1) {
            let nbRoll = rollResult.shift();
            let testsOutput = []
            for (var i=0; i<nbRoll; i++) {
              testsOutput.push(success[i] ? "success! ": "failed! ");
            }
            message.channel.send("You tried to roll  " + comparisonMessage + " " + testTreshold + " on " + success.length + " tests, and here are your tests results : " + testsOutput.toString() + "\nYou rolled " + rollResult.toString())
          } else {
            switch (success[0]) {
              case true:
                message.channel.send("You tried to roll " + comparisonMessage + " " + testTreshold + " with " + rollBackup + " and you rolled " + rollResult.shift() + " so the test succeeded !" + "\nDetailed rolls : " + rollResult.toString());
                break;

              case false:
                message.channel.send("You tried to roll " + comparisonMessage + " " + testTreshold + " with " + rollBackup + " but you rolled " + rollResult.shift() + " and the test failed !" + "\nDetailed rolls : " + rollResult.toString());
                break;

              default:
                message.channel.send("FATAL ERROR : success SHOULD BE BOOLEAN BUT IS " + success[0]);
                return;
            }
          }
        }
        break;

      default:
        if (message.content.match(/&\d{1,}d\d{1,}/) == null) {
          message.channel.send("This is not a valid command, please enter " + config.prefix + "help for usage guidelines !");
          return;
        }

        rollArray = doRolls(command);
    
        message.channel.send("Rolling " + getNbRolls(command) + " dice of " + getDice(command) + "\nSum : " + rollArray.reduce((a, b) => a + b).toString() + "\nDetailed rolls : " + rollArray.toString());
        break;
    }

  });

  client.login(config.token);