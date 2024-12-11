import {
  createBlog,
  getAllBlogs,
  updateBlog,
  getBlogBySlug,
  deleteBlog,
} from "../controller/blog_controller";

const blogRoutes = (app) => {
  // Get, update, or delete a specific blog by slug
  app.route("/api/blogs/:slug")
    .get(getBlogBySlug)
    .put(updateBlog)
    .delete(deleteBlog);
  
  // Create a new blog
  app.route("/api/blogs")
    .post(createBlog)
    .get(getAllBlogs);

  
};

export default blogRoutes;