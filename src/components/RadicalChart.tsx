"use client"

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "~/components/ui/tooltip";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, PolarRadiusAxis } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "~/components/ui/chart";
import Image from "next/image";

const chartConfig = {
    score: {
        label: "Score",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

type TProps = {
    chartData: {
        keyFactor: string;
        score: number;
    }[];
}

export function RadicalChart({ chartData }: TProps) {
    const maxScoreAcrossFactors = Math.max(...chartData.map((data) => data.score));
    const maxDomainInChart = maxScoreAcrossFactors < 100 ? Math.min(100, maxScoreAcrossFactors + 10) : 100;

    return (
        <TooltipProvider>
            <Card className="shadow-none border-none space-y-4 bg-transparent">
                <CardHeader className="items-center pb-2">
                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                        Six Key Factors
                        <Tooltip disableHoverableContent>
                            <TooltipTrigger className="ml-2">
                                <InfoCircledIcon className="w-4 h-4 text-gray-400 hover:text-primary transition" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-sm sm:max-w-3xl">
                                <Image className="hidden md:block" src="/score-formula.png" alt="Overall score formula" width={800} height={300} />
                                <Image className="md:hidden" src="/score-formula.png" alt="Overall score formula" width={320} height={180} />
                            </TooltipContent>
                        </Tooltip>
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                        Showing scores for various factors
                    </CardDescription>
                </CardHeader>
                <CardContent className="pb-0 px-2 sm:px-6">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto w-full max-h-[280px] h-[200px] sm:h-[250px]"
                    >
                        <RadarChart data={chartData} outerRadius={90} className="">
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent />}
                            />
                            <PolarGrid gridType="circle" />
                            <PolarAngleAxis dataKey="keyFactor" tick={window.innerWidth < 600 ? false : true} />
                            <PolarRadiusAxis className="opacity-85" angle={30} domain={[0, maxDomainInChart]} />
                            <Radar
                                dataKey="score"
                                fill="var(--color-score)"
                                fillOpacity={0.6}
                                dot={{
                                    r: 4,
                                    fillOpacity: 1,
                                }}
                            />
                        </RadarChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col text-sm pt-2">
                    <div className="flex items-center leading-none text-xs text-muted-foreground">
                        Data updated every week
                    </div>
                </CardFooter>
            </Card>
        </TooltipProvider>
    )
}
