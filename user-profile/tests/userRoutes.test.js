const request = require('supertest');
const app = require('../src/app');
const db = require('../src/config/db');

describe('User API', () => {
    let userId;

    afterAll(async () => {
        await db.query('DELETE FROM users');
        await db.end();
    });

    test('POST /api/users → create new user', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                age: 30
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe('Test User');
        userId = res.body.id;
    });

    test('GET /api/users → get all users', async () => {
        const res = await request(app).get('/api/users');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });

    test('GET /api/users/:id → get specific user', async () => {
        const res = await request(app).get(`/api/users/${userId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id', userId);
    });

    test('PUT /api/users/:id → update user', async () => {
        const res = await request(app)
            .put(`/api/users/${userId}`)
            .send({
                name: 'Updated User',
                email: 'updated@example.com',
                age: 35
            });
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe('Updated User');
    });

    test('DELETE /api/users/:id → delete user', async () => {
        const res = await request(app).delete(`/api/users/${userId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message');
    });
});
