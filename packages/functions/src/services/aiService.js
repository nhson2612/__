import {VertexAI} from '@google-cloud/vertexai';

// Initialize Vertex with your Cloud project and location
const vertexAI = new VertexAI({project: 'todo-app-frontend-7ff2', location: 'us-central1'});

// Instantiate the model
const generativeModel = vertexAI.getGenerativeModel({
  model: 'gemini-1.5-flash-001'
});

/**
 * Generate content from a text prompt
 * @param {string} prompt
 * @returns {Promise<string>}
 */
export async function generateContent(prompt) {
  try {
    const result = await generativeModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating content:', error);
    throw new Error('Failed to generate content');
  }
}

/**
 * Send a message in a chat session
 * @param {Array<{role: string, parts: Array<{text: string}>}>} history
 * @param {string} message
 * @returns {Promise<string>}
 */
export async function chat(history, message) {
  try {
    const chatSession = generativeModel.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1000
      }
    });

    const result = await chatSession.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in chat session:', error);
    throw new Error('Failed to process chat message');
  }
}
