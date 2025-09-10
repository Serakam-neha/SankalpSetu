export async function InvokeLLM(message) {
  // Mock implementation for now
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        content: "This is a mock AI response. In a real implementation, this would connect to an actual LLM service.",
        timestamp: new Date()
      });
    }, 1000);
  });
} 