'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const Mailgun = require('mailgun-js');
const api_key = 'key-8789dfb81398bd6ed643a84e6c9d18c5';
const domain = 'sandboxc8c602f23709483ea76ef2b0053cc13b.mailgun.org';
const from_who = 'marianabenedett@gmail.com';
const restService = express();
restService.use(bodyParser.json());

var uscup = Array();
var ukcup = Array();

uscup[0] = "AA";
uscup[1] = "A";
uscup[2] = "B";
uscup[3] = "C";
uscup[4] = "D";
uscup[5] = "DD(E)";
uscup[6] = "DDD(F)";
uscup[7] = "G";
uscup[8] = "H";
uscup[9] = "I";
uscup[10] = "J";
uscup[11] = "K";
uscup[12] = "L";
uscup[13] = "M";
uscup[14] = "N";
uscup[15] = "O";
uscup[16] = "P";
uscup[17] = "Q";
uscup[18] = "R";
uscup[19] = "S";
uscup[20] = "T";

ukcup[0] = "AA";
ukcup[1] = "A";
ukcup[2] = "B";
ukcup[3] = "C";
ukcup[4] = "D";
ukcup[5] = "DD";
ukcup[6] = "E";
ukcup[7] = "F";
ukcup[8] = "FF";
ukcup[9] = "G";
ukcup[10] = "GG";
ukcup[11] = "H";
ukcup[12] = "HH";
ukcup[13] = "J";
ukcup[14] = "JJ";
ukcup[15] = "K"; 
ukcup[16] = "KK";
ukcup[17] = "L";
ukcup[18] = "LL";
ukcup[19] = "M";
ukcup[20] = "MM";

const calculate = function(leaningbust, lyingbust, snugbust, standbust, tightbust) {
    var response = '';

    // VALIDATE
    //empty field errors: 
    if (snugbust == 0 || tightbust == 0 || standbust == 0 || leaningbust == 0 || lyingbust == 0)
    {
        response += "You must enter your measurements, as numbers, for all fields.";
    }
    
    // errors quando user enters 
    if ((snugbust - tightbust) < 1 && snugbust <= 32)
    {
        response += "Your measurements indicate that you may be more comfortable Sister Sizing Up. Try going up a band size and down a cup size.";
    }

    var band = 2 * Math.round(snugbust / 2);
    var adjBust = leaningbust;
    
    if ((band - tightbust) < 2)
    {
        response += "You might need to Sister Size Up because your calculated band may be too tight! Try going up a band size and down a cup size.";
    }
    // END VALIDATE

    //bust calculation
    if ((standbust - snugbust) <= 7 && ((leaningbust - standbust) > 3 || (leaningbust - lyingbust) > 3))
    {
        adjBust = (Number(standbust) + Number(leaningbust) + Number(lyingbust)) / 3;
    }
    
    else if ((leaningbust - standbust) > 2)
    {
        adjBust = (Number(standbust) + Number(leaningbust)) / 2;
    }

    //cup calculation

    var cupNumber1 = Math.floor(adjBust - snugbust);
    var cupNumber2 = Math.ceil(adjBust - snugbust);
    var adjusCup1;
    var adjusCup2;
    var adjukCup1;
    var adjukCup2;
    
    var usCup1 = uscup[cupNumber1];
    var usCup2 = uscup[cupNumber2];
    var ukCup1 = ukcup[cupNumber1];
    var ukCup2 = ukcup[cupNumber2];

    if ((cupNumber1 >= 9) || (cupNumber2 >= 9) && (tightbust > 32)) 
    {
        response += "Important: Based on the measurements you entered, your bra estimation may not be as accurate. A variety of factors play into finding the perfect bra, this is only a starting point!";
    }
    var adjBand;


    // final bra size calculation
    if ((snugbust - tightbust) > 2.5)
    {
        adjBand = band - 2;
        adjusCup1 = uscup[cupNumber1 + 1];
        adjusCup2 = uscup[cupNumber2 + 1];
        adjukCup1 = ukcup[cupNumber1 + 1];
        adjukCup2 = ukcup[cupNumber2 + 1];
        response += "Your band has been Sister Sized Down for added support";
    }

    else
    {
        adjBand = band;
        adjusCup1 = usCup1;
        adjusCup2 = usCup2;
        adjukCup1 = ukCup1;
        adjukCup2 = ukCup2;
    }

    if (cupNumber1 != cupNumber2)
    {
        // usBraSize = document.getElementById("usBra").innerHTML = adjBand + adjusCup1 + "/" + adjusCup2;
        ukBraSize = adjBand + adjukCup1 + "/" + adjukCup2;
        response += "The difference between your underbust and bust is not a whole number, so either of these two cup sizes may work.";
    }

    else
    {
        // usBraSize = document.getElementById("usBra").innerHTML = adjBand + adjusCup1;
        ukBraSize = adjBand + adjukCup1;
    }

    response += "<br/>Estimated Bra Size: " + ukBraSize;

    //sister size calculation
    var bandUp = (adjBand + 2);
    var bandDown = (adjBand - 2);
    
    if ((snugbust - tightbust) > 2.5)
    {
        var usCup1Up = uscup[cupNumber1 + 2];
        var usCup2Up = uscup[cupNumber2 + 2];
        var usCup1Down = uscup[cupNumber1];
        var usCup2Down = uscup[cupNumber2];
        var ukCup1Up = ukcup[cupNumber1 + 2];
        var ukCup2Up = ukcup[cupNumber2 + 2];
        var ukCup1Down = ukcup[cupNumber1];
        var ukCup2Down = ukcup[cupNumber2];
    }
    
    else
    {
        var usCup1Up = uscup[cupNumber1 + 1];
        var usCup2Up = uscup[cupNumber2 + 1];
        var usCup1Down = uscup[cupNumber1 - 1];
        var usCup2Down = uscup[cupNumber2 - 1];
        var ukCup1Up = ukcup[cupNumber1 + 1];
        var ukCup2Up = ukcup[cupNumber2 + 1];
        var ukCup1Down = ukcup[cupNumber1 - 1];
        var ukCup2Down = ukcup[cupNumber2 - 1];
    }
    
    if (cupNumber1 != cupNumber2)
    {
        // usSisterUp = document.getElementById("usBraUp").innerHTML = bandUp + usCup1Down + "/" + usCup2Down;
        // usSisterDown = document.getElementById("usBraDown").innerHTML = bandDown + usCup1Up + "/" + usCup2Up;
        ukSisterUp = bandUp + ukCup1Down + "/" + ukCup2Down;
        ukSisterDown = bandDown + ukCup1Up + "/" + ukCup2Up;
    }
    
    else
    {
        // usSisterUp = document.getElementById("usBraUp").innerHTML = bandUp + usCup1Down;
        // usSisterDown = document.getElementById("usBraDown").innerHTML = bandDown + usCup1Up;
        ukSisterUp = bandUp + ukCup1Down;
        ukSisterDown = bandDown + ukCup1Up;
    }

    response += "<br /> Nearest Sister Sizes: " + ukSisterUp + "      " + ukSisterDown; 


    return response;
}

