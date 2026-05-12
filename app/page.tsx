import PraetorLandingPage from "@/components/landing/PraetorLandingPage";

// Force-dynamic on `/` so the new hero is rendered on every request and cannot
// be served from the stale root artifact seen on DigitalOcean/Cloudflare.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function HomePage() {
  return <PraetorLandingPage />;
}
