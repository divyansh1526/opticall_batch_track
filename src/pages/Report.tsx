import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchReport } from '../services/api';

interface ReportData {
  date: string;
  status: string;
  count: number;
}

function statusStyle(status: string) {
  if (status === 'Completed') return 'bg-green-100 text-green-800';
  if (status === 'Failed') return 'bg-red-100 text-red-800';
  return 'bg-yellow-100 text-yellow-800';
}

export default function Report() {
  const [searchParams] = useSearchParams();
  const reportType = searchParams.get('type') === 'batch' ? 'Batch' : 'Call';
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().split('T')[0];

  const [fromDate, setFromDate] = useState(yesterday);
  const [toDate, setToDate] = useState(today);
  const [data, setData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setSelectedStatus('');
    try {
      const result = await fetchReport({
        type: searchParams.get('type') === 'batch' ? 'batch' : 'call',
        fromDate,
        toDate,
      });
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleShow = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const availableStatuses = useMemo(
    () => Array.from(new Set(data.map((r) => r.status))).sort(),
    [data]
  );

  const filteredData = useMemo(
    () => (selectedStatus ? data.filter((r) => r.status === selectedStatus) : data),
    [data, selectedStatus]
  );

  const totalCount = useMemo(
    () => filteredData.reduce((sum, r) => sum + r.count, 0),
    [filteredData]
  );

  return (
    <div className='space-y-4'>
      <Button
        variant='ghost'
        className='pl-0'
        onClick={() => navigate('/dashboard')}
      >
        <ArrowLeft className='mr-2 h-4 w-4' />
        Back to Dashboard
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{reportType} Status Report</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleShow} className='space-y-4'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <Input
                label='From Date'
                type='date'
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                required
              />
              <Input
                label='To Date'
                type='date'
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                required
              />
            </div>
            <Button type='submit' className='w-full' isLoading={loading}>
              Show Report
            </Button>
          </form>
        </CardContent>
      </Card>

      {data.length > 0 && (
        <>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
            <div className='flex items-center gap-2'>
              <label className='text-sm font-medium text-gray-700'>Filter by Status:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className='text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500'
              >
                <option value=''>All Statuses</option>
                {availableStatuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className='flex items-center gap-2 text-sm'>
              <span className='text-gray-500'>
                {selectedStatus ? `Total "${selectedStatus}":` : 'Total Calls:'}
              </span>
              <span className='font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-full'>
                {totalCount.toLocaleString()}
              </span>
            </div>
          </div>

          <Card>
            <CardContent className='p-0 overflow-hidden'>
              <div className='overflow-x-auto'>
                <table className='w-full text-sm text-left'>
                  <thead className='text-xs text-gray-700 uppercase bg-gray-50 border-b'>
                    <tr>
                      <th className='px-6 py-3'>Date</th>
                      <th className='px-6 py-3'>Status</th>
                      <th className='px-6 py-3 text-right'>Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((row, index) => (
                      <tr
                        key={index}
                        className='bg-white border-b last:border-0 hover:bg-gray-50'
                      >
                        <td className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap'>
                          {row.date}
                        </td>
                        <td className='px-6 py-4'>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle(row.status)}`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className='px-6 py-4 text-right'>{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
