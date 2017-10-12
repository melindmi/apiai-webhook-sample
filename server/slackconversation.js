var txt = {
    "text": "Here are the flight options you have",
    "response_type": "in_channel",
    "attachments": [
        {
            "title": "Option 1",
	    "fields": [
                {	
                    "Origin": "HKU",
                    "Destination": "SYD",
                    "DeparturDate": "12/10/17",
		    "DepartureTime": "12:30am",
		    "Flight Id" : "6X1234"	
                }
	    ],	    
            "color": "#3AA3E3",
            "attachment_type": "default",
            "callback_id": "flight_selection",
            "actions": [
                {
                    "name": "choosen_flight",
                    "text": "Choose",
                    "type": "button"
                }
            ]
        },
	{
            "title": "Option 2",
	    "fields": [
                {	
                    "Origin": "HKU",
                    "Destination": "SYD",
                    "DeparturDate": "12/10/17",
		    "DepartureTime": "12:30am",
		    "Flight Id" : "6X1234"	
                }
	    ],	    
            "color": "#3AA3E3",
            "attachment_type": "default",
            "callback_id": "flight_selection",
            "actions": [
                {
                    "name": "choosen_flight",
                    "text": "Choose",
                    "type": "button"
                }
            ]
        }
    ]
}


export function getChooseFlightConv(){
	return txt
}
