import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: "01",
      title: "Profile",
      description: "Enter your startup details and funding requirements",
    },
    {
      number: "02",
      title: "Match",
      description: "Our algorithm identifies the best-fit investors for you",
    },
    {
      number: "03",
      title: "Apply",
      description: "Connect directly with matched investors and submit applications",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-black tracking-tight">FUNDING MATCHER</h1>
            <Button variant="outline" className="border-2 border-foreground font-semibold">
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-6xl font-black leading-tight mb-8 tracking-tight">
              Find the right funding for your startup.
            </h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Connect with European investors that match your industry, stage, and funding needs.
              Powered by data-driven matching algorithms.
            </p>
            <Button
              size="lg"
              className="text-lg px-8 py-6 font-bold tracking-wide"
              onClick={() => navigate("/onboarding")}
            >
              Get Matched Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <div className="border-2 border-foreground p-12 bg-secondary">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-1">1,200+ Active Investors</h3>
                  <p className="text-muted-foreground">Across all European markets and sectors</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-1">€500M+ Deployed</h3>
                  <p className="text-muted-foreground">In successful funding rounds</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-1">98% Match Accuracy</h3>
                  <p className="text-muted-foreground">Based on 5,000+ successful connections</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-secondary border-y-2 border-foreground py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-black mb-16 text-center tracking-tight">HOW IT WORKS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="border-2 border-foreground bg-background p-8">
                <div className="text-6xl font-black mb-4 text-primary">{step.number}</div>
                <h3 className="text-2xl font-black mb-3 tracking-tight">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="border-2 border-foreground p-16 text-center bg-primary text-primary-foreground">
          <h2 className="text-5xl font-black mb-6 tracking-tight">Ready to find your investors?</h2>
          <p className="text-xl mb-10 opacity-90">Takes less than 5 minutes to complete your profile</p>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-6 font-bold border-2 border-foreground"
            onClick={() => navigate("/onboarding")}
          >
            Start Matching Process
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-foreground py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-muted-foreground">
          <p className="font-semibold">© 2025 European Funding Matcher. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
