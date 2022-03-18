const fs = require('fs');
const path = require('path');
const state = require('./state.js');
const util = require('util');
const exec = util.promisify(require("child_process").exec);
const dirPath = path.join(__dirname, '../downloads');

async function app() {
    console.log('> [download-robot] Starting...')
    let content = state.load()
    await download(content)
    state.save(content)
    console.log('> [download-robot] Download Completed!')
}

const download = async (content) => {
    let title = await getTitle(content.urlVideo);
    let cleanTitle = await clearTitle(title);

    return new Promise((resolve, reject) => {
        exec(`yt-dlp -f 'bv*[height=1080][ext=mp4]+ba[ext=m4a]/bv*[height=720][ext=mp4]+ba[ext=m4a]/bv*[ext=mp4]+ba[ext=m4a]' ${content.urlVideo} -o downloads/video.mp4`,
            (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                }
                content.titleVideo = title;
                fs.renameSync(`${dirPath}/video.mp4`, `${dirPath}/${cleanTitle}.mp4`);
                console.log(stdout.toString())
                resolve(content);
            })

    })
}

const getTitle = async (content) => {
    return new Promise((resolve, reject) => {
        exec(`yt-dlp --get-title ${content}`,
            (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                }
                resolve(stdout.toString());
            })
    })
}

const clearTitle = async (title) => {
    const cleanTitle = title.replace(/\||\?|\\|\/|\:|\*|"|\<|\>/g,'-').slice(0, -1);
    return cleanTitle;
}

module.exports = app;