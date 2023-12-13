import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AppReset, AppVersion } from "@/components/app/app.styles";
import One from "@/pages/one";
import Two from "@/pages/two";
import Three from "@/pages/three";
import Four from "@/pages/four";
import pkg from "../../../package.json";
import { useScorm } from "@/hooks/use-scorm";

export default function App() {
  const [loading, setLoaded] = React.useState(true);

  const navigate = useNavigate();

  React.useEffect(() => {
    useScorm
      .getState()
      .init()
      .then((bookmark) => {
        setLoaded(false);
        navigate(bookmark.pathname);
      });
  }, []);

  if (loading) {
    return <>Loading...</>;
  }

  return (
    <>
      <AppReset />
      <AppVersion>v{pkg.version}</AppVersion>
      <React.Suspense fallback="Loading...">
        <Routes>
          <Route path="/" element={<One />} />
          <Route path="/two" element={<Two />} />
          <Route path="/three" element={<Three />} />
          <Route path="/four" element={<Four />} />
        </Routes>
      </React.Suspense>
    </>
  );
}
