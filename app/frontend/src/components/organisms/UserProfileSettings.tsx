import { useEffect, useRef, useState } from "react";
import { Camera, Mail, Phone, Save, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getProfile, upsertProfile, uploadProfileAvatar } from "@/services/profileService";
import PrimaryButton from "@/components/atoms/PrimaryButton";

export default function UserProfileSettings() {
  const { user, userName } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    getProfile(user.id)
      .then((profile) => {
        setName(profile?.name ?? userName ?? "");
        setPhone(profile?.phone ?? "");
        setAvatarUrl(profile?.avatar_url ?? "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id, userName]);

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    setError("");
    try {
      await upsertProfile({ id: user.id, name, phone, avatar_url: avatarUrl || null });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Fehler beim Speichern");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (file: File) => {
    if (!user?.id) return;
    setUploadingAvatar(true);
    setError("");
    try {
      const url = await uploadProfileAvatar(user.id, file);
      setAvatarUrl(url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Avatar-Upload fehlgeschlagen");
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-[#2F7A5B]/20 border-t-[#2F7A5B] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
      <h2 className="text-xl font-bold text-[#1A1A2E] mb-8 flex items-center gap-2">
        <User className="w-5 h-5 text-[#2F7A5B]" />
        Profileinstellungen
      </h2>

      {/* Avatar block */}
      <div className="flex items-center gap-5 mb-8 pb-8 border-b border-gray-100">
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#2F7A5B] to-[#3a8b6a] overflow-hidden ring-2 ring-[#DCA842]/30 ring-offset-2">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                {(name || user?.email || "U").charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploadingAvatar}
            className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#DCA842] rounded-full flex items-center justify-center hover:bg-[#c8962e] transition-colors shadow-md disabled:opacity-60"
          >
            {uploadingAvatar ? (
              <div className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <Camera className="w-3.5 h-3.5 text-white" />
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) handleAvatarChange(e.target.files[0]); }}
          />
        </div>
        <div>
          <p className="font-semibold text-[#1A1A2E] text-lg">{name || "—"}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <p className="text-xs text-[#2F7A5B] mt-1">Tippe auf das Kamera-Icon um dein Profilbild zu ändern</p>
        </div>
      </div>

      <div className="space-y-5 max-w-md">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Vollständiger Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Dein Name"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B]/40 focus:border-[#2F7A5B] transition-all duration-200"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Telefonnummer
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+49 123 456 7890"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2F7A5B]/40 focus:border-[#2F7A5B] transition-all duration-200"
            />
          </div>
        </div>

        {/* Email (readonly) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            E-Mail-Adresse <span className="text-gray-400 font-normal">(nicht änderbar)</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="email"
              value={user?.email ?? ""}
              readOnly
              className="w-full pl-9 pr-4 py-2.5 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-500 cursor-default"
            />
          </div>
        </div>

        {success && (
          <div className="p-3 bg-[#2F7A5B]/10 border border-[#2F7A5B]/20 rounded-xl text-[#2F7A5B] text-sm font-medium">
            ✓ Profil erfolgreich gespeichert!
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <PrimaryButton onClick={handleSave} disabled={saving} className="w-full py-2.5">
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Speichern...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              Profil speichern
            </span>
          )}
        </PrimaryButton>
      </div>
    </div>
  );
}
