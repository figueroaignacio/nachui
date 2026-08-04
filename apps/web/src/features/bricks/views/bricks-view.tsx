import { BricksHero } from '@/features/bricks/components/bricks-hero';
import { BRICK_CATEGORIES } from '@/features/bricks/lib/bricks-registry';
import { Link } from '@/i18n/navigation';
import { ArrowRight02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Typography } from '@repo/ui/components/typography';
import { Flex } from '@repo/ui/layout/flex';
import { Grid } from '@repo/ui/layout/grid';
import { Stack } from '@repo/ui/layout/stack';

export function BricksView() {
  return (
    <div className="bg-background relative min-h-svh overflow-hidden pb-24">
      <BricksHero />
      <Grid columns="1" gap="6" className="md:grid-cols-2 lg:grid-cols-3">
        {BRICK_CATEGORIES.map((category) => (
          <Link
            key={category.slug}
            href={`/bricks/${category.slug}`}
            className="group border-border bg-background hover:bg-surface-muted hover:border-foreground/30 relative overflow-hidden rounded-2xl border transition-all duration-300"
          >
            <Stack className="justify-between p-6">
              <Stack gap="4">
                <Flex
                  align="center"
                  justify="center"
                  className="bg-surface-muted text-foreground border-border size-12 rounded-xl border shadow-sm"
                >
                  <span className="text-lg font-bold">{category.name.charAt(0)}</span>
                </Flex>
                <div>
                  <Typography
                    variant="h3"
                    className="text-foreground text-xl font-semibold tracking-tight"
                  >
                    {category.name}
                  </Typography>
                  <Typography
                    variant="p"
                    className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-relaxed"
                  >
                    {category.description}
                  </Typography>
                </div>
              </Stack>
              <Flex align="center" className="mt-8 text-sm font-medium">
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                  {category.bricks.length} component{category.bricks.length !== 1 ? 's' : ''}
                </span>
                <span className="text-foreground ml-auto -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                  <HugeiconsIcon icon={ArrowRight02Icon} size={16} />
                </span>
              </Flex>
            </Stack>
          </Link>
        ))}
      </Grid>
    </div>
  );
}
