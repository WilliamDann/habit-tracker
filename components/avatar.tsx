import Image from "next/image";

interface AvatarProps {
  url: string | null;
  name: string | null;
  size?: number;
}

export function Avatar({ url, name, size = 40 }: AvatarProps) {
  const initials = (name || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (url) {
    return (
      <Image
        src={url}
        alt={name || "Avatar"}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="flex items-center justify-center rounded-full bg-emerald-100 font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initials}
    </div>
  );
}
