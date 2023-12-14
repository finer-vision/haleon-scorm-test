import React from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AppReset, AppVersion } from "@/components/app/app.styles";
import One from "@/pages/one";
import Two from "@/pages/two";
import Three from "@/pages/three";
import Four from "@/pages/four";
import pkg from "../../../package.json";
import { useScorm } from "@/hooks/use-scorm";

export default function App() {
  const [started, setStarted] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  const navigate = useNavigate();
  React.useEffect(() => {
    if (!started) return;
    useScorm
      .getState()
      .init()
      .then((bookmark) => {
        navigate(bookmark.pathname);
        setLoading(false);
      });
  }, [started]);

  const { pathname } = useLocation();
  React.useEffect(() => {
    if (!started) return;
    if (loading) return;
    useScorm.getState().setBookmark({ pathname });
  }, [started, loading, pathname]);

  if (!started) {
    return <button onClick={() => setStarted(true)}>Initialize SCORM</button>;
  }

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
