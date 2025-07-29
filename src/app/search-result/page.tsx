import { Suspense } from "react";
import SearchResultsPage from "./searchResultPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading search results...</div>}>
      <SearchResultsPage />
    </Suspense>
  );
}
