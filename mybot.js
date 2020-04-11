const Discord = require("discord.js");
const client = new Discord.Client();
 
client.on("ready", () => {
  console.log("I am ready!");
});
 
const prefix = "##";

client.on("message", (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
   
    if (message.content.startsWith(prefix + "ping")) {
      message.channel.send("pong!");
    } else
    if (message.content.startsWith(prefix + "foo")) {
      message.channel.send("bar!");
    }
  });

client.login("Njk4MjIzMTI5MDA0MjEyMjM1.XpGLHA.KjqKXm4PJ8zKJuOkd7HfawQYg8Y");