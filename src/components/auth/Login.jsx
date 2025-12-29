"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { initializeAuth } from "@/redux/slices/authSlice";
import config from "../../constant/apiRouteList";
import { login } from "@/redux/slices/authSlice";
import { privilegeConfig } from "@/constant/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import DashboardIntervalSelector from "../dashboardComponents/timePeriodSelector/DashboardIntervalSelector";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userPrivileges, setUserPrivileges] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const searchParams = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const redirect = searchParams.get("redirect");

  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${config.BASE_URL}${config.AUTH.LOGIN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        setSuccess("Login successful.");
        toast.success("Login successful!");
        setError(null);
        dispatch(login(data.token));
        setLoading(false);

        // Fetch user details after successful login
        await fetchUserDetails(data.token);
      } else {
        setError(data.message || "Invalid email or password.");
        setSuccess(null);
        toast.error(data.message || "Invalid email or password.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("An error occurred while logging in.");
      toast.error("Something went wrong.");
      setSuccess(null);
      setLoading(false);
    }
  };

  const fetchUserDetails = async (token = null) => {
    try {
      const authToken = token || localStorage.getItem("token");
      if (!authToken) return;

      const res = await fetch(`${config.BASE_URL}${config.USER.PROFILE}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        const privileges = data?.role?.privelleges?.map((p) => p.name) || [];
        setUserPrivileges(privileges);

        // if (!token) {
        //   redirectBasedOnPrivileges(privileges);
        // }
        if (redirect && redirect !== "/") {
          router.push(redirect);
        } else {
          redirectBasedOnPrivileges(privileges);
        }
      } else {
        console.error("Failed to fetch user profile");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const redirectBasedOnPrivileges = (privileges) => {
    const navItems = Object.values(privilegeConfig);
    const accessibleNavItem = navItems.find((navItem) => {
      return privileges.some(
        (privilege) =>
          privilege.toLowerCase().includes(navItem.label.toLowerCase()) ||
          navItem.label.toLowerCase().includes(privilege.toLowerCase())
      );
    });

    if (accessibleNavItem) {
      router.push(accessibleNavItem.href);
    } else {
      router.push("/dashboard");
    }
  };

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserDetails();
    }
  }, [isAuthenticated]);

  // If user details are fetched and we have privileges, redirect
  useEffect(() => {
    if (userPrivileges.length > 0 && isAuthenticated) {
      redirectBasedOnPrivileges(userPrivileges);
    }
  }, [userPrivileges, isAuthenticated]);

  if (isAuthenticated) return null;

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/suraj-cotton-login-bg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-[420px] border border-white/30 backdrop-blur-[15px] shadow-[0_0_10px_rgba(255,255,255,0.2)] text-black p-[30px] px-[40px] rounded-[20px] transition-all duration-300 ease-in-out">
        <div className="flex justify-center mb-6">
          <img
            src="/suraj-cotton-login-logo.png"
            alt="Logo"
            className="w-[140px]"
          />
        </div>
        <h2 className="text-3xl font-semibold text-center text-white mb-4">
          Login
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 border bg-white dark:bg-gray-700 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#FCC60D]"
              placeholder="Enter Email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ border: "2px solid rgba(0, 0, 0, 0.1)" }}
            />
          </div>
          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full px-4 py-3 pr-12 border bg-white dark:bg-gray-700 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#FCC60D]"
              placeholder="Enter Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ border: "2px solid rgba(0, 0, 0, 0.1)" }}
            />
            {/* Toggle button centered inside input */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300 cursor-pointer"
            >
              {showPassword ? (
                <FaEyeSlash className="" size={22} />
              ) : (
                <FaEye className="" size={22} />
              )}
            </button>
          </div>
          <button
            type="submit"
            className="w-full h-[45px] bg-gradient-to-r from-[#FCC60D] via-[#FCC60D] to-[#ffdd6f73] rounded-[40px] shadow-[0_0_10px_rgba(0,0,0,0.1)] cursor-pointer text-white font-semibold transition-all duration-500 hover:from-[#FCC60D] hover:to-[#FCC60D] hover:shadow-[0_0_15px_rgba(0,0,0,0.2)]"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {success && (
          <div className="flex items-center justify-center text-green-700 bg-green-100 border border-green-300 rounded-md mt-4 p-3 transition-all duration-300 animate-fadeIn">
            <svg
              className="w-5 h-5 mr-2 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-3.293-3.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span>{success}</span>
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center text-red-700 bg-red-100 border border-red-300 rounded-md mt-4 p-3 transition-all duration-300 animate-fadeIn">
            <svg
              className="w-5 h-5 mr-2 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.366-.446.962-.506 1.414 0l6 7a1 1 0 01-1.414 1.414L10 6.414 5.743 11.513a1 1 0 01-1.414-1.414l6-7z"
                clipRule="evenodd"
              ></path>
              <path
                fillRule="evenodd"
                d="M10 18a1 1 0 01-.707-.293l-6-6a1 1 0 011.414-1.414L10 15.586l5.293-5.293a1 1 0 111.414 1.414l-6 6A1 1 0 0110 18z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
