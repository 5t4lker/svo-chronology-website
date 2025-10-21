import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { categoryConfig, events } from './TimelineData';
import { useMemo } from 'react';

interface CategoryFilterProps {
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  onCategoryChange: (category: string | null) => void;
  onSubcategoryChange: (subcategory: string | null) => void;
}

export default function CategoryFilter({ selectedCategory, selectedSubcategory, onCategoryChange, onSubcategoryChange }: CategoryFilterProps) {
  const categories = [
    { id: null, label: 'Все события', icon: 'ListFilter' },
    { id: 'campaign', label: categoryConfig.campaign.label, icon: categoryConfig.campaign.icon },
    { id: 'battle', label: categoryConfig.battle.label, icon: categoryConfig.battle.icon },
    { id: 'unit', label: categoryConfig.unit.label, icon: categoryConfig.unit.icon },
    { id: 'politics', label: categoryConfig.politics.label, icon: categoryConfig.politics.icon },
    { id: 'weapons', label: categoryConfig.weapons.label, icon: categoryConfig.weapons.icon },
  ];

  const subcategories = useMemo(() => {
    if (selectedCategory === 'campaign') {
      const subcats = events
        .filter(e => e.category === 'campaign' && e.subcategory)
        .map(e => e.subcategory)
        .filter((value, index, self) => value && self.indexOf(value) === index) as string[];
      return subcats;
    }
    return [];
  }, [selectedCategory]);

  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-wrap gap-2">
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
      
      {subcategories.length > 0 && (
        <div className="flex flex-wrap gap-2 pl-4 border-l-2 border-primary/30">
          <Button
            variant={selectedSubcategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSubcategoryChange(null)}
            className="gap-2"
          >
            <Icon name="List" size={16} />
            Все {categoryConfig[selectedCategory as keyof typeof categoryConfig]?.label.toLowerCase()}
          </Button>
          {subcategories.map((subcat) => (
            <Button
              key={subcat}
              variant={selectedSubcategory === subcat ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSubcategoryChange(subcat)}
              className="gap-2"
            >
              <Icon name="ChevronRight" size={16} />
              {subcat}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}