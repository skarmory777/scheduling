import { Appointment, AppointmentStatus } from "../../../core/domain/entities/appointment.entity";
import { IAppointmentRepository } from "../../../core/domain/repositories/appointment.repository";
import { IServiceRepository } from "../../../core/domain/repositories/service.repository";
import { IUserRepository } from "../../../core/domain/repositories/user.repository";
import { CreateAppointmentDTO } from "../dtos/appointment.dto";

export class CreateAppointment {
  constructor(
    private appointmentRepository: IAppointmentRepository,
    private serviceRepository: IServiceRepository,
    private userRepository: IUserRepository
  ) { }

  async execute(data: CreateAppointmentDTO): Promise<Appointment> {
    // 1. Validar serviço
    const service = await this.serviceRepository.findById(data.serviceId);
    if (!service) {
      throw new Error('Serviço não encontrado');
    }
    if (!service.isActive) {
      throw new Error('Serviço não está ativo');
    }

    // 2. Validar cliente
    const client = await this.userRepository.findById(data.clientId);
    if (!client) {
      throw new Error('Cliente não encontrado');
    }
    if (!client.isClient()) {
      throw new Error('Usuário não é um cliente');
    }

    // 3. Calcular horário de término
    const [hours, minutes] = data.startTime.split(':').map(Number);
    const endDate = new Date();
    endDate.setHours(hours, minutes + service.duration, 0, 0);
    const endTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;

    // 4. Buscar profissional disponível
    const professionals = await this.userRepository.findProfessionals();
    if (professionals.length === 0) {
      throw new Error('Nenhum profissional disponível');
    }

    // Verificar disponibilidade de cada profissional
    const appointmentDate = new Date(data.date);
    let availableProfessional = null;

    for (const professional of professionals) {
      const hasConflict = await this.appointmentRepository.checkConflict(
        professional.id ? professional.id : "",
        appointmentDate,
        data.startTime,
        endTime
      );

      if (!hasConflict) {
        availableProfessional = professional;
        break;
      }
    }

    if (!availableProfessional) {
      throw new Error('Nenhum profissional disponível para este horário');
    }

    if (!availableProfessional.id) {
      throw new Error('Nenhum profissional disponível para este horário');
    }

    // 5. Criar agendamento
    const appointment = await this.appointmentRepository.create(
      new Appointment(
        crypto.randomUUID(),
        data.serviceId,
        data.clientId,
        appointmentDate,
        data.startTime,
        endTime,
        AppointmentStatus.SCHEDULED,
        null,
        new Date(),
        new Date(),
        availableProfessional.id
      )
    );

    return appointment;
    //return null as any;
  }
}
