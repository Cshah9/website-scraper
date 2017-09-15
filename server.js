/* Scrape and Display
 * (If you can do this, you should be set for your hw)
 * ================================================== */

// STUDENTS:
// Please complete the routes with TODOs inside.
// Your specific instructions lie there

// Good luck!

// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/websiteScraper");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


// Routes
// ======

// A GET request to scrape the  website
app.get("/scrape", function(req, res) {
  console.log ("app get /scrape STARTED...")

  request("http://lifehacker.com", function(error, response, html) {

    var $ = cheerio.load(html);

    $("article header h1").each(function(i, element) {
      var scraped = {};
      console.log("scraped.title = ", $(this).children("a").text());
      console.log("scraped.link = ", $(this).children("a").attr("href"));
      scraped.title = $(this).children("a").text();
      scraped.link = $(this).children("a").attr("href");
      var doc = new Article(scraped);

      doc.save(function(err, doc) {

        if (err) console.log(err);
        else console.log(doc);
      });
    });
  });

  res.send("app get /scrape FINISHED...");
  console.log ("app get /scrape FINISHED...")
});

// This will get the articles we scraped from the mongoDB
app.get("/articles", function(req, res) {

console.log ("app get /articles STARTED...")
    Article.find({})
    .populate("note")
    .exec( function(error, doc) {
       if (error) console.log(error);
       else res.json(doc);
       console.log ("app get /articles END...")
    });
});

// This will grab an article by it's ObjectId
app.get("/articles/:id", function(req, res) {

console.log ("app get /articles/:id STARTED...", req.params.id);
  Article.findOne({ "_id": req.params.id })
  .populate("note")
  .exec(function(error, doc) {
      if (error) console.log(error);
      else res.json(doc);
      console.log ("app get /articles/:id END...");
    

  });

});

// Create a new note or replace an existing note
app.post("/articles/:id", function(req, res) {
console.log ("app POST /articles/:id STARTED...", req.params.id , req.body)

var newNote = new Note(req.body);

  newNote.save(function(error, doc) {
    if (error) console.log(error);

    else {
      Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
      .exec(function(err, doc) {
        if (err) console.log(err);
  
        else {
          res.send(doc);
              console.log ("app POST /articles/:id END...")
   
        }
      });
    }
  });


});


// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
