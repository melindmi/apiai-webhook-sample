//check if the response is "inactive conversession"
//the response body should be:
// "Body": {
//            "Fault": {
//                "faultcode": "soap:Client",
//                "faultstring": " 95|Session|Inactive conversation"
//            }

export function isInactiveConversation(rsp) {
    
    if(rsp.Envelope){
		if(rsp.Envelope.Body){
			var body = rsp.Envelope.Body
			if(body.Fault){
				var faultstr = body.Fault.faultstring
				if(faultstr.split("|")[2] == "Inactive conversation"){
					return true
				}
			}
		}
	}

	return false
}
