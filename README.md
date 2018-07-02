# Schoodle

Schoodle is a web application which allows the users to decide on which date to hold a particular event by using a voting system.

Developped by Emma Skillings, Eliza Moore and Nicholas Lepage 

## Screenshots

![alt text](https://github.com/NicholasLepage/Schoodle/blob/master/public/resources/LandingPageLoggedIn.png)
![alt text](https://github.com/NicholasLepage/Schoodle/blob/master/public/resources/CreateEvent.png)
![alt text](https://github.com/NicholasLepage/Schoodle/blob/master/public/resources/newUserVote.png)

## Getting Started

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Run migrations: `npm run knex migrate:latest`
  - Check the migrations folder to see what gets created in the DB
7. Run the server: `npm run local`
8. Visit `http://localhost:8080/`

## Dependencies

- Node 5.10.x or above
- NPM 3.8.x or above
- body-parser 1.15.2 or above
- dotenv 2.0.0 or above
- ejs 2.4.1 or above
- express 4.13.4 or above
- knex 0.11.7 or above
- knex-logger 0.1.0 or above
- morgan 1.7.0 or above
- node-sass-middleware 0.9.8 or above
- pg 6.0.2 or above
