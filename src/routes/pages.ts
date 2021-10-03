import express from "express"
import session from "cookie-session"
import { Liquid } from "liquidjs"
import marked from "marked"
import fs from "fs"
import path from 'path'
import utils from "../utils.js"
import config from "../config"

export default function (app: express.Application) {
    app.get("/pages/:page", (req: express.Request, res: express.Response) => {
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
        var content: string = ""
        try {
            content = marked(fs.readFileSync(`./pages/${req.params.page}.md`, 'utf-8'))
        } catch (e) {
            content = "# That page does not exist!\nNot a 404 error, just the site owner didn't add this page."
        }
        res.render("custompage", {title: config.title, "config": config, "user": session.attributes.user, alerts: [], pageContent: marked(content), custompages: files})
    })
    
    app.get("/pages", (req: express.Request, res: express.Response) => {
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
        res.render("custompage", {title: config.title, "config": config, "user": session.attributes.user, alerts: [], custompages: files})
    })
}