"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export default function FirstLoadAnimation() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const pathname = usePathname();

  // Separate effect for overflow reset on route changes
  useEffect(() => {
    // CRITICAL: Reset overflow on EVERY route change to prevent stuck scroll
    document.body.style.overflow = 'auto';
  }, [pathname]);

  // Animation effect - runs ONCE on mount
  useEffect(() => {
    // Skip animation on admin routes
    if (pathname?.startsWith('/admin')) {
      document.body.style.overflow = 'auto';
      const pageContent = document.getElementById('page-content');
      if (pageContent) {
        pageContent.style.opacity = '1';
      }
      return;
    }

    // Check if animation has already played in this session
    const hasAnimated = sessionStorage.getItem('firstLoadAnimationPlayed');

    console.log('FirstLoadAnimation - hasAnimated:', hasAnimated); // DEBUG

    if (hasAnimated) {
      // Animation already played, ensure body is scrollable and content is visible
      console.log('Skipping animation - already played'); // DEBUG
      document.body.style.overflow = 'auto';
      const pageContent = document.getElementById('page-content');
      if (pageContent) {
        pageContent.style.opacity = '1';
      }
      return;
    }

    console.log('Playing animation for the first time'); // DEBUG

    // Show animation and mark as played IMMEDIATELY
    setIsVisible(true);
    sessionStorage.setItem('firstLoadAnimationPlayed', 'true');

    // Lock scrolling during animation
    document.body.style.overflow = 'hidden';

    // Set GSAP defaults exactly as in the original
    gsap.defaults({ ease: "power3.out" });

    // Store timeline reference for cleanup
    let tl: gsap.core.Timeline | null = null;

    // Wait for DOM elements to be rendered before animating
    setTimeout(() => {
      tl = gsap.timeline({
        delay: 0.2,
        onComplete: () => {
          // Start fade out
          setTimeout(() => {
            setIsFadingOut(true);
            // Show page content and remove loader
            const pageContent = document.getElementById('page-content');
            if (pageContent) {
              pageContent.style.opacity = '1';
              pageContent.style.transition = 'opacity 0.6s ease-in';
            }
            setTimeout(() => {
              setIsVisible(false);
              document.body.style.overflow = 'auto';
            }, 600);
          }, 500);
        }
      });

      /* ZERO 1 rolls in */
      tl.to(".z1", {
        x: 180,
        duration: 0.8,
        ease: "elastic.out(1, 0.9)"
      });

      /* ZERO 2 rolls in */
      tl.to(".z2", {
        x: 150,
        duration: 0.6,
        ease: "elastic.out(1, 0.4)"
      }, "-=0.2");

      /* PUSH reaction */
      tl.to(".z1", {
        x: 195,
        scaleX: 0.9,
        duration: 0.3,
        ease: "power2.inOut"
      }, "<")

        // recover shape
        .to(".z1", {
          scaleX: 1,
          duration: 0.15,
          ease: "power2.out"
        });

      /* prepare both 1s */
      tl.set([".o1", ".o1-clone"], {
        opacity: 1,
        y: 0
      });

      /* drop BOTH together */
      tl.to([".o1", ".o1-clone"], {
        y: 190,
        duration: 0.45,
        ease: "power2.in"
      }, "-=0.2")

        /* single bounce up (together) */
        .to([".o1", ".o1-clone"], {
          y: 155,
          duration: 0.25,
          ease: "power2.out"
        })

        /* settle (together) */
        .to([".o1", ".o1-clone"], {
          y: 190,
          duration: 0.2,
          ease: "power2.in"
        })

        /* split AFTER settle */
        .to(".o1-clone", {
          x: -145,
          duration: 0.5,
          ease: "power2.inOut"
        });
    }, 50); // 50ms delay for DOM to render

    // Cleanup - restore overflow and kill animation if component unmounts
    return () => {
      if (tl) tl.kill();
      document.body.style.overflow = 'auto';
    };
  }, []); // Empty deps - only run ONCE on mount

  if (!isVisible) return null;

  return (
    <div className={`first-load-overlay ${isFadingOut ? 'fade-out' : ''}`}>
      <div className="animation-wrapper">
        <div className="stage">
          <div className="zero z1"></div>
          <div className="zero z2"></div>
          <div className="one o1"></div>
          <div className="one o1-clone"></div>
        </div>
      </div>

      <style jsx>{`
        .first-load-overlay {
          position: fixed;
          inset: 0;
          display: grid;
          place-items: center;
          background: oklch(0.10 0.015 264);
          z-index: 9999;
          overflow: hidden;
          opacity: 1;
          transition: opacity 0.6s ease-out;
        }

        .first-load-overlay.fade-out {
          opacity: 0;
        }

        .animation-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          transform: scale(0.4);
          padding-left: 115px;
          padding-right: 50px;
        }

        .stage {
          position: relative;
          width: 400px;
          height: 150px;
        }

        .zero {
          width: 80px;
          height: 120px;
          border: 12px solid white;
          border-radius: 50%;
          position: absolute;
          top: 15px;
        }

        .z1 {
          left: -120px;
        }

        .z2 {
          left: -220px;
        }

        .one {
          width: 12px;
          height: 110px;
          background: white;
          position: absolute;
          top: -170px;
          left: 40px;
        }

        .o1-clone {
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
