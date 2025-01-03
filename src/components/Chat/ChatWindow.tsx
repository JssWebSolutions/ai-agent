// Update the handleSendMessage function in ChatWindow.tsx
const handleSendMessage = async (text: string) => {
  if (!selectedAgent || isProcessing) return;

  const canSendMessage = await import('../../services/subscription/usage').then(
    module => module.incrementMessageCount(selectedAgent.userId)
  );

  if (!canSendMessage) {
    toast({
      title: 'Message Limit Reached',
      description: 'You have reached your monthly message limit. Please upgrade your plan to continue.',
      type: 'error'
    });
    return;
  }

  const userMessage: Message = {
    id: Date.now().toString(),
    text,
    sender: 'user',
    timestamp: new Date()
  };

  setMessages(prev => [...prev, userMessage]);
  setInputMessage('');
  setIsProcessing(true);
  setIsTyping(true);

  const startTime = Date.now();

  try {
    const response = await getChatResponse(text, selectedAgent);
    const agentMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: response,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, agentMessage]);

    const responseTime = (Date.now() - startTime) / 1000;
    await addInteraction(selectedAgent.id, {
      query: text,
      response,
      responseTime,
      successful: true,
      conversationId: Date.now().toString()
    });

    if ('speechSynthesis' in window) {
      speak(response, selectedAgent);
    }
  } catch (error: any) {
    addMessage({ 
      text: error.message || 'Failed to get response', 
      sender: 'bot' 
    });
  } finally {
    setIsProcessing(false);
    setIsTyping(false);
  }
};