import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

//this is used to verify the token && just for reference
//the reason to verify the token and debug is because user gets the encrypted token and the one have is in the databasse we have to match those to proceed further

export const verifyJWT = asyncHandler(async (req, res, next) =>{
 try {
   const token = req.cookies?.accessToken || req.header("Authorisation")?.replace("Bearer ", "")

   console.log(token);
 
   if(!token){
     throw new ApiError(401, "Unauthorised request")
   }
 
   const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
 
   const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
 
   if(!user){
     throw new ApiError(401, "Invalid Acesss Token")
   }
   req.user = user
   next();
 } catch (error) {
   throw new ApiError(401, error?.message || "invalid acccess");
 }
})