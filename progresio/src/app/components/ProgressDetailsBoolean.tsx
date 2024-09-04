interface ProgressDetailsBooleanProps {
    progress: {
        id: number;
        date: string;
        value: string;
    }[];
    }


export async function ProgressDetailsBoolean({ progress }: ProgressDetailsBooleanProps) {
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
              <td>{item.value === 'true' ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}