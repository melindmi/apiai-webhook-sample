var txt = {
    "text": "Here are the flight options you have",
    "response_type": "in_channel",
    "attachments": [
        {
            "text": "Choose a flight from the list",
            "fallback": "If you could read this message, you'd be choosing something fun to do right now.",
            "color": "#3AA3E3",
            "attachment_type": "default",
            "callback_id": "flight_selection",
            "actions": [
                {
                    "name": "games_list",
                    "text": "Pick a game...",
                    "type": "button",
                    "options": [
                        {
                            "text": "Hearts",
                            "value": "hearts"
                        },
                        {
                            "text": "Bridge",
                            "value": "bridge"
                        }
                    ]
                }
            ]
        }
    ]
}


export function getChooseFlightConv(){
	return txt
}
