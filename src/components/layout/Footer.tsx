import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8 mt-16">
      <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Section 1: Brand */}
        <div className="mb-6 sm:mb-0">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/images/logo-croatia360.png" alt="Croatia360 Logo" width={200} height={40} priority />
        </Link>          
          <p className="text-sm">Istraži Hrvatsku, na svoj način — Sve na jednom mjestu.</p>
          {/* Add social media icons if needed */}
        </div>

        {/* Section 2: Quick Links */}
        <div className="mb-6 sm:mb-0">
          <h4 className="text-md font-semibold text-white mb-4">Brzi linkovi</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/explore" className="hover:text-white">Destinacije</Link></li>
            <li><Link href="/" className="hover:text-white">SARA AI Planer</Link></li>
            <li><Link href="/my-trip" className="hover:text-white">Moje putovanje</Link></li>
            <li><Link href="/community" className="hover:text-white">Zajednica</Link></li>
            {/* Add other relevant links */}
          </ul>
        </div>

        {/* Section 3: Regions */}
        <div className="mb-6 sm:mb-0">
          <h4 className="text-md font-semibold text-white mb-4">Regije</h4>
          <ul className="space-y-2 text-sm">
            {/* Make these actual links if Explore page supports region filtering */}
            <li><Link href="/explore?region=dalmacija" className="hover:text-white">Dalmacija</Link></li>
            <li><Link href="/explore?region=istra" className="hover:text-white">Istra</Link></li>
            <li><Link href="/explore?region=zagreb" className="hover:text-white">Zagreb</Link></li>
            <li><Link href="/explore?region=slavonija" className="hover:text-white">Slavonija</Link></li>
            <li><Link href="/explore?region=sredisnja" className="hover:text-white">Središnja Hrvatska</Link></li>
          </ul>
        </div>

        {/* Section 4: Newsletter */}
        <div className="max-w-sm">
          <h4 className="text-md font-semibold text-white mb-4">Pretplatite se za savjete</h4>
          <p className="text-sm mb-4">Primajte najnovije savjete o putovanjima i ekskluzivne ponude.</p>
          <form className="flex flex-col sm:flex-row">
            <input 
              type="email" 
              placeholder="Vaša email adresa" 
              className="flex-grow p-1.5 rounded-t sm:rounded-l sm:rounded-tr-none text-gray-800 mb-2 sm:mb-0 sm:mr-0 min-w-0" 
            />
            <button 
              type="submit" 
              className="bg-red-500 text-white p-1.5 rounded-b sm:rounded-r sm:rounded-bl-none hover:bg-red-600 whitespace-nowrap"
            >
              Pretplati se
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="container mx-auto px-4 mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-sm">
        {/* Language Selector - Simplified */}
        <div className="flex space-x-4 mb-4 md:mb-0">
          <span className="cursor-pointer hover:text-white">EN</span>
          <span className="cursor-pointer hover:text-white">DE</span>
          <span className="cursor-pointer hover:text-white">IT</span>
          <span className="cursor-pointer hover:text-white">FR</span>
          <span className="font-bold text-white">HR</span>
        </div>
        {/* Copyright & Links */}
        <div className="text-center md:text-right">
          <div className="space-x-4 mb-2">
            <Link href="#" className="hover:text-white">O nama</Link>
            <Link href="#" className="hover:text-white">Kontakt</Link>
            <Link href="#" className="hover:text-white">Partneri</Link>
            <Link href="#" className="hover:text-white">Uvjeti</Link>
          </div>
          <p>&copy; {new Date().getFullYear()} Croatia360. Sva prava pridržana.</p>
        </div>
      </div>
    </footer>
  );
};

const birthdayMode = true;  
if (birthdayMode) {  
  console.log("🚀 Damir's 33rd Year: Code, Freedom, Empire");  
}  

export default Footer;

