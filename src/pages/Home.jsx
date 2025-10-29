// Home.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-gray-900 flex flex-col items-center justify-center p-8">
      {/* App Title */}
      <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-6 text-center">
        Face Recognition App
      </h1>

      {/* Description */}
      <p className="text-gray-300 text-lg md:text-xl mb-12 text-center max-w-2xl">
        Welcome! Use face recognition to securely register or login. Fast, easy, and safe.
      </p>

      {/* Buttons */}
      <div className="flex flex-col md:flex-row gap-8">
        <button
          onClick={() => navigate("/")}
          className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-3xl font-semibold text-lg shadow-lg transition-transform transform hover:scale-105"
        >
          Register
        </button>
        <button
          onClick={() => navigate("/login")}
          className="px-10 py-4 bg-green-600 hover:bg-green-500 text-white rounded-3xl font-semibold text-lg shadow-lg transition-transform transform hover:scale-105"
        >
          Login
        </button>
      </div>

      {/* Illustration */}
    
    </div>
  );
};

export default Home;
