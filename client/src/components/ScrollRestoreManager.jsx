import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function ScrollRestoreManager() {
  const { pathname } = useLocation();
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
    if (navType === "POP") {
      // User clicked Back or Forward button in browser
      const savedPos = scrollPositions.current.get(pathname);
      if (savedPos !== undefined && savedPos > 0) {
        // Start from top, then smoothly scroll down to saved position
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
  }, [pathname, navType]);

  return null;
}
