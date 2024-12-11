"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var blog_controller_1 = require("../controller/blog_controller");
var blogRoutes = function (app) {
    // Get, update, or delete a specific blog by slug
    app.route("/api/blogs/:slug")
        .get(blog_controller_1.getBlogBySlug)
        .put(blog_controller_1.updateBlog)
        .delete(blog_controller_1.deleteBlog);
    // Create a new blog
    app.route("/api/blogs")
        .post(blog_controller_1.createBlog)
        .get(blog_controller_1.getAllBlogs);
};
exports.default = blogRoutes;
//# sourceMappingURL=blog_routes.js.map