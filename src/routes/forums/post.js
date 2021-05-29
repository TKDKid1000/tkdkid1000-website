import express from "express"
import session from "express-session"
import { Liquid } from "liquidjs"
import marked from "marked"
import fs from "fs"
import path from 'path'
import utils from "../../utils.js"
import config from "../../../config.js"

export default function (app) {
    app.get("/forums/:c/:f/:p", (req, res) => {
        var session = req.session;
        if (session.attributes === undefined) {
            session.attributes = {}
        }
        var files = []
        fs.readdirSync("./pages").forEach(file => {
            if (path.extname(file) == ".md") {
                files.push(file.replace(".md",""))
            }
        })
        const forums = utils.readJson("./data/forums.json")
        try {
            res.render("forums/post", {title: config.title, users: utils.readJson("./data/users.json"), "config": config, "user": session.attributes.user, alerts: [], custompages: files, forums: forums, post: forums[req.params.c]["channels"][req.params.f]["posts"][req.params.p]})
        } catch (e) {
            res.render("forums/post", {title: config.title, users: utils.readJson("./data/users.json"), "config": config, "user": session.attributes.user, alerts: [], custompages: files, forums: forums, post: false})
        }
    })
}