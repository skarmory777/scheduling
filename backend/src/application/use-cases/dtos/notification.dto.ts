import { NotificationType } from '../../../core/domain/entities/notification.entity';

export interface CreateNotificationDTO {
    professionalId: string;
    appointmentId?: string;
    type: NotificationType;
    title: string;
    message: string;
}

export interface NotificationResponseDTO {
    id: string;
    professionalId: string;
    content: string;
    isRead: boolean;
    createdAt: Date;
}

export interface ListNotificationsByProfessionalDTO {
    professionalId: string;
    onlyUnread?: boolean;
}
