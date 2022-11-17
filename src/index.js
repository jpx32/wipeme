import { config } from 'dotenv';
import pkg, { DiscordAPIError } from 'discord.js';
const { Client, GatewayIntentBits, EmbedBuilder, MessageEmbed, PermissionsBitField, Permissions } = pkg;

config();

const client = new Client({
    partials: [
        'MESSAGE'
    ],
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ]
});

const BOT_TOKEN = process.env.BOT_TOKEN;
client.login(BOT_TOKEN);

const prefix = '>';
var channelid = null;

client.on('ready', () => {
    console.log(`${client.user.tag} is online!`);
    client.user.setActivity('Server Messages 🤡',{type: 'WATCHING'});
});

client.on('messageCreate', (message) => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    const messageArray = message.content.split(" ");
    const argument = messageArray.slice(1);
    const cmd = messageArray[0];

    if(command === 'ping') {
        message.channel.send("Pong!");
    }
    if(command === 'setchannel'){
        message.channel.send("Setting channel...");
        channelid = message.channel.id.toString();
        message.channel.send("Set channel.");
    }
});

client.on('messageDelete', (message) => {
    if(channelid){
        if(!message.partial){
            var channel = client.channels.cache.get(channelid);
            message.channel.send("Grabbed channel ID.");
            if(channel){
                message.channel.send("Found deleted message.");
                const delembed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('Deleted message.')
                    .addFields(
                        { name: 'Author', value: `${message.author.tag} (${message.author.id})`, inline: true },
                        { name: 'Channel', value: `${message.channel.name} (${message.channel.id})`, inline: true}
                    )
                    .setDescription(message.content)
                    .setTimestamp();
                channel.send({ embeds: [delembed] });
            }
        }
    }else{
        message.channel.send("No channel is set.");
    }
});

client.on('messageUpdate', async(oldMessage, newMessage) => {
    if(channelid){
        if(!oldMessage.partial){
            var channel = client.channels.cache.get(channelid);
            oldMessage.channel.send("Grabbed channel ID.");
            if(channel){
                oldMessage.channel.send("Found edited message.");
                const editembed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('Edited message.')
                    .addFields(
                        { name: 'Author', value: `${oldMessage.author.tag} (${oldMessage.author.id})`, inline: true },
                        { name: 'Channel', value: `${oldMessage.channel.name} (${oldMessage.channel.id})`, inline: false}
                    )
                    .addFields(
                        {name: 'Old Message', value: `${oldMessage.content}`, inline: true},
                        {name: 'New Message', value: `${newMessage.content}`, inline: true}
                    )
                    .setTimestamp();
                channel.send({ embeds: [editembed] });
            }
        }
    }else{
        oldMessage.channel.send("No channel is set.");
    }
});