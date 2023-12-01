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
        src="https://chkgcampus.sapjam.com/groups/R584Kafq5dKUSLY6U5D3Yp/documents/chIf04wz1GWPGzAye77QJR/video_viewer"
        controls
      />
      <video
        src="https://haleon.sharepoint.com/:v:/s/mywinningcareer/Ed0hCYeBK71Kl-0c9lIvgt8BPSSfPR1miO-FE2NH2Sb53A?e=FSBhj1"
        controls
      />
    </main>
  );
}
