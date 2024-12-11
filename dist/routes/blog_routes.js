"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var blog_controller_1 = require("../controller/blog_controller");
var multer_mid_1 = __importDefault(require("../middleware/multer_mid"));
var blogRoutes = function (app) {
    // Get, update, or delete a specific blog by slug
    app.route("/api/blogs/:slug")
        .get(blog_controller_1.getBlogBySlug)
        .put(blog_controller_1.updateBlog)
        .delete(blog_controller_1.deleteBlog);
    // Create a new blog with multer middleware for image upload
    app.route("/api/blogs")
        .post(multer_mid_1.default, blog_controller_1.createBlog)
        .get(blog_controller_1.getAllBlogs);
};
exports.default = blogRoutes;
//# sourceMappingURL=blog_routes.js.map