'use client';

import * as React from "react"
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "~/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "~/components/ui/popover"
import useGetCountries from "~/hooks/useGetCountries"
import { useComparisonStore } from "~/store/useComparisonStore"

export default function MultiCountrySelect() {
  const [open, setOpen] = React.useState(false);
  const { formattedCountries } = useGetCountries();
  const { selectedCountries, setSelectedCountries } = useComparisonStore();

  const toggleCountry = (countryValue: string) => {
    if (selectedCountries.includes(countryValue)) {
      setSelectedCountries(selectedCountries.filter(c => c !== countryValue));
    } else {
      setSelectedCountries([...selectedCountries, countryValue]);
    }
  };

  const removeCountry = (countryValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCountries(selectedCountries.filter(c => c !== countryValue));
  };

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between min-h-[40px] h-auto",
              selectedCountries.length === 0 && "text-muted-foreground"
            )}
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {selectedCountries.length === 0 ? (
                "Select countries..."
              ) : (
                selectedCountries.map((country) => {
                  const countryData = formattedCountries.find(c => c.value === country);
                  return (
                    <span
                      key={country}
                      className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                    >
                      {countryData?.flag} {countryData?.label}
                      <Cross2Icon
                        className="h-3 w-3 cursor-pointer hover:text-blue-600"
                        onClick={(e) => removeCountry(country, e)}
                      />
                    </span>
                  );
                })
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command>
            <CommandInput placeholder="Search countries..." className="h-9" />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {formattedCountries.map((country) => (
                  <CommandItem
                    key={country.value}
                    value={country.value}
                    onSelect={() => toggleCountry(country.value)}
                  >
                    {country.flag} {country.label}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedCountries.includes(country.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
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
