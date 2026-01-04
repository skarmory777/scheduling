export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export class Appointment {
  constructor(
    public readonly id: string,
    public readonly serviceId: string,
    public readonly clientId: string,
    public readonly date: Date,
    public readonly startTime: string,
    public readonly endTime: string,
    public status: AppointmentStatus,
    public cancelReason: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly professionalId?: string
  ) { }

  canBeCancelled(): boolean {
    return this.status === AppointmentStatus.SCHEDULED;
  }

  cancel(reason: string): void {
    if (!this.canBeCancelled()) {
      throw new Error('Apenas agendamentos com status SCHEDULED podem ser cancelados');
    }

    // Validar prazo mínimo de 24 horas
    const appointmentDateTime = this.getAppointmentDateTime();
    const now = new Date();
    const hoursDifference = (appointmentDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursDifference < 3) {
      throw new Error('Cancelamento deve ser feito com no mínimo 3 horas de antecedência');
    }

    this.status = AppointmentStatus.CANCELLED;
    this.cancelReason = reason;
  }

  complete(): void {
    if (this.status !== AppointmentStatus.SCHEDULED) {
      throw new Error('Apenas agendamentos com status SCHEDULED podem ser concluídos');
    }
    this.status = AppointmentStatus.COMPLETED;
  }

  private getAppointmentDateTime(): Date {
    const [hours, minutes] = this.startTime.split(':').map(Number);
    const dateTime = new Date(this.date);
    dateTime.setHours(hours, minutes, 0, 0);
    return dateTime;
  }

  isScheduled(): boolean {
    return this.status === AppointmentStatus.SCHEDULED;
  }

  isCancelled(): boolean {
    return this.status === AppointmentStatus.CANCELLED;
  }

  isCompleted(): boolean {
    return this.status === AppointmentStatus.COMPLETED;
  }
}
