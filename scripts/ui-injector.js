/**
 * Content script that Injects UI elements to the AGIL Time Recording page
 * See https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts
 */

console.debug("Content script inject-ui.js is running");

//Inject elements to save template after the footer loads
waitForElement(`#${TIME_RECORDING_DIV_ID} .${FOOTER_CLASS}`).then(async (footer) => {
    console.debug("Time Recording's Footer found.");
    await injectSaveTemplate(footer);
})
.catch(error => console.error('Error while finding the Time Recording footer: ', error.message));

//Inject elements to fetch template after the input fields load
waitForElement(`#${TIME_RECORDING_DIV_ID} #${INPUTS_CONTAINER_DIV_ID}`)
    .then(async (inputContainerDiv) => {
    console.debug("Time Recording's Input Div found.");
    await injectFetchTemplate(inputContainerDiv);
})
.catch(error => console.error('Error while finding the Time Recording container: ', error.message));

/**
 * Injects the necessary UI to save the project data to a template, in the footer
 * @param footer
 * @returns {Promise<void>}
 */
async function injectSaveTemplate(footer) {
    const templateDiv = await createSaveTemplateDiv();
    if (templateDiv) {
      footer.prepend(templateDiv);
      console.debug("Save Template div injected");
    } else {
      console.error("Failed to create save template div.");
    }
}

/**
 * Injects the necessary UI to select the saved template to be populated
 * @param inputContainerDiv
 * @returns {Promise<void>}
 */
async function injectFetchTemplate(inputContainerDiv) {
    const fetchTemplateDiv = await createFetchTemplateDiv();
    if(fetchTemplateDiv){
        inputContainerDiv.insertBefore(fetchTemplateDiv, inputContainerDiv.childNodes[3]);
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
        const templateSelector = templateDivHolder.querySelector("#templateSelectInput");
        templateSelector.addEventListener("change", () => {
            setFields(templateSelector.value);
        });

        //Add options to Template Selector:
        const templateNames = await getAllKeys();
        for(const templateName of templateNames){
            templateSelector.appendChild(createTemplateOption(templateName));
        }

        return templateDivHolder;
    } catch (error) {
        console.error("Error loading fetch template form:", error.message);
        return null;
    }
}

/**
 * Creates the <option> element representing a stored Template
 * <option className="sapUiBodyBackground" value="value">Value</option>
 */
function createTemplateOption(value) {
    const option = document.createElement("option");
    option.classList.add("sapUiBodyBackground");
    option.value = value;
    option.innerHTML = value;
    return option;
}