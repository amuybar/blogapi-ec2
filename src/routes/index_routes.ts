import userRoutes from "./user_routes";
import blogRoutes from "./blog_routes";

const routes = (app) => {
    userRoutes(app);
    blogRoutes(app);
}
export default routes;