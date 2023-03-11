const { ChannelType, EmbedBuilder, PermissionsBitField, PermissionFlagsBits, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channel')
        .setDescription('Commands for channel!')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addSubcommand(subcommand => subcommand.setName('create')
            .setDescription('Create a channel!')
            .addStringOption(option => option.setName('channel')
                .setDescription('What do you want the channel to be named as?')
                .setRequired(true))
        )
        .addSubcommand(subcommand => subcommand.setName('delete')
            .setDescription('Delete a channel!')
            .addChannelOption(option => option.setName('channel')
                .setDescription('Which channel do you want to delete?')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true))
        )
        .addSubcommand(subcommand => subcommand.setName('lock')
            .setDescription('Lock a channel!')
            .addChannelOption(option => option.setName('channel')
                .setDescription('Which channel do you want to lock?')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true))
        )
        .addSubcommand(subcommand => subcommand.setName('unlock')
            .setDescription('Unlock a channel!')
            .addChannelOption(option => option.setName('channel')
                .setDescription('Which channel do you want to unlock?')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true))
        )
        .addSubcommand(subcommand => subcommand.setName('slowmode')
            .setDescription('Set a slowmode for a channel!')
            .addChannelOption(option => option.setName('channel')
                .setDescription('Which channel do you want to set a slowmode to?')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true))
            .addStringOption((option) => option.setName('slowmode')
                .setDescription('How long should the slowmode be set to?')
                .addChoices(
                    { name: 'off', value: 'off' },
                    { name: '5 seconds', value: '5s' },
                    { name: '10 seconds', value: '10s' },
                    { name: '15 seconds', value: '15s' },
                    { name: '30 seconds', value: '30s' },
                    { name: '1 minute', value: '1m' },
                    { name: '2 minutes', value: '2m' },
                    { name: '5 minutes', value: '5m' },
                    { name: '10 minutes', value: '10m' },
                    { name: '15 minutes', value: '15m' },
                    { name: '30 minutes', value: '30m' },
                    { name: '1 hour', value: '1h' },
                    { name: '2 hours', value: '2h' },
                    { name: '6 hours', value: '6h' }
                )
                .setRequired(true))
        ),
    async execute(interaction, client) {
        await interaction.deferReply();

        const subCommand = interaction.options.getSubcommand();

        // Create
        const channel = interaction.options.getString('channel');

        // Delete
        const channel2 = interaction.options.getChannel('channel');

        // Lock
        const channel3 = interaction.options.getChannel('channel');

        // Unlock
        const channel4 = interaction.options.getChannel('channel');

        // Slowmode
        const channel5 = interaction.options.getChannel('channel');
        const slowmode = interaction.options.getString('slowmode');

        switch (subCommand) {
            case 'create': {
                interaction.guild.channels.create({
                    name: channel,
                    type: ChannelType.GuildText,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
                    ],
                }).catch((error) => {
                    return interaction.editReply({ content: `${client.config.errorMessage} ${client.config.errorEmoji}\n\`\`\`${error}\`\`\`` });
                });

                const channelEmbed = new EmbedBuilder()
                    .setColor(client.config.color)
                    .setTitle(`${channel} has been created! ${client.config.successEmoji}`)
                    .addFields(
                        { name: 'Channel', value: `${channel}`, inline: true },
                        { name: 'Server', value: `${interaction.guild.name}`, inline: true },
                        { name: 'Moderator', value: `${interaction.member.user.tag}`, inline: true },
                    )
                    .setTimestamp();

                interaction.editReply({ embeds: [channelEmbed] });
            }
                break;

            case 'delete': {
                interaction.guild.channels.delete(channel2.id).catch((error) => {
                    return interaction.editReply({ content: `${client.config.errorMessage} ${client.config.errorEmoji}\n\`\`\`${error}\`\`\`` });
                });

                const channelEmbed = new EmbedBuilder()
                    .setColor(client.config.color)
                    .setTitle(`${channel2.name} has been deleted! ${client.config.successEmoji}`)
                    .addFields(
                        { name: 'Channel', value: `${channel2.name}`, inline: true },
                        { name: 'Server', value: `${interaction.guild.name}`, inline: true },
                        { name: 'Moderator', value: `${interaction.member.user.tag}`, inline: true },
                    )
                    .setTimestamp();

                interaction.editReply({ embeds: [channelEmbed] });
            }
                break;

            case 'lock': {
                channel3.permissionOverwrites.create(interaction.guild.id, {
                    SendMessages: false
                }).catch((error) => {
                    return interaction.editReply({ content: `${client.config.errorMessage} ${client.config.errorEmoji}\n\`\`\`${error}\`\`\`` });
                });

                const channelEmbed = new EmbedBuilder()
                    .setColor(client.config.color)
                    .setTitle(`${channel3} has been locked! ${client.config.successEmoji}`)
                    .addFields(
                        { name: 'Channel', value: `${channel3}`, inline: true },
                        { name: 'Server', value: `${interaction.guild.name}`, inline: true },
                        { name: 'Moderator', value: `${interaction.member.user.tag}`, inline: true }
                    )
                    .setTimestamp();

                interaction.editReply({ embeds: [channelEmbed] });
            }
                break;

            case 'unlock': {
                channel4.permissionOverwrites.create(interaction.guild.id, {
                    SendMessages: false
                }).catch(error => {
                    return interaction.editReply({ content: `${client.config.errorMessage} ${client.config.errorEmoji}\n\`\`\`${error}\`\`\`` });
                });

                const channelEmbed = new EmbedBuilder()
                    .setColor(client.config.color)
                    .setTitle(`${channel4} has been unlocked! ${client.config.successEmoji}`)
                    .addFields(
                        { name: 'Channel', value: `${channel4}`, inline: true },
                        { name: 'Server', value: `${interaction.guild.name}`, inline: true },
                        { name: 'Moderator', value: `${interaction.member.user.tag}`, inline: true }
                    )
                    .setTimestamp();

                interaction.editReply({ embeds: [channelEmbed] });
            }
                break;
            case 'slowmode': {
                switch (slowmode) {
                    case 'off': {
                        channel5.setRateLimitPerUser(0).catch((error) => {
                            return interaction.editReply({ content: `${client.config.errorMessage} ${client.config.errorEmoji}\n\`\`\`${error}\`\`\`` });
                        });
                    }
                        break;
                    case '5s': {
                        channel5.setRateLimitPerUser(5).catch((error) => {
                            return interaction.editReply({ content: `${client.config.errorMessage} ${client.config.errorEmoji}\n\`\`\`${error}\`\`\`` });
                        });
                    }
                        break;
                    case '10s': {
                        channel5.setRateLimitPerUser(10).catch((error) => {
                            return interaction.editReply({ content: `${client.config.errorMessage} ${client.config.errorEmoji}\n\`\`\`${error}\`\`\`` });
                        });
                    }
                        break;
                    case '15s': {
                        channel5.setRateLimitPerUser(15).catch((error) => {
                            return interaction.editReply({ content: `${client.config.errorMessage} ${client.config.errorEmoji}\n\`\`\`${error}\`\`\`` });
                        });
                    }
                        break;
                    case '30s': {
                        channel5.setRateLimitPerUser(30).catch((error) => {
                            return interaction.editReply({ content: `${client.config.errorMessage} ${client.config.errorEmoji}\n\`\`\`${error}\`\`\`` });
                        });
                    }
                        break;
                    case '1m': {
                        channel5.setRateLimitPerUser(60).catch((error) => {
                            return interaction.editReply({ content: `${client.config.errorMessage} ${client.config.errorEmoji}\n\`\`\`${error}\`\`\`` });
                        });
                    }
                        break;
                    case '2m': {
                        channel5.setRateLimitPerUser(120).catch((error) => {
                            return interaction.editReply({ content: `${client.config.errorMessage} ${client.config.errorEmoji}\n\`\`\`${error}\`\`\`` });
                        });
                    }
                        break;
                    case '5m': {
                        channel5.setRateLimitPerUser(300).catch((error) => {
                            return interaction.editReply({ content: `${client.config.errorMessage} ${client.config.errorEmoji}\n\`\`\`${error}\`\`\`` });
                        });
                    }
                        break;
                    case '10m': {
                        channel5.setRateLimitPerUser(600).catch((error) => {
                            return interaction.editReply({ content: `${client.config.errorMessage} ${client.config.errorEmoji}\n\`\`\`${error}\`\`\`` });
                        });
                    }
                        break;
                    case '15m': {
                        channel5.setRateLimitPerUser(900).catch((error) => {
                            return interaction.editReply({ content: `${client.config.errorMessage} ${client.config.errorEmoji}\n\`\`\`${error}\`\`\`` });
                        });
                    }
                        break;
                    case '30m': {
                        channel5.setRateLimitPerUser(1800).catch((error) => {
                            return interaction.editReply({ content: `${client.config.errorMessage} ${client.config.errorEmoji}\n\`\`\`${error}\`\`\`` });
                        });
                    }
                        break;
                    case '1h': {
                        channel5.setRateLimitPerUser(3600).catch((error) => {
                            return interaction.editReply({ content: `${client.config.errorMessage} ${client.config.errorEmoji}\n\`\`\`${error}\`\`\`` });
                        });
                    }
                        break;
                    case '2h': {
                        channel5.setRateLimitPerUser(7200).catch((error) => {
                            return interaction.editReply({ content: `${client.config.errorMessage} ${client.config.errorEmoji}\n\`\`\`${error}\`\`\`` });
                        });
                    }
                        break;
                    case '6h': {
                        channel5.setRateLimitPerUser(21600).catch((error) => {
                            return interaction.editReply({ content: `${client.config.errorMessage} ${client.config.errorEmoji}\n\`\`\`${error}\`\`\`` });
                        });
                    }
                        break;
                }

                const channelEmbed = new EmbedBuilder()
                    .setColor(client.config.color)
                    .setTitle(`${channel5} now has a slowmode! ${client.config.successEmoji}`)
                    .addFields(
                        { name: 'Slowmode', value: `${slowmode}`, inline: true },
                        { name: 'Channel', value: `${channel5}`, inline: true },
                        { name: 'Server', value: `${interaction.guild.name}`, inline: true },
                        { name: 'Moderator', value: `${interaction.member.user.tag}`, inline: true }
                    )
                    .setTimestamp();

                interaction.editReply({ embeds: [channelEmbed] });
            }
                break;
        }
    },
};