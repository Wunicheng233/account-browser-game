import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { makeState } from "../../test/fixtures";
import { SiteViewport } from "./SiteViewport";

describe("SiteViewport", () => {
  it("shows proxy access error before rendering blocked sites", () => {
    render(
      <SiteViewport
        state={makeState({ browser: { currentUrl: "cloudyai.signup.fake", proxyEnabled: false } })}
        dispatch={vi.fn()}
      />,
    );

    expect(screen.getByText("Service unavailable")).toBeInTheDocument();
  });

  it("renders the signup site when access is allowed", () => {
    render(
      <SiteViewport
        state={makeState({ browser: { currentUrl: "cloudyai.signup.fake", proxyEnabled: true } })}
        dispatch={vi.fn()}
      />,
    );

    expect(screen.getByRole("region", { name: "Signup form" })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("shows a loading state before rendering the target page", () => {
    render(
      <SiteViewport
        state={makeState({ browser: { currentUrl: "sms.local", isLoading: true } })}
        dispatch={vi.fn()}
      />,
    );

    expect(screen.getByText("Loading secure route")).toBeInTheDocument();
  });

  it("renders search results for a submitted query", async () => {
    const dispatch = vi.fn();
    render(
      <SiteViewport
        state={makeState({ browser: { currentUrl: "search.local", searchQuery: "verification code" } })}
        dispatch={dispatch}
      />,
    );

    expect(screen.getByRole("heading", { name: /search results/i })).toBeInTheDocument();
    expect(screen.getByText("SMS Local Center")).toBeInTheDocument();
  });

  it("renders a searchable phone region guide", () => {
    render(
      <SiteViewport
        state={makeState({
          profile: { region: "United Kingdom" },
          browser: { currentUrl: "phone-region.local", proxyEnabled: true },
        })}
        dispatch={vi.fn()}
      />,
    );

    expect(screen.getByRole("heading", { name: /phone region guide/i })).toBeInTheDocument();
    expect(screen.getByText("United Kingdom")).toBeInTheDocument();
    expect(screen.getByText("+44")).toBeInTheDocument();
  });
});
