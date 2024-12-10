import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { supabase } from '../utils/supabaseService';

// Helper function to generate JWT token
const generateToken = (email: string) => {
    return jwt.sign({ email }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });
};

async function createUser(req: Request, res: Response) {
    const { name, email, password } = req.body;
    try {
        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Missing required fields',
            });
        }

        // Check if user already exists
        const { data: existingUser, error: existError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (existError && existError.code !== 'PGRST116') {
            throw existError;
        }

        if (existingUser) {
            return res.status(409).json({
                message: 'User already exists',
            });
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const { data, error: insertError } = await supabase
            .from('users')
            .insert([{ 
                name, 
                email, 
                password: hashPassword,
            }])
            .select();

        if (insertError) throw insertError;

        // Check if data exists
        if (!data || data.length === 0) {
            return res.status(500).json({
                message: 'Failed to create user',
            });
        }

        // Generate token
        const token = generateToken(email);

        res.status(201).json({
            message: 'User created successfully',
            user: { 
                id: data[0].id, 
                name: data[0].name, 
                email: data[0].email 
            },
            token
        });

    } catch (error) {
        console.error('User creation error:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error instanceof Error ? error.message : String(error)
        });
    }
}

async function loginUser(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: 'Missing required fields',
            });
        }

        // Find user in the database
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid credentials',
            });
        }

        // Generate token
        const token = generateToken(email);

        res.status(200).json({
            message: 'Login successful',
            user: { 
                id: user.id, 
                name: user.name, 
                email: user.email 
            },
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error instanceof Error ? error.message : String(error)
        });
    }
}

async function getUsers(req: Request, res: Response) {
    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('id, name, email, created_at');

        if (error) throw error;

        res.status(200).json({
            message: 'Users fetched successfully',
            users: users || []
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error instanceof Error ? error.message : String(error)
        });
    }
}

async function getUserById(req: Request, res: Response) {
    const { id } = req.params;
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('id, name, email, created_at')
            .eq('id', id)
            .single();

        if (error) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        res.status(200).json({
            message: 'User fetched successfully',
            user
        });
    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error instanceof Error ? error.message : String(error)
        });
    }
}

async function updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const { name, email, password } = req.body;

    try {
        // Prepare update data
        const updateData: any = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        
        // Handle password update
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        // Perform update
        const { data, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', id)
            .select('id, name, email');

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        res.status(200).json({
            message: 'User updated successfully',
            user: data[0]
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error instanceof Error ? error.message : String(error)
        });
    }
}

async function deleteUser(req: Request, res: Response) {
    const { id } = req.params;

    try {
        const { data, error } = await supabase
            .from('users')
            .delete()
            .eq('id', id)
            .select();

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        res.status(200).json({
            message: 'User deleted successfully',
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error instanceof Error ? error.message : String(error)
        });
    }
}

export {
    createUser,
    getUsers,
    loginUser,
    getUserById,
    updateUser,
    deleteUser
}