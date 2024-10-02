// components/Summary.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Summary() {
  return (
    <Card className="order-1">
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Welcome to your dashboard!</p>
        <p>Check your latest goals and activities.</p>
      </CardContent>
    </Card>
  );
}
