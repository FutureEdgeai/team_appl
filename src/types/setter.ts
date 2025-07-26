export interface SetterEntry {
  id?: string;
  name: string;
  role: string;
  new_leads: number;
  expected_calls: number;
  made_calls: number;
  cancelled_appointments: number;
  not_qualified: string;
  sales_appointments: number;
  linkedin_connections: number;
  loom_sent: number;
  notes?: string;
  created_at?: string;
  date?: string;
}