import React from "react";
import { useScorm } from "@/hooks/use-scorm";

export default function Four() {
  React.useEffect(() => {
    useScorm.getState().setProgress(1);
  }, []);

  return (
    <main>
      <h1>Page 4/4</h1>
      <button onClick={useScorm.getState().exit}>Close Course</button>
    </main>
  );
}
