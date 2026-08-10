import { redirect } from 'next/navigation';

interface LegacyPartnerPageProps {
  params: Promise<{ locale: string }>;
}

export default async function LegacySanLucaMagnoPage({ params }: LegacyPartnerPageProps) {
  const { locale } = await params;

  redirect(`/${locale}/experiences/san-luca-magno-kornati-telascica-private-tour`);
}
