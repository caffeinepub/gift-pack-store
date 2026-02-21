import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Category } from '@/backend';

interface CategoryListProps {
  categories: Category[];
  isLoading: boolean;
}

export default function CategoryList({ categories, isLoading }: CategoryListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">
            No categories created yet. Create your first category above.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {categories.map((category, index) => (
        <Card key={`${category.name}-${index}`}>
          <CardHeader>
            <CardTitle className="text-lg">{category.name}</CardTitle>
            {category.description && (
              <CardDescription>{category.description}</CardDescription>
            )}
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
