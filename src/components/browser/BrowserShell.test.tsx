import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { createInitialState } from "../../game/initialState";
import type { GameAction } from "../../game/reducer";
import { BrowserShell } from "./BrowserShell";

describe("BrowserShell", () => {
  it("renders current url, proxy toggle, tabs, and rule panel", async () => {
    const dispatch = vi.fn<(action: GameAction) => void>();
    render(<BrowserShell state={createInitialState()} dispatch={dispatch} />);

    expect(screen.getByDisplayValue("cloudyai.signup.fake")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /proxy off/i })).toBeInTheDocument();
    expect(screen.getByText("Valid email")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /proxy off/i }));
    expect(dispatch).toHaveBeenCalledWith({ type: "browser/toggleProxy" });
  });

  it("submits typed searches from the address bar", async () => {
    const dispatch = vi.fn<(action: GameAction) => void>();
    render(<BrowserShell state={createInitialState()} dispatch={dispatch} />);

    const address = screen.getByLabelText("Search or enter address");
    await userEvent.clear(address);
    await userEvent.type(address, "verification code{Enter}");

    expect(dispatch).toHaveBeenCalledWith({ type: "browser/submitAddress", value: "verification code" });
  });
});
