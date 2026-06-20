const apiKey = "AIzaSyDqTmf-f2E6qdZCrz_7IcrmoF_fGWpP4GU";
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${apiKey}`;

async function testParser() {
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
                text: "Write a short paragraph about why the sky is blue."
              }
            ]
          }
        ]
      })
    });
    
    console.log("Response Status:", response.status);
    if (!response.ok) {
      const errText = await response.text();
      console.error("API error:", errText);
      return;
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    
    console.log("Starting stream parse...");
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const decoded = decoder.decode(value);
      console.log("Raw chunk received, length:", decoded.length);
      buffer += decoded;
      
      let braceCount = 0;
      let startIdx = -1;
      let i = 0;
      while (i < buffer.length) {
        const char = buffer[i];
        if (char === '{') {
          if (braceCount === 0) {
            startIdx = i;
          }
          braceCount++;
        } else if (char === '}') {
          braceCount--;
          if (braceCount === 0 && startIdx !== -1) {
            const jsonStr = buffer.substring(startIdx, i + 1);
            try {
              const obj = JSON.parse(jsonStr);
              const text = obj.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                process.stdout.write(`[TEXT CHUNK]: ${text}\n`);
              } else {
                console.log("No text in candidate:", JSON.stringify(obj).substring(0, 100));
              }
            } catch (e) {
              console.error("Failed to parse JSON:", e.message);
            }
            buffer = buffer.substring(i + 1);
            i = -1;
            startIdx = -1;
          }
        }
        i++;
      }
    }
    console.log("\nStream finished. Remaining buffer:", buffer);
  } catch (error) {
    console.error("Error:", error);
  }
}

testParser();
