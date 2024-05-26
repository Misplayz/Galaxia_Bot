const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Joins the voice channel you are in'),
    async execute(interaction) {
        const channel = interaction.member.voice.channel;

        if (!channel) {
            await interaction.reply('You need to be in a voice channel to use this command!');
            return;
        }

        try {
            joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });

            await interaction.reply(`Joined ${channel.name}!`);
        } catch (error) {
            console.error('Error joining voice channel:', error);
            await interaction.reply('There was an error trying to join the voice channel!');
        }
    },
};
