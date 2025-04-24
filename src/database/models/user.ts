import {
  DocumentType,
  getModelForClass,
  modelOptions,
  pre,
  prop,
  Severity,
} from "@typegoose/typegoose";
import * as argon2 from "argon2";

export const privateFields = ["password", "__v"];

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        privateFields.forEach((field) => delete ret[field]);
      },
    },
    toObject: {
      transform: function (doc, ret) {
        privateFields.forEach((field) => delete ret[field]);
      },
    },
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
@pre<User>("save", async function () {
  if (!this.isModified("password")) return;
  const hash = await argon2.hash(this.password);
  this.password = hash;
  return;
})
export class User {
  @prop({ required: true, unique: true })
  userName!: string;

  @prop({ required: true })
  password!: string;

  @prop({ required: true, unique: true })
  email!: string;

  @prop({ required: true, enum: ["user", "admin"], default: "user" })
  role!: "user" | "admin";

  // Verify password method
  async verifyPassword(
    this: DocumentType<User>,
    candidatePassword: string
  ): Promise<boolean> {
    return argon2.verify(this.password, candidatePassword);
  }
}

const UserModel = getModelForClass(User);
export default UserModel;
