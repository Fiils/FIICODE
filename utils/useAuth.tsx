import React, { useState, useContext, useEffect } from "react"
import axios from 'axios'

interface User {
    user: {
        isLoggedIn: boolean;
        userId: string;
        active: boolean;
    }
    setUser: any;
}


// Create Auth context
const AuthContext = React.createContext<any>({})

// Auth Provider
export function AuthProvider(props: any) {
    // Create State
    const [user, setUser] = useState({ isLoggedIn: false, userId: '', active: false })

    // Methods
    async function login() {
        const response = await axios.get('http://localhost:9999/api/functionalities/cookie-ax', { withCredentials: true })
                            .then(res => res.data)
                            .catch(err => console.log(err.response))
        if(response){
            setUser({ isLoggedIn: response.isLoggedIn, userId: response.userId, active: response.active })
        }
    }
    useEffect(() => {
        login()
    }, [])
    // Export elements that will be available through the useAuth() hook
    const value: User = {user, setUser}
    return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
}

// Create useAuth Hook
export function useAuth(): User {
    return useContext<User>(AuthContext)
}