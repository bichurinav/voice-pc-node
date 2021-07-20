const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const TOKEN = '';
const YA_API_KEY = '';
const bot = new TelegramBot(TOKEN, { polling: true });
const { execSync } = require('child_process');

bot.on('voice', async (msg) => {
    const stream = bot.getFileStream(msg.voice.file_id);
    let chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => {
        const axiosCfg = {
            method: 'POST',
            url: `https://stt.api.cloud.yandex.net/speech/v1/stt:recognize`,
            headers: {
                Authorization: 'Api-Key ' + YA_API_KEY,
            },
            data: Buffer.concat(chunks),
        };
        axios(axiosCfg).then((res) => {
            const command = res.data.result;
            if (command === 'Плейлист дня') {
                execSync(
                    'start https://music.yandex.ru/home/?script=dayofplaylist',
                    { stdio: 'inherit' }
                );
            }
            if (command === 'Следующий') {
                execSync('start https://music.yandex.ru/home/?script=next', {
                    stdio: 'inherit',
                });
            }
            if (command === 'Предыдущий') {
                execSync('start https://music.yandex.ru/home/?script=prev', {
                    stdio: 'inherit',
                });
            }
            if (command === 'Закрой google') {
                execSync('taskkill /f /im chrome.exe', {
                    stdio: 'inherit',
                });
            }
            if (command === 'Выключи комп') {
                execSync('shutdown -s -t 5', {
                    stdio: 'inherit',
                });
            }
            console.log(command);
        });
    });
});
