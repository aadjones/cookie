// src/tests/pages/index.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "@/pages/index";

describe("Home page flow", () => {
  test("cookie is visible on load, fortune is hidden", () => {
    render(<Home />);

    // The cookie should be displayed
    const cookieArt = screen.getByLabelText("Cookie Art");
    expect(cookieArt).toBeInTheDocument();

    // Fortune should not be displayed
    expect(screen.queryByText(/Your future is as bright as this cookie!/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Cookie Cracked!/i)).not.toBeInTheDocument();
  });

  test("clicking cookie shows animation and fortune", () => {
    render(<Home />);

    const cookieArt = screen.getByLabelText("Cookie Art");
    fireEvent.click(cookieArt);

    // After clicking, we see the cracked cookie animation
    expect(screen.getByText(/Cookie Cracked!/i)).toBeInTheDocument();
    // And the fortune
    expect(screen.getByText(/Your future is as bright as this cookie!/i)).toBeInTheDocument();
  });

  test("clicking 'Get New Cookie' resets everything", () => {
    render(<Home />);

    const cookieArt = screen.getByLabelText("Cookie Art");
    const newCookieButton = screen.getByRole("button", { name: /get new cookie/i });

    // Crack the cookie first
    fireEvent.click(cookieArt);
    expect(screen.getByText(/Cookie Cracked!/i)).toBeInTheDocument();
    expect(screen.getByText(/Your future is as bright/i)).toBeInTheDocument();

    // Now click "Get New Cookie"
    fireEvent.click(newCookieButton);

    // We should not see the fortune or cracked message anymore
    expect(screen.queryByText(/Cookie Cracked!/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Your future is as bright/i)).not.toBeInTheDocument();

    // The cookie is still visible for cracking again
    expect(cookieArt).toBeInTheDocument();
  });
});
