"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var user_controller_1 = require("../controller/user_controller");
var userRoutes = function (app) {
    // User registration
    app.post('/api/register', user_controller_1.createUser);
    // User login
    app.post('/api/login', user_controller_1.loginUser);
    // Get all users
    app.get('/api/users', user_controller_1.getUsers);
    // Get a user by ID
    app.get('/api/users/:id', user_controller_1.getUserById);
    // Update a user by ID
    app.put('/api/users/:id', user_controller_1.updateUser);
    // Delete a user by ID
    app.delete('/api/users/:id', user_controller_1.deleteUser);
};
exports.default = userRoutes;
//# sourceMappingURL=user_routes.js.map