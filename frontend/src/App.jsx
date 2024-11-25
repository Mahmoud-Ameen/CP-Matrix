import { AuthProvider } from "./context/AuthContext";
import ProblemsPage from "./pages/ProblemsPage/ProblemsPage";

function App() {
	return (
		<AuthProvider>
			{/* Providers specific to problems page */}
			<ProblemsPage />
		</AuthProvider>
	);
}

export default App;
