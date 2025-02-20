/*
    Content script that Injects UI elements to the AGIL Time Recording page
    See https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts
    
    Author: meer.shah@actico.com
*/


console.debug("Content script inject-ui.js is running");

//Waits for the footer toolbar to load:
waitForElement(`#${TIME_RECORDING_DIV_ID} .${FOOTER_CLASS}`).then(async (footer) => {
    console.debug("Time Recording's Footer found.");
    await injectSaveTemplate(footer);
});

//Waits for the input field section to load:
waitForElement(`#${TIME_RECORDING_DIV_ID} #${INPUTS_CONTAINER_DIV_ID}`)
    .then(async (inputContainerDiv) => {
    console.debug("Time Recording's Input Div found.");
    await injectFetchTemplate(inputContainerDiv);
});

async function injectSaveTemplate(footer) {
    const templateDiv = await createSaveTemplateDiv();
    if (templateDiv) {
      footer.prepend(templateDiv);
      console.debug("Save Template div injected");
    } else {
      console.error("Failed to create save template div.");
    }
}

async function injectFetchTemplate(inputContainerDiv) {
    const fetchTemplateDiv = await createFetchTemplateDiv();
    if(fetchTemplateDiv){
        inputContainerDiv.insertBefore(fetchTemplateDiv, inputContainerDiv.childNodes[3]);
        console.debug("Fetch Template div injected");
    } else {
        console.error("Failed to create fetch template div.");
    }
}

async function createFetchTemplateDiv(){
    try{
        const response = await fetch(chrome.runtime.getURL("res/FetchTemplateForm.html"));
        const fetchTemplateFormHTML = await response.text();

        const templateDivHolder = document.createElement("div");
        templateDivHolder.innerHTML = fetchTemplateFormHTML;
        const templateSelector = templateDivHolder.querySelector("#templateSelectInput");
        templateSelector.addEventListener("change", () => {
            if(templateSelector.value === "select")
                setFields(null);
            else{
                const templateData = getData(templateSelector.value);
                setFields(templateData);
            }
        })

        //Add options to Template Selector:
        const templateNames = await getAllTemplateNames();
        for(const templateName of templateNames){
            templateSelector.appendChild(createTemplateOption(templateName));
        }

        return templateDivHolder;
    } catch (error) {
        console.error("Error loading fetch template form:", error);
        return null;
    }
}

function createTemplateOption(value) {
    // <option className="sapUiBodyBackground" value="value">Value</option>
    const option = document.createElement("option");
    option.classList.add("sapUiBodyBackground");
    option.value = value;
    option.innerHTML = value;
    return option;
}

function setFields(templateData) {
    if(templateData==null){
        //Clear all fields
        templateData={
            duration: null,
            ticketNumber: null,
            description: null
        }
    }

    setField(DURATION_INPUT_ID, templateData.duration);
    setField(TICKET_NUMBER_INPUT_ID, templateData.ticketNumber);
    setField(DESCRIPTION_INPUT_ID, templateData.description);
}

function setField(id, value){

    const inputElement = document.getElementById(id);
    if(inputElement){
        inputElement.focus(); // Necessary for SAP to recognize the change
        inputElement.value = value;
        inputElement.blur(); // Necessary for SAP to recognize the change
        console.debug("Field "+id+" set to "+value);
        return;
    }

    console.debug("Field "+id+" not found");
}

//Creates form to store template
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
            saveData(templateHolder.querySelector("#templateNameInput").value);
        });

        return templateHolder;
    } catch (error) {
        console.error("Error loading save template form:", error);
        return null;
    }
}

// Taken from https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
function waitForElement(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
