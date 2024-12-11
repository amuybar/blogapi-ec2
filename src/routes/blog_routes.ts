import {
  createBlog,
  getAllBlogs,
  updateBlog,
  getBlogBySlug,
  deleteBlog,
} from "../controller/blog_controller";

import upload from '../middleware/multer_mid'; 

const blogRoutes = (app) => {
  // Get, update, or delete a specific blog by slug
  app.route("/api/blogs/:slug")
    .get(getBlogBySlug)
    .put(updateBlog)
    .delete(deleteBlog);
  
  // Create a new blog with multer middleware for image upload
  app.route("/api/blogs")
    .post(upload, createBlog)
    .get(getAllBlogs);
};

export default blogRoutes;
