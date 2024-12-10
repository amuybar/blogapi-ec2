"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var user_controller_1 = require("../controller/user_controller");
var userRoutes = function (app) {
    app.post('/api/register', user_controller_1.createUser);
    app.post('/api/login', user_controller_1.loginUser);
    app.get('/users', user_controller_1.getUsers);
};
exports.default = userRoutes;
//# sourceMappingURL=user_routes.js.map