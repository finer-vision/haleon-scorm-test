import React from "react";
import { useScorm } from "@/hooks/use-scorm";

export default function End() {
  React.useEffect(() => {
    useScorm.getState().updateProgress("/end");
  }, []);

  return (
    <main>
      <h1>End Page</h1>
      <button onClick={useScorm.getState().exit}>Close Course</button>
    </main>
  );
}
