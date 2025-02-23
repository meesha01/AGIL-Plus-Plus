/*
    Class that encapsulates Project entry data
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
