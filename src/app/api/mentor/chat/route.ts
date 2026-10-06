import { NextRequest, NextResponse } from 'next/server';
import { askMentor, MentorPromptContext } from '@/lib/ai/mentorEngine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { task, userCode, terminalOutput, chatHistory, userQuestion, hintLevel, apiKey, provider } = body;

    if (!task || !userQuestion) {
      return NextResponse.json(
        { error: 'Missing required task or userQuestion payload' },
        { status: 400 }
      );
    }

    const context: MentorPromptContext = {
      task,
      userCode: userCode || '',
      terminalOutput: terminalOutput || '',
      chatHistory: chatHistory || [],
      userQuestion,
      hintLevel: hintLevel || 1,
    };

    const mentorResponse = await askMentor(context, apiKey, provider);

    return NextResponse.json({
      success: true,
      message: mentorResponse.message,
      suggestedAction: mentorResponse.suggestedAction,
    });
  } catch (error: any) {
    console.error('Error in mentor chat API route:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
