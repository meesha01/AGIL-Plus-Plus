/**
 * Class representing the data for an Employee
 * @class
 */
class Employee{
    employeeId;

    constructor( employeeId ) {
        this.employeeId = employeeId;
    }

    /**
     * Static factory method to create an Employee instance from active user data.
     * @static
     * @param {object} activeUser - The object returned from the GetActiveUser API call
     * @returns {Employee | null} A new Employee instance or null.
     */
    static createFromActiveUser(activeUser) {
        if(!activeUser){
            return null;
        }

        return new Employee(activeUser.EmployeeID);
    }
}
