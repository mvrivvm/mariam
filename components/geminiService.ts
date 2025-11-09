

import { GoogleGenAI } from "@google/genai";
import { AIChatMessage } from '../types';

// Fix: Initialize GoogleGenAI directly with process.env.API_KEY as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateResolutionNote = async (problemDescription: string, technicalNotes: string): Promise<string> => {
  // Fix: Removed check for API_KEY as per guidelines, which state to assume it's always available.
  const prompt = `
    You are a helpful and friendly customer support representative for 'Metallic ERP'.
    Your task is to write a clear and reassuring resolution message to a customer.
    The customer is not technical. Avoid jargon.

    Here is the information about the support ticket:

    Original Problem Description:
    ---
    ${problemDescription}
    ---

    Developer's Technical Resolution Notes:
    ---
    ${technicalNotes}
    ---

    Based on the information above, please generate a friendly message to the customer explaining that their issue has been resolved.
    Start the message with a friendly greeting like "Hello,".
    Briefly mention the problem they reported in simple terms.
    Confirm that the issue is now fixed.
    If the developer's notes mention a specific fix (like a patch or update), explain it simply (e.g., "We've applied an update to our system that solves this.").
    End with a positive closing, like "Please let us know if you have any other questions. Thank you for using Metallic ERP!".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "There was an issue generating the resolution note, but the ticket has been marked as resolved. The technical team has fixed the reported problem.";
  }
};

export const askAIChat = async (history: AIChatMessage[], question: string): Promise<string> => {
    const contents = [
        ...history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
        })),
        {
            role: 'user' as const,
            parts: [{ text: question }]
        }
    ];

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents,
            config: {
                systemInstruction: `You are a helpful and knowledgeable AI assistant for 'Metallic ERP', a sophisticated enterprise resource planning software.
                Your role is to assist users, who can be clients or developers, with their questions.
                Provide clear, concise, and accurate information.
                If a user asks about a specific ticket, you can't access ticket data, so politely explain that and suggest they check the ticket details or talk to the assigned developer.
                For general questions about ERP concepts or software development, provide helpful explanations.
                Keep your responses friendly and professional.`,
            },
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for chat:", error);
        return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
    }
};
