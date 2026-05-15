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
    expect(screen.getByRole("button", { name: /sms.local/i })).toBeInTheDocument();
    expect(screen.getByText("Valid email")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /proxy off/i }));
    expect(dispatch).toHaveBeenCalledWith({ type: "browser/toggleProxy" });
  });
});
