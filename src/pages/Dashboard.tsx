import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/Card';
import { Activity, Phone } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className='space-y-4'>
      <Card
        className='cursor-pointer hover:border-blue-500 transition-colors'
        onClick={() => navigate('/report?type=batch')}
      >
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-lg font-medium'>
            Daily Batch Status
          </CardTitle>
          <Activity className='h-4 w-4 text-blue-500' />
        </CardHeader>
        <CardContent>
          <p className='text-sm text-gray-500'>
            View detailed status of daily batches
          </p>
        </CardContent>
      </Card>

      <Card
        className='cursor-pointer hover:border-green-500 transition-colors'
        onClick={() => navigate('/report?type=call')}
      >
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-lg font-medium'>
            Daily Call Status
          </CardTitle>
          <Phone className='h-4 w-4 text-green-500' />
        </CardHeader>
        <CardContent>
          <p className='text-sm text-gray-500'>
            View detailed status of daily calls
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
