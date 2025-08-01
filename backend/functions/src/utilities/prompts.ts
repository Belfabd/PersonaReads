import {Genkit, z} from "genkit";
import {gemini20Flash} from "@genkit-ai/googleai";

export function enhanceResultsPrompt(ai: Genkit) {
  return ai.definePrompt(
    {
      name: "enhanceResultsPrompt",
      model: gemini20Flash,
      input: {
        schema: z.object({
          book: z.object({
            name: z.string(),
            description: z.string(),
          }),
          recommendations: z.array(
            z.object({
              name: z.string(),
              description: z.string(),
            })
          ),
        }),
      },
      output: {
        format: "json",
        schema: z.object({
          relations: z.array(z.object({
            name: z.string(),
            relation: z.string(),
          })),
        }),
      },
    },
    `You are a literary expert helping a reader understand why certain books are recommended based on their favorite book.

Given:
- One book I like (with its name and description)
- A list of recommended books (each with name and description)

Your task:
For **each recommended book**, explain in 1–2 sentences how it relates to the liked book. Focus on shared themes, tone, character arcs, or narrative style.

Avoid repeating the full descriptions. Be specific and insightful, not generic.

### The Book I Like:
- Name: {{book.name}}
- Description: {{book.description}}

### Recommended Books:
{{#each recommendations}}
**{{name}}**: {{description}}
{{/each}}`
  );
}

export function getPersonasPrompt(ai: Genkit) {
  return ai.definePrompt(
    {
      name: "getPersonasPrompt",
      model: gemini20Flash,
      input: {
        schema: z.object({
          book: z.object({
            name: z.string(),
            description: z.string(),
            tags: z.array(z.string()),
          }),
          personas: z.array(
            z.object({
              persona: z.string(),
              date: z.string(),
            })
          ),
        }),
      },
      output: {
        format: "json",
        schema: z.object({
          result: z.object({
            progression: z.string().describe("the short progression summary"),
            persona: z.string().describe("the persona id"),
          }),
        }),
      },
    },
    `You are a literary analyst that helps categorize readers into distinct "reading personas" based on their book preferences. 

Below is a predefined list of all personas. Use these as the only valid options when analyzing my persona.

---

## Persona List

1. **The Visionary**  
- id: visionary  
- description: Craves big ideas and bold futures. Thrives on imaginative worlds and philosophical questions.  
- Loves: Science fiction, speculative fiction, dystopias  
- Tone: Thought-provoking, cerebral, grand in scope

2. **The Escapist**  
- id: escapist  
- description: Seeks total immersion in other worlds. Reads to forget reality and dive deep into fantasy and adventure.  
- Loves: Epic fantasy, magical realism, adventures  
- Tone: Immersive, dramatic, richly detailed

3. **The Seeker**  
- id: seeker  
- description: Drawn to stories of identity, spirituality, and inner growth.  
- Loves: Literary fiction, memoirs  
- Tone: Reflective, poetic, intimate

4. **The Analyst**  
- id: analyst  
- description: Loves complex plots and layered characters.  
- Loves: Mysteries, historical fiction, political thrillers  
- Tone: Intricate, intellectual, suspenseful

5. **The Romantic**  
- id: romantic  
- description: Reads for emotion, connection, and the journey of love.  
- Loves: Romance, emotional literary fiction  
- Tone: Heartfelt, dramatic, warm or bittersweet

6. **The Rebel**  
- id: rebel  
- description: Loves stories that challenge norms or feature antiheroes.  
- Loves: Dystopias, satire, dark fantasy  
- Tone: Edgy, raw, provocative

7. **The Historian**  
- id: historian  
- description: Fascinated by the past and its relevance.  
- Loves: Historical fiction, biographies  
- Tone: Grounded, rich in detail, nostalgic

8. **The Minimalist**  
- id: minimalist  
- description: Prefers concise prose and emotional depth in few words.  
- Loves: Short stories, modern lit  
- Tone: Sparse, elegant, introspective

9. **The Dreamer**  
- id: dreamer  
- description: Loves lyrical, surreal, or abstract writing.  
- Loves: Magical realism, fairy tales, folklore  
- Tone: Poetic, imaginative, whimsical

10. **The Realist**  
- id: realist  
- description: Enjoys grounded, relatable stories about real life.  
- Loves: Contemporary fiction, memoirs  
- Tone: Honest, unembellished

11. **The Thrill Seeker**  
- id: thrill_seeker  
- description: Craves high-stakes plots and adrenaline-fueled tension.  
- Loves: Thrillers, horror, crime  
- Tone: Dark, tense, gripping

12. **The Optimist**  
- id: optimist  
- description: Looks for hope, humor, and uplift in stories.  
- Loves: Feel-good fiction, rom-coms  
- Tone: Heartwarming, light, humorous

13. **The Scholar**  
- id: scholar  
- description: Enjoys intellectually challenging or academic reads.  
- Loves: Nonfiction, philosophy, dense sci-fi  
- Tone: Dense, rich, abstract

14. **The Curator**  
- id: curator  
- description: Reads across styles, collects rare or aesthetic works.  
- Loves: Niche, experimental, cult classics  
- Tone: Eclectic, artistic, varied

15. **The Strategist**  
- id: strategist  
- description: Drawn to systems, logic, and strategic complexity.  
- Loves: Hard sci-fi, political fiction  
- Tone: Methodical, layered, ambitious

---

## User History

I previously had these personas:

{{#each personas}}
- id: {{persona}}, analyzed_on: {{date}}
{{/each}}
{{#unless personas}}
* No personas were found!
{{/unless}}

---

## Latest Book

Here is the book I just scanned:

- Title: {{book.name}}
- Description: {{book.description}}
- Tags: {{#each book.tags}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}

---

## Your Tasks

1. **Determine my current persona** by matching the new book's themes, tone, and tags to one of the predefined personas above and return the persona id.  
2. **Write a short progression summary** in 2 sentences showing how my persona has evolved over time based on previous personas and this new one.
Highlight any clear shifts in genre, tone, or reading style. If no persona were found, consider only the new book.
`);
}
