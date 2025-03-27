/**
 * Utility functions to help make API calls & process responses
 */

let STORED_BASE_URL = null;

/**
 * The Base URL for API requests is dynamic
 * This function looks for the URL in previous requests made by AGILTime, and returns it
 * Hence, it must be called after a few requests are expected to be sent by AGILTime
 * @return {String|null} - baseURL for the Time API or null if not found
 */
function getBaseURL() {

    if(STORED_BASE_URL!=null){
        return STORED_BASE_URL;
    }

    const networkResources = performance.getEntriesByType("resource");

    for (const resource of networkResources) {
        if(BASE_URL_PATTERN.test(resource.name)){
            const base_url_end = resource.name.search(BASE_URL_ENDPOINT);
            if (base_url_end>0) {
                const API_BASE_URL = resource.name.substring(0, base_url_end);
                STORED_BASE_URL = API_BASE_URL;
                console.debug("API Base URL: " + API_BASE_URL);
                return API_BASE_URL;
            }
        }
    }

    console.error("Could not find any resource with matching Base URL");
    throw new Error("Could not find any resource with matching Base URL");
}