import { User } from "./user.entity";

export class Professional {
    constructor(
        public readonly id: string,
        public userId: string,
        public user?: User,
        public isActive: boolean = true,
        public readonly createdAt: Date = new Date(),
        public updatedAt: Date = new Date()
    ) { }

    static create(
        userId: string,
        user?: User,
        isActive: boolean = true
    ): Professional {
        const id = crypto.randomUUID();
        return new Professional(
            id,
            userId,
            user,
            isActive,
            new Date(),
            new Date()
        );
    }

    update(data: Partial<Pick<Professional, 'isActive'>>): void {
        if (data.isActive !== undefined) {
            this.isActive = data.isActive;
        }
        this.updatedAt = new Date();
    }

    setUser(user: User): void {
        this.user = user;
        this.userId = user.id ? user.id : '';
        this.updatedAt = new Date();
    }

    deactivate(): void {
        this.isActive = false;
        this.updatedAt = new Date();
    }

    activate(): void {
        this.isActive = true;
        this.updatedAt = new Date();
    }
}
