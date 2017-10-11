export function RetrievePNROK(name, flight){

 	var txt = "Hi, " + name + "!" 
    txt += "Your flight is: " + flight

    return txt
} 


export function RetrievePNRKO(pnr){

	var txt = "Sorry! The PNR " + pnr 
    txt +=  " was not found in Amadeus system."

    return txt  
}
