import { ReactElement, useContext } from "react";

import AuthRouter from "@/middleware/AuthRouter";
import Dashboard from "@/views/pages/Dashboard";
import { GlobalContext } from "@/store/GlobalState";
import Me from "@/views/pages/Me";

export default function MePage() {
  const { state } = useContext(GlobalContext);
  const user = state.auth.user;
  const role = user?.role;

  if (role === "admin" || user.root) return <Dashboard />;

  return <Me />;
}

MePage.getLayout = function getLayout(page: ReactElement) {
  return <AuthRouter isUser>{page}</AuthRouter>;
};
