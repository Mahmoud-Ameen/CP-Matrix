import { AuthProvider } from "./context/AuthContext";
import { FiltersProvider } from "./context/ProblemsPage/FiltersContext";
import { ProblemsProvider } from "./context/ProblemsPage/ProblemsContext";
import ProblemsPage from "./pages/ProblemsPage";

function App() {
	return (
		<AuthProvider>
			{/* Providers specific to problems page */}
			<FiltersProvider>
				<ProblemsProvider>
					<ProblemsPage />
				</ProblemsProvider>
			</FiltersProvider>
		</AuthProvider>
	);
}

export default App;
