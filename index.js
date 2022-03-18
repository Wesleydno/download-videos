const apps = {
    input: require('./app/input.js'),
    download: require('./app/download.js'),
}

async function start() {
     apps.input()
     await apps.download()
}

start()