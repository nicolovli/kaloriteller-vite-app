import { useAuth } from "../context/AuthContext";
import { signInWithGoogle, auth } from "../firebase/firebase";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const { loginAsGuest } = useAuth();

  if (loading) return <div>Laster...</div>;

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
        flexDirection: "column",
      }}>
      {user ? (
        <>
          <h2>Velkommen, {user.displayName}</h2>
          <button onClick={() => auth.signOut()}>Logg ut</button>
        </>
      ) : (
        <>
          <button onClick={signInWithGoogle}>Logg inn med Google</button>
          <br />
          <button onClick={loginAsGuest}>Fortsett som gjest</button>
        </>
      )}
    </div>
  );
}
