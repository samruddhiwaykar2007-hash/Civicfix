import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || (process.env.NODE_ENV === 'production' ? '8080' : '5173'), 10);

app.use(express.json({ limit: '25mb' }));

// Health and integration status endpoint
app.get('/api/status', (req, res) => {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 5);
  const hasSupabaseUrl = Boolean(process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_URL.includes('supabase.co'));
  const hasSupabaseKey = Boolean(process.env.VITE_SUPABASE_ANON_KEY && process.env.VITE_SUPABASE_ANON_KEY.length > 10);

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: hasGeminiKey,
    supabaseConfigured: hasSupabaseUrl && hasSupabaseKey,
    appUrl: process.env.APP_URL || `http://localhost:${PORT}`,
    nodeEnv: process.env.NODE_ENV || 'development'
  });
});

// Category and Department master catalog for deterministic routing
const DEPARTMENT_ROUTING: Record<string, { id: string; name: string; nameMr: string; nameHi: string; slaAckHours: number; slaResolveDays: number }> = {
  roads_potholes: {
    id: 'dept_roads',
    name: 'Roads & Public Works Department (PWD)',
    nameMr: 'रस्ते व सार्वजनिक बांधकाम विभाग',
    nameHi: 'सड़क एवं लोक निर्माण विभाग',
    slaAckHours: 24,
    slaResolveDays: 3
  },
  garbage_sanitation: {
    id: 'dept_solid_waste',
    name: 'Solid Waste Management & Sanitation Department',
    nameMr: 'घनकचरा व्यवस्थापन व स्वच्छता विभाग',
    nameHi: 'ठोस अपशिष्ट प्रबंधन एवं स्वच्छता विभाग',
    slaAckHours: 12,
    slaResolveDays: 2
  },
  drainage_sewage: {
    id: 'dept_storm_drainage',
    name: 'Storm Water Drainage & Sewage Department',
    nameMr: 'मलनिःसारण व पावसाळी गटारे विभाग',
    nameHi: 'जल निकासी एवं सीवरेज विभाग',
    slaAckHours: 24,
    slaResolveDays: 3
  },
  water_supply_leakage: {
    id: 'dept_water_supply',
    name: 'Hydraulic Engineering & Water Supply',
    nameMr: 'जल अभियंता व पाणी पुरवठा विभाग',
    nameHi: 'जल आपूर्ति एवं पाइपलाइन विभाग',
    slaAckHours: 12,
    slaResolveDays: 2
  },
  streetlights_lighting: {
    id: 'dept_electrical',
    name: 'Municipal Electrical & Public Lighting Department',
    nameMr: 'विद्युत व सार्वजनिक पथदिवे विभाग',
    nameHi: 'विद्युत एवं सार्वजनिक मार्ग प्रकाश विभाग',
    slaAckHours: 24,
    slaResolveDays: 2
  },
  infrastructure_damage: {
    id: 'dept_infra_maintenance',
    name: 'Municipal Infrastructure & Building Maintenance',
    nameMr: 'पालिका पायाभूत सुविधा व देखभाल विभाग',
    nameHi: 'नगरपालिका अवसंरचना एवं भवन अनुरक्षण विभाग',
    slaAckHours: 48,
    slaResolveDays: 7
  },
  food_safety_health: {
    id: 'dept_public_health',
    name: 'Public Health & Food Safety Directorate',
    nameMr: 'सार्वजनिक आरोग्य व अन्न सुरक्षा संचालनालय',
    nameHi: 'सार्वजनिक स्वास्थ्य एवं खाद्य सुरक्षा निदेशालय',
    slaAckHours: 24,
    slaResolveDays: 4
  },
  other_civic_issues: {
    id: 'dept_general_administration',
    name: 'Central Ward Citizen Grievance Cell',
    nameMr: 'मध्यवर्ती प्रभाग नागरिक तक्रार कक्ष',
    nameHi: 'केंद्रीय वार्ड नागरिक शिकायत निवारण प्रकोष्ठ',
    slaAckHours: 48,
    slaResolveDays: 5
  }
};

