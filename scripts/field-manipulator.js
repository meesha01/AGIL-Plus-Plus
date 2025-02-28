/*
    Content Script that gets and sets data for specific project fields:
 */

async function saveTemplate(templateName){
    console.debug("Template name: " + templateName);

    const projectData = new ProjectEntry(
        getInputValue(DURATION_INPUT_ID),
        getInputValue(TICKET_NUMBER_INPUT_ID),
        getInputValue(DESCRIPTION_INPUT_ID),
        await getProjectId() //Project requires special logic
    );

    saveData(templateName, projectData);

    //TODO: Refresh template selector list
    //TODO: Display some kind of message saying "Saved"
}

async function setFields(templateName) {
    let templateData = getValue(templateName);

    if(templateData==null){
        //Clear all fields
        templateData = new ProjectEntry();
    }

    setField(DURATION_INPUT_ID, templateData.duration);
    setField(TICKET_NUMBER_INPUT_ID, templateData.ticketNumber);
    setField(DESCRIPTION_INPUT_ID, templateData.description);
    await setProject(templateData.projectId);
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

    try{
        const projectSearchInput = await waitForElement(`#${PROJECT_SEARCH_INPUT_ID}`);
        const projectId = projectSearchInput.value;

        // Click the cancel button go back to previous state
        const cancelButton = document.getElementById(PROJECT_SEARCH_CANCEL_BUTTON_ID);
        simulateClick(cancelButton);

        return projectId;
    }
    catch(error){
        console.error("Could not fetch value of Project ID.", error.message);
        return null;
    }
}

// Set the project
async function setProject(projectId){
    //Click the Project input field
    const projectInputField = document.getElementById(PROJECT_INPUT_ID);
    simulateClick(projectInputField);

    try{
        //Search for the Project using its ID:
        const projectSearchInput = await waitForElement(`#${PROJECT_SEARCH_INPUT_ID}`)

        projectSearchInput.value = projectId;
        //Signal value change:
        simulateClick(projectInputField);
        projectInputField.disabled = new Event("input", {bubbles: true});
        projectInputField.disabled = new Event("change", {bubbles: true});
        projectSearchInput.dispatchEvent(KEY_DOWN_ENTER);

        //Wait for the results to come back
        const searchResultListItem = await waitForElement(
            `#${PROJECT_SEARCH_RESULT_LIST_ID} > li:not(#${PROJECT_SEARCH_NO_DATA_LI_ID})`
        );

        simulateClick(searchResultListItem);
    } catch(error) {
        console.error("Could not Set the Project ID.", error.message);
    }
}