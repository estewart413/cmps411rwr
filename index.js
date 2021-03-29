var express = require("express");
var bodyParser = require("body-parser");
//var Request = require("request");
var app = express();
app.use(bodyParser.json());
var db;

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://cmps415:cmps415@cluster0.iwnjg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }, { connectTimeoutMS: 30000 }, { keepAlive: 1});
client.connect(err => {
  const collection = client.db("myFirstDatabase").collection("cmps415");
  console.log("Connected to DB");
  
  db = client.db();
});

var server = app.listen(process.env.PORT || 8080, function () {
	var port = server.address().port;
	console.log("App now running on port", port);
});

app.get('/', (req, res) => res.send('Quiz App. Connect to an endpoint. (Postman.)'));

app.get("/quizzes/", function(req, res) {
    db.collection("cmps415").find({}).toArray(function(err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to get quizzes.");
        } else {
            res.status(200).json(docs);
        }
    });
});

app.get('/quiz/:id', function(req,res) {
  var ObjectId = require('mongodb').ObjectID;
  let id = req.params.id;
  db.collection("cmps415").find({"_id": new ObjectId(id)}).toArray(function(err, docs) {
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
      if (docs[0].question.type == "true/false"){
        if (body.answer == docs[0].question.correctanswer){
          res.status(200).send("You answered correctly!");
        }
        else {
          res.status(200).send("You did not answer correctly.");
        }
      }
      if (docs[0].question.type == "multiplechoicesingle"){
        if (body.answer == docs[0].question.correctanswer){
          res.status(200).send("You answered correctly!");
        }
        else {
          res.status(200).send("You did not answer correctly.");
        }
      }
      if (docs[0].question.type == "multiplechoicemany"){
        if (body.answer == docs[0].question.correctanswer){
          res.status(200).send("You answered correctly!");
        }
        else {
          res.status(200).send("You did not answer correctly.");
        }
      }
      if (docs[0].question.type == "shortanswer"){
        if (body.answer == docs[0].question.correctanswer){
          res.status(200).send("You answered correctly!");
        }
        else {
          res.status(200).send("You did not answer correctly.");
        }
      }
    }
});
});
// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
}
