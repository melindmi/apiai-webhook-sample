
'use strict'

import SendLogin from "./login"
import RetrievePNR from "./pnrretrieve"

import express from "express"
import session from "express-session"
import bodyParser from "body-parser"

const DEFAULT_WELCOME = 'Default Welcome Intent'
const RETRIEVE_PNR = 'Retrieve PNR'

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
        var requestBody = body
        if (requestBody.result) {
            if (requestBody.result.metadata) {
                intentName = requestBody.result.metadata.intentName;
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
            SendLogin(req, req.headers)
                .then( rsp => res.json(rsp))
                .catch(err => console.log(err))
        }
        else if (intentName === RETRIEVE_PNR) {
            SendLogin(req, req.headers)
               .then( rsp => RetrievePNR(req)
                            .then(  pxname => {
                                     var ret = res.json({
                                     name: pxname,
                                     source: 'apiai-webhook-sample' })
                                     console.log("Response:   " + JSON.stringify(ret))
                                     return ret
                                 })
                            .catch( err => { throw new Error(JSON.stringify(err)) } )
                })
               .catch(err => console.log(err))
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
