const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            // Process for commands entered through slash commands
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Error executing ${interaction.commandName}`);
                console.error(error);
            }
        } else if (interaction.isMessageComponent() && interaction.message.components.length > 0) {
            // Process for Message Components (including modals)
            if (interaction.isButton()) {
                // Process for buttons
            } else if (interaction.isSelectMenu()) {
                // Process for select menus
            }
        }
    },
};
