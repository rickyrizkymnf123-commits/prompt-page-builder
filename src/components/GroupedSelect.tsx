import { GroupedOption } from '@/types/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface GroupedSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: GroupedOption[] | string[];
  label: string;
}

export function GroupedSelect({
  value,
  onValueChange,
  placeholder,
  options,
  label,
}: GroupedSelectProps) {
  const isGrouped = options.length > 0 && typeof options[0] === 'object';

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full bg-secondary border-border">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border z-50">
          {isGrouped
            ? (options as GroupedOption[]).map((group) => (
                <SelectGroup key={group.group}>
                  <SelectLabel className="text-muted-foreground font-semibold text-xs uppercase tracking-wide">
                    {group.group}
                  </SelectLabel>
                  {group.options.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))
            : (options as string[]).map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
        </SelectContent>
      </Select>
    </div>
  );
}
