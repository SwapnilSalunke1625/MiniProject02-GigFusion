import API from './api';

const escrowService = {
  // Create an escrow for a project
  createEscrow: async (projectId, escrowData) => {
    const response = await API.post(`/projects/${projectId}/escrow`, escrowData);
    return response.data;
  },

  // Get escrow details by project ID
  getEscrowByProject: async (projectId) => {
    const response = await API.get(`/projects/${projectId}/escrow`);
    return response.data;
  },

  // Get escrow by ID
  getEscrowById: async (escrowId) => {
    const response = await API.get(`/escrows/${escrowId}`);
    return response.data;
  },

  // Get all escrows for the authenticated user
  getUserEscrows: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await API.get(`/escrows${queryParams ? `?${queryParams}` : ''}`);
    return response.data;
  },

  // Fund an escrow or milestone
  fundEscrow: async (escrowId, fundingData) => {
    const response = await API.post(`/escrows/${escrowId}/fund`, fundingData);
    return response.data;
  },

  // Release funds from an escrow milestone
  releaseFunds: async (escrowId, releaseData) => {
    const response = await API.post(`/escrows/${escrowId}/release`, releaseData);
    return response.data;
  },

  // Request refund or dispute an escrow
  initiateDispute: async (escrowId, reason) => {
    const response = await API.post(`/escrows/${escrowId}/dispute`, { reason });
    return response.data;
  },

  // Resolve a dispute (admin only)
  resolveDispute: async (escrowId, resolutionData) => {
    const response = await API.post(`/escrows/${escrowId}/resolve`, resolutionData);
    return response.data;
  }
};

export default escrowService;
