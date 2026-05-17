import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { makeState } from "../../test/fixtures";
import { createAccountRules } from "../../game/rules/createAccountRules";
import { recoverAccountRules } from "../../game/rules/recoverAccountRules";
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

  it("lists unmet rules above passed rules", () => {
    const { container } = render(
      <RulePanel
        state={makeState({
          unlockedRuleIds: ["create.email", "create.password", "create.englishOnly"],
          profile: {
            email: "ordinary@example.com",
            password: "",
          },
        })}
      />,
    );

    const titles = [...container.querySelectorAll(".rule-heading strong")].map((node) => node.textContent);

    expect(titles).toEqual(["Strong password", "Valid email", "English only"]);
  });

  it("counts rules within the current chapter instead of the whole game", () => {
    const { rerender } = render(<RulePanel state={makeState({ unlockedRuleIds: ["create.email"] })} />);

    expect(screen.getByText(`0/${createAccountRules.length}`)).toBeInTheDocument();
    expect(screen.queryByText(`0/${createAccountRules.length + recoverAccountRules.length}`)).not.toBeInTheDocument();

    rerender(
      <RulePanel
        state={makeState({
          chapter: "recover",
          unlockedRuleIds: ["recover.salutation"],
        })}
      />,
    );

    expect(screen.getByText(`0/${recoverAccountRules.length}`)).toBeInTheDocument();
    expect(screen.queryByText(`0/${createAccountRules.length + recoverAccountRules.length}`)).not.toBeInTheDocument();
  });
});
