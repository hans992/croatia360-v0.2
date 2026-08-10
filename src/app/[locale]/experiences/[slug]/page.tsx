import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Anchor, CheckCircle2, Clock3, MapPin, Users } from 'lucide-react';
import { getMarketplaceExperienceBySlug } from '@/lib/marketplace/experiences';
import RequestBookingForm from '@/components/marketplace/RequestBookingForm';

interface ExperiencePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function ExperiencePage({ params }: ExperiencePageProps) {
  const { locale, slug } = await params;
  const experience = await getMarketplaceExperienceBySlug(slug);

  if (!experience) notFound();

  const durationHours = Math.round((experience.durationMinutes / 60) * 10) / 10;
  const formattedPrice = experience.basePriceCents
    ? new Intl.NumberFormat(locale, { style: 'currency', currency: experience.currency }).format(experience.basePriceCents / 100)
    : null;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="relative min-h-[62vh] overflow-hidden">
        <Image
          src={experience.heroImage}
          alt={experience.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
        <div className="relative z-10 mx-auto flex min-h-[62vh] max-w-6xl items-end px-4 pb-12 sm:px-6 lg:px-8">
          <div className="max-w-4xl text-white">
            <div className="mb-4 flex flex-wrap gap-3 text-sm font-medium">
              <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur">{experience.city}</span>
              <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur">{experience.experienceType}</span>
              <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur">{experience.operatorName}</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{experience.title}</h1>
            <p className="mt-5 max-w-3xl text-lg text-white/90 sm:text-xl">{experience.shortDescription}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <div className="space-y-12">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Fact icon={<Clock3 className="h-5 w-5" />} label={`${durationHours} h`} />
            <Fact icon={<Users className="h-5 w-5" />} label={`Do ${experience.maxGuests} gostiju`} />
            <Fact icon={<MapPin className="h-5 w-5" />} label={experience.city} />
            <Fact icon={<Anchor className="h-5 w-5" />} label="Privatno iskustvo" />
          </div>

          <div>
            <h2 className="text-2xl font-semibold">O iskustvu</h2>
            <div className="mt-4 space-y-4 text-muted-foreground">
              {experience.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Što je uključeno</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {experience.included.map((item) => (
                <li key={item} className="flex gap-3 rounded-xl border p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {experience.importantInfo.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold">Važne informacije</h2>
              <ul className="mt-4 space-y-3 text-muted-foreground">
                {experience.importantInfo.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </div>
          )}

          <div>
            <h2 className="text-2xl font-semibold">Galerija</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {experience.gallery.map((image) => (
                <div key={image.url} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image src={image.url} alt={image.alt} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">Request to book</p>
            <h2 className="mt-1 text-2xl font-semibold">Provjeri dostupnost</h2>
            {formattedPrice ? (
              <p className="mt-2 text-lg font-semibold">Od {formattedPrice} <span className="text-sm font-normal text-muted-foreground">/ {experience.pricingUnit}</span></p>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">Cijenu potvrđuje operator zajedno s dostupnošću.</p>
            )}
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between gap-4"><dt>Polazak</dt><dd className="text-right font-medium">{experience.meetingPoint}</dd></div>
              <div className="flex justify-between gap-4"><dt>Kapacitet</dt><dd className="font-medium">{experience.maxGuests}</dd></div>
              <div className="flex justify-between gap-4"><dt>Trajanje</dt><dd className="font-medium">{durationHours} h</dd></div>
            </dl>

            <RequestBookingForm experienceSlug={experience.slug} maxGuests={experience.maxGuests} />

            <Link href={`/${locale}/explore`} className="mt-4 inline-flex w-full justify-center text-sm font-medium text-muted-foreground hover:text-foreground">
              Nastavi istraživati Hrvatsku
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}

function Fact({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border bg-card p-4 text-sm font-medium">
      {icon}
      <span>{label}</span>
    </div>
  );
}
