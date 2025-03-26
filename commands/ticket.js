const { EmbedBuilder, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

async function sendTicketMessage(client) {
    console.log('✅ sendTicketMessage function started...');

    const ticketChannel = client.channels.cache.get('1354334158599753741'); // Update this ID if needed
    console.log('📌 Ticket Channel:', ticketChannel ? `Found: ${ticketChannel.name}` : 'Not found!');

    if (!ticketChannel) {
        console.error('❌ Error: Ticket system channel not found. Check the channel ID.');
        return;
    }

    // Check if the bot has already sent a ticket message to prevent duplicates
    const messages = await ticketChannel.messages.fetch({ limit: 10 });
    console.log(`📜 Fetched ${messages.size} recent messages from the ticket channel.`);

    if (messages.some(msg => msg.author.id === client.user.id)) {
        console.log('⚠️ Ticket message already exists. Skipping...');
        return;
    }

    const embed = new EmbedBuilder()
        .setTitle('🎟️ Support Ticket System')
        .setDescription('Click the button below to create a support ticket.')
        .setColor('#acf508');

    const button = new ButtonBuilder()
        .setCustomId('create_ticket')
        .setLabel('Create Ticket')
        .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    try {
        await ticketChannel.send({ embeds: [embed], components: [row] });
        console.log('✅ Ticket message successfully sent!');
    } catch (error) {
        console.error('❌ Error sending ticket message:', error);
    }
}

async function handleInteraction(interaction) {
    if (!interaction.isButton() || interaction.customId !== 'create_ticket') return;

    console.log(`🎟️ Ticket button clicked by ${interaction.user.tag}`);

    const category = interaction.guild.channels.cache.find(
        (c) => c.name.toLowerCase() === 'channels' && c.type === ChannelType.GuildCategory
    );

    if (!category) {
        console.error("❌ Error: 'Channels' category not found.");
        return interaction.reply({ content: "Error: Category 'Channels' not found. Please create it.", ephemeral: true });
    }

    const existingTicket = interaction.guild.channels.cache.find(
        (channel) => channel.name === `ticket-${interaction.user.username.toLowerCase()}`
    );

    if (existingTicket) {
        console.log(`⚠️ ${interaction.user.tag} already has an open ticket.`);
        return interaction.reply({ content: `You already have an open ticket: ${existingTicket}.`, ephemeral: true });
    }

    const modRole = interaction.guild.roles.cache.find(role => role.name.toLowerCase() === 'moderator');
    if (!modRole) {
        console.error("❌ Error: 'Moderator' role not found.");
        return interaction.reply({ content: 'Moderator role not found. Please ensure it exists.', ephemeral: true });
    }

    try {
        const ticketChannel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username.toLowerCase()}`,
            type: ChannelType.GuildText,
            parent: category.id,
            topic: `Support Ticket for ${interaction.user.username}`,
            permissionOverwrites: [
                { id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] },
                { id: interaction.client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages, PermissionFlagsBits.AddReactions, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageChannels] },
                { id: modRole.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageMessages] }
            ],
        });

        console.log(`✅ Ticket channel created: ${ticketChannel.name}`);

        const embed = new EmbedBuilder()
            .setTitle('🎫 Support Ticket Created')
            .setDescription(`Hello ${interaction.user.username}, how can we assist you today?\n\nReact with 🛑 to close this ticket.`)
            .setColor('#acf508');

        const ticketMessage = await ticketChannel.send({ embeds: [embed] });
        await ticketMessage.react('🛑');

        await interaction.reply({ content: `✅ Your ticket has been created: ${ticketChannel}.`, ephemeral: true });

        setTimeout(async () => {
            try {
                const channel = interaction.guild.channels.cache.get(ticketChannel.id);
                if (channel) {
                    await channel.send(`Hey <@&${modRole.id}>, please assist ${interaction.user.username} with their ticket.`);
                }
            } catch (error) {
                console.error('❌ Error tagging Moderator:', error);
            }
        }, 5 * 60 * 1000);

        const filter = (reaction, user) => reaction.emoji.name === '🛑' && user.id === interaction.user.id;
        const collector = ticketMessage.createReactionCollector({ filter, time: 86400000 });

        collector.on('collect', async () => {
            try {
                console.log(`🚪 Ticket closing request by ${interaction.user.tag}`);
                const channel = interaction.guild.channels.cache.get(ticketChannel.id);
                if (channel) {
                    await channel.send('Ticket is closing...');
                    await channel.delete();
                }
            } catch (error) {
                console.error('❌ Error closing ticket:', error);
            }
        });

        collector.on('end', async (collected, reason) => {
            if (reason === 'time') {
                try {
                    console.log(`⌛ Ticket expired for ${interaction.user.tag}`);
                    const channel = interaction.guild.channels.cache.get(ticketChannel.id);
                    if (channel) {
                        await channel.send('Ticket expired and will be closed.');
                        await channel.delete();
                    }
                } catch (error) {
                    console.error('❌ Error during ticket expiration:', error);
                }
            }
        });

    } catch (error) {
        console.error('❌ Error creating ticket channel:', error);
        interaction.reply({ content: 'An error occurred while creating your ticket. Please try again later.', ephemeral: true });
    }
}

module.exports = { sendTicketMessage, handleInteraction };