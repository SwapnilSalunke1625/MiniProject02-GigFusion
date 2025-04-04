import API from './api';

const projectService = {
  // Get all projects with optional filters
  getAllProjects: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await API.get(`/projects${queryParams ? `?${queryParams}` : ''}`);
    return response.data;
  },

  // Get project by ID
  getProjectById: async (projectId) => {
    const response = await API.get(`/projects/${projectId}`);
    return response.data;
  },

  // Create a new project
  createProject: async (projectData) => {
    const response = await API.post('/projects', projectData);
    return response.data;
  },

  // Get projects created by the authenticated user
  getUserProjects: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await API.get(`/projects/user/projects${queryParams ? `?${queryParams}` : ''}`);
    return response.data;
  },

  // Update a project
  updateProject: async (projectId, updateData) => {
    const response = await API.put(`/projects/${projectId}`, updateData);
    return response.data;
  },

  // Delete a project
  deleteProject: async (projectId) => {
    const response = await API.delete(`/projects/${projectId}`);
    return response.data;
  },

  // Change project status
  changeProjectStatus: async (projectId, status) => {
    const response = await API.patch(`/projects/${projectId}/status`, { status });
    return response.data;
  }
};

export default projectService;
