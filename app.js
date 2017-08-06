const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

const port = process.env.PORT || 8000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Routes to go here...
const users = require('./routes/users');
const receipts = require('./routes/receipts');
const items = require('./routes/items');
const tags = require('./routes/tags');
const locations = require('./routes/locations');

app.use(cors());
app.use(users);
app.use(receipts);
app.use(items);
app.use(tags);
app.use(locations);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development'
    ? err
    : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});

module.exports = app;
