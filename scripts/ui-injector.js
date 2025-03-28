/**
 * Content script that Injects UI elements to the AGIL Time Recording page
 * See https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts
 */

console.debug("Content script inject-ui.js is running");

// Inject the UI for Project Templates after the input fields section load
// Injects every time the Project div is loaded
addOnLoadObserver(`${PROJECT_SECTION_SELECTOR}`,
    (projectInputsDiv) => {
    console.debug("Time Recording's Input Div found.");
    void injectFetchTemplate(projectInputsDiv);
    void injectSaveTemplate(projectInputsDiv);
});

// Inject duration shortcuts before before the original duration data-element
addOnLoadObserver(`${PROJECT_SECTION_SELECTOR} > div:nth-of-type(8)`, 
    (durationDataRow) => {
    console.debug("Duration Data div found.");
    void injectDurationShortcutsTemplate(durationDataRow);
});

// Inject UI for Presence time the end of the section
addOnLoadObserver(PRESENCE_SECTION_SELECTOR,
    (presenceDiv) => {
    console.debug("Presence Time section found.");
    void injectPresenceTimeCustomizations(presenceDiv);
});

/**
 * Injects the necessary UI to save the project data to a template
 * @param projectSection - The section/div where all the UI will be appended
 * @returns {Promise<void>}
 */
async function injectSaveTemplate(projectSection) {
    const templateDiv = await createSaveTemplateDiv();
    if (templateDiv) {
        projectSection.append(templateDiv);
        console.debug("Save Template div injected");
    } else {
        console.error("Failed to create save template div.");
        showToast(PAGE_REFRESH_REQUEST);
    }
}

/**
 * Injects the necessary UI to select the saved template to be populated
 * @param projectInputsDiv - The Div that contains the inputs for Project time entry
 * @returns {Promise<void>}
 */
async function injectFetchTemplate(projectInputsDiv) {
    const fetchTemplateDiv = await createFetchTemplateDiv();
    if(fetchTemplateDiv){
        projectInputsDiv.prepend(fetchTemplateDiv);
        console.debug("Fetch Template div injected");
    } else {
        console.error("Failed to create fetch template div.");
        showToast(PAGE_REFRESH_REQUEST);
    }
}

/**
 * Injects some buttons to ease the duration input
 * @param durationInputRow
 * @returns {Promise<void>}
 */
async function injectDurationShortcutsTemplate(durationInputRow) {
    const durationShortcutDiv = await createDurationShortcutsDiv();
    if(durationShortcutDiv){
        durationInputRow.insertBefore(durationShortcutDiv, durationInputRow.childNodes[0]);
        console.debug("DurationShortcuts Template div injected");
    } else {
        console.error("Failed to create DurationShortcuts div.");
        showToast(PAGE_REFRESH_REQUEST);
    }
}

/**
 * Injects custom elements to Presence Time section
 * @param presenceTimeDiv
 * @returns {Promise<void>}
 */
async function injectPresenceTimeCustomizations(presenceTimeDiv) {
    const presenceTimeCustomizations = await createPresenceCustomizations();
    if(presenceTimeCustomizations){
        presenceTimeDiv.appendChild(presenceTimeCustomizations);
        console.debug("Presence Time customizations injected");
    } else {
        console.error("Failed to create Presence Time customizations.");
        showToast(PAGE_REFRESH_REQUEST);
    }
}

/**
 * Creates the UI elements to store save the project data to a template
 * @returns {Promise<HTMLDivElement|null>} A promise that resolves to the Div containing the UI
 * Or null if there was an error
 */
async function createSaveTemplateDiv() {
    try {
        const response = await fetch(chrome.runtime.getURL("res/SaveTemplateForm.html"));
        const templateFormHTML = await response.text();

        const templateHolder = document.createElement("div");
        templateHolder.innerHTML = templateFormHTML;

        // Attach event listener to the button
        const saveTemplateButton = templateHolder.querySelector("button"); // Select the button within the loaded HTML
        saveTemplateButton.addEventListener("click", function () {
            console.debug("Save Template button clicked");
            saveTemplate(templateHolder.querySelector("#templateNameInput").value);
        });

        return templateHolder;
    } catch (error) {
        console.error("Error loading save template form:", error.message);
        return null;
    }
}

/**
 * Creates the UI elements required to select the saved template to be populated
 * @returns {Promise<HTMLDivElement|null>} A promise that resolves to the Div containing the UI
 * Or null if there was error
 */
async function createFetchTemplateDiv(){
    try{
        const response = await fetch(chrome.runtime.getURL("res/FetchTemplateForm.html"));
        const fetchTemplateFormHTML = await response.text();

        const templateDivHolder = document.createElement("div");
        templateDivHolder.innerHTML = fetchTemplateFormHTML;
        const templateSelector = templateDivHolder.querySelector("#"+TEMPLATE_SELECTOR_ID);
        templateSelector.addEventListener("change", () => {
            setFields(templateSelector.value);
        });

        //Add options to Template Selector:
        const templateNames = await getAllKeys();
        for(const templateName of templateNames){
            addOption(templateSelector, templateName);
        }

        return templateDivHolder;
    } catch (error) {
        console.error("Error loading fetch template form:", error.message);
        return null;
    }
}

async function createDurationShortcutsDiv(){
    try{
        const response = await fetch(chrome.runtime.getURL("res/DurationShortcuts.html"));
        const durationShortcutsHTML = await response.text();

        const shortCutDivHolder = document.createElement("div");
        shortCutDivHolder.innerHTML = durationShortcutsHTML;

        const buttons = shortCutDivHolder.querySelectorAll(".sapMBtn");
        buttons.forEach( button => { 
            button.addEventListener("click", () => {
                console.debug("Received click event on " + button.textContent)
                setField(DURATION_INPUT_ID, button.textContent);
            });
        });
    

        return shortCutDivHolder;
    } catch (error) {
        console.error("Error loading duration shortcuts form:", error.message);
        return null;
    }
}

async function createPresenceCustomizations(){
    try{
        const response = await fetch(chrome.runtime.getURL("res/PresenceTimeCustomizations.html"));
        const presenceCustomizationsHTML = await response.text();

        const presenceCustomizationsHolder = document.createElement("div");
        presenceCustomizationsHolder.innerHTML = presenceCustomizationsHTML;

        const saveWeekTimeButton = presenceCustomizationsHolder.querySelector("#"+SAVE_WEEK_TIME_BUTTON);
        saveWeekTimeButton.addEventListener("click", () => {
            saveAllPresenceTime();
        });

        return presenceCustomizationsHolder;
    } catch (error) {
        console.error("Error loading presence time customizations", error.message);
        return null;
    }
}
