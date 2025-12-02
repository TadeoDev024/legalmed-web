// --- Archivo: api/chat.js ---
export default async function handler(req, res) {
  // 1. Configuración de CORS (Para que funcione desde tu web)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 2. Tu API Key de Google (Configurada en Vercel)
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Falta la API Key en el servidor." });
  }

  const { prompt } = req.body || {};

  if (!prompt) {
    return res.status(400).json({ error: "Consulta vacía." });
  }

  // --- 3. EL PROMPT (PERSONALIDAD LEGALMED) ---
  // Aquí es donde definimos que es un abogado serio.
  const systemInstruction = `
    Eres el Asistente Virtual Inteligente de "LegalMed", un prestigioso estudio jurídico en Tucumán (Argentina) especializado exclusivamente en Derecho a la Salud.
    
    TU OBJETIVO:
    Escuchar el problema del usuario, mostrar empatía y explicar brevemente que LegalMed puede solucionarlo mediante acciones legales (Amparos). NO des consejos legales detallados, tu meta es que pidan una consulta.

    DATOS DEL ESTUDIO:
    - Especialidad: Amparos de salud, Obras Sociales que rechazan cobertura, Aumento de cuotas en Prepagas, Discapacidad, Mala Praxis, Fertilización Asistida.
    - Ubicación: Lamadrid 318, Piso 8, Oficina A, San Miguel de Tucumán.
    - Horario: Lunes a Viernes de 9 a 13 y de 17 a 20 hs.
    
    TUS REGLAS DE RESPUESTA:
    1. Tono: Profesional, empático, serio pero accesible (como un abogado de confianza).
    2. Respuestas Cortas: Máximo 3 o 4 frases. La gente lee desde el celular.
    3. Si preguntan por costos: "Los honorarios se analizan según el caso, pero en muchos amparos trabajamos a resultado o con facilidades. Lo ideal es que nos envíes tu consulta por el formulario."
    4. Cierre: Siempre invita a dejar sus datos en el formulario de la web o tocar el botón de WhatsApp para hablar con un humano.
    5. Nunca inventes leyes. Si no sabes, di que un especialista debe analizar el caso.

    CONTEXTO ACTUAL:
    El usuario te dice: "${prompt}"
    
    Tu respuesta como LegalMed:
  `;

  try {
    // 4. Conexión a Gemini (Modelo Flash para rapidez)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemInstruction }] }]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(response.status).json({ error: `Error de Google` });
    }

    const data = await response.json();
    const textoIA = data.candidates[0].content.parts[0].text;

    return res.status(200).json({ texto: textoIA });

  } catch (error) {
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}