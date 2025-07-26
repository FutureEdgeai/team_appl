import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { EODEntry, Task } from '../types';
import { TaskForm } from './TaskForm';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { sendToWebhook } from '../utils/webhook';

export function EODSection() {
  const [entries, setEntries] = useState<EODEntry[]>([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [accomplishedTasks, setAccomplishedTasks] = useState<Task[]>([]);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [blockers, setBlockers] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEntries();
    const subscription = supabase
      .channel('eod_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'eod_entries' }, fetchEntries)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchEntries() {
    const today = format(new Date(), 'yyyy-MM-dd');
    const { data, error } = await supabase
      .from('eod_entries')
      .select('*')
      .eq('date', today)
      .order('created_at', { ascending: true });

    if (error) {
      toast.error('Failed to fetch entries');
      return;
    }

    setEntries(data || []);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (accomplishedTasks.length < 3) return;

    setLoading(true);
    const entry: EODEntry = {
      name,
      role,
      accomplished_tasks: accomplishedTasks,
      pending_tasks: pendingTasks,
      blockers
    };

    const { error } = await supabase
      .from('eod_entries')
      .insert([entry]);

    if (error) {
      toast.error('Failed to submit EOD');
      setLoading(false);
      return;
    }

    await sendToWebhook(entry, 'eod');

    toast.success('EOD submitted successfully');
    setName('');
    setRole('');
    setAccomplishedTasks([]);
    setPendingTasks([]);
    setBlockers('');
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Your Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Accomplished Tasks</h4>
          <TaskForm
            tasks={accomplishedTasks}
            setTasks={setAccomplishedTasks}
            defaultStatus="✅"
            minTasks={3}
            label="Accomplished Tasks"
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-medium">Pending Tasks</h4>
          <TaskForm
            tasks={pendingTasks}
            setTasks={setPendingTasks}
            defaultStatus="⏩"
            minTasks={0}
            label="Pending Tasks"
          />
        </div>

        <div>
          <textarea
            value={blockers}
            onChange={(e) => setBlockers(e.target.value)}
            placeholder="Any blockers or assistance needed? (optional)"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 input-field"
            rows={3}
          />
        </div>

        <Button
          type="submit"
          disabled={loading || accomplishedTasks.length < 3}
          className="w-full py-4 text-lg"
        >
          {loading ? 'Submitting...' : 'Submit EOD'}
        </Button>
      </form>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Today's EOD Reports</h3>
        {entries.map((entry) => (
          <div key={entry.id} className="glass-panel p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="font-medium text-lg">{entry.name}</h4>
                <p className="text-sm text-gray-300">{entry.role}</p>
              </div>
              <span className="text-sm text-gray-400">
                {format(new Date(entry.created_at!), 'HH:mm')}
              </span>
            </div>
            <div className="space-y-4">
              <div>
                <h5 className="font-medium mb-2">Accomplished Tasks</h5>
                <ul className="space-y-3">
                  {entry.accomplished_tasks.map((task, i) => (
                    <li key={i} className="flex items-center gap-3 text-base">
                      <span className="text-xl">{task.status}</span>
                      <span>{task.description}</span>
                      {task.reason && (
                        <span className="text-sm text-gray-400">({task.reason})</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {entry.pending_tasks.length > 0 && (
                <div>
                  <h5 className="font-medium mb-2">Pending Tasks</h5>
                  <ul className="space-y-3">
                    {entry.pending_tasks.map((task, i) => (
                      <li key={i} className="flex items-center gap-3 text-base">
                        <span className="text-xl">{task.status}</span>
                        <span>{task.description}</span>
                        {task.reason && (
                          <span className="text-sm text-gray-400">({task.reason})</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {entry.blockers && (
                <div>
                  <h5 className="font-medium mb-2">Blockers</h5>
                  <p className="text-gray-300">{entry.blockers}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}