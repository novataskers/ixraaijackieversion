fetch('http://localhost:3000/api/invideo/ixrachat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'hello' }],
    file: {
        base64: Buffer.from('%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n').toString('base64'),
        mimeType: 'application/pdf',
        name: 'test.pdf'
    }
  })
}).then(async r => {
    console.log("STATUS:", r.status);
    console.log("TEXT:", await r.text());
}).catch(e => console.error(e));
