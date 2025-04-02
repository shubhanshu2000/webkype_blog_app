import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import path from "path";

const prisma = new PrismaClient();

// const listBlogs = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const page = Number(req.body.page) || 1;
//     const pageSize = Number(req.body.pageSize) || 10;
//     const skip = (page - 1) * pageSize;

//     const where = req.body.where || {};
//     const orderBy = req.body.orderBy || { createdAt: "desc" };

//     const blogs = await prisma.blog.findMany({
//       skip: skip,
//       take: pageSize,
//       where: where,
//       orderBy: orderBy,
//       include: {
//         author: { select: { name: true, email: true } },
//         tags: true,
//       },
//     });

//     const totalCount = await prisma.blog.count({ where: where });
//     const baseUrl = `${req.protocol}://${req.get("host")}/uploads`;
//     const blogsWithUrls = blogs.map((blog) => ({
//       ...blog,
//       imageUrl: blog.imageUrl
//         ? `${baseUrl}/${path.basename(blog.imageUrl)}`
//         : null,
//     }));

//     res.status(200).json({
//       message: "Blogs fetched successfully",
//       data: blogsWithUrls,
//       meta: {
//         page: page,
//         pageSize: pageSize,
//         totalCount: totalCount,
//         totalPages: Math.ceil(totalCount / pageSize),
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const listBlogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 5;
    const skip = (page - 1) * pageSize;

    const { visibility, category, tags } = req.query;
    let where: any = {};

    if (visibility) where.visibility = visibility;
    if (category) where.category = category;
    if (tags) {
      const tagIds = (tags as string).split(",").map((id) => Number(id));
      where.tags = { some: { id: { in: tagIds } } };
    }

    const blogs = await prisma.blog.findMany({
      skip,
      take: pageSize,
      where,
      include: {
        author: { select: { name: true, email: true } },
        tags: true,
      },
    });

    const totalCount = await prisma.blog.count({ where });
    const baseUrl = `${req.protocol}://${req.get("host")}/uploads`;
    const blogsWithUrls = blogs.map((blog) => ({
      ...blog,
      imageUrl: blog.imageUrl
        ? `${baseUrl}/${path.basename(blog.imageUrl)}`
        : null,
    }));

    res.status(200).json({
      message: "Blogs fetched successfully",
      data: blogsWithUrls,
      meta: {
        page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getBlogById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const blog = await prisma.blog.findUnique({
      where: { id: Number(id) },
      include: {
        author: { select: { name: true, email: true } },
        tags: true,
      },
    });

    if (!blog) {
      return next({ statusCode: 404, message: "Blog not found" });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}/uploads`;
    const blogsWithUrl = {
      ...blog,
      imageUrl: blog.imageUrl
        ? `${baseUrl}/${path.basename(blog.imageUrl)}`
        : null,
    };
    res.status(200).json({
      message: "Blog fetched successfully",
      data: blogsWithUrl,
    });
  } catch (error) {
    next(error);
  }
};

const createBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, content, visibility, category, tags } = req.body;
    const imageUrl = req.file ? req.file.path : null;

    const newBlog = await prisma.blog.create({
      data: {
        title,
        content,
        imageUrl,
        visibility,
        category,
        author: {
          connect: { id: req.user.id },
        },
        tags: {
          connect: JSON.parse(tags).map(
            (tag: { label: string; value: number }) => ({
              id: Number(tag.value),
            })
          ),
        },
      },
      include: {
        author: { select: { name: true, email: true } },
        tags: true,
      },
    });

    res
      .status(201)
      .json({ message: "Blog created successfully", data: newBlog });
  } catch (error) {
    next(error);
  }
};

const updateBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, content, visibility, category, tags } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const blog = await prisma.blog.findUnique({
      where: { id: Number(id) },
      include: { tags: true },
    });

    if (!blog) {
      return next({ statusCode: 404, message: "Blog not found" });
    }

    const updatedBlog = await prisma.blog.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        content,
        imageUrl,
        visibility,
        category,
        tags: {
          disconnect: tags ? blog.tags.map((tag) => ({ id: tag.id })) : [],
          connect: tags
            ? JSON.parse(tags).map((tag: { label: string; value: number }) => ({
                id: Number(tag.value),
              }))
            : [],
        },
      },
      // include: {
      //   author: true,
      //   tags: true,
      // },
    });
    res
      .status(200)
      .json({ id: updatedBlog.id, message: "Blog updated successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const blog = await prisma.blog.findUnique({
      where: { id: Number(id) },
    });

    if (!blog) {
      return next({ statusCode: 404, message: "Blog not found" });
    }

    const deletedBlog = await prisma.blog.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({
      id: deletedBlog.id,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export { listBlogs, getBlogById, createBlog, updateBlog, deleteBlog };
