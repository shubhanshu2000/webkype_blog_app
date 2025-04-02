/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest } from "@/utils/api";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    password: "",
    email: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiRequest("post", "/auth/register", userData);
      navigate("/login");
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
      <h2 className="text-2xl font-bold">Admin Register</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
        <Input
          type="text"
          placeholder="Name"
          className="border p-2"
          value={userData.name}
          name="name"
          onChange={handleChange}
          required
        />
        <Input
          type="text"
          placeholder="Username"
          className="border p-2"
          value={userData.username}
          name="username"
          onChange={handleChange}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          className="border p-2"
          value={userData.email}
          onChange={handleChange}
          name="email"
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
        <Select
          name="role"
          onValueChange={(value) =>
            setUserData((prev) => ({ ...prev, role: value }))
          }
          required
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="USER">User</SelectItem>
          </SelectContent>
        </Select>
        <Button disabled={loading} className="bg-blue-500 text-white px-4 py-2">
          {loading ? "Registering..." : "Register"}
        </Button>
      </form>
    </div>
  );
};

export default Register;
