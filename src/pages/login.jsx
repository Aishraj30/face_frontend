import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const LoginFace = () => {
      const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [email, setEmail] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const [imgURL, setImgURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const captureLogin = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setError("Failed to capture image");
      return;
    }

    const byteString = atob(imageSrc.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    const blob = new Blob([ab], { type: "image/jpeg" });

    setImgFile(blob);
    setImgURL(URL.createObjectURL(blob));
    setError("");
  };

  const handleRetake = () => {
    setImgFile(null);
    URL.revokeObjectURL(imgURL);
    setImgURL(null);
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !imgFile) {
      setError("Please enter email and capture your face!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("image", imgFile, "profile.jpg");

      const res = await axios.post("https://face-backend-no39.onrender.com/api/user/login", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        alert("✅ Login successful!");
      } else {
        alert("❌ Face not recognized!");

      }
      navigate("/home");
    } catch (err) {
      if (err.response) {
        alert(err.response.data.message || "Login failed!");
      } else {
        alert("Network error. Check server!");
      }
      console.error(err);
    } finally {
      setLoading(false);
      setImgFile(null);
      URL.revokeObjectURL(imgURL);
      setImgURL(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Face Login</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {!imgURL ? (
            <>
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full rounded-lg border border-gray-600"
                videoConstraints={{ facingMode: "user" }}
              />
              <button
                type="button"
                onClick={captureLogin}
                className="w-full py-2 mt-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-semibold"
              >
                Capture Face
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <img
                src={imgURL}
                alt="Captured"
                className="w-48 h-48 rounded-lg object-cover border border-gray-600"
              />
              <button
                type="button"
                onClick={handleRetake}
                className="mt-2 px-4 py-1 bg-red-500 rounded-lg"
              >
                Retake
              </button>
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-green-600 hover:bg-green-500 rounded-lg font-semibold mt-2 disabled:opacity-50"
          >
            {loading ? "Checking..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginFace;
