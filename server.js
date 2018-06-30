//jshint esversion: 6
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

// Settings for the session
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
  let templateVars = {userObject: req.session.user_id};
  res.render("index", templateVars);
});

// Create new event page
app.get("/events/new", (req, res) => {
  let templateVars = {userObject: req.session.user_id};
  res.render("create", templateVars);
});

// Event page
app.get("/events/:id", (req, res) => {

 let info = [];
 let templateVars = {
       uniqueUrl: req.params.id,
       // longURL: Document.URL
       dayNum: [],
       dayName: [],
       month: [],
       year: [],
       startTime: [],
       endTime: [],
       users:[],
       userChoices: [],
       allDateOptionIds: [],
       eventDescript: [],
       // currentUser: '',
       // eventId: '',
       // eventId: req.body.eventId,
       userObject: req.session.user_id,

     };
   let currEvent;

   knex.where({
     uniqueURL: req.params.id,
   })
   .select('*')
   .from('event')
   .then(function (results){
     currEvent = results[0].id;
     templateVars['eventId'] = currEvent;
     templateVars['eventDescript'].push(results[0].description);

    Promise.all([

      //find how many date options there were for the selected event
      knex.where({
            eventId: currEvent,
          })
          .count('*')
          .from('date_options')
          .then(function(result) {
            templateVars['columnCount'] = result[0].count;
          })
          .catch(function(err) {
            console.log(err);
          }),

      //get the specific dates for each option
      knex.where({
            eventId: currEvent,
          })
          .select('*')
          .from('date_options')
          .then(function(result) {
             for(let i in result){
               let date = String(result[i].date);
               templateVars['dayName'].push(date.slice(0,3)); //dayName
               templateVars['dayNum'].push(date.slice(8,10)); //dayNum
               templateVars['month'].push(date.slice(4,7)); //month
               templateVars['year'].push(date.slice(11,15)); //year

               let startTime = formatTime(result[i].timeStart);
               templateVars['startTime'].push(startTime); //startTime

               let endTime = formatTime(result[i].timeEnd);
               templateVars['endTime'].push(endTime); //endTime

               templateVars['allDateOptionIds'].push(result[i].id);
             }
          }),

       //get the users that have responded to the selected event
       knex.where({
              eventId: currEvent,
           })
           .select('*')
           .from('users')
           .then(function(result) {

               let extra = [];

               for(let i in result){
                 let userName = result[i].name;
                 let userEmail = result[i].email;
                 let id = result[i].id;
                 templateVars['users'].push([userName, userEmail, id, []]);

                 //get each user's selected date_options
                 extra.push(knex.where({
                        usersId: id,
                        eventId: currEvent,
                     })
                     .select('*')
                     .from('usersDateOptions')
                     .innerJoin('date_options', 'usersDateOptions.dateOptionsId', 'date_options.id')
                     .then(function(result) {

                       for(let j in result){
                         templateVars['users'][i][3].push(result[j].dateOptionsId);
                       }
                     }));
             }
             return Promise.all(extra);
           }),


      ]).then(function(result) {

        res.render("event", templateVars);

      });
  });
});

app.post('/events/:id', (req, res) => {

  let name = req.body.name;
  let email = req.body.email;
  let eventId = req.body.eventId;
  let currDateOptionsIds = req.body.dateOptionsId;
  let newId;


  knex('users').insert({name: name, email: email, eventId: eventId})
                 .returning('id')
                 .then(function(id){


                   newId = id;
                   var extra = [];

                   for(let i = 0; i < currDateOptionsIds.length; i++){

                     extra.push(knex('usersDateOptions').insert({
                                                            dateOptionsId: Number(currDateOptionsIds[i]),
                                                            usersId:newId[0]
                                                          }));


                    }
                    return Promise.all(extra);
                  })

                 .then(function () {
                   res.redirect('/events/:id');
                 });
});

// Logs out the User by clearing the session
app.post("/logout", (req,res) => {
  req.session = null;
  res.redirect("/");
});

// Logs in the User
app.post("/login", (req, res) => {

  const emailSubmitted = req.body.email;
  const passwordSubmitted = req.body.password;

  // Checks if the credentials match an email and password in the database.
  knex.where({
    'email': emailSubmitted,
    })
    .select('*')
    .from('admin')
    .then(function(result){
      bcrypt.compare(passwordSubmitted, result[0].password)
      .then(function(resu) {
        if (resu == false) {
          res.sendStatus(400);
        }
        req.session.user_id = result[0].id;
        res.redirect("/");
      });
    });
  });



// Registers a new user
app.post("/register", (req, res) => {

  const fullNameSubmitted = req.body.name;
  const emailSubmitted = req.body.email;

    // Makes sure all fields are filled
    if (fullNameSubmitted === '' || emailSubmitted === '' || req.body.password === '') {
      res.sendStatus(400);
    }

    // Stores the new hashed password in a variable
  const hashedPass = bcrypt.hashSync(req.body.password, 10);


  knex.where({
    'email': emailSubmitted
    })
    .select('*')
    .from('admin')
    .then(function (result) {

      // If the email isn't already in the database. If it isn't register the user and logs him in.
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
});


// Helper function to put times in 12 hour clock and format
const formatTime = function(timeObject){
    let newTime = String(timeObject).slice(16,21);
    let temp = Number(newTime.slice(0,2));
    if(temp > 12){
      temp -= 12;
      return '0'+temp+newTime.slice(2)+'pm';
    } else if (temp == 0){
      return '12:00am';
    } else{
      return newTime+'am';
    }
  };

// Create page
app.get("/events", (req, res) => {
  res.render("create");
});

// Post to Event page
app.post("/events", (req, res) => {
  const generateShortUrl = function(){
    const uniqueKey = Math.random().toString(36).replace('0.','').split('').slice(0,12).join('');
    return uniqueKey;
  };
  let uniqueUrl = generateShortUrl();
  let existingAdminID;
  knex.select('id').from('admin').where('id', req.session.user_id).then(function(result) {
    existingAdminID = result[0].id;
    let {name, email, title, description, day, start, end} = req.body;
    Promise.all([
          knex('event')
            .insert({name: title, adminId: existingAdminID, description: description, uniqueURL:uniqueUrl})
            .returning('id')
            .then(function(id) {
              if (typeof start === 'string') {
                knex('date_options')
                  .insert({date: day, timeStart: `${day} ${start}:00`, timeEnd: `${day} ${end}:00`, eventId: id[0]})
                  .then(function() {
                    console.log("inserted");
                  });
              }
              else {
              for (var i = 0; i < start.length; i++) {
                knex('date_options')
                  .insert({date: day, timeStart: `${day} ${start[i]}:00`, timeEnd: `${day} ${end[i]}:00`, eventId: id[0]})
                  .then(function() {
                    console.log("inserted");
                  });
                }
              }
            })
    ]).then(function() {
      setTimeout(function() {res.redirect(`events/${uniqueUrl}`)}, 500);
    });
  })

});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
