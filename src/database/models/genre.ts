import {
  DocumentType,
  getModelForClass,
  modelOptions,
  pre,
  prop,
  Ref,
  Severity,
} from "@typegoose/typegoose";
import { Category } from "./category";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Genre {
  @prop({ ref: () => Category, required: true })
  categoryId!: Ref<Category>;

  @prop({ required: true })
  name!: string;

}

const GenreModel = getModelForClass(Genre)
export default GenreModel
