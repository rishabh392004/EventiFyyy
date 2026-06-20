const apiKey = "AIzaSyDqTmf-f2E6qdZCrz_7IcrmoF_fGWpP4GU";
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

async function testGemini() {
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
                text: "Hello! Say test response if you hear me."
              }
            ]
          }
        ]
      })
    });
    
    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error calling Gemini API:", error);
  }
}

testGemini();
