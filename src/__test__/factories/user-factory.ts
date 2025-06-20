import { faker } from "@faker-js/faker"
import type { User, LoginRequest } from "../../types/auth"

export class UserFactory {
    static create(overrides: Partial<User> = {}): User {
        return {
            username: faker.internet.userName(),
            email: faker.internet.email(),
            ...overrides,
        }
    }

    static createAdmin(overrides: Partial<User> = {}): User {
        return this.create({
            username: "admin",
            email: "admin@aryon.com",
            ...overrides,
        })
    }

    static createLoginRequest(overrides: Partial<LoginRequest> = {}): LoginRequest {
        return {
            username: faker.internet.userName(),
            password: faker.internet.password(),
            ...overrides,
        }
    }

    static createValidLoginRequest(): LoginRequest {
        return {
            username: "admin",
            password: "password123",
        }
    }

    static createInvalidLoginRequest(): LoginRequest {
        return {
            username: "invalid",
            password: "wrong",
        }
    }
}
