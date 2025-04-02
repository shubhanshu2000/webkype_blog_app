/* eslint-disable @typescript-eslint/no-explicit-any */
import Blog from "@/components/blog";
import { apiRequest } from "@/utils/api";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MultiSelect from "@/components/multiSelect";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [tags, setTags] = useState<{ label: string; value: string }[]>([]);
  const [filters, setFilters] = useState({
    visibility: "",
    tags: [] as { label: string; value: string }[],
  });

  const getBlogs = async () => {
    try {
      const queryParams = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        ...(filters.visibility && { visibility: filters.visibility }),
        ...(filters.tags.length && {
          tags: filters.tags.map((tag) => tag.value).join(","),
        }),
      });

      const data = await apiRequest("get", `/blog?${queryParams.toString()}`);
      setBlogs(data.data);
      setTotalPages(data.meta.totalPages);
    } catch (error) {
      console.error(error);
    }
  };

  const getTags = async () => {
    try {
      const tagData = await apiRequest("get", "/tag");
      setTags(
        tagData.data.map((tag: { id: number; name: string }) => ({
          label: tag.name,
          value: String(tag.id),
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTags();
    getBlogs();
  }, [page, filters]);

  const handleFilterChange = (key: string, value: string | any[]) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "ALL" ? "" : value,
    }));
    setPage(1);
  };

  return (
    <div className="w-3/4 mx-auto">
      {/* Filtering Options */}
      <div className="flex gap-4 my-4">
        {/* Visibility Filter */}
        <Select
          value={filters.visibility}
          onValueChange={(value) => handleFilterChange("visibility", value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="PUBLIC">Public</SelectItem>
            <SelectItem value="PRIVATE">Private</SelectItem>
          </SelectContent>
        </Select>

        {/* Tags Filter */}
        <MultiSelect
          options={tags}
          placeholder="Filter by Tags"
          className="border p-2"
          value={filters.tags}
          name="tags"
          onChange={(val) => handleFilterChange("tags", val)}
        />
      </div>

      {/* Blog List */}
      {blogs.map((blog) => (
        <React.Fragment key={blog["id"]}>
          <Blog editable={false} data={blog} />
        </React.Fragment>
      ))}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 gap-4">
        <Button
          disabled={page <= 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Home;
