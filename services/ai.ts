import { Message, Attachment } from '../components/ai-sdk/types'

/**
 * AI Provider Interface
 *
 * This interface defines the contract that all AI providers must implement.
 * It supports both simple text chat and multi-modal conversations with attachments.
 */
export interface AIProvider {
  /**
   * Send a message to the AI and get a response
   * @param message - The user's message
   * @param attachments - Optional attachments (images, documents, audio)
   * @param conversationHistory - Optional previous messages for context
   * @returns Promise resolving to the AI's response
   */
  sendMessage(
    message: string,
    attachments?: Attachment[],
    conversationHistory?: Message[]
  ): Promise<string>

  /**
   * Send a message and stream the response
   * @param message - The user's message
   * @param attachments - Optional attachments
   * @param conversationHistory - Optional previous messages
   * @param onChunk - Callback for each chunk of the response
   * @returns Promise resolving when streaming is complete
   */
  streamMessage(
    message: string,
    attachments: Attachment[] | undefined,
    conversationHistory: Message[] | undefined,
    onChunk: (chunk: string) => void
  ): Promise<void>
}

/**
 * Demo AI Provider
 *
 * A simple demo implementation that simulates AI responses.
 * Useful for testing and development without requiring API keys.
 */
export class DemoAIProvider implements AIProvider {
  async sendMessage(
    message: string,
    attachments?: Attachment[],
    conversationHistory?: Message[]
  ): Promise<string> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    let response = `I received your message: "${message}".`

    if (attachments && attachments.length > 0) {
      const attachmentTypes = attachments.map(a => a.type).join(', ')
      response += ` I can see you sent ${attachments.length} attachment(s) (${attachmentTypes}).`
    }

    response += ' This is a demo response. Connect an AI provider for real responses.'

    return response
  }

  async streamMessage(
    message: string,
    attachments: Attachment[] | undefined,
    conversationHistory: Message[] | undefined,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    const fullResponse = await this.sendMessage(message, attachments, conversationHistory)

    // Simulate streaming by sending characters one at a time
    for (let i = 0; i < fullResponse.length; i++) {
      onChunk(fullResponse[i])
      await new Promise(resolve => setTimeout(resolve, 20))
    }
  }
}

/**
 * OpenAI Provider
 *
 * Provider for OpenAI's GPT models with vision capabilities.
 * Requires an API key to be configured via environment variables.
 *
 * SETUP INSTRUCTIONS:
 * 1. Install the OpenAI SDK: `npm install openai`
 * 2. Create a .env file with: EXPO_PUBLIC_OPENAI_API_KEY=your-api-key
 * 3. Uncomment the implementation below
 * 4. Replace DemoAIProvider with OpenAIProvider in your app
 */
export class OpenAIProvider implements AIProvider {
  private apiKey: string
  private model: string

  constructor(apiKey?: string, model: string = 'gpt-4o') {
    // In Expo, use EXPO_PUBLIC_ prefix for environment variables
    this.apiKey = apiKey || process.env.EXPO_PUBLIC_OPENAI_API_KEY || ''
    this.model = model

    if (!this.apiKey) {
      console.warn(
        'OpenAI API key not found. Set EXPO_PUBLIC_OPENAI_API_KEY in your .env file.'
      )
    }
  }

  private async convertAttachmentToBase64(attachment: Attachment): Promise<string> {
    // For images, we need to convert to base64 for OpenAI Vision API
    if (attachment.type === 'image') {
      // In a real implementation, you would:
      // 1. Read the file from the URI
      // 2. Convert to base64
      // 3. Return the base64 string with proper prefix

      // For now, return the URI (this needs to be implemented based on your needs)
      return attachment.uri
    }

    return attachment.uri
  }

  private async prepareMessages(
    message: string,
    attachments?: Attachment[],
    conversationHistory?: Message[]
  ): Promise<any[]> {
    const messages: any[] = []

    // Add conversation history
    if (conversationHistory) {
      for (const msg of conversationHistory) {
        if (msg.role === 'system' || msg.role === 'user' || msg.role === 'assistant') {
          messages.push({
            role: msg.role,
            content: msg.content,
          })
        }
      }
    }

    // Prepare current message with attachments
    if (attachments && attachments.length > 0) {
      const content: any[] = [{ type: 'text', text: message }]

      for (const attachment of attachments) {
        if (attachment.type === 'image') {
          // OpenAI Vision format
          content.push({
            type: 'image_url',
            image_url: {
              url: await this.convertAttachmentToBase64(attachment),
            },
          })
        } else if (attachment.type === 'document') {
          // For documents, you might need to extract text first
          content.push({
            type: 'text',
            text: `[Document: ${attachment.name}]`,
          })
        } else if (attachment.type === 'audio') {
          // For audio, you might need to transcribe first using Whisper
          content.push({
            type: 'text',
            text: `[Audio: ${attachment.name}]`,
          })
        }
      }

      messages.push({
        role: 'user',
        content,
      })
    } else {
      messages.push({
        role: 'user',
        content: message,
      })
    }

    return messages
  }

  async sendMessage(
    message: string,
    attachments?: Attachment[],
    conversationHistory?: Message[]
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // TODO: Uncomment when openai package is installed
    /*
    const OpenAI = require('openai').default
    const openai = new OpenAI({ apiKey: this.apiKey })

    const messages = await this.prepareMessages(message, attachments, conversationHistory)

    const response = await openai.chat.completions.create({
      model: this.model,
      messages,
    })

    return response.choices[0]?.message?.content || 'No response from AI'
    */

    // Fallback to demo mode if OpenAI is not set up
    console.warn('OpenAI integration not fully configured. Using demo mode.')
    const demoProvider = new DemoAIProvider()
    return demoProvider.sendMessage(message, attachments, conversationHistory)
  }

  async streamMessage(
    message: string,
    attachments: Attachment[] | undefined,
    conversationHistory: Message[] | undefined,
    onChunk: (chunk: string) => void
  ): Promise<void> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // TODO: Uncomment when openai package is installed
    /*
    const OpenAI = require('openai').default
    const openai = new OpenAI({ apiKey: this.apiKey })

    const messages = await this.prepareMessages(message, attachments, conversationHistory)

    const stream = await openai.chat.completions.create({
      model: this.model,
      messages,
      stream: true,
    })

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ''
      if (content) {
        onChunk(content)
      }
    }
    */

    // Fallback to demo mode if OpenAI is not set up
    console.warn('OpenAI streaming not fully configured. Using demo mode.')
    const demoProvider = new DemoAIProvider()
    await demoProvider.streamMessage(message, attachments, conversationHistory, onChunk)
  }
}

/**
 * Get the default AI provider
 *
 * Returns DemoAIProvider by default.
 * To use OpenAI, set the EXPO_PUBLIC_OPENAI_API_KEY environment variable.
 */
export function getDefaultProvider(): AIProvider {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY

  if (apiKey) {
    console.log('Using OpenAI provider')
    return new OpenAIProvider(apiKey)
  }

  console.log('Using Demo provider')
  return new DemoAIProvider()
}
