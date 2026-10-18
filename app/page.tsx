import Opener from '@/components/Opener';

export default function Page() {
  return <Opener portalUrl={process.env.NEXT_PUBLIC_PORTAL_URL ?? 'https://test.exponentor.com'} />;
}
