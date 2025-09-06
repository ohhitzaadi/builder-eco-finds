import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/state/auth";
import { ShoppingCart, Sprout, User, Sun, Moon } from "lucide-react";
import StatsBar from "@/components/StatsBar";
import { useTheme } from "@/state/theme";

export default function Header() {
  const { currentUser, logout } = useAuth();
  const { resolved, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-xl tracking-tight">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground"><Sprout className="h-5 w-5"/></span>
          <span>EcoFinds</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavLink to="/browse" className={({isActive})=>isActive?"text-foreground font-semibold transition-transform duration-150 hover:scale-105":"text-muted-foreground hover:text-foreground transition-transform duration-150 hover:scale-105"}>Browse</NavLink>
          <NavLink to="/sell" className={({isActive})=>isActive?"text-foreground font-semibold transition-transform duration-150 hover:scale-105":"text-muted-foreground hover:text-foreground transition-transform duration-150 hover:scale-105"}>Sell</NavLink>
          <NavLink to="/purchases" className={({isActive})=>isActive?"text-foreground font-semibold transition-transform duration-150 hover:scale-105":"text-muted-foreground hover:text-foreground transition-transform duration-150 hover:scale-105"}>Purchases</NavLink>
          <NavLink to="/dashboard" className={({isActive})=>isActive?"text-foreground font-semibold transition-transform duration-150 hover:scale-105":"text-muted-foreground hover:text-foreground transition-transform duration-150 hover:scale-105"}>Dashboard</NavLink>
        </nav>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {resolved === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Link to="/cart" className="text-muted-foreground hover:text-foreground transition-transform duration-150 hover:scale-105"><ShoppingCart className="h-5 w-5"/></Link>
          {currentUser ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="hidden md:flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-accent"><User className="h-4 w-4"/> {currentUser.username}</Link>
              <Button variant="secondary" size="sm" onClick={logout}>Logout</Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost"><Link to="/auth/login">Log in</Link></Button>
              <Button asChild><Link to="/auth/register">Sign up</Link></Button>
            </div>
          )}
        </div>
      </div>
      <StatsBar />
    </header>
  );
}
