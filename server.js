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

     };
 // const print = funtionction

  knex.count('*')
      .from('date_options')
      .then(function(result) {
        info = result;
        templateVars['columnCount'] = info[0].count;
        knex.select('*')
            .from('date_options')
            .then(function(result) {
                 console.log(result[0])
                 info = result;
                 let date = String(info[0].date)
                 templateVars['dayName'] = date.slice(0,2);
                 templateVars['dayNum'] = date.slice(8,9);
                 templateVars['month'] = date.slice(4,6);
                 res.render("event", templateVars);
               }).finally(function() {
                     // knex.destroy();
                   });

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
