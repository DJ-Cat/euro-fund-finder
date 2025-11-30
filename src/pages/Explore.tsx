import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import GrantCard from "@/components/GrantCard";
import { Search, Filter, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  eligible_countries: string[] | null;
  min_trl: number | null;
  max_trl: number | null;
}

const Explore = () => {
  const navigate = useNavigate();
  const [grants, setGrants] = useState<Grant[]>([]);
  const [filteredGrants, setFilteredGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [trlFilter, setTrlFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [fundingTypeFilter, setFundingTypeFilter] = useState("all");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchGrants();
  }, []);

  useEffect(() => {
    filterGrants();
  }, [searchQuery, countryFilter, trlFilter, industryFilter, fundingTypeFilter, grants]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsAuthenticated(!!user);
  };

  const fetchGrants = async () => {
    try {
      const { data, error } = await supabase
        .from("public_grants")
        .select("*")
        .order("deadline", { ascending: true, nullsFirst: false });

      if (error) throw error;
      setGrants(data || []);
      setFilteredGrants(data || []);
    } catch (error: any) {
      toast.error("Failed to load grants");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterGrants = () => {
    let filtered = [...grants];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (grant) =>
          grant.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          grant.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          grant.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Country filter
    if (countryFilter !== "all") {
      filtered = filtered.filter(
        (grant) =>
          grant.eligible_countries?.includes(countryFilter) || !grant.eligible_countries
      );
    }

    // TRL filter
    if (trlFilter !== "all") {
      const trlValue = parseInt(trlFilter);
      filtered = filtered.filter(
        (grant) =>
          (grant.min_trl === null || grant.min_trl <= trlValue) &&
          (grant.max_trl === null || grant.max_trl >= trlValue)
      );
    }

    // Industry filter
    if (industryFilter !== "all") {
      filtered = filtered.filter(
        (grant) =>
          grant.tags?.some(tag => tag.toLowerCase().includes(industryFilter.toLowerCase()))
      );
    }

    // Funding Type filter
    if (fundingTypeFilter !== "all") {
      filtered = filtered.filter(
        (grant) =>
          grant.tags?.some(tag => tag.toLowerCase().includes(fundingTypeFilter.toLowerCase()))
      );
    }

    setFilteredGrants(filtered);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success("File uploaded! We are analyzing your data...");
      setUploadDialogOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b-2 border-foreground sticky top-0 bg-background z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-black tracking-tight cursor-pointer" onClick={() => navigate("/")}>
              FUNDING MATCHER
            </h1>
            <div className="flex gap-3">
              {isAuthenticated ? (
                <>
                  <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-2 border-foreground font-semibold">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Context
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="border-2 border-foreground">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-black">Upload Pitch Deck / Financials</DialogTitle>
                        <DialogDescription className="text-base font-semibold">
                          Upload your documents to improve grant matching accuracy.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <Input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileUpload}
                          className="border-2 border-foreground"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="default"
                    className="font-semibold"
                    onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  className="border-2 border-foreground font-semibold"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Header Section */}
      <div className="border-b-2 border-foreground bg-secondary">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-5xl font-black mb-4 tracking-tight">Grant Explorer</h1>
          <p className="text-xl text-muted-foreground font-semibold mb-8">
            Browse all available European grants and funding opportunities
          </p>

          {/* Search and Filter Bar */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[300px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search grants by keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-2 border-foreground h-12 font-semibold"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-2 border-foreground font-semibold h-12">
                  <Filter className="mr-2 h-4 w-4" />
                  Industry: {industryFilter === "all" ? "All" : industryFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 border-2 border-foreground">
                <DropdownMenuLabel className="font-bold">Filter by Industry</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={industryFilter} onValueChange={setIndustryFilter}>
                  <DropdownMenuRadioItem value="all">All Industries</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Fintech">Fintech</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Health">Health</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="SaaS">SaaS</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Cleantech">Cleantech</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-2 border-foreground font-semibold h-12">
                  <Filter className="mr-2 h-4 w-4" />
                  Type: {fundingTypeFilter === "all" ? "All" : fundingTypeFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 border-2 border-foreground">
                <DropdownMenuLabel className="font-bold">Filter by Funding Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={fundingTypeFilter} onValueChange={setFundingTypeFilter}>
                  <DropdownMenuRadioItem value="all">All Types</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Grant">Grant</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Loan">Loan</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Equity">Equity</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-2 border-foreground font-semibold h-12">
                  <Filter className="mr-2 h-4 w-4" />
                  Country: {countryFilter === "all" ? "All" : countryFilter}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 border-2 border-foreground">
                <DropdownMenuLabel className="font-bold">Filter by Country</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={countryFilter} onValueChange={setCountryFilter}>
                  <DropdownMenuRadioItem value="all">All Countries</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Germany">Germany</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="France">France</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Spain">Spain</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="Italy">Italy</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Grants Grid */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-lg font-semibold text-muted-foreground">Loading grants...</p>
          </div>
        ) : filteredGrants.length === 0 ? (
          <div className="text-center py-12 border-2 border-foreground p-16">
            <p className="text-2xl font-black mb-2">NO GRANTS FOUND</p>
            <p className="text-muted-foreground font-semibold">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-lg font-bold">
                Showing {filteredGrants.length} of {grants.length} grants
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredGrants.map((grant) => (
                <GrantCard key={grant.id} grant={grant} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Explore;
