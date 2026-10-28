import { createContext, useState } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext(null);

function UserProvider({ children }) {
    const [user, setUser] = useState(null);

    const login = () => {
        setUser({ name: "Senior Engineer", role: "Admin" });
    };

    return (
        <UserContext.Provider value={{ user, login }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;
