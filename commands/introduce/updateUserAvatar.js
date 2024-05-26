const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('update introducion profile')
        .setDescription('Update introduction profile (people who changed profile).'),

    async execute(interaction) {
        try {
            // Immediately acknowledge the interaction
            await interaction.deferReply({ ephemeral: true });

            // Check if the bot is in the correct channel
            if (interaction.channelId !== '1243906661916348627') {
                await interaction.editReply({ content: 'This command cannot be used in this channel.' });
                return;
            }

            const targetChannel = interaction.guild.channels.cache.get('1243918701749866630');
            if (!targetChannel) {
                console.log('Target channel not found.');
                await interaction.editReply({ content: 'Error: Target channel not found.' });
                return;
            }

            // Fetch all messages in the channel
            const messages = await targetChannel.messages.fetch();

            // Function to update embed with the new avatar URL
            const updateAvatar = async (message) => {
                const embeds = message.embeds;
                if (!embeds.length) return;

                const oldEmbed = embeds[0];

                // Check if the embed has a matching title and tagged user
                if (oldEmbed.title === 'Introduction has been confirmed.✅' && message.mentions.users.size > 0) {
                    const taggedUser = message.mentions.users.first();
                    const currentAvatarURL = taggedUser.displayAvatarURL({ dynamic: true });

                    // Check if the current avatar matches the one in the embed
                    if (oldEmbed.thumbnail && oldEmbed.thumbnail.url === currentAvatarURL) {
                        return;
                    }

                    const newEmbed = EmbedBuilder.from(oldEmbed)
                        .setThumbnail(currentAvatarURL);

                    // Update the message with the new embed
                    await message.edit({ embeds: [newEmbed] });
                }
            };

            // Loop through each message and update the embed if necessary
            for (const message of messages.values()) {
                await updateAvatar(message);
            }

            // Send confirmation message
            await interaction.editReply({ content: 'Avatar in introduction messages has been updated.', ephemeral: false});
        } catch (error) {
            console.error('Error executing update_introduce_avatar:', error);
            if (!interaction.replied) {
                await interaction.editReply({ content: 'An error occurred while updating the avatar.' });
            }
        }
    },
};
