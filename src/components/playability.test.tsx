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

    expect(screen.getByRole("heading", { name: /cloudyai account/i })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });
});
