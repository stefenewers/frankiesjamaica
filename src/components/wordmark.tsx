import Image from "next/image";

/**
 * The FRANKIES wordmark, cut from the official logo (public/images/logo.png).
 * Replace with a vector file when one is available — see ASSET_NOTES.md.
 */
export function Wordmark({
  tone = "brown",
  className = "h-[18px] w-auto",
  priority = false,
}: {
  tone?: "brown" | "bone";
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={`/images/wordmark-${tone}.png`}
      alt="FRANKIES"
      width={780}
      height={143}
      preload={priority}
      unoptimized
      className={className}
    />
  );
}