// AI Complaint Analysis Endpoint
app.post('/api/gemini/analyze', async (req, res) => {
  const { description = '', imageBase64, mimeType = 'image/jpeg', userLanguage = 'en' } = req.body;

  if (!description && !imageBase64) {
    return res.status(400).json({ error: 'Please provide either a photo or a description of the issue.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.length > 5) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const promptInstructions = `You are the CivicFix Municipal AI Engine. Analyze the civic complaint and respond with a JSON object containing:
- detectedLanguage: "mr", "hi", or "en"
- suggestedTitle: concise issue title in ${userLanguage === 'mr' ? 'Marathi' : userLanguage === 'hi' ? 'Hindi' : 'English'}
- suggestedTitleEn: title in English
- suggestedCategory: one of roads_potholes, garbage_sanitation, drainage_sewage, water_supply_leakage, streetlights_lighting, infrastructure_damage, food_safety_health, other_civic_issues
- severity: "Low", "Medium", "High", or "Critical"
- confidenceScore: 0.0 to 1.0
- confidenceBand: "High", "Moderate", or "Low"
- citizenSummary: polite summary in ${userLanguage === 'mr' ? 'Marathi' : userLanguage === 'hi' ? 'Hindi' : 'English'}
- standardizedDescriptionEn: formal English description for municipal records
- visibleEvidence: array of observed evidence items
- reasoning: why this category was chosen
- missingInformation: any missing details
- suggestedNextStep: what citizen should expect
- clarifyingQuestion: optional question if ambiguous, else ""

Citizen description: "${description || 'No written description provided, inspect the photo.'}"
Preferred language: ${userLanguage}`;

      const parts: any[] = [];

      if (imageBase64) {
        const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
        parts.push({ inlineData: { mimeType: mimeType || 'image/jpeg', data: cleanBase64 } });
      }

      parts.push({ text: promptInstructions });

      const result = await model.generateContent({ contents: [{ role: 'user', parts }] });
      const responseText = result.response.text();

      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in AI response');

      const parsed = JSON.parse(jsonMatch[0]);
      const categoryKey = parsed.suggestedCategory || 'other_civic_issues';
      const routing = DEPARTMENT_ROUTING[categoryKey] || DEPARTMENT_ROUTING.other_civic_issues;

      return res.json({
        success: true,
        isRealAi: true,
        modelUsed: 'gemini-1.5-flash',
        data: {
          ...parsed,
          suggestedDepartmentId: routing.id,
          suggestedDepartmentName: routing.name,
          suggestedDepartmentNameMr: routing.nameMr,
          suggestedDepartmentNameHi: routing.nameHi,
          slaAckHours: routing.slaAckHours,
          slaResolveDays: routing.slaResolveDays
        }
      });
    } catch (err: any) {
      console.error('Gemini API call failed, using heuristic fallback:', err.message);
      // Fall through to heuristic engine
    }
  }

  // Graceful rule-based heuristic engine fallback
  const fallback = analyzeWithHeuristics(description, imageBase64, userLanguage);
  return res.json({
    success: true,
    isRealAi: false,
    modelUsed: 'civicfix-rule-engine-fallback',
    note: 'Processed via CivicFix intelligent multilingual heuristic engine.',
    data: fallback
  });
});

// Intelligent multilingual heuristic parser for offline/demo robustness
function analyzeWithHeuristics(description: string, hasImage: boolean | string | undefined, userLanguage: string) {
  const text = (description || '').toLowerCase();

  let detectedLanguage = 'en';
  if (/[\u0900-\u097F]/.test(text)) {
    if (text.includes('आहे') || text.includes('खड्डा') || text.includes('गटार') || text.includes('पाणी') || text.includes('कचरा') || text.includes('रस्ता')) {
      detectedLanguage = 'mr';
    } else {
      detectedLanguage = 'hi';
    }
  }

  let category = 'other_civic_issues';
  let severity = 'Medium';
  let title = 'Civic Problem Report';
  let titleEn = 'Civic Problem Report';
  let visibleEvidence = hasImage ? ['Visible street scene or public property damage'] : ['Reported by citizen description'];
  let reasoning = 'Categorized based on citizen reported keywords and municipal routing taxonomy.';

  if (text.includes('खड्डा') || text.includes('pothole') || text.includes('गड्ढा') || text.includes('road') || text.includes('रस्ता') || text.includes('सड़क')) {
    category = 'roads_potholes';
    severity = text.includes('मोठा') || text.includes('deep') || text.includes('accidents') || text.includes('विशाल') ? 'High' : 'Medium';
    title = userLanguage === 'mr' ? 'रस्त्यावरील खड्ड्याची तक्रार' : userLanguage === 'hi' ? 'सड़क पर गड्ढे की समस्या' : 'Pothole and Road Surface Damage';
    titleEn = 'Pothole and Road Surface Damage';
    reasoning = userLanguage === 'mr'
      ? 'वर्णनातील रस्ता व खड्डा या शब्दांच्या आधारे रस्ते व सार्वजनिक बांधकाम विभागाकडे पाठवण्यात आले.'
      : userLanguage === 'hi'
      ? 'विवरण में सड़क और गड्ढे से संबंधित विवरण के आधार पर सड़क एवं लोक निर्माण विभाग को अनुशंसित।'
      : 'Identified road surface deterioration and potholes requiring asphalt repair.';
    visibleEvidence = ['Road pavement depression', 'Asphalt degradation or loose stones'];
  } else if (text.includes('कचरा') || text.includes('garbage') || text.includes('waste') || text.includes('कूड़ा') || text.includes('घाण')) {
    category = 'garbage_sanitation';
    severity = 'High';
    title = userLanguage === 'mr' ? 'कचऱ्याचे साम्राज्य व अस्वच्छता' : userLanguage === 'hi' ? 'कचरे का ढेर एवं अस्वच्छता' : 'Garbage Accumulation & Uncollected Waste';
    titleEn = 'Garbage Accumulation & Uncollected Waste';
    reasoning = 'Solid waste accumulation reported creating sanitary concern.';
    visibleEvidence = ['Accumulated municipal solid waste', 'Overflowing collection spot'];
  } else if (text.includes('नाली') || text.includes('गटार') || text.includes('drain') || text.includes('sewage') || text.includes('सांडपाणी')) {
    category = 'drainage_sewage';
    severity = 'High';
    title = userLanguage === 'mr' ? 'गटार तुंबणे व सांडपाण्याची समस्या' : userLanguage === 'hi' ? 'नाली जाम एवं सीवरेज ओवरफ्लो' : 'Clogged Drain & Sewage Overflow';
    titleEn = 'Clogged Drain & Sewage Overflow';
    reasoning = 'Drainage line blockage detected with potential water-logging risk.';
    visibleEvidence = ['Stagnant dirty water', 'Clogged roadside drainage canal'];
  } else if (text.includes('लाईट') || text.includes('light') || text.includes('बिजली') || text.includes('अंधार') || text.includes('pole')) {
    category = 'streetlights_lighting';
    severity = 'Medium';
    title = userLanguage === 'mr' ? 'पथदिवे बंद असण्याची तक्रार' : userLanguage === 'hi' ? 'स्ट्रीट लाइट बंद होने की शिकायत' : 'Streetlight Failure & Non-Functional Public Lighting';
    titleEn = 'Streetlight Failure & Non-Functional Public Lighting';
    reasoning = 'Public street illumination failure requiring municipal electrician dispatch.';
    visibleEvidence = ['Municipal electrical pole', 'Dark street or unlit luminaire fixture'];
  } else if (text.includes('पाणी') || text.includes('water') || text.includes('leakage') || text.includes('जल') || text.includes('pipe')) {
    category = 'water_supply_leakage';
    severity = 'High';
    title = userLanguage === 'mr' ? 'पाणी गळती व पुरवठा बिघाड' : userLanguage === 'hi' ? 'जल आपूर्ति में रिसाव एवं बर्बादी' : 'Municipal Water Pipeline Leakage';
    titleEn = 'Municipal Water Pipeline Leakage';
    reasoning = 'Clean water pipeline rupture resulting in resource loss.';
    visibleEvidence = ['Water gushing from municipal main', 'Pavement wetness from pipe rupture'];
  }

  const routing = DEPARTMENT_ROUTING[category] || DEPARTMENT_ROUTING.other_civic_issues;

  return {
    detectedLanguage,
    suggestedTitle: title,
    suggestedTitleEn: titleEn,
    suggestedCategory: category,
    severity,
    confidenceScore: 0.88,
    confidenceBand: 'High',
    citizenSummary: userLanguage === 'mr'
      ? `आम्ही आपल्या तक्रारीचे विश्लेषण केले आहे: "${title}". हे ${routing.nameMr} कडे पाठवण्यास योग्य आहे.`
      : userLanguage === 'hi'
      ? `हमने आपकी शिकायत का विश्लेषण किया है: "${title}". इसे ${routing.nameHi} को भेजना उचित है।`
      : `We analyzed your report: "${titleEn}". Suggested destination is ${routing.name}.`,
    standardizedDescriptionEn: description
      ? `Citizen reported: ${description}. Standardized technical review for municipal works.`
      : `Civic issue identified via photographic inspection: ${titleEn}.`,
    visibleEvidence,
    reasoning,
    missingInformation: 'Specific municipal ward or pole number if available.',
    suggestedNextStep: userLanguage === 'mr'
      ? 'तपशील तपासून तक्रार सबमिट करा.'
      : userLanguage === 'hi'
      ? 'विवरण जांचकर शिकायत दर्ज करें।'
      : 'Review details and submit complaint to initiate field inspection.',
    clarifyingQuestion: '',
    suggestedDepartmentId: routing.id,
    suggestedDepartmentName: routing.name,
    suggestedDepartmentNameMr: routing.nameMr,
    suggestedDepartmentNameHi: routing.nameHi,
    slaAckHours: routing.slaAckHours,
    slaResolveDays: routing.slaResolveDays
  };
}

async function startServer(initialPort = PORT, maxAttempts = 5) {
  let currentPort = initialPort;
  let attempts = 0;

  let vite: any = null;
  if (process.env.NODE_ENV !== 'production') {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  const tryListen = (portToTry: number) => {
    const server = app.listen(portToTry, '0.0.0.0', () => {
      console.log(`\n✅ CivicFix Municipal Platform running at http://localhost:${portToTry}`);
      console.log(`   AI Engine: ${process.env.GEMINI_API_KEY ? '🟢 Gemini 1.5 Flash Active' : '🟡 Heuristic Fallback Mode (add GEMINI_API_KEY to .env)'}`);
      console.log(`   Database:  ${process.env.VITE_SUPABASE_URL ? '🟢 Supabase Connected' : '🟡 Demo Mode (localStorage)'}\n`);
    });

    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        attempts++;
        if (attempts < maxAttempts) {
          const nextPort = portToTry + 1;
          console.warn(`⚠️ Port ${portToTry} is in use, attempting to bind to http://localhost:${nextPort}...`);
          tryListen(nextPort);
        } else {
          console.error(`❌ Could not find an open port after ${maxAttempts} attempts starting from ${initialPort}.`);
          process.exit(1);
        }
      } else {
        console.error('Server error:', err);
      }
    });

    process.on('SIGINT', () => {
      server.close(() => process.exit(0));
    });
    process.on('SIGTERM', () => {
      server.close(() => process.exit(0));
    });
  };

  tryListen(currentPort);
}

startServer();

export default app;
