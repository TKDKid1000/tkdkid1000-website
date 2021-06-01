import express from "express"
import session from "cookie-session"
import { Liquid } from "liquidjs"
import marked from "marked"
import fs from "fs"
import path from 'path'
import utils from "../../utils.js"
import config from "../../config.json"

export default function (app: express.Application) {
    app.get("/forums/create", (req: express.Request, res: express.Response) => {
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
        if (!session.attributes.user) {
            res.status(403).render("error/403", {title: config.title, users: utils.readJson("./data/users.json"), "config": config, "user": session.attributes.user, alerts: [], custompages: files})
            return
        }
        const forums: any = utils.readJson("./data/forums.json")
        res.render("forums/create", {title: config.title, users: utils.readJson("./data/users.json"), "config": config, "user": session.attributes.user, alerts: [], custompages: files, forums: forums})
    })
    app.post("/forums/create", (req: express.Request, res: express.Response) => {
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
        if (session.attributes.user) {
            var forums: any = utils.readJson("./data/forums.json")
            const params: any = req.body
            const channelPath: string = params["channel"].split("/")
            forums[channelPath[0]]["channels"][channelPath[1]]["posts"].push({
                title: params.title,
                timestamp: new Date().getTime(),
                content: params.content,
                author: session.attributes.user.email,
                comments: []
            })
            forums[channelPath[0]]["channels"][channelPath[1]]["lastpost"] = forums[channelPath[0]]["channels"][channelPath[1]]["posts"].length-1
            utils.writeJson("./data/forums.json", forums)
            res.render("forums/forums", {title: config.title, users: utils.readJson("./data/users.json"), "config": config, "user": session.attributes.user, alerts: [{text: "Successfully posted to the forums!", type: "success"}], custompages: files, forums: forums})
        } else {
            res.status(403).render("error/403")
        }
        
    })
}