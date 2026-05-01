import { Button } from "@/components/ui/button";

interface SecondaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function SecondaryButton({
  children,
  onClick,
  className = "",
}: SecondaryButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className={`border-2 border-[#2F7A5B] text-[#2F7A5B] hover:bg-[#2F7A5B] hover:text-white font-semibold rounded-lg bg-transparent ${className}`}
    >
      {children}
    </Button>
  );
}