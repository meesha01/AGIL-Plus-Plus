/*
    Content script that saves the currently entered data on AGIL Time recording
    See https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts
    
    Author: meer.shah@actico.com
*/

const DURATION_INPUT_ID = "__input0-inner";
const TICKET_NUMBER_INPUT_ID = "__input1-inner"
const DESCRIPTION_INPUT_ID = "__area0-inner"

function saveData(key){
    try {
        console.debug("Key: " + key);

        const projectData = {
            duration: getDuration(),
            ticketNumber: getTicketNumber(),
            description: getDescription()
        }

        localStorage.setItem(key, JSON.stringify(projectData));

        console.debug("Data from localStorage: " + JSON.stringify(projectData));
        return true;
    }
    catch(error){
        console.error("Error occurred while saving data: " + JSON.stringify(error));
        return false;
    }
}

// Get the value for duration:
function getDuration(){
    const durationInput = document.querySelector(`#${DURATION_INPUT_ID}`);
    if(durationInput)
        return durationInput.value;

    console.warn("Duration input element not found");
    return null;
}

//Get value for Ticket Number
function getTicketNumber(){
    const ticketNumberInput = document.querySelector(`#${TICKET_NUMBER_INPUT_ID}`);
    if(ticketNumberInput)
        return ticketNumberInput.value;

    console.warn("Ticket number element not found");
    return null;
}

//Get the description
function getDescription(){
    const descriptionInput = document.querySelector(`#${DESCRIPTION_INPUT_ID}`);
    if(descriptionInput)
        return descriptionInput.value;
    console.warn("Description element not found");
}