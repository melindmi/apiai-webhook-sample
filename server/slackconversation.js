var txt = {
    "text": "Here are the flight options you have",
    "response_type": "in_channel",
    "attachments": [
        {
            "title": "Option 1",
	    "fields": [
                {
	            "title": "Origin",
                    "value": "HKU",
                    "short": true
		},
	        {
	            "title": "Destination",
                    "value": "SYD",
                    "short": true
		},
		{
	            "title": "DeparturDate",
                    "value": "12/10/17",
                    "short": true
		}, 
		{
	            "title": "DepartureTime",
                    "value": "12:30am",
                    "short": true
		},  
                {
	            "title": "Flight Id",
                    "value": "6X1234",
                    "short": true
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
	            "title": "Origin",
                    "value": "HKU",
                    "short": false
		},
	        {
	            "title": "Destination",
                    "value": "SYD",
                    "short": false
		},
		{
	            "title": "DeparturDate",
                    "value": "12/10/17",
                    "short": false
		}, 
		{
	            "title": "DepartureTime",
                    "value": "12:30am",
                    "short": false
		},  
                {
	            "title": "Flight Id",
                    "value": "6X1234",
                    "short": true
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
