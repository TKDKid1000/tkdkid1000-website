const express = require("express")
const session = require("express-session")
const {Liquid} = require("liquidjs")
const marked = require("marked")
const fs = require("fs")
const path = require('path')
const utils = require("../utils")
const config = require("../config")

module.exports = function (app) {
    app.get("/pages/:page", (req, res) => {
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
        var content = ""
        try {
            content = marked(fs.readFileSync(`./pages/${req.params.page}.md`, 'utf-8'))
        } catch (e) {
            content = "# That page does not exist!\nNot a 404 error, just the site owner didn't add this page."
        }
        res.render("custompage", {title: config.title, users: utils.readJson("./data/users.json"), "config": config, "user": session.attributes.user, alerts: [], pageContent: marked(content), custompages: files})
    })
    
    app.get("/pages", (req, res) => {
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
        res.render("custompage", {title: config.title, users: utils.readJson("./data/users.json"), "config": config, "user": session.attributes.user, alerts: [], custompages: files})
    })
}