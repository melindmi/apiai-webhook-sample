import axios from "axios"

import { isInactiveConversation } from "./utilepars"
import session from "express-session"

import SendLogin from "./login"

function getFlightsOptions(data){
 
  var flightOpt = []

  if(data.Envelope){  
    if(data.Envelope.Body){
      if(data.Envelope.Body.Air_MultiAvailabilityReply){
        var m = data.Envelope.Body.Air_MultiAvailabilityReply
        if(m.singleCityPairInfo){
          var sg = m.singleCityPairInfo
          if(sg.flightInfo){
            for(var idx = 0; idx < sg.flightInfo.length; idx++) {
                if(sg.flightInfo[idx].basicFlightInfo){
                  var bf = sg.flightInfo[idx].basicFlightInfo
                  var details = {}
                  if(bf.flightDetails){
                    var d = bf.flightDetails
                    details.depDate = d.departureDate
                    details.depTime = d.departureTime
                    details.arrDate = d.arrivalDate
                    details.arrTime = d.arrivalTime
                  }

                  details.depCity = bf.departureLocation ? bf.departureLocation.cityAirport : ''
                  details.arrCity = bf.arrivalLocation ? bf.arrivalLocation.cityAirport : ''
                  details.flightId = bf.flightIdentification ? bf.flightIdentification.number : ''
                  details.airline = bf.marketingCompany ? bf.marketingCompany.identifier : ''
                 
                  flightOpt.push(details)
                }
            }
          } 
        }
      }
    }
  }

  return flightOpt
}


function FlightAvailability(session) {
 
  console.log("Session is: " + JSON.stringify(session))
 
  var sessionDetails = session.sessionDetails
  var auth = session.auth
  var pnrDetails = session.pnrDetails

  console.log("++++++++FlightAvailability session details++++++++++++++")
  console.log(sessionDetails)
  console.log("++++++++++++++++++++++++++++++++++")   
  console.log("PNRDetails is: " + JSON.stringify(pnrDetails))

  var seq = parseInt(sessionDetails.seq, 10) + 1

  return axios
  .get(`${auth.srv}/availability`, {
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
    
    console.log("Get Flights Options!!!!!!!!!!!!!!!!!" )
    const flightsOpt = getFlightsOptions(res.data)
    console.log("Flights Options are: " )
    console.log(flightsOpt)
    console.log("Flights Options are: " + JSON.stringify(flightsOpt))
    
    return flightsOpt 
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


