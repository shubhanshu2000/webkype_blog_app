import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/utils/api";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

type userData = {
  token: string;
  name: string;
  id: string;
};

const Login = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user: userData = await apiRequest("post", "/auth/login", userData);
      localStorage.setItem("token", user.token as string);
      localStorage.setItem("name", user.name as string);
      localStorage.setItem("id", user.id as string);
      navigate("/home");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData((prev: typeof userData) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold">Admin Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
        <Input
          type="username"
          placeholder="User Name"
          className="border p-2"
          value={userData.username}
          onChange={handleChange}
          name="username"
          required
        />
        <Input
          type="password"
          placeholder="Password"
          className="border p-2"
          value={userData.password}
          onChange={handleChange}
          name="password"
          required
        />
        <Button disabled={loading} className="bg-blue-500 text-white px-4 py-2">
          {loading ? "Loggin in..." : "Login"}
        </Button>
      </form>
    </div>
  );
};

export default Login;
