import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SetterEntry } from '../types/setter';
import { Button } from './ui/Button';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { sendToWebhook } from '../utils/webhook';
import { SetterForm } from './setter/SetterForm';
import { SetterEntryList } from './setter/SetterEntryList';
import { useSetterForm } from './setter/useSetterForm';

export function SetterSection() {
  const [entries, setEntries] = useState<SetterEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const { formData, handleInputChange, resetForm } = useSetterForm();

  useEffect(() => {
    fetchEntries();
    const subscription = supabase
      .channel('setter_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'setter_entries' }, fetchEntries)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchEntries() {
    const today = format(new Date(), 'yyyy-MM-dd');
    const { data, error } = await supabase
      .from('setter_entries')
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
    setLoading(true);

    const { error } = await supabase
      .from('setter_entries')
      .insert([formData]);

    if (error) {
      toast.error('Failed to submit setter report');
      setLoading(false);
      return;
    }

    await sendToWebhook(formData, 'setter');
    
    toast.success('Setter report submitted successfully');
    resetForm();
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <SetterForm formData={formData} onChange={handleInputChange} />
        <Button
          type="submit"
          disabled={loading}
          className="w-full py-4 text-lg"
        >
          {loading ? 'Submitting...' : 'Submit Setter Report'}
        </Button>
      </form>

      <SetterEntryList entries={entries} />
    </div>
  );
}