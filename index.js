'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const Mailgun = require('mailgun-js');
const api_key = 'key-8789dfb81398bd6ed643a84e6c9d18c5';
const domain = 'sandboxc8c602f23709483ea76ef2b0053cc13b.mailgun.org';
const from_who = 'marianabenedett@gmail.com';
const restService = express();
restService.use(bodyParser.json());

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

                var data = {
                //Specify email data
                  from: from_who,
                //The email to contact
                  to: 'marianabenedett@gmail.com',
                //Subject and text data  
                  subject: 'Bratuner - New request',
                  html: 'Hello, This is a new request: ' + 
                        '<ul><li>Email: ' + email + '</li>' +
                        '<li>Leaning bust: ' + leaningbust + '</li></ul>'
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

                if (requestBody.result.action) {
                    speech += 'action: ' + requestBody.result.action;
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

//exports.helloHttp = function helloHttp (req, res) {
  // const transporter = nodemailer.createTransport(smtpTransport({
  //   service: 'gmail',
  //   auth: {
  //     user: 'magnomathias21@gmail.com',
  //     pass: 'churuPITA'
  //   },
  //   debug: true
  // }))

  // const parameters = req.body.result.parameters;
  // const email = parameters.email;
  // const leaningbust = parameters.leaningbust;
  // const lyingbust = parameters.lyingbust;
  // const snugbust = parameters.snugbust;
  // const standbust = parameters.standbust;
  // const tightbust = parameters.tightbust;
  // setup email data with unicode symbols
  // const mailOptions = {
  //   to: 'Mariana Benedett <marianabenedett@gmail.com>', // list of receivers
  //   subject: 'confirmation email', // Subject line
  //   html: 'hello, please your email' // html text body
  // }
// let transporter = nodemailer.createTransport({
//     sendmail: true,
//     newline: 'unix',
//     path: '/usr/sbin/sendmail'
// });
// transporter.sendMail({
//     from: 'magnomathias21@gmail.com',
//     to: 'marianabenedett@gmail.com',
//     subject: 'Message',
//     text: 'I hope this message gets delivered!'
// }, (err, info) => {
//     console.log(info.envelope);
//     console.log(info.messageId);
// });

  // send mail with defined transport object
  // transporter.sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     return console.log(error)
  //   }
  //   console.log('Message %s sent: %s', info.messageId, info.response)
  // })

  //We pass the api_key and domain to the wrapper, or it won't be able to identify + send emails
    // var mailgun = new Mailgun({apiKey: api_key, domain: domain});

    // var data = {
    // //Specify email data
    //   from: from_who,
    // //The email to contact
    //   to: 'magnomathias21@gmail.com',
    // //Subject and text data  
    //   subject: 'Hello from Mailgun',
    //   html: 'Hello, This is not a plain-text email, I wanted to test some spicy Mailgun sauce in NodeJS! <a href="http://0.0.0.0:3030/validate?' + req.params.mail + '">Click here to add your email address to a mailing list</a>'
    // }

    // //Invokes the method to send emails given the above data with the helper library
    // mailgun.messages().send(data, function (err, body) {
    //     //If there is an error, render the error page
    //     if (err) {
    //         res.render('error', { error : err});
    //         console.log("got an error: ", err);
    //     }
    //     //Else we can greet    and leave
    //     else {
    //         //Here "submitted.jade" is the view file for this landing page 
    //         //We pass the variable "email" from the url parameter in an object rendered by Jade
    //         res.render('submitted', { email : req.params.mail });
    //         console.log(body);
    //     }
    // });


//   response = "Fantastic! thanks for contacting us. We will get back to you on " + email + " shortly with a list of bras that are ideal for you."; //Default response from the webhook to show it's working

//   res.setHeader('Content-Type', 'application/json'); //Requires application/json MIME type
//   res.send(JSON.stringify({ "speech": response, "displayText": response 
//   //"speech" is the spoken version of the response, "displayText" is the visual version
//   }));
// };

