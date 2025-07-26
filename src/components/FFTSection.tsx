import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FFTEntry, Task } from '../types';
import { TaskForm } from './TaskForm';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { sendToWebhook } from '../utils/webhook';

export function FFTSection() {
  const [entries, setEntries] = useState<FFTEntry[]>([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEntries();
    const subscription = supabase
      .channel('fft_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'fft_entries' }, fetchEntries)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchEntries() {
    const today = format(new Date(), 'yyyy-MM-dd');
    const { data, error } = await supabase
      .from('fft_entries')
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
    if (tasks.length < 3) return;

    setLoading(true);
    const entry: FFTEntry = {
      name,
      role,
      tasks,
      date: format(new Date(), 'yyyy-MM-dd')
    };

    const { error } = await supabase
      .from('fft_entries')
      .insert([entry]);

    if (error) {
      toast.error('Failed to submit FFT');
      setLoading(false);
      return;
    }

    await sendToWebhook(entry, 'fft');
    
    toast.success('FFT submitted successfully');
    setName('');
    setRole('');
    setTasks([]);
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

        <TaskForm
          tasks={tasks}
          setTasks={setTasks}
          defaultStatus="🚧"
          minTasks={3}
          label="Focus Tasks"
        />

        <Button
          type="submit"
          disabled={loading || tasks.length < 3}
          className="w-full py-4 text-lg"
        >
          {loading ? 'Submitting...' : 'Submit FFT'}
        </Button>
      </form>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Today's Focus Tasks</h3>
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
            <ul className="space-y-3">
              {entry.tasks.map((task, i) => (
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
        ))}
      </div>
    </div>
  );
}