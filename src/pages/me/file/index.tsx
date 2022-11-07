import React, { ReactElement } from "react";
import AuthRouter from "@/middleware/AuthRouter";

export default function Files() {
  return <>FilesPage</>;
}

Files.getLayout = function getLayout(page: ReactElement) {
  return <AuthRouter>{page}</AuthRouter>;
};
