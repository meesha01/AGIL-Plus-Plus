/**
 * Contains all the constants required throughout the Project
 */

// Container IDs
const FOOTER_CLASS = "sapMPageFooter";
const TIME_RECORDING_DIV_ID = "application-Timerecording-display-component---ViewAddEntry--idOverviewView";
const TIME_RECORDING_MAIN_SECTION_ID =
    "application-Timerecording-display-component---ViewAddEntry--idOverviewView-cont";
const PROJECT_SECTION_SELECTOR =
    `#${TIME_RECORDING_MAIN_SECTION_ID} > div:nth-of-type(2) > div:nth-of-type(4) > div`;


// Input field IDs
const DURATION_INPUT_ID = "__input0-inner";
const TICKET_NUMBER_INPUT_ID = "__input1-inner";
const DESCRIPTION_INPUT_ID = "__area0-inner";
const PROJECT_INPUT_ID = "application-Timerecording-display-component---ViewAddEntry--productInput-inner";

const TEMPLATE_SELECTOR_ID = "templateSelectInput";

// Other specific IDs:
const PROJECT_SEARCH_INPUT_ID =
    "application-Timerecording-display-component---ViewAddEntryProject--selectDialog-searchField-I";
const PROJECT_SEARCH_CANCEL_BUTTON_ID =
    "application-Timerecording-display-component---ViewAddEntryProject--selectDialog-cancel-BDI-content";
const PROJECT_SEARCH_RESULT_LIST_ID =
    "application-Timerecording-display-component---ViewAddEntryProject--selectDialog-list-listUl";
const PROJECT_SEARCH_NO_DATA_LI_ID =
    "application-Timerecording-display-component---ViewAddEntryProject--selectDialog-list-nodata";

const KEY_DOWN_ENTER = new KeyboardEvent("keydown", {
    key: "Enter",
    code: "Enter",
    which: 13,
    keyCode: 13,
    bubbles: true,
    cancelable: true,
});
