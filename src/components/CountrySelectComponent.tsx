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
import { UseFormReturn } from "react-hook-form";

type TProps = {
    form: UseFormReturn<{
        country1: string;
        country2: string;
    }, any, undefined>;
}

export default function CountrySelectComponent({ form }: TProps) {
    const { formattedCountries } = useGetCountries();
    form.setFocus("country1");

    return (
        <div className="flex items-center justify-between gap-4 flex-col md:flex-row">
            <Combobox form={form} options={formattedCountries} name="country1" label="Select a country" />
            <Combobox form={form} options={formattedCountries} name="country2" label="Select another country" />
        </div>
    );
}

const getOthersName = (name: string) => {
    return name === "country1" ? "country2" : "country1";
}

const Combobox = ({ name, label, options, form }: any) => {
    const [open, setOpen] = React.useState(false);
    const watchedOtherValue = form.watch(getOthersName(name));
    const filteredCountries = React.useMemo(() => {
        return options.filter((c: TCountryOption) => c.value !== watchedOtherValue);
    }, [watchedOtherValue]);

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="w-[300px]">
                    <FormLabel>{label}</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    id={name === "country1" ? "tour_step_2" : "tour_step_3"}
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className={cn(
                                        "w-[300px] justify-between text-wrap",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                   {field.value
                                        && filteredCountries.find((o: any) => o.value === field.value)?.flag} {field.value
                                        ? filteredCountries.find((o: any) => o.value === field.value)?.label
                                        : "Select country..."}
                                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                            <Command>
                                <CommandInput placeholder="Search framework..." className="h-9" />
                                <CommandList>
                                    <CommandEmpty>No country found.</CommandEmpty>
                                    <CommandGroup>
                                        {filteredCountries.map((o: any) => (
                                            <CommandItem
                                                key={o.value}
                                                value={o.value}
                                                onSelect={(currentValue) => {
                                                    field.onChange(currentValue);
                                                    setOpen(false)
                                                }}
                                            >
                                                {o.flag} {o.label}
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