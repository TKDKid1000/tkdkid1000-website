#!/usr/bin/env node
import app from "../src/server.js"
import config from "../config.js"
app.listen(config.server.port, config.server.hostname, () => {
    console.log(`Server listening on http://${config.server.hostname}:${config.server.port}`)
})