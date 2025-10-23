import { unwrapValue } from '../../shared/utils/value-object-unwrapper.js';

export class Meet {
    constructor({
                    meetingId = 0,
                    id = 0,
                    title = '',
                    description = '',
                    date = '',
                    day = '',
                    start = '',
                    end = '',
                    administratorId = null,
                    classroomId = null,
                    classroom = null,
                    administrator = null,
                    teachers = []
                }) {
        this.id = meetingId || id;
        this.meetingId = meetingId || id;
        this.title = title;
        this.description = description;
        this.date = date || day;
        this.day = day || date;
        this.start = start;
        this.end = end;
        this.administratorId = unwrapValue(administratorId);
        this.classroomId = unwrapValue(classroomId);
        this.classroom = classroom;
        this.administrator = administrator;
        this.teachers = teachers || [];
    }
}