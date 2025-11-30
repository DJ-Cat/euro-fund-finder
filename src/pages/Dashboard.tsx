import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Building2, LogOut, Settings, Upload, CheckCircle, FileText } from "lucide-react";
import GrantMatchesDashboard from "@/components/GrantMatchesDashboard";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("Your Startup");
  const [uploadedDocs, setUploadedDocs] = useState<{ [key: string]: string }>({});

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

  const handleDocUpload = (docType: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.xlsx,.xls';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast.success(`Uploading ${file.name} to secure vault...`);
        setUploadedDocs(prev => ({ ...prev, [docType]: file.name }));
      }
    };
    input.click();
  };

  const documentSlots = [
    { id: 'pitch_deck', title: 'Pitch Deck', description: 'Upload your company pitch deck (PDF)' },
    { id: 'financial_plan', title: 'Financial Plan', description: 'Upload financial projections (Excel/PDF)' },
    { id: 'cap_table', title: 'Cap Table', description: 'Upload your capitalization table (PDF)' },
    { id: 'founder_cvs', title: 'Founder CVs', description: 'Upload founder resumes (PDF)' },
  ];

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

        {/* Grant Readiness Locker */}
        <div className="mb-12">
          <h2 className="text-3xl font-black mb-6 tracking-tight">Grant Readiness Locker</h2>
          <p className="text-muted-foreground font-semibold mb-8">
            Upload your documents to strengthen your grant applications
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {documentSlots.map((slot) => {
              const isUploaded = uploadedDocs[slot.id];
              return (
                <Card 
                  key={slot.id}
                  className="border-2 border-foreground hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => handleDocUpload(slot.id)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg font-black flex items-center gap-2">
                      {isUploaded ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Upload className="h-5 w-5 text-muted-foreground" />
                      )}
                      {slot.title}
                    </CardTitle>
                    <CardDescription className="font-semibold">
                      {slot.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isUploaded ? (
                      <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                        <FileText className="h-4 w-4" />
                        <span className="truncate">{isUploaded}</span>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground font-semibold">
                        Click to upload
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Smart Matcher Grid */}
        <GrantMatchesDashboard />
      </main>
    </div>
  );
};

export default Dashboard;
