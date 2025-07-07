import { useEffect } from "react";
import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import axios from "../axios";

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();


useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");

    if (token) {
      axios.get(`/api/auth/verify-email/${token}`)
        .then(() => {
          navigate('/email-verified')
        })
        .catch((err) => {
          console.error("Verification failed", err);
        });
    }
  }, [location]);

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-b from-gray-900 to-black text-white">
      <h2 className="text-2xl font-bold animate-pulse">Verifying your email...</h2>
      {/* Optional Lottie or animation */}
    </div>
  );
}

export default VerifyEmail;
