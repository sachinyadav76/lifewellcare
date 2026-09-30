import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = '0.0.0.0';

// Available clinical departments & specialties for prompt grounding
const CLINICAL_CONTEXT = `
LifeWell Medical Center Clinical Departments and Specialists:
1. Cardiology & Heart Center (ID: cardiology)
   - Specialists: Dr. Arthur Sterling (Interventional), Dr. Elena Rostova (Electrophysiology), Dr. Julian Thorne (Preventive)
   - Keywords: heart, cardiac, chest pain, bp, blood pressure, dil, heart specialist, cholesterol

2. Dermatology & Skin Care (ID: dermatology)
   - Specialists: Dr. Sarah Sharma (Chief Dermatologist, Acne, Laser), Dr. Alena Roy (Pediatric & Cosmetic)
   - Keywords: skin, acne, pimples, rash, eczema, psoriasis, chamdi, twacha, skin doctor, Dr Sharma

3. Dental & Maxillofacial Care (ID: dental)
   - Specialists: Dr. Rajesh Sharma (Implantologist & Dental Surgeon), Dr. Anita Desai (Orthodontist, Braces, Aligners)
   - Keywords: teeth, toothache, cavity, dental, daant, gums, root canal, dental appointment, Dr Sharma

4. Neurology & Neurosurgery (ID: neurology)
   - Specialists: Dr. Evelyn Morales, Dr. Zachary Chen, Dr. Alistair Finch
   - Keywords: brain, headache, stroke, spine, seizure, numbness, dimag, sar dard, memory

5. Orthopedics & Joint Reconstruction (ID: orthopedics)
   - Specialists: Dr. James Callaghan, Dr. Sophia Bennett, Dr. David Okonjo
   - Keywords: bone, joint, knee, shoulder, fracture, haddi, arthritis, back pain, sports injury

6. Pediatrics & Neonatal Care (ID: pediatrics)
   - Specialists: Dr. Maya Lin-Siddiqui, Dr. Thomas Becker
   - Keywords: child, baby, infant, kids, baccha, vaccination, fever, growth

7. Comprehensive Cancer Center (ID: oncology)
   - Specialists: Dr. Robert Hensley, Dr. Cynthia Brooks
   - Keywords: cancer, tumor, chemotherapy, biopsy, oncology

8. Women's Health & Maternity (ID: womens-health)
   - Specialists: Dr. Nadia Farooq, Dr. Rachel Sterling
   - Keywords: pregnancy, gynae, maternity, women, period, pcos, delivery

9. Gastroenterology & Digestive Health (ID: gastroenterology)
   - Specialists: Dr. Marcus Vance, Dr. Sunita Kapoor
   - Keywords: stomach, gut, digestion, liver, acidity, pet dard, endoscopy
`;

/**
 * Intelligent Fallback NLP Parser when Gemini API key is missing or offline
 */
