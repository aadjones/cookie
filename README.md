# Digital Fortune Cookie MVP

This project is a digital fortune cookie application built with Next.js, TypeScript, Tailwind CSS, and Jest.

## Features

- Interactive cookie generation
- Placeholder generative art using p5.js
- Simulated cookie cracking animation
- AI-generated fortune messages (to be integrated)
- Share functionality

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/aadjones/cookie.git
   cd cookie
   ```

2. **Install dependencies:**

   ```bash
   npm install

   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser and navigate to:**
   - http://localhost:3000

## Development Tools

### Testing Cookie Personalities

For testing specific cookie personalities, you can use the following scripts:

1. **Force a specific cookie personality:**

   ```bash
   npm run force-cookie <cookie-id>
   ```

   Available cookie IDs:

   - toxic-positivity
   - error
   - conspiracy
   - actuarial
   - misfortune
   - matryoshka
   - gaslighting
   - quantum
   - apathetic
   - insightful

2. **Restore random cookie selection:**

   ```bash
   npm run restore-cookie
   ```

## License

This project is licensed under the MIT License.
