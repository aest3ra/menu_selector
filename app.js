const express = require('express');
const config = require('./config/config');
const routes = require('./routes');
const app = express();
const conn = require('./config/db.js')
const fs = require('fs');
const path = require("path");

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); 
app.use(express.urlencoded({ extended: true }))
app.use('/', routes);

app.listen(config.PORT, () => {
    var dir = './upload';
  	if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    console.log(`Listening on port ${config.PORT}`);
});
