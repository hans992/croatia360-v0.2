// src/app/components/TransportationCard.tsx
import React from 'react';
import { useTranslation } from 'next-i18next'; // Ili getServerTranslations ako je serverska komponenta
import { type LucideIcon } from 'lucide-react';

interface TransportationCardProps {
  icon: LucideIcon;
  typeKey: string;       // npr. 'transport_type_airplane'
  detailsKey: string;    // npr. 'transport_dalmacija_airplane_details'
  primaryColor?: string; // Za stiliziranje, ako želite da odgovara boji regije
  locale?: string; // Potrebno ako koristite getServerTranslations unutar ove komponente
                   // ili ako prevodite na osnovu propsa
}

const TransportationCard: React.FC<TransportationCardProps> = ({
  icon: IconComponent,
  typeKey,
  detailsKey,
  primaryColor,
  // locale // ako je potrebno
}) => {
  // Ako je serverska komponenta i želite dohvaćati prijevode ovdje:
  // const { t } = await getServerTranslations(locale || fallbackLng, ['regions']);
  // Ako je klijentska i prosljeđujete 't' funkciju ili koristite hook:
  const { t } = useTranslation(['regions']); // Osigurajte da je 'regions' namespace dostupan

  const iconStyle = primaryColor ? { color: primaryColor } : {};
  const borderStyle = primaryColor ? { borderColor: primaryColor } : {};

  return (
    // Primjer kompaktnijeg dizajna - prilagodite Tailwind klase po potrebi
    <div className="bg-card text-card-foreground p-4 rounded-lg shadow-md border-l-4" style={borderStyle}>
      <div className="flex items-center mb-2">
        <IconComponent className="w-6 h-6 mr-3 shrink-0" style={iconStyle} />
        <h3 className="font-semibold text-lg" style={iconStyle}>
          {t(typeKey, { ns: 'regions' })}
        </h3>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-3"> {/* line-clamp-3 za skraćivanje teksta */}
        {t(detailsKey, { ns: 'regions' })}
      </p>
      {/* Opcionalno: Link/gumb za "Više detalja" ako je tekst skraćen */}
      {/* <button className="text-sm text-primary hover:underline mt-1">Više...</button> */}
    </div>
  );
};

export default TransportationCard;