import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Account created successfully!");
      navigate("/onboarding");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black mb-2 tracking-tight">FUNDING MATCHER</h1>
          <p className="text-muted-foreground font-semibold">Create your account</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6 border-2 border-foreground p-8 bg-card">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-bold">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-2 border-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="font-bold">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="border-2 border-foreground"
            />
          </div>

          <Button
            type="submit"
            className="w-full font-bold h-12"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/login")}
              className="font-semibold"
            >
              Already have an account? Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
