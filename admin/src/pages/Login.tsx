import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      localStorage.setItem("token", "mock-token");
      navigate("/", { replace: true });
    }
  };

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

        {/* Username */}
        <div className="w-full max-w-[643px] mb-6">
          <label className="block text-green-400 mb-2 text-[22px] font-bold">
            Username
          </label>
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="
              w-full
              h-14
              px-5
              rounded-md
              outline-none
              border border-green-300
              focus:ring-2 focus:ring-green-500
              bg-white font-light
              text-lg
            "
          />
        </div>

        {/* Password */}
        <div className="w-full max-w-[643px] mb-10">
          <label className="block text-green-400 mb-2 text-[22px] font-bold">
            Password
          </label>
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full
              h-14
              px-5
              rounded-md
              outline-none
              border border-green-300
              focus:ring-2 focus:ring-green-500
              bg-white font-light
              text-lg
            "
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
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
          "
        >
          Login
        </button>
      </form>
    </div>
  );
}
