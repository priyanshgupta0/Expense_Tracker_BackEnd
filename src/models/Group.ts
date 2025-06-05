import mongoose, { Schema, Document, Model, Types } from "mongoose";
import "./Expense";

export interface IGroup extends Document {
  name: string;
  members: Types.ObjectId[];
  expenses: Types.ObjectId[];
  createdBy: Types.ObjectId;
  createdAt: Date;
}

const groupSchema: Schema<IGroup> = new Schema<IGroup>({
  name: {
    type: String,
    required: [true, "Please add a group name"],
    trim: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  expenses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Expense",
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-populate members and expenses when finding
groupSchema.pre(
  /^find/,
  function (this: mongoose.Query<IGroup[], IGroup>, next) {
    this.populate({
      path: "members",
      select: "name email",
    }).populate({
      path: "expenses",
      select: "description amount paidBy splitBetween createdAt",
    });
    next();
  }
);

const Group: Model<IGroup> = mongoose.model<IGroup>("Group", groupSchema);
export default Group;
