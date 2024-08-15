"use client"

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
        <Card className="shadow-none border-none space-y-4 bg-transparent">
            <CardHeader className="items-center">
                <CardTitle>Six Key Factors</CardTitle>
                <CardDescription>
                    Showing scores for various factors
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto max-h-[250px]"
                >
                    <RadarChart data={chartData} outerRadius={90}>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <PolarGrid gridType="circle" />
                        <PolarAngleAxis dataKey="keyFactor" />
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
            <CardFooter className="flex-col text-sm mt-2">
                <div className="flex items-center leading-none text-xs text-muted-foreground">
                    Data updated every week
                </div>
            </CardFooter>
        </Card>
    )
}
