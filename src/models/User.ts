import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";

// Define the interface for a User document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  groups: mongoose.Types.ObjectId[];
  createdAt: Date;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

// Define the Mongoose schema
const userSchema: Schema<IUser> = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },
  groups: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to hash the password if it's modified
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to match passwords
userSchema.methods.matchPassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create and export the model
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
