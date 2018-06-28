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

  // for each date_options in event -need to find the  length
  //
  //    SELECT COUNT(*)
  //      FROM event
  //      JOIN date_options
  //      ON event.id = date_options.eventid
  //      WHERE event.id = (current...)
  //      {

  // We can use all standard SQL keywords such as joins and limit
// knex('movies')
//   .join('actors', 'actors.movie_id', '=', 'movies.id')
//   .select('actors.name as star', 'movies.name as movie', 'movies.year as year')
//   .limit(10)
//   .then(rows => console.log(rows))
//   .catch(err => console.log(err.message))


 let info = [];
 let templateVars = {
       uniqueUrl: req.params.id,
       // longURL: Document.URL
       dayNum: [],
       dayName: [],
       month: [],
       year: [],

     };
 // const print = funtionction

  knex.where({
      eventId: 1,
      })
      .count('*')
      .from('date_options')
      .then(function(result) {

        templateVars['columnCount'] = result[0].count;

        knex.where({
              eventId: 1,
            })
            .select('*')
            .from('date_options')
            .then(function(result) {
                 for(let i in result){
                   let date = String(result[i].date)
                   templateVars['dayName'].push(date.slice(0,3));
                   templateVars['dayNum'].push(date.slice(8,10));
                   templateVars['month'].push(date.slice(4,7));
                   templateVars['year'].push(date.slice(11,15));
                 }
                 //let eventId = result[0].

                 knex.where({
                        eventId: 1,
                     })
                     .select('*')
                     .from('users')
                     .then(function(result) {
                       console.log(result)



                     })

                     res.render("event", templateVars);
                   });


               // }).finally(function() {
               //       //knex.destroy();
               //     });

      }).finally(function() {

          knex.destroy();

        })




  // let templateVars = {
  //       uniqueUrl: req.params.id,
  //       // longURL: Document.URL
  //       columnCount: columnCount,
  //
  //     };
  // res.render("event", templateVars);
    });

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
