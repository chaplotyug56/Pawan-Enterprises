import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { auth, googleProvider } from "../firebase";
import { signInWithRedirect, getRedirectResult } from "firebase/auth";
import { useEffect } from "react";
import "../styles/Auth.css";

function Login() {
  const { login, firebaseAuth } = useAuth();

  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");

  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    try {
      const data = await login(identifier, password);

      toast.success("Login Successful");

      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Invalid Credentials"
      );
    }
  };

  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const token = await result.user.getIdToken();
          const data = await firebaseAuth(token);
          toast.success("Login Successful");

          if (data.user.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        }
      } catch (err) {
        console.error(err);
        toast.error(err.message || "Google Sign-In Failed");
      }
    };
    
    if (auth) {
      handleRedirectResult();
    }
  }, [firebaseAuth, navigate]);

  const handleGoogleLogin = async () => {
    if (!auth) {
      toast.error("Google Sign-In is not configured (Missing Firebase API Key)");
      return;
    }
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Google Sign-In Failed");
    }
  };

  return (
    <div className="auth-page">

      <form
        className="auth-form"
        onSubmit={submit}
      >

        <h1>Login</h1>

        <input
          type="text"
          placeholder="Email or Mobile Number"
          value={identifier}
          onChange={(e) =>
            setIdentifier(e.target.value)
          }
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
        />

        <button type="submit">
          Login
        </button>

        <p>
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>

        <div style={{ margin: "20px 0", display: "flex", alignItems: "center", textTransform: "uppercase", color: "#666", fontSize: "12px" }}>
          <hr style={{ flex: 1, border: "none", borderTop: "1px solid #ccc" }} />
          <span style={{ padding: "0 10px" }}>Or</span>
          <hr style={{ flex: 1, border: "none", borderTop: "1px solid #ccc" }} />
        </div>

        <button 
          type="button" 
          onClick={handleGoogleLogin}
          style={{ background: "#fff", color: "#333", border: "1px solid #ccc", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "12px" }}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: "18px" }} />
          Sign in with Google
        </button>

      </form>

    </div>
  );
}

export default Login;