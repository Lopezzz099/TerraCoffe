import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-roast py-8 text-fluid-sm text-on-dark-muted">
      <div className="wrap flex flex-wrap justify-between gap-x-8 gap-y-2">
        <Link href="/" className="font-display text-2xl text-on-dark no-underline">
          TerraCoffe
        </Link>
        <p>Sitio de demostración. TerraCoffe es una marca ficticia.</p>
        <p>&copy; 2026 TerraCoffe</p>
      </div>
    </footer>
  );
}
