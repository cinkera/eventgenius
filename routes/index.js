var express = require('express');
var router = express.Router();

// Load the SDK for JavaScript
var AWS = require('aws-sdk');
// Set the Region 
AWS.config.update({region: 'us-east-1'});

var monk = require('monk');
var db = monk('mongodb://127.0.0.1:27017/eventgenius', { useUnifiedTopology: true });
const sesClient = require('../ses-client');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('landing_page', { title: 'Event Genius Landing Page' });
});

/* GET about page. */
router.get('/about_page', function(req, res, next) {
  res.render('about_page', { title: 'About Event Genius' });
});

/* GET thank you page. */
router.get('/thank_you', function(req, res, next) {  
  var fName = req.body.fname;
  var lname = req.body.lname;
  var email = req.body.email;
  res.render('thank_you', { title: 'Thank you!' });
});


/* POST signup information, route to thank you page. */
router.post('/signup', function(req, res, next) {
  var Ucollection = db.get('testusercollection');
  console.log("Signup info: " + JSON.stringify(req.body));
  var fName = req.body.fname;
  var lName = req.body.lname;
  var userEmail = req.body.email;
  console.log("... fname: " + fName + " lname: " + lName + " email: " + userEmail);

  //current date object 
  var now = new Date();
  now.setHours(0,0,0,0);
  dateCreated = now;
  console.log("... date created: "+ dateCreated);

  //if Name is already in database, error
  Ucollection.find({useremail: {$eq:userEmail}}, (err, docs) => { 
      // if docs = "", name exists in DB already. Don't create account
      if(docs != "") {
              console.log("this name DOES exist in the db");

              // --------------------------------- CREATE ERROR PAGE TO SEND
              var nameinDBerror = "This email is already on our mailing list!";
              res.send("This email is already on our mailing list!");
      }
      else {
          console.log("this name does not exist in the db");
          // Submit to the DB
          Ucollection.insert({
              "firstName" : fName,
              "lastName" : lName,
              "useremail" : userEmail, 
          }, function (err, doc) {
              if (err) {
                  // If it failed, return error
                  res.send("There was a problem adding the information to the database.");
              }
              else {
                  // And forward to success page and send thank you email
                  sesClient.sendEmail(userEmail, "Thank you for signing up with Event Genius!", "We will send you development updates, and keep you in the loop for when Event Genius will be ready! \nFeel free to send your user input on what you would like to see to eventgeniusnotifier@gmail.com with the subject User Input.");
                  res.render("thank_you", {fname: fName, lname: lName, email: userEmail});
              }
          });
      }
  });
});

module.exports = router;