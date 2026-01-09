import { Notification } from '../entities/notification.entity';

export interface INotificationRepository {
    create(notification: Notification): Promise<Notification>;
    findByProfessionalId(professionalId: string): Promise<Notification[]>;
    markAsRead(id: string): Promise<Notification | null>;
}
