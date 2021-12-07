const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

app.use(cookieParser())

const app = express();

app.set('view engine', 'ejs');

app.use("/", express.static(__dirname + '/public'));

app.listen(process.env.PORT || 8080, function(srv) {
  console.log('Application up at ' + srv.port);
})