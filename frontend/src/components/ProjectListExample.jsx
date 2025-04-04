import { useState, useEffect } from 'react';
import { projectService } from '../services';
import { toast } from 'react-toastify';

const ProjectListExample = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await projectService.getAllProjects();
        setProjects(response.data.projects);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch projects');
        toast.error('Failed to load projects');
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div className="project-list">
      <h2>Available Projects</h2>
      {projects.length === 0 ? (
        <p>No projects available</p>
      ) : (
        <ul>
          {projects.map(project => (
            <li key={project._id}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProjectListExample;
