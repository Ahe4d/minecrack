const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser())
app.set('view engine', 'ejs');

app.use("/", express.static(__dirname + '/public'));

let listener = app.listen(process.env.PORT || 8080, function(srv) {
  console.log('Application up at port ' + listener.address().port);
})