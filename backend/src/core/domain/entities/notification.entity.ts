export enum NotificationType {
    APPOINTMENT_CREATED = 'appointment_created',
    APPOINTMENT_CANCELLED = 'appointment_cancelled',
    APPOINTMENT_REMINDER = 'appointment_reminder',
}

export class Notification {
    constructor(
        public readonly id: string,
        public readonly professionalId: string,
        public readonly appointmentId: string | null,
        public readonly type: NotificationType,
        public title: string,
        public message: string,
        public isRead: boolean,
        public readonly createdAt: Date,
        public updatedAt: Date
    ) { }

    markAsRead() {
        this.isRead = true;
        this.updatedAt = new Date();
    }
}
