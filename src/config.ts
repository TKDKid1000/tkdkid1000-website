import utils from "./utils"

const configJson = utils.readJson("./config.json")

const Config = {
    server: {
        hostname: configJson.server.hostname,
        port: configJson.server.port
    },
    author: {
        name: configJson.author.name,
        url: configJson.author.url
    },
    title: configJson.title,
    navbar: configJson.navbar,
    copyright: configJson.copyright
}

export default Config