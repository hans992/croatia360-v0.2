import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Anchor, CalendarDays, Clock3, MapPin, Search, Users } from 'lucide-react';
import { listMarketplaceExperiences, type MarketplaceListing } from '@/lib/marketplace/discovery';
import type { ExperienceType } from '@/lib/marketplace/experiences';
import { getMarketplaceCopy } from '@/lib/marketplace/copy';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    date?: string;
    guests?: string;
    type?: string;
  }>;
}

export async function generateMetadata({ params }: Pick<PageProps, 'params'>): Promise<Metadata> {
  const { locale } = await params;
  const copy = getMarketplaceCopy(locale);
  return {
    title: `${copy.heroTitle} | Croatia360`,
    description: copy.heroDescription,
    alternates: { canonical: `/${locale}/zadar/boat-tours` },
  };
}

export default async function ZadarBoatToursPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const copy = getMarketplaceCopy(locale);
  const query = await searchParams;
  const guests = parseGuests(query.guests);
  const experienceType = parseExperienceType(query.type);
  const date = isDate(query.date) ? query.date : undefined;

  const experiences = await listMarketplaceExperiences({ city: 'Zadar', category: 'boat-tour', guests, experienceType, date });

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: copy.heroTitle,
    numberOfItems: experiences.length,
    itemListElement: experiences.map((experience, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `/${locale}/experiences/${experience.slug}`,
      name: experience.title,
    })),
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <section className="border-b bg-gradient-to-br from-sky-950 via-cyan-900 to-slate-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm backdrop-blur">
              <Anchor className="h-4 w-4" /> {copy.heroEyebrow}
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{copy.heroTitle}</h1>
            <p className="mt-5 max-w-2xl text-lg text-white/80 sm:text-xl">{copy.heroDescription}</p>
          </div>

          <form method="get" className="mt-10 grid gap-3 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur md:grid-cols-[1.2fr_0.8fr_1fr_auto]">
            <FilterField icon={<CalendarDays className="h-4 w-4" />} label={copy.date}>
              <input name="date" type="date" defaultValue={date} min={new Date().toISOString().slice(0, 10)} className="w-full bg-transparent text-sm outline-none [color-scheme:dark]" />
            </FilterField>
            <FilterField icon={<Users className="h-4 w-4" />} label={copy.guests}>
              <input name="guests" type="number" min={1} max={30} defaultValue={guests} placeholder="2" className="w-full bg-transparent text-sm outline-none" />
            </FilterField>
            <FilterField icon={<Anchor className="h-4 w-4" />} label={copy.experienceType}>
              <select name="type" defaultValue={experienceType ?? ''} className="w-full bg-transparent text-sm outline-none [&>option]:text-black">
                <option value="">{copy.allTypes}</option>
                <option value="private">{copy.privateTour}</option>
                <option value="shared">{copy.sharedTour}</option>
                <option value="rental">{copy.boatRental}</option>
              </select>
            </FilterField>
            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-slate-950 transition hover:bg-white/90">
              <Search className="h-4 w-4" /> {copy.search}
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Zadar, Croatia</p>
            <h2 className="mt-1 text-3xl font-semibold tracking-tight">{copy.availableTitle}</h2>
            <p className="mt-2 text-muted-foreground">{experiences.length} {experiences.length === 1 ? copy.resultsOne : copy.resultsMany}</p>
          </div>
          {(date || guests || experienceType) && <Link href={`/${locale}/zadar/boat-tours`} className="text-sm font-medium text-primary hover:underline">{copy.clearFilters}</Link>}
        </div>

        {experiences.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {experiences.map((experience) => <ExperienceCard key={experience.slug} experience={experience} locale={locale} date={date} guests={guests} />)}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed p-10 text-center">
            <Anchor className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold">{copy.noMatchTitle}</h3>
            <p className="mx-auto mt-2 max-w-xl text-muted-foreground">{copy.noMatchDescription}</p>
            <Link href={`/${locale}/zadar/boat-tours`} className="mt-5 inline-flex rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground">{copy.showAll}</Link>
          </div>
        )}
      </section>
    </main>
  );
}

function ExperienceCard({ experience, locale, date, guests }: { experience: MarketplaceListing; locale: string; date?: string; guests?: number }) {
  const copy = getMarketplaceCopy(locale);
  const hrefParams = new URLSearchParams();
  if (date) hrefParams.set('date', date);
  if (guests) hrefParams.set('guests', String(guests));
  const suffix = hrefParams.size ? `?${hrefParams.toString()}` : '';
  const price = experience.basePriceCents
    ? new Intl.NumberFormat(locale, { style: 'currency', currency: experience.currency }).format(experience.basePriceCents / 100)
    : null;
  const durationHours = Math.round((experience.durationMinutes / 60) * 10) / 10;
  const typeLabel = experience.experienceType === 'private' ? copy.privateTour : experience.experienceType === 'shared' ? copy.sharedTour : copy.boatRental;

  return (
    <article className="overflow-hidden rounded-3xl border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/${locale}/experiences/${experience.slug}${suffix}`} className="block">
        <div className="relative aspect-[4/3] bg-muted">
          {experience.heroImage ? <Image src={experience.heroImage} alt={experience.title} fill className="object-cover" /> : null}
          <div className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur">{typeLabel}</div>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4" /> {experience.city}<span>·</span><span>{experience.operatorName}</span></div>
          <h3 className="mt-3 text-xl font-semibold leading-snug">{experience.title}</h3>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{experience.shortDescription}</p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5"><Clock3 className="h-4 w-4" /> {durationHours} h</span>
            <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" /> {copy.upTo} {experience.maxGuests}</span>
          </div>
          <div className="mt-5 flex items-end justify-between gap-4 border-t pt-4">
            <div><p className="text-xs text-muted-foreground">{price ? copy.from : copy.pricing}</p><p className="font-semibold">{price ?? copy.onRequest}</p></div>
            <span className="font-semibold text-primary">{copy.viewExperience} →</span>
          </div>
        </div>
      </Link>
    </article>
  );
}

function FilterField({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return <label className="rounded-xl border border-white/15 bg-black/10 px-4 py-3"><span className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-white/60">{icon}{label}</span>{children}</label>;
}

function parseGuests(value?: string) {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 && parsed <= 30 ? parsed : undefined;
}

function parseExperienceType(value?: string): ExperienceType | undefined {
  return value === 'private' || value === 'shared' || value === 'rental' ? value : undefined;
}

function isDate(value?: string): value is string {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}
