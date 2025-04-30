import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import axios from "axios";
import mongoose from "mongoose";
import { response } from "express";
import { User } from "../models/user.model.js";
import { ServiceProvider } from "../models/serviceProvider.js";
import { JobPost } from "../models/jobPost.model.js";
import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import { Location } from "../models/location.model.js";
import Feedback from "../models/feedback.model.js";
import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import { getReceiverSocketId, io } from "../Socket/socket.js";

const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const __dirname = path.resolve("../");
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    businessName,
    password,
    userType,
    contact,
    zipcode,
    state,
    city,
    skills,
  } = req.body;
  console.log(req.body);

  if (
    [fullName, email, password, userType, contact, zipcode, state, city].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ businessName }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  // console.log(req.files);

  // const avatarLocalPath = req.files?.avatar[0]?.path;
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;

  // let coverImageLocalPath;
  // if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
  //     coverImageLocalPath = req.files.coverImage[0].path
  // }

  // if (!avatarLocalPath) {
  //     throw new ApiError(400, "Avatar file is required")
  // }

  // const avatar = await uploadOnCloudinary(avatarLocalPath)
  // const coverImage = await uploadOnCloudinary(coverImageLocalPath)

  const user = await User.create({
    fullName,
    email,
    password,
    businessName,
    userType,
    contact,
    zipcode,
    state,
    city,
    skills,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  const response = res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
  console.log("User registered Successfully");

  return response;
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, businessName, password } = req.body;

  if (!email && !businessName) {
    throw new ApiError(400, "Email or Username is required");
  }

  if (!password) {
    throw new ApiError(401, "Password is required");
  }

  const user = await User.findOne({
    $or: [{ businessName }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(402, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  const response = res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
          userType: user.userType,
        },
        "User logged In Successfully"
      )
    );

  console.log("User Logged in Successfully");

  return response;
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  const response = res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));

  console.log("User logged Out");

  return response;
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) throw new ApiError(401, "Invalid Old Password");

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  const response = res
    .status(200)
    .json(new ApiResponse(200, {}, "Password is changed successfully"));
  console.log("Password Changed Successfully");
  return response;
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, users, "All users fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;
  console.log(req.body);
  console.log(fullName, email);

  if (!fullName || !email) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email: email,
      },
    },
    { new: true }
  ).select("-password");

  const response = res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));

  console.log("Account details updated successfully");

  return response;
});

// TODO: make a utility function that deletes the previous avatar from cloudinary fr.
const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) throw new ApiError(400, "Avatar File is missing");

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) throw new ApiError(400, "Error while uploading avatar");

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User Avatar Updated Successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverLocalPath = req.file?.path;

  if (!coverLocalPath) throw new ApiError(400, "CoverImage File is missing");

  const cover = await uploadOnCloudinary(coverLocalPath);

  if (!cover.url) throw new ApiError(400, "Error while uploading CoverImage");

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        cover: cover.url,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User CoverImage Updated Successfully"));
});

