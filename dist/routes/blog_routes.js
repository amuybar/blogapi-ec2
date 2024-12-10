"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var blog_controller_1 = require("../controller/blog_controller");
var blogRoutes = function (app) {
    app.route("/api/blogs/").post(blog_controller_1.createBlog);
    app.route("/api/blogs/").get(blog_controller_1.getAllBlogs);
    app.route("/api/blogs/:slug").put(blog_controller_1.updateBlog).delete(blog_controller_1.deleteBlog);
};
exports.default = blogRoutes;
//# sourceMappingURL=blog_routes.js.map