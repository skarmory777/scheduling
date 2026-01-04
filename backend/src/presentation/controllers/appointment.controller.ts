import { Request, Response, NextFunction } from 'express';
import { AppointmentPrismaRepository } from '../../infrastructure/database/repositories/prisma.appointment.repository';
import { ServicePrismaRepository } from '../../infrastructure/database/repositories/prisma.services.repository';
import { UserPrismaRepository } from '../../infrastructure/database/repositories/user.prisma.repository';
import { CheckAvailability } from '../../application/use-cases/appointment/checkAvailability.use-case';
import { CancelAppointment } from '../../application/use-cases/appointment/cancelAppointment.use-case';
import { CreateAppointment } from '../../application/use-cases/appointment/createAppointment.use-case';
import { AuthRequest } from '../../infrastructure/auth/jwt.guard';

export class AppointmentController {
  private appointmentRepository: AppointmentPrismaRepository;
  private serviceRepository: ServicePrismaRepository;
  private userRepository: UserPrismaRepository;

  constructor() {
    this.appointmentRepository = new AppointmentPrismaRepository();
    this.serviceRepository = new ServicePrismaRepository();
    this.userRepository = new UserPrismaRepository();
  }

  async checkAvailability(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const { serviceId, date } = req.query;

      if (!serviceId || !date) {
        return res.status(400).json({ error: 'serviceId e date são obrigatórios' });
      }

      const checkAvailability = new CheckAvailability(
        this.appointmentRepository,
        this.serviceRepository,
        this.userRepository
      );

      const availableSlots = await checkAvailability.execute({
        serviceId: serviceId as string,
        date: date as string
      });

      return res.status(200).json(availableSlots);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async create(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const { serviceId, date, startTime } = req.body;
      const clientId = req.user?.userId;

      if (!clientId) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      const createAppointment = new CreateAppointment(
        this.appointmentRepository,
        this.serviceRepository,
        this.userRepository
      );

      const appointment = await createAppointment.execute({
        serviceId,
        clientId,
        date,
        startTime
      });

      // Buscar dados completos para resposta
      const service = await this.serviceRepository.findById(appointment.serviceId);
      const client = await this.userRepository.findById(appointment.clientId);
      const professional = await this.userRepository.findById(appointment.professionalId || "");

      return res.status(201).json({
        id: appointment.id,
        serviceId: appointment.serviceId,
        serviceName: service?.name,
        clientId: appointment.clientId,
        clientName: client?.name,
        professionalId: appointment.professionalId,
        professionalName: professional?.name,
        date: appointment.date.toISOString().split('T')[0],
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: appointment.status,
        createdAt: appointment.createdAt
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async listByUser(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.userId;
      const userRole = req.user?.role;

      if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      let appointments;
      if (userRole === 'PROFESSIONAL') {
        appointments = await this.appointmentRepository.findByProfessionalId(userId);
      } else {
        appointments = await this.appointmentRepository.findByClientId(userId);
      }

      // Buscar dados completos
      const appointmentsWithDetails = await Promise.all(
        appointments.map(async appointment => {
          const service = await this.serviceRepository.findById(appointment.serviceId);
          const client = await this.userRepository.findById(appointment.clientId);
          const professional = await this.userRepository.findById(appointment.professionalId || "");

          return {
            id: appointment.id,
            serviceId: appointment.serviceId,
            serviceName: service?.name,
            clientId: appointment.clientId,
            clientName: client?.name,
            professionalId: appointment.professionalId,
            professionalName: professional?.name,
            date: appointment.date.toISOString().split('T')[0],
            startTime: appointment.startTime,
            endTime: appointment.endTime,
            status: appointment.status,
            cancelReason: appointment.cancelReason,
            createdAt: appointment.createdAt
          };
        })
      );

      return res.status(200).json(appointmentsWithDetails);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async cancel(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { cancelReason } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
      }

      const cancelAppointment = new CancelAppointment(this.appointmentRepository);

      const appointment = await cancelAppointment.execute({
        appointmentId: id,
        userId,
        cancelReason
      });

      return res.status(200).json({
        id: appointment.id,
        status: appointment.status,
        cancelReason: appointment.cancelReason
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
