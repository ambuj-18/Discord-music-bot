const { Client, GatewayIntentBits } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require("@discordjs/voice");
const play = require("play-dl");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.on("messageCreate", async (message) => {
  if (!message.content.startsWith("!play")) return;
  if (!message.member.voice.channel) {
    return message.reply("❌ Pehle voice channel join karo");
  }

  const url = message.content.split(" ")[1];
  if (!url) return message.reply("🎵 YouTube link do");

  try {
    const stream = await play.stream(url);

    const connection = joinVoiceChannel({
      channelId: message.member.voice.channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer();
    const resource = createAudioResource(stream.stream, {
      inputType: stream.type
    });

    player.play(resource);
    connection.subscribe(player);

    message.reply("▶️ Music playing!");
  } catch (err) {
    console.log(err);
    message.reply("❌ Song play nahi ho pa raha");
  }
});

client.login(process.env.TOKEN);
