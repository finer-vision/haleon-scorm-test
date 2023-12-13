import React from "react";
import { Link } from "react-router-dom";
import { useScorm } from "@/hooks/use-scorm";

export default function Two() {
  React.useEffect(() => {
    useScorm.getState().setProgress(0.75);
  }, []);

  return (
    <main>
      <h1>Page 3/4</h1>
      <Link to="/four">Next Page</Link>
    </main>
  );
}
