import React from "react";
import { Link } from "react-router-dom";
import { useScorm } from "@/hooks/use-scorm";

export default function Landing() {
  React.useEffect(() => {
    useScorm.getState().updateProgress("/");
  }, []);

  return (
    <main>
      <h1>Landing Page</h1>
      <Link to="/home">Go to Home page</Link>
    </main>
  );
}
