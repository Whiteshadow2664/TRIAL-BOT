const { EmbedBuilder } = require('discord.js');
const dddQuestions = require('./ddd');
const activeQuizzes = {};

module.exports = {
    name: 'ddd',
    description: 'Play the Die Das Der game!',
    async execute(message) {
        if (activeQuizzes[message.author.id]) {
            return message.channel.send('You are already participating in a game! Finish it before starting a new one.');
        }

        try {
            activeQuizzes[message.author.id] = {
                level: 'A1',
                score: 0,
                totalTime: 0,
                streak: 0,
                bonusPoints: 0,
                results: [],
                incorrectWord: null,
                incorrectAnswer: null,
                correctAnswer: null
            };

            let levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
            let currentLevelIndex = 0;
            let gameActive = true;
            let lastQuestionMessage = null;

            while (gameActive) {
                let currentLevel = levelOrder[currentLevelIndex];
                let questions = dddQuestions[currentLevel];
                if (!questions || questions.length === 0) {
                    return message.channel.send(`No questions available for level ${currentLevel}.`);
                }

                let shuffledQuestions = [...questions].sort(() => Math.random() - 0.5).slice(0, 3);

                for (const question of shuffledQuestions) {
                    if (lastQuestionMessage) {
                        await lastQuestionMessage.delete().catch(() => {});
                    }

                    const embed = new EmbedBuilder()
    .setTitle('Die Das Der')
    .setDescription(`What is the correct article for **"${question.word}"**?\n\nA) Die\nB) Das\nC) Der`)
    .setColor('#acf508')
    .setFooter({ text: 'React with the correct answer!' });

lastQuestionMessage = await message.channel.send({ embeds: [embed] });

                    const answerEmojis = ['🇦', '🇧', '🇨'];
                    const correctAnswer = question.correct;
                    const answerMap = { 'Die': '🇦', 'Das': '🇧', 'Der': '🇨' };

                    for (const emoji of answerEmojis) {
                        await lastQuestionMessage.react(emoji);
                    }

                    const startTime = process.hrtime(); // Start high-precision timer

                    const reaction = await lastQuestionMessage.awaitReactions({
                        filter: (reaction, user) => answerEmojis.includes(reaction.emoji.name) && user.id === message.author.id && !user.bot,
                        max: 1,
                        time: 15000,
                    });

                    const elapsedTime = process.hrtime(startTime);
                    const answerTime = elapsedTime[0] + elapsedTime[1] / 1e9; // Convert to seconds with microsecond accuracy

                    let userAnswer = 'No Answer';
                    let isCorrect = false;

                    if (reaction.size) {
                        userAnswer = Object.keys(answerMap).find(key => answerMap[key] === reaction.first().emoji.name);
                        isCorrect = userAnswer === correctAnswer;
                    }

                    activeQuizzes[message.author.id].totalTime += answerTime;

                    if (isCorrect) {
                        activeQuizzes[message.author.id].score++;
                        activeQuizzes[message.author.id].streak++;

                        // Streak Bonus
                        if (activeQuizzes[message.author.id].streak === 10) {
                            activeQuizzes[message.author.id].bonusPoints += 1;
                        } else if (activeQuizzes[message.author.id].streak === 20) {
                            activeQuizzes[message.author.id].bonusPoints += 1;
                        }
                    } else {
                        gameActive = false;
                        activeQuizzes[message.author.id].incorrectWord = question.word;
                        activeQuizzes[message.author.id].incorrectAnswer = userAnswer;
                        activeQuizzes[message.author.id].correctAnswer = correctAnswer;
                        break;
                    }

                    activeQuizzes[message.author.id].results.push({
                        word: question.word,
                        userAnswer: userAnswer,
                        correct: correctAnswer,
                        isCorrect: isCorrect,
                    });

                    await lastQuestionMessage.delete();
                }

                if (gameActive) {
                    currentLevelIndex++;
                    if (currentLevelIndex >= levelOrder.length) {
                        currentLevelIndex = levelOrder.length - 1;
                    }
                }
            }

            // Delete the last question before showing the result
            if (lastQuestionMessage) {
                await lastQuestionMessage.delete().catch(() => {});
            }

            // Prepare final result embed
            const result = activeQuizzes[message.author.id];

            let praiseMessage = "😎 **Great job! Your German skills are impressive!**";
            if (result.score >= 15) {
                praiseMessage = "🏆 **You're a Die-Das-Der Master! No article can stop you!**";
            } else if (result.score >= 10) {
                praiseMessage = "💪 **Awesome! Your articles are on point!**";
            } else if (result.score >= 5) {
                praiseMessage = "👍 **Not bad! Keep practicing!**";
            } else {
                praiseMessage = "😅 **Oof... maybe stick to 'das Ding' for everything?**";
            }

            const resultsText = result.results.map(res =>
                `**Word:** ${res.word}\nYour Answer: ${res.userAnswer} ${res.isCorrect ? '✅' : '❌'}`
            ).join('\n\n');

            let mistakeText = `❌ **Mistake on:** ${result.incorrectWord}\n`
                + `Your Answer: ${result.incorrectAnswer} ❌\n`
                + `Correct Answer: ${result.correctAnswer} ✅`;

            let description = `You reached **Level ${levelOrder[currentLevelIndex]}** before making a mistake.\n\n`
                + `**Final Score:** ${result.score}\n`
                + `**Total Time:** ${result.totalTime.toFixed(6)}s\n`;

            if (result.bonusPoints > 0) {
                description += `**Total Bonus:** ${result.bonusPoints} points\n\n`;
            }

            description += `${praiseMessage}\n\n`
                + `**Results:**\n${resultsText}\n\n`
                + `${mistakeText}`;

            const finalEmbed = new EmbedBuilder()
                .setTitle('Game Over!')
                .setDescription(description)
                .setColor('#acf508');

            await message.channel.send({ embeds: [finalEmbed] });

            delete activeQuizzes[message.author.id];
        } catch (error) {
            console.error(error);
            message.channel.send('An error occurred while running the quiz.');
            delete activeQuizzes[message.author.id];
        }
    }
};