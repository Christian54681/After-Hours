// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserFactory } from '../domain/UserFactory';

interface AuthContextType {
    user: any | null; // la instancia se guarda aqui
    login: (userData: any, token: string) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    // Al cargar la app, intentamos recuperar la sesión
    useEffect(() => {
        const savedUser = localStorage.getItem('user_data');
        if (savedUser) {
            try {
                // Re-instanciamos usando la fábrica para recuperar los métodos
                const instancia = UserFactory.crearUsuario(JSON.parse(savedUser));
                setUser(instancia);
            } catch (e) {
                console.error("Error recuperando sesión", e);
            }
        }
        setLoading(false);
    }, []);

    const login = (userData: any, token: string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user_data', JSON.stringify(userData)); // Guardamos el JSON plano
        
        const instancia = UserFactory.crearUsuario(userData); // Creamos la clase
        setUser(instancia);
    };

    const logout = () => {
        localStorage.clear();
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