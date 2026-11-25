import React from "react";
import logo from "../assets/images/logo.png";

/**
 * The site logo (BirthdayMessaging seal), used in the navbar, the footer and
 * the portal / admin header.
 *
 * To change the logo: replace src/assets/images/logo.png with a square PNG
 * that has a transparent background (192 x 192 px is enough). The emails use
 * their own copy in career-launch-api/src/email-logo.ts.
 */
export const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <img
    src={logo}
    alt=""
    aria-hidden="true"
    width={192}
    height={192}
    draggable={false}
    className={`shrink-0 select-none ${className}`}
  />
);