restService.post('/hook', function (req, res) {

    console.log('hook request');

    try {
        var speech = 'empty speech';

        if (req.body) {
            var requestBody = req.body;

            if (requestBody.result) {
                speech = '';

                const parameters = req.body.result.parameters;
                const email = parameters.email;
                const leaningbust = parameters.leaningbust;
                const lyingbust = parameters.lyingbust;
                const snugbust = parameters.snugbust;
                const standbust = parameters.standbust;
                const tightbust = parameters.tightbust;

                var mailgun = new Mailgun({apiKey: api_key, domain: domain});
                var result = calculate(leaningbust, lyingbust, snugbust, standbust, tightbust);

                var data = {
                //Specify email data
                  from: from_who,
                //The email to contact
                  to: 'marianabenedett@gmail.com',
                //Subject and text data  
                  subject: 'Bratuner - New request',
                  html: 'Hello, This is a new request: ' + 
                        '<ul><li>Email: ' + email + '</li>' +
                        '<li>Leaning bust: ' + leaningbust + '</li>' +
                        '<li>lyingbust bust: ' + lyingbust + '</li>' +
                        '<li>snugbust bust: ' + snugbust + '</li>' +
                        '<li>standbust bust: ' + standbust + '</li>' +
                        '<li>tightbust bust: ' + tightbust + '</li></ul>' + 

                        'Calculator result: ' + result
                }

                //Invokes the method to send emails given the above data with the helper library
                mailgun.messages().send(data, function (err, body) {
                    //If there is an error, render the error page
                    if (err) {
                        //res.render('error', { error : err});
                        console.log("got an error: ", err);
                    }
                    //Else we can greet    and leave
                    else {
                        //Here "submitted.jade" is the view file for this landing page 
                        //We pass the variable "email" from the url parameter in an object rendered by Jade
                        //res.render('submitted', { email : req.params.mail });
                        console.log(body);
                    }
                });

                if (requestBody.result.fulfillment) {
                    speech += requestBody.result.fulfillment.speech;
                    speech += ' ';
                }
            }
        }

        console.log('result: ', speech);

        return res.json({
            speech: speech,
            displayText: speech,
            source: 'apiai-webhook-sample'
        });
    } catch (err) {
        console.error("Can't process request", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
});

restService.listen((process.env.PORT || 5000), function () {
    console.log("Server listening");
});