/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Movie, Product } from './types';

export const MOVIES: Movie[] = [
  {
    id: 'm1',
    title: 'Siksa Kubur',
    genre: 'Religi Horor, Thriller',
    duration: '117 Menit',
    rating: 'D17+',
    synopsis: 'Setelah kedua orang tuanya menjadi korban bom bunuh diri, Sita menjadi tidak percaya agama dan bertekad mencari orang paling berdosa. Saat orang itu meninggal, Sita ingin ikut masuk ke dalam kuburnya untuk membuktikan bahwa Siksa Kubur itu tidak ada. Namun, ada konsekuensi mengerikan bagi mereka yang tidak percaya.',
    posterUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=400' // Dark atmospheric grave/gate feel
  },
  {
    id: 'm2',
    title: 'KKN di Desa Penari',
    genre: 'Horor, Misteri',
    duration: '130 Menit',
    rating: 'R13+',
    synopsis: 'Enam mahasiswa yang melaksanakan KKN di sebuah desa terpencil diperingatkan untuk tidak melewati batas gapura terlarang. Namun, satu per satu dari mereka mulai merasakan keanehan, dan pelanggaran fatal membawa mereka ke dalam cengkeraman penari mistis yang menguasai desa tersebut.',
    posterUrl: 'https://images.unsplash.com/photo-1505635552518-3448ff116af3?auto=format&fit=crop&q=80&w=400' // Dark mystical forest
  },
  {
    id: 'm3',
    title: 'Gundala: Negeri ini Butuh Patriot',
    genre: 'Aksi, Sci-Fi, Superhero',
    duration: '123 Menit',
    rating: 'R13+',
    synopsis: 'Sancaka hidup di jalanan sejak ditinggal orang tuanya. Menghadapi dunia yang keras, ia belajar untuk bertahan hidup dengan tidak mencampuri urusan orang lain. Namun ketika keadaan kota makin tidak aman dan ketidakadilan merajalela, Sancaka harus memilih: tetap hidup aman sendiri atau keluar sebagai Gundala, patriot pelindung rakyat.',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=400' // Lightning, storm, superhero feel
  },
  {
    id: 'm4',
    title: 'Ada Apa Dengan Snack?',
    genre: 'Komedi, Romantis',
    duration: '105 Menit',
    rating: 'SU (Semua Umur)',
    synopsis: 'Dua orang asing yang tidak sengaja memesan paket popcorn yang sama di concession counter bioskop terlibat dalam debat lucu berujung cinta. Kisah romantis penuh tawa, camilan hangat, dan kesalahpahaman manis yang terjadi di sepanjang lorong bioskop.',
    posterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=400' // Classic cinema theater red seats
  },
  {
    id: 'm5',
    title: 'Sherlock Holmes: Misteri Teater Layar Lebar',
    genre: 'Detektif, Misteri, Aksi',
    duration: '135 Menit',
    rating: 'R13+',
    synopsis: 'Ketika sebuah film misterius diputar di bioskop kota London, penonton yang duduk di kursi baris F selalu menghilang secara gaib tepat di pertengahan adegan klimaks. Sherlock Holmes dan Dr. Watson menyamar sebagai penonton bioskop untuk memecahkan sandi ilusi sang pesulap gelap.',
    posterUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&q=80&w=400' // Cinema projector beam
  }
];

