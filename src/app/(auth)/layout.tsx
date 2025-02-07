interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen items-center justify-center">{children}</div>
  );
}

export default Layout;
