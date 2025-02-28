/**
 * Class representing the data for a Project Entry in AGIL time
 * @class
 */
class ProjectEntry{
    duration; ticketNumber; description; projectId;

    constructor( duration, ticketNumber, description, projectId) {
        this.duration = duration || "";
        this.ticketNumber = ticketNumber || "";
        this.description = description || "";
        this.projectId = projectId || "";
    }
}
