/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Ensure Gemini Client is initialized safely
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    if (!apiKey) {
      console.warn('GEMINI_API_KEY environment variable is not defined. AI Assistant will operate in dry-run mode.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || 'DUMMY_KEY',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // In-memory mock database for active active order tracking
  const activeOrders: Record<string, any> = {};

  // Health endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // POST endpoint: Place a cinema snack order
  app.post('/api/orders', (req, res) => {
    const { customerName, customerPhone, studioNumber, seatRow, seatNumber, movieTitle, items, subtotal, deliveryFee, tax, total, paymentMethod } = req.body;

    if (!customerName || !studioNumber || !seatRow || !seatNumber || !items || items.length === 0) {
      return res.status(400).json({ error: 'Data pesanan tidak lengkap Pelanggan, Studio, Kursi, dan Item wajib diisi.' });
    }

    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder = {
      id: orderId,
      customerName,
      customerPhone: customerPhone || '-',
      studioNumber,
      seatRow,
      seatNumber,
      movieTitle: movieTitle || 'Film Sedang Berlangsung',
      items,
      subtotal: Number(subtotal),
      deliveryFee: Number(deliveryFee),
      tax: Number(tax),
      total: Number(total),
      paymentMethod: paymentMethod || 'Dana',
      status: 'Received',
      createdAt: new Date().toISOString(),
    };

    activeOrders[orderId] = newOrder;

    res.status(201).json(newOrder);
  });

  // GET endpoint: Get order tracking status details
  app.get('/api/orders/:id', (req, res) => {
    const orderId = req.params.id;
    const order = activeOrders[orderId];

    if (!order) {
      return res.status(404).json({ error: 'Pesanan tidak ditemukan' });
    }

    // Simulate progress of the order based on elapsed time (for interactive dynamic tracking)
    const elapsedSeconds = (new Date().getTime() - new Date(order.createdAt).getTime()) / 1000;
    
    if (order.status !== 'Delivered') {
      if (elapsedSeconds > 120) {
        order.status = 'Delivered';
      } else if (elapsedSeconds > 60) {
        order.status = 'In_Transit';
      } else if (elapsedSeconds > 25) {
        order.status = 'Preparing';
      }
    }

    res.json(order);
  });

  // POST endpoint: AI Snack Recommender & Concession Butler (Gemini API)
  app.post('/api/ai/recommend', async (req, res) => {
    const { movieTitle, genre, mood, userMessage, chatHistory } = req.body;

    // Check if API Key is configured. If not, generate a solid mock intelligence response
    if (!apiKey) {
      // Elegant fallback response if user hasn't added API Key
      const replies = [
        "Halo Kak! Karena Anda sedang menonton film bergenre Horor/Misteri, saya sangat menyarankan *Combo Horor Jantungan* (Popcorn Salted Butter besar dan Nachos Keju). Rasanya gurih mantap dan siap temani Anda terkejut! Mau saya masukkan ke keranjang?",
        "Selamat menonton Kak! Menonton Komedi Romantis paling asyik ditemani *Combo Bucin Romantis* (Popcorn Mix Caramel+Salted Besar dengan dua Milo Dinosaur dingin). Manisnya pas, cocok dinikmati berdua. Mau langsung ditambahkan?",
        "Hai Kak! Butuh kesegaran ekstra di dalam studio yang dingin? Saya sarankan memesan *Gourmet Crispy Nachos* gurih dengan *Ice Coca-Cola* dingin segar untuk mengembalikan semangat Anda. Siap antar ke kursi segera!"
      ];
      const items = ['p-combo1', 'p1', 'p4', 'p8'];
      const chosenReply = replies[Math.floor(Math.random() * replies.length)];
      
      return res.json({
        reply: `${chosenReply}\n\n*(Catatan: Mode Simulasi Offline karena kunci API Gemini belum dikonfigurasi di panel Secrets)*`,
        suggestedItemIds: [items[Math.floor(Math.random() * items.length)], 'p1']
      });
    }

    try {
      const client = getGeminiClient();

      // Formulate complete context instruction
      const systemInstruction = `Anda adalah "CineBites Butler", seorang asisten/pelayan bioskop AI yang sangat ramah, sopan, dan sigap membantu penonton memesan makanan & minuman hangat yang lezat langsung dari kursi mereka di dalam bioskop gelap.
Tugas utama Anda adalah merekomendasikan menu concession makanan/minuman yang sesuai dengan film yang ditonton, genre, suasana hati (mood), atau request khusus penonton.

BERIKUT DAFTAR MENU KAMI YANG VALID:
- p1: Popcorn Sweet Caramel (Rp 48.000) - Manis renyah premium
- p2: Popcorn Salted Butter (Rp 42.000) - Klasik masakan mentega gurih
- p3: Popcorn Mix Duo Mix (Rp 55.000) - Mix Caramel & Salted (Besar)
- p4: Gourmet Crispy Nachos (Rp 45.000) - Tortilla jagung gurih dengan saus keju hangat & jalapeno
- p5: Jumbo Beef Hot Dog (Rp 49.000) - Roti hotdog + sosis jumbo panggang tebal
- p6: French Fries Premium (Rp 38.000) - Kentang goreng renyah rosemary salt
- p7: Coca-Cola (Rp 25.000) - Dingin menyegarkan, ada original & zero
- p8: Milo Dinosaur Jumbo (Rp 32.000) - Cokelat pekat dingin dengan taburan bubuk milo melimpah
- p9: Iced Green Tea Latte (Rp 29.000) - Matcha menenangkan manis lembut
- p10: Mineral Water (Prima) (Rp 15.000) - Segar dingin penawar dahaga
- p-combo1: Combo Horor Jantungan (Rp 99.000) - Popcorn Salted Large + Gourmet Nachos + 2 Ice Cola Medium
- p-combo2: Combo Detektif Cerdas (Rp 89.000) - Popcorn Caramel Large + Jumbo Beef Hot Dog + 1 Iced Milo Dino Large
- p-combo3: Combo Bucin Romantis (Rp 115.000) - Popcorn Mix Duo Large + 2 Milo Dinosaur Jumbo (porsi sharing manis)

ATURAN DAN GAYA BERKOMUNIKASI:
1. Senantiasa gunakan bahasa Indonesia yang sangat santun, bersahabat, penuh hormat, menyapa user dengan ganteng/cantik/Kakak/Kak.
2. Jaga jawaban Anda tetap padat, ringkas, dan nyaman dibaca cepat lewat layar ponsel di studio bioskop yang gelap (gunakan markdown, bullets, jangan terlalu panjang atau bertele-tele).
3. Berikan alasan tematik yang menarik mengapa menu tersebut cocok (misal: "Untuk bioskop horor seperti Siksa Kubur, saya rekomendasikan Combo Horor Jantungan karena popcorn gurih asin besar sangat nyaman dicengkeram saat adegan jumpscare menegangkan!").
4. Anda harus mencantumkan minimal 1 atau maksimal 3 ID menu terpilih dalam field "suggestedItemIds" yang berupa array string yang cocok dengan rekomendasi Anda. Gunakan kode ID yang valid dari daftar di atas (misal: ["p-combo1", "p4"]).
5. Anda WAJIB memberikan respon dalam format JSON sesuai schema yang didefinisikan demi konsistensi data.`;

      // Build chat prompt sequence or direct text prompt including history
      let prompt = `User sedang berdiskusi mencari kombinasi snack bioskop terbaik.\n`;
      if (movieTitle) prompt += `- Sedang menonton Film: "${movieTitle}" (${genre || 'Genre Umum'})\n`;
      if (mood) prompt += `- Suasana Hati / Preferensi: "${mood}"\n`;
      if (userMessage) prompt += `- Pesan atau Request Khusus: "${userMessage}"\n`;

      if (chatHistory && chatHistory.length > 0) {
        prompt += `\nRiwayat percakapan sebelumnya:\n`;
        chatHistory.forEach((msg: any) => {
          prompt += `${msg.sender === 'user' ? 'Penonton' : 'Asisten'}: ${msg.text}\n`;
        });
        prompt += `\nPenonton bertanya lagi: "${userMessage || 'Berikan anjuran terbaik sesuai film saya'}"`;
      }

      const response = await client.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: {
                type: Type.STRING,
                description: 'Jawaban ramah santun dalam bahasa Indonesia, memberi rekomendasi snack dengan visualisasi bullet points yang bersih.'
              },
              suggestedItemIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Array of concession product IDs recommended (e.g. ["p-combo1", "p4"])'
              }
            },
            required: ['reply', 'suggestedItemIds']
          }
        }
      });

      const responseText = response.text || '';
      try {
        const parsed = JSON.parse(responseText.trim());
        res.json(parsed);
      } catch (err) {
        console.error('Failed to parse JSON response from Gemini:', responseText, err);
        res.json({
          reply: responseText || "Maaf Kak, asisten CineBites kesusahan mengambil daftar menu saat ini. Popcorn Caramel Manis (p1) adalah pilihan terpopuler kami yang sangat lezat!",
          suggestedItemIds: ['p1']
        });
      }
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      res.status(500).json({
        error: 'Terjadi kegagalan komunikasi dengan asisten AI bioskop.',
        details: error.message,
        reply: 'Mohon maaf Kak, sinyal di dalam pemutaran bioskop sedikit terganggu. Rekomendasi hangat kami: *Combo Bucin Romantis* (p-combo3) siap meramaikan tontonan seru Anda segera!',
        suggestedItemIds: ['p-combo3']
      });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CineDine Backend] Running on http://localhost:${PORT}`);
  });
}

startServer();
