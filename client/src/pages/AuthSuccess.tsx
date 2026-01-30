import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function AuthSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get("token");
        if (token) {
            localStorage.setItem("token", token);
            navigate("/dashboard");
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
