import { Request, Response } from "express";
import Group from "../models/Group";
import User from "../models/User";
import "../models/Expense";
import { AuthRequest } from "../middleware/authMiddleware";

// @desc    Create a new group
// @route   POST /api/groups
// @access  Private
export const createGroup = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const members = [userId];

    const group = await Group.create({
      name,
      members,
      createdBy: userId,
    });

    await User.updateMany(
      { _id: { $in: members } },
      { $push: { groups: group._id } }
    );

    res.status(201).json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all groups for a user
// @route   GET /api/groups
// @access  Private
export const getGroups = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?._id;

    const groups = await Group.find({ members: userId })
      .populate("members", "name email")
      .populate("expenses");
    console.log(groups, "Groups fetched for user:", userId);
    res.json(groups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single group by ID
// @route   GET /api/groups/:id
// @access  Private
export const getGroupById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("members", "name email")
      .populate("expenses");

    if (!group) {
      res.status(404).json({ message: "Group not found" });
      return;
    }

    const userId = req.user?._id;
    const isMember = group.members.some((member) =>
      (member as any)._id.equals(userId)
    );

    if (!isMember) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    res.json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Add member to group
// @route   POST /api/groups/:groupId/users
// @access  Private
export const addMember = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;
    const group = await Group.findById(req.params.groupId);

    if (!group) {
      res.status(404).json({ message: "Group not found" });
      return;
    }

    const userId = req.user?._id;
    const isMember = group.members.some((member) =>
      (member as any)._id.equals(userId)
    );

    if (!isMember) {
      res.status(401).json({ message: "Not authorized" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const alreadyInGroup = group.members.some((member) =>
      (member as any)._id.equals(user._id)
    );

    if (alreadyInGroup) {
      res.status(400).json({ message: "User already in group" });
      return;
    }

    group.members.push(user._id as (typeof group.members)[0]);
    await group.save();

    user.groups.push(group._id as (typeof user.groups)[0]);
    await user.save();

    res.json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
