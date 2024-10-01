import { AuthenticatedUser } from './shared'

declare module 'express' {
	export interface Request {
		authenticatedUser?: AuthenticatedUser
	}
}
