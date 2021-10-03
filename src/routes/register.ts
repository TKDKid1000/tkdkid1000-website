import express from "express"
import session from "cookie-session"
import { Liquid } from "liquidjs"
import marked from "marked"
import fs from "fs"
import path from 'path'
import utils from "../utils"
import config from "../config"
import {getUsers, userExists, usernameTaken, writeUser} from "../user"
import * as twofactor from "node-2fa"
import crypto from "crypto"
import { sendEmail } from "../email"

export default function (app: express.Application) {
    app.get("/register", (req: express.Request, res: express.Response) => {
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
        res.render("register", {title: config.title, "config": config, "user": session.attributes.user, custompages: files})
    })
    
    app.post("/register", (req: express.Request, res: express.Response) => {
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
        var alerts: any = []
        if (!userExists(params.email) && !usernameTaken(params.username)) {
            res.render("login", {title: config.title, "config": config, "user": session.attributes.user, alerts: [{"text": "Succesfully registered! Please login.", "type": "success"}], custompages: files})
            const user = {
                email: params.email,
                password: params.password,
                username: params.username,
                twoFactorAuth: twofactor.generateSecret({name: config.title, account: params.email}),
                twoFactorAuthEnabled: false,
                verified: false,
                verificationToken: crypto.randomBytes(48).toString("hex")
            }
            writeUser(user)
            sendEmail(user.email, "Verify Email", `<p>Please click this link to verify your email! <a href="${req.protocol+"://"+req.get("Host")+req.url+"/verify/"+user.verificationToken}">Verify</a></p>`)
        } else {
            alerts.push({text: "There is already an account registered with that email/username!", type: "danger"})
            res.render("register", {title: config.title, "config": config, "user": session.attributes.user, alerts: alerts, custompages: files})
        }
    })

    app.get("/register/verify/:token", (req: express.Request, res: express.Response) => {
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
        const token = req.params.token
        const user = getUsers().find(user => user.verificationToken === token)
        if (user) {
            if (user.verified) {
                res.render("login", {title: config.title, "config": config, "user": session.attributes.user, alerts: [{"text": "You are already verified. Please login.", "type": "success"}], custompages: files})
            } else {
                res.render("login", {title: config.title, "config": config, "user": session.attributes.user, alerts: [{"text": "Verified your email. Please login.", "type": "success"}], custompages: files})
                user.verified = true
                writeUser(user)
            }
        } else {
            res.redirect("/register")
        }
    })
}
