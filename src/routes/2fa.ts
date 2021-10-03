import express from "express"
import session from "cookie-session"
import { Liquid } from "liquidjs"
import marked from "marked"
import fs from "fs"
import path from 'path'
import utils from "../utils"
import config from "../config"
import { getUser } from "../user"
import * as twofactor from "node-2fa"

export default function (app: express.Application) {
    app.get("/login/2fa", (req: express.Request, res: express.Response) => {
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
        if (session.attributes.user) res.redirect("/login")
        if (session.attributes.twoFactorUser) {
            res.render("login", {title: config.title, "config": config, "user": session.attributes.user, custompages: files, twoFactorAuth: true})
        } else {
            res.redirect("/login")
        }
    })
    
    app.post("/login/2fa", (req: express.Request, res: express.Response) => {
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
        if (session.attributes.user) res.redirect("/login")
        if (session.attributes.twoFactorUser) {
            const user = getUser(session.attributes.twoFactorUser)
            const verification = twofactor.verifyToken(user.twoFactorAuth.secret, params.token)
            if (verification !== null) {
                if (verification.delta == -1 || verification.delta == 0) {
                    session.attributes.user = user
                    res.redirect("/")
                    return
                }
            }
            res.redirect("/login/2fa")
        } else {
            res.redirect("/login")
        }
    })
}