"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));

// Home page

app.get("/", (req, res) => {
  res.render("index");
});

// Create page

app.get("/events/new", (req, res) => {
  res.render("create");
});

// Post to Event page

app.post("/events", (req, res) => {
  //console.log(req.body);
  let {name, email, title, description, day, start, end} = req.body;
  Promise.all([
    knex('admin')
      .insert({name: name, email: email})
      .returning('id')
      .then(function(id) {
        knex('event')
          .insert({name: title, adminId: id[0], description: description})
          .returning('id')
          .then(function(id) {
            if (typeof start === 'string') {
              knex('date_options')
                .insert({date: day, timeStart: `${day} ${start}:00`, timeEnd: `${day} ${end}:00`, eventId: id[0]})
                .then(function() {
                  console.log("inserted")
                })
            }
            else {
            for (var i = 1; i < start.length; i++) {
              knex('date_options')
                .insert({date: day, timeStart: `${day} ${start[i]}:00`, timeEnd: `${day} ${end[i]}:00`, eventId: id[0]})
                .then(function() {
                  console.log("inserted")
                })
              }
            }
            })
        })
      .catch(function(err) {
        console.log(err);
      }),
  ])
})


app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
