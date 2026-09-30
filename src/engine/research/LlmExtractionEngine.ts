import type { Claim } from './researchOntology';

export class LlmExtractionEngine {
  public static async extractClaims(
    studyId: string, 
    text: string, 
    targetSourceVar: string, 
    targetDependentVar: string,
    extractionType: 'BASELINE' | 'EFFECT'
  ): Promise<any[]> {
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    const directGeminiKey = process.env.GEMINI_API_KEY;
    if (!openRouterKey && !directGeminiKey) throw new Error('MISSING_EXTERNAL_DEPENDENCY: No LLM API keys configured.');

    let prompt = '';
    if (extractionType === 'BASELINE') {
        prompt = 'You are a strict scientific extraction engine.\n' +
        'Analyze the following academic text to find the BASELINE (control) values for ' + targetDependentVar + '.\n' +
        'Output ONLY valid JSON matching this interface:\n' +
        '{ "mean": number, "sd": number, "units": "ms", "statement": "exact quote from text", "populationMatch": true, "taskMatch": true, "unitsMatch": true }\n' +
        'CRITICAL: You must independently verify that the population matches healthy adults, the task matches psychomotor vigilance, and the units are explicitly ms. If any do not match exactly, output false for that boolean flag.\n' +
        'If the exact numbers do not exist in the text, return { "mean": null, "sd": null, "units": null, "statement": "Not found" }.\n' +
        'Text: ' + text;
    } else {
        prompt = 'You are a strict scientific extraction engine.\n' +
        'Analyze the following academic text for the effect of ' + targetSourceVar + ' on ' + targetDependentVar + '.\n' +
        'Output ONLY valid JSON matching this interface:\n' +
        '{ "direction": "Positive" | "Negative" | "No_Effect", "effectSize": number, "effectMetric": "ms" | "d" | "percentage", "confidence": number, "statement": "exact quote from text containing the effect size", "population": "string", "conditions": "string", "uncertainty": "string" }\n' +
        'If the exact effect size number does not exist in the text, return { "effectSize": null }.\n' +
        'Text: ' + text;
    }

    let rawText = '';
    let usedModel = 'UNKNOWN';
    let routerUsed = 'UNKNOWN';

    if (openRouterKey) {
        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + openRouterKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    models: ["anthropic/claude-3-haiku", "google/gemini-3.6-flash"],
                    messages: [{ role: "user", content: prompt }]
                }),
                signal: AbortSignal.timeout(300000)
            });
            if (response.ok) {
                const data = await response.json();
                if (data.choices && data.choices[0].message) {
                    rawText = data.choices[0].message.content;
                    usedModel = data.model;
                    routerUsed = 'OPENROUTER';
                }
            }
        } catch (err: any) { }
    }

    if (!rawText && directGeminiKey) {
        try {
            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=' + directGeminiKey, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
                signal: AbortSignal.timeout(300000)
            });
            if (response.ok) {
                const data = await response.json();
                rawText = data.candidates[0].content.parts[0].text;
                usedModel = 'gemini-3.6-flash';
                routerUsed = 'DIRECT_GEMINI';
            }
        } catch(e: any) { }
    }

    if (!rawText) throw new Error('LLM_EXTRACTION_FAILED: All extraction routes failed.');

    try {
        const jsonStart = rawText.indexOf('[');
        const jsonObjStart = rawText.indexOf('{');
        const startIdx = (jsonStart !== -1 && (jsonObjStart === -1 || jsonStart < jsonObjStart)) ? jsonStart : jsonObjStart;
        const jsonEnd = Math.max(rawText.lastIndexOf(']'), rawText.lastIndexOf('}'));
        
        let cleanedText = rawText;
        if (startIdx !== -1 && jsonEnd !== -1) {
            cleanedText = rawText.substring(startIdx, jsonEnd + 1);
        }

        const parsed = JSON.parse(cleanedText);
        let claimObj = Array.isArray(parsed) ? parsed[0] : parsed;
        if (claimObj.claims && Array.isArray(claimObj.claims)) claimObj = claimObj.claims[0];
        
        if (claimObj.statement && claimObj.statement !== 'Not found' && claimObj.statement !== 'Extracted via LLM router') {
            const normalizedSource = text.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            const normalizedQuote = claimObj.statement.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            if (!normalizedSource.includes(normalizedQuote) && normalizedQuote.length > 5) {
                throw new Error("SOURCE_VERIFICATION_FAILED: The extracted statement does not exist in the source text.");
            }
            if (extractionType === "BASELINE" && (claimObj.populationMatch !== true || claimObj.taskMatch !== true || claimObj.unitsMatch !== true)) {
                throw new Error("SEMANTIC_VALIDATION_FAILED: The extracted numbers do not match the target population, task, or units.");
            }
        }

        if (extractionType === 'EFFECT' && claimObj.effectSize !== null && claimObj.effectSize !== undefined) {
             if (!text.includes(claimObj.effectSize.toString())) {
                  throw new Error('SOURCE_VERIFICATION_FAILED: Effect size ' + claimObj.effectSize + ' not found in source text.');
             }
        }

        if (extractionType === 'BASELINE') {
            return [{
                mean: claimObj.mean,
                sd: claimObj.sd,
                units: claimObj.units,
                statement: claimObj.statement,
                routerUsed,
                usedModel
            }];
        }

        return [{
            id: 'claim_llm_' + Date.now(),
            extractionConfidence: claimObj.confidence || 0.8,
            claimType: 'LLM_DERIVED',
            studyId: studyId,
            statement: claimObj.statement,
            sourceVariable: targetSourceVar,
            targetVariable: targetDependentVar,
            direction: claimObj.direction || 'Unknown',
            effectSize: claimObj.effectSize,
            effectMetric: claimObj.effectMetric,
            population: claimObj.population || 'Unknown',
            conditions: claimObj.conditions || 'Unknown',
            uncertainty: claimObj.uncertainty || 'Unknown',
            epistemicCategory: 'LLM_DERIVED',
            routerUsed,
            usedModel
        }];
    } catch (err: any) {
        if (err.message && err.message.includes('SOURCE_VERIFICATION_FAILED')) throw err;
        throw new Error('LLM_PARSE_ERROR: Failed to parse valid JSON from LLM response.');
    }
  }
}
