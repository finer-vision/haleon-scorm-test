import React from "react";
import { Link } from "react-router-dom";
import { useScorm } from "@/hooks/use-scorm";

export default function One() {
  React.useEffect(() => {
    useScorm.getState().setProgress(0.25);
  }, []);

  return (
    <main>
      <h1>Page 1/4</h1>
      <Link to="/two">Next Page</Link>
    </main>
  );
}
