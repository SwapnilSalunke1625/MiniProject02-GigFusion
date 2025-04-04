import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';

const CreateProject = () => {
  const navigate = useNavigate();

  const colors = [
    'bg-red-200 text-red-800',
    'bg-green-200 text-green-800',
    'bg-blue-200 text-blue-800',
    'bg-yellow-200 text-yellow-800',
    'bg-purple-200 text-purple-800',
    'bg-pink-200 text-pink-800',
    'bg-indigo-200 text-indigo-800',
    'bg-teal-200 text-teal-800',
  ];

  const getColor = (index) => colors[index % colors.length];

  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    category: '',
    skills: [],
    budget: { minAmount: '', maxAmount: '', currency: 'INR' },
    paymentType: 'fixed',
    duration: 'less-than-1-week',
    experienceLevel: 'beginner',
    attachments: [],
    visibility: 'public',
    milestones: [],
  });

  const categories = [
    { id: 'web-development', name: 'Website Development' },
    { id: 'mobile-development', name: 'Mobile App Development' },
    { id: 'ui-ux-design', name: 'UI/UX Design' },
    { id: 'graphic-design', name: 'Graphic Design' },
    { id: 'content-writing', name: 'Content Writing' },
    { id: 'video-editing', name: 'Video Editing' },
    { id: 'audio-editing', name: 'Audio Editing' },
    { id: 'data-entry', name: 'Data Entry' },
    { id: 'virtual-assistant', name: 'Virtual Assistant' },
    { id: 'other', name: 'Other' },
  ];

  const experienceLevels = [
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'expert', name: 'Expert' },
  ];

  const durations = [
    { id: 'less-than-1-week', name: 'Less than 1 week' },
    { id: '1-2-weeks', name: '1-2 weeks' },
    { id: '2-4-weeks', name: '2-4 weeks' },
    { id: '1-3-months', name: '1-3 months' },
    { id: '3-6-months', name: '3-6 months' },
    { id: 'more-than-6-months', name: 'More than 6 months' },
  ];

  const commonSkills = [
    'React', 'Node.js', 'JavaScript', 'HTML/CSS', 'Python',
    'Design', 'WordPress', 'UI/UX', 'Copywriting', 'SEO',
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('budget.')) {
      const budgetField = name.split('.')[1];
      setProjectData((prev) => ({
        ...prev,
        budget: { ...prev.budget, [budgetField]: value },
      }));
    } else {
      setProjectData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSkillToggle = (skill) => {
    setProjectData((prev) => {
      const updatedSkills = prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills: updatedSkills };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (Number(projectData.budget.minAmount) > Number(projectData.budget.maxAmount)) {
        toast.error('Minimum budget cannot exceed maximum budget');
        return;
      }
      const response = await projectService.createProject(projectData);
      if (response.statusCode === 201) {
        toast.success('Project created successfully!');
        navigate('/projects');
      } else {
        toast.error(response.message || 'Failed to create project');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}

        <div className="bg-stdBlue p-8 text-white text-center rounded-lg shadow-lg transform transition duration-300 hover:scale-[1.02]">
 

  {/* Heading with Gradient Text Effect */}
  <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
    Start Your New Project
  </h1>

  {/* Description */}
  <p className="mt-3 text-md text-gray-100 opacity-90 max-w-lg mx-auto">
    Define your project scope, set expectations, and connect with skilled professionals.
  </p>
</div>


        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          {/* Title */}
          <div className="space-y-1">
            <label htmlFor="title" className="block text-xl   font-semibold text-stdBlue">
              Project Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={projectData.title}
              onChange={handleInputChange}
              className="w-full px-5 py-3 text-lg border border-gray-300 rounded-xl 
           bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
           transition-all duration-300 ease-in-out 
           hover:border-blue-400 hover:shadow-md focus:shadow-lg"
              placeholder="e.g., Build a Responsive Website"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label htmlFor="description" className="block text-xl  font-semibold text-stdBlue">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={projectData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y"
              placeholder="Describe your project in detail..."
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label htmlFor="category" className="block text-xl  font-semibold text-stdBlue">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={projectData.category}
              onChange={handleInputChange}
              className="w-full px-5 py-3 text-lg border border-gray-300 rounded-xl 
           bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
           transition-all duration-300 ease-in-out 
           hover:border-blue-400 hover:shadow-md focus:shadow-lg"
              required
            >
              <option value="" >Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <label className="block text-xl  font-semibold text-stdBlue">Skills Required</label>
            <div className="flex flex-wrap gap-2">
              {commonSkills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleSkillToggle(skill)}
                  className={`  text-md rounded-xl py-3 px-8 font-medium transition-all${
                    projectData.skills.includes(skill)
                      ? getColor(projectData.skills.indexOf(skill))
                      : 'bg-gray-200 text-gray-700 hover:border border-stdBlue'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-1">
            <label className="block text-xl  font-semibold text-stdBlue">Budget (INR)</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="number"
                name="budget.minAmount"
                value={projectData.budget.minAmount}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Min Amount"
                required
              />
              <input
                type="number"
                name="budget.maxAmount"
                value={projectData.budget.maxAmount}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Max Amount"
                required
              />
            </div>
          </div>

          
          <div className='flex justify-around'>

            {/* Payment Type */}          
          <div className="space-y-1">
            <label htmlFor="paymentType" className="block text-xl  font-semibold text-stdBlue">
              Payment Type
            </label>
            <select
              id="paymentType"
              name="paymentType"
              value={projectData.paymentType}
              onChange={handleInputChange}
              className="w-[250px] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              required
            >
              <option value="fixed">Fixed Price</option>
              <option value="hourly">Hourly Rate</option>
            </select>
          </div>

          {/* Duration */}
          <div className="space-y-1">
            <label htmlFor="duration" className="block  text-xl  font-semibold text-stdBlue">
              Project Duration
            </label>
            <select
              id="duration"
              name="duration"
              value={projectData.duration}
              onChange={handleInputChange}
              className="w-[250px] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              required
            >
              {durations.map((duration) => (
                <option key={duration.id} value={duration.id}>
                  {duration.name}
                </option>
              ))}
            </select>
          </div>

            {/* Experience Level */}
            <div className="space-y-1">
            <label htmlFor="experienceLevel" className="block  text-xl  font-semibold text-stdBlue">
              Experience Level
            </label>
            <select
              id="experienceLevel"
              name="experienceLevel"
              value={projectData.experienceLevel}
              onChange={handleInputChange}
              className="w-[250px] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
              required
            >
              {experienceLevels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>


          </div>

        

          {/* Submit Button */}
          <div className="pt-4 flex items-center justify-center">
            <button
              type="submit"
              className="w-[350px] py-3 px-6 bg-stdBlue text-xl text-white font-semibold rounded-lg shadow-md transition-all 
             
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;