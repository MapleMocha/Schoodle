"use strict";

require('dotenv').config();

const PORT          = process.env.PORT || 8080;
const ENV           = process.env.ENV || "development";
const express       = require("express");
const bodyParser    = require("body-parser");
const sass          = require("node-sass-middleware");
const app           = express();
const cookieParser  = require('cookie-parser');
const cookieSession = require('cookie-session');
const bcrypt        = require('bcryptjs');


const knexConfig    = require("./knexfile");
const knex          = require("knex")(knexConfig[ENV]);
const morgan        = require('morgan');
const knexLogger    = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes   = require("./routes/users");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.use(cookieSession({
  name: 'session',
  keys: ["big boi with big secrets"],

  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

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
  let {name, email, title, description, day, timeStart, timeEnd} = req.body;
  Promise.all([
    knex('admin')
      .insert({name: name, email: email})
      .returning('id')
      .then(function(id) {
        knex('event')
        .insert({name: title, adminId: id[0], description: description})
        .returning('id')
        .then(function(id) {
          knex('date_options')
          .insert({date: day, timeStart: `${day} ${timeStart}`, timeEnd: `${day} ${timeEnd}`, eventId: id[0]})
          .then(function() {
            console.log("inserted")
          })
        })
      })
      .catch(function(err) {
        console.log(err);
      }),
    ])

  // res.redirect("/event/:id")
})

app.post("/register", (req, res) => {

  const fullNameSubmitted = req.body.name;
  const emailSubmitted = req.body.email;
  const hashedPass = bcrypt.hashSync(req.body.password, 10);

  knex.where({
    'email': emailSubmitted
    })
    .select('*')
    .from('admin')
    .then(function (result) {

      if (result == false) {
        knex('admin')
          .insert({name: fullNameSubmitted, email: emailSubmitted, password: hashedPass})
          .returning('id')
          .then(function(id) {

            req.session.user_id = id;

            res.redirect("/");

          });
      } else {
        res.sendStatus(400);
      }

    });

  // if (knex.select(email).from('admin') === email) {
  //   console.log("Ya done fucked up kid");
  // }


  // for (let user in users) {           //Makes sure email and password are filled in + if user already exists.
  //   if (req.body.name === '' || req.body.email === '' || req.body.password === '' || req.body.email === knex.select('email').from('admin')) {
  //     res.sendStatus(400);
  //   }
  // }
  // Promise.all([
  //   knex('admin')
  //     .insert({name: name})
  //   ])
  // // req.body.id = generateRandomString(); //Creates a unique ID for the new user.
  // users[req.body.id] = req.body;
  // const pass = req.body.password;
  // const hashedPass = bcrypt.hashSync(pass, 10);
  // req.session.user_id = req.body.id;   //Creates the cookie "user_id" which will remember who is logged in.

});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
