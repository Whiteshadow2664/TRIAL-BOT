const { EmbedBuilder } = require('discord.js');

const embedColors = {
    russian: '#7907ff',
    german: '#f4ed09',
    french: '#09ebf6',
    default: '#acf508', // Default color for the embed
};

module.exports = {
    name: 'resources',
    description: 'Shares helpful resources for learning languages.',
    execute: async (message) => {
        const embed = new EmbedBuilder()
            .setTitle('Language Learning Resources')
            .setDescription(
                '**Russian**:\n' +
                '1. **YouTube**: [Real Russian Club](https://youtube.com/@realrussianclub?si=EBfp-OaeKlbDPvGM)\n' +
                '2. **Books**:\n' +
                '   - [Learn Russian Polyglot Planet](https://drive.google.com/file/d/1JLk1LE5Ot4SQkHRZPetD6NCSuyDGYt5w/view?usp=drivesdk)\n' +
                '3. **Vocabulary PDF**: [Download](https://drive.google.com/file/d/1I9i72NHcSHIrBEHdxMH3vGkwZVnVcGZ5/view?usp=drivesdk)\n\n' +
                '**German**:\n' +
                '1. **YouTube**: [Learn German Original](https://youtube.com/@learngermanoriginal?si=r_THc9xCajUCafmd)\n' +
                '2. **Books**:\n' +
                '   - [German Made Simple by Arnold Leitner](https://drive.google.com/file/d/1JFoHN_dA8PQm59M8Z8bubJoIp4O5Am0y/view?usp=drivesdk)\n' +
                '   - [German Sentence Structure Cheat Sheet](https://drive.google.com/file/d/1JGTN_-CCRmzUIUi87upWx-iwWAwSKTx4/view?usp=drivesdk)\n' +
                '3. **Vocabulary PDF**: [Download](https://drive.google.com/file/d/1I73hvUDb3uvVNP98oAEbOvVYGLv1NlKO/view?usp=drivesdk)\n\n' +
                '**French**:\n' +
                '1. **YouTube**: [Lingoni French](https://youtube.com/@lingonifrench?si=WHIrGNAYd9fNwzOS)\n' +
                '2. **Books**:\n' +
                '   - [Learn French in a Hurry](https://drive.google.com/file/d/1JFsRazcSLg69Mxmqcb4N_C5cglpNLlSH/view?usp=drivesdk)\n' +
                '   - [Learn French with Stories](https://drive.google.com/file/d/1JKoQrtAtpF9GQqQy7sKAfSoTZD_B5z01/view?usp=drivesdk)\n' +
                '3. **Vocabulary PDF**: [Download](https://drive.google.com/file/d/1I4p26ddR2Wy_XsB2dtX_5uwvsjYq69So/view?usp=drivesdk)\n\n' +
                '**Other Helpful Videos**:\n' +
                '1. [Nico Weg A1](https://youtu.be/4-eDoThe6qo?si=IdydKencCJuDj9aY)\n' +
                '2. [What Do The French Want for Christmas?](https://youtu.be/j9n3Bc7Nkqs?si=pWKbaKJclcB9G2Xd)'
            )
            .setColor(embedColors.default)
            .setFooter({ text: 'Explore these resources to enhance your learning!' });

        await message.channel.send({ embeds: [embed] });
    },
};