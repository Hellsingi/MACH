const { v4: uuidv4 } = require("uuid");
const db = require("../config/db");
const { userSchema, updateUserSchema } = require("../validators/userValidator");

class UserService {
    async createUser(data) {
        const { error, value } = userSchema.validate(data);
        if (error) throw new Error(error.details[0].message);

        const id = uuidv4();
        const { name, email, age } = value;

        const query = `
            INSERT INTO users (id, name, email, age)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;

        const result = await db.query(query, [id, name, email, age]);
        return result.rows[0];
    }

    async getAllUsers() {
        const result = await db.query(
            "SELECT * FROM users ORDER BY created_at DESC"
        );
        return result.rows;
    }

    async updateUser(id, data) {
        const { error, value } = updateUserSchema.validate(data);
        if (error) throw new Error(error.details[0].message);

        const userCheck = await db.query("SELECT * FROM users WHERE id = $1", [id]);
        if (userCheck.rows.length === 0) return null;

        const fields = [];
        const values = [];
        let paramIndex = 1;

        for (const [key, val] of Object.entries(value)) {
            fields.push(`${key} = $${paramIndex}`);
            values.push(val);
            paramIndex++;
        }

        values.push(id);

        const query = `
            UPDATE users
            SET ${fields.join(', ')}
            WHERE id = $${paramIndex}
            RETURNING *
        `;

        const result = await db.query(query, values);
        return result.rows[0];
    }

    async deleteUser(id) {
        const result = await db.query("DELETE FROM users WHERE id = $1", [id]);
        return result.rowCount > 0;
    }
}

module.exports = new UserService();
