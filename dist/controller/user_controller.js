"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.getUsers = getUsers;
exports.loginUser = loginUser;
exports.getUserById = getUserById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var supabaseService_1 = require("../utils/supabaseService");
// Helper function to generate JWT token
var generateToken = function (email) {
    return jsonwebtoken_1.default.sign({ email: email }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });
};
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, name, email, password, _b, existingUser, existError, hashPassword, _c, data, insertError, token, error_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = req.body, name = _a.name, email = _a.email, password = _a.password;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 5, , 6]);
                    // Validate input
                    if (!name || !email || !password) {
                        return [2 /*return*/, res.status(400).json({
                                message: 'Missing required fields',
                            })];
                    }
                    return [4 /*yield*/, supabaseService_1.supabase
                            .from('users')
                            .select('*')
                            .eq('email', email)
                            .single()];
                case 2:
                    _b = _d.sent(), existingUser = _b.data, existError = _b.error;
                    if (existError && existError.code !== 'PGRST116') {
                        throw existError;
                    }
                    if (existingUser) {
                        return [2 /*return*/, res.status(409).json({
                                message: 'User already exists',
                            })];
                    }
                    return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
                case 3:
                    hashPassword = _d.sent();
                    return [4 /*yield*/, supabaseService_1.supabase
                            .from('users')
                            .insert([{
                                name: name,
                                email: email,
                                password: hashPassword,
                            }])
                            .select()];
                case 4:
                    _c = _d.sent(), data = _c.data, insertError = _c.error;
                    if (insertError)
                        throw insertError;
                    // Check if data exists
                    if (!data || data.length === 0) {
                        return [2 /*return*/, res.status(500).json({
                                message: 'Failed to create user',
                            })];
                    }
                    token = generateToken(email);
                    res.status(201).json({
                        message: 'User created successfully',
                        user: {
                            id: data[0].id,
                            name: data[0].name,
                            email: data[0].email
                        },
                        token: token
                    });
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _d.sent();
                    console.error('User creation error:', error_1);
                    res.status(500).json({
                        message: 'Internal server error',
                        error: error_1 instanceof Error ? error_1.message : String(error_1)
                    });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function loginUser(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, email, password, _b, user, error, isMatch, token, error_2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = req.body, email = _a.email, password = _a.password;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, , 5]);
                    // Validate input
                    if (!email || !password) {
                        return [2 /*return*/, res.status(400).json({
                                message: 'Missing required fields',
                            })];
                    }
                    return [4 /*yield*/, supabaseService_1.supabase
                            .from('users')
                            .select('*')
                            .eq('email', email)
                            .single()];
                case 2:
                    _b = _c.sent(), user = _b.data, error = _b.error;
                    if (error) {
                        return [2 /*return*/, res.status(404).json({
                                message: 'User not found',
                            })];
                    }
                    return [4 /*yield*/, bcrypt_1.default.compare(password, user.password)];
                case 3:
                    isMatch = _c.sent();
                    if (!isMatch) {
                        return [2 /*return*/, res.status(401).json({
                                message: 'Invalid credentials',
                            })];
                    }
                    token = generateToken(email);
                    res.status(200).json({
                        message: 'Login successful',
                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.email
                        },
                        token: token
                    });
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _c.sent();
                    console.error('Login error:', error_2);
                    res.status(500).json({
                        message: 'Internal server error',
                        error: error_2 instanceof Error ? error_2.message : String(error_2)
                    });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function getUsers(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, users, error, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, supabaseService_1.supabase
                            .from('users')
                            .select('id, name, email, created_at')];
                case 1:
                    _a = _b.sent(), users = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    res.status(200).json({
                        message: 'Users fetched successfully',
                        users: users || []
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _b.sent();
                    console.error('Get users error:', error_3);
                    res.status(500).json({
                        message: 'Internal server error',
                        error: error_3 instanceof Error ? error_3.message : String(error_3)
                    });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getUserById(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var id, _a, user, error, error_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = req.params.id;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, supabaseService_1.supabase
                            .from('users')
                            .select('id, name, email, created_at')
                            .eq('id', id)
                            .single()];
                case 2:
                    _a = _b.sent(), user = _a.data, error = _a.error;
                    if (error) {
                        return [2 /*return*/, res.status(404).json({
                                message: 'User not found',
                            })];
                    }
                    res.status(200).json({
                        message: 'User fetched successfully',
                        user: user
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _b.sent();
                    console.error('Get user by ID error:', error_4);
                    res.status(500).json({
                        message: 'Internal server error',
                        error: error_4 instanceof Error ? error_4.message : String(error_4)
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var id, _a, name, email, password, updateData, _b, _c, data, error, error_5;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    id = req.params.id;
                    _a = req.body, name = _a.name, email = _a.email, password = _a.password;
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 5, , 6]);
                    updateData = {};
                    if (name)
                        updateData.name = name;
                    if (email)
                        updateData.email = email;
                    if (!password) return [3 /*break*/, 3];
                    _b = updateData;
                    return [4 /*yield*/, bcrypt_1.default.hash(password, 10)];
                case 2:
                    _b.password = _d.sent();
                    _d.label = 3;
                case 3: return [4 /*yield*/, supabaseService_1.supabase
                        .from('users')
                        .update(updateData)
                        .eq('id', id)
                        .select('id, name, email')];
                case 4:
                    _c = _d.sent(), data = _c.data, error = _c.error;
                    if (error)
                        throw error;
                    if (!data || data.length === 0) {
                        return [2 /*return*/, res.status(404).json({
                                message: 'User not found',
                            })];
                    }
                    res.status(200).json({
                        message: 'User updated successfully',
                        user: data[0]
                    });
                    return [3 /*break*/, 6];
                case 5:
                    error_5 = _d.sent();
                    console.error('Update user error:', error_5);
                    res.status(500).json({
                        message: 'Internal server error',
                        error: error_5 instanceof Error ? error_5.message : String(error_5)
                    });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var id, _a, data, error, error_6;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    id = req.params.id;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, supabaseService_1.supabase
                            .from('users')
                            .delete()
                            .eq('id', id)
                            .select()];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error)
                        throw error;
                    if (!data || data.length === 0) {
                        return [2 /*return*/, res.status(404).json({
                                message: 'User not found',
                            })];
                    }
                    res.status(200).json({
                        message: 'User deleted successfully',
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _b.sent();
                    console.error('Delete user error:', error_6);
                    res.status(500).json({
                        message: 'Internal server error',
                        error: error_6 instanceof Error ? error_6.message : String(error_6)
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=user_controller.js.map