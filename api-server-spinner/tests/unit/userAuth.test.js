const request = require('supertest');
const app = require('../../index'); // Ensure your Express app is correctly exported
const { prisma } = require('../../utils/prismaClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


jest.mock('../../utils/prismaClient', () => ({
    prisma: {
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
    },
}));

jest.mock('bcrypt', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
}));

describe("Auth Controller", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Register User", () => {
        it("should register a new user successfully", async () => {
            const mockUser = { id: 1, email: "test@example.com", password: "hashedpassword", name: "Test User" };
            prisma.user.findUnique.mockResolvedValue(null); // No existing user
            bcrypt.hash.mockResolvedValue("hashedpassword");
            prisma.user.create.mockResolvedValue(mockUser);

            const response = await request(app).post("/api/auth/register").send({
                email: "test@example.com",
                password: "password123",
                name: "Test User",
            });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.email).toBe("test@example.com");
            expect(prisma.user.create).toHaveBeenCalled();
        });
    });

    it("should return error if email is already registered", async () => {
        prisma.user.findUnique.mockResolvedValue({ email: "test@example.com" });

        const response = await request(app).post("/api/auth/register").send({
            email: "test@example.com",
            password: "password123",
            name: "Test User",
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("User already exists");
    });

    it("should return validation error if email/password is missing", async () => {
        const response = await request(app).post("/api/auth/register").send({
            name: "Test User",
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Email and password are required");
    });

    it("should return validation error if email/password is missing", async () => {
        const response = await request(app).post("/api/auth/register").send({
            name: "Test User",
        });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Email and password are required");
    });

    describe("Login User", () => {
        it("should log in user successfully and return a token", async () => {
            const mockUser = { id: 1, email: "test@example.com", password: "hashedpassword", role: "user" };

            prisma.user.findUnique.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue("mocked_jwt_token");

            const response = await request(app).post("/api/auth/login").send({
                email: "test@example.com",
                password: "password123",
            });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.token).toBe("mocked_jwt_token");
        });

        it("should return error for invalid credentials", async () => {
            prisma.user.findUnique.mockResolvedValue(null);

            const response = await request(app).post("/api/auth/login").send({
                email: "invalid@example.com",
                password: "wrongpassword",
            });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe("Invalid credentials");
        });

        it("should return error for incorrect password", async () => {
            prisma.user.findUnique.mockResolvedValue({ email: "test@example.com", password: "hashedpassword" });
            bcrypt.compare.mockResolvedValue(false);

            const response = await request(app).post("/api/auth/login").send({
                email: "test@example.com",
                password: "wrongpassword",
            });

            expect(response.status).toBe(401);
            expect(response.body.error).toBe("Invalid credentials");
        });
    });

})