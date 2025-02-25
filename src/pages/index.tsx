// src/pages/index.tsx
import React, { useState } from "react";
import Header from "../components/Header";
import CookieArt from "../components/CookieArt";
import CookieAnimation from "../components/CookieAnimation";
import FortuneMessage from "../components/FortuneMessage";
import ShareButtons from "../components/ShareButtons";

export default function Home() {
  // Whether the cookie has been cracked
  const [isCookieCracked, setIsCookieCracked] = useState(false);
  // The fortune that appears after cracking the cookie
  const [fortune, setFortune] = useState("");

  // Called when the user clicks the cookie
  const handleCookieClick = () => {
    setIsCookieCracked(true);
    setFortune("Your future is as bright as this cookie!");
  };

  // Resets the cookie, fortune, and animation
  const handleNewCookie = () => {
    setIsCookieCracked(false);
    setFortune("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 flex flex-col items-center justify-center space-y-6">
        {/* Cookie is always displayed */}
        <CookieArt onClick={handleCookieClick} />

        {/* If the cookie is cracked, show animation + fortune + share */}
        {isCookieCracked && (
          <div className="flex flex-col items-center space-y-4">
            <CookieAnimation />
            {fortune && <FortuneMessage message={fortune} />}
            {fortune && <ShareButtons fortune={fortune} />}
          </div>
        )}

        {/* Get New Cookie button below the cookie area */}
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleNewCookie}
        >
          Get New Cookie
        </button>
      </main>
    </div>
  );
}
