import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limit for base64 images
  app.use(express.json({ limit: '50mb' }));

  // API Route for Gemini AI
  app.post('/api/solve', async (req, res) => {
    try {
      const { text, imageBase64 } = req.body;

      let contents = [];

      if (imageBase64) {
        // Extract base64 part and mime type
        const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const mimeType = matches[1];
          const base64Data = matches[2];
          contents.push({
            inlineData: {
              data: base64Data,
              mimeType: mimeType
            }
          });
        }
      }

      if (text) {
        contents.push(text);
      } else {
        contents.push("Por favor, resuelve este problema paso a paso. Es para un estudiante de Ingeniería de Alimentos de cálculo integral.");
      }

      const promptContext = `Eres el "Profe IA de Alimentos", un experto tutor de Cálculo Integral enfocado en estudiantes de Ingeniería de Alimentos de la plataforma del Ing. Luis Gomez.

REGLA CRÍTICA Y ABSOLUTA DE CONTENIDO:
Solo tienes permitido responder preguntas, resolver ejercicios o discutir conceptos relacionados de forma DIRECTA con el CÁLCULO INTEGRAL (integrales definidas, indefinidas, antiderivadas, métodos de integración como por partes, fracciones parciales, potencias trigonométricas, cálculo de áreas bajo la curva, volumen de sólidos de revolución, integrales impropias, etc.) aplicado a la Ingeniería de Alimentos.

Si la consulta del usuario, pregunta o imagen NO tiene relación directa con el cálculo integral o sus aplicaciones (por ejemplo, si te pide recetas de cocina, programar código web general, tareas de otras materias como biología sin integrales, o preguntas casuales no académicas), debes denegar amablemente la consulta con la siguiente respuesta exacta:
"¡Hola! Como tutor especializado del curso del Ing. Luis Gomez, mi programación y asistencia están restringidas exclusivamente al **Cálculo Integral** aplicado a procesos de alimentos. Por favor, sube un problema o realiza una consulta que involucre integrales, antiderivadas, áreas bajo la curva o modelación de volúmenes de revolución para poder ayudarte paso a paso."

Para consultas válidas de Cálculo Integral:
1. Proporciona soluciones EXPLICADAS PASO A PASO de forma muy detallada, didáctica y clara.
2. Usa un tono ameno, motivador e interactivo (estilo Duolingo).
3. Formatea TODAS las expresiones matemáticas usando sintaxis LaTeX entre signos de dólar simples ($...$) para matemáticas en línea y dobles ($$...$$) para matemáticas en bloque.
4. Contextualiza los ejemplos en procesos alimenticios (balances de masa acumulativos, pasteurización térmica, secado, fermentación, etc.).

Aquí tienes la consulta del usuario:\n\n`;

      if (contents.length > 0 && typeof contents[0] === 'string') {
          contents[0] = promptContext + contents[0];
      } else {
          contents.unshift(promptContext);
      }


      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
      });

      res.json({ result: response.text });
    } catch (error) {
      console.error('Error generating content:', error);
      res.status(500).json({ error: 'Failed to generate solution' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Catch-all route for React router or SPA fallback
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
