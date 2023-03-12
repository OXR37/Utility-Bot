const { codeBlock, SlashCommandBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

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

                    interaction.editReply({ content: codeBlock(response.data.choices[0].text) });
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