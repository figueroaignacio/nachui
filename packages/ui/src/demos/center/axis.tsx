import { Center } from '../../layout/center';

const chip = 'bg-primary text-primary-foreground rounded-md px-3 py-1.5 text-xs font-medium';
const frame = 'border-border bg-hatch h-24 w-full rounded-lg border';

export function Axis() {
  return (
    <div className="grid w-full max-w-md grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="flex flex-col gap-1.5">
        <Center className={frame}>
          <span className={chip}>both</span>
        </Center>
        <span className="text-muted-foreground text-center text-xs">axis="both"</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <Center axis="horizontal" className={frame}>
          <span className={chip}>horizontal</span>
        </Center>
        <span className="text-muted-foreground text-center text-xs">axis="horizontal"</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <Center axis="vertical" className={frame}>
          <span className={chip}>vertical</span>
        </Center>
        <span className="text-muted-foreground text-center text-xs">axis="vertical"</span>
      </div>
    </div>
  );
}
