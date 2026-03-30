import { useEffect } from "react";

export default function useContentProtection() {
    useEffect(() => {
        const prevent = (e: Event) => e.preventDefault();

        document.addEventListener("copy", prevent);
        document.addEventListener("cut", prevent);
        document.addEventListener("contextmenu", prevent);

        document.body.style.userSelect = "none";

        return () => {
            document.removeEventListener("copy", prevent);
            document.removeEventListener("cut", prevent);
            document.removeEventListener("contextmenu", prevent);
            document.body.style.userSelect = "auto";
        };
    }, []);
}
