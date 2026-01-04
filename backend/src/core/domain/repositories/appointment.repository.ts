import { Appointment } from '../entities/appointment.entity';

export interface IAppointmentRepository {
  findById(id: string): Promise<Appointment | null>;
  findByClientId(clientId: string): Promise<Appointment[]>;
  findByProfessionalId(professionalId: string): Promise<Appointment[]>;
  findByProfessionalAndDate(professionalId: string, date: Date): Promise<Appointment[]>;
  create(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment>;
  update(appointment: Appointment): Promise<Appointment>;
  checkConflict(professionalId: string, date: Date, startTime: string, endTime: string): Promise<boolean>;
}
