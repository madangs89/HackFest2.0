import React, { useEffect, useState } from "react";
import Cursor from "../components/Cursor";
import { gsap } from "gsap";
import AuthOverlay from "../components/AuthOverlay";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [showLoginModel, setShowLoginModel] = useState(false);
  const navigate = useNavigate();

  const heroRef = React.useRef(null);

  useEffect(() => {
    gsap.config({
      autoSleep: 60,
      force3D: true,
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
          duration: 1,
        },
      });

      // Navbar animation
      tl.from("nav > div", {
        y: -40,
        opacity: 0,
        stagger: 0.15,
      })

        // Hero heading words
        .from(
          ".hero-heading",
          {
            y: 70,
            opacity: 0,
            stagger: {
              each: 0.05,
            },
          },
          "-=0.4",
        )

        // Sub text
        .from(
          ".hero-sub",
          {
            y: 30,
            opacity: 0,
          },
          "-=0.6",
        )

        // Button
        .from(
          ".hero-btn",
          {
            y: 30,
            opacity: 0,
            scale: 0.96,
          },
          "-=0.7",
        )

        // Feature grid (if exists)
        .from(
          ".f-grid",
          {
            y: 60,
            opacity: 0,
            stagger: 0.08,
          },
          "-=0.6",
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={heroRef}
      className="flex flex-col relative items-center font-mono max-w-5xl mx-auto h-full"
    >
      <Cursor />

      <nav className="w-full google-sans h-16 flex items-center justify-between">
        <div className="ml-4 text-xl google-sans font-bold">HackFest 2.0</div>

        <div className="flex items-center justify-center gap-8">
          <p
            onMouseEnter={() => gsap.to("#cursor", { scale: 2, duration: 0.3 })}
            onMouseLeave={() => gsap.to("#cursor", { scale: 1, duration: 0.3 })}
            className="google-sans cursor-pointer"
          >
            Features
          </p>

          <p
            onMouseEnter={() => gsap.to("#cursor", { scale: 2, duration: 0.3 })}
            onMouseLeave={() => gsap.to("#cursor", { scale: 1, duration: 0.3 })}
            className="google-sans cursor-pointer"
          >
            Working
          </p>

          <p
            onMouseEnter={() => gsap.to("#cursor", { scale: 2, duration: 0.3 })}
            onMouseLeave={() => gsap.to("#cursor", { scale: 1, duration: 0.3 })}
            className="google-sans cursor-pointer"
          >
            Pricing
          </p>

          <p
            onClick={() => setShowLoginModel(true)}
            onMouseEnter={() => gsap.to("#cursor", { scale: 2, duration: 0.3 })}
            onMouseLeave={() => gsap.to("#cursor", { scale: 1, duration: 0.3 })}
            className="google-sans cursor-pointer bg-black text-white font-bold py-1 px-4 rounded-full"
          >
            Login
          </p>
        </div>
      </nav>

      <main className="w-[800px] flex flex-col items-center">
        <h1
          onMouseEnter={() => gsap.to("#cursor", { scale: 4, duration: 0.3 })}
          onMouseLeave={() => gsap.to("#cursor", { scale: 1, duration: 0.3 })}
          className="max-w-[720px] text-black google-sans text-center text-8xl font-bold mt-8 leading-tight flex flex-wrap justify-center"
        >
          {"AI that explains your data not just describes it"
            .split(" ")
            .map((t, index) => (
              <span key={index} className="hero-heading inline-block mr-3">
                {t}
              </span>
            ))}
        </h1>

        <p className="hero-sub google-sans text-lg text-gray-500 mt-5">
          Transform your data into insights with our AI-powered platform.
        </p>

        <div className="flex items-center justify-center mt-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="hero-btn bg-black google-sans text-white font-bold py-2 px-4 rounded-full"
          >
            Get Started
          </button>
        </div>
      </main>

      {showLoginModel && (
        <AuthOverlay
          open={showLoginModel}
          onClose={() => setShowLoginModel(false)}
        />
      )}
    </div>
  );
};

export default LandingPage;
