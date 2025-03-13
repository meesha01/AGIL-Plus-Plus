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
