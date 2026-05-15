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

    expect(screen.getByRole("heading", { name: /cloudyai account/i })).toBeInTheDocument();
  });
});
