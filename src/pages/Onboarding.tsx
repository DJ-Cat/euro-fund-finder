import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Onboarding = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    industry: "",
    stage: "",
    businessModel: "",
    fundingAsk: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyName || !formData.industry || !formData.stage || !formData.businessModel || !formData.fundingAsk) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const trlLevel = formData.stage === "pre-seed" ? 1 : 
                       formData.stage === "seed" ? 3 :
                       formData.stage === "series-a" ? 5 : 7;

      const { error } = await supabase
        .from("profiles")
        .update({
          startup_stage: formData.stage,
          trl_level: trlLevel,
          funding_needs: formData.fundingAsk,
          location: "Global",
        })
        .eq("id", user.id);

      if (error) throw error;

      // Store form data in sessionStorage for display
      sessionStorage.setItem("startupData", JSON.stringify(formData));
      
      toast.success("Profile submitted successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to save profile");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b-2 border-foreground">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-black tracking-tight">FUNDING MATCHER</h1>
        </div>
      </nav>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="h-10 w-10" />
            <h1 className="text-5xl font-black tracking-tight">Your Startup Profile</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Help us find the perfect investors for your business
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="border-2 border-foreground p-8 space-y-8 bg-card">
            {/* Company Name */}
            <div className="space-y-3">
              <Label htmlFor="companyName" className="text-base font-bold">
                Company Name *
              </Label>
              <Input
                id="companyName"
                placeholder="Enter your company name"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                className="border-2 border-input h-12 text-base"
                required
              />
            </div>

            {/* Website */}
            <div className="space-y-3">
              <Label htmlFor="website" className="text-base font-bold">
                Website
              </Label>
              <Input
                id="website"
                type="url"
                placeholder="https://yourcompany.com"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                className="border-2 border-input h-12 text-base"
              />
            </div>

            {/* Industry */}
            <div className="space-y-3">
              <Label htmlFor="industry" className="text-base font-bold">
                Industry *
              </Label>
              <Select
                value={formData.industry}
                onValueChange={(value) =>
                  setFormData({ ...formData, industry: value })
                }
              >
                <SelectTrigger className="border-2 border-input h-12 text-base">
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent className="border-2 border-foreground">
                  <SelectItem value="fintech">Fintech</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="saas">SaaS</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="cleantech">Cleantech</SelectItem>
                  <SelectItem value="edtech">Edtech</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Stage */}
            <div className="space-y-3">
              <Label htmlFor="stage" className="text-base font-bold">
                Funding Stage *
              </Label>
              <Select
                value={formData.stage}
                onValueChange={(value) =>
                  setFormData({ ...formData, stage: value })
                }
              >
                <SelectTrigger className="border-2 border-input h-12 text-base">
                  <SelectValue placeholder="Select your stage" />
                </SelectTrigger>
                <SelectContent className="border-2 border-foreground">
                  <SelectItem value="pre-seed">Pre-seed</SelectItem>
                  <SelectItem value="seed">Seed</SelectItem>
                  <SelectItem value="series-a">Series A</SelectItem>
                  <SelectItem value="series-b">Series B</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Business Model */}
            <div className="space-y-3">
              <Label htmlFor="businessModel" className="text-base font-bold">
                Business Model *
              </Label>
              <Select
                value={formData.businessModel}
                onValueChange={(value) =>
                  setFormData({ ...formData, businessModel: value })
                }
              >
                <SelectTrigger className="border-2 border-input h-12 text-base">
                  <SelectValue placeholder="Select your business model" />
                </SelectTrigger>
                <SelectContent className="border-2 border-foreground">
                  <SelectItem value="b2b">B2B</SelectItem>
                  <SelectItem value="b2c">B2C</SelectItem>
                  <SelectItem value="marketplace">Marketplace</SelectItem>
                  <SelectItem value="b2b2c">B2B2C</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Funding Ask */}
            <div className="space-y-3">
              <Label htmlFor="fundingAsk" className="text-base font-bold">
                Funding Ask (EUR) *
              </Label>
              <Input
                id="fundingAsk"
                type="number"
                placeholder="500000"
                value={formData.fundingAsk}
                onChange={(e) =>
                  setFormData({ ...formData, fundingAsk: e.target.value })
                }
                className="border-2 border-input h-12 text-base"
                min="0"
                step="1000"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full text-lg py-7 font-bold tracking-wide"
          >
            Submit & Find Investors
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
