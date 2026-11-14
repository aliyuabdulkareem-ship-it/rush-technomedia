export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This empty layout opts out of the root layout, 
  // effectively hiding the main site's header and footer on all /admin pages.
  return <>{children}</>;
}
