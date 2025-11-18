/**
 * Quick JWT Authentication Test Script
 * Run with: node test-jwt.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Test credentials
const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123'
};

let authToken = '';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`)
};

async function testRegister() {
  try {
    log.info('TEST 1: Register new user...');
    const response = await axios.post(`${BASE_URL}/register`, testUser);
    authToken = response.data.token;
    log.success(`Registration successful! Token received: ${authToken.substring(0, 20)}...`);
    return true;
  } catch (error) {
    if (error.response?.status === 400 && error.response.data.error === 'Email already exists') {
      log.warning('User already exists, will try login instead');
      return await testLogin();
    }
    log.error(`Registration failed: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

async function testLogin() {
  try {
    log.info('TEST 2: Login existing user...');
    const response = await axios.post(`${BASE_URL}/login`, {
      email: testUser.email,
      password: testUser.password
    });
    authToken = response.data.token;
    log.success(`Login successful! Token received: ${authToken.substring(0, 20)}...`);
    return true;
  } catch (error) {
    log.error(`Login failed: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

async function testProtectedRouteWithoutToken() {
  try {
    log.info('TEST 3: Access protected route WITHOUT token (should fail)...');
    await axios.get(`${BASE_URL}/api/client/getclients`);
    log.error('UNEXPECTED: Request succeeded without token!');
    return false;
  } catch (error) {
    if (error.response?.status === 401) {
      log.success(`Correctly blocked: ${error.response.data.error}`);
      return true;
    }
    log.error(`Unexpected error: ${error.message}`);
    return false;
  }
}

async function testProtectedRouteWithToken() {
  try {
    log.info('TEST 4: Access protected route WITH token (should work)...');
    const response = await axios.get(`${BASE_URL}/api/client/getclients`, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });
    log.success(`Request successful! Received ${response.data.data?.length || 0} clients`);
    return true;
  } catch (error) {
    log.error(`Request failed: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

async function testInvalidToken() {
  try {
    log.info('TEST 5: Access protected route with INVALID token (should fail)...');
    await axios.get(`${BASE_URL}/api/client/getclients`, {
      headers: {
        Authorization: 'Bearer invalid_token_12345'
      }
    });
    log.error('UNEXPECTED: Request succeeded with invalid token!');
    return false;
  } catch (error) {
    if (error.response?.status === 401) {
      log.success(`Correctly blocked: ${error.response.data.error}`);
      return true;
    }
    log.error(`Unexpected error: ${error.message}`);
    return false;
  }
}

async function testMultipleEndpoints() {
  log.info('TEST 6: Testing multiple protected endpoints...');
  
  const endpoints = [
    '/api/billboard/getbillboards',
    '/api/campaign/getcampaigns',
    '/api/invoice/getinvoices',
    '/api/leaseagreement/getLeaseAgreements'
  ];

  let passCount = 0;
  
  for (const endpoint of endpoints) {
    try {
      await axios.get(`${BASE_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      log.success(`  ${endpoint} - OK`);
      passCount++;
    } catch (error) {
      log.error(`  ${endpoint} - FAILED: ${error.response?.data?.error || error.message}`);
    }
  }
  
  return passCount === endpoints.length;
}

async function runAllTests() {
  console.log('\n' + '='.repeat(60));
  console.log('JWT AUTHENTICATION TEST SUITE');
  console.log('='.repeat(60) + '\n');

  const results = [];

  // Test 1: Register or Login
  results.push(await testRegister());
  console.log('');

  if (!authToken) {
    log.error('Cannot continue tests without token');
    return;
  }

  // Test 2: Protected route without token
  results.push(await testProtectedRouteWithoutToken());
  console.log('');

  // Test 3: Protected route with valid token
  results.push(await testProtectedRouteWithToken());
  console.log('');

  // Test 4: Protected route with invalid token
  results.push(await testInvalidToken());
  console.log('');

  // Test 5: Multiple endpoints
  results.push(await testMultipleEndpoints());
  console.log('');

  // Summary
  console.log('='.repeat(60));
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  if (passed === total) {
    log.success(`ALL TESTS PASSED! (${passed}/${total})`);
  } else {
    log.warning(`SOME TESTS FAILED: ${passed}/${total} passed`);
  }
  console.log('='.repeat(60) + '\n');
}

// Run tests
runAllTests().catch(error => {
  log.error(`Test suite error: ${error.message}`);
  process.exit(1);
});

