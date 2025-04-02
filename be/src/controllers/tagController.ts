import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();

const listTags = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tags = await prisma.tag.findMany({
      select: { id: true, name: true },
    });

    res.status(200).json({ message: "Tags fetched successfully", data: tags });
  } catch (error) {
    next(error);
  }
};

const createTag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;

    const newTag = await prisma.tag.create({
      data: {
        name,
      },
    });

    res.status(201).json({
      data: newTag,
      message: "Tag created successfully",
    });
  } catch (error) {
    next(error);
  }
};

const editTag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const tag = await prisma.tag.findUnique({
      where: { id: Number(id) },
    });

    if (!tag) {
      return next({ statusCode: 404, message: "Tag not found" });
    }

    const updatedTag = await prisma.tag.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
      },
    });

    res.status(200).json({
      data: updatedTag,
      message: "Tag updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deleteTag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Check if tag exists
    const tag = await prisma.tag.findUnique({
      where: { id: Number(id) },
    });

    if (!tag) {
      return next({ statusCode: 404, message: "Tag not found" });
    }

    // Check if tag is associated with any blogs
    const tagWithBlogs = await prisma.tag.findUnique({
      where: { id: Number(id) },
      include: { blogs: true },
    });

    if (tagWithBlogs?.blogs.length! > 0) {
      return next({
        statusCode: 400,
        message: "Cannot delete tag that is associated with blogs",
      });

      //  Disconnect the tag from all blogs before deleting
      // await prisma.tag.update({
      //   where: { id: Number(id) },
      //   data: { blogs: { set: [] } },
      // });
    }

    const deletedTag = await prisma.tag.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({
      id: deletedTag.id,
      message: "Tag deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export { listTags, createTag, editTag, deleteTag };
