import { Request, Response } from "express";
import Expense, { IExpense } from "../models/Expense";
import Group from "../models/Group";
import { IUserRequest } from "../types/user"; // This extends Request with `user` property
import { isSubsetById } from "../utils/expense";

// @desc    Create a new expense
// @route   POST /api/groups/:groupId/expenses
// @access  Private
export const createExpense = async (req: IUserRequest, res: Response) => {
  try {
    const { description, amount, paidBy, splitBetween } = req.body;
    const groupId = req.params.groupId;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // const allMembersExist = splitBetween.every((userId: string) =>
    //   group.members.some((member) => member.toString() === userId)
    // );

    const allMembersExist = isSubsetById(group.members, splitBetween);

    if (!allMembersExist) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const expense = await Expense.create({
      description,
      amount,
      paidBy: paidBy || req.user._id,
      splitBetween: splitBetween.map((userId: string) => ({ user: userId })),
      groupId,
    });

    group.expenses.push(expense._id as (typeof group.expenses)[0]);
    await group.save();

    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all expenses for a group
// @route   GET /api/groups/:groupId/expenses
// @access  Private
export const getGroupExpenses = async (req: IUserRequest, res: Response) => {
  try {
    const expenses = await Expense.find({ groupId: req.params.groupId })
      .populate("paidBy", "name email")
      .populate("splitBetween.user", "name email");

    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Calculate balances for a group
// @route   GET /api/groups/:groupId/balance-sheet
// @access  Private
export const calculateGroupBalances = async (
  req: IUserRequest,
  res: Response
) => {
  try {
    const expenses = await Expense.find({ groupId: req.params.groupId })
      .populate("paidBy", "name email")
      .populate("splitBetween.user", "name email");

    const balances: Record<
      string,
      {
        user: any;
        paid: number;
        owes: number;
        netBalance: number;
      }
    > = {};

    expenses.forEach((expense: IExpense) => {
      const paidById = expense.paidBy._id.toString();
      const amountPerPerson = expense.amount / expense.splitBetween.length;

      if (!balances[paidById]) {
        balances[paidById] = {
          user: expense.paidBy,
          paid: 0,
          owes: 0,
          netBalance: 0,
        };
      }

      balances[paidById].paid += expense.amount;

      expense.splitBetween.forEach((split) => {
        const userId = split.user._id.toString();

        if (!balances[userId]) {
          balances[userId] = {
            user: split.user,
            paid: 0,
            owes: 0,
            netBalance: 0,
          };
        }

        balances[userId].owes += amountPerPerson;
      });
    });

    Object.keys(balances).forEach((userId) => {
      balances[userId].netBalance =
        balances[userId].paid - balances[userId].owes;
    });

    res.json(Object.values(balances));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
