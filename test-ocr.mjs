import axios from 'axios';
import FormData from 'form-data';

const MISTRAL_API_KEY = "K5bJNaXYU3aT568cdS9UFMkQOBb3A5Fe";
const MISTRAL_BASE = "https://api.mistral.ai/v1";

async function test() {
  try {
    const buffer = Buffer.from("%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Count 1\n/Kids [3 0 R]\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Resources <<>>\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 47\n>>\nstream\nBT\n/F1 24 Tf\n100 700 Td\n(Hello!) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000216 00000 n\ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n314\n%%EOF\n");
    
    console.log("1. Uploading file");
    const form = new FormData();
    form.append("purpose", "ocr");
    form.append("file", buffer, {
      filename: "test.pdf",
      contentType: "application/pdf",
      knownLength: buffer.length,
    });

    const uploadRes = await axios.post(`${MISTRAL_BASE}/files`, form, {
      headers: {
        Authorization: `Bearer ${MISTRAL_API_KEY}`,
        ...form.getHeaders(),
      },
    });

    const fileId = uploadRes.data.id;
    console.log("Uploaded! ID:", fileId);
    
    await new Promise(r => setTimeout(r, 2500));
    
    console.log("2. Getting signed URL");
    const signedRes = await axios.get(`${MISTRAL_BASE}/files/${fileId}/url`, {
      headers: { Authorization: `Bearer ${MISTRAL_API_KEY}` },
    });
    const signedUrl = signedRes.data.url;
    console.log("Got URL:", signedUrl.substring(0, 50) + "...");
    
    console.log("3. Calling OCR");
    const ocrRes = await axios.post(
      `${MISTRAL_BASE}/ocr`,
      {
        model: "mistral-ocr-latest",
        document: { type: "document_url", document_url: signedUrl },
      },
      {
        headers: { Authorization: `Bearer ${MISTRAL_API_KEY}`, "Content-Type": "application/json" },
      }
    );
    
    console.log("Success! Extracted text:", ocrRes.data.pages?.[0]?.markdown?.substring(0, 100));
  } catch (err) {
    console.error("ERROR:");
    if (err.response) {
      console.error(err.response.status);
      console.error(JSON.stringify(err.response.data, null, 2));
    } else {
      console.error(err.message);
    }
  }
}

test();
