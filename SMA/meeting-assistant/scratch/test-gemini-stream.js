const apiKey = "AIzaSyDqTmf-f2E6qdZCrz_7IcrmoF_fGWpP4GU";
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${apiKey}`;

async function testGeminiStream() {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: "Tell me a short 3-sentence story about a space traveler."
              }
            ]
          }
        ]
      })
    });
    
    console.log("Status:", response.status);
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      console.log("--- CHUNK START ---");
      console.log(chunk);
      console.log("--- CHUNK END ---");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
  }
}

testGeminiStream();
