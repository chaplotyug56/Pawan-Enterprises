import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "../styles/Auth.css";

function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    try {
      const data = await login(email, password);

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

  return (
    <div className="auth-page">

      <form
        className="auth-form"
        onSubmit={submit}
      >

        <h1>Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
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

      </form>

    </div>
  );
}

export default Login;