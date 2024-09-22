export default function NotFound() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="text-lg mt-4">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <a href="/" className="mt-6 text-blue-500 underline">
        Go back to homepage
      </a>
    </div>
  );
}
