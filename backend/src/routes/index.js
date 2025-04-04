import userRouter from "./user.routes.js";
import serviceProviderRouter from "./serviceProvider.routes.js";
import jobRoutes from "./jobRoutes.js";
import projectRoutes from "./project.routes.js";
import proposalRoutes from "./proposal.routes.js";
import jobMatchingRoutes from "./jobMatching.routes.js";
import escrowRoutes from "./escrow.routes.js";
import questionsRoutes from "./questions.routes.js";

const mountRoutes = (app) => {
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/service-providers", serviceProviderRouter);
  app.use("/api/v1/users", jobRoutes);
  app.use("/api/v1/projects", projectRoutes);
  app.use("/api/v1", proposalRoutes);
  app.use("/api/v1", jobMatchingRoutes);
  app.use("/api/v1", escrowRoutes);
  app.use("/api/v1/questions", questionsRoutes);

  // Default route for API health check
  app.get("/api/health", (req, res) => {
    res.status(200).json({
      status: "success",
      message: "API is running",
      service: "Resource-Connect API",
      timestamp: new Date(),
    });
  });
};

export default mountRoutes;
