interface ProgressDetailsIntProps {
    progress: {
        id: number;
        date: string;
        value: string;
    }[];
    }



export async function ProgressDetailsInt({ progress }: ProgressDetailsIntProps) {
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
              <td>{parseInt(item.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
  );
}