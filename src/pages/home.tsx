import React from "react";
import { Link } from "react-router-dom";
import { useScorm } from "@/hooks/use-scorm";

export default function Home() {
  React.useEffect(() => {
    useScorm.getState().updateProgress("/home");
  }, []);

  return (
    <main>
      <h1>Home Page</h1>
      <Link to="/end">Go to End page</Link>
    </main>
  );
}
