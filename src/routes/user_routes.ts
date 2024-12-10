import {createUser,getUsers,loginUser} from '../controller/user_controller'

const userRoutes = (app) => { 
    app.post('/api/register', createUser);
    app.post('/api/login',loginUser)
    app.get('/users',getUsers)
}
export default userRoutes;