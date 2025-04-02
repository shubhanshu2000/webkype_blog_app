import { Outlet } from "react-router";
const AuthLayout = () => {
  return (
    <div className="auth-container">
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
