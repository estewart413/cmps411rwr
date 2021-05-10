var express = require("express");
var bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config({ path: "./.env" });
var app = express();
app.use(bodyParser.json());

//Had issues using the default MongoDB driver, so used mongoose
const mongoose = require("mongoose");
const uri = process.env.MONGODB_URI;
mongoose.connect(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  { connectTimeoutMS: 30000 },
  { keepAlive: 1 }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("MongoDB database connection successful");
});
var server = app.listen(process.env.PORT || 8080, () => {
  var port = server.address().port;
  console.log("App now running on port", port);
});
//Map built angular projecto all paths
app.use(express.static(__dirname + "/dist/angular-app"));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname));
});

app.get("/quizzes/", function (req, res) {
  db.collection("cmps415")
    .find()
    .toArray((err, docs) => {
      if (err) {
        handleError(
          res,
          err.message,
          "Failed to get quizzes.",
          console.log(res)
        );
      } else {
        if (res.statusCode === 200) {
          docs.forEach((element) => {
            var parsedId = "" + element._id;
            element._id = parsedId;
          });
          res.json(docs);
        }
      }
    });
});

app.get("/quiz/:id", (req, res) => {
  var ObjectId = require("mongodb").ObjectID;
  let id = req.params.id;
  db.collection("cmps415")
    .find({ _id: new ObjectId(id) })
    .toArray((err, docs) => {
      if (err) {
        handleError(res, err.message, "Failed to get quiz.");
      } else {
        if (res.status(200)) {
          //Take string of type ObjectId(*string*) and change to *string*
          var parsedId = "" + docs._id;
          docs[0]._id = parsedId;
          res.json(docs[0]);
        }
      }
    });
});
app.post("/new/", (req, res) => {
  var ObjectId = require("mongodb").ObjectID;
  let body = req.body;
  body._id = new ObjectId();
  db.collection("cmps415").insertOne(body, (err, doc) => {
    if (err) {
      handleError(res, err.message, "Failed to create new quiz.");
    } else {
      res.status(201).send(JSON.stringify(body));
    }
  });
});
app.post("/quiz/:id", (req, res) => {
  var ObjectId = require("mongodb").ObjectID;
  let id = req.params.id;
  let body = req.body;
  let key = [];

  db.collection("cmps415")
    .find({ _id: new ObjectId(id) })
    .toArray((err, docs) => {
      if (err) {
        handleError(res, err.message, "Failed to get quiz.");
      } else {
        //Need to iterate each question and each answer in pairs.
        //ForEach would iterate all answers for each question, so used counter instead
        let count = 1;
        docs[0].questions.forEach((question) => {      
          answer = body[count-1].answer;
          if (answer === undefined) {
          } else if (
            answer === question.correctanswer &&
            question.type !== "multiplechoicemultiple"
          ) {
            key.push({ count: `Question ${count} answered correctly` });
            count++;
          } 
            //if Multiple Choice - Multiple Answer, submitted answers could be in different order from stored correct answer
            //This checks to make sure each value in answer matches each value in the correct answer
            else if (question.type === "multiplechoicemultiple") {
            var attempt = answer.split(",");
            var correct = question.correctanswer.split(",");
            if (
              attempt.length === correct.length &&
              correct.every((value) => attempt.includes(value))
            ) {
              key.push({ count: `Question ${count} answered correctly!` });
              count++;
            } else {
              key.push({
                count: `Question ${count} answered incorrectly.  The correct answer is ${question.correctanswer}.`,
              });
              count++;
            }
          } else {
            key.push({
              count: `Question ${count} answered incorrectly.  The correct answer is ${question.correctanswer}.`,
            });
            count++;
          }
        });

        res.status(200).send(key);
      }
    });
});
// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({ error: message });
}
