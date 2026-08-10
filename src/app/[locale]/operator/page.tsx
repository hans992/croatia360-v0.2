import OperatorDashboard from '@/components/marketplace/OperatorDashboard';

interface OperatorPageProps {
  params: Promise<{ locale: string }>;
}

export default async function OperatorPage({ params }: OperatorPageProps) {
  const { locale } = await params;
  return <OperatorDashboard locale={locale} />;
}
