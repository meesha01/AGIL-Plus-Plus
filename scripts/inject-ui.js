/*
    Content script that Injects UI elements to the AGIL Time Recording page
    See https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts
    
    Author: meer.shah@actico.com
*/

const FOOTER_CLASS = "sapMPageFooter";
const TIME_RECORDING_DIV_ID = "application-Timerecording-display-component---ViewAddEntry--idOverviewView";
const INPUTS_CONTAINER_DIV_ID = "__layout0";

async function injectSaveTemplate(footer) {
    const templateDiv = await createTemplateDiv();
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
            console.log(templateSelector.value);
        })

        return templateDivHolder;
    } catch (error) {
        console.error("Error loading fetch template form:", error);
        return null;
    }
}

//Creates form to store template
async function createTemplateDiv() {
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

console.debug("Content script is running");

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

//Waits for the input field section to load:
waitForElement(`#${TIME_RECORDING_DIV_ID} .${FOOTER_CLASS}`).then(async (footer) => {
    console.debug("Time Recording's Footer found.");
    await injectSaveTemplate(footer);
});


//Waits for the footer toolbar to load:
waitForElement(`#${TIME_RECORDING_DIV_ID} #${INPUTS_CONTAINER_DIV_ID}`).then(async (inputContainerDiv) => {
    console.debug("Time Recording's Input Div found.");
    await injectFetchTemplate(inputContainerDiv);
});

