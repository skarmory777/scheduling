export interface Appointment {
    id: string;
    serviceId: string;
    serviceName?: string;
    clientId: string;
    clientName?: string;
    professionalId: string;
    professionalName?: string;
    date: string;
    startTime: string;
    endTime: string;
    status: 'SCHEDULED' | 'CANCELLED' | 'COMPLETED';
    cancelReason?: string | null;
    createdAt: Date;
}

export interface AvailableSlot {
    startTime: string;
    endTime: string;
    professionalId: string;
    professionalName: string;
}

export interface CreateAppointmentData {
    serviceId: string;
    date: string;
    startTime: string;
}

export interface CancelAppointmentData {
    cancelReason: string;
}