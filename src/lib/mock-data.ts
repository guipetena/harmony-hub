import m1 from "@/assets/musician-1.jpg";
import m2 from "@/assets/musician-2.jpg";
import m3 from "@/assets/musician-3.jpg";
import m4 from "@/assets/musician-4.jpg";
import m5 from "@/assets/musician-5.jpg";
import m6 from "@/assets/musician-6.jpg";

export type MusicianType = "Solo" | "Dupla" | "Banda";

export interface Musician {
  id: string;
  slug: string;
  artistName: string;
  type: MusicianType;
  members: number;
  city: string;
  state: string;
  styles: string[];
  priceMin: number;
  priceMax: number;
  rating: number;
  reviewsCount: number;
  available: boolean;
  shortBio: string;
  longBio: string;
  image: string;
  banner: string;
  whatsapp: string;
  gallery: string[];
  videoThumb: string;
}

export const STYLES = [
  "MPB", "Sertanejo", "Pop/Rock", "Pagode", "Samba", "Jazz",
  "Bossa Nova", "Acústico", "Forró", "Eletrônica", "Gospel", "Indie",
];

export const CITIES = [
  "São Paulo, SP", "Rio de Janeiro, RJ", "Belo Horizonte, MG",
  "Curitiba, PR", "Porto Alegre, RS", "Salvador, BA", "Recife, PE",
];

export const musicians: Musician[] = [
  {
    id: "1", slug: "luana-prado",
    artistName: "Luana Prado",
    type: "Solo", members: 1,
    city: "São Paulo", state: "SP",
    styles: ["MPB", "Bossa Nova", "Acústico"],
    priceMin: 600, priceMax: 1200,
    rating: 4.9, reviewsCount: 87,
    available: true,
    shortBio: "Voz suave para jantares e eventos íntimos.",
    longBio: "Cantora há 8 anos, especializada em MPB e Bossa Nova. Repertório versátil de Tom Jobim a Adele, ideal para restaurantes, casamentos e eventos corporativos.",
    image: m1, banner: m1,
    whatsapp: "5511999990001",
    gallery: [m1, m4, m2],
    videoThumb: m1,
  },
  {
    id: "2", slug: "duo-violeiro",
    artistName: "Duo Violeiro",
    type: "Dupla", members: 2,
    city: "Curitiba", state: "PR",
    styles: ["Acústico", "Pop/Rock", "MPB"],
    priceMin: 900, priceMax: 1800,
    rating: 4.8, reviewsCount: 132,
    available: true,
    shortBio: "Acústico envolvente para bares e pubs.",
    longBio: "Dupla acústica com mais de 400 shows realizados. Repertório de pop nacional e internacional, perfeito para a vibe de bar.",
    image: m2, banner: m2,
    whatsapp: "5541999990002",
    gallery: [m2, m3, m1],
    videoThumb: m2,
  },
  {
    id: "3", slug: "banda-noturna",
    artistName: "Banda Noturna",
    type: "Banda", members: 4,
    city: "Rio de Janeiro", state: "RJ",
    styles: ["Pop/Rock", "Indie"],
    priceMin: 2500, priceMax: 5000,
    rating: 4.7, reviewsCount: 64,
    available: false,
    shortBio: "Energia indie rock para festas e festivais.",
    longBio: "Banda autoral e cover, sonoridade indie rock com presença de palco. Estrutura completa de som e iluminação.",
    image: m3, banner: m3,
    whatsapp: "5521999990003",
    gallery: [m3, m4, m5],
    videoThumb: m3,
  },
  {
    id: "4", slug: "marcus-blue",
    artistName: "Marcus Blue",
    type: "Solo", members: 1,
    city: "Belo Horizonte", state: "MG",
    styles: ["Jazz", "Bossa Nova"],
    priceMin: 800, priceMax: 1600,
    rating: 5.0, reviewsCount: 41,
    available: true,
    shortBio: "Crooner de jazz com presença marcante.",
    longBio: "Crooner especialista em standards de jazz, com formação clássica. Atende eventos sofisticados, hotéis e bares premium.",
    image: m4, banner: m4,
    whatsapp: "5531999990004",
    gallery: [m4, m1, m2],
    videoThumb: m4,
  },
  {
    id: "5", slug: "grupo-batuque",
    artistName: "Grupo Batuque",
    type: "Banda", members: 5,
    city: "Salvador", state: "BA",
    styles: ["Samba", "Pagode", "Forró"],
    priceMin: 1800, priceMax: 3500,
    rating: 4.9, reviewsCount: 210,
    available: true,
    shortBio: "Samba e pagode para colocar todo mundo pra dançar.",
    longBio: "Grupo de samba e pagode com 7 anos de estrada. Repertório do partido alto ao pagode dos anos 90/2000.",
    image: m5, banner: m5,
    whatsapp: "5571999990005",
    gallery: [m5, m3, m6],
    videoThumb: m5,
  },
  {
    id: "6", slug: "isa-campos",
    artistName: "Isa Campos",
    type: "Solo", members: 1,
    city: "Porto Alegre", state: "RS",
    styles: ["Sertanejo", "Acústico"],
    priceMin: 700, priceMax: 1400,
    rating: 4.8, reviewsCount: 96,
    available: true,
    shortBio: "Sertanejo acústico para todo tipo de evento.",
    longBio: "Voz e violão com repertório sertanejo universitário, raiz e MPB. Atende eventos sociais, casamentos e bares.",
    image: m6, banner: m6,
    whatsapp: "5551999990006",
    gallery: [m6, m1, m2],
    videoThumb: m6,
  },
];

export const testimonials = [
  {
    name: "Carla Mendes",
    role: "Proprietária — Bar do Lago",
    quote: "Encontrei um duo incrível em menos de 10 minutos. As noites de quinta nunca mais foram as mesmas.",
    avatar: m1,
  },
  {
    name: "Rodrigo Alves",
    role: "Cantor solo",
    quote: "Triplicou minha agenda em 2 meses. A plataforma me deu visibilidade que eu não tinha.",
    avatar: m4,
  },
  {
    name: "Marina Costa",
    role: "Eventos — Hotel Costeira",
    quote: "Profissionalismo do início ao fim. Hoje fechamos shows direto pelo WhatsApp da plataforma.",
    avatar: m2,
  },
];

export function whatsappLink(phone: string, artistName: string) {
  const text = encodeURIComponent(
    `Olá ${artistName}! Encontrei seu perfil no FindSinger e gostaria de solicitar um orçamento.`
  );
  return `https://wa.me/${phone}?text=${text}`;
}

export function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
}
