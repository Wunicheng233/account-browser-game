import { REGION_PHONE_PREFIX, SUPPORTED_REGIONS } from "../../game/constants";
import type { GameState, SupportedRegion } from "../../game/types";

interface PhoneRegionSiteProps {
  state: GameState;
}

function examplePhone(region: SupportedRegion): string {
  return `${REGION_PHONE_PREFIX[region]} 555 0100`;
}

export function PhoneRegionSite({ state }: PhoneRegionSiteProps) {
  return (
    <div className="site-card phone-region-site">
      <h1>Phone Region Guide</h1>
      <p>Every calling code is a tiny border checkpoint for digits.</p>
      <ul className="phone-code-list">
        {SUPPORTED_REGIONS.map((region) => {
          const selected = region === state.profile.region;

          return (
            <li key={region} className={selected ? "selected" : undefined}>
              <span>{region}</span>
              <strong>{REGION_PHONE_PREFIX[region]}</strong>
              <code>{examplePhone(region)}</code>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
