import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { useId, useState } from "react";

const bankBranches = [
  {
    value: "001122",
    label: "Chennai - Anna Salai",
  },
  {
    value: "001123",
    label: "Chennai - T. Nagar",
  },
  {
    value: "001124",
    label: "Chennai - Mylapore",
  },
  {
    value: "001125",
    label: "Chennai - Nungambakkam",
  },
  {
    value: "001126",
    label: "Chennai - Adyar",
  },
  {
    value: "001127",
    label: "Chennai - Velachery",
  },
  {
    value: "001128",
    label: "Chennai - OMR",
  },
  {
    value: "001129",
    label: "Chennai - Avadi",
  },
  {
    value: "001130",
    label: "Chennai - Poonamallee",
  },
  {
    value: "001131",
    label: "Bangalore - MG Road",
  },
  {
    value: "001132",
    label: "Bangalore - Koramangala",
  },
  {
    value: "001133",
    label: "Bangalore - Indiranagar",
  },
  {
    value: "001134",
    label: "Bangalore - Jayanagar",
  },
  {
    value: "001135",
    label: "Bangalore - Electronic City",
  },
  {
    value: "001136",
    label: "Hyderabad - Banjara Hills",
  },
  {
    value: "001137",
    label: "Hyderabad - Jubilee Hills",
  },
  {
    value: "001138",
    label: "Hyderabad - Kukatpally",
  },
  {
    value: "001139",
    label: "Hyderabad - Gachibowli",
  },
  {
    value: "001140",
    label: "Hyderabad - Hitech City",
  },
];

export default function BranchSelection() {
  const id = useId();
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-background px-3 font-normal outline-offset-0 hover:bg-background focus-visible:border-ring focus-visible:outline-[3px] focus-visible:outline-ring/20"
          >
            <span
              className={cn(
                "truncate text-sm",
                !value && "text-muted-foreground"
              )}
            >
              {value
                ? bankBranches.find((framework) => framework.value === value)
                    ?.label
                : "Select Branch"}
            </span>
            <ChevronDown
              size={16}
              strokeWidth={2}
              className="shrink-0 text-muted-foreground/80"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder="Search branches..." />
            <CommandList>
              <CommandEmpty>No branches found.</CommandEmpty>
              <CommandGroup>
                {bankBranches.map((framework) => (
                  <CommandItem
                    key={framework.value}
                    value={framework.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {framework.label}
                    {value === framework.value && (
                      <Check size={16} strokeWidth={2} className="ml-auto" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
