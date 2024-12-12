import {
    createUser,
    getUsers,
    loginUser,
    getUserById,
    updateUser,
    deleteUser,
} from '../controller/user_controller';
import { Express } from 'express';

const userRoutes = (app: Express): void => {
    // User registration
    app.post('/api/register', createUser);

    // User login
    app.post('/api/login', loginUser);

    // Get all users
    app.get('/api/users', getUsers);

    // Get a user by ID
    app.get('/api/users/:id', getUserById);

    // Update a user by ID
    app.put('/api/users/:id', updateUser);

    // Delete a user by ID
    app.delete('/api/users/:id', deleteUser);
};

export default userRoutes;
