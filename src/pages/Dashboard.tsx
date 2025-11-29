import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Building2, LogOut, Settings } from "lucide-react";
import InvestorCard from "@/components/InvestorCard";
import { useNavigate } from "react-router-dom";

interface Investor {
  id: number;
  name: string;
  fitScore: number;
  ticketSize: string;
  industries: string[];
  stage: string[];
  description: string;
}

const mockInvestors: Investor[] = [
  {
    id: 1,
    name: "Sequoia Capital Europe",
    fitScore: 98,
    ticketSize: "€500k - €5M",
    industries: ["Fintech", "SaaS", "Enterprise"],
    stage: ["Seed", "Series A"],
    description: "Leading venture capital firm focused on early-stage technology companies across Europe.",
  },
  {
    id: 2,
    name: "Index Ventures",
    fitScore: 95,
    ticketSize: "€1M - €10M",
    industries: ["SaaS", "Marketplace", "Fintech"],
    stage: ["Seed", "Series A", "Series B"],
    description: "Multi-stage venture capital firm with offices in London, Geneva, and San Francisco.",
  },
  {
    id: 3,
    name: "Accel Partners",
    fitScore: 92,
    ticketSize: "€2M - €15M",
    industries: ["SaaS", "Enterprise", "Infrastructure"],
    stage: ["Series A", "Series B"],
    description: "Global venture capital firm investing in exceptional founders and breakthrough ideas.",
  },
  {
    id: 4,
    name: "Atomico",
    fitScore: 89,
    ticketSize: "€500k - €8M",
    industries: ["Fintech", "Health", "Cleantech"],
    stage: ["Seed", "Series A"],
    description: "European venture capital firm backing bold founders using technology for good.",
  },
  {
    id: 5,
    name: "Balderton Capital",
    fitScore: 87,
    ticketSize: "€1M - €20M",
    industries: ["SaaS", "Marketplace", "Fintech"],
    stage: ["Seed", "Series A", "Series B"],
    description: "One of Europe's leading early-stage venture capital firms, based in London.",
  },
  {
    id: 6,
    name: "Northzone",
    fitScore: 84,
    ticketSize: "€500k - €5M",
    industries: ["SaaS", "Fintech", "E-commerce"],
    stage: ["Seed", "Series A"],
    description: "Early-stage venture capital firm with a 25-year track record in Europe.",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("Your Startup");

  useEffect(() => {
    const storedData = sessionStorage.getItem("startupData");
    if (storedData) {
      const data = JSON.parse(storedData);
      setCompanyName(data.companyName || "Your Startup");
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 border-r-2 border-foreground bg-card p-6">
        <h1 className="text-xl font-black mb-12 tracking-tight">FUNDING MATCHER</h1>
        
        <nav className="space-y-2">
          <Button
            variant="default"
            className="w-full justify-start font-bold text-base h-12"
          >
            <Building2 className="mr-3 h-5 w-5" />
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start font-semibold text-base h-12 border-2 border-transparent hover:border-foreground"
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </Button>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <Button
            variant="outline"
            className="w-full justify-start font-semibold border-2 border-foreground h-12"
            onClick={() => navigate("/")}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {/* Header */}
        <div className="mb-12 border-b-2 border-foreground pb-8">
          <h1 className="text-5xl font-black mb-3 tracking-tight">{companyName}</h1>
          <p className="text-xl text-muted-foreground font-semibold">
            Your Investor Matches
          </p>
        </div>

        {/* Investor Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockInvestors.map((investor) => (
            <InvestorCard key={investor.id} investor={investor} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
