import { createContext, useState } from "react";


export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [User, setUser] = useState(null);
    const [Loading, setLoading] = useState(true)

    return (
        <AuthContext.Provider value={{ User, setUser, Loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    )
}