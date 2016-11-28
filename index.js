var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));

app.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
       /* if (event.message && event.message.text) {
            sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
        }*/
        if (event.message && event.message.text) {
		    if (!kittenMessage(event.sender.id, event.message.text)) {
		        sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
		    }
		}
    }
    res.sendStatus(200);
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
    
    /*text = text || "";
    var values = text.split(' ');*/
    
   /* if (values.length === 3 && values[0] === 'kitten') {
        if (Number(values[1]) > 0 && Number(values[2]) > 0) {*/
    if(text!===''){
            if(text==='hi')
           // var imageUrl = "https://placekitten.com/" + Number(values[1]) + "/" + Number(values[2]);
            var imageUrl="http://2.bp.blogspot.com/-ncql7TfNVus/Vp4qop_hbII/AAAAAAAAGj4/JzCPNKPJKzw/s1600/coffee.jpg";
            message = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": "Hot Cofee",
                            "subtitle": "$5.00",
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
                        },
                        {
                            "title": "Espresso Italy",
                            "subtitle": "$3.00",
                            "image_url": imageUrl ,
                            "buttons": [{
                                "type": "web_url",
                                "url": "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQt01W7sk2ENLr-CFm3SAlD69zjeW5CxU8YbR6hc-vz4-uWiRh1EA",
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
    }
    
    return false;
    
};