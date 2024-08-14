'use client';

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

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
import useGetCountries from "~/hooks/useGetCountries";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "~/components/ui/form";
import { TCountryOption } from "~/lib/types";


export default function CountrySelectComponent({ form }: any) {
    const { formattedCountries: countries } = useGetCountries();
    const v1 = form.watch("country1");
    const v2 = form.watch("country2");
    const filteredCountries = countries.filter((c: TCountryOption) => c.value !== v1 || c.value !== v2);

    return (
        <div className="flex gap-4">
            <Combobox form={form} options={filteredCountries} name="country1" label="Select a country" />
            <Combobox form={form} options={filteredCountries} name="country2" label="Select another country" />
        </div>
    );
}

const Combobox = ({ name, label, options, form }: any) => {
    const [open, setOpen] = React.useState(false);

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className={cn(
                                        "w-[200px] justify-between",
                                        field.value ? "" : "cursor-not-allowed",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    {field.value
                                        ? options.find((o: any) => o.value === field.value)?.label
                                        : "Select country..."}
                                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                            <Command>
                                <CommandInput placeholder="Search framework..." className="h-9" />
                                <CommandList>
                                    <CommandEmpty>No country found.</CommandEmpty>
                                    <CommandGroup>
                                        {options.map((o) => (
                                            <CommandItem
                                                key={o.value}
                                                value={o.value}
                                                onSelect={(currentValue) => {
                                                    field.onChange(currentValue);
                                                    setOpen(false)
                                                }}
                                            >
                                                {o.label}
                                                <CheckIcon
                                                    className={cn(
                                                        "ml-auto h-4 w-4",
                                                        field.value === o.value ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}