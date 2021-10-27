#!/usr/bin/env node
import app from "./server"
import config from "./config"

app.listen(config.server.port, config.server.hostname, () => {
    console.log(`Server listening on http://${config.server.hostname}:${config.server.port}`)
})