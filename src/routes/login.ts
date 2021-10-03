import express from "express"
import session from "cookie-session"
import { Liquid } from "liquidjs"
import marked from "marked"
import fs from "fs"
import path from 'path'
import utils from "../utils"
import config from "../config"
import { getUser } from "../user"

export default function (app: express.Application) {
    app.get("/login", (req: express.Request, res: express.Response) => {
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
        res.render("login", {title: config.title, "config": config, "user": session.attributes.user, custompages: files})
    })
    
    app.post("/login", (req: express.Request, res: express.Response) => {
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
        const params: any = req.body
        const user = getUser(params.email)
        var alerts: any = []
        if (user !== undefined) {
            if (alerts.length == 0) {
                if (user.password == params.password) {
                    if (user.verified) {
                        console.log(user)
                        if (user.twoFactorAuthEnabled) {
                            session.attributes.twoFactorUser = user.email
                            res.redirect("/login/2fa")
                        } else {
                            session.attributes.user = user
                            res.redirect("/")
                        }
                        return
                    } else {
                        alerts.push({text: "That email is not yet verified!", type: "danger"})
                    }
                } else {
                    alerts.push({text: "An incorrect password was specified!", type: "danger"})
                }
            }
        } else {
            alerts.push({text: "No user is registered with that email!", type: "danger"})
        }
        res.render("login", {title: config.title, "config": config, "user": session.attributes.user, alerts: alerts, custompages: files})
    })
}