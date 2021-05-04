var express = require("express");
var bodyParser = require("body-parser");
require('dotenv').config({path:'./.env'})
//var Request = require("request");
var app = express();
app.use(bodyParser.json());

const mongoose = require('mongoose')
const uri = process.env.URI;
console.log(uri);
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, { connectTimeoutMS: 30000 }, { keepAlive: 1});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log("MongoDB database connection successful");
});
var server = app.listen(process.env.PORT || 8080, () => {
	var port = server.address().port;
	console.log("App now running on port", port);
});

app.get('/', (req, res) => {
  res.send('Quiz App. Connect to an endpoint.');
  console.log(db.name)
});

app.get("/quizzes/", function(req, res) {
    db.collection("cmps415").find().toArray((err, docs) => {
        if (err) {
            handleError(res, err.message, "Failed to get quizzes.", console.log(res));
        } else {
            res.status(200).json(docs);
        }
    });
});

app.get('/quiz/:id', (req,res) => {
  var ObjectId = require('mongodb').ObjectID;
  let id = req.params.id;
  db.collection("cmps415").find({"_id": new ObjectId(id)}).toArray((err, docs) => {
  if (err) {
    handleError(res, err.message, "Failed to get quiz.");
  } else {
    res.status(200).json(docs);
  }
});
})
app.post("/new/", function(req, res) {
    let body = (req.body);
	console.log(body);
	db.collection("cmps415").insertOne(body, function(err, doc) {
		if (err) {
			handleError(res, err.message, "Failed to create new quiz.");
		} else {
			res.status(201).send(JSON.stringify(body));
		}
	});
  }
);
app.post('/quiz/:id', function(req,res) {
  var ObjectId = require('mongodb').ObjectID;
  let id = req.params.id;
  let body = (req.body);
  db.collection("cmps415").find({"_id": new ObjectId(id)}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get quiz.");
    } else {
      if (body.answer == docs[0].question.correctanswer){
        res.status(200).send("You answered correctly!");
      }
      else {
        res.status(200).send("You did not answer correctly.");
      }
    }
});
});
// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
}
