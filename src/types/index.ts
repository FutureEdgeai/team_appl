export type TaskStatus = '🚧' | '✅' | '🔴' | '⏩' | '🎯';

export interface Task {
  description: string;
  status: TaskStatus;
  reason?: string;
}

export interface FFTEntry {
  id?: string;
  name: string;
  role: string;
  tasks: Task[];
  created_at?: string;
  date?: string;
}

export interface EODEntry {
  id?: string;
  name: string;
  role: string;
  accomplished_tasks: Task[];
  pending_tasks: Task[];
  blockers?: string;
  created_at?: string;
  date?: string;
}

export interface CloserDailyReport {
  id?: string;
  name: string;
  role: string;
  
  // Call Statistics
  total_calls_scheduled: number;
  calls_completed: number;
  followup_calls_scheduled: number;
  
  // Sales Metrics
  revenue_generated: number;
  cash_collected: number;
  deposits: number;
  followup_actions?: string;
  
  // Meeting Attendance
  sales_team_meetings: number;
  leadership_meetings: number;
  training_sessions: number;
  
  // Notes
  challenges?: string;
  achievements?: string;
  next_day_priorities?: string;
  
  created_at?: string;
  date?: string;
}

export interface SetterEntry {
  id?: string;
  name: string;
  role: string;
  leads_contacted: number;
  emails_sent: number;
  calls_made: number;
  appointments_set: number;
  reschedules: number;
  cancellations: number;
  linkedin_messages: number;
  linkedin_connections: number;
  notes?: string;
  created_at?: string;
  date?: string;
}