const UserController = require('../src/controllers/userController');
const UserService = require('../src/services/userService');

jest.mock('../src/services/userService');

describe('User Controller', () => {
    let controller;
    let mockRequest;
    let mockResponse;

    beforeEach(() => {
        jest.clearAllMocks();
        controller = UserController;

        mockRequest = {
            body: {},
            params: {}
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        };
    });

    describe('createUser', () => {
        it('should create a user successfully', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                age: 30
            };

            const createdUser = {
                id: '123e4567-e89b-12d3-a456-426614174000',
                name: 'John Doe',
                email: 'john@example.com',
                age: 30,
                created_at: '2023-04-01T10:20:30Z',
                updated_at: '2023-04-01T10:20:30Z'
            };

            mockRequest.body = userData;
            UserService.createUser.mockResolvedValue(createdUser);

            await controller.createUser(mockRequest, mockResponse);

            expect(UserService.createUser).toHaveBeenCalledWith(userData);
            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith(createdUser);
        });

        it('should return 400 when validation fails', async () => {
            const userData = {
                name: 'Jo', // name too short
                email: 'not-an-email',
                age: 200 // age too high
            };

            mockRequest.body = userData;
            UserService.createUser.mockRejectedValue(new Error('Validation error'));

            await controller.createUser(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Validation error'
            });
        });
    });

    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const users = [
                { id: '1', name: 'User One' },
                { id: '2', name: 'User Two' }
            ];

            UserService.getAllUsers.mockResolvedValue(users);

            await controller.getAllUsers(mockRequest, mockResponse);

            expect(UserService.getAllUsers).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(users);
        });

        it('should handle errors properly', async () => {
            UserService.getAllUsers.mockRejectedValue(new Error('Database error'));

            await controller.getAllUsers(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Database error'
            });
        });
    });

    describe('getUserById', () => {
        it('should return a user when valid ID is provided', async () => {
            const userId = '123e4567-e89b-12d3-a456-426614174000';
            const user = {
                id: userId,
                name: 'John Doe',
                email: 'john@example.com'
            };

            mockRequest.params.id = userId;
            UserService.getUserById.mockResolvedValue(user);

            await controller.getUserById(mockRequest, mockResponse);

            expect(UserService.getUserById).toHaveBeenCalledWith(userId);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(user);
        });

        it('should return 404 when user is not found', async () => {
            const userId = 'non-existent-id';
            mockRequest.params.id = userId;
            UserService.getUserById.mockResolvedValue(null);

            await controller.getUserById(mockRequest, mockResponse);

            expect(UserService.getUserById).toHaveBeenCalledWith(userId);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'User not found'
            });
        });
    });

    describe('updateUser', () => {
        it('should update a user when valid data is provided', async () => {
            const userId = '123e4567-e89b-12d3-a456-426614174000';
            const updateData = {
                name: 'Updated Name',
                age: 35
            };

            const updatedUser = {
                id: userId,
                name: 'Updated Name',
                email: 'john@example.com',
                age: 35,
                updated_at: '2023-04-01T11:20:30Z'
            };

            mockRequest.params.id = userId;
            mockRequest.body = updateData;
            UserService.updateUser.mockResolvedValue(updatedUser);

            await controller.updateUser(mockRequest, mockResponse);

            expect(UserService.updateUser).toHaveBeenCalledWith(userId, updateData);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith(updatedUser);
        });

        it('should return 404 when updating non-existent user', async () => {
            const userId = 'non-existent-id';
            const updateData = {
                name: 'Updated Name'
            };

            mockRequest.params.id = userId;
            mockRequest.body = updateData;
            UserService.updateUser.mockResolvedValue(null);

            await controller.updateUser(mockRequest, mockResponse);

            expect(UserService.updateUser).toHaveBeenCalledWith(userId, updateData);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'User not found'
            });
        });
    });

    describe('deleteUser', () => {
        it('should delete a user when valid ID is provided', async () => {
            const userId = '123e4567-e89b-12d3-a456-426614174000';
            mockRequest.params.id = userId;
            UserService.deleteUser.mockResolvedValue(true);

            await controller.deleteUser(mockRequest, mockResponse);

            expect(UserService.deleteUser).toHaveBeenCalledWith(userId);
            expect(mockResponse.status).toHaveBeenCalledWith(200);
        });

        it('should return 404 when deleting non-existent user', async () => {
            const userId = 'non-existent-id';
            mockRequest.params.id = userId;
            UserService.deleteUser.mockResolvedValue(false);

            await controller.deleteUser(mockRequest, mockResponse);

            expect(UserService.deleteUser).toHaveBeenCalledWith(userId);
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'User not found'
            });
        });
    });
});