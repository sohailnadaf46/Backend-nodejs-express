import mongoose, { Schema }  from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    subscriber:{
      type:Schema.Types.ObjectId, //from user
      ref:"User"
    },
    channel:{
      type:Schema.Types.ObjectId,
      ref:"User"
    }
  }, {timestamps})

  export const Subscription = mongoose.model("Subscription", subscriptionSchema)