function handleLocalNLP(message: string) {
  const lower = message.toLowerCase();

  // Specialty / Department detection
  let detectedDept: string | undefined = undefined;
  let detectedSpecialty: string | undefined = undefined;
  let detectedDoctor: string | undefined = undefined;

  if (lower.includes('skin') || lower.includes('chamdi') || lower.includes('twacha') || lower.includes('derma') || lower.includes('pimple') || lower.includes('acne') || lower.includes('rash')) {
    detectedDept = 'dermatology';
    detectedSpecialty = 'Dermatology';
  } else if (lower.includes('heart') || lower.includes('dil') || lower.includes('cardio') || lower.includes('chest pain') || lower.includes('ecg')) {
    detectedDept = 'cardiology';
    detectedSpecialty = 'Cardiology';
  } else if (lower.includes('dental') || lower.includes('teeth') || lower.includes('tooth') || lower.includes('daant') || lower.includes('dentist') || lower.includes('cavity')) {
    detectedDept = 'dental';
    detectedSpecialty = 'Dental Care';
  } else if (lower.includes('brain') || lower.includes('neuro') || lower.includes('sar dard') || lower.includes('headache') || lower.includes('spine')) {
    detectedDept = 'neurology';
    detectedSpecialty = 'Neurology';
  } else if (lower.includes('bone') || lower.includes('ortho') || lower.includes('haddi') || lower.includes('knee') || lower.includes('joint') || lower.includes('fracture')) {
    detectedDept = 'orthopedics';
    detectedSpecialty = 'Orthopedics';
  } else if (lower.includes('child') || lower.includes('pediatric') || lower.includes('kid') || lower.includes('baccha') || lower.includes('baby')) {
    detectedDept = 'pediatrics';
    detectedSpecialty = 'Pediatrics';
  } else if (lower.includes('gastro') || lower.includes('stomach') || lower.includes('pet') || lower.includes('liver') || lower.includes('digest')) {
    detectedDept = 'gastroenterology';
    detectedSpecialty = 'Gastroenterology';
  } else if (lower.includes('women') || lower.includes('pregnancy') || lower.includes('gynae') || lower.includes('maternity')) {
    detectedDept = 'womens-health';
    detectedSpecialty = "Women's Health";
  }

  // Doctor name detection
  if (lower.includes('sharma')) {
    detectedDoctor = 'Sharma';
  } else if (lower.includes('sterling')) {
    detectedDoctor = 'Sterling';
  } else if (lower.includes('morales')) {
    detectedDoctor = 'Morales';
  } else if (lower.includes('callaghan')) {
    detectedDoctor = 'Callaghan';
  }

  // Date detection
  let detectedDate: string | undefined = undefined;
  const now = new Date();
  if (lower.includes('tomorrow') || lower.includes('kal')) {
    const d = new Date(now);
    d.setDate(d.getDate() + 1);
    detectedDate = d.toISOString().split('T')[0];
  } else if (lower.includes('today') || lower.includes('aaj')) {
    detectedDate = now.toISOString().split('T')[0];
  } else if (lower.includes('saturday') || lower.includes('shanivar')) {
    const currentDay = now.getDay();
    let diff = 6 - currentDay;
    if (diff <= 0) diff += 7;
    const d = new Date(now);
    d.setDate(d.getDate() + diff);
    detectedDate = d.toISOString().split('T')[0];
  }

  // Time range detection
  let timeRange: 'morning' | 'afternoon' | 'evening' | 'any' = 'any';
  if (lower.includes('evening') || lower.includes('shaam') || lower.includes('night') || lower.includes('5 pm') || lower.includes('6 pm')) {
    timeRange = 'evening';
  } else if (lower.includes('morning') || lower.includes('subah') || lower.includes('9 am') || lower.includes('10 am')) {
    timeRange = 'morning';
  } else if (lower.includes('afternoon') || lower.includes('dopahar') || lower.includes('2 pm')) {
    timeRange = 'afternoon';
  }

  // Generate empathetic response in user's language (Hindi / Hinglish / English)
  const isHindiOrHinglish = lower.includes('mujhe') || lower.includes('chahiye') || lower.includes('hai') || lower.includes('apne') || lower.includes('karo') || lower.includes('kal') || lower.includes('shaam') || lower.includes('aaj') || lower.includes('se');

  let reply = '';
  if (isHindiOrHinglish) {
    if (detectedSpecialty) {
      reply = `Main aapke liye ${detectedSpecialty} specialist ke available slots check kar raha hoon. Niche diye gaye doctors aur time slots me se apna pasandida slot chuniye.`;
    } else if (detectedDoctor) {
      reply = `Ji bilkul, Dr. ${detectedDoctor} ke schedule aur availability check ki ja rahi hai. Please niche time slot choose kijiye.`;
    } else {
      reply = `Namaste! Main LifeWell AI appointment assistant hoon. Aapko kis bimari ya specialty ke doctor se milna hai? Jaise ki Heart (Cardiology), Skin (Dermatology), Dental, ya Orthopedics.`;
    }
  } else {
    if (detectedSpecialty) {
      reply = `I'd be glad to help you connect with our ${detectedSpecialty} specialists. Checking real-time clinical schedules now...`;
    } else if (detectedDoctor) {
      reply = `Checking real-time appointment availability for Dr. ${detectedDoctor}...`;
    } else {
      reply = `Welcome to LifeWell Medical Center! I can help you find the right specialist and book your appointment. What type of doctor or care are you looking for today?`;
    }
  }

  return {
    reply,
    departmentId: detectedDept,
    specialty: detectedSpecialty,
    doctorName: detectedDoctor,
    date: detectedDate,
    timeRange
  };
}

