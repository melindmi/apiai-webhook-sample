import axios from "axios"

function getAuth(headers) {
    const auth = {}

    auth.org = 'WBSTEST'
    auth.passLen = '10'

    if (headers) {
        auth.officeId = headers['officeid'] || ''
        auth.userId = headers['userid'] || ''
        auth.pass = headers['pass'] || ''
        auth.srv = headers['srv'] || ''
    }

    return auth
}

function getSessionDetails(data) {
  var sessionDetails = {}
  if (data.Envelope) {
    if (data.Envelope.Header) {
      var s = data.Envelope.Header.Session
      sessionDetails.sessionId = s.SessionId
      sessionDetails.seq = s.SequenceNumber
      sessionDetails.token = s.SecurityToken
    }
  }

  return sessionDetails
}

function SendLogin(session, headers) {
  const auth = getAuth(headers)

  return axios
  .get(`${srv}/login`, {
    params: {
      officeId : auth.officeId,
      userId: auth.userId,
      org: auth.org,
      binaryPassLen: auth.passLen,
      binaryPass: auth.pass
    }
  })
  .then( res => {
    console.log("login then response: " + JSON.stringify(res.data))
    
    var sessionDetails = getSessionDetails(res.data)  
    session.sessionDetails = sessionDetails
    session.auth = auth

    console.log("++++++++++++++++++++++++++++++++++")
    console.log(sessionDetails)
    console.log("++++++++++++++++++++++++++++++++++")  

    return  res.data
  })
  .catch( error => console.log(error) )
}

export default SendLogin
