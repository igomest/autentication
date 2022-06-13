import Router from "next/router";
import { createContext, ReactNode, useState } from "react";
import { api } from "../services/api";

type User = {
    email: string;
    permissions: string[];
    roles: string[];
}

type SignInCredendials = {
    email: string;
    password: string;
}

type AuthContextData = { // dados do usuário
    signIn(credentials: SignInCredendials): Promise<void>;
    user: User;
    isAuthenticated: boolean;
}

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User>()
    const isAuthenticated = !!user

    const signIn = async ({ email, password }: SignInCredendials) => {
        try {
            const response = await api.post('sessions', {
                email,
                password
            })

            const { permissions, roles } = response.data

            setUser({
                email,
                permissions,
                roles
            })

            Router.push('/dashboard')
        } catch (err) {
            console.log(err)
        }


    }


    return (
        <AuthContext.Provider value={{ isAuthenticated, signIn, user }}>
            {children}
        </AuthContext.Provider>
    )
}