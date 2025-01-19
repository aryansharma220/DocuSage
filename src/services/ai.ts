// This is a mock implementation. Replace with actual Gemini API integration later
export const analyzeDocuments = async (question: string, documents: Array<{ content?: string }>) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock response based on the question
  const mockResponses: { [key: string]: string } = {
    "what": "Based on the available documents, I can help answer questions about their content once the Gemini API is integrated.",
    "how": "I can analyze document contents and provide specific answers once the Gemini API integration is complete.",
    "when": "The documents contain various timestamps and dates that I can analyze with the Gemini API integration.",
    "default": "I'm currently in placeholder mode. Once integrated with the Gemini API, I'll be able to provide detailed answers based on your document content."
  };

  // Return a mock response based on the first word of the question
  const firstWord = question.toLowerCase().split(' ')[0];
  return mockResponses[firstWord] || mockResponses.default;
};