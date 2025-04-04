import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { projectService } from '../services';
import { FaArrowLeft, FaSpinner, FaFileAlt, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';

const MyProjects = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await projectService.getUserProjects();

            if (response.statusCode === 200) {
                setProjects(response.data.projects);
            } else {
                throw new Error(response.message || 'Failed to load projects');
            }
        } catch (err) {
            setError(err.message || 'An error occurred while fetching projects');
            toast.error('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProject = async (projectId) => {
        try {
            await projectService.deleteProject(projectId);
            toast.success('Project deleted successfully');
            fetchProjects(); // Refresh the project list
        } catch (err) {
            toast.error('Failed to delete project');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <FaSpinner className="animate-spin text-4xl text-stdBlue" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-2">
                        <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-800">
                            <FaArrowLeft />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">
                            My Projects
                        </h1>
                    </div>
                    <p className="text-gray-600">
                        Manage the projects you have created.
                    </p>
                </div>

                {/* Projects List */}
                {projects.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-md">
                        <FaFileAlt className="mx-auto text-6xl text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No Projects Found</h3>
                        <p className="text-gray-600">
                            You have not created any projects yet.
                        </p>
                        <Link to="/create-project" className="inline-flex items-center mt-4 px-4 py-2 bg-stdBlue text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <FaPlus className="mr-2" />
                            Create a Project
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                            {projects.map((project) => (
                                <li key={project._id} className="px-6 py-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <Link to={`/projects/${project._id}`} className="font-semibold text-stdBlue hover:underline">
                                                {project.title}
                                            </Link>
                                            <p className="text-gray-600 text-sm">
                                                Created on {new Date(project.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link to={`/projects/${project._id}`} className="text-gray-600 hover:text-stdBlue">
                                                <FaEdit />
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteProject(project._id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyProjects;
