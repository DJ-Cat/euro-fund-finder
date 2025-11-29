import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface InvestorCardProps {
  investor: {
    id: number;
    name: string;
    fitScore: number;
    ticketSize: string;
    industries: string[];
    stage: string[];
    description: string;
  };
}

const InvestorCard = ({ investor }: InvestorCardProps) => {
  const handleApply = () => {
    toast.success(`Application initiated with ${investor.name}`);
  };

  return (
    <div className="border-2 border-foreground bg-card p-6 hover:border-primary transition-colors">
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-2xl font-black tracking-tight leading-tight flex-1">
          {investor.name}
        </h3>
        <div className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1 ml-4">
          <TrendingUp className="h-4 w-4" />
          <span className="font-black text-sm">{investor.fitScore}%</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-bold text-muted-foreground mb-1">TICKET SIZE</p>
        <p className="text-lg font-bold">{investor.ticketSize}</p>
      </div>

      <div className="mb-4">
        <p className="text-sm font-bold text-muted-foreground mb-2">INDUSTRIES</p>
        <div className="flex flex-wrap gap-2">
          {investor.industries.map((industry, index) => (
            <span
              key={index}
              className="border-2 border-foreground px-3 py-1 text-sm font-bold bg-secondary"
            >
              {industry}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-bold text-muted-foreground mb-2">STAGES</p>
        <div className="flex flex-wrap gap-2">
          {investor.stage.map((stage, index) => (
            <span
              key={index}
              className="border-2 border-foreground px-3 py-1 text-sm font-bold bg-secondary"
            >
              {stage}
            </span>
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        {investor.description}
      </p>

      <Button
        className="w-full font-bold text-base h-12"
        onClick={handleApply}
      >
        Apply Now
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default InvestorCard;
