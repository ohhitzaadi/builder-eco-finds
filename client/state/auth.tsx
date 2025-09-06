import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loadJSON, saveJSON } from "./storage";
import type { UserProfile } from "./types";

interface AuthContextValue {
  currentUser: UserProfile | null;
  users: UserProfile[];
  register: (email: string, password: string, username: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  socialLogin: (provider: "google" | "facebook") => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<Omit<UserProfile, "id" | "email" | "passwordHash" | "createdAt">>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USERS_KEY = "users";
const SESSION_KEY = "session";

async function sha256(text: string) {
  const enc = new TextEncoder();
  const data = enc.encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function newEcoScore(): number {
  // Start users with a friendly eco-score baseline
  return 60 + Math.floor(Math.random() * 20);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<UserProfile[]>(() => loadJSON<UserProfile[]>(USERS_KEY, []));
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => loadJSON<string | null>(SESSION_KEY, null));

  const currentUser = useMemo(() => users.find((u) => u.id === currentUserId) ?? null, [users, currentUserId]);

  useEffect(() => {
    saveJSON(USERS_KEY, users);
  }, [users]);

  useEffect(() => {
    saveJSON(SESSION_KEY, currentUserId);
  }, [currentUserId]);

  const register = useCallback(async (email: string, password: string, username: string) => {
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) throw new Error("Email already registered");
    const id = crypto.randomUUID();
    const passwordHash = await sha256(password);
    const profile: UserProfile = {
      id,
      email,
      passwordHash,
      username,
      bio: "",
      ecoScore: newEcoScore(),
      trustBadges: [],
      createdAt: Date.now(),
    };
    setUsers((p) => [...p, profile]);
    setCurrentUserId(id);
  }, [users]);

  const login = useCallback(async (email: string, password: string) => {
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) throw new Error("Invalid credentials");
    const hash = await sha256(password);
    if (hash !== user.passwordHash) throw new Error("Invalid credentials");
    setCurrentUserId(user.id);
  }, [users]);

  const socialLogin = useCallback(async (provider: "google" | "facebook") => {
    // Mock social login for prototype: create or find a user based on provider
    const mockId = crypto.randomUUID().slice(0, 8);
    const email = `${provider}.${mockId}@social.ecofinds.test`;
    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      const id = crypto.randomUUID();
      const username = `${provider.charAt(0).toUpperCase() + provider.slice(1)}User${mockId}`;
      const profile: UserProfile = {
        id,
        email,
        passwordHash: await sha256(mockId),
        username,
        bio: "",
        ecoScore: newEcoScore(),
        trustBadges: [`Verified via ${provider}`],
        createdAt: Date.now(),
      };
      setUsers((p) => [...p, profile]);
      setCurrentUserId(id);
    } else {
      setCurrentUserId(user.id);
    }
  }, [users]);

  const logout = useCallback(() => setCurrentUserId(null), []);

  const updateProfile = useCallback((updates: Partial<Omit<UserProfile, "id" | "email" | "passwordHash" | "createdAt">>) => {
    if (!currentUser) return;
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? { ...u, ...updates } : u)));
  }, [currentUser]);

  const value = useMemo<AuthContextValue>(() => ({ currentUser, users, register, login, logout, updateProfile }), [currentUser, users, register, login, logout, updateProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
