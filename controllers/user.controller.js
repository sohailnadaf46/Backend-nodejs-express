import { asyncHandler } from "../src/utils/asyncHandler.js";
import { ApiError } from "../src/utils/apiError.js";
import { User } from "../src/models/user.model.js";
import { uploadOnCloudinary } from "../src/utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  //get details from the frontent
  // validation - not empty
  //check if the user already exists : username, email
  //check for images, check for avatar
  //upload them to clouldinary , avatar
  // create user object - create entry in database
  // remove passoword and refeswh token field from response
  // check  for user creation
  // return response

  const { fullName, email, userName, password } = req.body;
  console.log("email", email);

  if (
    [fullName, email, userName, password].some((fields) => fields.trim === "")
  ) {
    throw new ApiError(404, "All the fields are required");
  }

  const existedUser = User.findOne({
    $or: [{ userName} , { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email address or name already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if(avatarLocalPath){
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

const user = await User.create({
  fullName,
  avatar:avatar.url,
  coverImage:coverImage?.url || "",
  email,
  password,
  username:userName.toLowerCase()
 });

 const createdUser = await User.findById(user._id).select(
  "-password -refreshToken"
 )

});

export { registerUser, }
