/**
 * All the API call functions that interact with the SAP backend
 */

/**
 * Returns data about the currently active user
 * Expected response:
 * {
 *     "@odata.context": "$metadata#Employees/$entity",
 *     "CompanyCode": "Code",
 *     "FullName": "Name",
 *     "EmailAddress": "email",
 *     "CompanyID": "Company",
 *     "HRRelevant": true|false,
 *     "HREmployeeID": "ID",
 *     "EmployeeID": "ID",
 *     "WorkAgreement": "Some Number"
 * }
 * @returns {Promise<void>}
 */
async function getActiveUser(){
    try {
        const response = await fetch(
            BASE_URL+"/time/GetActiveUser(EmployeeID='')", {
                method: "GET",
                headers: COMMON_REQUEST_HEADERS,
                COMMON_PARAMS: COMMON_REQUEST_PARAMS
            },
        );

        if(!response.ok){
            console.error(
                "GetActiveUser returned non-success code: ", response.status,
                "Message: ", response.statusText
            );
            return null;
        }

        const activeUserData = await response.json();
        if(!activeUserData)
            return null;

        console.debug("Employee ID: " + activeUserData.EmployeeID)
        return activeUserData;
    } catch (error) {
        console.error("Error occurred while trying to call GetActiveUser", error);
    }
}