const { v4: uuidv4 } = require('uuid');
const UserService = require('../src/services/userService');
const db = require('../src/config/db');

jest.mock('uuid');
jest.mock('../src/config/db');

describe('User Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createUser', () => {
        it('should create a new user', async () => {
            const mockUuid = '123e4567-e89b-12d3-a456-426614174000';
            uuidv4.mockReturnValue(mockUuid);

            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                age: 30
            };

            const mockResult = {
                rows: [{
                    id: mockUuid,
                    name: 'John Doe',
                    email: 'john@example.com',
                    age: 30,
                    created_at: '2023-04-01T10:20:30Z',
                    updated_at: '2023-04-01T10:20:30Z'
                }]
            };

            db.query.mockResolvedValue(mockResult);

            const result = await UserService.createUser(userData);

            expect(db.query).toHaveBeenCalled();
            expect(result).toEqual(mockResult.rows[0]);
        });
    });

    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const mockUsers = {
                rows: [
                    { id: '1', name: 'User One' },
                    { id: '2', name: 'User Two' }
                ]
            };

            db.query.mockResolvedValue(mockUsers);

            const result = await UserService.getAllUsers();

            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT * FROM users')
            );
            expect(result).toEqual(mockUsers.rows);
        });
    });

    describe('getUserById', () => {
        it('should return a user when valid ID is provided', async () => {
            const userId = '123e4567-e89b-12d3-a456-426614174000';
            const mockUser = {
                rows: [{
                    id: userId,
                    name: 'John Doe',
                    email: 'john@example.com'
                }]
            };

            db.query.mockResolvedValue(mockUser);

            const result = await UserService.getUserById(userId);

            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT * FROM users WHERE id = $1'),
                [userId]
            );
            expect(result).toEqual(mockUser.rows[0]);
        });

        it('should return null when user does not exist', async () => {
            const userId = 'non-existent-id';
            const mockEmptyResult = {
                rows: []
            };

            db.query.mockResolvedValue(mockEmptyResult);

            const result = await UserService.getUserById(userId);

            expect(result).toBeNull();
        });
    });

    describe('updateUser', () => {
        it('should update a user when valid ID and data are provided', async () => {
            const userId = '123e4567-e89b-12d3-a456-426614174000';
            const updateData = {
                name: 'Updated Name',
                age: 35
            };

            const mockResult = {
                rows: [{
                    id: userId,
                    name: 'Updated Name',
                    email: 'john@example.com',
                    age: 35,
                    created_at: '2023-04-01T10:20:30Z',
                    updated_at: '2023-04-02T15:30:45Z'
                }]
            };

            db.query.mockResolvedValueOnce({
                rows: [{ id: userId, name: 'John Doe', email: 'john@example.com', age: 30 }]
            });

            db.query.mockResolvedValueOnce(mockResult);

            const result = await UserService.updateUser(userId, updateData);

            expect(db.query).toHaveBeenCalledTimes(2);
            expect(db.query).toHaveBeenNthCalledWith(
                2,
                expect.stringContaining('UPDATE users'),
                expect.arrayContaining([userId])
            );
            expect(result).toEqual(mockResult.rows[0]);
        });

        it('should return null when updating a non-existent user', async () => {
            const userId = 'non-existent-id';
            const updateData = {
                name: 'Updated Name'
            };

            db.query.mockResolvedValueOnce({ rows: [] });

            const result = await UserService.updateUser(userId, updateData);

            expect(db.query).toHaveBeenCalledTimes(1);
            expect(result).toBeNull();
        });

        it('should throw an error when validation fails', async () => {
            const userId = '123e4567-e89b-12d3-a456-426614174000';
            const invalidData = {
                name: 'A', // too short
                age: 200 // exceeds maximum
            };

            await expect(UserService.updateUser(userId, invalidData))
                .rejects
                .toThrow();

            expect(db.query).not.toHaveBeenCalled();
        });
    });

    describe('deleteUser', () => {
        it('should delete a user when valid ID is provided', async () => {
            const userId = '123e4567-e89b-12d3-a456-426614174000';

            const mockResult = {
                rowCount: 1
            };

            db.query.mockResolvedValue(mockResult);

            const result = await UserService.deleteUser(userId);

            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('DELETE FROM users WHERE id = $1'),
                [userId]
            );
            expect(result).toBe(true);
        });

        it('should return false when deleting a non-existent user', async () => {
            const userId = 'non-existent-id';

            const mockResult = {
                rowCount: 0
            };

            db.query.mockResolvedValue(mockResult);

            const result = await UserService.deleteUser(userId);

            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('DELETE FROM users WHERE id = $1'),
                [userId]
            );
            expect(result).toBe(false);
        });

        it('should handle database errors properly', async () => {
            const userId = '123e4567-e89b-12d3-a456-426614174000';

            const dbError = new Error('Database connection lost');
            db.query.mockRejectedValue(dbError);

            await expect(UserService.deleteUser(userId))
                .rejects
                .toThrow('Database connection lost');

            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('DELETE FROM users WHERE id = $1'),
                [userId]
            );
        });
    });
});