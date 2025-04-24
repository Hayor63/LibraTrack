import {
  getModelForClass,
  modelOptions,
  prop,
  Severity,
} from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class Category {
  @prop({ required: true, unique: true })
  name!: string;

  @prop({ required: true})
  description!: string;
}


const CategoryModel = getModelForClass(Category)
export default CategoryModel