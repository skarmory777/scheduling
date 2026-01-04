import { Appointment } from "../../../core/domain/entities/appointment.entity";
import { IAppointmentRepository } from "../../../core/domain/repositories/appointment.repository";
import { CancelAppointmentDTO } from "../dtos/appointment.dto";

export class CancelAppointment {
  constructor(private appointmentRepository: IAppointmentRepository) { }

  async execute(data: CancelAppointmentDTO): Promise<Appointment> {
    // 1. Buscar agendamento
    const appointment = await this.appointmentRepository.findById(data.appointmentId);
    if (!appointment) {
      throw new Error('Agendamento não encontrado');
    }

    // 2. Validar se o usuário é o dono do agendamento
    if (appointment.clientId !== data.userId) {
      throw new Error('Você não tem permissão para cancelar este agendamento');
    }

    // 3. Validar motivo do cancelamento
    if (!data.cancelReason || data.cancelReason.trim().length === 0) {
      throw new Error('Motivo do cancelamento é obrigatório');
    }

    // 4. Cancelar agendamento (validações de regra de negócio estão na entidade)
    appointment.cancel(data.cancelReason);

    // 5. Atualizar no repositório
    const updatedAppointment = await this.appointmentRepository.update(appointment);

    return updatedAppointment;
  }
}
