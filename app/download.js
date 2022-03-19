const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');
const state = require('./state.js');
const dirPath = path.join(__dirname, '../downloads');

async function app() {
    console.log('> [download-robot] Starting...')
    let content = state.load()
    await download(content)
    state.save(content)
    console.log('> [download-robot] Download Completed!')
}

const download = async (content) => {
    const title = await getTitle(content.urlVideo);
    const cleanTitle = await clearTitle(title);    
    const args = 'bv*[height=1080][ext=mp4]+ba[ext=m4a]/bv*[height=720][ext=mp4]+ba[ext=m4a]/bv*[ext=mp4]+ba[ext=m4a]';
   
    return new Promise((resolve, reject) => {
    
        const ls = spawn('yt-dlp', ['-f', args, content.urlVideo, '-o', `${dirPath}/video.mp4`]);

        ls.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
        
        ls.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
            reject(data);
        });
        
        ls.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            fs.renameSync(`${dirPath}/video.mp4`, `${dirPath}/${cleanTitle}.mp4`);
            resolve(code);
        });

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