interface AvatarAtomProps {
  src: string;
  alt: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "w-10 h-10",
  md: "w-14 h-14",
  lg: "w-20 h-20",
};

export default function AvatarAtom({ src, alt, size = "md" }: AvatarAtomProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={`${sizeMap[size]} rounded-full object-cover border-2 border-[#2F7A5B]`}
    />
  );
}