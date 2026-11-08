export const NAV = [
  { href: "/", label: "Beranda" },
  { href: "/kopi", label: "Kopi" },
  { href: "/cerita", label: "Cerita" },
  { href: "/kunjungi", label: "Kunjungi" },
];

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
