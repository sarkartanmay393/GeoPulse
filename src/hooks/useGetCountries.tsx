import React from "react";
import Countries from "../../public/countries.json";
import { type TCountry } from "~/lib/types";
import {type TCountryOption } from "~/lib/types";

export default function useGetCountries() {
    const [loading, setLoading] = React.useState(false);
    const [countries, setCountries] = React.useState<TCountry[]>([]);

    React.useEffect(() => {
        setLoading(true);
        fetch('https://restcountries.com/v3.1/all')
            .then((response) => response.json())
            .then((data) => {
                const countries: TCountry[] = data.map((country: any) => ({
                    name: country.name.common, 
                    code: country.cca2, 
                    emoji: country.flag, 
                    flag: country.flags.svg
                }));
                setCountries(countries);
            }).finally(() => setLoading(false));
    }, []);

    const formattedCountries: TCountryOption[] = countries.map((country) => ({
        label: country.name,
        value: country.name,
        flag: country.emoji
    })).sort((a, b) => a.label.localeCompare(b.label));

    return { loading, formattedCountries };
}