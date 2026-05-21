// ============================================================
// WORKER de detección de lives — Plataforma
// Corre en Railway, siempre encendido.
// Cada 5 min chequea los 99 canales (RSS + videos.list)
// y expone el resultado en una URL para que la app lo lea.
// ============================================================

const http = require('http');

// --- Los 99 canales ---
const CANALES = [
  { id: 'luzu', nombre: 'Luzu TV', youtubeId: 'UCTHaNTsP7hsVgBxARZTuajw' },
  { id: 'olga', nombre: 'Olga', youtubeId: 'UC7mJ2EDXFomeDIRFu5FtEbA' },
  { id: 'lacasa', nombre: 'La Casa Streaming', youtubeId: 'UC4u0BhsSi33PS20_1JHiC5A' },
  { id: 'blender', nombre: 'Blender', youtubeId: 'UC6pJGaMdx5Ter_8zYbLoRgA' },
  { id: 'vorterix', nombre: 'Vorterix', youtubeId: 'UCvCTWHCbBC0b9UIeLeNs8ug' },
  { id: 'gelatina', nombre: 'Gelatina', youtubeId: 'UCWSfXECGo1qK_H7SXRaUSMg' },
  { id: 'azz', nombre: 'Azz', youtubeId: 'UCgLBmUFPO8JtZ1nPIBQGMlQ' },
  { id: 'picado', nombre: 'Picado TV', youtubeId: 'UC9ghrLcpy0FxDFssie-siwQ' },
  { id: 'carnaval', nombre: 'Carnaval', youtubeId: 'UCRtgbxUH456ox51IswIQgZQ' },
  { id: 'bondi', nombre: 'Bondi', youtubeId: 'UCnZidingmuqNkaT9Wm64Xxg' },
  { id: 'resumido', nombre: 'Resumido TV', youtubeId: 'UCV7c9y3uWckx0kyXSHhKJXw' },
  { id: 'telefe', nombre: 'Telefe Stream', youtubeId: 'UCHc3el42hXKKhjs_1vzWk9A' },
  { id: 'futurock', nombre: 'Futurock', youtubeId: 'UCgn6r0aGRBnEQm02tE_jzbw' },
  { id: 'carajo', nombre: 'Carajo', youtubeId: 'UC4mdhKZXjrKoq5aVG6juHEg' },
  { id: 'dgo', nombre: 'DGO', youtubeId: 'UCqxBNDHmEZgqU1B61oc-QhQ' },
  { id: 'tvpublica', nombre: 'TV Pública', youtubeId: 'UCs231K71Bnu5295_x0MB5Pg' },
  { id: 'eltrece', nombre: 'El Trece', youtubeId: 'UC0DM_mHV2u6dj8ig51GkQwg' },
  { id: 'elnueve', nombre: 'El Nueve', youtubeId: 'UCUT4NmGqjrVpKf2JyiS_bbA' },
  { id: 'america', nombre: 'América TV', youtubeId: 'UC6NVDkuzY2exMOVFw4i9oHw' },
  { id: 'granhermano', nombre: 'Gran Hermano', youtubeId: 'UCFAiSCNaJnizLNIF1aSkQAQ' },
  { id: 'urbanaplay', nombre: 'Urbana Play', youtubeId: 'UCC1kfsMJko54AqxtcFECt-A' },
  { id: 'radioconvos', nombre: 'Radio con Vos', youtubeId: 'UCxDteokWBemJvLI_I0VUGdA' },
  { id: 'pop', nombre: 'Pop Radio', youtubeId: 'UCtc_WjDRwCrZSEq2WEwD7XQ' },
  { id: 'la100', nombre: 'Radio La 100', youtubeId: 'UC2zO2jZCDplwm8SVsXUcxCQ' },
  { id: 'rock', nombre: 'Rock and Pop Radio', youtubeId: 'UCAlQ5f7mhnkfM6jjXeJDw7g' },
  { id: 'canalciudad', nombre: 'Canal de la Ciudad', youtubeId: 'UCOV_Vx1baZJY9Tfvgm-UI3w' },
  { id: 'ahoraplay', nombre: 'Ahora Play', youtubeId: 'UCRyGJcJYqqiCByEaUhDLMsw' },
  { id: 'jotas', nombre: 'Jotax', youtubeId: 'UCORLLKqtzdHxZrvo5XlnTTw' },
  { id: 'magazine', nombre: 'Ciudad Magazine', youtubeId: 'UCr73PvhsxV8RCuzM60bSVwA' },
  { id: 'lafabrica', nombre: 'La fabrica del podcast', youtubeId: 'UCDFajagyC0Rq7l5mRSdUnIA' },
  { id: 'infobae', nombre: 'Infobae', youtubeId: 'UCvsU0EGXN7Su7MfNqcTGNHg' },
  { id: 'eldestape', nombre: 'El Destape', youtubeId: 'UC5wAqJ9NF0fpGH9dVf3h6HA' },
  { id: 'ciudadano', nombre: 'Ciudadano News', youtubeId: 'UCQAipKT9ZTsqlN0PGoWVMqA' },
  { id: 'neura', nombre: 'Neura', youtubeId: 'UC-40U87JsevMIMn7PMw4jPw' },
  { id: 'cenital', nombre: 'Cenital', youtubeId: 'UCxHSIJgKZ8xVXwLGaGZEmKg' },
  { id: 'c5n', nombre: 'C5N', youtubeId: 'UCFgk2Q2mVO1BklRQhSv6p0w' },
  { id: 'tn', nombre: 'TN', youtubeId: 'UCj6PcyLvpnIRT_2W_mwa9Aw' },
  { id: 'a24', nombre: 'A24', youtubeId: 'UCR9120YBAqMfntqgRTKmkjQ' },
  { id: 'lanacion', nombre: 'La Nación', youtubeId: 'UCba3hpU7EFBSk817y9qZkiA' },
  { id: 'canal 26', nombre: 'Canal 26', youtubeId: 'UCrpMfcQNog595v5gAS-oUsQ' },
  { id: 'lared', nombre: 'Radio La red', youtubeId: 'UCs1U5lRXvUJHn0CgXI6oXAw' },
  { id: 'radio10', nombre: 'Radio 10', youtubeId: 'UCJozD5RVug7EZdTjqkGISYQ' },
  { id: 'mitre', nombre: 'Radio Mitre', youtubeId: 'UCYvINPByAdCcpA0sWrF3I_w' },
  { id: 'rivadavia', nombre: 'Radio Rivadavia', youtubeId: 'UCLAj5TzCrNbqe3LosSKHLcQ' },
  { id: 'observador', nombre: 'Radio El observador', youtubeId: 'UC-rI_XNppHJO-Ga4RW_CDKw' },
  { id: 'cadena', nombre: 'Cadena 3 Radio', youtubeId: 'UCNxohbqfDp8YxW_Mji2XMHA' },
  { id: 'nettv', nombre: 'Net Tv', youtubeId: 'UC8aY1r3sNj1nujEisGkxtyA' },
  { id: 'cronica', nombre: 'Crónica Tv', youtubeId: 'UCT7KFGv6s2a-rh2Jq8ZdM1g' },
  { id: 'elcronista', nombre: 'El Cronista', youtubeId: 'UCZi6C9-a4fYKiBoIuEJ80ZA' },
  { id: 'longobardi', nombre: 'Longobardi', youtubeId: 'UCi0YGKwQGE-r1GtEAgX1vwQ' },
  { id: 'btchina', nombre: 'BT China', youtubeId: 'UCCEGno1rNtkkkaQ30dA2RGw' },
  { id: 'revolución', nombre: 'Revolución Popular', youtubeId: 'UCY4SCn6o-5Oc1SRk2J-i1Gg' },
  { id: 'hispa', nombre: 'Hispa', youtubeId: 'UCMecJG9i_HHfhW_MK6hX92Q' },
  { id: 'telam', nombre: 'Télam', youtubeId: 'UCNyUm6fxPv-R5oh0fvQ63Hg' },
  { id: 'filo', nombre: 'Filo news', youtubeId: 'UC9vs8KujZ2kJ2hbg01fNRVw' },
  { id: 'border', nombre: 'Border periodismo', youtubeId: 'UC_J368jRtGUPIjl0NZzW0Sg' },
  { id: 'laizquierda', nombre: 'La Izquierda diario', youtubeId: 'UCOukkFXxzls-KcvtlgpiWEQ' },
  { id: 'diariok', nombre: 'Diario K', youtubeId: 'UCejrchmjNMt6j83Onqsi8wg' },
  { id: 'telesur', nombre: 'Telesur', youtubeId: 'UCZSdNK_ZmMQcLTz-obKr-Dw' },
  { id: 'cnn', nombre: 'CNN en español', youtubeId: 'UC_lEiu6917IJz03TnntWUaQ' },
  { id: '412', nombre: '412', youtubeId: 'UCD2w1rGcJc99akNKluz_FDw' },
  { id: 'olin', nombre: 'Olin', youtubeId: 'UC_2fOgXwJ93f_ywRzx4io7A' },
  { id: 'takawishi', nombre: 'Takawishi', youtubeId: 'UCA3bsVNKocV1QVwORh_fJpg' },
  { id: 'lacanchita', nombre: 'La canchita TV', youtubeId: 'UC9q9Wv6YpSTXb3yf5hCoVyA' },
  { id: 'lodelpollo', nombre: 'Lo del Pollo', youtubeId: 'UCTGVYzIiNShRKEZ0DKBIX7w' },
  { id: 'deportv', nombre: 'DeporTv', youtubeId: 'UCSmh3DFxBwFurMttT60PQ1g' },
  { id: 'espn', nombre: 'ESPN Fans', youtubeId: 'UCFmMw7yTuLTCuMhpZD5dVsg' },
  { id: 'tntsports', nombre: 'TNT Sports', youtubeId: 'UCI5RY8G0ar-hLIaUJvx58Lw' },
  { id: 'lpm', nombre: 'La Página Millonaria', youtubeId: 'UCCFy6nNa53k6NyFHTZrFHRw' },
  { id: 'pbj', nombre: 'Planeta Boca Junior', youtubeId: 'UCKLmFYyYG40mSkamRNcMXRw' },
  { id: 'unpocoderuido', nombre: 'Un poco de ruido', youtubeId: 'UCg6kTB4vw1XYFBR4TtHaBuQ' },
  { id: 'cuarteteando', nombre: 'Cuarteteando', youtubeId: 'UC6786bpkxmtqw2YgicH4g3A' },
  { id: 'cumbiatube', nombre: 'Cumbia Tube', youtubeId: 'UCVPpwGeA4np6EFi4HouLfzA' },
  { id: 'estoesfa', nombre: 'Esto es FA', youtubeId: 'UChJncJRqo10N4C5_sPKYskA' },
  { id: 'teloresumo', nombre: 'Te lo resumo', youtubeId: 'UCw7Bz6EHxlnOoBUBlJZCWCw' },
  { id: 'encuentro', nombre: 'Encuentro', youtubeId: 'UC1zLDoKL-eKmd_K7qkUZ-ow' },
  { id: 'canala', nombre: 'Canal a', youtubeId: 'UCMD1_5bMalSAPCir5kqtyQw' },
  { id: 'film', nombre: 'Film and Arts', youtubeId: 'UCeIqrl0IbefiT1dNF4ncJCQ' },
  { id: 'gourmet', nombre: 'El gourmet', youtubeId: 'UC1Lhubbf3BjYODUrugx-oeA' },
  { id: 'elgarage', nombre: 'El garage TV', youtubeId: 'UCdi6I36w_5hDNNLECwQjHlg' },
  { id: 'history', nombre: 'History Latinoamérica', youtubeId: 'UCVvwbez-BNlWvbxtpOx0MGQ' },
  { id: 'discovery', nombre: 'Discovery', youtubeId: 'UCcP6Vtkc2DtQ0IV9r_x6pCQ' },
  { id: 'natgeo', nombre: 'Natgeo en español', youtubeId: 'UCKVtMu6QLSEA528Li51ndPQ' },
  { id: 'Incognita', nombre: 'Incognita', youtubeId: 'UCef_WCjyolnGwRZEReZv7Rw' },
  { id: 'Supra pixel', nombre: 'Supra pixel', youtubeId: 'UCwGX2cE21VPBEJ49hcprP9w' },
  { id: 'Santiago Bilinkis', nombre: 'Santiago Bilinkis', youtubeId: 'UC5PwIMtLiIBCBhsu8f_-6UQ' },
  { id: 'lamano tecno', nombre: 'La mano tecno', youtubeId: 'UCfQuRsNYD1tpJsKO45eDgow' },
  { id: 'soydalto', nombre: 'Soy Dalto', youtubeId: 'UCtoo4_P6ilCj7jwa4FmA5lQ' },
  { id: 'ezemartinez', nombre: 'Eze Martinez', youtubeId: 'UCOWFKaCN-rzmYk502JFWnqg' },
  { id: 'El traductor', nombre: 'El traductor de Ingenieria', youtubeId: 'UCa6V1UVOXN4wDm7RDQDoa6g' },
  { id: 'ianlucas', nombre: 'Ian Lucas', youtubeId: 'UCmzDf_a7CCFuxos7hspcWRQ' },
  { id: 'martincirio', nombre: 'Martin Cirio', youtubeId: 'UCunKpj3RZOlrp1jpETmScWg' },
  { id: 'mernuel', nombre: 'Mernuel', youtubeId: 'UC7qgr9NTqrvNSQBSvycNEcA' },
  { id: 'paulina', nombre: 'Paulina Cocina', youtubeId: 'UCpNbMDNc_GXApuxL4aHjSsA' },
  { id: 'locos', nombre: 'Locos x el asado', youtubeId: 'UCMb_jTYA_oFqJVJneNUH0Zg' },
  { id: 'coroniti', nombre: 'Coroniti', youtubeId: 'UCDb1n1Z_rrmMcfqt5QPNUNw' },
  { id: 'carrozza', nombre: 'Carrozza', youtubeId: 'UCkJ9KX7nw-4rpyuVCRy2R-g' },
  { id: 'davoo', nombre: 'Davoo Xeneize', youtubeId: 'UCl3OQ6isZRyNDHjYOhUjYnw' },
  { id: 'coscu', nombre: 'Coscu', youtubeId: 'UCvZ0P9-EmGz6SFUuFiZPXKw' },
];

