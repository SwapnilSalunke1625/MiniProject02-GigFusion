import Escrow from "../models/escrow.model.js";
import Proposal from "../models/proposal.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

let Project; // Declare Project outside the asyncHandler

// Create an escrow for a project
const createEscrow = asyncHandler(async (req, res) => {
  if (!Project) {
    Project = (await import("../models/project.model.js")).default;
  }
  const { projectId } = req.params;
  const { totalAmount, currency, paymentType, milestones } = req.body;

  // Validate required fields
  if (!totalAmount || !paymentType) {
    throw new ApiError(400, "Total amount and payment type are required");
  }

  // Get the project
  const project = await Project.findById(projectId).populate("freelancer");

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Check if user is the project owner
  if (project.client.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only the project owner can create an escrow");
  }

  // Check if the project has a freelancer assigned
  if (!project.freelancer) {
    throw new ApiError(
      400,
      "Project must have an assigned freelancer to create an escrow"
    );
  }

  // Check if an escrow already exists for this project
  const existingEscrow = await Escrow.findOne({ project: projectId });
  if (existingEscrow) {
    throw new ApiError(400, "An escrow already exists for this project");
  }

  // Create milestones if not provided
  let escrowMilestones = milestones;

  if (!escrowMilestones || escrowMilestones.length === 0) {
    // If project has milestones, use those
    if (project.milestones && project.milestones.length > 0) {
      escrowMilestones = project.milestones.map((milestone) => ({
        title: milestone.title,
        description: milestone.description,
        amount: milestone.amount,
        dueDate: milestone.dueDate,
        status: "pending",
      }));
    } else {
      // Otherwise create a single milestone for the full amount
      escrowMilestones = [
        {
          title: "Project Completion",
          description: "Full payment upon project completion",
          amount: totalAmount,
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          status: "pending",
        },
      ];
    }
  }

  // Create the escrow
  const escrow = await Escrow.create({
    project: projectId,
    client: req.user._id,
    freelancer: project.freelancer._id,
    totalAmount,
    currency: currency || "USD",
    paymentType,
    status: "pending",
    milestones: escrowMilestones,
    expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months from now
  });

  // Update project with escrow reference
  await Project.findByIdAndUpdate(projectId, { escrow: escrow._id });

  return res
    .status(201)
    .json(new ApiResponse(201, escrow, "Escrow created successfully"));
});

// Get escrow details by project ID
const getEscrowByProject = asyncHandler(async (req, res) => {
  if (!Project) {
    Project = (await import("../models/project.model.js")).default;
  }
  const { projectId } = req.params;

  // Get the project
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Check if user is authorized (either client or freelancer)
  if (
    project.client.toString() !== req.user._id.toString() &&
    project.freelancer?.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, "You don't have permission to view this escrow");
  }

  // Get the escrow
  const escrow = await Escrow.findOne({ project: projectId })
    .populate("client", "fullName email avatar")
    .populate("freelancer", "fullName email avatar")
    .populate("project", "title status");

  if (!escrow) {
    throw new ApiError(404, "No escrow found for this project");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, escrow, "Escrow retrieved successfully"));
});

// Get escrow details by ID
const getEscrowById = asyncHandler(async (req, res) => {
  const { escrowId } = req.params;

  // Get the escrow
  const escrow = await Escrow.findById(escrowId)
    .populate("client", "fullName email avatar")
    .populate("freelancer", "fullName email avatar")
    .populate("project", "title status client freelancer");

  if (!escrow) {
    throw new ApiError(404, "Escrow not found");
  }

  // Check if user is authorized (either client or freelancer)
  if (
    escrow.client._id.toString() !== req.user._id.toString() &&
    escrow.freelancer._id.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, "You don't have permission to view this escrow");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, escrow, "Escrow retrieved successfully"));
});

