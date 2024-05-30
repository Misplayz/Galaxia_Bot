const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        }

        if (interaction.isModalSubmit()) {
            // Check if the submitted modal is the introduction modal
            if (interaction.customId === 'introduceModal') {
                const nickname = interaction.fields.getTextInputValue('nicknameInput');
                const age = interaction.fields.getTextInputValue('ageInput');
                const gender = interaction.fields.getTextInputValue('genderInput');

                const taggedUser = interaction.user.toString();
                const messageContent = `${taggedUser}`;
                const indEmbed = new EmbedBuilder()
                    .setTitle('Introduction has been confirmed.✅')
                    .setColor('#00FFFF')
                    .addFields(
                        { name: 'Nickname', value: nickname },
                        { name: 'Age', value: age },
                        { name: 'Gender', value: gender }
                    )
                    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                    .setTimestamp();

                const targetChannel = interaction.guild.channels.cache.get('1243918701749866630');
                if (targetChannel) {
                    await targetChannel.send({ content: messageContent, embeds: [indEmbed] });

                    // Add new role and remove old role
                    const member = await interaction.guild.members.fetch(interaction.user);
                    const newRole = interaction.guild.roles.cache.get('1243914187747627008');
                    const oldRole = interaction.guild.roles.cache.get('1243913819580010536');

                    if (newRole) await member.roles.add(newRole);
                    if (oldRole) await member.roles.remove(oldRole);
                } else {
                    console.log('Target channel not found.');
                }
            }
        }
    },
};
