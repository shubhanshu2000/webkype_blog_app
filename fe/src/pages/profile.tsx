import Blog from "@/components/blog";
import MultiSelect from "@/components/multiSelect";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/utils/api";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: "",
    username: "",
    password: "",
    email: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [userBlogs, setUserBlogs] = useState([]);

  const getProfileData = async () => {
    try {
      const data = await apiRequest("get", `/user/profile`);
      setProfileData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getUserBlogs = async () => {
    try {
      const data = await apiRequest("get", `/user/profile/blogs`);
      setUserBlogs(data?.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData((prev: typeof profileData) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiRequest("patch", "/user/profile/edit", profileData);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };
  useEffect(() => {
    getProfileData();
    getUserBlogs();
  }, []);

  return (
    <div>
      <Tabs defaultValue="profile" className="mt-2 mx-auto w-3/4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="blogs">Blogs</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Make changes to your profile here. Click save when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={profileData?.name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  value={profileData.username}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={profileData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-1 ">
                <Label htmlFor="role">Role</Label>
                <Select
                  name="role"
                  onValueChange={(value) =>
                    setProfileData((prev) => ({ ...prev, role: value }))
                  }
                  value={profileData.role}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="USER">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button disabled={loading} onClick={handleProfileUpdate}>
                {loading ? "Saving..." : "Save"}
              </Button>
              <Button onClick={logout}>Logout</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="blogs">
          <Card>
            <CardHeader>
              <CardTitle>Blogs</CardTitle>
              <CardDescription>
                Update your blogs and click on save to update.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 w-full">
              <div>
                {userBlogs.map((blog) => (
                  <React.Fragment key={blog["id"]}>
                    <Blog editable={true} data={blog} />
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>{" "}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
