import { Suspense } from "react";
import ResetPasswordPage from "./resetPasswordPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading reset form...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
}
