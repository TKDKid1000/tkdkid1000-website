import express from "express"
import session from "express-session"
import { Liquid } from "liquidjs"
import marked from "marked"
import fs from "fs"
import path from 'path'
import utils from "../utils.js"
import config from "../../config.js"

export default function (app) {
    app.get("/login", (req, res) => {
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
        res.render("login", {title: config.title, users: utils.readJson("./data/users.json"), "config": config, "user": session.attributes.user, custompages: files})
    })
    
    app.post("/login", (req, res) => {
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
        const users = utils.readJson("./data/users.json")
        const params = req.body
        var alerts = []
        if (users[params.email] !== undefined) {
            if (alerts.length == 0) {
                if (users[params.email]["password"] == params.password) {
                    session.attributes.user = {"email": params.email, "password": params.password}
                    res.redirect("/")
                    return
                } else {
                    alerts.push({text: "An incorrect password was specified!", type: "danger"})
                }
            }
        } else {
            alerts.push({text: "No user is registered with that email!", type: "danger"})
        }
        res.render("login", {title: config.title, users: utils.readJson("./data/users.json"), "config": config, "user": session.attributes.user, alerts: alerts, custompages: files})
    })
}