import express from "express"
import session from "express-session"
import { Liquid } from "liquidjs"
import marked from "marked"
import fs from "fs"
import path from 'path'
import utils from "../utils.js"
import config from "../../config.js"

export default function (app) {
    app.get("/register", (req, res) => {
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
        res.render("register", {title: config.title, "config": config, "user": session.attributes.user, custompages: files})
    })
    
    app.post("/register", (req, res) => {
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
        var usernameTaken = false
        for (var email in users) {
            if (users[email]["username"].toLowerCase() == params.username.toLowerCase()) {
                usernameTaken = true
            }
            if (users[params.email.toLowerCase()]) {
                usernameTaken = true
            }
        }
        if (!usernameTaken) {
            res.render("login", {title: config.title, users: utils.readJson("./data/users.json"), "config": config, "user": session.attributes.user, alerts: [{"text": "Succesfully registered! Please login.", "type": "success"}], custompages: files})
            users[params.email] = {password: params.password, username: params.username}
            utils.writeJson("./data/users.json", users)
        } else {
            alerts.push({text: "There is already an account registered with that email/username!", type: "danger"})
            res.render("register", {title: config.title, users: utils.readJson("./data/users.json"), "config": config, "user": session.attributes.user, alerts: alerts, custompages: files})
        }
    })
}
