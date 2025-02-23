/*
    Gets and sets data for specific project fields:
 */

async function saveTemplate(templateName){
    console.debug("Template name: " + templateName);

    const projectData = new ProjectEntry(
        getInputValue(DURATION_INPUT_ID),
        getInputValue(TICKET_NUMBER_INPUT_ID),
        getInputValue(DESCRIPTION_INPUT_ID),
        await getProjectId() //Requires special logic
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
    setField(PROJECT_INPUT_ID, templateData.projectId);
}

// Get value for project:
async function getProjectId(){
    //Click the Project input field
    const projectInputField = document.getElementById(PROJECT_INPUT_ID);
    simulateClick(projectInputField);

    /*
        When the project field is clicked, SAP will open a list and search for the selected populated project
        Get the Project ID from the search box
     */
    const projectSearchInput = await waitForElement(`#${PROJECT_SEARCH_INPUT_ID}`);
    const projectId = projectSearchInput.value;

    // Click the cancel button go back to previous state
    const cancelButton = document.getElementById(PROJECT_SEARCH_CANCEL_BUTTON);
    simulateClick(cancelButton);

    return projectId;
}