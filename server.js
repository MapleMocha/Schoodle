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
       currentUser: '',

     };

  Promise.all([

    //find how many date options there were for the selected event
    knex.where({
        eventId: 1,
        })
        .count('*')
        .from('date_options')
        .then(function(result) {

          templateVars['columnCount'] = result[0].count;
        }),

    //get the specific dates for each option
    knex.where({
          eventId: 1,
        })
        .select('*')
        .from('date_options')
        .then(function(result) {
           for(let i in result){
             let date = String(result[i].date)
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
            eventId: 1,
         })
         .select('*')
         .from('users')
         .then(function(result) {
           // console.log(result)
             let extra = [];

             for(let i in result){
               let userName = result[i].name;
               let userEmail = result[i].email;
               let id = result[i].id;
               templateVars['users'].push([userName, userEmail, id, []]);

               //get each user's selected date_options
               extra.push(knex.where({
                      usersId: id,
                      eventId: '1',
                   })
                   .select('*')
                   .from('usersDateOptions')
                   .innerJoin('date_options', 'usersDateOptions.dateOptionsId', 'date_options.id')
                   .then(function(result) {
                     // console.log("results", result);

                     for(let j in result){
                       console.log(result[j].dateOptionsId)
                       templateVars['users'][i][3].push(result[j].dateOptionsId);
                     }

                     console.log('user:',templateVars['users'][i])

                   }));

           }

           return Promise.all(extra)
         }),


  ]).then(function(result) {

    res.render("event", templateVars);

  })

});


    //helper function to put times in 12 hour clock and format
    //
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
  }

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
