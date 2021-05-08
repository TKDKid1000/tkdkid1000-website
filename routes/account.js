const express = require("express")
const session = require("express-session")
const {Liquid} = require("liquidjs")
const marked = require("marked")
const fs = require("fs")
const path = require('path')
const utils = require("../utils")
const config = require("../config")

module.exports = function (app) {
    app.get("/account", (req, res) => {
        var session = req.session;
        if (session.attributes === undefined) {
            session.attributes = {}
        }
        res.render("account", {title: config.title, "config": config, "user": session.attributes.user, alerts: []})
    })
}