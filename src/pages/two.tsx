import React from "react";
import { Link } from "react-router-dom";
import { useScorm } from "@/hooks/use-scorm";

export default function Two() {
  React.useEffect(() => {
    useScorm.getState().setProgress(0.5);
  }, []);

  return (
    <main>
      <h1>Page 2/4</h1>
      <Link to="/three">Next Page</Link>
    </main>
  );
}
