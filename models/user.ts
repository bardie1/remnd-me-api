import { UserRole } from "./userRole";

export class User {
    constructor(newUser: User){
        this.id = newUser.id;
        this.externalRef = newUser.externalRef;
        this.username = newUser.username;
        this.password = newUser.password;
        this.role = newUser.role;
        this.createdAt = newUser.createdAt;
        this.updatedAt = newUser.updatedAt;
    }

    id: number;
    externalRef: string;
    username: string;
    password: string;
    role: UserRole;
    createdAt: string | null;
    updatedAt: string | null;

    public static dloToDto(dloUser: any): User {
        let role: UserRole;
        if (dloUser.role === 'admin') {
            role = UserRole.ADMIN;
        } else if (dloUser.role === "super") {
            role = UserRole.SUPER;
        } else {
            role = UserRole.NORMAL;
        }
        return new User({
            id: dloUser.id,
            externalRef: dloUser.external_ref,
            username: dloUser.username,
            password: dloUser.password,
            role: role,
            createdAt: dloUser.created_at,
            updatedAt: dloUser.updated_at
        });
    }
}