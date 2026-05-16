import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { App } from "./App";
import { createInitialState } from "./game/initialState";
import { INTRO_SEEN_KEY, SAVE_KEY, saveGame } from "./game/persistence";

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

  it("shows a story briefing the first time the site opens", () => {
    render(<App />);

    expect(screen.getByRole("dialog", { name: "剧情说明" })).toBeInTheDocument();
    expect(screen.getByText(/你正在使用一台过分合规的伪浏览器/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "代理" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "浏览器" })).toBeInTheDocument();
  });

  it("remembers when the story briefing has been dismissed", async () => {
    render(<App />);

    await userEvent.click(screen.getByRole("button", { name: "开始被审核" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "剧情说明" })).not.toBeInTheDocument();
      expect(localStorage.getItem(INTRO_SEEN_KEY)).toBe("true");
    });
  });

  it("does not show the story briefing after it was acknowledged", () => {
    localStorage.setItem(INTRO_SEEN_KEY, "true");

    render(<App />);

    expect(screen.queryByRole("dialog", { name: "剧情说明" })).not.toBeInTheDocument();
  });
});
