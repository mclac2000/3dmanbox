import { Badge } from "@/components/ui/Badge";
import { Mail } from "@/components/ui/Icon";

export const metadata = {
  title: "Login — 3D Man Club",
  description: "Melde dich mit deinem Magic Link an.",
};

export default function Login() {
  return (
    <section className="bg-navy-gradient">
      <div className="container-narrow flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-16">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-card md:p-10">
          <div className="text-center">
            <Badge variant="gold">Mitglieder-Login</Badge>
            <h1 className="h-display mt-4 text-2xl text-navy-900 md:text-3xl">
              Willkommen zurück
            </h1>
            <p className="mt-2 text-sm text-navy-600">
              Gib deine E-Mail ein — wir schicken dir einen sicheren Anmelde-Link.
            </p>
          </div>

          <form action="/api/auth/magic-link" method="post" className="mt-8 space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-navy-800">E-Mail-Adresse</span>
              <div className="mt-1 flex items-center gap-2 rounded-lg border border-navy-200 bg-white px-3 py-2 focus-within:ring-2 focus-within:ring-gold-300">
                <Mail size={18} className="text-navy-400" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="du@beispiel.com"
                  className="w-full bg-transparent text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none"
                />
              </div>
            </label>

            <button
              type="submit"
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-navy-800 font-semibold text-white transition hover:bg-navy-700"
            >
              Magic Link senden
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-navy-500">
            Du hast noch keinen Account?{" "}
            <a href="/pricing" className="font-semibold text-navy-800 underline">
              Kostenlos starten
            </a>
          </p>
        </div>

        <p className="mt-6 text-xs text-navy-200">
          Mit dem Login akzeptierst du unsere{" "}
          <a href="/agb" className="underline">AGB</a> und{" "}
          <a href="/datenschutz" className="underline">Datenschutz</a>.
        </p>
      </div>
    </section>
  );
}
