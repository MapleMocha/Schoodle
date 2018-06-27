"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/event/create", (req, res) => {
    response.end('hello');
  });

  return router;
}
