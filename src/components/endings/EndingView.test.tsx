import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EndingView } from "./EndingView";

describe("EndingView", () => {
  it("renders the selected ending", () => {
    render(<EndingView endingId="read_only_human" />);

    expect(screen.getByRole("heading", { name: "Read Only Human" })).toBeInTheDocument();
    expect(screen.getByText(/does not trust input/i)).toBeInTheDocument();
  });
});
