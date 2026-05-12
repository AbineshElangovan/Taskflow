import React, { useEffect, useState } from 'react';
import { projectService } from '../services/api';
import { Plus, MoreVertical, Calendar, Flag } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    priority: 'MEDIUM',
    status: 'PLANNING',
    due_date: ''
  });

  const fetchProjects = async () => {
    try {
      const res = await projectService.getAll();
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await projectService.create(newProject);
      setShowModal(false);
      fetchProjects();
      setNewProject({ name: '', description: '', priority: 'MEDIUM', status: 'PLANNING', due_date: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'text-red-600 bg-red-50';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50';
      case 'LOW': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>New Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-gray-800">{project.name}</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical size={20} />
              </button>
            </div>
            <p className="text-gray-500 text-sm mb-6 line-clamp-2 h-10">
              {project.description || 'No description provided.'}
            </p>
            
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(project.priority)}`}>
                {project.priority}
              </span>
              <span className="text-xs font-medium text-gray-400 flex items-center">
                <Calendar size={14} className="mr-1" />
                {project.due_date || 'No date'}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-gray-500">Progress</span>
                <span className="text-blue-600">
                  {project.task_count > 0 ? Math.round((project.completed_task_count / project.task_count) * 100) : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all" 
                  style={{ width: `${project.task_count > 0 ? (project.completed_task_count / project.task_count) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Simple Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-6">Create New Project</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project Name</label>
                <input 
                  type="text" required className="w-full border rounded-lg p-2"
                  value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea 
                  className="w-full border rounded-lg p-2"
                  value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})}
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select 
                    className="w-full border rounded-lg p-2"
                    value={newProject.priority} onChange={e => setNewProject({...newProject, priority: e.target.value})}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Due Date</label>
                  <input 
                    type="date" className="w-full border rounded-lg p-2"
                    value={newProject.due_date} onChange={e => setNewProject({...newProject, due_date: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
