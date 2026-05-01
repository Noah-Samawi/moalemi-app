import { Users, Clock, Star, Video } from "lucide-react";

interface FeatureItemProps {
  icon: string;
  title: string;
  subtitle: string;
}

const iconMap: Record<string, React.ElementType> = {
  Users,
  Clock,
  Star,
  Video,
};

export default function FeatureItem({ icon, title, subtitle }: FeatureItemProps) {
  const IconComponent = iconMap[icon] || Star;

  return (
    <div className="flex flex-col items-center text-center p-6">
      <div className="w-16 h-16 rounded-full bg-[#2F7A5B] flex items-center justify-center mb-4">
        <IconComponent className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{subtitle}</p>
    </div>
  );
}