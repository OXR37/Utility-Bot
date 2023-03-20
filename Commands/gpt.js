const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');

const configuration = new Configuration({
    apiKey: ''
});

const openai = new OpenAIApi(configuration);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gpt')
        .setDescription('Ask ChatGPT for an answer or question!')
        .addSubcommand(subcommand => subcommand.setName('question')
            .setDescription('Ask ChatGPT a question!')
            .addStringOption(option => option.setName('question')
                .setDescription('What do you want to ask?')
                .setRequired(true))
        )
        .addSubcommand(subcommand => subcommand.setName('image')
            .setDescription('Ask ChatGPT to generate an image!')
            .addStringOption(option => option.setName('image')
                .setDescription('What do you want to generate?')
                .setRequired(true))
        ),
    async execute(interaction) {
        await interaction.deferReply();

        const subCommand = interaction.options.getSubcommand();

        const question = interaction.options.getString('question');
        const image = interaction.options.getString('image');

        switch (subCommand) {
            case 'question': {
                interaction.editReply({ content: 'Please wait while your question is being processed!' });

                try {
                    const response = await openai.createCompletion({
                        model: 'text-davinci-003',
                        prompt: question,
                        max_tokens: 2048,
                        temperature: 0.5
                    });

                    fs.writeFile('response.html', `<html><head><style>@import url(https://fonts.googleapis.com/css2?family=Alegreya+Sans:wght@100;300;400;500;700;800;900&display=swap);*{margin:0;padding:0;box-sizing:border-box;font-family:"Alegreya Sans",sans-serif}body{background:#343541}#app{width:100vw;height:100vh;background:#343541;display:flex;flex-direction:column;align-items:center;justify-content:space-between}#chat{flex:1;width:100%;height:100%;overflow-y:scroll;display:flex;flex-direction:column;gap:10px;-ms-overflow-style:none;scrollbar-width:none;padding-bottom:20px;scroll-behavior:smooth}#chat::-webkit-scrollbar{display:none}.wrapper{width:100%;margin:20px;padding:15px;border-radius:8px}.ai{background:#40414f}.chat{width:100%;max-width:1280px;margin:0 auto;display:flex;flex-direction:row;align-items:flex-start;gap:10px}.profile{width:36px;height:36px;border-radius:5px;background:#5436da;display:flex;justify-content:center;align-items:center}.ai .profile{background:#10a37f}.profile img{width:60%;height:60%;object-fit:contain}.message{flex:1;color:#dcdcdc;font-size:20px;max-width:100%;overflow-x:scroll;white-space:pre-wrap;-ms-overflow-style:none;scrollbar-width:none}.message::-webkit-scrollbar{display:none}</style></head><body><div id="app"><div id="chat"><div class="wrapper"><div class="chat"><div class="profile"><img src="${interaction.user.displayAvatarURL({ dynamic: true })}"></div><div class="message">${question}</div></div></div><div class="wrapper ai"><div class="chat"><div class="profile"><img src="https://seeklogo.com/images/C/chatgpt-logo-02AFA704B5-seeklogo.com.png"></div><div class="message">${response.data.choices[0].text}</div></div></div></div></div></body></html>`, function () {
                        const attachment = new AttachmentBuilder('./response.html');

                        interaction.editReply({ content: 'Here is the answer for your question! 🙋‍♂️\nClick the file to donwload and preview it. 🗃️', files: [attachment] });
                    });
                } catch (error) {
                    console.log(error);
                    interaction.editReply({ content: 'Request failed! Please try again later!' });
                }
            }
                break;

            case 'image': {
                interaction.editReply({ content: 'Please wait while your image is being generated!' });

                try {
                    const response = await openai.createImage({
                        prompt: image,
                        n: 1,
                        size: '1024x1024',
                    });

                    interaction.editReply({ content: response.data.data[0].url });
                } catch (error) {
                    console.log(error);
                    interaction.editReply({ content: 'Request failed! Please try again later!' });
                }
            }
                break;
        }
    },
};