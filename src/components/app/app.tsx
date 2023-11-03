import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AppReset, AppVersion } from "@/components/app/app.styles";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import End from "@/pages/end";
import pkg from "../../../package.json";
import { useScorm } from "@/hooks/use-scorm";

export default function App() {
  const [loading, setLoaded] = React.useState(true);

  const navigate = useNavigate();

  React.useEffect(() => {
    const page = useScorm.getState().init();
    setLoaded(false);
    navigate(page);
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
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/end" element={<End />} />
        </Routes>
      </React.Suspense>
    </>
  );
}
