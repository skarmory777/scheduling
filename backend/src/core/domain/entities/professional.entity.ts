export class Professional {
    constructor(
        public readonly id: string,
        public readonly userId: string,
        public bio: string | null,
        public specialization: string | null,
        public isActive: boolean,
        public readonly createdAt: Date,
        public updatedAt: Date
    ) { }

    deactivate() {
        this.isActive = false;
        this.updatedAt = new Date();
    }
}
