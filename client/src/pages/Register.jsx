import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import "../styles/Auth.css";
import { useNavigate } from "react-router-dom";

function Register() {

    const navigate = useNavigate();
    const { register, login } = useAuth();
  

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

      </form>

    </div>

  );
}

export default Register;