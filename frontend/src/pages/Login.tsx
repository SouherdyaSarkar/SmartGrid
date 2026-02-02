import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap, Sun, Factory, Network } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("prosumer");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const roles = [
    {
      id: "prosumer" as UserRole,
      label: "Prosumer",
      icon: Sun,
      description: "Generate & sell energy",
    },
    {
      id: "consumer" as UserRole,
      label: "Consumer",
      icon: Factory,
      description: "Request & use energy",
    },
    {
      id: "grid" as UserRole,
      label: "Grid Operator",
      icon: Network,
      description: "Manage energy flow",
    },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    const success = login(email, password, selectedRole);
    if (success) {
      navigate(`/dashboard/${selectedRole}`);
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-chart-blue/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center energy-glow">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <span className="text-3xl font-bold gradient-text">SmartGrid</span>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8">
          <h1 className="text-xl font-semibold text-foreground text-center mb-2">
            Welcome Back
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Sign in to your dashboard
          </p>

          {/* Role Selection */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-lg border transition-all duration-200",
                  selectedRole === role.id
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-muted/30 text-muted-foreground hover:border-primary/50",
                )}
              >
                <role.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{role.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Email
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-muted/50 border-border"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-muted/50 border-border"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <Button type="submit" className="w-full" size="lg">
              Sign In
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Demo: Use any email and 4+ char password
          </p>
        </div>
      </div>
    </div>
  );
}
