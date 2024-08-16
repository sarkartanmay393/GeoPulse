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
    return (
        <TooltipProvider>
            <Card className="shadow-none border-none space-y-4 bg-transparent">
                <CardHeader className="items-center">
                    <CardTitle>
                        Six Key Factors
                        <Tooltip disableHoverableContent>
                            <TooltipTrigger className="ml-2">
                                <InfoCircledIcon className="w-3.5 h-3.5 text-gray-400 hover:text-gray-500 transition" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <Image className="hidden md:block" src="/score-formula.png" alt="Overall score formula" width={800} height={300} />
                                <Image className="md:hidden" src="/score-formula.png" alt="Overall score formula" width={320} height={180} />
                            </TooltipContent>
                        </Tooltip>
                    </CardTitle>
                    <CardDescription>
                        Showing scores for various factors
                    </CardDescription>
                </CardHeader>
                <CardContent className="pb-0">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto w-full max-h-[250px] h-[180px] sm:h-[225px]"
                    >
                        <RadarChart data={chartData} outerRadius={90} className="">
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent />}
                            />
                            <PolarGrid gridType="circle" />
                            <PolarAngleAxis dataKey="keyFactor" tick={window.innerWidth < 600 ? false : true} />
                            <PolarRadiusAxis className="opacity-35" angle={30} domain={[0, 100]} />
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
                <CardFooter className="flex-col text-sm">
                    <div className="flex items-center leading-none text-xs text-muted-foreground pt-2">
                        Data updated every week
                    </div>
                </CardFooter>
            </Card>
        </TooltipProvider>
    )
}
