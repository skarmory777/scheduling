export class ProfessionalService {
    constructor(
        public readonly id: string,
        public readonly professionalId: string,
        public readonly serviceId: string,
        public price: number,
        public durationInMinutes: number,
        public readonly createdAt: Date,
        public updatedAt: Date
    ) { }

    updateDetails(price: number, durationInMinutes: number) {
        this.price = price;
        this.durationInMinutes = durationInMinutes;
        this.updatedAt = new Date();
    }
}
