export default function Loading() {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-blue-500"></div>
        <h2 className="text-2xl font-semibold mt-4">Loading...</h2>
      </div>
    );
  }
  