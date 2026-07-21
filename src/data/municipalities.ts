import { Regional } from "../types";

export interface Municipality {
  city: string;
  region: Regional;
}

export const MUNICIPALITIES: Municipality[] = [
  // Centro-Norte
  { city: "Videira", region: "Centro-Norte" },
  { city: "Caçador", region: "Centro-Norte" },
  { city: "Fraiburgo", region: "Centro-Norte" },
  { city: "Canoinhas", region: "Centro-Norte" },
  
  // Oeste
  { city: "Chapecó", region: "Oeste" },
  { city: "Xanxerê", region: "Oeste" },
  { city: "Concórdia", region: "Oeste" },
  { city: "São Miguel do Oeste", region: "Oeste" },
  { city: "Joaçaba", region: "Oeste" },
  
  // Serrana
  { city: "Lages", region: "Serrana" },
  { city: "Curitibanos", region: "Serrana" },
  { city: "São Joaquim", region: "Serrana" },
  
  // Norte
  { city: "Joinville", region: "Norte" },
  { city: "Jaraguá do Sul", region: "Norte" },
  { city: "São Bento do Sul", region: "Norte" },
  { city: "Mafra", region: "Norte" },
  
  // Litoral
  { city: "Itajaí", region: "Litoral" },
  { city: "Balneário Camboriú", region: "Litoral" },
  { city: "Penha", region: "Litoral" },
  { city: "Navegantes", region: "Litoral" },
  { city: "Porto Belo", region: "Litoral" },
  
  // Vale do Itajaí
  { city: "Blumenau", region: "Vale do Itajaí" },
  { city: "Brusque", region: "Vale do Itajaí" },
  { city: "Gaspar", region: "Vale do Itajaí" },
  { city: "Timbó", region: "Vale do Itajaí" },
  
  // Sul
  { city: "Criciúma", region: "Sul" },
  { city: "Tubarão", region: "Sul" },
  { city: "Araranguá", region: "Sul" },
  
  // Sudeste
  { city: "Florianópolis", region: "Sudeste" },
  { city: "São José", region: "Sudeste" },
  { city: "Palhoça", region: "Sudeste" }
];

export function getRegionByCity(city: string): Regional {
  const found = MUNICIPALITIES.find(m => m.city.toLowerCase() === city.toLowerCase().trim());
  return found ? found.region : "Oeste";
}

export function formatLocation(city: string, region: Regional): string {
  if (!city) return `Região ${region}`;
  return `${city}, Região ${region}`;
}
