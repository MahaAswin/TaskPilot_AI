import Image from '../models/Image.js';
import llmService from '../services/llmService.js';

class CreativeAgent {
  getDescription() {
    return 'Creative generator. Specialized in composing graphic generation prompts (logos, UI, mockups) and writing Mermaid.js diagram syntaxes (flowcharts, mindmaps, architecture block diagrams).';
  }

  /**
   * Run the Creative Agent.
   * @param {string} prompt - User request
   * @param {object} context - User context
   * @returns {Promise<string>} Agent response containing image embeds or mermaid graphs
   */
  async run(prompt, context) {
    const userId = context.user?._id;
    const lowerPrompt = prompt.toLowerCase();

    // Check if user specifically wants a diagram / flowchart
    const isDiagram = lowerPrompt.includes('diagram') || 
                      lowerPrompt.includes('flowchart') || 
                      lowerPrompt.includes('mindmap') || 
                      lowerPrompt.includes('mind map') ||
                      lowerPrompt.includes('architecture');

    if (isDiagram) {
      const diagramPrompt = `You are the Creative Agent in TaskPilot AI.
The user wants a diagram or flowchart.
Provide a beautiful diagram using Mermaid.js syntax inside a code block marked with \`\`\`mermaid.
Make sure the diagram matches the user's topic: "${prompt}".
In addition to the diagram code block, provide a brief, professional description of the diagram nodes and flow.
Ensure you use double quotes inside nodes where special characters exist. Example:
\`\`\`mermaid
graph TD
    A["Start Project"] --> B["Build Foundation"]
    B --> C["Review and Release"]
\`\`\`
Do not use html in the node labels.`;

      try {
        const response = await llmService.generateCompletion([
          { role: 'system', content: diagramPrompt },
          { role: 'user', content: prompt }
        ]);
        return response;
      } catch (err) {
        return `### Diagram Generation Failed\nReason: ${err.message}\n\n\`\`\`mermaid\ngraph TD\n  Start[Start] --> Error[Error compiling diagram]\n\`\`\``;
      }
    }

    // Otherwise, generate an image!
    // We will ask the LLM to generate an optimized descriptive prompt for stable diffusion.
    const promptEngineeringPrompt = `You are the Creative Agent in TaskPilot AI.
The user wants to generate an image. Your task is to take their simple input and expand it into a detailed, highly descriptive prompt optimized for text-to-image AI generators (e.g. Stable Diffusion).
Focus on styling details, mood, colors, camera details, lighting, and composition.

User input: "${prompt}"

Output ONLY a JSON object matching this schema:
{
  "descriptivePrompt": "Detailed optimized prompt",
  "style": "photorealistic | digital art | logo | vector | 3D render",
  "explanation": "Short sentence explaining your design choices"
}
Do not return markdown wrap, just return raw JSON string.`;

    try {
      const promptAIResponse = await llmService.generateCompletion([
        { role: 'system', content: promptEngineeringPrompt },
        { role: 'user', content: prompt }
      ]);

      let parsedPromptInfo;
      try {
        const cleanedText = promptAIResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedPromptInfo = JSON.parse(cleanedText);
      } catch (err) {
        parsedPromptInfo = {
          descriptivePrompt: prompt,
          style: 'digital art',
          explanation: 'Generating your requested image.'
        };
      }

      // Generate random seed for variations
      const seed = Math.floor(Math.random() * 1000000);
      const encodedPrompt = encodeURIComponent(parsedPromptInfo.descriptivePrompt);
      // We will construct the Pollinations AI image URL
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=768&nologo=true&seed=${seed}`;

      // Save to database
      if (userId) {
        await Image.create({
          user: userId,
          url: imageUrl,
          prompt: parsedPromptInfo.descriptivePrompt
        });
      }

      const markdownResponse = `### 🎨 Creative Agent - Image Generated

*Agent Concept: ${parsedPromptInfo.explanation}*
*Style Selected: ${parsedPromptInfo.style.toUpperCase()}*

Here is your generated image:

![${parsedPromptInfo.descriptivePrompt}](${imageUrl})

---
💡 **Download instructions:** You can click the download icon on the top right of the image preview card to save this high-resolution image directly to your machine. It has also been saved to your personal Dashboard gallery.`;

      // Return the response, wait, we can also attach the image URL as a meta-attachment in the stream!
      return markdownResponse;
    } catch (error) {
      console.error('[Creative Agent] Image error:', error);
      return `### Creative Agent Error\nFailed to generate image. Reason: ${error.message}`;
    }
  }
}

export default CreativeAgent;
