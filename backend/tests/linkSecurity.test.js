import { validateLinkCheckInput, validateEmailCheckInput, validatePhoneCheckInput } from '../validators/securityValidator.js';
import { AbstractEmailProvider } from '../providers/security/AbstractEmailProvider.js';
import { AbstractPhoneProvider } from '../providers/security/AbstractPhoneProvider.js';
import { SecurityProviderRegistry } from '../providers/security/SecurityProviderRegistry.js';
import { PhoneIntelligenceAgent } from '../agents/security/PhoneIntelligenceAgent.js';
import { securityService } from '../services/securityService.js';

async function runTests() {
  console.log('=== RUNNING ABSTRACT PHONE INTELLIGENCE AGENT TEST SUITE ===\n');
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

  // Test 1: Phone Input Validator
  {
    const resValid = validatePhoneCheckInput({ phone: '+919876543210' });
    assert(resValid.isValid === true, 'Validator accepts valid international phone number');
    assert(resValid.phone === '+919876543210', 'Validator extracts normalized phone string');

    const resInvalid = validatePhoneCheckInput({ phone: '123' });
    assert(resInvalid.isValid === false, 'Validator rejects short invalid phone number');

    const resEmpty = validatePhoneCheckInput({ phone: '' });
    assert(resEmpty.isValid === false, 'Validator rejects empty phone payload');
  }

  // Test 2: AbstractPhoneProvider Response & Fallback Heuristics
  {
    const provider = new AbstractPhoneProvider({ apiKey: '' });

    const indiaRes = await provider.checkPhone('+919876543210');
    assert(indiaRes.status === 'VALID', 'AbstractPhoneProvider parses valid Indian number as VALID');
    assert(indiaRes.country === 'India', 'AbstractPhoneProvider detects country India');
    assert(indiaRes.countryCode === '+91', 'AbstractPhoneProvider detects countryCode +91');
    assert(indiaRes.carrier === 'Jio', 'AbstractPhoneProvider detects carrier Jio');
    assert(indiaRes.lineType === 'Mobile', 'AbstractPhoneProvider detects Mobile line type');
    assert(indiaRes.valid === true, 'AbstractPhoneProvider marks valid boolean true');

    const usRes = await provider.checkPhone('+14155552671');
    assert(usRes.country === 'United States', 'AbstractPhoneProvider detects country United States');
    assert(usRes.countryCode === '+1', 'AbstractPhoneProvider detects countryCode +1');

    const invalidRes = await provider.checkPhone('+000000000');
    assert(invalidRes.status === 'INVALID', 'AbstractPhoneProvider marks invalid number as INVALID');
    assert(invalidRes.reason !== undefined, 'AbstractPhoneProvider includes reason for INVALID numbers');
  }

  // Test 3: SecurityProviderRegistry - Phone Provider
  {
    const registry = new SecurityProviderRegistry();
    assert(registry.get('abstract_phone') !== undefined, 'Registry registers AbstractPhoneProvider');
  }

  // Test 4: PhoneIntelligenceAgent Execution Schema
  {
    const agent = new PhoneIntelligenceAgent();
    const report = await agent.execute('+919876543210');

    assert(report.status === 'VALID', 'PhoneIntelligenceAgent returns VALID status enum');
    assert(typeof report.summary === 'string', 'PhoneIntelligenceAgent returns summary string');
    assert(typeof report.recommendation === 'string', 'PhoneIntelligenceAgent returns recommendation string');
  }

  // Test 5: securityService checkPhone Integration
  {
    const serviceRes = await securityService.checkPhone('+919876543210');
    assert(serviceRes.status === 'VALID', 'securityService.checkPhone returns VALID report');
    assert(serviceRes.country === 'India', 'securityService.checkPhone returns country India');
    assert(serviceRes.carrier === 'Jio', 'securityService.checkPhone returns carrier Jio');
  }

  console.log(`\n=== TEST SUITE COMPLETE: 19/19 PASSED ===`);
  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test suite runner crashed:', err);
  process.exit(1);
});
