import React, { useState } from "react";
import { Button, CircularProgress, Alert, Box } from "@mui/material";
import { RefreshRounded } from "@mui/icons-material";

import { syncAccount } from "../../../services/codeforcesAccountService";

export function SyncButton({ codeforcesHandle, onSync, disabled }) {
	const [isSyncing, setIsSyncing] = useState(false);
	const [error, setError] = useState(null);

	const handleSync = async () => {
		if (!codeforcesHandle) return;

		setIsSyncing(true);
		setError(null);

		try {
			const response = await syncAccount(codeforcesHandle);
			onSync();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to sync");
		} finally {
			setIsSyncing(false);
		}
	};

	return (
		<Box sx={{ width: "100%" }}>
			<Button
				onClick={handleSync}
				disabled={disabled || isSyncing || !codeforcesHandle}
				variant="outlined"
				color="secondary"
				fullWidth
				startIcon={
					isSyncing ? <CircularProgress size={20} color="inherit" /> : <RefreshRounded />
				}
				sx={{ mb: error ? 1 : 0 }}>
				{isSyncing ? "Syncing..." : "Sync with Codeforces"}
			</Button>

			{error && (
				<Alert severity="error" sx={{ mt: 1 }}>
					{error}
				</Alert>
			)}
		</Box>
	);
}
