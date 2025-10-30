// Register.jsx
import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {

     const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const [imgURL, setImgURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  

  // Capture photo from webcam
  const capture = () => {
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
    setImgURL(null);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullname || !email || !imgFile) {
      setError("Please fill all fields and capture an image");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("fullname", fullname);
      formData.append("email", email);
      formData.append("image", imgFile, "profile.jpg");

      const response = await axios.post(
        "https://face-backend-4.onrender.com/api/user/register",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("✅ Registration successful!");
      setFullname("");
      setEmail("");
      setImgFile(null);
      setImgURL(null);
       navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Registration failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = !fullname || !email || !imgFile || loading;

  return (<div className="min-h-screen flex items-center justify-center bg-gray-900 p-10">
  <div className="w-full max-w-lg bg-gray-800 rounded-3xl p-10 shadow-2xl">
    <h1 className="text-4xl font-bold text-white text-center mb-6">Register</h1>
    <p className="text-gray-400 text-center mb-8">
      Fill details and capture your face to register
    </p>

    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Webcam Capture */}
      <div className="space-y-4">
        <label className="block text-gray-300 font-medium text-lg">Face Image</label>
        {!imgURL ? (
          <div className="border-2 border-dashed border-gray-600 rounded-xl overflow-hidden">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full rounded-xl"
              videoConstraints={{ facingMode: "user" }}
            />
            <button
              type="button"
              onClick={capture}
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl text-lg font-medium"
            >
              Capture Image
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <img
              src={imgURL}
              alt="Captured"
              className="w-56 h-56 object-cover rounded-xl border-2 border-gray-700"
            />
            <button
              type="button"
              className="bg-red-600 hover:bg-red-500 px-6 py-3 rounded-xl text-lg font-medium"
              onClick={handleRetake}
            >
              Retake
            </button>
          </div>
        )}
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-gray-300 font-medium text-lg">Full Name</label>
        <input
          type="text"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
          placeholder="Enter your full name"
          className="w-full mt-2 px-5 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-gray-300 font-medium text-lg">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full mt-2 px-5 py-3 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder-gray-400 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Submit */}
      <button
        type="submit"
        disabled={isDisabled}
        className="w-full bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl text-lg font-medium disabled:opacity-50 mt-4"
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  </div>
</div>

  );
};

export default Register;
