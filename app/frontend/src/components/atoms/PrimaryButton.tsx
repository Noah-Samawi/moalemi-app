import { Button } from "@/components/ui/button";

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export default function PrimaryButton({
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
}: PrimaryButtonProps) {
  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-[#DCA842] text-[#1A1A2E] hover:bg-[#C49535] font-semibold rounded-lg ${className}`}
    >
      {children}
    </Button>
  );
}