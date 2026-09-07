import { Suspense } from "react";
import RevisionContent from "./RevisionContent";

export default function RevisionPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading revision...</div>}>
      <RevisionContent />
    </Suspense>
  );
}