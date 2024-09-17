import SignUpForm from '@/components/SignUpForm';

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="mb-6 text-center">
          <img
            src="https://via.placeholder.com/150"
            alt="Logo"
            className="mx-auto h-12 w-auto"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign up to your account
          </h2>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
