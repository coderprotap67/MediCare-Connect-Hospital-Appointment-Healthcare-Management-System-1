import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-9xl font-extrabold text-primary">404</h1>
      <h2 className="text-2xl font-bold mt-4">Page Not Found</h2>
      <p className="text-gray-500 mt-2">The page you are looking for does not exist or has been moved.</p>
      <Link href="/" className="btn btn-primary text-white mt-6">Back to Home</Link>
    </div>
  );
}