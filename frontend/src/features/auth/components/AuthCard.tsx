import type { ReactNode } from "react";
import { Container } from "@/components/common";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui";
import { useDocumentTitle } from "@/hooks";

interface AuthCardProps {
  title: string;
  description?: ReactNode;
  /** Links under the form, e.g. "Don't have an account? Sign up" */
  footer?: ReactNode;
  children: ReactNode;
}

// Centred card shared by the login, register and password pages; also sets the page title
export function AuthCard({ title, description, footer, children }: AuthCardProps) {
  useDocumentTitle(title);

  return (
    <Container className="flex justify-center py-10 sm:py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>{children}</CardContent>
        {footer && (
          <CardFooter className="justify-center text-sm text-muted-foreground">{footer}</CardFooter>
        )}
      </Card>
    </Container>
  );
}
