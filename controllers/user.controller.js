import { asyncHandler } from "../src/utils/asyncHandler.js";
import { ApiError } from "../src/utils/apiError.js";
import { User } from "../src/models/user.model.js";
import { uploadOnCloudinary } from "../src/utils/cloudinary.js";
import { ApiResponse } from "../src/utils/ApiResponse.js";

//we have to bring the tokens 

const generateAcessAndRefreshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAcessToken();
        const refreshToken = user.generateRefreshToken ();

        user.refreshToken = refreshToken //from the db
        await user.save({validateBeforeSave:false}) //to save the user

        //after saving the tokens return it
        return {accessToken, refreshToken}
        
    } catch (error) {
        throw new ApiError(500, "something went wrong while generating refresh and access tokens");
    }
}

const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

        // console.log(req.body)

    const { fullName, email, userName, password } = req.body;
    //console.log("email: ", email);

    if (
        [fullName, email, userName, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ userName }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or userName already exists")
    }
    // console.log(req.files);

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;
    
    
    //this code checks if the coverimage is is empty give an empty string
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
   

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        userName: userName.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} )

const loginUser = asyncHandler(async (req, res) =>{
    // req body -> data
    //username or email
    //find the user
    //password check
    //access and refresh token
    //send cookie

    const  {userName, email, password} = req.body;

    if (!userName && !email) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{ userName }, { email }] 
    });

    if(!user){
        throw new ApiError(404, "user does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid log in credentials")
    }

    const {accessToken, refreshToken} = await generateAcessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true, 
        secure : true
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken)
    .json(new ApiResponse(
        200, 
        {
            user : loggedInUser, accessToken, refreshToken
        }, "User logged in successfully"))

})

const logoutUser = asyncHandler(async(req, res) =>{
    User.findOneAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )
    const options = {
        httpOnly:true,
        secure:false
    }

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"))



})


export {
    registerUser,
    loginUser,
    logoutUser
}