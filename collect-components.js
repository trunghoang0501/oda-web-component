#!/usr/bin/env node

/**
 * Script to collect UI components from oda-web and oda-web-admin repositories
 * This script will be used to fetch components via Unblocked API or GitHub
 */

const fs = require('fs');
const path = require('path');

// Component directories to collect
const COMPONENT_DIRS = [
  'src/components/shared-components',
  'src/components/styled-components',
  'src/components/common',
  'src/components/icon',
  'src/components/app',
];

const REPOS = [
  { name: 'oda-web', url: 'https://github.com/trunghoang0501/oda-web.git' },
  { name: 'oda-web-admin', url: 'https://github.com/trunghoang0501/oda-web-admin.git' },
];

console.log('Component collection script initialized');
console.log('Repositories to collect from:', REPOS.map(r => r.name).join(', '));
console.log('Component directories:', COMPONENT_DIRS.join(', '));

// This script will be extended to use Unblocked MCP tools
// or GitHub API to fetch components
