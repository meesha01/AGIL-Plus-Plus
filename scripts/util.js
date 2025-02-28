/**
 * Utility functions used throughout the project
 */

/**
 * Given a css selector, it waits for the matching element to appear in the DOM
 *
 * @param selector
 * @param timeout
 * @returns {Promise<Element>} Promise that resolves with the found DOM element
 * @throws {Error} If the element doesn't appear within the specified timeout
 *
 * @example
 * // Wait for a specific element to appear (with the default timeout - 10s)
 *  const myElement = await waitForElement('#my-element');
 * // Wait with a custom timeout (5s)
 * const myElement = await waitForElement('.special-class', 5000);
 *
 * @see {@link https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists|Original source}
 */
async function waitForElement(selector, timeout=10000) {
    return new Promise((resolve, reject) => {

        //Check if an element already exists:
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        // Set up a timer. Default is 10 seconds:
        const elementTimeout = setTimeout(() => {
            observer.disconnect();
            const errorMessage = `Timed out after ${timeout} ms, while waiting for ${selector}`
            reject(new Error(errorMessage));
        }, timeout);

        // Observe for the element:
        const observer = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                clearTimeout(elementTimeout);
                resolve(document.querySelector(selector));
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

/**
 * For some reason a simple click() does not work for buttons in AGILTime
 * It must have a mousedown event + click()
 * This functions simulates a click on a DOM element as if a user clicked it
 * @param element
 */
function simulateClick(element){
    if(!element) {
        console.warn("Element is null");
        return;
    }

    element.dispatchEvent(new Event('mousedown', {bubbles: true}));
    element.click();
}

/**
 * Set the value for a field and trigger the events to resume SAP flow
 * Simply setting the value is not enough. The event listeners will not be triggered.
 * This functions sets the value and does what is necessary for the event listeners to be triggered.
 * @param id
 * @param value
 */
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

/**
 * Fetches the value of an input element
 * @param elementId
 * @returns {value|null} value when the element was found
 * null when it isn't in the DOM
 */
function getInputValue(elementId){
    const element = document.getElementById(elementId);
    if(element)
        return element.value;
    console.warn(`Input element ${elementId} not found`);
    return null;
}

/**
 * Adds an <option> to the given element
 * Target option -> <option className="sapUiBodyBackground" value="value">Value</option>
 *
 * @param element
 * @param optionValue
 */
function addOption(element, optionValue) {
    const option = document.createElement("option");
    option.classList.add("sapUiBodyBackground");
    option.value = optionValue;
    option.innerHTML = optionValue;
    element.appendChild(option);
}