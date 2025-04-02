import { Outlet } from "react-router";
const AuthLayout = () => {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Welcome to Our App</h1>
        <p>Sign in or create an account to continue</p>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
