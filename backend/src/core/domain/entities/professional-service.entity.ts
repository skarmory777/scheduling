export class ProfessionalService {
    constructor(
        public readonly id: string,
        public readonly professionalId: string,
        public readonly serviceId: string,
        public readonly createdAt: Date = new Date(),
        public updatedAt: Date = new Date()
    ) { }

    static create(
        professionalId: string,
        serviceId: string
    ): ProfessionalService {
        const id = crypto.randomUUID();
        return new ProfessionalService(
            id,
            professionalId,
            serviceId,
            new Date(),
            new Date()
        );
    }
}