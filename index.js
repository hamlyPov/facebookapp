var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();
var mongodb = require("mongodb");
var db;
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));

// Server frontpage
app.get('/', function (req, res) {
    res.send('This is TestBot Server');
});

mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
      if (err) {
        console.log(err);
        process.exit(1);
      }
      // Save database object from the callback for reuse.
      db = database;
    console.log("Database connection ready");

    // Facebook Webhook
    app.get('/webhook', function (req, res) {
        if (req.query['hub.verify_token'] === 'testbot_verify_token') {
            res.send(req.query['hub.challenge']);
        } else {
            res.send('Invalid verify token');
        }
    });
});

// handler receiving messages
app.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
            if (!kittenMessage(event.sender.id, event.message.text)) {
                sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
            }
        } else if (event.postback) {
            console.log("Postback received: " + JSON.stringify(event.postback));
        }
    }
    res.sendStatus(200);
});

// generic function sending messages
function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

// send rich message with kitten
function kittenMessage(recipientId, text) {
    
    
    if (text) {
       
            db.collection(items).findOne({title:'hamly'},function(err, docs) {
                if (err) {
                      handleError(res, err.message, "Failed to get contacts.");
                } else {
                    var imageUrl="https://www.sefa.nl/wp-content/uploads/2016/04/koffieee.jpg";
                    message = {
                        "attachment": {
                            "type": "template",
                            "payload": {
                                "template_type": "generic",
                                "elements": [{
                                    "title": "Kitten",
                                    "subtitle": "Cute kitten picture",
                                    "image_url": imageUrl ,
                                    "buttons": [{
                                        "type": "web_url",
                                        "url": imageUrl,
                                        "title": "Show kitten"
                                        }, {
                                        "type": "postback",
                                        "title": "I like this",
                                        "payload": "User " + recipientId + " likes kitten " + imageUrl,
                                    }]
                                }]
                            }
                        }
                    };
                    sendMessage(recipientId, message);
            
                     return true;
                }
            });
            //var imageUrl = "https://placekitten.com/" + Number(values[1]) + "/" + Number(values[2]);
            
    
            /*sendMessage(recipientId, message);
            
            return true;
        */
    }
    
    return false;
    
};