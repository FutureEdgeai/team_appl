import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Task } from '../types';
import { Input } from './ui/Input';
import { TaskItem } from './TaskItem';

interface TaskFormProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  defaultStatus?: Task['status'];
  minTasks?: number;
  label?: string;
}

export function TaskForm({
  tasks,
  setTasks,
  defaultStatus = '🚧',
  minTasks = 3,
  label = 'Tasks'
}: TaskFormProps) {
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { description: newTask.trim(), status: defaultStatus }]);
    setNewTask('');
  };

  const updateTask = (index: number, updatedTask: Task) => {
    const newTasks = [...tasks];
    newTasks[index] = updatedTask;
    setTasks(newTasks);
  };

  const removeTask = (index: number) => {
    if (tasks.length <= minTasks) return;
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder={`Add ${label.toLowerCase()}...`}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          className="flex-1"
        />
        <button
          onClick={addTask}
          className="p-4 text-yellow-400 hover:text-yellow-300 transition-colors"
          type="button"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-3">
        {tasks.map((task, index) => (
          <TaskItem
            key={index}
            task={task}
            onUpdate={(updatedTask) => updateTask(index, updatedTask)}
            onDelete={() => removeTask(index)}
            canDelete={tasks.length > minTasks}
          />
        ))}
      </div>

      {tasks.length < minTasks && (
        <p className="text-sm text-red-400">
          Please add at least {minTasks} tasks
        </p>
      )}
    </div>
  );
}