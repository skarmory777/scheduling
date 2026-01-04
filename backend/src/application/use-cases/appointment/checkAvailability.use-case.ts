import { empty } from "@prisma/client/runtime/library";
import { IAppointmentRepository } from "../../../core/domain/repositories/appointment.repository";
import { IServiceRepository } from "../../../core/domain/repositories/service.repository";
import { IUserRepository } from "../../../core/domain/repositories/user.repository";
import { AvailableSlotDTO, CheckAvailabilityDTO } from "../dtos/appointment.dto";

export class CheckAvailability {
  constructor(
    private appointmentRepository: IAppointmentRepository,
    private serviceRepository: IServiceRepository,
    private userRepository: IUserRepository
  ) { }

  async execute(data: CheckAvailabilityDTO): Promise<AvailableSlotDTO[]> {
    // 1. Validar serviço
    const service = await this.serviceRepository.findById(data.serviceId);
    if (!service) {
      throw new Error('Serviço não encontrado');
    }
    if (!service.isActive) {
      throw new Error('Serviço não está ativo');
    }

    // 2. Buscar profissionais
    const professionals = await this.userRepository.findProfessionals();
    if (professionals.length === 0) {
      return [];
    }

    // 3. Definir horários de trabalho (8h às 18h)
    const workStartHour = 8;
    const workEndHour = 18;
    const appointmentDate = new Date(data.date);

    // 4. Gerar slots disponíveis
    const availableSlots: AvailableSlotDTO[] = [];

    for (const professional of professionals) {
      // Buscar agendamentos existentes do profissional para a data
      const existingAppointments = await this.appointmentRepository.findByProfessionalAndDate(
        (professional.id) ? professional.id : "",
        appointmentDate
      );

      // Gerar todos os slots possíveis
      for (let hour = workStartHour; hour < workEndHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const startTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

          // Calcular endTime baseado na duração do serviço
          const endDate = new Date();
          endDate.setHours(hour, minute + service.duration, 0, 0);

          // Verificar se o horário de término ultrapassa o horário de trabalho
          if (endDate.getHours() > workEndHour ||
            (endDate.getHours() === workEndHour && endDate.getMinutes() > 0)) {
            continue;
          }

          const endTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;

          // Verificar conflito
          const hasConflict = await this.appointmentRepository.checkConflict(
            professional.id ? professional.id : "",
            appointmentDate,
            startTime,
            endTime
          );

          if (!hasConflict) {
            availableSlots.push({
              startTime,
              endTime,
              professionalId: professional.id ? professional.id : "",
              professionalName: professional.name
            });
          }
        }
      }
    }

    // 5. Ordenar por horário
    availableSlots.sort((a, b) => a.startTime.localeCompare(b.startTime));

    return availableSlots;
  }
}
