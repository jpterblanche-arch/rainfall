import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CloudRain, Plus, Droplets, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { insertRainfallSchema, type RainfallRecord, type MonthlyTotal, type InsertRainfall } from "@shared/schema";

export default function Home() {
  const { toast } = useToast();
  
  const form = useForm<InsertRainfall>({
    resolver: zodResolver(insertRainfallSchema),
    defaultValues: {
      date: format(new Date(), "yyyy-MM-dd"),
      amount: 0,
    },
  });

  // Fetch all rainfall records
  const { data: records = [], isLoading: recordsLoading } = useQuery<RainfallRecord[]>({
    queryKey: ["/api/rainfall"],
  });

  // Fetch monthly totals
  const { data: monthlyTotals = [], isLoading: totalsLoading } = useQuery<MonthlyTotal[]>({
    queryKey: ["/api/rainfall/monthly"],
  });

  // Mutation to add a new record
  const addRecordMutation = useMutation({
    mutationFn: async (data: InsertRainfall) => {
      return apiRequest("POST", "/api/rainfall", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rainfall"] });
      queryClient.invalidateQueries({ queryKey: ["/api/rainfall/monthly"] });
      form.reset({
        date: format(new Date(), "yyyy-MM-dd"),
        amount: 0,
      });
      toast({
        title: "Record saved",
        description: "Rainfall measurement has been recorded.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save rainfall record.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertRainfall) => {
    addRecordMutation.mutate(data);
  };

  // Sort records by date descending
  const sortedRecords = [...records].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Sort monthly totals by date descending (most recent first)
  const sortedTotals = [...monthlyTotals].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <CloudRain className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-semibold" data-testid="text-page-title">
              Rainfall Tracker
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Record daily rainfall and view monthly totals
          </p>
        </header>

        {/* Entry Form */}
        <Card className="mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Rainfall Record
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          data-testid="input-date"
                          autoFocus
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Rainfall (mm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          data-testid="input-amount"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-end">
                  <Button 
                    type="submit" 
                    disabled={addRecordMutation.isPending}
                    data-testid="button-submit"
                  >
                    {addRecordMutation.isPending ? "Saving..." : "Save Record"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Monthly Totals */}
        <section className="mb-8">
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Droplets className="h-5 w-5" />
            Monthly Totals
          </h2>
          {totalsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-10 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded w-20"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : sortedTotals.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No rainfall data recorded yet. Add your first record above.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortedTotals.map((total) => {
                const isCurrentMonth = total.month === currentMonth && total.year === currentYear;
                return (
                  <Card 
                    key={`${total.year}-${total.month}`}
                    className={isCurrentMonth ? "border-primary border-2" : ""}
                    data-testid={`card-monthly-${total.year}-${total.month}`}
                  >
                    <CardContent className="p-6">
                      <div className="text-3xl font-bold font-mono" data-testid={`text-total-${total.year}-${total.month}`}>
                        {total.total}
                        <span className="text-lg font-normal text-muted-foreground ml-1">mm</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {total.label}
                        {isCurrentMonth && (
                          <span className="ml-2 text-xs text-primary font-medium">Current</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* Records Table */}
        <section>
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            All Records
          </h2>
          <Card>
            <CardContent className="p-0">
              {recordsLoading ? (
                <div className="p-6">
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
                    ))}
                  </div>
                </div>
              ) : sortedRecords.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  No records yet. Start tracking rainfall above.
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Rainfall (mm)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedRecords.map((record) => (
                          <TableRow key={record.id} data-testid={`row-record-${record.id}`}>
                            <TableCell>
                              {format(new Date(record.date), "EEEE, MMMM d, yyyy")}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {record.amount}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {/* Mobile Cards */}
                  <div className="md:hidden divide-y">
                    {sortedRecords.map((record) => (
                      <div 
                        key={record.id} 
                        className="p-4 flex justify-between items-center"
                        data-testid={`card-record-${record.id}`}
                      >
                        <div className="text-sm">
                          {format(new Date(record.date), "EEE, MMM d, yyyy")}
                        </div>
                        <div className="font-mono font-medium">
                          {record.amount} mm
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
