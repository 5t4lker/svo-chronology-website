import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { categoryConfig } from './TimelineData';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const categories = [
    { id: null, label: 'Все события', icon: 'ListFilter' },
    { id: 'campaign', label: categoryConfig.campaign.label, icon: categoryConfig.campaign.icon },
    { id: 'battle', label: categoryConfig.battle.label, icon: categoryConfig.battle.icon },
    { id: 'unit', label: categoryConfig.unit.label, icon: categoryConfig.unit.icon },
    { id: 'politics', label: categoryConfig.politics.label, icon: categoryConfig.politics.icon },
    { id: 'weapons', label: categoryConfig.weapons.label, icon: categoryConfig.weapons.icon },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((cat) => (
        <Button
          key={cat.id || 'all'}
          variant={selectedCategory === cat.id ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange(cat.id)}
          className="gap-2"
        >
          <Icon name={cat.icon as any} size={16} />
          {cat.label}
        </Button>
      ))}
    </div>
  );
}
