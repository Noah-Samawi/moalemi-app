import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import SecondaryButton from "@/components/atoms/SecondaryButton";
import { useLanguage } from "@/i18n/LanguageContext";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "login" | "register";
  onAuthSuccess?: (name: string) => void;
}

export default function AuthModal({
  open,
  onOpenChange,
  defaultTab = "login",
  onAuthSuccess,
}: AuthModalProps) {
  const { t } = useLanguage();
  const [tab, setTab] = useState<"login" | "register">(defaultTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
  };

  const switchTab = (newTab: "login" | "register") => {
    setTab(newTab);
    resetForm();
  };

  const handleLogin = () => {
    setError("");
    if (!email || !password) {
      setError(t("auth.fillAll"));
      return;
    }
    // Simulate login
    setSuccess(t("auth.loginSuccess"));
    setTimeout(() => {
      onAuthSuccess?.(email.split("@")[0]);
      onOpenChange(false);
      resetForm();
    }, 1200);
  };

  const handleRegister = () => {
    setError("");
    if (!name || !email || !password || !confirmPassword) {
      setError(t("auth.fillAll"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("auth.passwordMismatch"));
      return;
    }
    // Simulate register
    setSuccess(t("auth.registerSuccess"));
    setTimeout(() => {
      onAuthSuccess?.(name);
      onOpenChange(false);
      resetForm();
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-[#1A1A2E]">
            {tab === "login" ? t("auth.welcomeBack") : t("auth.createAccount")}
          </DialogTitle>
        </DialogHeader>

        {/* Tab Switcher */}
        <div className="flex rounded-lg overflow-hidden border border-gray-200 mb-4">
          <button
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
              tab === "login"
                ? "bg-[#2F7A5B] text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => switchTab("login")}
          >
            {t("auth.login")}
          </button>
          <button
            className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
              tab === "register"
                ? "bg-[#2F7A5B] text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => switchTab("register")}
          >
            {t("auth.register")}
          </button>
        </div>

        {/* Error / Success Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg p-3 text-center">
            {success}
          </div>
        )}

        {/* Login Form */}
        {tab === "login" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="auth-email">{t("auth.email")}</Label>
              <Input
                id="auth-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="auth-password">{t("auth.password")}</Label>
              <Input
                id="auth-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <PrimaryButton className="w-full" onClick={handleLogin}>
              {t("auth.loginButton")}
            </PrimaryButton>
            <p className="text-center text-sm text-gray-500">
              {t("auth.noAccount")}{" "}
              <button
                className="text-[#2F7A5B] font-semibold hover:underline"
                onClick={() => switchTab("register")}
              >
                {t("auth.register")}
              </button>
            </p>
          </div>
        )}

        {/* Register Form */}
        {tab === "register" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="auth-name">{t("auth.name")}</Label>
              <Input
                id="auth-name"
                placeholder={t("auth.name")}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="auth-reg-email">{t("auth.email")}</Label>
              <Input
                id="auth-reg-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="auth-reg-password">{t("auth.password")}</Label>
              <Input
                id="auth-reg-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="auth-confirm-password">{t("auth.confirmPassword")}</Label>
              <Input
                id="auth-confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <SecondaryButton className="w-full" onClick={handleRegister}>
              {t("auth.registerButton")}
            </SecondaryButton>
            <p className="text-center text-sm text-gray-500">
              {t("auth.hasAccount")}{" "}
              <button
                className="text-[#2F7A5B] font-semibold hover:underline"
                onClick={() => switchTab("login")}
              >
                {t("auth.login")}
              </button>
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}