import axios from "axios"

import { isInactiveConversation } from "./utilepars"
import session from "express-session"

import SendLogin from "./login"

function getPNRDetails(data) {
  var pnrDetails ={}

  if(data.Envelope){
    if(data.Envelope.Body){
      if(data.Envelope.Body.PNR_Reply){
        var r = data.Envelope.Body.PNR_Reply
        //traveller info
        if(r.travellerInfo){
          if(r.travellerInfo.passengerData){
            var p = r.travellerInfo.passengerData
            pnrDetails.surname = p.travellerInformation.traveller.surname
          }
        }
        
        if(r.originDestinationDetails) {
          if(r.originDestinationDetails.itineraryInfo) {
            if(r.originDestinationDetails.itineraryInfo.travelProduct){
              var tp = r.originDestinationDetails.itineraryInfo.travelProduct
              //travel information
              if (tp.product) {
                pnrDetails.depDate = tp.product.depDate
                pnrDetails.depTime = tp.product.depTime
              }
              
              pnrDetails.depCity = tp.boardpointDetail ? tp.boardpointDetail.cityCode : ''
              pnrDetails.arrCity = tp.offpointDetail ? tp.offpointDetail.cityCode : ''

              //flight information
              pnrDetails.airline = tp.companyDetail ? tp.companyDetail.identification : ''
              pnrDetails.fligthNumber = tp.productDetails ? tp.productDetails.identification : ''

              pnrDetails.flight = pnrDetails.airline + pnrDetails.fligthNumber
            }
          }
        }
      }
    }
  }

  return pnrDetails
}

function RetrievePNR(session, pnr) {
  var sessionDetails = session.sessionDetails
  var auth = session.auth

  console.log("++++++++RetrievePNR session details++++++++++++++")
  console.log(sessionDetails)
  console.log("++++++++++++++++++++++++++++++++++")   
  console.log("++++++++++++++++++++++++++++++++++")   
  console.log(pnr)
  console.log("++++++++++++++++++++++++++++++++++")     

  var seq = parseInt(sessionDetails.seq, 10) + 1

  return axios
  .get(`${auth.srv}/pnrretrieve`, {
    params:{
      sessionId : sessionDetails.sessionId,
      seqId: seq,
      token: sessionDetails.token,
      retType: "2",
      ctrlNb: pnr
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

    const pnrDetails = getPNRDetails(res.data)
    session.pnrDetails = pnrDetails

    console.log("PNRDetails is: " + JSON.stringify(pnrDetails))
    
    return pnrDetails 
  })
  
  .catch( error => { 
    console.log("---------------- error -----------------") 
    console.log(JSON.stringify(error.response.data)) 
    
    if (isInactiveConversation(error.response.data)) {
      console.log("---------------- error +++++++++ call login again") 
      
      return SendLogin(session, auth)
      .then( rsp => RetrievePNR(req) )
      .catch( err => { throw new Error(JSON.stringify(err)) } )
    }
    else{
      console.log("---------------- error +++++++++ no inactive")
      throw new Error("PNR not found!") 
    }
  })
}

export default RetrievePNR

