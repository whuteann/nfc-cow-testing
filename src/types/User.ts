import { UserRole } from "./Common";

export type User = {
	id: string,
	avatar?: string,
	firstName?: string,
	lastName?: string,
	email: string,
	name?: string,
	role?: UserRole,
	permission?: string[],
	joinedAt?: string
}

export type UserStatus = 'Active' | 'Inactive';