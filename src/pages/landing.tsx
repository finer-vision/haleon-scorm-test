import React from "react";
import { Link } from "react-router-dom";
import { useScorm } from "@/hooks/use-scorm";

export default function Landing() {
  React.useEffect(() => {
    useScorm.getState().updateProgress("/");
  }, []);

  return (
    <main>
      <h1>1/3 Landing Page</h1>
      <Link to="/home">Go to Home page</Link>
      <video
        src="https://chkgcampus.sapjam.com/groups/huyYl1rWR50HXn0q2v6hE4/documents/BfDd4VnWy4nfZFKbysmBoY/video_viewer"
        controls
      />
    </main>
  );
}
