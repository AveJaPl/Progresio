interface ProgressDetailsFloatProps {
    progress: {
        id: number;
        date: string;
        value: string;
    }[];
    }



export async function ProgressDetailsFloat({ progress }: ProgressDetailsFloatProps) {
  return (
    <div>
      <h2>Progress</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {progress.map((item) => (
            <tr key={item.id}>
              <td>{item.date}</td>
              <td>{parseFloat(item.value).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}