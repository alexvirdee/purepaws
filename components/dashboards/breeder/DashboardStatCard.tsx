import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: string; 
  textColor?: string; 
  textSize?: string;
}

export default function DashboardStatCard({
  title,
  value,
  description,
  trend,
  textColor,
  textSize
}: DashboardStatCardProps) {
  return (
    <Card className="bg-white shadow rounded-lg p-2 flex flex-col justify-between gap-2 hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-2">
        <CardDescription className="text-sm text-gray-600">
          {title}
        </CardDescription>
        {trend && (
          <span className="text-xs font-semibold text-gray-500">
            {trend}
          </span>
        )}
      </CardHeader>
      <CardContent>
        <CardTitle className={`text-2xl font-bold ${textColor} ${textSize}`}>{value}</CardTitle>
        {description && (
          <p className="mt-2 text-xs text-gray-500">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