// Fund an escrow or milestone
const fundEscrow = asyncHandler(async (req, res) => {
  if (!Project) {
    Project = (await import("../models/project.model.js")).default;
  }
  const { escrowId } = req.params;
  const { amount, milestoneIndex, reference } = req.body;

  // Validate required fields
  if (!amount) {
    throw new ApiError(400, "Amount is required");
  }

  // Get the escrow
  const escrow = await Escrow.findById(escrowId);
  if (!escrow) {
    throw new ApiError(404, "Escrow not found");
  }

  // Check if user is the client
  if (escrow.client.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only the client can fund an escrow");
  }

  // Update based on whether funding a specific milestone or the entire escrow
  if (milestoneIndex !== undefined) {
    // Milestone-specific funding
    if (milestoneIndex < 0 || milestoneIndex >= escrow.milestones.length) {
      throw new ApiError(400, "Invalid milestone index");
    }

    const milestone = escrow.milestones[milestoneIndex];

    // Check if milestone is already funded
    if (milestone.status === "funded" || milestone.status === "released") {
      throw new ApiError(400, "Milestone is already funded or released");
    }

    // Check if amount matches milestone amount
    if (amount !== milestone.amount) {
      throw new ApiError(
        400,
        `Amount must match milestone amount: ${milestone.amount}`
      );
    }

    // Update milestone status
    escrow.milestones[milestoneIndex].status = "funded";
    escrow.milestones[milestoneIndex].fundedAt = new Date();

    // Add transaction record
    escrow.transactions.push({
      type: "fund",
      amount,
      date: new Date(),
      reference:
        reference || `Milestone ${milestoneIndex + 1}: ${milestone.title}`,
      status: "completed",
    });

    // Check if all milestones are now funded
    const allFunded = escrow.milestones.every(
      (m) => m.status === "funded" || m.status === "released"
    );
    if (allFunded) {
      escrow.status = "funded";
    } else {
      escrow.status = "partially-released";
    }
  } else {
    // Full escrow funding
    if (amount !== escrow.totalAmount) {
      throw new ApiError(
        400,
        `Amount must match total escrow amount: ${escrow.totalAmount}`
      );
    }

    // Update all milestones
    escrow.milestones.forEach((milestone, index) => {
      if (milestone.status === "pending") {
        escrow.milestones[index].status = "funded";
        escrow.milestones[index].fundedAt = new Date();
      }
    });

    // Add transaction record
    escrow.transactions.push({
      type: "fund",
      amount,
      date: new Date(),
      reference: reference || `Full project funding`,
      status: "completed",
    });

    escrow.status = "funded";
  }

  // Save updated escrow
  await escrow.save();

  // If project status is still 'open', change it to 'in-progress'
  const project = await Project.findById(escrow.project);
  if (project && project.status === "open") {
    await Project.findByIdAndUpdate(escrow.project, {
      status: "in-progress",
      startDate: new Date(),
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, escrow, "Escrow funded successfully"));
});

// Release funds from an escrow milestone
const releaseFunds = asyncHandler(async (req, res) => {
  const { escrowId } = req.params;
  const { milestoneIndex, reference } = req.body;

  // Validate required fields
  if (milestoneIndex === undefined) {
    throw new ApiError(400, "Milestone index is required");
  }

  // Get the escrow
  const escrow = await Escrow.findById(escrowId);
  if (!escrow) {
    throw new ApiError(404, "Escrow not found");
  }

  // Check if user is the client
  if (escrow.client.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only the client can release funds");
  }

  // Validate milestone index
  if (milestoneIndex < 0 || milestoneIndex >= escrow.milestones.length) {
    throw new ApiError(400, "Invalid milestone index");
  }

  const milestone = escrow.milestones[milestoneIndex];

  // Check if milestone is funded
  if (milestone.status !== "funded") {
    throw new ApiError(
      400,
      "Cannot release funds for a milestone that is not funded"
    );
  }

  // Update milestone status
  escrow.milestones[milestoneIndex].status = "released";
  escrow.milestones[milestoneIndex].releasedAt = new Date();

  // Add transaction record
  escrow.transactions.push({
    type: "release",
    amount: milestone.amount,
    date: new Date(),
    reference:
      reference ||
      `Released milestone ${milestoneIndex + 1}: ${milestone.title}`,
    status: "completed",
  });

  // Check if all milestones are now released
  const allReleased = escrow.milestones.every((m) => m.status === "released");
  if (allReleased) {
    escrow.status = "released";

    // Update project status if all funds released
    await Project.findByIdAndUpdate(escrow.project, {
      status: "completed",
      completionDate: new Date(),
      endDate: new Date(),
    });
  } else {
    escrow.status = "partially-released";
  }

  // Save updated escrow
  await escrow.save();

  return res
    .status(200)
    .json(new ApiResponse(200, escrow, "Funds released successfully"));
});

// Request refund or dispute an escrow
const initiateDispute = asyncHandler(async (req, res) => {
  const { escrowId } = req.params;
  const { reason } = req.body;

  if (!reason) {
    throw new ApiError(400, "Dispute reason is required");
  }

  // Get the escrow
  const escrow = await Escrow.findById(escrowId);
  if (!escrow) {
    throw new ApiError(404, "Escrow not found");
  }

  // Check if user is the client or freelancer
  if (
    escrow.client.toString() !== req.user._id.toString() &&
    escrow.freelancer.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(
      403,
      "Only the client or freelancer can dispute an escrow"
    );
  }

  // Check if escrow is already disputed
  if (escrow.status === "disputed") {
    throw new ApiError(400, "Escrow is already under dispute");
  }

  // Update escrow status
  escrow.status = "disputed";
  escrow.disputeReason = reason;
  escrow.disputeStatus = "open";

  // Save updated escrow
  await escrow.save();

  // TODO: Notify administrators of the dispute

  return res
    .status(200)
    .json(new ApiResponse(200, escrow, "Dispute initiated successfully"));
});

// Resolve a dispute (admin only)
const resolveDispute = asyncHandler(async (req, res) => {
  const { escrowId } = req.params;
  const { resolution, notes } = req.body;

  // Only admin can resolve disputes
  if (req.user.userType !== "admin") {
    throw new ApiError(403, "Only administrators can resolve disputes");
  }

  if (
    !resolution ||
    !["client-favor", "freelancer-favor", "settled"].includes(resolution)
  ) {
    throw new ApiError(
      400,
      "Valid resolution is required (client-favor, freelancer-favor, or settled)"
    );
  }

  // Get the escrow
  const escrow = await Escrow.findById(escrowId);
  if (!escrow) {
    throw new ApiError(404, "Escrow not found");
  }

  // Check if escrow is disputed
  if (escrow.status !== "disputed") {
    throw new ApiError(400, "Can only resolve disputed escrows");
  }

  // Update escrow
  escrow.disputeStatus = resolution;
  escrow.disputeResolvedAt = new Date();

  // Handle resolution outcomes
  if (resolution === "client-favor") {
    // Add refund transaction
    const remainingAmount = escrow.remainingAmount;
    if (remainingAmount > 0) {
      escrow.transactions.push({
        type: "refund",
        amount: remainingAmount,
        date: new Date(),
        reference: `Refund due to dispute resolution in client's favor: ${notes || ""}`,
        status: "completed",
      });
    }
    escrow.status = "refunded";
  } else if (resolution === "freelancer-favor") {
    // Release all remaining funds to freelancer
    const pendingMilestones = escrow.milestones.filter(
      (m) => m.status !== "released"
    );

    pendingMilestones.forEach((milestone, index) => {
      const actualIndex = escrow.milestones.findIndex(
        (m) => m._id.toString() === milestone._id.toString()
      );

      if (actualIndex !== -1) {
        escrow.milestones[actualIndex].status = "released";
        escrow.milestones[actualIndex].releasedAt = new Date();

        // Add release transaction
        escrow.transactions.push({
          type: "release",
          amount: milestone.amount,
          date: new Date(),
          reference: `Released due to dispute resolution in freelancer's favor: ${notes || ""}`,
          status: "completed",
        });
      }
    });

    escrow.status = "released";
  } else if (resolution === "settled") {
    // Keep current state, just mark dispute as resolved
    // Admin should manually adjust funds before calling this
  }

  // Save updated escrow
  await escrow.save();

  return res
    .status(200)
    .json(new ApiResponse(200, escrow, "Dispute resolved successfully"));
});

// Get all escrows for the authenticated user
const getUserEscrows = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { status, role, page = 1, limit = 10 } = req.query;

  // Build query based on user role (client or freelancer)
  const query =
    role === "freelancer" ? { freelancer: userId } : { client: userId };

  // Filter by status if provided
  if (status) {
    query.status = status;
  }

  // Pagination options
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
    populate: [
      { path: "project", select: "title status" },
      { path: "client", select: "fullName email avatar" },
      { path: "freelancer", select: "fullName email avatar" },
    ],
  };

  // Execute query with pagination
  const escrows = await Escrow.find(query)
    .skip((options.page - 1) * options.limit)
    .limit(options.limit)
    .sort(options.sort)
    .populate(options.populate[0])
    .populate(options.populate[1])
    .populate(options.populate[2]);

  // Get total count for pagination
  const totalEscrows = await Escrow.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        escrows,
        pagination: {
          total: totalEscrows,
          page: options.page,
          limit: options.limit,
          pages: Math.ceil(totalEscrows / options.limit),
        },
      },
      "Escrows retrieved successfully"
    )
  );
});

export {
  createEscrow,
  getEscrowByProject,
  getEscrowById,
  fundEscrow,
  releaseFunds,
  initiateDispute,
  resolveDispute,
  getUserEscrows,
};
