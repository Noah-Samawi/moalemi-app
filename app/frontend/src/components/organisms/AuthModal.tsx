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
import { useAuth } from "@/context/AuthContext";

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
  const { signIn, signUp, resetPassword } = useAuth();
  const [tab, setTab] = useState<"login" | "register" | "forgot">(defaultTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
    setLoading(false);
  };

  const switchTab = (newTab: "login" | "register" | "forgot") => {
    setTab(newTab);
    resetForm();
  };

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError(t("auth.fillAll"));
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      setSuccess(t("auth.loginSuccess"));
      onAuthSuccess?.(email.split("@")[0]);
      onOpenChange(false);
      resetForm();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed";
      if (message.includes("Invalid login credentials")) {
        setError(t("auth.invalidCredentials") || "Invalid email or password");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError("");
    if (!name || !email || !password || !confirmPassword) {
      setError(t("auth.fillAll"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("auth.passwordMismatch"));
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, name);
      // Do NOT close the modal or call onAuthSuccess immediately —
      // the user must verify their e-mail address first.
      setSuccess(
        `✉️ Bestätigungs-E-Mail gesendet an ${email}.\n` +
        `Bitte klicke auf den Link in der E-Mail, um dein Konto zu aktivieren. ` +
        `Danach kannst du dich hier einloggen.`
      );
      // Keep the modal open so the user can read the message.
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      if (message.includes("already registered")) {
        setError(t("auth.emailExists") || "This email is already registered");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError("");
    if (!email) {
      setError(t("auth.fillAll"));
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email);
      setSuccess(t("auth.resetPasswordSuccess"));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send reset link";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-[#1A1A2E]">
            {tab === "forgot"
              ? t("auth.forgotPassword")
              : tab === "login"
                ? t("auth.welcomeBack")
                : t("auth.createAccount")}
          </DialogTitle>
        </DialogHeader>

        {/* Forgot Password Tab */}
        {tab === "forgot" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center">
              {t("auth.forgotPasswordDesc")}
            </p>

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

            <div className="space-y-2">
              <Label htmlFor="auth-reset-email">{t("auth.email")}</Label>
              <Input
                id="auth-reset-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <PrimaryButton className="w-full" onClick={handleResetPassword} disabled={loading}>
              {loading ? "..." : t("auth.sendResetLink")}
            </PrimaryButton>
            <p className="text-center text-sm text-gray-500">
              <button
                className="text-[#2F7A5B] font-semibold hover:underline"
                onClick={() => switchTab("login")}
              >
                {t("auth.backToLogin")}
              </button>
            </p>
          </div>
        )}

        {/* Login / Register Tab Switcher */}
        {tab !== "forgot" && (
          <>
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
                    disabled={loading}
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
                    disabled={loading}
                  />
                </div>
                <PrimaryButton className="w-full" onClick={handleLogin} disabled={loading}>
                  {loading ? "..." : t("auth.loginButton")}
                </PrimaryButton>
                <p className="text-center text-sm">
                  <button
                    className="text-[#2F7A5B] font-semibold hover:underline"
                    onClick={() => switchTab("forgot")}
                  >
                    {t("auth.forgotPassword")}
                  </button>
                </p>
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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
                  />
                </div>
                <SecondaryButton className="w-full" onClick={handleRegister} disabled={loading}>
                  {loading ? "..." : t("auth.registerButton")}
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}