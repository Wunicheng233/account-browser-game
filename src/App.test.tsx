import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { App } from "./App";
import { createInitialState } from "./game/initialState";
import { SAVE_KEY, saveGame } from "./game/persistence";

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("hydrates a saved game and persists reducer updates", async () => {
    const state = createInitialState();
    saveGame({
      ...state,
      browser: {
        ...state.browser,
        currentUrl: "sms.local",
        addressText: "sms.local",
        proxyEnabled: true,
      },
    });

    render(<App />);

    expect(screen.getByDisplayValue("sms.local")).toBeInTheDocument();
    const proxyButton = screen.getByRole("button", { name: /proxy on/i });
    expect(proxyButton).toBeInTheDocument();

    await userEvent.click(proxyButton);

    await waitFor(() => {
      const saved = localStorage.getItem(SAVE_KEY);
      expect(saved).not.toBeNull();
      expect(JSON.parse(saved as string)).toMatchObject({
        browser: {
          proxyEnabled: false,
        },
      });
    });
  });
});
