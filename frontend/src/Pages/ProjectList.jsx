import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaTimes, FaArrowRight, FaStar, FaSpinner } from 'react-icons/fa';
import { projectService } from '../services';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem('user')));

  // Filter states
  const [filters, setFilters] = useState({
    category: '',
    skills: [],
    minBudget: '',
    maxBudget: '',
    status: 'open',
    experienceLevel: ''
  });

  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Categories matching your existing design
  const categories = [
    { id: 'web-development', name: 'Website Development' },
    { id: 'mobile-development', name: 'Mobile App Development' },
    { id: 'graphic-design', name: 'Graphic Design' },
    { id: 'digital-marketing', name: 'Digital Marketing' },
    { id: 'content-writing', name: 'Content Writing' },
    { id: 'seo', name: 'SEO & Optimization' }
  ];

  // Experience levels
  const experienceLevels = [
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'expert', name: 'Expert' }
  ];

  // Common skills
  const commonSkills = [
    'React', 'Node.js', 'JavaScript', 'HTML/CSS', 'Python',
    'Design', 'WordPress', 'UI/UX', 'Copywriting', 'SEO'
  ];

  useEffect(() => {
    fetchProjects();
  }, [filters.status]);

  const fetchProjects = async () => {
    try {
      setLoading(true);

      // Build filter parameters for API call
      const filterParams = {
        status: filters.status,
        page: 1,
        limit: 12
      };

      if (filters.category) filterParams.category = filters.category;
      if (filters.experienceLevel) filterParams.experienceLevel = filters.experienceLevel;
      if (filters.minBudget) filterParams.minBudget = filters.minBudget;
      if (filters.maxBudget) filterParams.maxBudget = filters.maxBudget;
      if (filters.skills.length > 0) filterParams.skills = filters.skills.join(',');

      console.log("filterParams", filterParams);
      const response = await projectService.getAllProjects(filterParams);

      if (response.statusCode === 200) {
        let filteredProjectsData = response.data.projects;

        // Filter "In Progress" projects for service providers
        if (user.userType === 'serviceProvider' && filters.status === 'in-progress') {
          filteredProjectsData = filteredProjectsData.filter(project => project.freelancer?.toString() === user._id);
        }
        // Filter "completed" projects for service providers
        if (user.userType === 'serviceProvider' && filters.status === 'completed') {
          filteredProjectsData = filteredProjectsData.filter(project => project.freelancer?.toString() === user._id);
        }
        // Filter projects for clients
        if (user.userType === 'user') {
          filteredProjectsData = filteredProjectsData.filter(project => project.client._id === user._id);
        }

        setProjects(filteredProjectsData);
      } else {
        throw new Error(response.message || 'Failed to load projects');
      }
    } catch (err) {
      toast.error('Failed to load projects');
      setError(err.message || 'An error occurred while fetching projects');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillToggle = (skill) => {
    setFilters(prev => {
      const updatedSkills = prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill];

      return { ...prev, skills: updatedSkills };
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      skills: [],
      minBudget: '',
      maxBudget: '',
      status: 'open',
      experienceLevel: ''
    });
    setSearchQuery('');
  };

  // Filter projects by search query
  const filteredProjects = searchQuery
    ? projects.filter(project =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()))
    : projects;

  // Format currency
  const formatCurrency = (amount, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-stdBlue mb-2">Find Perfect Projects</h1>
          <p className="text-color1 font-semibold">Browse through available projects or use filters to find the perfect match for your skills</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search box */}
            <div className="flex-1">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search projects by title or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 rounded-lg border-2 border-gray-200 focus:border-stdBlue focus:ring-2 focus:ring-stdBlue/20 transition-all outline-none"
                />
                <FaSearch className="absolute left-4 top-5 text-gray-400" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                )}
              </form>
            </div>

            {/* Filter toggle button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`h-12 px-6 rounded-lg flex items-center gap-2 transition-all ${showFilters
                ? 'bg-stdBlue text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <FaFilter />
              <span>Filters</span>
              {filters.category || filters.skills.length > 0 || filters.minBudget || filters.maxBudget || filters.experienceLevel ? (
                <span className="ml-1 bg-color1 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                  {Object.values(filters).filter(val => val && (typeof val !== 'object' || val.length > 0)).length}
                </span>
              ) : null}
            </button>

            {/* Create Project button */}
            {user.userType === 'user' && (
              <button
                onClick={() => navigate('/create-project')}
                className="h-12 px-6 bg-color1 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2 transition-all"
              >
                <span>Post a Project</span>
                <FaArrowRight className="text-sm" />
              </button>
            )}
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category filter */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full h-10 px-3 rounded-lg border-2 border-gray-200 focus:border-stdBlue focus:ring-2 focus:ring-stdBlue/20 transition-all outline-none"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Budget range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget Range
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      name="minBudget"
                      placeholder="Min"
                      value={filters.minBudget}
                      onChange={handleFilterChange}
                      className="w-full h-10 px-3 rounded-lg border-2 border-gray-200 focus:border-stdBlue focus:ring-2 focus:ring-stdBlue/20 transition-all outline-none"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="number"
                      name="maxBudget"
                      placeholder="Max"
                      value={filters.maxBudget}
                      onChange={handleFilterChange}
                      className="w-full h-10 px-3 rounded-lg border-2 border-gray-200 focus:border-stdBlue focus:ring-2 focus:ring-stdBlue/20 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Experience level */}
                <div>
                  <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-1">
                    Experience Level
                  </label>
                  <select
                    id="experienceLevel"
                    name="experienceLevel"
                    value={filters.experienceLevel}
                    onChange={handleFilterChange}
                    className="w-full h-10 px-3 rounded-lg border-2 border-gray-200 focus:border-stdBlue focus:ring-2 focus:ring-stdBlue/20 transition-all outline-none"
                  >
                    <option value="">Any Level</option>
                    {experienceLevels.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Skills */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills
                </label>
                <div className="flex flex-wrap gap-2">
                  {commonSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleSkillToggle(skill)}
                      className={`px-3 py-1 rounded-full text-sm ${filters.skills.includes(skill)
                        ? 'bg-stdBlue text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } transition-colors`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Clear All
                </button>
                <button
                  onClick={fetchProjects}
                  className="px-6 py-2 bg-stdBlue text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Status tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          {['open', 'in-progress', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilters(prev => ({ ...prev, status }))}
              className={`py-2 px-4 border-b-2 text-sm font-medium ${filters.status === status
                ? 'border-stdBlue text-stdBlue'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              {status === 'open' ? 'Open Projects' :
                status === 'in-progress' ? 'In Progress' : 'Completed'}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <FaSpinner className="animate-spin text-3xl text-stdBlue" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Projects Found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {searchQuery
                ? `No results for "${searchQuery}". Try different keywords or clear filters.`
                : 'No projects match your current filters. Try adjusting your search criteria.'}
            </p>
            {(searchQuery || filters.category || filters.skills.length > 0 || filters.minBudget || filters.maxBudget || filters.experienceLevel) && (
              <button
                onClick={handleClearFilters}
                className="mt-4 px-6 py-2 bg-stdBlue text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
            {console.log("No projects found")}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/projects/${project._id}`)}
              >
                {/* Project card header */}
                <div className="bg-gradient-to-r from-stdBlue to-blue-500 p-4 text-white">
                  <h2 className="text-lg font-semibold line-clamp-1">{project.title}</h2>
                  <p className="text-sm text-white/80">
                    Posted {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Project details */}
                <div className="p-4">
                  <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                    {project.description}
                  </p>

                  {/* Project metadata */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {categories.find(c => c.id === project.category)?.name || project.category}
                      </span>
                      <span className="text-gray-700 font-medium text-sm">
                        {formatCurrency(project.budget.minAmount, project.budget.currency)} -
                        {formatCurrency(project.budget.maxAmount, project.budget.currency)}
                      </span>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.skills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                      {project.skills.length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                          +{project.skills.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Client info and proposal count */}
                    <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-white">
                          {project.client?.fullName?.charAt(0) || 'C'}
                        </div>
                        <span className="text-xs text-gray-600">
                          {project.client?.fullName || 'Client'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <span>{project.proposals?.length || 0} proposals</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
