import express from "express"
import session from "cookie-session"
import { Liquid } from "liquidjs"
import marked from "marked"
import fs from "fs"
import path from 'path'
import utils from "../utils.js"
import config from "../config"

export default function (app: express.Application) {
    app.get("/admin", (req: express.Request, res: express.Response) => {
        var session = req.session;
        if (session.attributes === undefined) {
            session.attributes = {}
        }
        var files: any = []
        fs.readdirSync("./pages").forEach(file => {
            if (path.extname(file) == ".md") {
                files.push(file.replace(".md",""))
            }
        })
        const forums: any = utils.readJson("./data/forums.json")
        
        res.render("admin", {title: config.title, users: utils.readJson("./data/users.json"), "config": config, "user": session.attributes.user, alerts: [], custompages: files, forums: forums})
    })

    app.post("/admin", (req: express.Request, res: express.Response) => {
        var session = req.session;
        if (session.attributes === undefined) {
            session.attributes = {}
        }
        var files: any = []
        fs.readdirSync("./pages").forEach(file => {
            if (path.extname(file) == ".md") {
                files.push(file.replace(".md",""))
            }
        })
        const forums: any = utils.readJson("./data/forums.json")
        const params: any = req.body
        var alerts: any = []
        switch (params["editor-type"]) {
            case "forums": {
                alerts.push({"text": "Saved forums layout.", "type": "success"})
                console.log(JSON.parse(params["json-input"]))
            }
        }
        
        res.render("admin", {title: config.title, "config": config, "user": session.attributes.user, alerts: alerts, custompages: files, forums: forums})
    })
}