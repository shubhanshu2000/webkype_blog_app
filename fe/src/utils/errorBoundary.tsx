import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";

const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => {
  useEffect(() => {
    console.error("Caught by ErrorBoundary:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-3xl font-semibold text-red-600">
        Something went wrong!
      </h1>
      <p className="text-gray-500">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={resetErrorBoundary}
      >
        Retry
      </button>
    </div>
  );
};

const AppErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
  );
};

export default AppErrorBoundary;
