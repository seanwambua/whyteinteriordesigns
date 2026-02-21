'use server';
/**
 * @fileOverview A Genkit flow that generates personalized interior design recommendations based on a client's style quiz preferences.
 *
 * - styleQuizRecommendation - A function that handles the style quiz recommendation process.
 * - StyleQuizRecommendationInput - The input type for the styleQuizRecommendation function.
 * - StyleQuizRecommendationOutput - The return type for the styleQuizRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StyleQuizRecommendationInputSchema = z.object({
  roomType: z
    .string()
    .describe('The type of room the client is looking to design (e.g., living room, bedroom, home office).'),
  colorPalette: z
    .string()
    .describe('Client preferred color palette (e.g., warm neutrals, bold and vibrant, monochromatic blues).'),
  furnitureStyles: z
    .array(z.string())
    .describe('A list of client preferred furniture styles (e.g., mid-century modern, minimalist, bohemian).'),
  roomAmbiance: z
    .string()
    .describe('The desired ambiance for the room (e.g., cozy and inviting, sleek and professional, bright and airy).'),
  budgetPreference: z
    .string()
    .optional()
    .describe('Client budget preference (e.g., luxury, mid-range, budget-conscious).'),
});
export type StyleQuizRecommendationInput = z.infer<typeof StyleQuizRecommendationInputSchema>;

const StyleQuizRecommendationOutputSchema = z.object({
  designStyleName: z.string().describe('A concise name for the recommended interior design style.'),
  summary: z.string().describe('A brief overview and description of the recommended style.'),
  keyElements: z
    .array(z.string())
    .describe('Key design elements, materials, textures, and patterns characteristic of this style.'),
  colorScheme: z.string().describe('Specific color recommendations including primary, secondary, and accent colors.'),
  furnitureSuggestions: z
    .array(z.string())
    .describe('Types of furniture and decor pieces that fit the recommended style.'),
  ambianceAchieved: z
    .string()
    .describe('How the recommended style achieves the client\u2019s desired room ambiance.'),
  whyteInteriorsServiceFit: z
    .array(z.string())
    .describe(
      'Suggested Whyte Interiors services that would best suit this client\u2019s needs based on the recommendation (e.g., "Consultancy", "Design & Build", "Refresh Services").'
    ),
});
export type StyleQuizRecommendationOutput = z.infer<typeof StyleQuizRecommendationOutputSchema>;

export async function styleQuizRecommendation(
  input: StyleQuizRecommendationInput
): Promise<StyleQuizRecommendationOutput> {
  return styleQuizRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'styleQuizRecommendationPrompt',
  input: {schema: StyleQuizRecommendationInputSchema},
  output: {schema: StyleQuizRecommendationOutputSchema},
  prompt: `You are an expert interior designer from Whyte Interiors, specializing in creating luxurious and sophisticated spaces. Your task is to analyze a potential client's style preferences from a quiz and provide a detailed, personalized interior design recommendation. This recommendation will help Whyte Interiors understand the client's aesthetic and tailor a customized service proposal.

Client Preferences:
Room Type: {{{roomType}}}
Color Palette: {{{colorPalette}}}
Furniture Styles: {{{#each furnitureStyles}}}- {{{this}}}{{/each}}
Desired Room Ambiance: {{{roomAmbiance}}}
{{#if budgetPreference}}Budget Preference: {{{budgetPreference}}}{{/if}}

Based on these preferences, provide a detailed interior design recommendation, focusing on the overall style, key elements, color scheme, and furniture suggestions. Also, indicate which Whyte Interiors services would be a perfect fit for this client. Ensure your response is professional and inspiring, reflecting the high standards of Whyte Interiors.`,
});

const styleQuizRecommendationFlow = ai.defineFlow(
  {
    name: 'styleQuizRecommendationFlow',
    inputSchema: StyleQuizRecommendationInputSchema,
    outputSchema: StyleQuizRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
