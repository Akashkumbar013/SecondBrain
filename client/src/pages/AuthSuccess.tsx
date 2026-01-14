import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { auth } from "../utils/auth";

function AuthSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get("token");
        const userStr = searchParams.get("user");
        const redirect = searchParams.get("redirect");

        if (token && userStr) {
            // Save auth data in cookies
            const user = JSON.parse(userStr);
            auth.setAuth(token, user);
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
