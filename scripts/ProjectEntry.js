/*
    Class that encapsulates Project entry data
 */

class ProjectEntry{
    duration; ticketNumber; description; project;

    constructor( duration, ticketNumber, description, project) {
        this.duration = duration || "";
        this.ticketNumber = ticketNumber || "";
        this.description = description || "";
        this.project = project || "";
    }
}
