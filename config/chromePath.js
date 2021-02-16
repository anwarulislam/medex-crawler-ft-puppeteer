const os = require('os')
let chromiumPath = '/usr/bin/chromium-browser'

if (os.platform() == 'win32') {
    chromiumPath = 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
}

let chromeConfig = { headless: true, executablePath: chromiumPath, args: ['--no-sandbox'] }

module.exports = { chromiumPath, chromeConfig }