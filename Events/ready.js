const { Events, REST, Routes } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`\nReady! Logged in as ${client.user.tag}`);

        const commands = [];
        const commandFiles = fs.readdirSync('./Commands')
            .filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`../Commands/${file}`);
            commands.push(command.data.toJSON());
        }

        const rest = new REST({ version: '10' }).setToken(client.config.token);

        (async () => {
            try {
                console.log(`Started refreshing ${commands.length} application (/) commands.`);
                
                const data = await rest.put(
                    Routes.applicationCommands(client.config.clientID),
                    { body: commands },
                );

                console.log(`Successfully reloaded ${data.length} application (/) commands.`);
            } catch (error) {
                console.error(error);
            }
        })();
    },
};