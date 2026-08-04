import { BrickPreview } from '@/features/bricks/components/brick-preview';
import { BricksHero } from '@/features/bricks/components/bricks-hero';
import { BRICK_COMPONENTS } from '@/features/bricks/lib/brick-components';
import type { BrickCategory } from '@/features/bricks/lib/bricks-registry';
import { getBrickSourceCode } from '@/features/bricks/lib/get-brick-source';

type BrickCategoryViewProps = {
  category: BrickCategory;
};

export async function BrickCategoryView({ category }: BrickCategoryViewProps) {
  const bricksWithCode = await Promise.all(
    category.bricks.map(async (brick) => {
      const { files } = await getBrickSourceCode(category.slug, brick.component);
      return { ...brick, files };
    }),
  );

  return (
    <div className="bg-background min-h-svh">
      <BricksHero activeSlug={category.slug} />
      <div className="flex flex-col gap-16">
        {bricksWithCode.map((brick) => {
          const Component = BRICK_COMPONENTS[brick.component];

          if (!Component) {
            return null;
          }

          return (
            <BrickPreview
              key={brick.id}
              id={brick.id}
              name={brick.name}
              description={brick.description}
              files={brick.files}
            >
              <Component />
            </BrickPreview>
          );
        })}
      </div>
    </div>
  );
}
