import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface GrantMatch {
  id: number;
  name: string;
  description: string;
  match_score: number;
  match_reasons: string[];
}

const GrantMatchesDashboard = () => {
  const [grants, setGrants] = useState<GrantMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatchingGrants();
  }, []);

  const fetchMatchingGrants = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setGrants([]);
        setLoading(false);
        return;
      }

      // Fetch user profile data
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("trl_level, location, funding_needs")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      // Parse funding_needs to integer
      const askAmount = profile?.funding_needs 
        ? parseInt(profile.funding_needs.replace(/[^0-9]/g, '')) 
        : 0;

      // @ts-ignore - RPC function match_grants is defined in database but not yet in types
      const { data, error } = await supabase.rpc('match_grants', {
        user_trl: profile?.trl_level || 1,
        user_country: profile?.location || 'Germany',
        user_ask_amount: askAmount
      });

      if (error) throw error;
      setGrants(data || []);
    } catch (error) {
      console.error('Error fetching grant matches:', error);
      setGrants([]);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColorClasses = (score: number) => {
    if (score > 80) return {
      text: 'text-warning',
      bg: 'bg-warning'
    };
    if (score >= 40) return {
      text: 'text-success',
      bg: 'bg-success'
    };
    return {
      text: 'text-muted-foreground',
      bg: 'bg-muted'
    };
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-l border-t border-foreground">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="border-r border-b border-foreground p-8">
            <Skeleton className="h-24 w-24 mb-4 rounded-none" />
            <Skeleton className="h-8 w-full mb-2 rounded-none" />
            <Skeleton className="h-4 w-3/4 rounded-none" />
          </div>
        ))}
      </div>
    );
  }

  if (grants.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] border-2 border-foreground">
        <div className="text-center p-12">
          <h2 className="text-6xl font-black tracking-tighter mb-4">
            NO CAPITAL FOUND.
          </h2>
          <p className="text-2xl font-bold tracking-tight">
            ADJUST PARAMETERS.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-l border-t border-foreground">
      {grants.map((grant) => {
        const scoreColors = getScoreColorClasses(grant.match_score);
        return (
          <button
            key={grant.id}
            className="group border-r border-b border-foreground bg-card p-8 text-left transition-colors hover:bg-secondary cursor-pointer"
            onClick={() => console.log('Grant clicked:', grant.id)}
          >
            {/* Match Score - Most Prominent */}
            <div className="mb-6">
              <div className={`text-7xl font-black tracking-tighter mb-3 ${scoreColors.text}`}>
                {grant.match_score}%
              </div>
              <div className="w-full h-2 bg-border">
                <div
                  className={`h-full ${scoreColors.bg} transition-all`}
                  style={{ width: `${grant.match_score}%` }}
                />
              </div>
            </div>

            {/* Grant Name */}
            <h3 className="text-2xl font-black tracking-tight mb-3 uppercase">
              {grant.name}
            </h3>

            {/* Description */}
            <p className="text-sm font-medium mb-4 leading-tight text-foreground/80">
              {grant.description}
            </p>

            {/* Match Reasons - Small Bordered Tags */}
            <div className="flex flex-wrap gap-2">
              {grant.match_reasons.map((reason, idx) => (
                <span
                  key={idx}
                  className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wide border border-foreground"
                >
                  {reason}
                </span>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default GrantMatchesDashboard;
