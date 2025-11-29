import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Building2, LogOut, Settings } from "lucide-react";
import GrantMatchesDashboard from "@/components/GrantMatchesDashboard";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("Your Startup");

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }
    };

    const storedData = sessionStorage.getItem("startupData");
    if (storedData) {
      const data = JSON.parse(storedData);
      setCompanyName(data.companyName || "Your Startup");
    }

    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

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
            onClick={handleLogout}
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
            Available Grants & Funding Opportunities
          </p>
        </div>

        {/* Smart Matcher Grid */}
        <GrantMatchesDashboard />
      </main>
    </div>
  );
};

export default Dashboard;
