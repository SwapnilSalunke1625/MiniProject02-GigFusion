import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import { projectService } from '../services';
import { toast } from 'react-toastify';
// import Cookies from 'js-cookie';

export default function ProjectList() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // const [showFilters, setShowFilters] = useState(false);
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
    // const experienceLevels = [
    //     { id: 'beginner', name: 'Beginner' },
    //     { id: 'intermediate', name: 'Intermediate' },
    //     { id: 'expert', name: 'Expert' }
    // ];

    // // Common skills
    // const commonSkills = [
    //     'React', 'Node.js', 'JavaScript', 'HTML/CSS', 'Python',
    //     'Design', 'WordPress', 'UI/UX', 'Copywriting', 'SEO'
    // ];

    // useEffect(() => {
    // });
    // fetchProjects();

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

                // Filter projects that have at least one skill matching the user's skills
                if (user.skills && user.skills.length > 0) {
                    filteredProjectsData = filteredProjectsData.filter(project =>
                        project.skills && project.skills.some(skill =>
                            user.skills.includes(skill)
                        )
                    );
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

    useEffect(() => {
        fetchProjects();
    }, []);

    // const handleFilterChange = (e) => {
    //     const { name, value } = e.target;
    //     setFilters(prev => ({ ...prev, [name]: value }));
    // };

    // const handleSkillToggle = (skill) => {
    //     setFilters(prev => {
    //         const updatedSkills = prev.skills.includes(skill)
    //             ? prev.skills.filter(s => s !== skill)
    //             : [...prev.skills, skill];

    //         return { ...prev, skills: updatedSkills };
    //     });
    // };

    // const handleSearch = (e) => {
    //     e.preventDefault();
    //     fetchProjects();
    // };

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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Matches</h1>
                    <p className="text-gray-600">Projects that match your profile</p>
                </div>

                {/* Status tabs */}
                {/* <div className="flex border-b border-gray-200 mb-6">
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
                </div> */}

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
