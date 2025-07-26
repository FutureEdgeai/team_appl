import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CloserDailyReport } from '../types';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { sendToWebhook } from '../utils/webhook';

const initialFormData: Omit<CloserDailyReport, 'id' | 'created_at'> = {
  name: '',
  role: '',
  total_calls_scheduled: 0,
  calls_completed: 0,
  followup_calls_scheduled: 0,
  revenue_generated: 0,
  cash_collected: 0,
  deposits: 0,
  followup_actions: '',
  sales_team_meetings: 0,
  leadership_meetings: 0,
  training_sessions: 0,
  challenges: '',
  achievements: '',
  next_day_priorities: '',
  date: format(new Date(), 'yyyy-MM-dd')
};

export function CloserSection() {
  const [entries, setEntries] = useState<CloserDailyReport[]>([]);
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEntries();
    const subscription = supabase
      .channel('closer_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'closer_daily_reports' }, fetchEntries)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchEntries() {
    const today = format(new Date(), 'yyyy-MM-dd');
    const { data, error } = await supabase
      .from('closer_daily_reports')
      .select('*')
      .eq('date', today)
      .order('created_at', { ascending: true });

    if (error) {
      toast.error('Failed to fetch entries');
      return;
    }

    setEntries(data || []);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isTextArea = e.target.tagName.toLowerCase() === 'textarea';
    const isNumericField = !isTextArea && e.target.type === 'number';

    setFormData(prev => ({
      ...prev,
      [name]: isNumericField ? (value === '' ? 0 : Number(value)) : value
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('closer_daily_reports')
      .insert([formData]);

    if (error) {
      toast.error('Failed to submit closer report');
      setLoading(false);
      return;
    }

    await sendToWebhook(formData, 'closer');
    
    toast.success('Closer report submitted successfully');
    setFormData(initialFormData);
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Your Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Your Role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            required
          />
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-4">Call Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Total Calls Scheduled"
            name="total_calls_scheduled"
            type="number"
            value={formData.total_calls_scheduled || ''}
            onChange={handleInputChange}
            required
            min={0}
          />
          <Input
            label="Calls Completed"
            name="calls_completed"
            type="number"
            value={formData.calls_completed || ''}
            onChange={handleInputChange}
            required
            min={0}
          />
          <Input
            label="Follow-up Calls Scheduled"
            name="followup_calls_scheduled"
            type="number"
            value={formData.followup_calls_scheduled || ''}
            onChange={handleInputChange}
            required
            min={0}
          />
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-4">Sales Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Revenue Generated"
            name="revenue_generated"
            type="number"
            value={formData.revenue_generated || ''}
            onChange={handleInputChange}
            required
            min={0}
          />
          <Input
            label="Cash Collected"
            name="cash_collected"
            type="number"
            value={formData.cash_collected || ''}
            onChange={handleInputChange}
            required
            min={0}
          />
          <Input
            label="Deposits"
            name="deposits"
            type="number"
            value={formData.deposits || ''}
            onChange={handleInputChange}
            required
            min={0}
          />
        </div>

        <div>
          <textarea
            name="followup_actions"
            value={formData.followup_actions}
            onChange={handleInputChange}
            placeholder="Follow-up Actions Required"
            className="w-full px-6 py-4 rounded-lg input-field"
            rows={3}
          />
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-4">Meeting Attendance</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Sales Team Meetings"
            name="sales_team_meetings"
            type="number"
            value={formData.sales_team_meetings || ''}
            onChange={handleInputChange}
            required
            min={0}
          />
          <Input
            label="Leadership Meetings"
            name="leadership_meetings"
            type="number"
            value={formData.leadership_meetings || ''}
            onChange={handleInputChange}
            required
            min={0}
          />
          <Input
            label="Training Sessions"
            name="training_sessions"
            type="number"
            value={formData.training_sessions || ''}
            onChange={handleInputChange}
            required
            min={0}
          />
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-4">Notes</h3>
        <div className="space-y-4">
          <textarea
            name="challenges"
            value={formData.challenges}
            onChange={handleInputChange}
            placeholder="Challenges Faced"
            className="w-full px-6 py-4 rounded-lg input-field"
            rows={3}
          />
          <textarea
            name="achievements"
            value={formData.achievements}
            onChange={handleInputChange}
            placeholder="Key Achievements"
            className="w-full px-6 py-4 rounded-lg input-field"
            rows={3}
          />
          <textarea
            name="next_day_priorities"
            value={formData.next_day_priorities}
            onChange={handleInputChange}
            placeholder="Next Day Priorities"
            className="w-full px-6 py-4 rounded-lg input-field"
            rows={3}
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full py-4 text-lg"
        >
          {loading ? 'Submitting...' : 'Submit Closer Report'}
        </Button>
      </form>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Today's Closer Reports</h3>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium mb-2">Call Statistics</h5>
                <p className="text-sm text-gray-400">Total Calls Scheduled: {entry.total_calls_scheduled}</p>
                <p className="text-sm text-gray-400">Calls Completed: {entry.calls_completed}</p>
                <p className="text-sm text-gray-400">Follow-up Calls: {entry.followup_calls_scheduled}</p>
              </div>
              
              <div>
                <h5 className="font-medium mb-2">Sales Metrics</h5>
                <p className="text-sm text-gray-400">Revenue: ${entry.revenue_generated}</p>
                <p className="text-sm text-gray-400">Cash Collected: ${entry.cash_collected}</p>
                <p className="text-sm text-gray-400">Deposits: ${entry.deposits}</p>
              </div>
              
              <div>
                <h5 className="font-medium mb-2">Meeting Attendance</h5>
                <p className="text-sm text-gray-400">Sales Team: {entry.sales_team_meetings}</p>
                <p className="text-sm text-gray-400">Leadership: {entry.leadership_meetings}</p>
                <p className="text-sm text-gray-400">Training: {entry.training_sessions}</p>
              </div>
              
              <div>
                <h5 className="font-medium mb-2">Notes</h5>
                {entry.challenges && (
                  <p className="text-sm text-gray-400 mb-2">Challenges: {entry.challenges}</p>
                )}
                {entry.achievements && (
                  <p className="text-sm text-gray-400 mb-2">Achievements: {entry.achievements}</p>
                )}
                {entry.next_day_priorities && (
                  <p className="text-sm text-gray-400">Priorities: {entry.next_day_priorities}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}