var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));
var mongodb = require("mongodb");

var db;
// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");
		app.post('/webhook', function (req, res) {
		    var events = req.body.entry[0].messaging;
		    for (i = 0; i < events.length; i++) {
		        var event = events[i];
		        if (event.message && event.message.text) {
                     
        		    if (!kittenMessage(event.sender.id, event.message.text)) {
        		    	
        		        sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
        		    }

        		}
		    }
		    res.sendStatus(200);
		});

});
// Server frontpage
app.get('/', function (req, res) {
    res.send('This is TestBot Server');
});

// Facebook Webhook
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'testbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
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
    
    // text = text || "";
    // var values = text.split(' ');
    
  /*  if (values.length === 3 && values[0] === 'kitten') {
        if (Number(values[1]) > 0 && Number(values[2]) > 0) {*/
        if(text){
            if(text==='hi' || text==='hello' || text=='Hi' || text==='Hello'){
            //var imageUrl = "https://placekitten.com/" + Number(values[1]) + "/" + Number(values[2]);
                var imageUrl="https://www.sefa.nl/wp-content/uploads/2016/04/koffieee.jpg";
               
        		    message = {
                        "attachment": {
                            "type": "template",
                            "payload": {
                                "template_type": "generic",
                                "elements": [{
                                    "title": "Hot Coffe",
                                    "subtitle": "$5.00",
                                    "image_url": imageUrl ,
                                    "buttons": [{
                                        "type": "web_url",
                                        "url": imageUrl,
                                        "title": "Show "
                                        }, {
                                        "type": "postback",
                                        "title": doc.title,
                                        "payload": "User " + recipientId + " likes kitten " + imageUrl,
                                    }]
                                },
                                {
                                    "title": "Milk Coffee Frape",
                                    "subtitle": "$3.50",
                                    "image_url": "https://www.baristaproshop.com/blog/images/Frappe%20Cups.jpg" ,
                                    "buttons": [{
                                        "type": "web_url",
                                        "url": imageUrl,
                                        "title": "Show "
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
        }
    
    return false;
    
};