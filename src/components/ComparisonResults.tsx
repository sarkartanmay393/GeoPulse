'use client';

import { useComparisonStore } from '~/store/useComparisonStore';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { ITableRow } from '~/lib/types';
import Spinner from './Spinner';
import { CheckCircle2, Loader2, XCircle, Clock } from 'lucide-react';

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
  const { comparisonData, loading, error, selectedCountries, generationProgress } = useComparisonStore();

  if (loading || generationProgress.length > 0) {
    return (
      <div className="space-y-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              {generationProgress.length > 0 ? 'Generating Missing Reports...' : 'Loading Comparison Data...'}
            </CardTitle>
            <CardDescription>
              {generationProgress.length > 0 
                ? `Generating ${generationProgress.filter(p => p.status !== 'completed').length} of ${generationProgress.length} missing country pair reports`
                : 'Fetching existing reports from database'}
            </CardDescription>
          </CardHeader>
          {generationProgress.length > 0 && (
            <CardContent>
              <div className="space-y-2">
                {generationProgress.map((progress) => (
                  <div key={progress.pairId} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex items-center gap-3">
                      {progress.status === 'pending' && <Clock className="h-4 w-4 text-gray-400" />}
                      {progress.status === 'generating' && <Loader2 className="h-4 w-4 animate-spin text-blue-500" />}
                      {progress.status === 'completed' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                      {progress.status === 'error' && <XCircle className="h-4 w-4 text-red-500" />}
                      <span className="text-sm font-medium">{progress.countries.join(' vs ')}</span>
                    </div>
                    <span className="text-xs text-gray-500 capitalize">{progress.status}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700">Error Loading Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (comparisonData.length === 0) {
    return (
      <Card className="border-gray-200">
        <CardContent className="p-12 text-center">
          <p className="text-gray-500 mb-2">No comparison data available</p>
          <p className="text-sm text-gray-400">Select 2 or more countries and click "Compare Countries" to view results</p>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for charts - group by country pairs
  const chartData = prepareChartData(comparisonData);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Comparison Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-blue-600 font-medium">Countries Selected</p>
            <p className="text-2xl font-bold text-blue-900">{selectedCountries.length}</p>
          </div>
          <div>
            <p className="text-blue-600 font-medium">Country Pairs</p>
            <p className="text-2xl font-bold text-blue-900">{comparisonData.length}</p>
          </div>
          <div>
            <p className="text-blue-600 font-medium">Average Score</p>
            <p className="text-2xl font-bold text-blue-900">
              {Math.round(comparisonData.reduce((sum, d) => sum + (d.overall_score || 0), 0) / comparisonData.length)}
            </p>
          </div>
          <div>
            <p className="text-blue-600 font-medium">Last Updated</p>
            <p className="text-sm font-medium text-blue-900">
              {new Date(Math.max(...comparisonData.map(d => new Date(d.last_updated).getTime()))).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overall" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overall">📊 Overall Scores</TabsTrigger>
          <TabsTrigger value="factors">📈 Factor Analysis</TabsTrigger>
          <TabsTrigger value="details">📋 Detailed View</TabsTrigger>
        </TabsList>

        <TabsContent value="overall" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Overall Geopolitical Scores</CardTitle>
              <CardDescription>Compare relationship strength across all country pairs</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={120}
                    interval={0}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis domain={[0, 100]} label={{ value: 'Score', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="overall_score" fill="#3b82f6" name="Overall Score" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="factors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Six Key Factors Comparison</CardTitle>
              <CardDescription>Track how different relationship aspects vary across country pairs</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={450}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={120}
                    interval={0}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis domain={[0, 100]} label={{ value: 'Score', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  {factorKeys.map((factor, idx) => (
                    <Line
                      key={factor.key}
                      type="monotone"
                      dataKey={factor.key}
                      stroke={COLORS[idx]}
                      name={factor.label}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {comparisonData.map((data, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🌍</span>
                  {data.countries.join(' ↔️ ')}
                </CardTitle>
                <CardDescription className="flex items-center justify-between">
                  <span>Last updated: {new Date(data.last_updated).toLocaleDateString()}</span>
                  <span className="text-lg font-bold text-blue-600">Overall: {data.overall_score}/100</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {factorKeys.map((factor) => {
                    const scoreKey = factor.key as keyof ITableRow;
                    const explanationKey = factor.key.replace('_score', '_explanation') as keyof ITableRow;
                    const score = (data[scoreKey] as number) ?? 0;
                    const getScoreColor = (score: number) => {
                      if (score >= 75) return 'text-green-600 bg-green-50 border-green-200';
                      if (score >= 50) return 'text-blue-600 bg-blue-50 border-blue-200';
                      if (score >= 25) return 'text-amber-600 bg-amber-50 border-amber-200';
                      return 'text-red-600 bg-red-50 border-red-200';
                    };
                    
                    return (
                      <div key={factor.key} className={`p-4 border rounded-lg ${getScoreColor(score)}`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold">{factor.label}</span>
                          <span className="text-2xl font-bold">
                            {data[scoreKey] ?? 'N/A'}
                          </span>
                        </div>
                        <p className="text-xs opacity-80 line-clamp-3">
                          {data[explanationKey] ?? 'No explanation available'}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="p-5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-lg text-blue-900">Overall Assessment</span>
                    <span className="text-3xl font-bold text-blue-700">
                      {data.overall_score ?? 'N/A'}/100
                    </span>
                  </div>
                  <p className="text-sm text-blue-900">{data.overall_explanation}</p>
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
