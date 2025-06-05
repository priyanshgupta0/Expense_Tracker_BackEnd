import mongoose, { Document, Schema, model } from "mongoose";

export interface ISplit {
  user: mongoose.Types.ObjectId;
  share: number;
}

export interface IExpense extends Document {
  description: string;
  amount: number;
  paidBy: mongoose.Types.ObjectId;
  splitBetween: ISplit[];
  groupId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const expenseSchema = new Schema<IExpense>({
  description: {
    type: String,
    required: [true, "Please add a description"],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, "Please add an amount"],
    min: [0, "Amount cannot be negative"],
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  splitBetween: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      share: {
        type: Number,
        required: true,
        default: 0,
      },
    },
  ],
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Calculate shares before saving
expenseSchema.pre("save", function (next) {
  const totalMembers = this.splitBetween.length;
  const sharePerPerson = this.amount / totalMembers;

  this.splitBetween.forEach((split) => {
    split.share = sharePerPerson;
  });

  next();
});

// Populate references when querying
expenseSchema.pre(/^find/, function (next) {
  (this as mongoose.Query<any, any>)
    .populate({
      path: "paidBy",
      select: "name email",
    })
    .populate({
      path: "splitBetween.user",
      select: "name email",
    });

  next();
});

export default model<IExpense>("Expense", expenseSchema);
