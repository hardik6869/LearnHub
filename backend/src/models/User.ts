import crypto from "crypto";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { ASSIGNABLE_ROLES } from "../config/enums";
import type { IUser, IUserMethods, UserModel } from "../types";

const UserSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
      minlength: [3, "Name can not be less than 3 characters"],
    },
    email: {
      type: String,
      required: [true, "please addd an email"],
      unique: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please add a valid email"],
    },
    role: {
      type: String,
      enum: ASSIGNABLE_ROLES,
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Please Add a password"],
      minlength: 6,
      select: false,
    },
    // Never returned in responses; resetPassword selects them explicitly
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpire: { type: Date, select: false },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    methods: {
      // Sign JWT Token and return
      getSignedJwtToken() {
        return jwt.sign({ id: this._id }, process.env.JWT_SECRET ?? "", {
          // Value comes from config (e.g. "30d"); jsonwebtoken validates it at runtime
          expiresIn: process.env.JWT_EXPIRE as SignOptions["expiresIn"],
        });
      },

      // Match the user entered password to hashed password in database
      async matchPassword(enteredPassword: string) {
        return await bcrypt.compare(enteredPassword, this.password);
      },

      // Generate and hash password token
      getResetPasswordToken() {
        // Generate Token
        const resetToken = crypto.randomBytes(20).toString("hex");

        // hash token and set to resetPasswordToken field
        this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        // Set Expire
        this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

        return resetToken;
      },
    },
  },
);

// Encrypt password using bcrypt
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model<IUser, UserModel>("User", UserSchema);
