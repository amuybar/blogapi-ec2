import {
  createBlog,
  getAllBlogs,
  getBlogsBySlug,
  updateBlog,
  deleteBlog,
} from "../controller/blog_controller";

const blogRoutes = (app) => {
  app.route("/api/blogs/").post(createBlog);
  app.route("/api/blogs/").get(getAllBlogs);
  app.route("/api/blogs/:slug").get(getBlogsBySlug).put(updateBlog).delete(deleteBlog);
};
export default blogRoutes;
