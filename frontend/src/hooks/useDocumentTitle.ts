import { useEffect } from "react";
import { APP_NAME } from "@/constants";

// Sets the browser tab title: "Academies · LearnHub", or just the app name
export function useDocumentTitle(title?: string): void {
  useEffect(() => {
    document.title = title ? `${title} · ${APP_NAME}` : APP_NAME;
  }, [title]);
}
