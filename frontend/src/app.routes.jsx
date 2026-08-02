import {createBrowserRouter} from 'react-router'
import Login from './features/auth/pages/Login'
import Register from './features/auth/pages/Register'
import ProtectedRoute from './features/auth/componets/ProtectedRoute';
import Home from './features/home/pages/Home';

const BrowserRouter= createBrowserRouter([
    {
        path:'/',
        element:<ProtectedRoute><Home/></ProtectedRoute>
    },
    {
        path:'/login',
        element:<Login/>
    },
    {
        path:'/register',
        element:<Register/>
    }
])

export default BrowserRouter;
