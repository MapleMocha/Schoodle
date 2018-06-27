"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/events/:id", (req, res) => {
    knex
      .select("*")
      .from("event")
      .then((results) => {
        res.json(results);
    });
  });

  return router;
}
