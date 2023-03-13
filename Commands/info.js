const { EmbedBuilder, hyperlink, SlashCommandBuilder, time, userMention } = require('discord.js');
const Discord = require('discord.js');
const ms = require('ms');

function getUserBadges(user) {
    const badges = [];

    if (user.flags) {
        const userFlags = user.flags.toArray();

        for (const flag of userFlags) {
            switch (flag) {
                case 'ActiveDeveloper':
                    badges.push('<:ActiveDeveloper:1081658306382282852>');
                    break;

                case 'BugHunterLevel1':
                    badges.push('<:BugHunterLevel1:1081645277213102210>');
                    break;

                case 'BugHunterLevel2':
                    badges.push('<:BugHunterLevel2:1081645327351828630>');
                    break;

                case 'Hypesquad':
                    badges.push('<:HypesquadEvents:1081645559640768593>');
                    break;

                case 'HypeSquadOnlineHouse1':
                    badges.push('<:HypesquadBravery:1081645861693562982>');
                    break;

                case 'HypeSquadOnlineHouse2':
                    badges.push('<:HypesquadBrilliance:1081646044586201200>');
                    break;

                case 'HypeSquadOnlineHouse3':
                    badges.push('<:HypesquadBalance:1081645928122945617>');
                    break;

                case 'PremiumEarlySupporter':
                    badges.push('<:EarlyNitroSupporter:1081654424654577755>');
                    break;

                case 'Staff':
                    badges.push('<:DiscordStaff:1081656918151536660>');
                    break;

                case 'CertifiedModerator':
                    badges.push('<:CertifiedModerator:1081653575798755410>');
                    break;

                case 'Partner':
                    badges.push('<:PartneredServerOwner:1081654234413535334>');
                    break;

                case 'VerifiedBot':
                    badges.push('<:VerifiedBot:1081657304174313523><:VerifiedBot:1081657219965272287>');
                    break;

                case 'VerifiedDeveloper':
                    badges.push('<:VerifiedDeveloper:1081656785041113199>');
                    break;
            }
        }
    }

    return badges.join(' ') || 'None';
}

