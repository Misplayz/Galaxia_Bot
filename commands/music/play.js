const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel } = require('@discordjs/voice');
const searchSong = require('../../spotify/spotify_api');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a song')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('Enter the name of the song')
                .setRequired(true)),
    async execute(interaction) {
        try {
            const channel = interaction.member.voice.channel;

            if (!channel) {
                await interaction.reply('You need to be in a voice channel to use this command!');
                return;
            }

            const songName = interaction.options.getString('song');

            if (!songName) {
                await interaction.reply('No search query provided.');
                return;
            }

            if (!interaction.deferred || !interaction.replied) {
                await interaction.deferReply();
            }

            const songData = await searchSong(songName);

            if (!songData || !songData.tracks || songData.tracks.items.length === 0) {
                await interaction.editReply('No results found for your search query.');
                return;
            }

            const track = songData.tracks.items[0];

            joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });

            await interaction.editReply(`Now playing: ${track.name} by ${track.artists[0].name}`);
        } catch (error) {
            console.error('Error executing play', error);
            if (!interaction.replied) {
                await interaction.reply('There was an error executing play.');
            } else {
                await interaction.editReply('There was an error executing play.');
            }
        }
    },
};
