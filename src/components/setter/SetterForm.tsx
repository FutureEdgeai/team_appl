import React from 'react';
import { Input } from '../ui/Input';
import { SetterEntry } from '../../types/setter';

interface SetterFormProps {
  formData: Omit<SetterEntry, 'id' | 'created_at'>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function SetterForm({ formData, onChange }: SetterFormProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Your Name"
          name="name"
          value={formData.name}
          onChange={onChange}
          required
        />
        <Input
          label="Your Role"
          name="role"
          value={formData.role}
          onChange={onChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="New Leads Received"
          name="new_leads"
          type="number"
          value={formData.new_leads || ''}
          onChange={onChange}
          required
          min={0}
        />
        <Input
          label="Number of Calls Expected"
          name="expected_calls"
          type="number"
          value={formData.expected_calls || ''}
          onChange={onChange}
          required
          min={0}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Number of Calls Made"
          name="made_calls"
          type="number"
          value={formData.made_calls || ''}
          onChange={onChange}
          required
          min={0}
        />
        <Input
          label="Number of Cancelled Appointments"
          name="cancelled_appointments"
          type="number"
          value={formData.cancelled_appointments || ''}
          onChange={onChange}
          required
          min={0}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Call/Person NOT Qualified"
          name="not_qualified"
          value={formData.not_qualified}
          onChange={onChange}
          required
        />
        <Input
          label="LinkedIn Connections"
          name="linkedin_connections"
          type="number"
          value={formData.linkedin_connections || ''}
          onChange={onChange}
          required
          min={0}
        />
        <Input
          label="Number of Loom Value/Explanation Sent"
          name="loom_sent"
          type="number"
          value={formData.loom_sent || ''}
          onChange={onChange}
          required
          min={0}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Input
          label="Number of Sales Appointments Booked"
          name="sales_appointments"
          type="number"
          value={formData.sales_appointments || ''}
          onChange={onChange}
          required
          min={0}
        />
      </div>

      <div>
        <textarea
          name="notes"
          value={formData.notes || ''}
          onChange={onChange}
          placeholder="Notes (how was your day?)"
          className="w-full px-6 py-4 rounded-lg input-field"
          rows={4}
        />
      </div>
    </div>
  );
}