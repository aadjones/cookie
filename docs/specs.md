# **Digital Fortune Cookie MVP Specification**

## **1\. Project Overview**

**Concept:**  
A digital fortune cookie experience that combines whimsical generative art, an interactive “cookie-opening” animation, and AI-generated fortune messages with unique, algorithmically determined names. Users will visit the website, click “Generate,” see a uniquely generated cookie (placeholder art initially), tap/click it to “crack it open” via an animation, reveal a fortune message, and have the option to share the result.

**Core Value:**  
Deliver a playful, engaging, and shareable user experience that captures the traditional magic of fortune cookies with a modern digital twist.

---

## **2\. Technology Stack**

- **Front-End Framework:** Next.js (with TypeScript)
  - _Why Next.js?_
    - Server-side rendering for better performance/SEO if needed
    - Built-in routing, easy integration with serverless functions
- **Styling:** Tailwind CSS
- **Generative Art Library:** p5.js (integrated via a React wrapper, e.g., `react-p5`)
  - _Note:_ For the MVP, use a placeholder component for cookie art generation.
- **Back-End / API:** Vercel Serverless Functions
  - _Purpose:_ Handle API calls to a cloud-hosted LLM (via Hugging Face Inference API) to generate fortune messages.
- **LLM Integration:** Hugging Face Inference API
  - _Usage:_ Send a prompt to generate a fortune message with a random tone.
- **Deployment:** Vercel (for both front-end and serverless functions)

_Optional (for future phases):_

- Database (e.g., MongoDB or Firestore) to save user favorites/history, if required.

---

## **3\. Functional Requirements**

### **A. User Interface & Flow**

1. **Landing/Home Page:**
   - A welcoming landing page that briefly explains the experience.
   - Prominent "Generate" button to initiate the fortune cookie generation process.
2. **Cookie Generation Page (Main View):**
   - **Header/Toolbar:**
     - Logo/Branding
     - Optional navigation links (e.g., About, FAQ)
   - **Primary Area:**
     - **Generate Button:** When clicked, triggers the backend API call and art generation.
     - **Cookie Art Display:**
       - Initially use a placeholder image/component that represents the cookie.
       - Display an algorithmically generated name (from a simple random word generator function).
     - **Interactive “Cookie-Opening” Animation:**
       - When the user clicks on the cookie image, an animation plays simulating the cookie being cracked open.
       - This animation should be consistent (e.g., a smooth crack effect with subtle sound) to serve as the signature moment of the experience.
   - **Fortune Reveal:**
     - Once the animation completes, display the AI-generated fortune message below (or inside) the cookie.
   - **Share Functionality:**
     - Provide share buttons/links for social media (e.g., Twitter, Facebook) so that users can share the cookie art, name, and fortune message.
   - **Regenerate Option:**
     - A "Generate New Cookie" button to allow users to restart the experience.

### **B. Backend/API Functionalities**

1. **Fortune Message Generation Endpoint:**
   - **Endpoint:** `/api/generate-fortune`
   - **Method:** POST
   - **Function:**
     - Receives a request (optionally with parameters like random seed if needed) and calls the Hugging Face Inference API.
     - Incorporates a random element (e.g., d20 roll to choose tone/personality) into the prompt.
     - Returns a fortune message (a short sentence or two).
2. **Random Name Generation:**
   - This can be implemented as a simple utility function on the client-side in TypeScript.
   - Generate a quirky, algorithmically determined name for each cookie (e.g., “Celestial Crisp,” “Mystic Spiral”).
3. **(Optional) Logging/Analytics:**
   - Optionally, track API calls or user interactions using Vercel’s built-in analytics or a third-party service.

---

## **4\. Component & System Architecture**

### **Front-End Components (Next.js with TypeScript)**

- **LandingPage Component:**
  - Explains the app briefly and features the primary "Generate" button.
- **CookieGenerator Component:**
  - Handles the main interactive experience:
    - **GenerateButton:** Triggers the backend API call and art generation.
    - **CookieArt Component:** Uses p5.js (or a placeholder for now) to display generative art.
    - **CookieName Display:** Shows the randomly generated name.
    - **Interactive Animation:** When the cookie is clicked, plays the “cookie-cracking” animation.
    - **FortuneMessage Display:** Shows the fortune after the animation.
    - **ShareButtons:** Options for sharing via social media.
    - **GenerateNewButton:** Resets the experience for another generation.

### **Back-End (Vercel Serverless Functions)**

- **/api/generate-fortune Function:**
  - Written in TypeScript/Node.js.
  - Handles the HTTP request, constructs a prompt with random tone parameters, calls the Hugging Face API, and returns the generated fortune message.

---

## **5\. User Flow Diagram (High Level)**

1. **User lands on the homepage.**
2. **User clicks "Generate":**
   - Front-end calls `/api/generate-fortune` serverless function.
   - Simultaneously, a placeholder art (or a temporary algorithmic art generation) is initiated.
3. **Cookie Generation:**
   - The app displays a generated cookie image (with its unique, algorithmically chosen name).
4. **User clicks the cookie:**
   - The cookie-opening animation plays.
5. **Fortune Reveal:**
   - Once the animation completes, the fortune message appears.
6. **User can share the result or click "Generate New" to restart the process.**

---

## **6\. Non-Functional Requirements**

- **Performance:**
  - The cookie art and animation should load smoothly.
  - API calls to the Hugging Face Inference API must have low latency.
- **Scalability:**
  - Use Vercel’s serverless functions to automatically scale the backend.
- **Maintainability:**
  - Code should be modular and well-documented using TypeScript.
  - Use established libraries (e.g., Next.js, Tailwind CSS, react-p5).
- **User Experience:**
  - The interface should be responsive and intuitive.
  - Animation and sound effects should enhance, not distract from, the overall experience.

---

## **7\. Future Enhancements (Post-MVP)**

- **Enhanced Generative Art:**
  - Replace placeholder art with a more sophisticated p5.js-based algorithm that produces fully unique cookie visuals.
- **Advanced Personalization:**
  - Incorporate subtle contextual cues (time, random seed) to vary fortunes further.
- **Database Integration:**
  - Optionally store user favorites, share history, or usage analytics.
- **NFT Integration:**
  - Explore minting unique cookies as NFTs if the project gains traction.
- **Mobile Optimization:**
  - Enhance the experience for mobile users beyond basic responsiveness.

---

## **8\. Summary**

The MVP for the Digital Fortune Cookie app involves a Next.js/TypeScript front-end using Tailwind CSS and p5.js for the art. The back-end uses Vercel serverless functions to call an LLM (via Hugging Face) for fortune message generation. The core experience is an interactive, fun interface where users click to generate a unique cookie, see an engaging animation of it being cracked open, reveal a quirky fortune, and share the experience—all while keeping costs and complexity minimal for initial launch.
