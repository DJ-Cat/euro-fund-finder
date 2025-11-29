import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Building2, LogOut, Settings } from "lucide-react";
import GrantCard from "@/components/GrantCard";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Grant {
  id: string;
  title: string;
  description: string | null;
  funding_body: string | null;
  amount_min: number | null;
  amount_max: number | null;
  deadline: string | null;
  tags: string[] | null;
  application_url: string | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("Your Startup");
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }
      fetchGrants(user.id);
    };

    const storedData = sessionStorage.getItem("startupData");
    if (storedData) {
      const data = JSON.parse(storedData);
      setCompanyName(data.companyName || "Your Startup");
    }

    checkAuth();
  }, [navigate]);

  const fetchGrants = async (userId: string) => {
    try {
      // Get user profile to get TRL level
      const { data: profile } = await supabase
        .from("profiles")
        .select("trl_level")
        .eq("id", userId)
        .single();

      // Fetch all grants (we can add filtering later based on TRL)
      const { data, error } = await supabase
        .from("public_grants")
        .select("*")
        .order("deadline", { ascending: true, nullsFirst: false });

      if (error) throw error;
      setGrants(data || []);
    } catch (error: any) {
      toast.error("Failed to load grants");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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

        {/* Grant Cards Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-lg font-semibold text-muted-foreground">Loading grants...</p>
          </div>
        ) : grants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg font-semibold text-muted-foreground">No grants available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {grants.map((grant) => (
              <GrantCard key={grant.id} grant={grant} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
