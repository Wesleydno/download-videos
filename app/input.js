const readline = require('readline-sync');
const state = require('./state.js')

function app() {
    const content = {}
    
    content.urlVideo = askAndReturnUrlVideo()
    content.urlVideo = sanitizeUrl(content.urlVideo)

    state.save(content)

    function askAndReturnUrlVideo() {
        return readline.question('Qual a Url do Video ?\n')
    }

    function sanitizeUrl(url){
        let video_id = url.split('v=')[1];
        let ampersandPosition = video_id.indexOf('&');
        if(ampersandPosition != -1) {
            url = `${url.split('v=')[0]}v=${video_id.substring(0, ampersandPosition)}`;         
        }
        return url;
    }
}

module.exports = app;