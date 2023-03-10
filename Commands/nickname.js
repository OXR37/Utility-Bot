const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nickname')
        .setDescription('Commands for nickname!')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
        .addSubcommand(subcommand => subcommand.setName('change')
            .setDescription('Change an users nickname!')
            .addUserOption(option => option.setName('user')
                .setDescription('Which users nickname do you want to change?')
                .setRequired(true))
            .addStringOption(option => option.setName('nickname')
                .setDescription('What do you want the users nickname to be?')
                .setRequired(true)),
        )
        .addSubcommand(subcommand => subcommand.setName('reset')
            .setDescription('Reset an users nickname!')
            .addUserOption(option => option.setName('user')
                .setDescription('Which users nickname do you want to reset?')
                .setRequired(true)),
        ),
    async execute(interaction, client) {
        await interaction.deferReply();

        const subCommand = interaction.options.getSubcommand();

        // Change
        const user = interaction.options.getUser('user');
        const nickname = interaction.options.getString('nickname');

        // Reset
        const user2 = interaction.options.getUser('user');

        switch (subCommand) {
            case 'change': {
                const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id).catch((error) => { });

                member.setNickname(nickname).catch(error => {
                    return interaction.editReply({ content: `${client.config.errorMessage} ${client.config.errorEmoji}\n${error}` });
                });

                const nicknameEmbed = new EmbedBuilder()
                    .setColor(client.config.color)
                    .setTitle(`${member.user.tag}\'s nickname has been reset! ${client.config.successEmoji}`)
                    .addFields(
                        { name: 'Name', value: `${member.user.tag}`, inline: true },
                        { name: 'Server', value: `${interaction.guild.name}`, inline: true },
                        { name: 'Moderator', value: `${interaction.member.user.tag}`, inline: true },
                        { name: 'Nickname', value: `${nickname}`, inline: true },
                    )
                    .setTimestamp();

                interaction.editReply({ embeds: [nicknameEmbed] });
            }
                break;

            case 'reset': {
                const member = interaction.guild.members.cache.get(user2.id) || await interaction.guild.members.fetch(user2.id).catch((error) => { });

                member.setNickname(member.user.username).catch((error) => {
                    return interaction.editReply({ content: `${client.config.errorMessage} ${client.config.errorEmoji}\n${error}` });
                });

                const nicknameEmbed = new EmbedBuilder()
                    .setColor(client.config.color)
                    .setTitle(`${user2.tag}\'s nickname has been reset! ${client.config.successEmoji}`)
                    .addFields(
                        { name: 'Name', value: `${member.user.tag}`, inline: true },
                        { name: 'Server', value: `${interaction.guild.name}`, inline: true },
                        { name: 'Moderator', value: `${interaction.member.user.tag}`, inline: true },
                        { name: 'Nickname', value: `${member.user.username}`, inline: true },
                    )
                    .setTimestamp();

                interaction.editReply({ embeds: [nicknameEmbed] });
            }
                break;
        }
    },
};