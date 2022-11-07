import { ReactElement } from "react";
import AuthRouter from "@/middleware/AuthRouter";

export default function SettingsPage() {
  return <>SettingsPage</>;
}

SettingsPage.getLayout = function getLayout(page: ReactElement) {
  return <AuthRouter isUser>{page}</AuthRouter>;
};
