'use client';

import { useComparisonStore } from '~/store/useComparisonStore';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { ITableRow } from '~/lib/types';
import Spinner from './Spinner';

const factorKeys = [
  { key: 'diplomatic_relations_score', label: 'Diplomatic Relations' },
  { key: 'economic_ties_score', label: 'Economic Ties' },
  { key: 'military_relations_score', label: 'Military Relations' },
  { key: 'political_alignments_score', label: 'Political Alignments' },
  { key: 'cultural_social_ties_score', label: 'Cultural & Social Ties' },
  { key: 'historical_context_score', label: 'Historical Context' },
];

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
];

export default function ComparisonResults() {
  const { comparisonData, loading, error, selectedCountries } = useComparisonStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Spinner />
        <span className="ml-3 text-gray-600">Loading comparison data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 border border-red-200 rounded-lg bg-red-50">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (comparisonData.length === 0) {
    return (
      <div className="p-12 text-center text-gray-500">
        <p>Select countries and click "Compare Countries" to view results</p>
      </div>
    );
  }

  // Prepare data for charts - group by country pairs
  const chartData = prepareChartData(comparisonData);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overall" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overall">Overall Scores</TabsTrigger>
          <TabsTrigger value="factors">Factor Analysis</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overall" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Overall Geopolitical Scores</CardTitle>
              <CardDescription>Comparison of overall relationship scores</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="overall_score" fill="#3b82f6" name="Overall Score" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="factors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Six Key Factors Comparison</CardTitle>
              <CardDescription>Breakdown of scores across all factors</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  {factorKeys.map((factor, idx) => (
                    <Line
                      key={factor.key}
                      type="monotone"
                      dataKey={factor.key}
                      stroke={COLORS[idx]}
                      name={factor.label}
                      strokeWidth={2}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {comparisonData.map((data, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {data.countries.join(' vs ')}
                </CardTitle>
                <CardDescription>
                  Last updated: {new Date(data.last_updated).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {factorKeys.map((factor) => {
                    const scoreKey = factor.key as keyof ITableRow;
                    const explanationKey = factor.key.replace('_score', '_explanation') as keyof ITableRow;
                    return (
                      <div key={factor.key} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">{factor.label}</span>
                          <span className="text-lg font-bold text-blue-600">
                            {data[scoreKey] ?? 'N/A'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">
                          {data[explanationKey] ?? 'No explanation available'}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Overall Score</span>
                    <span className="text-2xl font-bold text-blue-700">
                      {data.overall_score ?? 'N/A'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{data.overall_explanation}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function prepareChartData(comparisonData: ITableRow[]) {
  return comparisonData.map((data) => ({
    name: data.countries.join(' vs '),
    overall_score: data.overall_score ?? 0,
    diplomatic_relations_score: data.diplomatic_relations_score ?? 0,
    economic_ties_score: data.economic_ties_score ?? 0,
    military_relations_score: data.military_relations_score ?? 0,
    political_alignments_score: data.political_alignments_score ?? 0,
    cultural_social_ties_score: data.cultural_social_ties_score ?? 0,
    historical_context_score: data.historical_context_score ?? 0,
  }));
}
