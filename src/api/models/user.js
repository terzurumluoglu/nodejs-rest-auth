class User {
    #_id;
    #name;
    #email;
    #password;
    #createdAt;

    #isActive;
    #isDeleted;
    #resetPasswordKey;
    #resetPasswordKeyExpire;
    constructor() {
        this.#createdAt = Date.now();
        this.#isActive = true;
        this.#isDeleted = false;
    }

    set info(val) {
        this.#_id = val._id;
        this.#name = val.name;
        this.#email = val.email;
        this.#password = val.password;
        this.#createdAt = val.createdAt;
        this.#isActive = val.isActive;
        this.#isDeleted = val.isDeleted;
        this.#resetPasswordKey = val.resetPasswordKey;
        this.#resetPasswordKeyExpire = val.resetPasswordKeyExpire;
    }

    get info() {
        return {
            _id: this.#_id,
            name: this.#name,
            email: this.#email,
            createdAt: this.#createdAt,
            isActive: this.#isActive,
            isDeleted: this.#isDeleted,
        }
    }

    get allInfo() {
        return {
            _id: this.#_id,
            name: this.#name,
            email: this.#email,
            password: this.#password,
            createdAt: this.#createdAt,
            isActive: this.#isActive,
            isDeleted: this.#isDeleted,
        }
    }

    set name(val) {
        if (!val) {
            throw new Error('Name must enter!');
        }
        if (val.length < 3) {
            throw new Error('Name must be greather than 2 characters!');
        }
        this.#name = val;
    }

    set email(val) {
        if (!val) {
            throw new Error('Email must be enter');
        }
        const isValidate = String(val)
            .toLowerCase()
            .match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/);
        if (!isValidate) {
            throw new Error('Please enter a valid email');
        };
        this.#email = val;
    }

    set password(val) {
        if (!val) {
            throw new Error('Password must be enter');
        }
        if (val.length < 6) {
            throw new Error('Password must be greather than 5 characters!');
        }
        if (val.includes(this.#name)) {
            throw new Error('Password does not include your name!');
        }
        this.#password = val;
    }
}

module.exports = User;
