import React, { useState } from "react";
import { authClient } from "./auth-client";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setStatus("Sending OTP...");
    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      });

      if (error) {
        throw new Error(error.message);
      }

      setShowOtpInput(true);
      setStatus("📨 OTP sent! Please verify your email.");
    } catch (err) {
      setStatus("❌ " + (err.message || "Something went wrong"));
    }
  };

  const handleVerifyOtpAndRegister = async (e) => {
    e.preventDefault();
    setStatus("Verifying OTP...");
    try {

      const { error } =  await authClient.signUp.email({ email, password, name });
      setStatus("✅ Email verified & registration complete.");
      setShowOtpInput(false);
      setIsLogin(true); // Redirect to login

      if (error) {
        throw new Error(error.message);
      }

      await authClient.emailOtp.verifyEmail({
        email,
        otp,
      });

    } catch (err) {
      setStatus("❌ " + (err.message || "Invalid OTP"));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatus("Logging in...");
    try {
      await authClient.signIn.email({ email, password });
      setStatus("✅ Login successful!");
    } catch (err) {
      setStatus("❌ " + (err.message || "Login failed"));
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          background: "#1e293b",
          borderRadius: "1rem",
          padding: "2rem",
          width: "100%",
          maxWidth: "400px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "1.5rem", fontSize: "1.8rem" }}>
          {isLogin ? "Login" : "Register"} to <span style={{ color: "#3b82f6" }}>BetterAuth</span>
        </h1>

        {!showOtpInput ? (
          <form
            onSubmit={isLogin ? handleLogin : handleRegister}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {!isLogin && (
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={inputStyle}
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>
              {isLogin ? "Login" : "Send OTP"}
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleVerifyOtpAndRegister}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              style={inputStyle}
            />
            <button type="submit" style={buttonStyle}>
              Verify OTP & Register
            </button>
          </form>
        )}

        {!showOtpInput && (
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setStatus("");
            }}
            style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#94a3b8" }}
          >
            {isLogin ? "Need an account? Register" : "Already have an account? Login"}
          </button>
        )}

        {status && (
          <div style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#38bdf8" }}>{status}</div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "0.75rem 1rem",
  borderRadius: "0.5rem",
  border: "1px solid #334155",
  background: "#0f172a",
  color: "#fff",
};

const buttonStyle = {
  padding: "0.75rem 1rem",
  background: "#3b82f6",
  color: "#fff",
  fontWeight: "bold",
  borderRadius: "0.5rem",
  border: "none",
  cursor: "pointer",
};

export default App;