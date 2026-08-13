import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import "../styles/Auth.css";
import { useNavigate } from "react-router-dom";

function Register() {

    const navigate = useNavigate();
    const { register, login, firebaseAuth } = useAuth();
  

  const [form, setForm] =
    useState({
      name: "",
      email: "",
      phone: "",
      password: "",
    });

    const submit = async (e) => {
        e.preventDefault();
      
        try {
          await register(form);
      
          await login(form.email, form.password);
      
          toast.success("Welcome to Pawan Enterprises!");
      
          navigate("/");
      
        } catch (err) {
          toast.error(err.response?.data?.message || "Registration Failed");
        }
    };

      const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      
      const data = await firebaseAuth(token);
      toast.success("Login Successful via Google");

      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
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

        <h1>Create Account</h1>

        <input
          placeholder="Name"
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
          required
        />

        <input
          type="email"
          placeholder="Email"
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
          required
        />

        <input
          type="tel"
          placeholder="Mobile Number"
          onChange={(e) =>
            setForm({
              ...form,
              phone: e.target.value,
            })
          }
          required
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
          required
        />

        <button>
          Register
        </button>

        <p>

          Already have an account?

          <Link to="/login">
            Login
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
          style={{ background: "#fff", color: "#333", border: "1px solid #ccc", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "12px", cursor: "pointer" }}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: "18px" }} />
          Sign in with Google
        </button>

      </form>

    </div>

  );
}

export default Register;