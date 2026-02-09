import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from './ui/Button';

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, clear auth tokens here
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      <header className='bg-white border-b border-gray-200 sticky top-0 z-10'>
        <div className='max-w-md mx-auto px-4 h-16 flex items-center justify-between'>
          <h1 className='text-lg font-bold text-gray-900'>OptiCall Admin</h1>
          <Button variant='ghost' size='sm' onClick={handleLogout}>
            <LogOut className='h-4 w-4 mr-2' />
            Logout
          </Button>
        </div>
      </header>
      <main className='flex-1 max-w-md mx-auto w-full p-4'>
        <Outlet />
      </main>
    </div>
  );
}
