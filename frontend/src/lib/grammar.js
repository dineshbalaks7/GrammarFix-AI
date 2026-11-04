const API_BASE = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export async function checkGrammar(text, mode = 'correct') {
  if (API_BASE) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 20000);
    let response;
    try {
      response = await fetch(`${API_BASE}/correct`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, mode }), signal: controller.signal
      });
    } catch (error) {
      if (error.name === 'AbortError') throw new Error('The correction service is taking too long. Please try again.');
      throw new Error('Could not reach the correction service.');
    } finally {
      window.clearTimeout(timeoutId);
    }
    if (!response.ok) throw new Error(`Grammar service returned ${response.status}`);
    const data = await response.json();
    return {
      correctedText: data.corrected_text || data.correctedText || data.corrected || data.result || text,
      issues: data.mistakes || data.errors || data.issues || [],
      explanation: data.explanation || 'Your text has been reviewed.',
      score: data.score ?? null
    };
  }
  // Local preview keeps the interface demonstrable until a backend URL is configured.
  const replacements = [
    [/\bI am going to college yesterday\b/gi, 'I went to college yesterday'],
    [/\bI doesn't\b/gi, "I don't"], [/\bHe don't\b/gi, "He doesn't"],
    [/\bShe don't\b/gi, "She doesn't"], [/\bthey was\b/gi, 'they were'],
    [/\bhe go\b/gi, 'he goes'], [/\bshe go\b/gi, 'she goes'],
    [/\bi has\b/gi, 'I have'], [/\brecieved\b/gi, 'received'],
    [/\bteh\b/gi, 'the'], [/\byour welcome\b/gi, "you're welcome"]
  ];
  let correctedText = text;
  const issues = [];
  replacements.forEach(([pattern, replacement]) => {
    if (pattern.test(correctedText)) {
      const before = correctedText;
      correctedText = correctedText.replace(pattern, replacement);
      issues.push({ type: 'Grammar & usage', original: before.match(pattern)?.[0] || '', suggestion: replacement, explanation: 'This wording was adjusted for standard English usage.' });
    }
  });
  correctedText = correctedText.replace(/\s+([,.!?;:])/g, '$1').replace(/([.!?])([A-Za-z])/g, '$1 $2');
  if (correctedText && !/[.!?]$/.test(correctedText.trim())) correctedText = correctedText.trim() + '.';
  if (mode === 'professional') correctedText = correctedText.replace(/\bcan't\b/gi, 'cannot').replace(/\bdon't\b/gi, 'do not');
  return { correctedText, issues, explanation: issues.length ? 'A few improvements were identified in your writing.' : 'Your text looks clear. We made a light punctuation and formatting pass.', score: Math.max(78, 100 - issues.length * 8), demo: true };
}
