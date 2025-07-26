import { FFTEntry, EODEntry, CloserEntry, SetterEntry } from '../types';

const WEBHOOK_URL = 'https://hook.us2.make.com/28ntjcio5uibggrmt4cy41lhts9i9jn2';

function formatTasks(tasks: { description: string; status: string; reason?: string }[]): string {
  return tasks
    .map(task => {
      const taskText = `${task.status} ${task.description}`;
      return task.reason ? `${taskText} (${task.reason})` : taskText;
    })
    .join('\n');
}

function formatEntry(
  data: FFTEntry | EODEntry | CloserEntry | SetterEntry,
  type: 'fft' | 'eod' | 'closer' | 'setter'
) {
  const baseData = {
    name: data.name,
    role: data.role,
    timestamp: new Date().toISOString(),
    type
  };

  switch (type) {
    case 'fft':
      return {
        ...baseData,
        tasks: formatTasks((data as FFTEntry).tasks),
      };
    case 'eod':
      const eodData = data as EODEntry;
      return {
        ...baseData,
        accomplished_tasks: formatTasks(eodData.accomplished_tasks),
        pending_tasks: formatTasks(eodData.pending_tasks),
        blockers: eodData.blockers,
      };
    case 'closer':
      return {
        ...baseData,
        ...(data as CloserEntry),
      };
    case 'setter':
      return {
        ...baseData,
        ...(data as SetterEntry),
      };
    default:
      return baseData;
  }
}

export async function sendToWebhook(
  data: FFTEntry | EODEntry | CloserEntry | SetterEntry,
  type: 'fft' | 'eod' | 'closer' | 'setter'
) {
  try {
    const formattedData = formatEntry(data, type);
    
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    });
  } catch (error) {
    console.error('Failed to send webhook:', error);
  }
}