import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { makeState } from "../../test/fixtures";
import { CloudySignupSite } from "./CloudySignupSite";

describe("CloudySignupSite", () => {
  it("shows the closest username similarity score beside the username field", () => {
    render(<CloudySignupSite state={makeState({ profile: { username: "globaltraveler27" } })} dispatch={vi.fn()} />);

    expect(screen.getByText("Too similar to globaltraveler: 100%.")).toBeInTheDocument();
  });
});
