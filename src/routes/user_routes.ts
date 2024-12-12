import {
    createUser,
    getUsers,
    loginUser,
    getUser,
    updateUser,
    deleteUser,
} from '../controller/user_controller';
import { Express } from 'express';
import { authMiddleware } from '../middleware/auth_mid';

const userRoutes = (app: Express): void => {
    // User registration
    app.post('/api/register', createUser);

    // User login
    app.post('/api/login', loginUser);

    // Get all users
    app.get('/api/users', getUsers);

    // Get a user by ID
    app.get('/api/users',authMiddleware, getUser);

    // Update a user by ID
    app.put('/api/users/:id', updateUser);

    // Delete a user by ID
    app.delete('/api/users/:id', deleteUser);
};

export default userRoutes;
