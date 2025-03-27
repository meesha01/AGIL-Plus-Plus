/**
 * Utility functions used throughout the project
 */

/**
 * Given a css selector, it waits for the matching element to appear in the DOM
 * Suitable for actions that only need to performed once (eg. fetch value from element)
 * For actions that need to be performed every time an element is added, use addOnLoadObserver
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
async function waitForElement(selector, timeout=-1) {
    return new Promise((resolve, reject) => {

        //Check if an element already exists:
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        let elementTimeout;
        // Set up a timer
        if(timeout>0) {
             elementTimeout = setTimeout(() => {
                observer.disconnect();
                const errorMessage = `Timed out after ${timeout} ms, while waiting for ${selector}`
                reject(new Error(errorMessage));
            }, timeout)
        }

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
 * Given a css selector and a callback function, it calls the callback every time an element matching the selector
 * is added to the DOM
 *
 * Suitable for actions that need to be performed every single time an element is added to the DOM
 * (Example, append a child to the element)
 * For actions that only need to be performed once, use waitForElement
 *
 * @param selector
 * @param onLoad A function that will be called once the element is added to the DOM
 *
 * @example
 * // Wait for a specific element to appear
 * addOnLoadObserver("#elementId", (element) => {
 *   //doSomething with the element
 * });
 *
 */
function addOnLoadObserver(selector, onLoad) {

    if(!onLoad){
        log.warn("Callback function is not provided");
        return;
    }

    // Observer to watch when the element is added:
    const addObserver = new MutationObserver(() => {
        if (document.querySelector(selector)) {
            elementAdded(document.querySelector(selector));
        }
    });

    // Observer to watch when the element is removed:
    const removeObserver = new MutationObserver(() => {
        if (!document.querySelector(selector)) {
            elementRemoved();
        }
    });

    function elementAdded(element){
        console.debug(`Element ${element.id} with selector ${selector} was added to the page.` );
        addObserver.disconnect();
        //Start watching for remove:
        removeObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
        onLoad(element);
    }

    function elementRemoved(){
        console.debug(`Element with selector ${selector} was removed from the page.` );
        removeObserver.disconnect();
        //Start watching again for add:
        addObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if(document.querySelector(selector)) {
        elementAdded(document.querySelector(selector));
    } else{
        elementRemoved();
    }

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
 * @param newValue
 */
function addOption(element, newValue) {

    const newOption = document.createElement("option");
    newOption.classList.add("sapUiBodyBackground");
    newOption.value = newValue;
    newOption.innerHTML = newValue;

    let processed = false;
    // Iterate through the existing options
    for(const option of element.children){
        if(newValue === option.value){
            console.debug(`Option with ${newValue} already exists`);
            processed = true;
            break;
        }
        if(newValue.toLocaleLowerCase() < option.value.toLocaleLowerCase()){
            //Insert
            element.insertBefore(newOption, option);
            processed = true;
            break;
        }
    }

    if(!processed){
        element.append(newOption);
    }
}

/**
 * Extracts the project ID from the list item returned by project search
 * This function, will only work if the structure within the <li> does not change
 * @param listItem - One project search result <li> element
 * @returns string|null - the project ID, if found
 */
function getIdFromListItem(listItem){
    const projectDetailsSpan =
        listItem.querySelector(".sapMObjLBottomRow > div:first-child > div > div > span");
    if(!projectDetailsSpan){
        log.warning("Could not find the project ID for "+ listItem.id);
        return null;
    }

    const projectDetailsValue = projectDetailsSpan.innerHTML;

    // Find the position of the last set of brackets:
    const start = projectDetailsValue.lastIndexOf("(")+1;
    const end = projectDetailsValue.lastIndexOf(")");

    if(!start || !end || start>=end){
        log.warning("Could not find the project ID for "+ listItem.id);
        return null;
    }

    //Extract the text within the last set of brackets:
    return projectDetailsValue.substring(start, end);
}

/**
 * Shows a toast message using SAP's MessageToast
 * This function was generated by Claude 3.7 Sonnet
 * @param {string} message - The message to display
 * @param color
 * @param duration
 */
function showToast(message, color="white", duration = 3000) {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 10%;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(50, 50, 50, 0.9);
        color: ${color};
        padding: 10px 20px;
        border-radius: 4px;
        z-index: 10000;
        font-family: '72', 'Arial', sans-serif;
        font-size: 18px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    `;

    // Add to DOM
    document.body.appendChild(toast);

    // Remove after duration
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s';
        setTimeout(() => toast.remove(), 500);
    }, duration);
}
