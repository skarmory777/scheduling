export class Service {
    constructor(
        public readonly id: string,
        public name: string,
        public description: string | null,
        public duration: number, // em minutos
        public price: number,
        public isActive: boolean,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) {
        this.validate();
    }

    private validate(): void {
        if (this.duration <= 0) {
            throw new Error('Duração do serviço deve ser maior que zero');
        }
        if (this.price < 0) {
            throw new Error('Preço do serviço não pode ser negativo');
        }
    }

    activate(): void {
        this.isActive = true;
    }

    deactivate(): void {
        this.isActive = false;
    }
}
