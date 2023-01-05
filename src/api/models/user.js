const { getUserCollection } = require('../../config/db');
const { authService } = require('../services');

class User {
    name;
    email;
    password;
    createdAt;
    constructor() {
        this.createdAt = Date.now();
    }

    set setName(val) {
        if (!val || val.length < 3) {
            throw new Error('Name must be greather than 2 characters!');
        }
        this.name = val;
    }

    set setEmail(val) {
        const isValidate = String(val)
            .toLowerCase()
            .match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/);
        if (!isValidate) {
            throw new Error('Please enter a valid email');
        };
        this.email = val;
    }

    set setPassword(val) {
        if (!val) {
            throw new Error('Password must be enter');
        }
        if (val.length < 6) {
            throw new Error('Password must be greather than 5 characters!');
        }
        if (val.includes(this.name)) {
            throw new Error('Password does not include your name!');
        }
        this.password = val;
    }

    saveUser = async () => {
        const userToBeInserted = {
            name: this.name,
            email: this.email,
            password: await authService.hashString(this.password),
            createdAt: this.createdAt,
        };
        const { insertedId } = await getUserCollection().insertOne(userToBeInserted);

        return collection.findOne({ _id: insertedId });
    }

    getUserById = (id) => {
        return getUserCollection().findOne({ _id: id });
    }

    getUserByEmail = (email) => {
        return getUserCollection().findOne({ email });
    }
}

module.exports = User;
