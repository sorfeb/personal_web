'use client';

import { createContext, useContext, useEffect, useState } from "react";
import Shepherd from "shepherd.js";
import {} from 'react-shepherd';
import "shepherd.js/dist/css/shepherd.css";

interface ShepherdContextProps {
  startTour: () => void;
  tourStarted: boolean;
}

const ShepherdTourContext = createContext<ShepherdContextProps | undefined>(undefined);

export const ShepherdTourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tour, setTour] = useState<any>(null);
  const [tourStarted, setTourStarted] = useState(false);

  useEffect(() => {
    const newTour = new Shepherd.Tour({
      defaultStepOptions: {
        cancelIcon: { enabled: true },
        scrollTo: false,
      },
      useModalOverlay: true,
    });

    newTour.addSteps([
      {
        id: "scroll-menu",
        text: `
          <script src="https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs" type="module"></script>
          <dotlottie-player src="https://lottie.host/7a4189d9-6ae7-4389-a50b-a039e3b50abf/Bt6j1vtDs8.lottie" background="transparent" speed="1" style="width: 150px; height: 150px" loop autoplay></dotlottie-player>
          <p>Use this menu to navigate.</p>
        `,
        attachTo: { element: "#scrolling-menu-container", on: "bottom" },
        buttons: [{ text: "Next", action: () => newTour.next() }, { text: "Exit", action: () => newTour.cancel() }],
      },
      {
        id: "volume-control",
        text: "Adjust the volume here.",
        attachTo: { element: "#volume-control-container", on: "top" },
        buttons: [{ text: "Finish", action: () => newTour.complete() }],
      },
    ]);

    setTour(newTour);
  }, []);

  const startTour = () => {
    if (tour) {
      setTourStarted(true);
      tour.start();
    }
  };

  return (
    <ShepherdTourContext.Provider value={{ startTour, tourStarted }}>
      {children}
    </ShepherdTourContext.Provider>
  );
};

export const useShepherdTour = () => {
  const context = useContext(ShepherdTourContext);
  if (!context) throw new Error("useShepherdTour must be used within a ShepherdTourProvider");
  return context;
};