const verificationLevel = ['None', 'Low (Verified email required)', 'Medium (Be on the server for 5 minutes)', 'High (Be on the server for 10 minutes)', 'Very High (Verified phone number)'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Commands for info!')
        .addSubcommand(subcommand => subcommand.setName('client')
            .setDescription('Get the clients info!')
        )
        .addSubcommand(subcommand => subcommand.setName('guild')
            .setDescription('Get the guilds info!')
        )
        .addSubcommand(subcommand => subcommand.setName('user')
            .setDescription('Get a users info!')
            .addUserOption(option => option.setName('user')
                .setDescription('Which users information would you like to get?')
                .setRequired(false))
        )
        .addSubcommand(subcommand => subcommand.setName('channel')
            .setDescription('Get a channels info!')
            .addChannelOption(option => option.setName('channel')
                .setDescription('Which channels information would you like to get?')
                .setRequired(false))
        )
        .addSubcommand(subcommand => subcommand.setName('role')
            .setDescription('Get a roles info!')
            .addRoleOption(option => option.setName('role')
                .setDescription('Which roles information would you like to get?')
                .setRequired(true))
        ),
    async execute(interaction, client) {
        await interaction.deferReply();

        const subCommand = interaction.options.getSubcommand();

        const guild = interaction.guild;
        const user = interaction.options.getUser('user') || interaction.user;
        const channel = interaction.options.getChannel('channel') || interaction.channel;
        const role = interaction.options.getRole('role');

        switch (subCommand) {
            case 'client': {
                const infoEmbed = new EmbedBuilder()
                    .setColor(client.config.color)
                    .setAuthor({ name: `${client.user.username}`, iconURL: `${client.user.avatarURL({ dynamic: true })}` })
                    .setDescription(`Name: ${client.user.username}\nID: ${client.user.id}\nUptime: ${ms(client.uptime)}\nGuild count: ${client.guilds.cache.size}\nMember count: ${interaction.client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0)}\nChannel count: ${client.channels.cache.size}\nEmoji count: ${client.emojis.cache.size}`)
                    .setThumbnail(client.user.avatarURL({ dynamic: true }))
                    .addFields(
                        { name: 'Client Since', value: `${time(Math.round(client.user.createdTimestamp / 1000), 'd')}`, inline: true },
                        { name: 'Discord.js Version', value: `${Discord.version}`, inline: true },
                        { name: 'Node.js Version', value: `${process.version}`, inline: true }
                    )
                    .setTimestamp();

                interaction.editReply({ embeds: [infoEmbed] });
            }
                break;

            case 'guild': {
                const infoEmbed = new EmbedBuilder()
                    .setColor(client.config.color)
                    .setAuthor({ name: `${interaction.guild.name}` })
                    .setDescription(`Name: ${interaction.guild.name}\nID: ${interaction.guild.id}\nDescription: ${interaction.guild.description || 'None'}\nOwner: ${userMention(interaction.guild.ownerId)}\nMember count: ${interaction.guild.memberCount}\nChannel count: ${interaction.guild.channels.cache.size} \nRole count: ${interaction.guild.roles.cache.size}\nEmoji count: ${interaction.guild.emojis.cache.size}`)
                    .addFields(
                        { name: 'Created At', value: `${time(Math.round(interaction.guild.createdAt / 1000), 'd')}`, inline: true },
                        { name: 'Rules Channel', value: `${interaction.guild.rulesChannel || 'None'}`, inline: true },
                        { name: 'Updates Channel', value: `${interaction.guild.publicUpdatesChannel || 'None'}`, inline: true },
                        { name: 'Verification Level', value: `${verificationLevel[guild.verificationLevel]}`, inline: true },
                        { name: 'Icon URL', value: `${hyperlink('Link', interaction.guild.iconURL({ dynamic: true })) || 'None'}`, inline: true },
                        { name: 'Banner URL', value: `${hyperlink('Link', interaction.guild.bannerURL({ dynamic: true })) || 'None'}`, inline: true }
                    )
                    .setTimestamp();

                if (interaction.guild.iconURL()) {
                    infoEmbed.setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL({ dynamic: true })}` });
                    infoEmbed.setThumbnail(interaction.guild.iconURL({ dynamic: true }));
                }

                if (interaction.guild.bannerURL()) {
                    infoEmbed.setImage(interaction.guild.bannerURL({ dynamic: true, size: 2048 }));
                }

                interaction.editReply({ embeds: [infoEmbed] });
            }
                break;
            case 'user': {
                const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id).catch((error) => { });
                let status;

                if (member.presence) {
                    status = member.presence.status === 'online' ? 'Online 🟢' : member.presence.status === 'idle' ? 'Idle 🌙' : 'Do Not Disturb ⛔';
                } else {
                    status = 'Offline 💤';
                }

                const infoEmbed = new EmbedBuilder()
                    .setColor(client.config.color)
                    .setAuthor({ name: `${user.tag}`, iconURL: `${user.displayAvatarURL({ dynamic: true })}` })
                    .setDescription(`Name: ${user.username}\nID: ${user.id}\nStatus: ${status}\nBadges: ${getUserBadges(user)}`)
                    .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                    .addFields(
                        { name: 'User Since', value: `${time(Math.round(user.createdTimestamp / 1000), 'd')}`, inline: true },
                        { name: 'Member Since', value: `${time(Math.round(member.joinedTimestamp / 1000), 'd')}`, inline: true },
                        { name: 'Booster', value: `${member.premiumSince ? '✅' : '❌'}`, inline: true },
                        { name: 'Roles', value: `${member.roles.cache.map(roles => roles).join(' ') || 'None'}`, inline: false }
                    )
                    .setTimestamp();

                interaction.editReply({ embeds: [infoEmbed] });
            }
                break;
            case 'channel': {
                const infoEmbed = new EmbedBuilder()
                    .setColor(client.config.color)
                    .setTitle(`${channel.name}`)
                    .setDescription(`Name: ${channel.name}\nMention: ${channel}\nID: ${channel.id}\nParent: ${channel.parent}\nPosition: ${channel.position}`)
                    .addFields(
                        { name: 'Created At', value: `${time(Math.round(channel.createdTimestamp / 1000), 'd')}`, inline: true }
                    )
                    .setTimestamp();

                interaction.editReply({ embeds: [infoEmbed] });
            }
                break;
            case 'role': {
                const infoEmbed = new EmbedBuilder()
                    .setColor(client.config.color)
                    .setTitle(`${role.name}`)
                    .setDescription(`Name: ${role.name}\nMention: ${role}\nID: ${role.id}\nPosition: ${role.position}`)
                    .addFields(
                        { name: 'Created At', value: `${time(Math.round(role.createdTimestamp / 1000), 'd')}`, inline: true },
                        { name: 'Color', value: `${role.hexColor}`, inline: true }
                    )
                    .setTimestamp();

                interaction.editReply({ embeds: [infoEmbed] });
            }
                break;
        }
    },
};