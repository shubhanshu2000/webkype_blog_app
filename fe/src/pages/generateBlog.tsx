import MultiSelect from "@/components/multiSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/utils/api";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export type BlogDataType = {
  title: string;
  image: File | null;
  content: string;
  visibility: string;
  category: string;
  tags: { label: ""; value: "" }[];
};

const CreateBlog = () => {
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState<BlogDataType>({
    title: "",
    image: null,
    content: "",
    visibility: "",
    category: "",
    tags: [],
  });
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<{ label: ""; value: "" }[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    {
      setBlogData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setBlogData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", blogData.title);
    formData.append("content", blogData.content);
    formData.append("visibility", blogData.visibility);
    formData.append("category", blogData.category);
    formData.append("tags", JSON.stringify(blogData.tags));
    if (blogData.image) formData.append("image", blogData.image);

    try {
      await apiRequest("post", "/blog/create", formData);
      navigate("/home");
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const getTags = async () => {
    try {
      const data: { message: string; data: { id: ""; name: "" }[] } =
        await apiRequest("get", "/tag");
      const newData = data.data.map((d: { id: ""; name: "" }) => ({
        label: d.name,
        value: d.id,
      }));

      setTags(newData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTags();
  }, []);

  return (
    <>
      <h1 className="text-center mt-4 font-bold text-2xl">Create Blog</h1>
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex flex-col gap-4 mt-4 w-1/2 "
      >
        <Input
          type="text"
          placeholder="Title"
          className="border p-2"
          value={blogData.title}
          name="title"
          onChange={handleChange}
          required
        />
        <Input
          type="file"
          className="border p-2"
          name="image"
          onChange={handleFileChange}
          required
        />
        <Textarea
          placeholder="Content"
          className="border p-2"
          value={blogData.content}
          name="content"
          onChange={handleChange}
          required
        />
        <Select
          name="visibility"
          onValueChange={(value) =>
            setBlogData((prev) => ({ ...prev, visibility: value }))
          }
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PUBLIC">Public</SelectItem>
            <SelectItem value="PRIVATE">Private</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="text"
          placeholder="Category"
          className="border p-2"
          value={blogData.category}
          name="category"
          onChange={handleChange}
          required
        />
        <MultiSelect
          options={tags}
          placeholder="Tags"
          className="border p-2"
          value={blogData.tags}
          name="tags"
          onChange={(val) => setBlogData((prev) => ({ ...prev, tags: val }))}
          required
        />

        <Button disabled={loading} className="bg-blue-500 text-white px-4 py-2">
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </>
  );
};

export default CreateBlog;
