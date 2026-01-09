import { PrismaClient } from '@prisma/client';
import { INotificationRepository } from '../../../core/domain/repositories/notification.repository';
import { Notification, NotificationType } from '../../../core/domain/entities/notification.entity';

export class PrismaNotificationRepository implements INotificationRepository {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async create(notification: Notification): Promise<Notification> {
        const data = await this.prisma.notification.create({
            data: {
                id: notification.id,
                professionalId: notification.professionalId,
                appointmentId: notification.appointmentId,
                type: notification.type,
                title: notification.title,
                message: notification.message,
                isRead: notification.isRead,
                createdAt: notification.createdAt,
                updatedAt: notification.updatedAt,
            },
        });

        return new Notification(
            data.id,
            data.professionalId,
            data.appointmentId,
            data.type as NotificationType,
            data.title,
            data.message,
            data.isRead,
            data.createdAt,
            data.updatedAt
        );
    }

    async findByProfessionalId(professionalId: string, onlyUnread?: boolean): Promise<Notification[]> {
        const whereClause: any = { professionalId };
        if (onlyUnread) {
            whereClause.isRead = false;
        }

        const data = await this.prisma.notification.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
        });

        return data.map(
            (item) =>
                new Notification(
                    item.id,
                    item.professionalId,
                    item.appointmentId,
                    item.type as NotificationType,
                    item.title,
                    item.message,
                    item.isRead,
                    item.createdAt,
                    item.updatedAt
                )
        );
    }

    async markAsRead(id: string): Promise<Notification | null> {
        const data = await this.prisma.notification.update({
            where: { id },
            data: { isRead: true, updatedAt: new Date() },
        });

        return new Notification(
            data.id,
            data.professionalId,
            data.appointmentId,
            data.type as NotificationType,
            data.title,
            data.message,
            data.isRead,
            data.createdAt,
            data.updatedAt
        );
    }
}
