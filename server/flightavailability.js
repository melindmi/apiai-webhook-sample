import axios from "axios"

import { isInactiveConversation } from "./utilepars"
import session from "express-session"

import SendLogin from "./login"


function FlightAvailability(session) {
  var sessionDetails = session.sessionDetails
  var auth = session.auth
  var pnrDetails = session.pnrDetails

  console.log("++++++++FlightAvailability session details++++++++++++++")
  console.log(sessionDetails)
  console.log("++++++++++++++++++++++++++++++++++")   
  console.log("PNRDetails is: " + JSON.stringify(pnrDetails))

  var seq = parseInt(sessionDetails.seq, 10) + 1

  return axios
  .get(`${auth.srv}/pnrretrieve`, {
    params:{
      sessionId : sessionDetails.sessionId,
      seqId: seq,
      token: sessionDetails.token,
      depDate: pnrDetails.depDate,
      mktComp: pnrDetails.airline,
      boardPoint: pnrDetails.depCity,
      offPoint: pnrDetails.arrCity,
      type: "AN"
    }
  })

  .then( res => { 
    if (res.data) {  
      console.log("---------------- res data -----------------") 
      console.log(JSON.stringify(res.data))
    }
    else {
      console.log("---------------- res -----------------") 
      console.log(JSON.stringify(res))
    }   
     
    return res.data 
  })
  
  .catch( error => { 
    console.log("---------------- error -----------------") 
    console.log(JSON.stringify(error.response.data)) 
    
    if (isInactiveConversation(error.response.data)) {
      console.log("---------------- error +++++++++ call login again") 
      
      return SendLogin(session, auth)
      .then( rsp => FlightAvailability(session) )
      .catch( err => { throw new Error(JSON.stringify(err)) } )
    }
    else{
      console.log("---------------- error +++++++++ no inactive")
      throw new Error("PNR not found!") 
    }
  })
}

export default FlightAvailability

