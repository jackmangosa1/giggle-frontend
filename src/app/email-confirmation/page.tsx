import { Suspense } from "react";
import EmailConfirmationPage from "./emailConfirmationPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading confirmation...</div>}>
      <EmailConfirmationPage />
    </Suspense>
  );
}
