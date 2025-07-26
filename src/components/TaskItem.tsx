import React, { useState } from 'react';
import { Pencil, Trash2, X, Check } from 'lucide-react';
import { Task } from '../types';
import { StatusSelect } from './ui/StatusSelect';
import { Input } from './ui/Input';

interface TaskItemProps {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
  onDelete: () => void;
  canDelete: boolean;
}

export function TaskItem({ task, onUpdate, onDelete, canDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [editedReason, setEditedReason] = useState(task.reason || '');

  const handleSave = () => {
    onUpdate({
      ...task,
      description: editedDescription,
      reason: task.status === '🔴' ? editedReason : undefined
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedDescription(task.description);
    setEditedReason(task.reason || '');
    setIsEditing(false);
  };

  const handleStatusChange = (status: Task['status']) => {
    onUpdate({ ...task, status, reason: status === '🔴' ? task.reason : undefined });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <StatusSelect
          value={task.status}
          onChange={handleStatusChange}
        />
        {isEditing ? (
          <Input
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="flex-1"
          />
        ) : (
          <span className="flex-1 py-2 text-base">{task.description}</span>
        )}
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="p-2 text-green-400 hover:text-green-300 transition-colors"
                type="button"
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                onClick={handleCancel}
                className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-yellow-400 hover:text-yellow-300 transition-colors"
                type="button"
              >
                <Pencil className="w-5 h-5" />
              </button>
              {canDelete && (
                <button
                  onClick={onDelete}
                  className="p-2 text-red-400 hover:text-red-300 transition-colors"
                  type="button"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
      
      {task.status === '🔴' && (
        <div className="ml-[60px]">
          <Input
            value={isEditing ? editedReason : (task.reason || '')}
            onChange={(e) => setEditedReason(e.target.value)}
            placeholder="Reason for not completing..."
            disabled={!isEditing}
            className="w-full text-sm"
          />
        </div>
      )}
    </div>
  );
}