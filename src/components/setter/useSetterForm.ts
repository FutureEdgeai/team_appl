import { useState } from 'react';
import { SetterEntry } from '../../types/setter';
import { format } from 'date-fns';

const initialFormData: Omit<SetterEntry, 'id' | 'created_at'> = {
  name: '',
  role: '',
  new_leads: 0,
  expected_calls: 0,
  made_calls: 0,
  cancelled_appointments: 0,
  not_qualified: '',
  sales_appointments: 0,
  linkedin_connections: 0,
  loom_sent: 0,
  notes: '',
  date: format(new Date(), 'yyyy-MM-dd')
};

export function useSetterForm() {
  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isTextArea = e.target.tagName.toLowerCase() === 'textarea';
    const isNumericField = !isTextArea && e.target.type === 'number';

    setFormData(prev => ({
      ...prev,
      [name]: isNumericField ? (value === '' ? 0 : Number(value)) : value
    }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  return {
    formData,
    handleInputChange,
    resetForm
  };
}