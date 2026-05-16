import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { App } from "../App";

describe("playability", () => {
  it("lets a player toggle proxy and see the main account form", async () => {
    localStorage.clear();
    render(<App />);

    expect(screen.getByText("Service unavailable")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /proxy off/i }));

    expect(await screen.findByRole("region", { name: "Signup form" })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("lets a player search for helper sites instead of using fixed URL buttons", async () => {
    localStorage.clear();
    render(<App />);

    const address = screen.getByLabelText("Search or enter address");
    await userEvent.clear(address);
    await userEvent.type(address, "verification code{Enter}");

    expect(await screen.findByRole("heading", { name: /search results/i })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /open sms local center/i }));

    expect(await screen.findByRole("heading", { name: /sms local center/i })).toBeInTheDocument();
  });
});
