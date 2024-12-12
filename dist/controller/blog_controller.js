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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.getBlogBySlug = exports.getAllBlogs = exports.createBlog = void 0;
var uuid_1 = require("uuid");
var cloudinaryService_1 = require("../utils/cloudinaryService");
var supabaseService_1 = require("../utils/supabaseService");
var createBlog = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, summary, body, author, imagePath, imageUrl, slug, date, _b, data, error, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, title = _a.title, summary = _a.summary, body = _a.body, author = _a.author;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 4, , 5]);
                // Access the file path of the uploaded image
                if (!req.file) {
                    return [2 /*return*/, res.status(400).send({ message: 'No image file provided' })];
                }
                imagePath = req.file.path;
                return [4 /*yield*/, (0, cloudinaryService_1.uploadImage)(imagePath, (0, uuid_1.v4)())];
            case 2:
                imageUrl = _c.sent();
                if (!imageUrl) {
                    return [2 /*return*/, res.status(500).send({ message: 'Image upload failed' })];
                }
                slug = title.toLowerCase().replace(/\s+/g, '-') + (0, uuid_1.v4)();
                date = new Date();
                return [4 /*yield*/, supabaseService_1.supabase
                        .from('blogs')
                        .insert([{ slug: slug, title: title, summary: summary, body: body, date: date, author: author, imageUrl: imageUrl }])
                        .select()];
            case 3:
                _b = _c.sent(), data = _b.data, error = _b.error;
                if (error)
                    throw error;
                if (!data || data.length === 0) {
                    return [2 /*return*/, res.status(500).send({ message: 'Blog creation failed: No data returned' })];
                }
                res.status(201).send({
                    message: 'Blog Created Successfully',
                    data: data[0],
                });
                return [3 /*break*/, 5];
            case 4:
                error_1 = _c.sent();
                console.error('Error creating blog:', error_1);
                res.status(500).send({
                    message: 'Internal Error Occurred while Creating Blog',
                    error: error_1 instanceof Error ? error_1.message : String(error_1),
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.createBlog = createBlog;
var getAllBlogs = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, page, _c, limit, start, end, _d, data, error, count, error_2;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                _a = req.query, _b = _a.page, page = _b === void 0 ? 1 : _b, _c = _a.limit, limit = _c === void 0 ? 10 : _c;
                _e.label = 1;
            case 1:
                _e.trys.push([1, 3, , 4]);
                start = (Number(page) - 1) * Number(limit);
                end = start + Number(limit) - 1;
                return [4 /*yield*/, supabaseService_1.supabase
                        .from('blogs')
                        .select('*', { count: 'exact' })
                        .range(start, end)];
            case 2:
                _d = _e.sent(), data = _d.data, error = _d.error, count = _d.count;
                if (error)
                    throw error;
                // Check if data exists
                if (!data) {
                    return [2 /*return*/, res.status(404).send({
                            message: 'No blogs found',
                            data: [],
                            total: 0,
                        })];
                }
                res.status(200).send({
                    message: 'All Blogs',
                    data: data,
                    total: count || 0,
                });
                return [3 /*break*/, 4];
            case 3:
                error_2 = _e.sent();
                console.error('Error fetching blogs:', error_2);
                res.status(500).send({
                    message: 'Internal Error Occurred while Fetching Blogs',
                    error: error_2 instanceof Error ? error_2.message : String(error_2),
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getAllBlogs = getAllBlogs;
var getBlogBySlug = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var slug, cleanedSlug, _a, data, error, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log('Full params:', req.params);
                slug = req.params.slug;
                console.log('Slug received:', slug);
                cleanedSlug = slug.startsWith(':') ? slug.slice(1) : slug;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, supabaseService_1.supabase
                        .from('blogs')
                        .select('*')
                        .eq('slug', cleanedSlug)];
            case 2:
                _a = _b.sent(), data = _a.data, error = _a.error;
                if (error)
                    throw error;
                if (!data || data.length === 0) {
                    return [2 /*return*/, res.status(404).send({ message: 'Blog Not Found' })];
                }
                res.status(200).send({
                    message: 'Blog Retrieved Successfully',
                    data: data[0],
                });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _b.sent();
                console.error('Error fetching blog by slug:', error_3);
                res.status(500).send({
                    message: 'Internal Error Occurred while Fetching Blog by Slug',
                    error: error_3 instanceof Error ? error_3.message : String(error_3),
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getBlogBySlug = getBlogBySlug;
var updateBlog = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var slug, _a, title, summary, body, _b, data, error, error_4;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                slug = req.params.slug;
                if (slug.startsWith(':'))
                    slug = slug.slice(1);
                _a = req.body, title = _a.title, summary = _a.summary, body = _a.body;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, supabaseService_1.supabase
                        .from('blogs')
                        .update({ title: title, summary: summary, body: body, date: new Date() })
                        .eq('slug', slug)
                        .select()];
            case 2:
                _b = _c.sent(), data = _b.data, error = _b.error;
                if (error)
                    throw error;
                if (!data || data.length === 0) {
                    return [2 /*return*/, res.status(404).send({ message: 'Blog Not Found' })];
                }
                res.status(200).send({
                    message: 'Blog Updated Successfully',
                    data: data[0],
                });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _c.sent();
                console.error('Error updating blog:', error_4);
                res.status(500).send({
                    message: 'Internal Error Occurred while Updating Blog',
                    error: error_4 instanceof Error ? error_4.message : String(error_4),
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateBlog = updateBlog;
var deleteBlog = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var slug, _a, data, error, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                slug = req.params.slug;
                if (slug.startsWith(':'))
                    slug = slug.slice(1);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, supabaseService_1.supabase
                        .from('blogs')
                        .delete()
                        .eq('slug', slug)
                        .select()];
            case 2:
                _a = _b.sent(), data = _a.data, error = _a.error;
                if (error)
                    throw error;
                if (!data || data.length === 0) {
                    return [2 /*return*/, res.status(404).send({ message: 'Blog Not Found' })];
                }
                res.status(200).send({
                    message: 'Blog Deleted Successfully',
                    deletedBlog: data[0]
                });
                return [3 /*break*/, 4];
            case 3:
                error_5 = _b.sent();
                console.error('Error deleting blog:', error_5);
                res.status(500).send({
                    message: 'Internal Error Occurred while Deleting Blog',
                    error: error_5 instanceof Error ? error_5.message : String(error_5),
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteBlog = deleteBlog;
//# sourceMappingURL=blog_controller.js.map