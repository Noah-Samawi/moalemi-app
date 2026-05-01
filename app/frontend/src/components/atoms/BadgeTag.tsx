interface BadgeTagProps {
  text: string;
  variant?: "green" | "gold" | "default";
}

const variantStyles = {
  green: "bg-green-50 text-[#2F7A5B]",
  gold: "bg-yellow-50 text-[#DCA842]",
  default: "bg-gray-100 text-gray-700",
};

export default function BadgeTag({ text, variant = "default" }: BadgeTagProps) {
  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${variantStyles[variant]}`}
    >
      {text}
    </span>
  );
}