// POST: /api/ai-assistant
app.post('/api/ai-assistant', async (req, res) => {
  try {
    const { message, conversationHistory, patientContext } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message text is required' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Execute local high-accuracy NLP parser
      const localResult = handleLocalNLP(message);
      res.json({
        source: 'local-assistant',
        ...localResult
      });
      return;
    }

    // Call Gemini API via @google/genai SDK
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const systemInstruction = `
You are "LifeWell AI", the empathetic, professional, and intelligent appointment assistant for LifeWell Medical Center.
Your purpose is to guide patients smoothly through finding doctors, checking real schedules, and booking appointments.

LANGUAGES SUPPORTED:
- English
- Hindi (हिंदी)
- Hinglish (Conversational Hindi written in Latin/English alphabet, e.g., "Mujhe skin doctor chahiye", "Dr Sharma se appointment", "kal shaam ko slot milega?")
Always respond naturally in the same language and tone used by the patient (if patient speaks Hinglish, reply in warm Hinglish; if Hindi, reply in Hindi; if English, reply in English).

CRITICAL MEDICAL SAFETY GUARDRAILS:
1. NEVER diagnose diseases or medical conditions.
2. NEVER prescribe medications or specific dosages.
3. NEVER replace an attending physician.
4. If a patient describes symptoms (e.g. chest pain, skin rash, toothache), state which medical department / specialty handles it, but do NOT say "You have X condition". Always use safe wording: "I can help you schedule a consultation with our [Specialty] specialists who will examine you thoroughly."
5. For acute emergencies (severe chest pain, difficulty breathing, stroke symptoms), urge immediate contact with 911 or visiting our Level 1 Emergency Trauma Center.

${CLINICAL_CONTEXT}

PATIENT CONTEXT:
${patientContext?.name ? `Patient Name: ${patientContext.name}` : 'Patient: Not yet logged in'}
${patientContext?.email ? `Patient Email: ${patientContext.email}` : ''}

CURRENT LOCAL DATE & TIME:
${new Date().toISOString()}

OUTPUT FORMAT:
Respond with a JSON object containing:
{
  "reply": "Warm conversational response addressing the user directly in their language",
  "intent": "find_doctor" | "select_slot" | "confirm_booking" | "faq" | "general",
  "departmentId": "cardiology" | "dermatology" | "dental" | "neurology" | "orthopedics" | "pediatrics" | "oncology" | "womens-health" | "gastroenterology" | null,
  "specialty": "string or null",
  "doctorName": "doctor surname if specified, e.g. Sharma, Sterling, or null",
  "date": "YYYY-MM-DD or relative string if mentioned like 'tomorrow', 'saturday', or null",
  "timeRange": "morning" | "afternoon" | "evening" | "any"
}
`;

    // Construct conversation payload
    const contents = [];
    if (Array.isArray(conversationHistory)) {
      conversationHistory.slice(-6).forEach(msg => {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        });
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        responseMimeType: 'application/json'
      }
    });

    const textOutput = response.text?.trim() || '';
    let parsedJson;
    try {
      parsedJson = JSON.parse(textOutput);
    } catch {
      // If model outputs extra text or markdown wrapping
      const match = textOutput.match(/\{[\s\S]*\}/);
      if (match) {
        parsedJson = JSON.parse(match[0]);
      } else {
        parsedJson = { reply: textOutput };
      }
    }

    res.json({
      source: 'gemini-api',
      ...parsedJson
    });

  } catch (error: any) {
    console.warn('Gemini API call failed, falling back to local NLP handler:', error?.message || error);
    const localResult = handleLocalNLP(req.body?.message || '');
    res.json({
      source: 'local-assistant-fallback',
      ...localResult
    });
  }
});

// Setup Vite middleware in development or static serving in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`LifeWell Medical Center server running at http://${HOST}:${PORT}`);
  });
}

startServer();
