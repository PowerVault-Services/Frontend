import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import eyeIcon from "../assets/icons/Eye.svg";
import eyeClosedIcon from "../assets/icons/Eye Closed.svg";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ validate ก่อนยิง API
    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const res = await api.post("/auth/login", {
        username,
        password,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/", { replace: true });

    } catch (err: any) {

      // ✅ รองรับ error จาก backend
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError("Incorrect username or password");
      } else {
        setError("Login failed. Please try again.");
      }

    } finally {
      setLoading(false);
    }
  };

  console.log("API URL:", import.meta.env.VITE_API_URL);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/solar-bg.jpg')" }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-green-100/85" />

      {/* กล่อง login */}
      <form
        onSubmit={handleLogin}
        className="
          relative z-10
          w-full
          max-w-[643px]
          px-10
        "
      >
        {/* logo */}
        <div className="flex justify-center mb-10">
          <img
            src="/logo.png"
            alt="PowerVault Service"
            className="h-[156px] max-w-full object-contain"
          />
        </div>

        {error && (
          <div
            className="
      mb-6
      flex
      items-center
      justify-between
      px-4
      py-3
      rounded-md
      border
    "
            style={{
              backgroundColor: "#FFDCE0",
              borderColor: "#B46166",
              color: "#B46166",
            }}
          >
            <span className="text-sm font-medium">{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              className="ml-4 font-bold text-4xl leading-none hover:opacity-70"
            >
              ×
            </button>
          </div>
        )}

        {/* Username */}
        <div className="w-full max-w-[643px] mb-6">
          <label className="block text-green-600 mb-2 text-[22px] font-bold">
            Username
          </label>
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
            className="
              w-full
              h-14
              px-5
              rounded-md
              outline-none
              border border-green-600
              focus:ring-2 focus:ring-green-500
              bg-white font-light
              text-lg
            "
          />
        </div>

        <div className="w-full max-w-[643px] mb-10">
          <label className="block text-green-600 mb-2 text-[22px] font-bold">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="
        w-full
        h-14
        px-5
        pr-12
        rounded-md
        outline-none
        border border-green-600
        focus:ring-2 focus:ring-green-500
        bg-white font-light
        text-lg
      "
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="
    absolute
    right-4
    top-1/2
    -translate-y-1/2
    opacity-70
    hover:opacity-100
  "
            >
              <img
                src={showPassword ? eyeClosedIcon : eyeIcon}
                alt="toggle password"
                className="w-5 h-5"
              />
            </button>
          </div>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            max-w-[643px]
            h-16
            px-9
            bg-green-500
            text-white
            rounded-md
            text-2xl
            font-medium
            hover:bg-green-600
            transition
            disabled:bg-green-300
          "
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}