const searchUsersByQuery = asyncHandler(async (req, res) => {
  // console.log(req.query.query);
  const query = req.query.query || "";
  const currentUserId = req.user._id;

  if (query.trim() === "") {
    return res.status(200).json(new ApiResponse(400, [], "Query is required"));
  }

  const users = await User.find({
    $and: [
      { userType: "serviceProvider" },
      { _id: { $ne: currentUserId } },
      {
        $or: [
          { fullName: { $regex: ".*" + query + ".*", $options: "i" } },
          { email: { $regex: ".*" + query + ".*", $options: "i" } },
        ],
      },
    ],
  }).select("-password -refreshToken");

  if (users.length === 0) {
    return res.status(404).json(new ApiResponse(404, users, "No users found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
});

const getCurrentChatters = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;
  const currentChatters = await Chat.find({
    participants: currentUserId,
  }).sort({ updatedAt: -1 });

  if (currentChatters.length === 0 || !currentChatters) {
    return res.status(200).json(new ApiResponse(200, [], "Not Chatters found"));
  }

  const participantsIDS = currentChatters.reduce((ids, chat) => {
    const otherParticipants = chat.participants.filter(
      (id) => id !== currentUserId
    );
    return [...ids, ...otherParticipants];
  }, []);

  const otherParticipantsIDS = participantsIDS.filter(
    (id) => id.toString() !== currentUserId.toString()
  );

  const user = await User.find({ _id: { $in: otherParticipantsIDS } }).select(
    "-password -refreshToken"
  );

  const users = otherParticipantsIDS.map((id) =>
    user.find((user) => user._id.toString() === id.toString())
  );

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Chatters fetched successfully"));
});



const sendMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const receiverId = req.params.id;
  const senderId = req.user._id;

  if (!message || !receiverId) {
    throw new ApiError(400, "Message and receiver ID are required");
  }

  let chats = await Chat.findOne({
    participants: { $all: [senderId, receiverId] },
  });

  if (!chats) {
    chats = await Chat.create({
      participants: [senderId, receiverId],
    });
  }

  const newMessages = await Message.create({
    senderId,
    receiverId,
    message,
    chatId: chats._id,
  });

  const createdMessage = await Message.findById(newMessages._id);
  if (!createdMessage) {
    throw new ApiError(500, "Something went wrong while sending message");
  }

  chats.messages.push(createdMessage._id);
  await chats.save();

  // SOCKET.IO function
  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", createdMessage);
  } else {
    console.log("User is offline");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdMessage, "Message Sent Successfully"));
});



const getMessages = asyncHandler(async (req, res) => {
  const receiverId = req.params.id;
  const senderId = req.user._id;

  if (!receiverId) {
    throw new ApiError(400, "Receiver ID is required");
  }

  const chats = await Chat.findOne({
    participants: { $all: [senderId, receiverId] },
  }).populate("messages");

  if (!chats) {
    return res.status(200).json(new ApiResponse(200, [], "No messages found"));
  }
  const messages = chats.messages;
  return res
    .status(200)
    .json(new ApiResponse(200, messages, "Messages fetched successfully"));
});

const searchServiceProvider = asyncHandler(async (req, res) => {
  const { location, profession, experience, rating, availability } = req.body;

  const tradesperson = await ServiceProvider.find({
    location: { $regex: location, $options: "i" },
    professions: { $in: profession },
    experience: { $gte: experience },
    rating: { $gte: rating },
    availability: availability,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, tradesperson, "Tradesperson fetched successfully")
    );
});

const postJob = asyncHandler(async (req, res) => {
  const { id, jobType, additionalDetails } = req.body;
  // console.log(`userId: ${req.user._id}, serviceProviderId: ${id}, jobType: ${jobType}, additionalDetails: ${additionalDetails}`);
  if (
    [id, req.user._id, jobType, additionalDetails].some(
      (field) => typeof field == "" && field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const jobPost = await JobPost.create({
    userId: req.user._id,
    serviceProviderId: id,
    jobType,
    additionalDetails,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, jobPost, "Job Posted Successfully"));
});

const getJobPosts = asyncHandler(async (req, res) => {
  const jobPosts = await JobPost.find({ userId: req.user._id });
  // console.log('Job Posts fetched successfully: ', jobPosts.length);
  return res
    .status(200)
    .json(new ApiResponse(200, jobPosts, "Job Posts fetched successfully"));
});

const getJobPostsForSP = asyncHandler(async (req, res) => {
  const jobPosts = await JobPost.find({ serviceProviderId: req.user._id });
  // console.log('Job Posts fetched successfully: ', jobPosts.length);
  return res
    .status(200)
    .json(new ApiResponse(200, jobPosts, "Job Posts fetched successfully"));
});

const acceptJob = asyncHandler(async (req, res) => {
  console.log("Accepting Job", req.params.jobId);
  const { jobId } = req.params;
  // update the job status to accepted and jobProgress to pending
  const jobPost = await JobPost.findByIdAndUpdate(
    jobId,
    { status: "accepted", jobProgress: "pending" },
    { new: true }
  );
  console.log("Job Accepted: ", jobPost);
  return res
    .status(200)
    .json(new ApiResponse(200, jobPost, "Job Accepted Successfully"));
});

const rejectJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const jobPost = await JobPost.findByIdAndUpdate(
    jobId,
    { status: "rejected" },
    { jobProgress: "pending" },
    { new: true }
  );
  console.log("Job Rejected: ", jobPost);
  return res
    .status(200)
    .json(new ApiResponse(200, jobPost, "Job Rejected Successfully"));
});

const completeJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const jobPost = await JobPost.findByIdAndUpdate(
    jobId,
    { jobProgress: "completed", status: "completed" },
    { new: true }
  );
  console.log("Job Completed: ", jobPost);
  return res
    .status(200)
    .json(new ApiResponse(200, jobPost, "Job Completed Successfully"));
});

const userConsentForJobCompletionSetTrue = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const jobPost = await JobPost.findByIdAndUpdate(
    jobId,
    { userConsentForJobCompletion: true },
    { new: true }
  );
  jobPost.save();
  console.log("User Consent for Job Completion: ", jobPost);
  return res
    .status(200)
    .json(
      new ApiResponse(200, jobPost, "User Consent for Job Completion Set True")
    );
});

const serviceProviderConsentForJobCompletionSetTrue = asyncHandler(
  async (req, res) => {
    const { jobId } = req.params;
    const jobPost = await JobPost.findByIdAndUpdate(
      jobId,
      { serviceProviderConsentForJobCompletion: true },
      { new: true }
    );
    console.log("Service Provider Consent for Job Completion: ", jobPost);
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          jobPost,
          "Service Provider Consent for Job Completion Set True"
        )
      );
  }
);

const rateJob = asyncHandler(async (req, res) => {
  const rating = req.body.rating;
  const { jobId } = req.params;
  if (rating > 5 || rating < 0) {
    throw new ApiError("Rating should be between 0 and 5");
  }
  const jobPost = await JobPost.findByIdAndUpdate(
    jobId,
    { rating },
    { new: true }
  );
  console.log("Job Rated: ", jobPost);
  return res
    .status(200)
    .json(new ApiResponse(200, jobPost, "Job Rated Successfully"));
});


// this is send mail module start from here.

const sendMail = asyncHandler(async (req, res) => {
  const { email, name, zipCode } = req.body;

  if ([email, name, zipCode].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // console.log(`Email: ${email}, Name: ${name}, Zip Code: ${zipCode}`);
  // console.log('Directory Name: ', __dirname);
  // console.log('User Email: ', process.env.EMAIL_USER, 'User Pass: ', process.env.EMAIL_PASS);
  // console.log(path.join(__dirname, 'frontend', 'tradeconnect', 'src', 'components', 'Assets', 'GigFusion - Connecting You with Trusted Workers.png'));
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // console.log('Transporter: ', transporter);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Home Service Information For You",
    html: `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Home Service Information</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                    color: #333;
                }

                .container {
                    width: 90%;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #fff;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                h1 {
                    text-align: center;
                    color: #333;
                    margin-top: 20px;
                    font-size: 1.5em;
                }

                p {
                    text-align: center;
                    font-size: 1em;
                }

                ul {
                    list-style-type: none;
                    padding: 0;
                    text-align: center;
                }

                li {
                    margin-top: 10px;
                    color: #333;
                    font-size: 1em;
                }

                img {
                    display: block;
                    margin: 20px auto;
                    width: 100%;
                    height: auto;
                }

                @media (max-width: 600px) {
                    h1 {
                        font-size: 1.2em;
                    }

                    p,
                    li {
                        font-size: 0.9em;
                    }
                }
            </style>
        </head>

        <body>
            <div class="container">
                <h1>Hello ${name},</h1>
                <img loading="eager" src="cid:banner" alt="Banner" />
                <p>Here are the services we provide and their price ranges:</p>
                <ul>
                    <li>Service 1: $100 - $200</li>
                    <li>Service 2: $200 - $300</li>
                </ul>
                <p>Thank you for choosing our platform!</p>
            </div>
        </body>

        </html>
        `,
    attachments: [
      {
        filename: "GigFusion - Connecting You with Trusted Workers.png",
        path: path.join(
          __dirname,
          "frontend",
          "tradeconnect",
          "src",
          "components",
          "Assets",
          "GigFusion - Connecting You with Trusted Workers.png"
        ),
        cid: "banner",
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      throw new ApiError(500, error);
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).json(new ApiResponse(200, {}, "Email sent successfully"));
    }
  });
  // return res.status(200).json(new ApiResponse(200, {}, "Email sent successfully"));
});


