import { DocumentType } from "@typegoose/typegoose";
import UserModel, { User } from "../models/user";

export default class userRepo {
  static createUser: (user: Omit<User, "role">) => Promise<DocumentType<User>> =
    async (user) => {
      return UserModel.create(user);
    };

  //find by Id
  static findById = async (id: string) => {
    return await UserModel.findById(id);
  };

  //find by Email
  static findByEmail: (email: string) => Promise<DocumentType<User> | null> =
    async (email) => {
      return await UserModel.findOne({ email });
    };

  // Find by UserName
  static findByUserName = async (
    userName: string
  ): Promise<DocumentType<User> | null> => {
    return UserModel.findOne({ userName }).exec();
  };

  //update user
  static updateUser: (
    id: string,
    updateParams: Partial<User> // Keep role in the type
  ) => Promise<Omit<User, "password" | "role"> | null> = async (
    id,
    updateParams
  ) => {
    const { password, role, ...rest } = updateParams; // Manually remove role

    const user = await UserModel.findById(id);
    if (!user) return null;

    if (password) {
      user.password = password;
      await user.save();
    }

    const updatedUser = await UserModel.findByIdAndUpdate(id, rest, {
      new: true,
    });
    return updatedUser ? updatedUser.toObject() : null;
  };

  //   delete user
  static deleteUser = async (id: string) => {
    return await UserModel.findByIdAndDelete(id);
  };
}
