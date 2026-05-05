import { Injectable, Logger } from '@nestjs/common';
import { Runner } from '@openai/agents';
import { routerAgent, applyGuardrails } from './agents.logic';

@Injectable()
export class AgentsService {
  private readonly logger = new Logger(AgentsService.name);

  async processRequest(userMessage: string, pdfText: string) {
    try {
      // 1. Guardrail Check
      const guardrailError = applyGuardrails(userMessage);
      if (guardrailError) return { success: false, error: guardrailError };

      // 2. Data Preparation
      const sanitizedText = pdfText.replace(/\d{10,16}/g, '[REDACTED]').trim();
      
      if (sanitizedText.length < 10) {
        return { 
          success: true, 
          data: "The document appears to be empty or unreadable. Please upload a digital PDF.",
          steps: [] 
        };
      }

      // Store in global state for specialist tools
      (global as any).extractedText = sanitizedText;

      this.logger.log(`Starting Agent Runner. Context: ${sanitizedText.length} chars.`);

      // 3. Agentic Execution
      const runner = new Runner();
      const input = `
        USER REQUEST: ${userMessage}
        NOTE: Use your tools to read the document content.
      `;

      // Run the multi-agent delegation
      const result = await runner.run(routerAgent, input, { maxTurns: 10 } as any);

      // --- 4. STEP EXTRACTION (Fixing the TypeScript Type Error) ---
      // We map the raw execution items into a readable format for your frontend trace
      const steps = result.newItems
        .filter(item => 
          item.type === 'message_output_item' || 
          item.type === 'tool_call_item' || 
          item.type === 'handoff_call_item'
        )
        .map((item: any) => {
          const isTool = item.type === 'tool_call_item';
          const isHandoff = item.type === 'handoff_call_item';
          
          return {
            agent: item.agentName || (isTool ? 'Specialist Tool' : 'Router'),
            type: isHandoff ? 'handoff' : (isTool ? 'tool' : 'output'),
            detail: isTool ? item.call?.function?.name : 'Processing request'
          };
        });

      // --- 5. ROBUST OUTPUT EXTRACTION ---
      let finalAnswer: string = '';

      for (let i = result.newItems.length - 1; i >= 0; i--) {
        const item = result.newItems[i];
        
        if (item.type === 'message_output_item') {
          const rawContent = (item as any).rawItem?.content;
          
          if (Array.isArray(rawContent)) {
            const textBlock = rawContent.find((c: any) => 
              (c.type === 'text' || c.type === 'output_text') && 
              c.text && 
              !c.text.includes('transfer_to') && 
              !c.text.includes('Traffic Controller')
            );

            if (textBlock) {
              finalAnswer = textBlock.text.trim();
              break; 
            }
          }
        }
      }

      // 6. Return Data + Steps for your Trace Sidebar
      return {
        success: true,
        data: finalAnswer || "Analysis complete, but no text summary was generated.",
        steps: steps 
      };

    } catch (error: any) {
      this.logger.error(`AgentsService Error: ${error.message}`);
      return {
        success: false,
        error: "An error occurred during agent delegation.",
        steps: []
      };
    }
  }
}