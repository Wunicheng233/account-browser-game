import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { App } from "./App";
import { createInitialState } from "./game/initialState";
import { INTRO_SEEN_KEY, SAVE_KEY, saveGame } from "./game/persistence";
import { createAccountRules } from "./game/rules/createAccountRules";
import { makeState } from "./test/fixtures";

const allCreateRuleIds = createAccountRules.map((rule) => rule.id);

function makeReadyToCreateState() {
  return makeState({
    unlockedRuleIds: allCreateRuleIds,
    profile: {
      email: "ordinary@example.com",
      username: "agent27safe",
      password: "P@sswordCloudyAI27",
      region: "United States",
      phone: "+1 555 0100",
      birthday: "1990-01-01",
      recoveryEmail: "ordinary@backup.com",
      registrationStatement: "I am an ordinary user with nihao context for safe productivity and calm global access.",
      smsCode: "482739",
      identityCard: {
        name: "Ordinary User",
        birthday: "1990-01-01",
        region: "United States",
        identityNumber: "ID-123456",
      },
    },
    browser: {
      proxyEnabled: true,
      currentSmsCode: "482739",
      smsRequiredTotal: 33,
    },
  });
}

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

    const dialog = screen.getByRole("dialog", { name: "Welcome to CloudyAI" });

    expect(dialog).toBeInTheDocument();
    expect(screen.getByText(/This is an account browser/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Address Bar" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Proxy" })).toBeInTheDocument();
    expect(dialog).not.toHaveTextContent(/[\u4e00-\u9fff]/);
  });

  it("remembers when the story briefing has been dismissed", async () => {
    render(<App />);

    await userEvent.click(screen.getByRole("button", { name: "I Am Ready" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Welcome to CloudyAI" })).not.toBeInTheDocument();
      expect(localStorage.getItem(INTRO_SEEN_KEY)).toBe("true");
    });
  });

  it("does not show the story briefing after it was acknowledged", () => {
    localStorage.setItem(INTRO_SEEN_KEY, "true");

    render(<App />);

    expect(screen.queryByRole("dialog", { name: "Welcome to CloudyAI" })).not.toBeInTheDocument();
  });

  it("shows an emotional briefing when registration turns into recovery", async () => {
    localStorage.setItem(INTRO_SEEN_KEY, "true");
    saveGame(makeReadyToCreateState());

    render(<App />);

    await userEvent.click(screen.getByRole("button", { name: "Create Account" }));

    const dialog = await screen.findByRole("dialog", { name: "Oh No. Fuck Cloud." });
    expect(dialog).toHaveTextContent(/I finally got the account open/i);
    expect(dialog).toHaveTextContent(/appeal/i);

    await userEvent.click(screen.getByRole("button", { name: "Start the Appeal" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Oh No. Fuck Cloud." })).not.toBeInTheDocument();
    });
  });
});
