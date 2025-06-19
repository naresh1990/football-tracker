import { Link } from "wouter";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const navigation = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Games", href: "/games" },
    { name: "Tournaments", href: "/tournaments" },
    { name: "Training", href: "/training" },
    { name: "Statistics", href: "/statistics" },
  ];

  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-football-green text-white p-4">
      <nav className="flex flex-col space-y-3">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={onClose}
            className="hover:text-field-green transition-colors"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