// finish sendmail module.


const getLocation = asyncHandler(async (req, res) => {
  const { lat, lng } = req.body;
  const userId = req.user._id;

  if (!lat || !lng || !userId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json`,
      {
        params: {
          q: `${lat},${lng}`,
          key: process.env.OPENCAGE_API_KEY,
          language: "en",
          pretty: 1,
        },
      }
    );

    const results = response.data.results;
    if (results.length > 0) {
      const locationDetails = results[0].formatted;
      const area =
        results[0].components.suburb ||
        results[0].components.village ||
        results[0].components.town ||
        results[0].components.city;
      const state = results[0].components.state;
      const country = results[0].components.country;
      console.log(locationDetails, area, state, country);

      const location = {
        userId,
        lat,
        lng,
        area: area || "Unknown Area",
        state: state || "Unknown State",
        country: country || "Unknown Country",
      };

      const createLocation = await Location.create(location);
      if (createLocation) {
        return res
          .status(200)
          .json(
            new ApiResponse(200, createLocation, "Location saved successfully")
          );
      } else {
        return res
          .status(500)
          .json(
            new ApiResponse(
              500,
              {},
              "Error creating and saving location details"
            )
          );
      }
    }
  } catch (error) {
    console.log("Error fetching location details: ", error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Error fetching location details"));
  }
});

const checkIfSavedLocation = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const location = await Location.findOne({ userId });

  if (!location) {
    return res
      .status(200)
      .json(new ApiResponse(200, false, "Location not found"));
  }

  return res.status(200).json(new ApiResponse(200, true, "Location found"));
});

function haversine(lat1, lon1, lat2, lon2) {
  // Radius of Earth in meters
  const R = 6371000;

  // Convert degrees to radians
  const toRadians = (degrees) => degrees * (Math.PI / 180);
  lat1 = toRadians(lat1);
  lon1 = toRadians(lon1);
  lat2 = toRadians(lat2);
  lon2 = toRadians(lon2);

  // Differences in coordinates
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  // Haversine formula
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distance in meters
  const distanceInMeters = R * c;
  return distanceInMeters;
}

const sendLocation = asyncHandler(async (req, res) => {
  // console.log('Starting Calculation...');
  const { spId } = req.params;
  const userId = req.user._id;
  const Userlocation = await Location.findOne({ userId });
  const SPlocation = await Location.findOne({ userId: spId });
  if (!Userlocation || !SPlocation) {
    return res.status(404).json(new ApiResponse(404, {}, "Location not found"));
  }
  // console.log(`User Location: ${Userlocation.lat}, ${Userlocation.lng}`);
  // console.log(`SP Location: ${SPlocation.lat}, ${SPlocation.lng}`);
  const distance = haversine(
    Userlocation.lat,
    Userlocation.lng,
    SPlocation.lat,
    SPlocation.lng
  );
  // console.log(`Distance: ${distance} meters`);
  return res
    .status(200)
    .json(new ApiResponse(200, distance, "Distance calculated successfully"));
});

const getFeedback = asyncHandler(async (req, res) => {
  const feedbacks = await Feedback.find({})
    .populate("userId", "username avatar")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, feedbacks, "Feedbacks Fetched Successfully"));
});

const giveFeedback = asyncHandler(async (req, res) => {
  const { content, stars } = req.body;
  const userId = req.user._id;
  const userType = req.user.userType;

  if (!content || !stars) {
    throw new ApiError(400, "Content and stars are required");
  }

  const feedback = await Feedback.create({
    userId,
    userType,
    content,
    stars,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, feedback, "Feedback submitted successfully"));
});

// Controller for fetching active jobs for a service provider
const getActiveJobs = asyncHandler(async (req, res) => {
  // console.log('User: ', req);
  const serviceProviderId = req.user._id; // Corrected to use serviceProviderId
  // console.log('ServiceProviderId: ', serviceProviderId);
  const activeJobs = await JobPost.find({
    serviceProviderId,
    status: { $in: ["accepted", "pending"] },
  });
  // console.log('Active Jobs: ', activeJobs);
  return res
    .status(200)
    .json(new ApiResponse(200, activeJobs, "Active jobs fetched successfully"));
});

// Controller for fetching service provider stats
const getServiceProviderStats = asyncHandler(async (req, res) => {
  const serviceProviderId = req.user._id;

  const totalJobs =
    (await JobPost.countDocuments({ serviceProviderId })) -
    (await JobPost.countDocuments({ serviceProviderId, status: "rejected" }));
  const completedJobs = await JobPost.countDocuments({
    serviceProviderId,
    jobProgress: "completed",
  });
  const pendingJobs = await JobPost.countDocuments({
    serviceProviderId,
    status: "pending",
  });
  const acceptedJobs = await JobPost.countDocuments({
    serviceProviderId,
    status: "accepted",
  });
  const rating = await JobPost.aggregate([
    { $match: { serviceProviderId, rating: { $exists: true } } },
    { $group: { _id: null, avgRating: { $avg: "$rating" } } },
  ]);

  const stats = {
    totalJobs,
    completedJobs,
    pendingJobs,
    acceptedJobs,
    rating: rating[0]?.avgRating || 0,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, stats, "Service provider stats fetched successfully")
    );
});

const updateUserDetails = asyncHandler(async (req, res) => {
  // console.log('Files', req.files);
  const { fullName, email, contact, zipcode, state, city } = req.body;
  const userId = req.user._id;
  if (
    [fullName, email, contact, zipcode, state, city].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  let avatar = "";
  let coverImage = "";
  if (req.files?.avatar) {
    const avatarLocalPath = req.files?.avatar[0]?.path;
    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required");
    }

    avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar.url) {
      throw new ApiError(500, "Error while uploading avatar");
    }
  } else {
    avatar = req.user.avatar;
  }

  if (req.files?.coverImage) {
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    if (!coverImageLocalPath) {
      throw new ApiError(400, "Cover Image file is required");
    }

    coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!coverImage.url) {
      throw new ApiError(500, "Error while uploading cover image");
    }
  } else {
    coverImage = req.user.coverImage;
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      fullName,
      email,
      contact,
      zipcode,
      state,
      city,
      avatar: avatar.url || avatar,
      coverImage: coverImage.url || coverImage,
    },
    { new: true }
  );

  if (!updatedUser) {
    throw new ApiError(500, "Something went wrong while updating user details");
  }
  console.log("Updated User: ", updatedUser);

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "User details updated successfully")
    );
});

const validateUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  user.validated = true;
  // user.badges.push("verified");
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User validated successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  getAllUsers,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  searchUsersByQuery,
  getCurrentChatters,
  sendMessage,
  getMessages,
  searchServiceProvider,
  postJob,
  getJobPosts,
  getJobPostsForSP,
  sendMail,
  acceptJob,
  rejectJob,
  completeJob,
  userConsentForJobCompletionSetTrue,
  serviceProviderConsentForJobCompletionSetTrue,
  rateJob,
  getLocation,
  checkIfSavedLocation,
  sendLocation,
  giveFeedback,
  getFeedback,
  getActiveJobs,
  getServiceProviderStats,
  updateUserDetails,
  validateUser,
};
