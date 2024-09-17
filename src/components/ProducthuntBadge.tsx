'use client';

import Image from "next/image";

const PRODUCT_HUNT_LINK = `https://www.producthunt.com/posts/geopulse?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-geopulse`;
const PRODUCT_HUNT_BADGE_LINK = `https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=480751&theme=light`;
const PRODUCT_HUNT_BADGE_ALT = `GeoPulse - Analyse&#0032;relationship&#0032;between&#0032;two&#0032;countries&#0032;in&#0032;a&#0032;single&#0032;click | Product Hunt`;

export default function ProductHuntBadge({ className = "" }: { className?: string }) {
  return (
    <a id="productHuntBadge" href={PRODUCT_HUNT_LINK} target="_blank" style={{ scale: "0.7", marginBottom: '12px' }} className={className}>
      <Image
        src={PRODUCT_HUNT_BADGE_LINK}
        alt={PRODUCT_HUNT_BADGE_ALT}
        width="250"
        height="54"
        style={{ width: "250px", height: "54px" }}
      />
    </a>
  );
}