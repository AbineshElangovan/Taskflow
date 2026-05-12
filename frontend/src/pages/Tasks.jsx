import React, { useEffect, useState } from 'react';
import { taskService, projectService } from '../services/api';
import { Plus, Search, Filter, CheckCircle, Circle, Clock } from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    project: '',
    priority: 'MEDIUM',
    due_date: ''
  });

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        taskService.getAll(),
        projectService.getAll()
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      if (projectsRes.data.length > 0) {
        setNewTask(prev => ({ ...prev, project: projectsRes.data[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleComplete = async (task) => {
    const newStatus = task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED';
    try {
      await taskService.update(task.id, { ...task, status: newStatus });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await taskService.create(newTask);
      setShowModal(false);
      fetchData();
      setNewTask({ title: '', project: projects[0]?.id || '', priority: 'MEDIUM', due_date: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' || task.status === filter;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Tasks</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
        >
          <Plus size={20} />
          <span>Add Task</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" placeholder="Search tasks..." 
            className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2 bg-white border rounded-lg px-3">
          <Filter size={18} className="text-gray-400" />
          <select 
            className="py-2 outline-none bg-transparent text-sm font-medium"
            value={filter} onChange={e => setFilter(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="divide-y">
          {filteredTasks.length > 0 ? filteredTasks.map((task) => (
            <div key={task.id} className="p-4 flex items-center hover:bg-gray-50 transition-colors">
              <button 
                onClick={() => handleToggleComplete(task)}
                className={`mr-4 transition-colors ${task.status === 'COMPLETED' ? 'text-green-500' : 'text-gray-300 hover:text-blue-500'}`}
              >
                {task.status === 'COMPLETED' ? <CheckCircle size={24} /> : <Circle size={24} />}
              </button>
              <div className="flex-1">
                <h4 className={`font-semibold ${task.status === 'COMPLETED' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                  {task.title}
                </h4>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded">
                    {task.project_name}
                  </span>
                  {task.due_date && (
                    <span className="text-xs text-gray-400 flex items-center">
                      <Clock size={12} className="mr-1" />
                      {task.due_date}
                    </span>
                  )}
                </div>
              </div>
              <div className={`text-xs font-bold px-2 py-1 rounded ${
                task.priority === 'HIGH' ? 'text-red-600 bg-red-50' : 
                task.priority === 'MEDIUM' ? 'text-yellow-600 bg-yellow-50' : 'text-green-600 bg-green-50'
              }`}>
                {task.priority}
              </div>
            </div>
          )) : (
            <div className="p-8 text-center text-gray-500">
              No tasks found.
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-6">Add New Task</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Task Title</label>
                <input 
                  type="text" required className="w-full border rounded-lg p-2"
                  value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Project</label>
                <select 
                  className="w-full border rounded-lg p-2"
                  value={newTask.project} onChange={e => setNewTask({...newTask, project: e.target.value})}
                >
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select 
                    className="w-full border rounded-lg p-2"
                    value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}
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
                    value={newTask.due_date} onChange={e => setNewTask({...newTask, due_date: e.target.value})}
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
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
