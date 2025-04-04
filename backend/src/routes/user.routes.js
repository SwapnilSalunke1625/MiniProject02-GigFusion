import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  getAllUsers,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  postJob,
  getJobPosts,
  getJobPostsForSP,
  sendMail, // Import the new controller function
  acceptJob,
  rejectJob,
  completeJob,
  userConsentForJobCompletionSetTrue,
  serviceProviderConsentForJobCompletionSetTrue,
  rateJob,
  searchUsersByQuery,
  getCurrentChatters,
  sendMessage,
  getMessages,
  getLocation,
  checkIfSavedLocation,
  sendLocation,
  giveFeedback,
  getFeedback,
  getActiveJobs,
  getServiceProviderStats,
  updateUserDetails,
  validateUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// router.route("/register")
//     .post(upload.fields(
//         [
//             { name: "avatar", maxCount: 1 }, { name: "coverImage", maxCount: 1 }
//         ]
//     ), registerUser);
router.route("/register").post(registerUser);

router.route("/login").post(loginUser);
router.route("/sendMail").post(sendMail);

//secured User routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/get-all-users").get(getAllUsers);
router.route("/update-account").patch(verifyJWT, updateAccountDetails);
router
  .route("/avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
  .route("/cover-image")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);
router.route("/searchUsersByQuery").get(verifyJWT, searchUsersByQuery);
router.route("/update-user-details").put(
  verifyJWT,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  updateUserDetails
);

// Job Post routes
router.route("/job-post").post(verifyJWT, postJob);
router.route("/get-job-posts").get(verifyJWT, getJobPosts);
router.route("/get-job-posts-for-sp").get(verifyJWT, getJobPostsForSP);
router.route("/:jobId/accept").patch(verifyJWT, acceptJob);
router.route("/:jobId/reject").patch(verifyJWT, rejectJob);
router.route("/:jobId/complete").patch(verifyJWT, completeJob);
router
  .route("/:jobId/userConsent")
  .patch(verifyJWT, userConsentForJobCompletionSetTrue);
router
  .route("/:jobId/SPConsent")
  .patch(verifyJWT, serviceProviderConsentForJobCompletionSetTrue);
router.route("/:jobId/rate").patch(verifyJWT, rateJob);

// Chat routes
router.route("/search").get(verifyJWT, searchUsersByQuery);
router.route("/currentChatters").get(verifyJWT, getCurrentChatters);
router.route("/send-message/:id").post(verifyJWT, sendMessage);
router.route("/get-message/:id").get(verifyJWT, getMessages);

// Location routes
router
  .route("/location")
  .get(verifyJWT, checkIfSavedLocation)
  .post(verifyJWT, getLocation);
router.route("/location/:spId").get(verifyJWT, sendLocation);

// Feedback routes
router.route("/feedback").post(verifyJWT, giveFeedback).get(getFeedback);

// Temporary Service Provider routes
router.route("/active-jobs").get(verifyJWT, getActiveJobs);
router.route("/stats").get(verifyJWT, getServiceProviderStats);

// Validate user route
router.route("/validate-user").post(verifyJWT, validateUser);

export default router;
