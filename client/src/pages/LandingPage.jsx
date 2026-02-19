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

      tl.from("nav > div", {
        y: -40,
        opacity: 0,
        stagger: 0.15,
      })
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
        .from(
          ".hero-sub",
          {
            y: 30,
            opacity: 0,
          },
          "-=0.6",
        )
        .from(
          ".hero-btn",
          {
            y: 30,
            opacity: 0,
            scale: 0.96,
          },
          "-=0.7",
        )
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
      className="flex flex-col relative items-center font-mono max-w-5xl mx-auto min-h-screen px-4"
    >
      <Cursor />

      <nav className="w-full google-sans h-16 flex items-center justify-between md:px-4">
        <div className="md:ml-4 md:text-xl text-lg google-sans font-bold">
          HackFest 2.0
        </div>

        <div className="md:flex hidden  flex-wrap md:flex-nowrap items-center justify-center gap-4 md:gap-8">
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

        <p
          onClick={() => setShowLoginModel(true)}
          onMouseEnter={() => gsap.to("#cursor", { scale: 2, duration: 0.3 })}
          onMouseLeave={() => gsap.to("#cursor", { scale: 1, duration: 0.3 })}
          className="google-sans cursor-pointer bg-black text-white block md:hidden font-bold py-1 px-4 rounded-full"
        >
          Login
        </p>
      </nav>

      <main className="w-full mt-12 md:mt-0 max-w-[800px] px-4 flex flex-col items-center">
        <h1
          onMouseEnter={() => gsap.to("#cursor", { scale: 4, duration: 0.3 })}
          onMouseLeave={() => gsap.to("#cursor", { scale: 1, duration: 0.3 })}
          className="max-w-[720px] text-black google-sans text-center 
          text-4xl sm:text-5xl md:text-6xl lg:text-8xl 
          font-bold mt-8 leading-tight flex flex-wrap justify-center"
        >
          {"AI that explains your data not just describes it"
            .split(" ")
            .map((t, index) => (
              <span key={index} className="hero-heading inline-block mr-3">
                {t}
              </span>
            ))}
        </h1>

        <p className="hero-sub google-sans text-base sm:text-lg text-gray-500 mt-5 text-center">
          Transform your data into insights with our AI-powered platform.
        </p>

        <div className="flex items-center justify-center mt-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="hero-btn bg-black google-sans text-white font-bold py-2 px-6 md:px-4 rounded-full"
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
