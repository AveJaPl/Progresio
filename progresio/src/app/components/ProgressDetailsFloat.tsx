"use client"; // Deklaracja komponentu klienckiego

interface ProgressDetailsFloatProps {
  progress: {
    id: number;
    date: string;
    value: string;
  }[];
}

export default function ProgressDetailsFloat({ progress }: ProgressDetailsFloatProps) {
  return (
    <div className="max-w-xl mx-auto mt-8">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Progress (Float)</h2>
      <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-lg">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="text-left p-3 font-medium text-gray-600">Date</th>
            <th className="text-left p-3 font-medium text-gray-600">Value</th>
          </tr>
        </thead>
        <tbody>
          {progress.map((item) => (
            <tr key={item.id} className="border-b hover:bg-gray-50 transition">
              {/* Formatowanie daty */}
              <td className="p-3 text-gray-700">{new Date(item.date).toISOString().split('T')[0]}</td>
              {/* Formatowanie wartości float */}
              <td className="p-3 font-semibold text-blue-600">
                {parseFloat(item.value).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
