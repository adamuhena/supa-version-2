// src/pages/NotAuthorized.jsx
import { Button } from '@/components/ui/Button';  // Using ShadCN Button component

const NotAuthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-lg p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-extrabold text-red-600 mb-4">403 - Forbidden</h1>
        <p className="text-lg text-gray-700 mb-6">
          You do not have the necessary permissions to access this page.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Please contact the system administrator or try logging in again.
        </p>
        <Button
          onClick={() => window.location.href = '/login'}  // Redirecting to login page
          className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
        >
          Go to Login Page
        </Button>
      </div>
    </div>
  );
};

export default NotAuthorized;
