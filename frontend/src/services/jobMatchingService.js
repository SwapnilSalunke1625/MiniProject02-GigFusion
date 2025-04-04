import API from './api';

const jobMatchingService = {
  // Calculate match between a project and freelancer
  calculateMatch: async (projectId, freelancerId) => {
    const response = await API.post(`/projects/${projectId}/freelancers/${freelancerId}/match`);
    return response.data;
  },

  // Get matches for a project (client only)
  getProjectMatches: async (projectId, filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await API.get(`/projects/${projectId}/matches${queryParams ? `?${queryParams}` : ''}`);
    return response.data;
  },

  // Get matches for current freelancer
  getFreelancerMatches: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await API.get(`/my-matches${queryParams ? `?${queryParams}` : ''}`);
    return response.data;
  },

  // Update match status (view, save, apply)
  updateMatchStatus: async (matchId, action) => {
    const response = await API.patch(`/matches/${matchId}/status`, { action });
    return response.data;
  },

  // Generate recommendations (admin only)
  generateRecommendations: async () => {
    const response = await API.post('/generate-recommendations');
    return response.data;
  },

  // View a project match
  viewProjectMatch: async (matchId) => {
    const response = await API.get(`/matches/${matchId}`);
    return response.data;
  },
};

export default jobMatchingService;
