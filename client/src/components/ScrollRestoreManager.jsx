import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function ScrollRestoreManager() {
  const { pathname, hash } = useLocation();
  const navType = useNavigationType();
  const scrollPositions = useRef(new Map());

  useEffect(() => {
    // Store current scroll position before unmounting/changing path
    const handleScroll = () => {
      scrollPositions.current.set(pathname, window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  useEffect(() => {
    if (hash) {
      // If there is a hash (e.g. #testimonials), scroll to that element
      const targetId = hash.replace("#", "");
      const scrollToHashElement = () => {
        const element = document.getElementById(targetId);
        if (element) {
          const navbarHeight = 80;
          const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
          return true;
        }
        return false;
      };

      // Try immediately or after short delays for component mounting
      if (!scrollToHashElement()) {
        const timer1 = setTimeout(scrollToHashElement, 100);
        const timer2 = setTimeout(scrollToHashElement, 300);
        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
        };
      }
    } else if (navType === "POP") {
      // User clicked Back or Forward button in browser
      const savedPos = scrollPositions.current.get(pathname);
      if (savedPos !== undefined && savedPos > 0) {
        window.scrollTo(0, 0);
        const timer = setTimeout(() => {
          window.scrollTo({
            top: savedPos,
            behavior: "smooth"
          });
        }, 100);
        return () => clearTimeout(timer);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      // New navigation: scroll smoothly to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname, hash, navType]);

  return null;
}