export const PRODUCTS: Product[] = [
  // POPCORN
  {
    id: 'p1',
    name: 'Popcorn Sweet Caramel',
    category: 'Popcorn',
    price: 48000,
    description: 'Popcorn mekar sempurna berbalut karamel manis premium yang renyah dan lumer di mulut. Menu wajib bioskop!',
    imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&q=80&w=300',
    popular: true,
    flavors: ['Karamel Manis'],
    sizes: ['Medium', 'Large']
  },
  {
    id: 'p2',
    name: 'Popcorn Salted Butter',
    category: 'Popcorn',
    price: 42000,
    description: 'Popcorn klasik dengan semburat mentega gurih beraroma harum yang asinnya pas di lidah.',
    imageUrl: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&q=80&w=300',
    flavors: ['Asin Gurih'],
    sizes: ['Medium', 'Large']
  },
  {
    id: 'p3',
    name: 'Popcorn Mix Duo Mix',
    category: 'Popcorn',
    price: 55000,
    description: 'Bimbang memilih? Nikmati perpaduan sempurna Popcorn Karamel Manis dan Salted Butter gurih dalam satu kemasan besar!',
    imageUrl: 'https://images.unsplash.com/photo-1612151855475-877969f4e6cc?auto=format&fit=crop&q=80&w=300',
    popular: true,
    flavors: ['Mix Caramel & Salted'],
    sizes: ['Large']
  },

  // SNACKS
  {
    id: 'p4',
    name: 'Gourmet Crispy Nachos',
    category: 'Snacks',
    price: 45000,
    description: 'Keripik tortilla jagung renyah yang disajikan lengkap dengan saus keju hangat yang kental dan potongan cabai jalapeno segar.',
    imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&q=80&w=300',
    popular: true
  },
  {
    id: 'p5',
    name: 'Jumbo Beef Hot Dog',
    category: 'Snacks',
    price: 49000,
    description: 'Roti hotdog empuk dengan sosis sapi jumbo panggang berkualitas tinggi, disiram saus mustard dan saus tomat pilihan.',
    imageUrl: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'p6',
    name: 'French Fries Premium',
    category: 'Snacks',
    price: 38000,
    description: 'Kentang goreng renyah bergaya Belgian Fries, ditaburi bumbu gurih rosemary salt yang menggugah selera.',
    imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&q=80&w=300'
  },

  // BEVERAGES
  {
    id: 'p7',
    name: 'Coca-Cola Zero Sugar / Regular',
    category: 'Beverages',
    price: 25000,
    description: 'Minuman soda berkarbonasi dingin menyegarkan dengan es batu kristal melimpah. Teman setia popcorn asin.',
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=300',
    flavors: ['Original (Regular)', 'Zero Sugar'],
    sizes: ['Medium', 'Large']
  },
  {
    id: 'p8',
    name: 'Milo Dinosaur Jumbo',
    category: 'Beverages',
    price: 32000,
    description: 'Minuman cokelat Milo dingin pekat legendaris yang manis, ditaburi dengan bubuk Milo melimpah di atasnya.',
    imageUrl: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&q=80&w=300',
    popular: true,
    sizes: ['Large']
  },
  {
    id: 'p9',
    name: 'Iced Green Tea Latte',
    category: 'Beverages',
    price: 29000,
    description: 'Teh hijau Jepang (Matcha) berkualitas yang diseduh dengan susu segar dingin, memberikan rasa menenangkan saat menonton.',
    imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&q=80&w=300',
    sizes: ['Medium']
  },
  {
    id: 'p10',
    name: 'Mineral Water (Prima)',
    category: 'Beverages',
    price: 15000,
    description: 'Air mineral murni dingin kemasan botol untuk menyegarkan tenggorokan Anda sepanjang pertunjukan.',
    imageUrl: 'https://images.unsplash.com/photo-1608885898957-a559228e8749?auto=format&fit=crop&q=80&w=300'
  },

  // COMBOS
  {
    id: 'p-combo1',
    name: 'Combo Horor Jantungan',
    category: 'Combos',
    price: 99000,
    description: 'Paket spesial film horor: 1 Popcorn Salted Large (untuk digenggam erat saat jumpscare) + 1 Gourmet Nachos + 2 Ice Coca-Cola Medium.',
    imageUrl: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=300',
    popular: true
  },
  {
    id: 'p-combo2',
    name: 'Combo Detektif Cerdas',
    category: 'Combos',
    price: 89000,
    description: 'Mengasah otak sambil menonton misteri: 1 Popcorn Caramel Large + 1 Jumbo Beef Hot Dog + 1 Iced Milo Dino Large.',
    imageUrl: 'https://images.unsplash.com/photo-1612151855475-877969f4e6cc?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'p-combo3',
    name: 'Combo Bucin Romantis',
    category: 'Combos',
    price: 115000,
    description: 'Didesain porsi sharing berdua: 1 Popcorn Mix Duo (Caramel + Salted) Large + 2 Milo Dinosaur Jumbo (Dua sedotan/cup!). Romantis hemat.',
    imageUrl: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&q=80&w=300',
    popular: true
  }
];
