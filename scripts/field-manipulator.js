/**
 * Content Script that gets and sets data for specific Project related fields
 */

/**
 * Saves Project data to a template
 * @param templateName
 * @returns {Promise<void>}
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
    const templateSelector = document.getElementById(TEMPLATE_SELECTOR_ID);
    if(templateSelector) {
        addOption(templateSelector, templateName);
    }
    else{
        console.error("Template selector not found while trying to add new option-"+ templateName);
        showToast(PAGE_REFRESH_REQUEST);
    }

    showToast(`Template "${templateName}" saved successfully`, "green");
}

/**
 * Sets the value for all the project fields
 * @param templateName
 * @returns {Promise<void>}
 */
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

/**
 * Fetches the ID of the selected project
 * @returns {Promise<string|null>} A promise that resolves to the project ID string,
 * or null if retrieval fails
 */
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
        showToast("Could not save the project. Try again", "red");
        return null;
    }
}

/**
 * Selects a project based on the project ID
 * @param projectId
 * @returns {Promise<void>}
 */
async function setProject(projectId){
    //Click the Project input field
    const projectInputField = document.getElementById(PROJECT_INPUT_ID);
    simulateClick(projectInputField);

    try{
        //Search for the Project using its ID:
        const projectSearchInput = await waitForElement(`#${PROJECT_SEARCH_INPUT_ID}`)

        projectSearchInput.value = projectId;
        //Signal value change and search:
        projectSearchInput.dispatchEvent(new Event('input', {bubbles: true}));
        projectSearchInput.dispatchEvent(KEY_DOWN_ENTER);

        //Wait for the results to come back and click
        const searchResultListItem = await waitForElement(
            `#${PROJECT_SEARCH_RESULT_LIST_ID} > li:not(#${PROJECT_SEARCH_NO_DATA_LI_ID})`
        );
        const projectList = searchResultListItem.parentElement;

        let found = false
        for (const listItem of projectList.children) {
            const itemId = getIdFromListItem(listItem);
            if (projectId === itemId) {
                simulateClick(listItem);
                found=true;
                break;
            }
        }
        if(!found){
            showToast("Could not find the saved project in your Project list");
        }
    } catch(error) {
        console.error("Could not Set the Project ID.", error.message);
        showToast("Could not Set the Project.", "red");
    }
}

async function saveAllPresenceTime(){
    const presenceTimeErrorsLabel = document.getElementById(PRESENCE_TIME_ERROR_LABEL_ID);

    presenceTimeErrorsLabel.hidden = true;
    presenceTimeErrorsLabel.innerHTML = "";

    //Get values:
    const currentDate = new Date(getInputValue(PRESENCE_DATE_INPUT_ID));
    const startTime = getInputValue(PRESENCE_START_TIME_INPUT_ID);
    const endTime = getInputValue(PRESENCE_END_TIME_INPUT_ID);

    //Get all weekdays:
    const weekdays = getAllWeekdays(currentDate);

    const failedDates = [];
    const savePromises = [];

    for(const weekday of weekdays){
        const promise = savePresenceTime(weekday, startTime, endTime).then(r => {
            console.debug("Presence time saved for "+weekday);
        }).catch(error => {
            console.warn(`Could not save presence time for ${weekday}`,error);
            failedDates.push(weekday);
        });
        savePromises.push(promise);
    }

    await Promise.allSettled(savePromises);

    if(failedDates.length > 0){
        const message = "Saving presence time failed for - "+failedDates.map(date => {
            return date.toLocaleDateString();
        }).join(", ");

        showToast("Saving presence time failed for some dates", "red");
        presenceTimeErrorsLabel.innerHTML = message;
        presenceTimeErrorsLabel.hidden = false;
    } else{
        showToast("Saved presence time for all dates", "green");
    }
}