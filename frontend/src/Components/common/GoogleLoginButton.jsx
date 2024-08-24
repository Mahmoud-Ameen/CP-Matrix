import { Button, IconButton } from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

const GoogleLoginButton = () => {
	const { loginWithGoogle } = useAuth();

	return (
		<Button
			variant="contained"
			sx={{
				backgroundColor: "primary",
				color: "#ffffff",
				borderRadius: "20px",
				textTransform: "none",
				boxShadow: "0px 4px 14px rgba(0, 0, 0, 0.25)",
				padding: "8px 20px",
				fontWeight: "bold",
				display: "flex",
				alignItems: "center",
				gap: "10px",
				"&:hover": {
					backgroundColor: "primary.dark",
				},
			}}
			startIcon={<GoogleIcon />}
			onClick={loginWithGoogle}>
			Login
		</Button>
	);
};

export default GoogleLoginButton;
