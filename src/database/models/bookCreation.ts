import {
    getModelForClass,
    modelOptions,
    prop,
    Ref,
    Severity,
  } from "@typegoose/typegoose";
  import { Category } from "./category";
  import { Genre } from "./genre";
import { User } from "./user";
  
  @modelOptions({
    schemaOptions: {
      timestamps: true,
    },
    options: {
      allowMixed: Severity.ALLOW,
    },
  })
  export class BookCreation {
    @prop({ ref: () => User, required: true })
    userId!: Ref<User>;

    @prop({ required: true })
    title!: string;
  
    @prop({ required: true })
    author!: string;
  
    @prop({ ref: () => Category, required: true })
    categoryId!: Ref<Category>;
  
    @prop({ ref: () => Genre, required: true })
    genreId!: Ref<Genre>;
  
    @prop({ required: true })
    publicationYear!: number;
  
    @prop({ required: true })
    totalCopies!: number; 
  
    @prop({ required: true, default: function (this: BookCreation) { return this.totalCopies; } })
    copiesAvailable!: number; 
  
    @prop({ required: true, default: false })
    isReserved!: boolean;
  }
  
  const BookCreationModel = getModelForClass(BookCreation);
  export default BookCreationModel;
  