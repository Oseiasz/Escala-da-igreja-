import { GoogleGenAI, Type } from "@google/genai";
import { WeeklySchedule, DaySetting } from '../types';
import { DAYS_OF_WEEK } from '../constants';

// Fix: Updated API key retrieval to use `process.env.API_KEY` as required by the coding guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateWeeklySchedule(members: string[], daySettings: DaySetting[]): Promise<WeeklySchedule> {
  const activeDays = daySettings.filter(d => d.hasService);
  
  if (activeDays.length === 0) {
    return DAYS_OF_WEEK.map(dayName => ({
      day: dayName,
      service: "No Service",
      ushers: [],
      hymns: [],
    }));
  }

  const prompt = `
    Generate a weekly church roster for the following days and services:
    ${activeDays.map(d => `- ${d.day}: ${d.serviceName}`).join('\n')}

    For each requested day, define:
    1. 'service': Use the exact service name provided for that day.
    2. 'ushers': A list with 2 names for ushers.
    3. 'hymns': A list of 2 objects, each with 'person' (who sings) and 'hymn' (a hymn number, e.g., from a hymnal).

    Use only the following names for the roster: ${members.join(', ')}.
    Ensure the response is a valid JSON containing an array of objects, one for each requested day, and do not include people outside the provided list.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              day: {
                type: Type.STRING,
                description: 'The day of the week.',
              },
              service: {
                type: Type.STRING,
                description: 'The name of the service or event for the day.',
              },
              ushers: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'List of names of the ushers.',
              },
              hymns: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    person: { type: Type.STRING },
                    hymn: { type: Type.INTEGER },
                  },
                  required: ['person', 'hymn'],
                },
                description: 'List of hymns and the person assigned to sing them.',
              },
            },
            required: ['day', 'service', 'ushers', 'hymns'],
          },
        },
      },
    });

    const text = response.text.trim();

    // Check for empty or non-JSON response before parsing
    if (!text || (!text.startsWith('[') && !text.startsWith('{'))) {
        throw new Error(`The API returned a non-JSON response. The model might have replied with text instead of the requested format.`);
    }

    try {
        const generatedData: WeeklySchedule = JSON.parse(text);
        // Merge generated data with days that have no service
        const fullSchedule = daySettings.map(setting => {
        if (!setting.hasService) {
            return { day: setting.day, service: "No Service", ushers: [], hymns: [] };
        }
        const foundDay = generatedData.find(d => d.day === setting.day);
        return foundDay || { day: setting.day, service: setting.serviceName, ushers: [], hymns: [] }; // Fallback
        });
        return fullSchedule;
    } catch (parseError) {
        console.error("Error parsing JSON response from Gemini:", parseError);
        throw new Error("The API returned a schedule in an invalid format that could not be read.");
    }
    
  } catch (error) {
    console.error("Error generating schedule with Gemini:", error);
    
    let userFriendlyMessage = "An unexpected error occurred while generating the schedule. Please try again later.";

    if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        
        // Use specific messages that were thrown intentionally
        if (errorMessage.includes("invalid format") || errorMessage.includes("non-json response")) {
            userFriendlyMessage = error.message;
        } else if (errorMessage.includes('api key not valid')) {
            userFriendlyMessage = "The API key is invalid or not configured correctly. Please check your settings.";
        } else if (errorMessage.includes('quota') || errorMessage.includes('resource has been exhausted')) {
            userFriendlyMessage = "The API usage limit has been reached for the day. Please try again tomorrow.";
        } else if (errorMessage.includes('fetch') || (typeof navigator !== 'undefined' && !navigator.onLine)) {
            userFriendlyMessage = "A network error occurred. Please check your internet connection and try again.";
        }
    }
    
    throw new Error(userFriendlyMessage);
  }
}