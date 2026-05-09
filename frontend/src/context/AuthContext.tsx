import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserFactory } from '../domain/UserFactory';

interface AuthContextType {
    user: any | null;
    login: (userData: any, token: string) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user_data');
        if (savedUser) {
            try {
                const data = JSON.parse(savedUser);
                // Re-instanciamos usando la fábrica para recuperar los métodos
                const instancia = UserFactory.crearUsuario(data);
                setUser(instancia);
                console.log("✅ Sesión recuperada para:", data.username);
            } catch (e) {
                console.error("❌ Error al recuperar sesión:", e);
                localStorage.removeItem('user_data');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = (userData: any, token: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user_data', JSON.stringify(userData));
        const instancia = UserFactory.crearUsuario(userData);
        setUser(instancia);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_data');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
    return context;
};