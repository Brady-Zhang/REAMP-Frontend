import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/signin-api";
import { useAuth } from "../contexts/AuthContext";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth(); //  Context 里的 setUser

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login({ email, password });
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data.user);
      // console.log(JSON.parse(atob(data.token.split('.')[1])))

      const role = data.user.role;
      if (role === "Admin") {
        navigate("/dashboard");  // for testing, need to change when the dashboards finished
      } else if (role === "Agent") {
        navigate("/AgentPropertyPage");
      } else if (role === "PhotographyCompany") {
        navigate("/dashboard");
      } else {
        setError("Unknown user role");
      }

    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
     <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={handleSubmit} className=" bg-blue-100 rounded-xl shadow-lg p-4 flex-1 max-w-lg flex flex-col gap-y-10">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">Sign In</h1>
            {/* Email */}
            <div>
            <label className="block mb-1 font-medium text-xl" htmlFor="email">Email</label>
            <input
                className="w-full px-3 py-3 border border-gray-300 rounded"
                type="email"
                id="email"
                name="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            </div>
            {/* Password */}
            <div>
                <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="font-medium text-xl">Password</label>
                </div>
                <div>
                <input
                    className="w-full px-3 py-3 border border-gray-300 rounded pr-10"
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                </div>
            </div>
    
        <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded py-2 font-semibold"
            >
            Sign In
        </button>
        {error && <p className="text-red-500">{error}</p>}

            {/* Remember checkbox */}
            <div className="flex items-center">
                <input type="checkbox" id="remember" className="mr-2" />
                <label htmlFor="remember" className="text-gray-700">Remember me</label>
            </div>

            {/* Sign up link */}
            <p className="text-center text-sm mt-2">
                {"Don't have an account?"}
                <Link to="/register" className="text-blue-500 hover:underline">Sign Up</Link>
            </p>
        </form>
    </div>
    
  );
};

export default SignInPage;
