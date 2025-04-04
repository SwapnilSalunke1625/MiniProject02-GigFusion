import API from './api';

const proposalService = {
  // Submit a proposal for a project
  submitProposal: async (projectId, proposalData) => {
    const response = await API.post(`/projects/${projectId}/proposals`, proposalData);
    return response.data;
  },

  // Get all proposals for a project (client only)
  getProjectProposals: async (projectId, filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await API.get(`/projects/${projectId}/proposals${queryParams ? `?${queryParams}` : ''}`);
    return response.data;
  },

  // Get a specific proposal by ID
  getProposalById: async (proposalId) => {
    const response = await API.get(`/proposals/${proposalId}`);
    return response.data;
  },

  // Get all proposals submitted by authenticated freelancer
  getUserProposals: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await API.get(`/my-proposals${queryParams ? `?${queryParams}` : ''}`);
    return response.data;
  },

  // Update a proposal
  updateProposal: async (proposalId, updateData) => {
    const response = await API.put(`/proposals/${proposalId}`, updateData);
    return response.data;
  },

  // Withdraw a proposal
  withdrawProposal: async (proposalId) => {
    const response = await API.patch(`/proposals/${proposalId}/withdraw`);
    return response.data;
  },

  // Accept or reject a proposal (client only)
  handleProposalStatus: async (proposalId, status) => {
    const response = await API.patch(`/proposals/${proposalId}/status`, { status });
    return response.data;
  }
};

export default proposalService;
