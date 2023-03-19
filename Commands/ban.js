const { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from the guild!')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption((option) => option.setName('user')
            .setDescription('Who do you want to ban?')
            .setRequired(true))
        .addStringOption(option => option.setName('reason')
            .setDescription('Why are you banning this user?')
            .setRequired(false)),
    async execute(interaction, client) {
        await interaction.deferReply();

        const user = interaction.options.getMember('user');
        const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id).catch((error) => { });
        const reason = interaction.options.getString('reason') || 'None';

        if (!member) {
            return interaction.editReply({ content: 'I wasn\'t able to find that user!' });
        }

        if (interaction.member.roles.highest.position <= member.roles.highest.position) {
            return interaction.editReply({ content: 'I couldn\'t ban this user because the users role might be higher than yours!' });
        }

        if (!member.bannable || member.user.id === client.user.id) {
            return interaction.editReply({ content: 'I couldn\'t ban that user, or maybe it was me! Make sure my roles are higher than the users!' });
        }

        member.ban({ reason }).catch((error) => {
            return interaction.editReply({ content: `${client.config.errorMessage} ${client.config.errorEmoji}\n\`\`\`${error}\`\`\`` });
        });

        const banEmbed = new EmbedBuilder()
            .setTitle(`${member.user.tag} had been banned! ${client.config.successEmoji}`)
            .addFields(
                { name: 'Name', value: `${member.user.tag}`, inline: true },
                { name: 'Server', value: `${interaction.guild.name}`, inline: true },
                { name: 'Moderator', value: `${interaction.member.user.tag}`, inline: true },
                { name: 'Reason', value: `${reason}`, inline: true },
            )
            .setColor(client.config.color)
            .setTimestamp();

        return interaction.editReply({ embeds: [banEmbed] });
    },
};