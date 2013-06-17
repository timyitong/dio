var everyauth =  require('everyauth')
var express = require('express')
var app=express()
app.bcrypt = require('bcrypt')
app.im=require('imagemagick')
app.fs=require('fs')
app.application_root = __dirname
app.__SITE__="http://localhost:3000"
app.path = require("path")
app.mongoose = require("mongoose")
app.moment = require('moment')
app.moment.relativeTime={
	future: "in %s",
	past: "%s ago",
	s:"1 second",
	ss: "%d seconds",
	m: "1 minute",
	mm: "%d minutes",
    h: "1 hour",
    hh: "%d hours",
    d: "1 day",
    dd: "%d days",
    M: "1 month",
    MM: "%d months",
    y: "1 year",
    yy: "%d years"
}

var config=require('./config.js')(app,express,everyauth)

var models = require('./models/models.js')(app.mongoose)

require('./routes')(app, models)

app.listen(3000);
console.log("Listening on port 3000")