// --- Config ---
const API_KEY = process.env.YOUTUBE_API_KEY;
const INTERVALO_MS = 5 * 60 * 1000; // cada 5 minutos
const PORT = process.env.PORT || 3000;

// Estado en memoria (lo que expone el worker)
let estado = {
  actualizado: null,
  enVivo: {}, // { youtubeId: { enVivo, videoId, titulo, thumbnail } }
};

// --- Extraer videoIds del RSS ---
function extractVideoIds(xml) {
  const matches = xml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/g);
  if (!matches) return [];
  return matches.slice(0, 3).map((m) => m.replace(/<yt:videoId>|<\/yt:videoId>/g, ''));
}

// --- RSS de un canal ---
async function getVideoIds(channelId) {
  try {
    const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return { channelId, videoIds: [] };
    const xml = await res.text();
    return { channelId, videoIds: extractVideoIds(xml) };
  } catch {
    return { channelId, videoIds: [] };
  }
}

// --- videos.list para confirmar lives (1 unidad por batch de 50) ---
async function getLiveStatus(videoIds) {
  const liveMap = new Map();
  if (videoIds.length === 0) return liveMap;

  const BATCH = 50;
  for (let i = 0; i < videoIds.length; i += BATCH) {
    const batch = videoIds.slice(i, i + BATCH);
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails&id=${batch.join(',')}&key=${API_KEY}`;
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
      const data = await res.json();
      if (data.error) {
        console.error('Error videos.list:', JSON.stringify(data.error.errors || data.error));
        continue;
      }
      for (const item of data.items || []) {
        const snippet = item.snippet || {};
        const live = item.liveStreamingDetails;
        const esLive = snippet.liveBroadcastContent === 'live' && live && !live.actualEndTime;
        if (esLive) {
          liveMap.set(item.id, {
            titulo: snippet.title || '',
            thumbnail:
              snippet.thumbnails?.high?.url ||
              snippet.thumbnails?.medium?.url ||
              `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`,
          });
        }
      }
    } catch (err) {
      console.error('Error fetch videos.list:', String(err));
    }
  }
  return liveMap;
}

// --- Ciclo de chequeo completo ---
async function chequear() {
  const inicio = Date.now();
  console.log(`[${new Date().toISOString()}] Iniciando chequeo de ${CANALES.length} canales...`);

  if (!API_KEY) {
    console.error('FALTA YOUTUBE_API_KEY. Configurala en Railway.');
    return;
  }

  try {
    // Paso 1: RSS de los 99 (en tandas de 20 para no saturar)
    const rssResults = [];
    const TANDA = 20;
    for (let i = 0; i < CANALES.length; i += TANDA) {
      const grupo = CANALES.slice(i, i + TANDA);
      const res = await Promise.all(grupo.map((c) => getVideoIds(c.youtubeId)));
      rssResults.push(...res);
    }

    // Juntar todos los videoIds
    const todosLosVideoIds = [];
    for (const r of rssResults) {
      for (const vid of r.videoIds) todosLosVideoIds.push(vid);
    }

    // Paso 2: confirmar lives
    const liveVideos = await getLiveStatus(todosLosVideoIds);

    // Paso 3: armar estado por canal
    const nuevoEnVivo = {};
    let cantEnVivo = 0;
    for (const canal of CANALES) {
      const rss = rssResults.find((r) => r.channelId === canal.youtubeId);
      const videoIds = rss?.videoIds || [];
      let detectado = false;
      for (const vid of videoIds) {
        const info = liveVideos.get(vid);
        if (info) {
          nuevoEnVivo[canal.youtubeId] = {
            enVivo: true,
            videoId: vid,
            titulo: info.titulo,
            thumbnail: info.thumbnail,
          };
          detectado = true;
          cantEnVivo++;
          break;
        }
      }
      if (!detectado) {
        nuevoEnVivo[canal.youtubeId] = { enVivo: false };
      }
    }

    estado = { actualizado: new Date().toISOString(), enVivo: nuevoEnVivo };
    const dur = ((Date.now() - inicio) / 1000).toFixed(1);
    console.log(`[OK] ${cantEnVivo} en vivo de ${CANALES.length}. Duró ${dur}s. VideoIds chequeados: ${todosLosVideoIds.length}`);
  } catch (err) {
    console.error('Error en chequeo:', String(err));
  }
}

// --- Servidor HTTP que expone el estado ---
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.url === '/status' || req.url === '/') {
    res.writeHead(200);
    res.end(JSON.stringify(estado));
  } else if (req.url === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ ok: true, actualizado: estado.actualizado }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Worker corriendo en puerto ${PORT}`);
  chequear(); // primer chequeo inmediato
  setInterval(chequear, INTERVALO_MS); // y cada 5 min
});
