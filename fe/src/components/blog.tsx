import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import MultiSelect from "./multiSelect";
import { Globe, Pencil } from "lucide-react";
import { BlogDataType } from "@/pages/generateBlog";
import { apiRequest } from "@/utils/api";
import { toast } from "sonner";

const Blog = ({ data, editable }) => {
  const [blogData, setBlogData] = useState<BlogDataType>({
    title: data?.title,
    image: null,
    content: data.content,
    visibility: data.visibility,
    category: data.category,
    tags: data.tags.map((tag) => ({ label: tag.name, value: tag.id })),
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tags, setTags] = useState<{ label: ""; value: "" }[]>([]);
  const [loading, setLoading] = useState(false);

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
      await apiRequest("patch", `/blog/${data.id}/edit`, formData);
      setIsDialogOpen(false);
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
      <div className="border-2 mt-2 px-4 py-2">
        <div className="flex justify-between">
          <div>
            <h2 className="text-lg font-semibold">{data.title}</h2>
            <p>{data.content}</p>
          </div>
          <div className="flex gap-2 items-center">
            {data.visibility === "PUBLIC" ? <Globe /> : ""}
            {editable ? (
              <Pencil
                onClick={() => {
                  setIsDialogOpen(true);
                  console.log(data, "dsayj");
                }}
              />
            ) : (
              ""
            )}
          </div>
        </div>

        <img
          className="my-2 w-full h-96 object-cover rounded-md"
          src={data.imageUrl}
          alt="Blog Image"
        />

        <p>
          <span className="font-semibold">Category: </span> {data.category}
        </p>
        <p>
          <span className="font-semibold">Author: </span> {data.author.name}
        </p>
        <p className="flex gap-2 flex-wrap">
          {data?.tags?.map(({ name }) => (
            <span
              key={name}
              className="bg-gray-400 px-4 py-1 rounded-2xl shadow-2xl"
            >
              #{name}
            </span>
          ))}
        </p>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={() => setIsDialogOpen(false)}>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>Edit Blog</DialogTitle>
            <DialogDescription>
              Make changes to your blog here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
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
            />
            <Input
              type="file"
              className="border p-2"
              name="image"
              onChange={handleFileChange}
            />
            <Textarea
              placeholder="Content"
              className="border p-2"
              value={blogData.content}
              name="content"
              onChange={handleChange}
            />
            <Select
              name="visibility"
              onValueChange={(value) =>
                setBlogData((prev) => ({ ...prev, visibility: value }))
              }
              value={blogData.visibility}
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
            />
            <MultiSelect
              options={tags}
              placeholder="Tags"
              className="border p-2"
              value={blogData.tags}
              name="tags"
              onChange={(val) =>
                setBlogData((prev) => ({
                  ...prev,
                  tags: val,
                }))
              }
            />

            <Button
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2"
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Blog;
