import { Router } from "express";
import {
  getServiceProviderByCity,
  getServiceProviderDetails,
  getServiceProviderReviews,
  updateServiceProviderProfile,
  registerSP,
  getReviews,
  setReview,
  getServiceProvidersByQuery,
  uploadServiceProviderDocument,
  updateServiceProviderDocument,
  getServiceProviderDocuments,
  getServiceProviderDocumentById,
  getActiveJobs,
  getServiceProviderStats,
  getServiceProviderRating,
  saveSkills,
  getSkills,
} from "../controllers/serviceProvider.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/save-sp-details").patch(
  verifyJWT,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerSP
);
router.route("/get-by-city").get(verifyJWT, getServiceProviderByCity);
router.route("/:id").get(verifyJWT, getServiceProviderDetails);
router.route("/:id/reviews").get(verifyJWT, getServiceProviderReviews);
router.route("/update/:id").patch(verifyJWT, updateServiceProviderProfile);
router.route("/set-sp-review").post(verifyJWT, setReview);
router.route("/get-reviews/:id").get(verifyJWT, getReviews);
router.route("/search").get(verifyJWT, getServiceProvidersByQuery);
router.route("/active-jobs").get(verifyJWT, getActiveJobs);
router.route("/stats").get(verifyJWT, getServiceProviderStats);
router.route("/get-rating").get(verifyJWT, getServiceProviderRating);
router.route('/skills')
  .patch(saveSkills)
  .get(getSkills);


// service provider document routes
router.route("/documents").get(verifyJWT, getServiceProviderDocuments);
router.route("/documents/:id").get(verifyJWT, getServiceProviderDocumentById);

router
  .route("/documents/:id")
  .post(
    verifyJWT,
    upload.fields([
      { name: "IdentityProof", maxCount: 1 },
      { name: "AddressProof", maxCount: 1 },
    ]),
    uploadServiceProviderDocument
  )
  .put(
    verifyJWT,
    upload.fields([
      { name: "IdentityProof", maxCount: 1 },
      { name: "AddressProof", maxCount: 1 },
    ]),
    updateServiceProviderDocument
  );

export default router;
