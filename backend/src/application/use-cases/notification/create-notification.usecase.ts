import crypto from 'crypto';
import { Notification } from '../../../core/domain/entities/notification.entity';
import { INotificationRepository } from '../../../core/domain/repositories/notification.repository';
import { IUserRepository } from '../../../core/domain/repositories/user.repository';
import { IAppointmentRepository } from '../../../core/domain/repositories/appointment.repository';
import { CreateNotificationDTO } from '../dtos/notification.dto';

export class CreateNotificationUseCase {
    constructor(
        private notificationRepository: INotificationRepository,
        private userRepository: IUserRepository,
        private appointmentRepository?: IAppointmentRepository
    ) { }

    async execute(data: CreateNotificationDTO): Promise<Notification> {
        // 1. Validar profissional
        const professional = await this.userRepository.findById(data.professionalId);
        if (!professional) {
            throw new Error('Profissional não encontrado');
        }

        if (!professional.isProfessional()) {
            throw new Error('Usuário não é um profissional');
        }

        // 2. Validar agendamento (opcional)
        if (data.appointmentId && this.appointmentRepository) {
            const appointment = await this.appointmentRepository.findById(
                data.appointmentId
            );

            if (!appointment) {
                throw new Error('Agendamento não encontrado');
            }
        }

        // 3. Criar notificação
        const now = new Date();

        const notification = new Notification(
            crypto.randomUUID(),
            data.professionalId,
            data.appointmentId ?? null,
            data.type,
            data.title,
            data.message,
            false,
            now,
            now
        );

        // 4. Persistir
        return this.notificationRepository.create(notification);
    }
}
