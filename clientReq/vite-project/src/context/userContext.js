import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const setUserData = (userData) => {
        setUser(userData);
    };

    const removeUserData = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, setUserData, removeUserData }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);