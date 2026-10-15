import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Temporary page to verify Tailwind + shadcn; replaced by the app shell in the next step
export function App() {
  return (
    <main className="flex min-h-svh items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>LearnHub</CardTitle>
          <CardDescription>Frontend scaffold is ready.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full">Browse academies</Button>
        </CardContent>
      </Card>
    </main>
  );
}
