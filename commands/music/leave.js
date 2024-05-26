const { SlashCommandBuilder } = require('discord.js');
const { getVoiceConnection } = require('@discordjs/voice');

let botConnected = false;
let songQueue = [];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Bot leaves the voice channel!'),
    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;

        if (voiceChannel) {
            const voiceConnection = getVoiceConnection(interaction.guildId);

            if (voiceConnection) {
                try {
                    await voiceConnection.destroy();
                    await interaction.reply(`Bot has left from ${voiceChannel.name}!`);
                    botConnected = false;
                    songQueue = [];
                } catch (error) {
                    console.error('Error while destroying connection:', error);
                    await interaction.reply(`Failed to leave from ${voiceChannel.name}. An error occurred.`);
                }
            } else {
                await interaction.reply('The bot is not connected to any voice channel!');
            }
        } else {
            await interaction.reply('You have to join a voice channel first!');
        }
    }
};
