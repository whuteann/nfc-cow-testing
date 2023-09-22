import { User } from "./User";

export type Auth = {
	user: User | null,
	provider?: string | null
}
