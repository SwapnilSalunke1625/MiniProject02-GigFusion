import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        // Attempt to retrieve the token from cookies or headers
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        // If no token is found, throw an unauthorized error
        if (!token) {
            throw new ApiError(401, "Access token is missing");
        }

        let decodedToken;
        try {
            // Verify the token
            decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (error) {
            // If verification fails, it could be due to an expired or malformed token
            throw new ApiError(401, error.message === 'jwt malformed' ? 'Malformed token' : 'Invalid token');
        }

        // Find the user by the decoded token's ID
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");

        // If no user is found, throw an error
        if (!user) {
            throw new ApiError(401, "User not found for this token");
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        // Forward the error message, or provide a generic message if none is available
        next(new ApiError(401, error?.message || "Unauthorized access"));
    }
});
