const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const cron = require('node-cron');
const fs = require('fs')
function updateServerIcon(guild) {
  console.log("[LOG] Updating server icon for " + guild.name + "...");

  fs.readdir(config.icondir, (err, files) => {
    var i = Math.floor(Math.random() * files.length);
    var SelectedFile = files[i];
    console.log("[LOG]   File: " + SelectedFile);
    guild.setIcon(config.icondir + "/" + SelectedFile)
      .catch(console.error);
    console.log("[LOG] Updated server icon for " + guild.name + ".");
  })
}

client.on("ready", () => {
  console.log(`[INFO] Bot has started.`);
  client.user.setActivity(`Discord Automatic random icon updater`);

  cron.schedule(config.updateCron, function(){
    updateServerIcon(client.guilds.find(id=>config.guildID))
  });

  console.log("[INFO] Scheduled updates for " + client.guilds.find(id=>config.guildID).name + ". Cron expression: " + config.updateCron)

});

client.on("message", async message => {
  if(message.author.bot) return;

  if(message.content.toUpperCase().indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if(message.author.id != message.guild.ownerID) {
    message.reply("This bot can only be used by the server owner.")
    return;
  }

  if (command === "update") {
    updateServerIcon(message.guild);
  }
});

client.login(process.env.daiu_token); //export daiu_token=TOKEN
