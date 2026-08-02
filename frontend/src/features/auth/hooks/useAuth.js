import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { GetMe, Login, logOut, Register } from "../services/auth.api"

export const useAuth = () => {

    const context = useContext(AuthContext)
    const { User, setUser, Loading, setLoading } = context


    const HandleRegister = async ({ username, email, password }) => {
        try {
            setLoading(true)
            const data = await Register({ username, email, password });
            setUser(data.user)
            return { success: true }
        } catch (error) {
            console.error('Registration failed:', error)
            return { success: false, error: error.response?.data?.message || error.message }
        } finally {
            setLoading(false)
        }
    }

    const HandleLogin = async ({ username, email, password }) => {
        try {
            setLoading(true)
            const data = await Login({ username, email, password })
            setUser(data.user)
            return { success: true }
        } catch (error) {
            console.error('Login failed:', error)
            return { success: false, error: error.response?.data?.message || error.message }
        } finally {
            setLoading(false)
        }
    }

    const HandleGetMe = async () => {
        try {
            const data = await GetMe()
            setUser(data.user)
        } catch (error) {
            console.error('GetMe failed:', error)
        } finally {
            setLoading(false)
        }
    }

    const HandleLogOut = async () => {
        try {
            await logOut();
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=>{
        HandleGetMe()
    },[]);

    return ({
        User, Loading, HandleRegister, HandleLogin, HandleGetMe, HandleLogOut
    })
}