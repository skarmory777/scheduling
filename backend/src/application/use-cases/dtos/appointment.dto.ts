export interface CreateAppointmentDTO {
    serviceId: string;
    clientId: string;
    date: string; // YYYY-MM-DD
    startTime: string; // HH:MM
}

export interface CancelAppointmentDTO {
    appointmentId: string;
    userId: string;
    cancelReason: string;
}

export interface AppointmentResponseDTO {
    id: string;
    serviceId: string;
    serviceName: string;
    clientId: string;
    clientName: string;
    professionalId: string;
    professionalName: string;
    date: string;
    startTime: string;
    endTime: string;
    status: string;
    cancelReason: string | null;
    createdAt: Date;
}

export interface CheckAvailabilityDTO {
    serviceId: string;
    date: string; // YYYY-MM-DD
}

export interface AvailableSlotDTO {
    startTime: string;
    endTime: string;
    professionalId: string;
    professionalName: string;
}
