import { validateEmailGenerateInput, validateEmailSendInput } from '../validators/emailValidator.js';
import { EmailAgent } from '../agents/email/EmailAgent.js';
import { GmailClient } from '../providers/email/GmailClient.js';
import { emailService } from '../services/emailService.js';

async function runTests() {
  console.log('=== RUNNING GMAIL OAUTH & GMAIL API AGENT TEST SUITE ===\n');
  let passed = 0;
  let total = 0;

  function assert(condition, testName) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
    }
  }

  // Test 1: GmailClient Authorization URL & OAuth Callback
  {
    const client = new GmailClient({ clientId: '' });
    const authUrl = client.getAuthorizationUrl();
    assert(typeof authUrl === 'string' && authUrl.length > 0, 'GmailClient generates authorization URL');

    const authRes = await client.handleOAuthCallback('simulated_dev_oauth_code');
    assert(authRes.connected === true, 'GmailClient exchanges OAuth code for connected state');
    assert(typeof authRes.email === 'string' && authRes.email.includes('@'), 'GmailClient extracts connected Gmail address');
  }

  // Test 2: GmailClient Connection Status & Disconnect
  {
    const client = new GmailClient();
    await client.handleOAuthCallback('simulated_dev_oauth_code');
    
    const statusBefore = await client.getConnectionStatus();
    assert(statusBefore.connected === true, 'getConnectionStatus returns connected true');

    const discRes = await client.disconnect();
    assert(discRes.connected === false, 'disconnect clears Gmail connection state');

  }

  // Test 3: Gmail API MIME Message Encoding & Send
  {
    const client = new GmailClient();
    await client.handleOAuthCallback('simulated_dev_oauth_code');

    const mime = client.createMimeMessage({
      to: 'hr@company.com',
      subject: 'Application Subject',
      body: 'Body text content'
    });

    assert(typeof mime === 'string' && mime.length > 0, 'createMimeMessage returns base64url encoded string');

    const sendRes = await client.sendEmail({
      to: 'hr@company.com',
      subject: 'Application Subject',
      body: 'Body text content'
    });

    assert(sendRes.status === 'SUCCESS', 'GmailClient sendEmail returns SUCCESS status via Gmail API');
  }

  // Test 4: EmailService Integration with Gmail Client
  {
    const authUrl = emailService.getGoogleAuthUrl();
    assert(typeof authUrl === 'string', 'emailService.getGoogleAuthUrl returns auth URL');

    const callbackRes = await emailService.handleGoogleCallback('simulated_dev_oauth_code');
    assert(callbackRes.connected === true, 'emailService.handleGoogleCallback connects account');

    const status = await emailService.getGoogleConnectionStatus();
    assert(status.connected === true, 'emailService.getGoogleConnectionStatus returns connected true');


    const sendRes = await emailService.sendEmail({
      to: 'recruiter@tech.com',
      subject: 'Job Application',
      body: 'Dear Hiring Manager...'
    });
    assert(sendRes.status === 'SUCCESS', 'emailService.sendEmail dispatches email via Gmail API');
  }

  console.log(`\n=== TEST SUITE COMPLETE: ${passed}/${total} PASSED ===`);
  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test suite runner crashed:', err);
  process.exit(1);
});
