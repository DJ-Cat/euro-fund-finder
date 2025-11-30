import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface GrantCardProps {
  grant: {
    id: string;
    title: string;
    description: string | null;
    funding_body: string | null;
    amount_min: number | null;
    amount_max: number | null;
    deadline: string | null;
    tags: string[] | null;
    application_url: string | null;
    eligible_countries?: string[] | null;
    min_trl?: number | null;
    max_trl?: number | null;
  };
  matchScore?: number;
}

const GrantCard = ({ grant, matchScore }: GrantCardProps) => {
  const navigate = useNavigate();

  const formatAmount = (min: number | null, max: number | null) => {
    if (!min && !max) return "Amount varies";
    if (!max) return `From €${(min! / 1000).toFixed(0)}k`;
    if (!min) return `Up to €${(max / 1000).toFixed(0)}k`;
    return `€${(min / 1000).toFixed(0)}k - €${(max / 1000).toFixed(0)}k`;
  };

  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return "Rolling deadline";
    const date = new Date(deadline);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const handleApply = async () => {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Redirect to signup with current path as return_to param
      const currentPath = window.location.pathname;
      navigate(`/signup?return_to=${encodeURIComponent(currentPath)}`);
      toast.info("Please sign up to apply for grants");
      return;
    }

    // User is authenticated, proceed with application
    if (grant.application_url) {
      window.open(grant.application_url, "_blank");
    } else {
      toast.info("Application details coming soon!");
    }
  };

  return (
    <Card className="border-2 border-foreground hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="text-2xl font-black tracking-tight">{grant.title}</CardTitle>
          {matchScore !== undefined && (
            <Badge variant="default" className="ml-2 font-black text-sm">
              {matchScore}% Fit
            </Badge>
          )}
        </div>
        <CardDescription className="font-semibold text-base">
          {grant.funding_body || "Public Grant"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {grant.description && (
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {grant.description}
          </p>
        )}

        <div className="flex items-center gap-2 text-lg font-bold">
          💰 {formatAmount(grant.amount_min, grant.amount_max)}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground font-semibold">
          📅 Deadline: {formatDeadline(grant.deadline)}
        </div>

        {grant.tags && grant.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {grant.tags.slice(0, 4).map((tag, index) => (
              <Badge key={index} variant="secondary" className="font-semibold">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          className="w-full font-bold h-12"
          onClick={handleApply}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          View Grant Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GrantCard;
