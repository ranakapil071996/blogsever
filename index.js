const express = require('express');
const body_parser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const { mongoUri } = require('./config');
const passport = require('passport');

const app = express();
const port = process.env.PORT || 5011;
app.use(body_parser.json({ limit: "50mb"}));
require("./config/passport")(passport)
app.use(passport.initialize())
app.use(cors())

mongoose.connect(mongoUri, { useCreateIndex: true,useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false}, () => console.log("Mongoo initialize"))
mongoose.connection.on('connected', () => console.log("Mongoose authroized"));
mongoose.connection.on('error', (err) => console.log("Mongoose err "+ err));

app.use('/blogs', require('./api/Blog'));
app.use('/image', require('./api/image'));
app.use('/utils', require('./api/utilApis'));
app.use('/user', require('./api/Users'));

app.listen(port, () => console.log("Server is up on "+ port))
