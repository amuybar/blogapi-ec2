import {
  createBlog,
  getAllBlogs,
  updateBlog,
  getBlogBySlug,
  deleteBlog,
} from "../controller/blog_controller";

const blogRoutes = (app) => {
  app.route("/api/blogs/").post(createBlog);
  app.route("/api/blogs/").get(getAllBlogs);
  app.route("/api/blogs/:slug").get(getBlogBySlug).put(updateBlog).delete(deleteBlog);
};
export default blogRoutes;
