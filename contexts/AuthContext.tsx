import Router from "next/router";
import { createContext, ReactNode, useEffect, useState } from "react";
import { setCookie, parseCookies, destroyCookie } from 'nookies'
import { api } from "../services/apiClient";


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
    signIn: (credentials: SignInCredendials) => Promise<void>;
    signOut: () => void;
    user: User;
    isAuthenticated: boolean;
}

type AuthProviderProps = {
    children: ReactNode;
}


export const AuthContext = createContext({} as AuthContextData)

let authChannel: BroadcastChannel

export const signOut = () => {
    destroyCookie(undefined, 'nextauth.token')
    destroyCookie(undefined, 'nextauth.refreshToken')

    authChannel.postMessage('signOut')

    Router.push('/')
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User>()
    const isAuthenticated = !!user

    useEffect(() => {
        authChannel = new BroadcastChannel('auth')

        authChannel.onmessage = (message) => {
            switch (message.data) {
                case 'signOut':
                    Router.push('/')
                    break
                default:
                    break
            }
        }
    }, [])

    useEffect(() => {
        const { 'nextauth.token': token } = parseCookies()

        if (token) {
            api.get('/me')
                .then(response => {
                    const { email, permissions, roles } = response.data

                    setUser({ email, permissions, roles })
                })
                .catch(() => {
                    signOut()
                })
        }
    }, [])

    const signIn = async ({ email, password }: SignInCredendials) => {
        try {
            const response = await api.post('sessions', {
                email,
                password
            })

            const { token, refreshToken, permissions, roles } = response.data

            // o primeiro parâmetro é sempre undefined, porque o signIn é uma ação do usuário feita no browser.
            setCookie(undefined, 'nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, // (30 days) quanto tempo o cookie deve ser mantido no navegador
                path: '/' // qualquer endereço da app vai ter acesso ao cookie, geralmente usado '/' para um cookie global
            })

            setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
                maxAge: 60 * 60 * 24 * 30, // (30 days) quanto tempo o cookie deve ser mantido no navegador
                path: '/' // qualquer endereço da app vai ter acesso ao cookie, geralmente usado '/' para um cookie global
            })

            setUser({
                email,
                permissions,
                roles
            })

            api.defaults.headers['Authorization'] = `Bearer ${token}`

            Router.push('/dashboard')

        } catch (err) {
            console.log(err)
        }
    }


    return (
        <AuthContext.Provider value={{ isAuthenticated, signOut, signIn, user }}>
            {children}
        </AuthContext.Provider>
    )
}