/*
    Content script that runs inside the actual webpage, and has access to it's DOM
    Injects UI elements to the SAP page
    See https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts
    
    Author: meer.shah@actico.com
*/

const FOOTER_CLASS = "sapMPageFooter";
const TIME_RECORDING_ID = "application-Timerecording-display-component---ViewAddEntry--idOverviewView";

function injectSaveTemplate(footer){
    footer.prepend(createTemplateDiv());
    console.debug("Save Template form injected");
}

//Creates form to store template
function createTemplateDiv(){

    //Create textbox for template name:
    const templateNameInput = document.createElement("input");
    templateNameInput.type = "text";
    templateNameInput.id = "templateNameInput"; 
    templateNameInput.name = templateNameInput.id; 
    templateNameInput.classList.add("sapMInputBaseInner", "sapMInputBaseContentWrapper", "sapMFlexItemAlignAuto", "sapMFlexBoxBGTransparent", "sapMFlexItem");

    //Label:
    const templateNameLabel = document.createElement("label");
    templateNameInput.innerHTML="Template Name:";
    templateNameInput.for = templateNameInput.name;

    //Save template button:
    const saveTemplatebutton = document.createElement("button");
    saveTemplatebutton.type="button";
    // Attach event listener
    saveTemplatebutton.addEventListener("click", function (event) {
        console.log("Save Template button clicked!");
    });
    saveTemplatebutton.classList.add(
        "sapMBtnBase", "sapMBtn", "sapMBarChild", "sapMBarChildFirstChild"
    );
    templateButtonContent = document.createElement("span");
    templateButtonContent.classList.add("sapMBtnContent", "sapMBtnInner", "sapMBtnHoverable", "sapMFocusable", "sapMBtnText", "sapMBtnIconFirst", "sapMBtnDefault");
    templateButtonContent.innerHTML = "Save Template";
    saveTemplatebutton.appendChild(templateButtonContent);
    
    //Put fields into a Div:
    const templateDiv = document.createElement("div");
    templateDiv.appendChild(templateNameLabel);
    templateDiv.appendChild(templateNameInput);
    templateDiv.appendChild(saveTemplatebutton);
    templateDiv.classList.add(
        "sapMIBar", "sapMTBInactive", "sapMTB", "sapMTBNewFlex", 
        "sapMTBStandard", "sapMTB-Auto-CTX", "sapMOTB", "sapMIBar-CTX", 
        "sapMFooter-CTX", "sapContrast", "sapContrastPlus"
    );

    return templateDiv;
}

console.debug("Content script is running");

// Taken from https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
function waitForElement(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
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

//Waits for the toolbar to load:
waitForElement(`#${TIME_RECORDING_ID} .${FOOTER_CLASS}`).then((footer) => {
    console.debug("Footer found.");
    injectSaveTemplate(footer);
});