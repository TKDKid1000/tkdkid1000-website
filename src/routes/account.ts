import express from "express"
import session from "cookie-session"
import { Liquid } from "liquidjs"
import marked from "marked"
import fs from "fs"
import path from 'path'
import utils from "../utils.js"
import config from "../config"
import { User } from "../user.js"

export default function (app: express.Application) {
    app.get("/account", (req: express.Request, res: express.Response) => {
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
            res.render("account", {title: config.title, "config": config, "user": session.attributes.user, alerts: [], custompages: files})
        } else {
            res.status(403).render("error/403")
        }
    })
}