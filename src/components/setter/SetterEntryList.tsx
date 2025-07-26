import React from 'react';
import { format } from 'date-fns';
import { SetterEntry } from '../../types/setter';

interface SetterEntryListProps {
  entries: SetterEntry[];
}

export function SetterEntryList({ entries }: SetterEntryListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Today's Setter Reports</h3>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-400">New Leads: {entry.new_leads}</p>
              <p className="text-sm text-gray-400">Expected Calls: {entry.expected_calls}</p>
              <p className="text-sm text-gray-400">Calls Made: {entry.made_calls}</p>
              <p className="text-sm text-gray-400">Cancelled: {entry.cancelled_appointments}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Sales Appointments: {entry.sales_appointments}</p>
              <p className="text-sm text-gray-400">LinkedIn Connections: {entry.linkedin_connections}</p>
              <p className="text-sm text-gray-400">Loom Sent: {entry.loom_sent}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm"><strong>Not Qualified:</strong> {entry.not_qualified}</p>
            {entry.notes && (
              <p className="text-sm mt-4"><strong>Notes:</strong> {entry.notes}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}