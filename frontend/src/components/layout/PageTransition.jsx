import React, { useLayoutEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function PageTransition({ children }) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [stage, setStage] = useState("visible"); // visible | fade-out | fade-in

  useLayoutEffect(() => {
    if (location.key !== displayLocation.key) {
      setStage("fade-out");
    }
  }, [location, displayLocation]);

  const handleTransitionEnd = () => {
    if (stage === "fade-out") {
      setDisplayLocation(location);
      setStage("fade-in");
      window.scrollTo(0, 0);
    } else if (stage === "fade-in") {
      setStage("visible");
    }
  };

  return (
    <div
      onTransitionEnd={handleTransitionEnd}
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a", 
        transition: "opacity 0.25s ease-in-out",
        opacity: stage === "fade-out" ? 0 : 1,
      }}
    >
      
      {React.cloneElement(children, { location: displayLocation })}
    </div>
  );
}