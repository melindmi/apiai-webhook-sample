import axios from "axios"

import { srv } from "./config"
import { isInactiveConversation } from "./utilepars"
import session from "express-session"

import SendLogin from "./login"

function RetrievePNR(req) {
  
  var sessionDetails = req.session.sessionDetails
  var auth = req.session.auth

  console.log("++++++++RetrievePNR session details++++++++++++++")
  console.log(sessionDetails)
  console.log("++++++++++++++++++++++++++++++++++")   
  
  var seq = parseInt(sessionDetails.seq, 10) + 1

  return axios
  .get(`${srv}/pnrretrieve`, {
    params:{
      sessionId : sessionDetails.sessionId,
      seqId: seq,
      token: sessionDetails.token,
      retType: "2",
      ctrlNb: "RFYD8G"
    }
  })
  .then( res => { 
    if(res.data){ 
      console.log("---------------- res data -----------------") 
      console.log(JSON.stringify(res.data))
    }
    else {
      console.log("---------------- res -----------------") 
      console.log(JSON.stringify(res))
    }   
    return  res.data })
  
  .catch( error => { 
    console.log("---------------- error -----------------") 
    console.log(JSON.stringify(error.response.data)) 
    
    if (isInactiveConversation(error.response.data)) {
      console.log("---------------- error +++++++++ call login again") 
      
      return SendLogin(req, auth)
      .then( rsp => RetrievePNR(req) )
      .catch( err => { throw new Error(JSON.stringify(err)) } )
    }
    else{
      console.log("---------------- error +++++++++ no inactive")
      return error.response.data
    }
  })
}

export default RetrievePNR
