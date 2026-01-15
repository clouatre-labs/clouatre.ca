import type { Props } from "astro";
import IconBrandX from "@/assets/icons/IconBrandX.svg";
import IconFacebook from "@/assets/icons/IconFacebook.svg";
import IconGitHub from "@/assets/icons/IconGitHub.svg";
import IconLinkedin from "@/assets/icons/IconLinkedin.svg";
import IconMastodon from "@/assets/icons/IconMastodon.svg";
import IconPinterest from "@/assets/icons/IconPinterest.svg";
import IconRss from "@/assets/icons/IconRss.svg";
import IconTelegram from "@/assets/icons/IconTelegram.svg";
import IconWhatsapp from "@/assets/icons/IconWhatsapp.svg";
import { SITE } from "@/config";

interface Social {
  name: string;
  href: string;
  linkTitle: string;
  icon: (_props: Props) => Element;
}

export const SOCIALS: Social[] = [
  {
    name: "GitHub",
    href: "https://github.com/clouatre",
    linkTitle: `${SITE.title} on GitHub`,
    icon: IconGitHub,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/huguesclouatre/",
    linkTitle: `${SITE.title} on LinkedIn`,
    icon: IconLinkedin,
  },
  {
    name: "Fediverse",
    href: "https://fed.brid.gy/web/clouatre.ca",
    linkTitle: `${SITE.title} on the Fediverse`,
    icon: IconMastodon,
  },
  {
    name: "RSS",
    href: "/rss.xml",
    linkTitle: `${SITE.title} RSS Feed`,
    icon: IconRss,
  },
] as const;

export const SHARE_LINKS: Social[] = [
  {
    name: "WhatsApp",
    href: "https://wa.me/?text=",
    linkTitle: `Share this post via WhatsApp`,
    icon: IconWhatsapp,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/sharer.php?u=",
    linkTitle: `Share this post on Facebook`,
    icon: IconFacebook,
  },
  {
    name: "X",
    href: "https://x.com/intent/post?url=",
    linkTitle: `Share this post on X`,
    icon: IconBrandX,
  },
  {
    name: "Telegram",
    href: "https://t.me/share/url?url=",
    linkTitle: `Share this post via Telegram`,
    icon: IconTelegram,
  },
  {
    name: "Pinterest",
    href: "https://pinterest.com/pin/create/button/?url=",
    linkTitle: `Share this post on Pinterest`,
    icon: IconPinterest,
  },
] as const;
