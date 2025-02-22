/*
    Utility functions
 */

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

// For some reason a simple click() does not work for SAP buttons
function simulateClick(element){
    if(!element) {
        log.warn("Element is null");
        return;
    }

    element.dispatchEvent(new Event('mousedown', {bubbles: true}));
    element.click();
}

// Set the value for a field and trigger the events to resume SAP flow:
function setField(id, value){

    const inputElement = document.getElementById(id);

    if(!inputElement){
        console.debug("Field "+id+" not found");
        return;
    }

    inputElement.focus(); // Necessary for SAP to recognize the change
    inputElement.value = value;
    inputElement.blur(); // Necessary for SAP to recognize the change
    console.debug("Field "+id+" set to "+value);
}

// Get value for a regular input element:
function getInputValue(elementId){
    const element = document.getElementById(elementId);
    if(element)
        return element.value;
    console.warn(`Input element ${elementId} not found`);
    return null;
}
