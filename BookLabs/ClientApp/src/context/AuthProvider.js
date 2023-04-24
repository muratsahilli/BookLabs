
import { createContext, useState,useEffect } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const storedAuth = localStorage.getItem("auth");
        return storedAuth ? JSON.parse(storedAuth) : {};
      });
    
      useEffect(() => {
        localStorage.setItem("auth", JSON.stringify(auth));
      }, [auth]);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {console.log("povider auth2: ", auth)}
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;