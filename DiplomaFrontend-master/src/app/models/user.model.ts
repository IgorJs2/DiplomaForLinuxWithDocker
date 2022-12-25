export class User {
    public id?: number;
    public username?: string;
    public email?: string;

    constructor(init?: Partial<User>) {
        Object.assign(this, init);
    }
}
