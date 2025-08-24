import React, { useEffect, useState } from "react";
import { getUserProfile, updateUserProfile } from "../firebase/functions/user";
import type { UserProfile } from "../firebase/types";

export default function UserProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getUserProfile();
      setProfile(data);
      setWeight(data?.weight || 0);
      setHeight(data?.height || 0);
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserProfile({ weight, height });
      setMessage("Profil oppdatert!");
    } catch (err) {
      setMessage("Kunne ikke oppdatere profil");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="container">Laster profil...</div>;
  if (!profile) return <div className="container">Fant ikke brukerprofil</div>;

  return (
    <div className="container" style={{ maxWidth: 400 }}>
      <h1>Brukerprofil</h1>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        {profile.photoURL && (
          <img
            src={profile.photoURL}
            alt="Profilbilde"
            style={{ width: 64, height: 64, borderRadius: "50%" }}
          />
        )}
        <div>
          <div style={{ fontWeight: 600 }}>{profile.name}</div>
          <div style={{ color: "var(--color-text-light)" }}>{profile.email}</div>
        </div>
      </div>
      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <label>
          Vekt (kg):
          <input
            type="number"
            value={weight}
            min={0}
            onChange={(e) => setWeight(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </label>
        <label>
          Høyde (cm):
          <input
            type="number"
            value={height}
            min={0}
            onChange={(e) => setHeight(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </label>
        <button type="submit" disabled={saving} style={{ marginTop: 8 }}>
          {saving ? "Lagrer..." : "Lagre"}
        </button>
        {message && <div style={{ color: "var(--color-primary)", marginTop: 8 }}>{message}</div>}
      </form>
    </div>
  );
}
