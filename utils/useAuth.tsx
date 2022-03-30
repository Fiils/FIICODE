import React, { useState, useContext, useEffect } from "react"
import axios from 'axios'

interface User {
    user: {
        isLoggedIn: boolean;
        userId: string;
        active: boolean;
        profilePicture: string;
    }
    setUser: any;
}


const AuthContext = React.createContext<any>({})

export function AuthProvider(props: any) {
    const [user, setUser] = useState({ isLoggedIn: false, userId: '', active: false, profilePicture: '/' })

    async function login() {
        const response = await axios.get('http://localhost:9999/api/functionalities/cookie-ax', { withCredentials: true })
                            .then(res => res.data)
                            .catch(err => console.log(err.response))
        if(response){
            setUser({ isLoggedIn: response.isLoggedIn, userId: response.userId, active: response.active, profilePicture: response.profilePicture })
        }
    }
    useEffect(() => {
        login()
    }, [])

    const value: User = {user, setUser}
    return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
}

// Create useAuth Hook
export function useAuth(): User {
    return useContext<User>(AuthContext)
}