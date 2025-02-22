/*
    Gets and sets data for specific project fields:
 */

function saveTemplate(templateName){
    console.debug("Template name: " + templateName);

    const projectData = new ProjectEntry(
        getInputValue(DURATION_INPUT_ID),
        getInputValue(TICKET_NUMBER_INPUT_ID),
        getInputValue(DESCRIPTION_INPUT_ID),
        getProjectId()
    );

    saveData(templateName, projectData);
}

function setFields(templateName) {
    let templateData = getValue(templateName);

    if(templateData==null){
        //Clear all fields
        templateData = new ProjectEntry();
    }

    setField(DURATION_INPUT_ID, templateData.duration);
    setField(TICKET_NUMBER_INPUT_ID, templateData.ticketNumber);
    setField(DESCRIPTION_INPUT_ID, templateData.description);
    setField(PROJECT_INPUT_ID, templateData.project);
}

// Get value for project:
function getProjectId(){
    //Click the Project input field
    const projectInputField = document.getElementById(PROJECT_INPUT_ID);
    projectInputField.click();
}