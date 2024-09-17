import { AuthenticatedUser } from './auth';

declare module 'express' {
    export interface Request {
        authenticatedUser?: AuthenticatedUser;
    }
}
