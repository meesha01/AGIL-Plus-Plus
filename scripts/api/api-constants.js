/**
 * Constants for making / processing API requests
 */

const BASE_URL =
    "https://actesprd.launchpad.cfapps.eu10.hana.ondemand.com/36b3ed5a-f7c5-4639-8016-937430143bf3.AGILTimeManagerservice.timerecording/~c7a802a6-ef2f-4be5-b77e-3b61d0aeb2d3~/odata/v4"

const COMMON_REQUEST_HEADERS = {
    accept: "application/json;odata.metadata=minimal",
    "x-csrf-token": "Fetch",
};

const COMMON_REQUEST_PARAMS = {
    credentials: "include",
    mode: "cors"
};