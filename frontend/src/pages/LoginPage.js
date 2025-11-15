import React, { useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Username + Password Login
  const handleLogin = async () => {
    try {
      const res = await API.post("/login", { username, password });
      localStorage.setItem("jwt", res.data.access_token);
      navigate("/dashboard");
    } catch (e) {
      alert("Invalid login");
    }
  };

  // Google Login
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await API.post("/google-login", { token: credentialResponse.credential });
      localStorage.setItem("jwt", res.data.access_token);
      navigate("/dashboard");
    } catch (e) {
      alert("Google login failed");
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div style={styles.container}>
        <div style={styles.box}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Login to your account</p>

          <input
            style={styles.input}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button style={styles.button} onClick={handleLogin}>
            Login
          </button>

          <div style={styles.orContainer}>
            <span style={styles.line}></span>
            <span style={styles.orText}>OR</span>
            <span style={styles.line}></span>
          </div>

          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => alert("Google login failed")}
            useOneTap
          />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to right, #6a11cb, #2575fc)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  box: {
    padding: 40,
    width: 380,
    borderRadius: 12,
    background: "#fff",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  title: {
    margin: "0 0 10px 0",
    fontSize: 28,
    color: "#333",
  },
  subtitle: {
    margin: "0 0 20px 0",
    fontSize: 14,
    color: "#666",
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 14,
  },
  button: {
    width: "100%",
    padding: 14,
    background: "#2575fc",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 16,
    fontWeight: "bold",
    transition: "background 0.3s",
  },
  orContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "20px 0",
  },
  line: {
    flex: 1,
    height: 1,
    background: "#ccc",
    margin: "0 10px",
  },
  orText: {
    color: "#999",
    fontWeight: "bold",
  },
};

export default LoginPage;
