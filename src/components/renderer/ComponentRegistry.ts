import { Navbar } from "../ui/Navbar";
import { Hero } from "../ui/Hero";
import { Features } from "../ui/Features";
import { Philosophy } from "../ui/Philosophy";
import { Protocol } from "../ui/Protocol";
import { Membership } from "../ui/Membership";
import { Footer } from "../ui/Footer";
import { HtmlBlock } from "../ui/HtmlBlock";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ComponentRegistry: Record<string, React.FC<any>> = {
  navbar: Navbar,
  hero: Hero,
  features: Features,
  philosophy: Philosophy,
  protocol: Protocol,
  membership: Membership,
  footer: Footer,
  html: HtmlBlock,
};

