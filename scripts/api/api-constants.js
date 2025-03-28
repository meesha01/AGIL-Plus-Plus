/**MobileWorking
 * Constants for making / processing API requests
 */

const BASE_URL_PATTERN =
    /https:\/\/actesprd\.launchpad\.cfapps\.eu10\.hana\.ondemand\.com\/.*\.AGILTimeManagerservice\.timerecording\/.*\/odata\/v4\/time\/\$batch/gm;

const BASE_URL_ENDPOINT = /\/\$batch/gm;

const COMMON_REQUEST_HEADERS = {
    accept: "application/json;odata.metadata=minimal",
    "x-csrf-token": "Fetch",
};

const COMMON_REQUEST_PARAMS = {
    credentials: "include",
    mode: "cors"
};

const WORKPLACE = {
    MOBILE: {
        label:"Mobile working",
        value:"MobileWorking"
    },
    OFFICE: {
        label: "In office",
        value: "Office"
    },
    CUSTOMER: {
        label: "Customer visit",
        value: "CustomerVisit"
    }
}