import { PrismaClient } from '@prisma/client';
import { IAppointmentRepository } from '../../../core/domain/repositories/appointment.repository';
import { Appointment, AppointmentStatus } from '../../../core/domain/entities/appointment.entity';

export class AppointmentPrismaRepository implements IAppointmentRepository {
  //constructor(private prisma: PrismaClient) { }
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findById(id: string): Promise<Appointment | null> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id }
    });

    if (!appointment) return null;

    return new Appointment(
      appointment.id,
      appointment.serviceId,
      appointment.clientId,
      appointment.date,
      appointment.startTime,
      appointment.endTime,
      appointment.status as AppointmentStatus,
      appointment.cancelReason,
      appointment.createdAt,
      appointment.updatedAt,
      appointment.professionalId
    );
  }

  async findByClientId(clientId: string): Promise<Appointment[]> {
    const appointments = await this.prisma.appointment.findMany({
      where: { clientId },
      orderBy: [{ date: 'desc' }, { startTime: 'desc' }]
    });

    return appointments.map(
      appointment =>
        new Appointment(
          appointment.id,
          appointment.serviceId,
          appointment.clientId,
          appointment.date,
          appointment.startTime,
          appointment.endTime,
          appointment.status as AppointmentStatus,
          appointment.cancelReason,
          appointment.createdAt,
          appointment.updatedAt,
          appointment.professionalId
        )
    );
  }

  async findByProfessionalId(professionalId: string): Promise<Appointment[]> {
    const appointments = await this.prisma.appointment.findMany({
      where: { professionalId },
      orderBy: [{ date: 'desc' }, { startTime: 'desc' }]
    });

    return appointments.map(
      appointment =>
        new Appointment(
          appointment.id,
          appointment.serviceId,
          appointment.clientId,
          appointment.date,
          appointment.startTime,
          appointment.endTime,
          appointment.status as AppointmentStatus,
          appointment.cancelReason,
          appointment.createdAt,
          appointment.updatedAt,
          appointment.professionalId
        )
    );
  }

  async findByProfessionalAndDate(professionalId: string, date: Date): Promise<Appointment[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await this.prisma.appointment.findMany({
      where: {
        professionalId,
        date: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: 'SCHEDULED'
      },
      orderBy: { startTime: 'asc' }
    });

    return appointments.map(
      appointment =>
        new Appointment(
          appointment.id,
          appointment.serviceId,
          appointment.clientId,
          appointment.date,
          appointment.startTime,
          appointment.endTime,
          appointment.status as AppointmentStatus,
          appointment.cancelReason,
          appointment.createdAt,
          appointment.updatedAt,
          appointment.professionalId
        )
    );
  }

  async create(data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment> {
    if (!data.professionalId) {
      throw new Error('professionalId é obrigatório para criar um agendamento');
    }

    const appointment = await this.prisma.appointment.create({
      data: {
        serviceId: data.serviceId,
        clientId: data.clientId,
        professionalId: data.professionalId,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        status: data.status,
        cancelReason: data.cancelReason
      }
    });

    return new Appointment(
      appointment.id,
      appointment.serviceId,
      appointment.clientId,
      appointment.date,
      appointment.startTime,
      appointment.endTime,
      appointment.status as AppointmentStatus,
      appointment.cancelReason,
      appointment.createdAt,
      appointment.updatedAt,
      appointment.professionalId
    );
  }

  async update(appointmentData: Appointment): Promise<Appointment> {
    const appointment = await this.prisma.appointment.update({
      where: { id: appointmentData.id },
      data: {
        status: appointmentData.status,
        cancelReason: appointmentData.cancelReason
      }
    });

    return new Appointment(
      appointment.id,
      appointment.serviceId,
      appointment.clientId,
      appointment.date,
      appointment.startTime,
      appointment.endTime,
      appointment.status as AppointmentStatus,
      appointment.cancelReason,
      appointment.createdAt,
      appointment.updatedAt,
      appointment.professionalId
    );
  }

  async checkConflict(
    professionalId: string,
    date: Date,
    startTime: string,
    endTime: string
  ): Promise<boolean> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const conflictingAppointments = await this.prisma.appointment.findMany({
      where: {
        professionalId,
        date: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: 'SCHEDULED',
        OR: [
          {
            AND: [{ startTime: { lte: startTime } }, { endTime: { gt: startTime } }]
          },
          {
            AND: [{ startTime: { lt: endTime } }, { endTime: { gte: endTime } }]
          },
          {
            AND: [{ startTime: { gte: startTime } }, { endTime: { lte: endTime } }]
          }
        ]
      }
    });

    return conflictingAppointments.length > 0;
  }
}
