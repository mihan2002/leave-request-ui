import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
  Alert,
  Link,
  Paper,
} from "@mui/material";
import { login } from "../services/authService";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("Form submitted");
    e.preventDefault();

    // Reset errors
    setError("");
    setUsernameError(false);
    setPasswordError(false);

    // Validate required fields
    if (!username || !password) {
      if (!username) setUsernameError(true);
      if (!password) setPasswordError(true);
      return;
    }

    setLoading(true);
    try {
      const res = await login(username, password);
      console.log("🚀 ~ handleSubmit ~ res:", res);

      if (res.token) {
        navigate("/leave-list");
      }
    } catch (err: any) {
      console.log("🚀 ~ handleSubmit ~ err:", err)
      // Extract the error message from backend response
      const serverError =
        err?.response?.data?.error || "Login failed. Please try again.";

      // Map specific server messages to field errors
      if (serverError.toLowerCase().includes("user not found")) {
        setUsernameError(true);
        setError("User not found. Please check your username.");
      } else if (
        serverError.toLowerCase().includes("invalid username or password")
      ) {
        setUsernameError(true);
        setPasswordError(true);
        setError("Invalid username or password.");
      } else {
        setError(serverError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Leave Request Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={usernameError}
              helperText={usernameError ? "Username is required" : ""}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
              helperText={passwordError ? "Password is required" : ""}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Login"
              )}
            </Button>
          </Box>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don&apos;t have an account?{" "}
            <Link component={RouterLink} to="/signup" underline="hover">
              Register
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
