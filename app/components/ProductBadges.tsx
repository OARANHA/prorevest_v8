import React from 'react';
import { Award, Leaf, Star, Zap } from 'lucide-react';

interface ProductBadgesProps {
  badges?: string[];
}

export function ProductBadges({ badges }: ProductBadgesProps) {
  if (!badges || badges.length === 0) return null;

  const getBadgeIcon = (badge: string) => {
    switch (badge.toLowerCase()) {
      case 'mais vendido':
        return <Star className="h-3 w-3 mr-1" />;
      case 'eco friendly':
        return <Leaf className="h-3 w-3 mr-1" />;
      case 'baixo odor':
        return <Zap className="h-3 w-3 mr-1" />;
      case 'premium':
        return <Award className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge.toLowerCase()) {
      case 'mais vendido':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'eco friendly':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'baixo odor':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'premium':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'economia':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'essencial':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'recomendado':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-orange-100 text-orange-800 border-orange-200';
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge, index) => (
        <span
          key={index}
          className={`px-3 py-1 text-xs font-bold border flex items-center ${getBadgeColor(badge)}`}
        >
          {getBadgeIcon(badge)}
          {badge}
        </span>
      ))}
    </div>
  );
}