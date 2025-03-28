/**
 * All the API call functions that interact with the SAP backend
 */

let employee = null;

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
 *     "WorkAgreement": "Some-Number"
 * }
 * @returns {Promise<Employee|null>}
 * @param forceReload - Ignores stored employee data when true. Default false.
 */
async function getEmployeeData(forceReload=false){

    if(employee && !forceReload){
        return employee;
    }

    const BASE_URL = getBaseURL();

    const response = await fetch(
        BASE_URL+"/GetActiveUser(EmployeeID='')", {
            method: "GET",
            headers: COMMON_REQUEST_HEADERS,
            COMMON_REQUEST_PARAMS
        },
    );

    if(!response.ok){
        console.error(
            "GetActiveUser returned non-success code: ", response.status,
            "Message: ", response.statusText
        );
        throw new Error("GetActiveUser returned non-success code");
    }

    const activeUserData = await response.json();
    if(!activeUserData){
        throw new Error("activeUserData is null");
    }

    employee = Employee.createFromActiveUser(activeUserData);
    return employee;
}

/**
 *
 * @param {Date} recordDate - The date for which this time will be saved. Format- "yyyy-mm-dd" , Eg - "2025-03-26"
 * @param {String} startTime - Format - "hh:mm:ss", Eg - "08:00:00"
 * @param {String} endTime - Format - "hh:mm:ss", Eg - "08:00:00"
 * @param workplace - MobileWorking, Office, CustomerVisit . Use the WORKPLACE constant
 * @returns {Promise<null>}
 */
async function savePresenceTime(recordDate, startTime, endTime, workplace=WORKPLACE.MOBILE.value){

    try {
        const BASE_URL = getBaseURL();

        const employee = await getEmployeeData();

        const body = {
            "EmployeeID": employee.employeeId,
            "RecordDate": formatDateYYYYMMDD(recordDate),
            "Category":"Presence",
            "Workplace":workplace,
            "Offset": (new Date()).getTimezoneOffset(),
            "StartTime": startTime,
            "EndTime": endTime
        };

        const response = await fetch(BASE_URL + "/PresenceTimeRecords", {
            "headers": {
                ...COMMON_REQUEST_HEADERS,
                "Content-Type": "application/json;charset=UTF-8",
            },
            COMMON_REQUEST_PARAMS,
            "method": "POST",
            "body": JSON.stringify(body),
        });

        if(!response.ok){
            throw new Error("POST PresenceTimeRecords returned non-success code");
        }
    } catch (error) {
        console.error("Error while saving presence time.", error);
        throw error;
    }
}
