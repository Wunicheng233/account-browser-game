import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { makeState } from "../../test/fixtures";
import { RulePanel } from "./RulePanel";

describe("RulePanel", () => {
  it("shows only rules that have been unlocked", () => {
    render(<RulePanel state={makeState({ unlockedRuleIds: ["create.email"] })} />);

    expect(screen.getByText("Valid email")).toBeInTheDocument();
    expect(screen.queryByText("Strong password")).not.toBeInTheDocument();
  });

  it("keeps passed rules visible when the next rule appears", () => {
    render(<RulePanel state={makeState({ unlockedRuleIds: ["create.email", "create.password"] })} />);

    expect(screen.getByText("Valid email")).toBeInTheDocument();
    expect(screen.getByText("Strong password")).toBeInTheDocument();
    expect(screen.queryByText("English only")).not.toBeInTheDocument();
  });
});
