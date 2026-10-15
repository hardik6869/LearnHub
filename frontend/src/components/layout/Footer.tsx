import { Container } from "@/components/common";
import { APP_DESCRIPTION, APP_NAME } from "@/constants";

export function Footer() {
  return (
    <footer className="border-t">
      <Container className="flex flex-col gap-2 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {APP_NAME}
        </p>
        <p>{APP_DESCRIPTION}</p>
      </Container>
    </footer>
  );
}
