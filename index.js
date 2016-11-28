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
    if(text!==''){
            if(text=='hi')
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
                                "url": "data:image/jpeg;base64,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",
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