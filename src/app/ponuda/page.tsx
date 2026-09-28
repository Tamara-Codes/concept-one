import { Metadata } from "next";
import Logo from "@/components/Logo";
import { getAuth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Ponuda | Concept One",
  robots: { index: false, follow: false },
};

export default async function PonudaPage({ searchParams }: { searchParams?: Promise<{ preview?: string }> }) {
  const params = searchParams ? await searchParams : {};
  const preview = params.preview === "1";
  const { data: session } = await getAuth().getSession();
  const userEmail = session?.user?.email ?? "Prijavljeni korisnik";
  return (
    <main data-offer-dashboard className="offer-dashboard-root min-h-screen bg-[var(--color-co-warm)] px-5 py-8 text-[var(--color-co-charcoal)] sm:px-8 lg:px-12">
      <style>{`[data-offer-dashboard]{min-height:100vh;padding:32px 5vw;background:#f3f4f2;color:#1e2326}[data-offer-dashboard]>div{max-width:1152px;margin:0 auto}[data-offer-dashboard] header{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;padding-bottom:28px;border-bottom:1px solid rgba(30,35,38,.12)}[data-offer-dashboard]>div>section:first-of-type{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(280px,.75fr);gap:20px;margin-top:32px}[data-offer-dashboard]>div>section:first-of-type>a{min-height:320px;padding:36px;display:flex;border-radius:24px}[data-offer-dashboard]>div>section:first-of-type>div{padding:32px;border-radius:24px}[data-offer-dashboard]>div>section:nth-of-type(2){margin-top:40px}[data-offer-dashboard]>div>section:nth-of-type(2)>div:last-child{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;margin-top:20px}[data-offer-dashboard]>div>section:nth-of-type(2)>div:last-child a{min-height:144px;padding:20px;border-radius:16px}[data-offer-dashboard]>div>section:last-of-type{margin-top:40px;padding:32px;border-radius:24px}@media(max-width:760px){[data-offer-dashboard] header{align-items:flex-start;flex-direction:column}[data-offer-dashboard]>div>section:first-of-type{grid-template-columns:1fr}[data-offer-dashboard]>div>section:nth-of-type(2)>div:last-child{grid-template-columns:repeat(2,minmax(0,1fr))}}`}</style>
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-6 border-b border-black/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Logo />
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-600"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-co-charcoal)] text-xs font-semibold text-[var(--color-co-accent)]">C1</span><span>{userEmail}</span></div>
        </header>

        <section className="mt-10 grid gap-5 sm:grid-cols-2">
          <a href={preview ? "/ponuda-new-preview" : "/ponuda/new"} className="group rounded-2xl bg-[var(--color-co-charcoal)] p-8 text-white shadow-xl transition-transform hover:-translate-y-0.5"><div className="flex min-h-52 flex-col justify-between"><div><p className="text-xs font-semibold tracking-[0.25em] text-[var(--color-co-accent)]">RADNI PROSTOR</p><h2 className="mt-5 text-3xl font-semibold">Nova ponuda</h2></div><span className="inline-flex w-fit items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-[var(--color-co-charcoal)] transition-colors group-hover:bg-[var(--color-co-accent)]">+ Nova ponuda</span></div></a>
          <a href="/ponuda/saved" className="rounded-2xl border border-black/10 bg-white p-8 shadow-sm transition-transform hover:-translate-y-0.5"><div className="flex min-h-52 flex-col justify-between"><div><p className="text-xs font-semibold tracking-[0.25em] text-[var(--color-co-accent-dark)]">ARHIVA</p><h2 className="mt-5 text-3xl font-semibold">Pregled spremljenih ponuda</h2></div><span className="inline-flex w-fit rounded-full border border-black/10 px-5 py-3 text-sm font-semibold">Otvori ponude</span></div></a>
        </section>
      </div>
    </main>
  );
}
