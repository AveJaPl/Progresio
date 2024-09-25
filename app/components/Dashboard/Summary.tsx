// components/Summary.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Summary() {
  return (
    <Card className="order-1">
      <CardHeader>
        <CardTitle>Podsumowanie</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Witaj na swoim dashboardzie!</p>
        <p>Sprawdź swoje ostatnie cele i aktywności.</p>
      </CardContent>
    </Card>
  );
}
