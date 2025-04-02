import { Prisma, PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import path from "path";

const prisma = new PrismaClient();

const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await prisma.user.findUnique({
      where: { id: Number(req.user.id) },
      omit: {
        password: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!data) {
      return next({ statusCode: 404, message: "User not found" });
    }

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, username, password, role } = req.body;

    const user = await prisma.user.update({
      where: { id: Number(req.user.id) },
      data: {
        name,
        email,
        username,
        password,
        role,
        updatedAt: new Date(),
      },
      omit: {
        password: true,
      },
    });

    if (!user) {
      return next({ statusCode: 404, message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const listUserBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;

    // Allow dynamic sorting with fallback to createdAt desc
    const sortField = (req.query.sortField as string) || "createdAt";
    const sortOrder = (req.query.sortOrder as "asc" | "desc") || "desc";
    const orderBy = { [sortField]: sortOrder as Prisma.SortOrder };

    // Create base where condition with authorId
    const where: Prisma.BlogWhereInput = {
      authorId: Number(req.user.id),
    };

    // Add optional title search if provided
    if (req.query.search) {
      where.title = {
        contains: req.query.search as string,
      };
    }

    // Use Prisma transaction for consistent results
    const [blogs, totalCount] = await prisma.$transaction([
      prisma.blog.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        where,
        orderBy,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          tags: true,
        },
      }),
      prisma.blog.count({ where }),
    ]);

    const baseUrl = `${req.protocol}://${req.get("host")}/uploads`;
    const blogsWithUrls = blogs.map((blog) => ({
      ...blog,
      imageUrl: blog.imageUrl
        ? `${baseUrl}/${path.basename(blog.imageUrl)}`
        : null,
    }));

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    res.status(200).json({
      message: "User blogs fetched successfully",
      data: blogsWithUrls,
      meta: {
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        // Include next/prev page numbers for easier navigation
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPreviousPage ? page - 1 : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

export { getProfile, updateProfile, deleteUser, listUserBlogs };
