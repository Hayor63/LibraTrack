import {
    getModelForClass,
    modelOptions,
    prop,
    Ref,
    Severity,
  } from "@typegoose/typegoose";
  import { User } from "./user";
  import { BookCreation } from "./bookCreation";
  
  @modelOptions({
    schemaOptions: {
      timestamps: true,
    },
    options: {
      allowMixed: Severity.ALLOW,
    },
  })
  export class Borrow {
    @prop({ ref: () => User, required: true })
    userId!: Ref<User>;
  
    @prop({ ref: () => BookCreation, required: true })
    bookId!: Ref<BookCreation>;
  
    @prop({ default: () => new Date() }) 
    borrowDate!: Date;
  
    @prop({ default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), required: true }) 
    dueDate!: Date;
  
    @prop() 
    returnDate?: Date;
  
    @prop({ default: false }) 
    isReturned!: boolean;
  
    @prop({ default: 0 })
    lateFee?: number;
  }
  
  const BorrowModel = getModelForClass(Borrow);
  export default BorrowModel;
  