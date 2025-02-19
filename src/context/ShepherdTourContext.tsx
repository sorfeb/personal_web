'use client';

import { createContext, useContext, useEffect, useState } from "react";
import Shepherd from "shepherd.js";
import {} from 'react-shepherd';
import "shepherd.js/dist/css/shepherd.css";
import styles from './ShepherdTourContext.module.css';

interface ShepherdContextProps {
  startTour: () => void;
  tourStarted: boolean;
}

const ShepherdTourContext = createContext<ShepherdContextProps | undefined>(undefined);

export const ShepherdTourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tour, setTour] = useState<any>(null);
  const [tourStarted, setTourStarted] = useState(false);
  const [showEnableSound, setShowEnableSound] = useState(false);

  useEffect(() => {
    const newTour = new Shepherd.Tour({
      defaultStepOptions: {
        cancelIcon: { enabled: true },
        scrollTo: false,
        classes: styles.customShepherdStep,
      },
      useModalOverlay: true,
    });

    newTour.addSteps([
      {
        id: "enable-sound",
        text: `
          <h3>Enable Sound for the Best Experience!</h3>
          <p>Turn up your system volume or unmute the browser for sound effects.</p>
        `,
        advanceOn: { selector: '.volume-button', event: 'click' },
        buttons: [{ text: "Exit", action: () => newTour.cancel() }, { text: "Next", action: () => newTour.next() }],
      },
      {
        id: "scroll-menu",
        text: `
          <script src="https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs" type="module"></script>
          <dotlottie-player src="https://lottie.host/432e3b4d-c6d3-41de-aa92-fca208f50f53/1Chx97pe5i.lottie" background="transparent" speed="1" style="width: 150px; height: 150px" loop autoplay></dotlottie-player>
          <p>Scroll the area of this menu to navigate through sections.</p>
        `,
        attachTo: { element: "#scrolling-menu-container", on: "bottom" },
        buttons: [{ text: "Exit", action: () => newTour.cancel() }, { text: "Next", action: () => newTour.next() }],      },
      {
        id: "volume-control",
        text: "<p>Adjust the volume here to enjoy sound effects!<p>",
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
      {showEnableSound && (
        <div className="enable-sound-overlay">
          <h3>Enable Sound for the Best Experience!</h3>
          <p>🎵 Turn up your system volume or unmute the browser.</p>
        </div>
      )}
    </ShepherdTourContext.Provider>
  );
};

export const useShepherdTour = () => {
  const context = useContext(ShepherdTourContext);
  if (!context) throw new Error("useShepherdTour must be used within a ShepherdTourProvider");
  return context;
};
