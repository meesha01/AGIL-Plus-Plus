/*
    Content script that saves the currently entered data on AGIL Time recording
    See https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts
    
    Author: meer.shah@actico.com
*/

function saveData(key){
    try {
        console.debug("Key: " + key);

        const projectData = {
            duration: getDuration(),
            ticketNumber: getTicketNumber(),
            description: getDescription()
        }

        localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(projectData));

        console.debug("Data from localStorage: " + JSON.stringify(projectData));
        return true;
    }
    catch(error){
        console.error("Error occurred while saving data: " + JSON.stringify(error));
        return false;
    }
}

async function getAllTemplateNames() {
    const keys = [];
    for(let i=0; i<localStorage.length; i++) {
        const key = localStorage.key(i);
        if(key.startsWith(LOCAL_STORAGE_PREFIX))
            keys.push(key.substring(LOCAL_STORAGE_PREFIX.length));
    }
    return keys;
}

function getData(key){
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_PREFIX+key));
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