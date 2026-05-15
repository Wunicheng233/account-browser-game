import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { makeState } from "../../test/fixtures";
import { SmsSite } from "./SmsSite";

describe("SmsSite", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-15T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("refreshes the code when the SMS timer expires", async () => {
    const dispatch = vi.fn();
    render(
      <SmsSite
        state={makeState({
          browser: { smsRefreshAt: Date.now() + 1_000 },
        })}
        dispatch={dispatch}
      />,
    );

    act(() => {
      vi.advanceTimersByTime(1_000);
    });

    expect(dispatch).toHaveBeenCalledWith({
      type: "sms/refresh",
      seed: Date.now(),
      now: Date.now(),
    });
  });
});
