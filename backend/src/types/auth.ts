export interface AuthenticatedUser {
    name: string;
    picture: string;
    email: string;
    user_id: string;
    auth_time: number;
}