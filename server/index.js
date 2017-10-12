'use strict'

import SendLogin from "./login"
import RetrievePNR from "./pnrretrieve"
import FlightAvailability from './flightavailability'

import express from "express"
import session from "express-session"
import bodyParser from "body-parser"

import {RetrievePNROK, RetrievePNRKO} from "./conversationrsp"
import {getChooseFlightConv} from "./slackconversation"

import {DEFAULT_WELCOME, 
RETRIEVE_PNR,
FLIGHT_AVAILABILITY} from './intents'

const restService = express()
restService.use(bodyParser.json())

restService.use(session({
    secret: "this_is_a_secret_token",
    resave: true,
    saveUninitialized: true
}))

function getIntentName(body) {
    var intentName = ''

    if (body) {
        if (body.result) {
            if (body.result.metadata) {
                intentName = body.result.metadata.intentName;
            }
        }
    }

    return intentName
}

restService.post("/hook", function (req, res) {
    console.log("hook request")
    console.log("req body: "+ JSON.stringify(req.body))
    console.log("req headers: "+ JSON.stringify(req.headers))

    try {
        const intentName = getIntentName(req.body)

        if (intentName === DEFAULT_WELCOME) {
            SendLogin(req.session, req.headers)
                .then( rsp => res.json(rsp))
                .catch(err => console.log(err))
        }
        else if (intentName === RETRIEVE_PNR) {
            SendLogin(req.session, req.headers)
            .then ( rsp => { 
                var pnr = req.body.result.parameters.pnr
                return RetrievePNR(req.session, pnr)
                .then( rsp => { 

                    // TODO: try to jump a line
                    var txt =  RetrievePNROK(rsp.surname, rsp.flight)
                    
                    return res.json({
                        speech: txt,
                        displayText: txt
                    }) 
                })
                .catch( err => { console.log(JSON.stringify(err)) 
                 
                  var txt = RetrievePNRKO(pnr) 
                  return res.json({
                         followupEvent: {
                            name: "RetrievePNR-Fallback",
                            data: {
                                 pnr: pnr  }
                    })     
                })
            })
            .catch( err => { throw new Error(JSON.stringify(err)) } )
        }
        else if(intentName === FLIGHT_AVAILABILITY){
            FlightAvailability(req.session)
            .then( rsp => { 
                return res.json({
                    data: { 
                        slack: getChooseFlightConv()
                    }
                }) 
            })
            .catch( err => { throw new Error(JSON.stringify(err)) } )
        }
    } catch (err) {
        console.error("Can't process request", err)

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        })
    }
})

restService.listen( process.env.PORT || 5000, function () {
    console.log("Server listening")
})
