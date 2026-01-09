import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  LabelList
} from "recharts";
import { CloudRain, BarChart3, ChevronLeft, Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type MonthlyTotal } from "@shared/schema";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function Charts() {
  const { data: monthlyTotals = [], isLoading } = useQuery<MonthlyTotal[]>({
    queryKey: ["/api/rainfall/monthly"],
  });

  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(monthlyTotals.map(t => t.year)));
    return uniqueYears.sort((a, b) => b - a);
  }, [monthlyTotals]);

  const [selectedYear, setSelectedYear] = useState<string>("");

  // Initialize selected year once data is loaded
  useMemo(() => {
    if (years.length > 0 && !selectedYear) {
      setSelectedYear(years[0].toString());
    }
  }, [years, selectedYear]);

  const chartData = useMemo(() => {
    if (!selectedYear) return [];
    
    const yearData = monthlyTotals.filter(t => t.year === parseInt(selectedYear));
    
    return MONTHS.map((monthName, index) => {
      const found = yearData.find(t => t.month === index);
      return {
        name: monthName.substring(0, 3),
        fullName: monthName,
        total: found ? found.total : 0,
      };
    });
  }, [monthlyTotals, selectedYear]);

  const yearlyTotal = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.total, 0);
  }, [chartData]);

  const formatNumber = (num: number | string) => {
    const n = typeof num === "string" ? parseFloat(num) : num;
    if (isNaN(n)) return num.toString();
    const parts = n.toFixed(1).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-semibold">Rainfall Statistics</h1>
            </div>
            {selectedYear && !isLoading && (
              <div className="flex flex-col items-end">
                <span className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Yearly Total</span>
                <span className="text-3xl font-bold font-mono text-primary">
                  {formatNumber(yearlyTotal)}
                  <span className="text-lg font-normal text-muted-foreground ml-1">mm</span>
                </span>
              </div>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            Visual analysis of monthly rainfall patterns
          </p>
        </header>

        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
            <div>
              <CardTitle className="text-lg font-medium">Monthly Distribution</CardTitle>
              <CardDescription>Rainfall totals by month for the selected year</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[350px] flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-2">
                  <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                  <span className="text-sm text-muted-foreground">Loading chart data...</span>
                </div>
              </div>
            ) : chartData.length > 0 ? (
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <Tooltip 
                      cursor={{ fill: 'hsl(var(--accent))', opacity: 0.4 }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-popover border border-popover-border p-3 rounded-lg shadow-md">
                              <p className="text-sm font-medium mb-1">{payload[0].payload.fullName}</p>
                              <p className="text-2xl font-bold text-primary font-mono">
                                {formatNumber(payload[0].value as number)}
                                <span className="text-sm font-normal text-muted-foreground ml-1">mm</span>
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="total" 
                      radius={[4, 4, 0, 0]}
                    >
                      <LabelList 
                        dataKey="total" 
                        position="top" 
                        offset={10} 
                        formatter={(value: number) => value > 0 ? formatNumber(value) : ""}
                        style={{ fill: 'hsl(var(--foreground))', fontSize: 12, fontWeight: 500, fontFamily: 'var(--font-mono)' }}
                      />
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.total > 0 ? 'hsl(var(--primary))' : 'hsl(var(--muted))'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[350px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                No data available for the selected year
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
