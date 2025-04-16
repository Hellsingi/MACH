const { v4: uuidv4 } = require('uuid');
const users = require('../models/userModel');
const { userSchema } = require('../validators/userValidator');

class userService {
    async createUser(data) {
        const { error, value } = userSchema.validate(data);
        if (error) throw new Error(error.details[0].message);

        const newUser = {
            id: uuidv4(),
            ...value,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        return newUser;
    }

    async getAllUsers() {
        return users;
    }

    async updateUser(id, data) {
        const user = users.find(u => u.id === id);
        if (!user) return null;

        const { error, value } = userSchema.validate(data);
        if (error) throw new Error(error.details[0].message);

        Object.assign(user, value);
        return user;
    }

    async deleteUser(id) {
        const index = users.findIndex(u => u.id === id);
        if (index === -1) return false;

        users.splice(index, 1);
        return true;
    }
}

module.exports = new userService();
