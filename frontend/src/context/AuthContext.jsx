import { useContext, createContext, useEffect, useState } from "react";
import { auth, signInWithPopup, provider, signInWithRedirect } from "../firebase";
import { login } from "../services/AuthService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	const logout = () => {
		return auth.signOut();
	};

	const loginWithGoogle = () => {
		return signInWithPopup(auth, provider).then((user) => login(user.user.accessToken));
	};

	const isLoggedIn = () => currentUser;

	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			setCurrentUser(user);
			setIsLoading(false);
		});
	}, []);

	const value = { loginWithGoogle, logout, currentUser, isLoggedIn };

	return (
		<AuthContext.Provider value={value}>
			{isLoading ? <h1>Loading</h1> : children}
		</AuthContext.Provider>
	);
};
