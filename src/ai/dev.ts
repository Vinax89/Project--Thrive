'use server';
import { config } from 'dotenv';
config();

import './flows/receipt-ocr-flow.ts';
import './flows/bill-negotiation-tool.ts';
import './flows/income-viability-flow.ts';
import './flows/ai-powered-financial-education.ts';
import './flows/tax-optimizer-flow.ts';
