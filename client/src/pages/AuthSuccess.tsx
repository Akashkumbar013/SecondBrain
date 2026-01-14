import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function AuthSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get("token");
        const redirect = searchParams.get("redirect");

        if (token) {
            localStorage.setItem("token", token);
            // Redirect to the intended page or dashboard
            navigate(redirect || "/dashboard");
        } else {
            navigate("/login");
        }
    }, [searchParams, navigate]);

    return (
        <div className="flex h-screen items-center justify-center bg-black text-white">
            <p>Authenticating...</p>
        </div>
    );
}

export default AuthSuccess;
