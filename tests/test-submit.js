const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');
const path = require('path');

// Create a test file
const testContent = 'This is a test file content';
const testFilePath = path.join(__dirname, 'test-file.txt');
fs.writeFileSync(testFilePath, testContent);

async function testSubmission() {
  const formData = new FormData();
  
  // Add test data
  formData.append('assignmentId', 'test-assignment-' + Date.now());
  formData.append('content', 'This is a test submission at ' + new Date().toISOString());
  
  // Add test file
  formData.append('file-1', fs.createReadStream(testFilePath));
  
  try {
    console.log('Sending test submission...');
    const response = await fetch('http://localhost:3000/api/assignments/submit', {
      method: 'POST',
      body: formData,
      // In a real test, you would include authentication headers here
      // headers: {
      //   ...formData.getHeaders(),
      //   'Authorization': 'Bearer YOUR_AUTH_TOKEN'
      // },
    });
    
    const result = await response.json();
    console.log('Response Status:', response.status);
    console.log('Response Body:', JSON.stringify(result, null, 2));
    
    if (response.ok) {
      console.log('✅ Test passed!');
      // Verify file was uploaded
      if (result.data?.files?.[0]?.path) {
        const filePath = path.join(process.cwd(), 'public', result.data.files[0].path);
        console.log('Uploaded file exists:', fs.existsSync(filePath));
      }
    } else {
      console.error('❌ Test failed with status:', response.status);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Clean up test file
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  }
}

testSubmission();
