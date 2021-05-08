const express = require("express")
const session = require("express-session")
const {Liquid} = require("liquidjs")
const marked = require("marked")
const fs = require("fs")
const path = require('path')
const utils = require("../utils")
const config = require("../config")

module.exports = function (app) {
    app.get("/register", (req, res) => {
        var session = req.session;
        if (session.attributes === undefined) {
            session.attributes = {}
        }
        res.render("register", {title: config.title, "config": config, "user": session.attributes.user})
    })
    
    app.post("/register", (req, res) => {
        var session = req.session;
        if (session.attributes === undefined) {
            session.attributes = {}
        }
        const users = utils.readJson("./data/users.json")
        const params = req.body
        var alerts = []
        if (users[params.email] === undefined) {
            res.render("login", {title: config.title, "config": config, "user": session.attributes.user, alerts: {"text": "Succesfully registered! Please login.", "type": "success"}})
            users[params.email] = {password: params.password, cart: []}
            utils.writeJson("./data/users.json", users)
        } else {
            alerts.push({text: "There is already an account registered with that email!", type: "danger"})
            res.render("register", {title: config.title, "config": config, "user": session.attributes.user, alerts: alerts})
        }
    })
}
