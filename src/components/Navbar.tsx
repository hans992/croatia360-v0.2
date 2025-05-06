// src/components/Navbar.tsx
import Link from 'next/link'; 
import ThemeSwitcher from './ThemeSwitcher'; 

const Navbar = () => {
  return (
    <nav className="bg-card text-card-foreground shadow-md"> 
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-primary">
          Croatia360
        </Link>
        <ThemeSwitcher /> 
      </div>
    </nav>
  );
};

export default Navbar;