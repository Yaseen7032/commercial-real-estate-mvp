import React, { useMemo, useState, useEffect } from 'react';
import { Routes, Route, Link, NavLink, useParams } from 'react-router-dom';
import { checkBackendHealth } from './services/api';

const properties = [
  {
    id: 1,
    name: 'North Loop Retail Plaza',
    type: 'Retail',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    area: 'Vijayawada',
    size: '2500 sq.ft.',
    rent: '₹1,35,000/month',
    match: 92,
    status: 'Available',
    rep: 'Ananya Rao',
    repCompany: 'UrbanCore Realty',
    parking: true,
    footTraffic: 'High'
  },
  {
    id: 2,
    name: 'MetroFlex Logistics Center',
    type: 'Industrial',
    city: 'Guntur',
    state: 'Andhra Pradesh',
    area: 'Auto Nagar',
    size: '4800 sq.ft.',
    rent: '₹2,20,000/month',
    match: 88,
    status: 'New',
    rep: 'Vikram Nair',
    repCompany: 'Prime Commercial Advisors',
    parking: true,
    footTraffic: 'Medium'
  },
  {
    id: 3,
    name: 'Summit Office Park',
    type: 'Office',
    city: 'Hyderabad',
    state: 'Telangana',
    area: 'Hitech City',
    size: '3200 sq.ft.',
    rent: '₹1,90,000/month',
    match: 95,
    status: 'Available',
    rep: 'Sana Iqbal',
    repCompany: 'SpaceStack Consultants',
    parking: true,
    footTraffic: 'High'
  },
  {
    id: 4,
    name: 'Canal View High Street',
    type: 'Retail',
    city: 'Bengaluru',
    state: 'Karnataka',
    area: 'Koramangala',
    size: '2100 sq.ft.',
    rent: '₹1,60,000/month',
    match: 90,
    status: 'Available',
    rep: 'Rohan P',
    repCompany: 'UrbanNest Realty',
    parking: false,
    footTraffic: 'High'
  },
  {
    id: 5,
    name: 'Market Square Plaza',
    type: 'Shopping Center',
    city: 'Chennai',
    state: 'Tamil Nadu',
    area: 'Teynampet',
    size: '5400 sq.ft.',
    rent: '₹2,80,000/month',
    match: 87,
    status: 'Under Review',
    rep: 'Neha Varma',
    repCompany: 'Crestlane Properties',
    parking: true,
    footTraffic: 'High'
  },
  {
    id: 6,
    name: 'Riverside Commercial Hub',
    type: 'Commercial Building',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    area: 'Moghalrajpuram',
    size: '4100 sq.ft.',
    rent: '₹2,10,000/month',
    match: 91,
    status: 'Available',
    rep: 'Karthik Reddy',
    repCompany: 'Southline Property Group',
    parking: true,
    footTraffic: 'Medium'
  }
];

const leads = [
  { id: 1, retailer: 'Apex Retail Group', property: 'North Loop Retail Plaza', city: 'Vijayawada', status: 'New', date: '2026-10-01' },
  { id: 2, retailer: 'BluePeak Logistics', property: 'MetroFlex Logistics Center', city: 'Guntur', status: 'Contacted', date: '2026-10-04' },
  { id: 3, retailer: 'Northline Ventures', property: 'Summit Office Park', city: 'Hyderabad', status: 'Site Visit', date: '2026-10-06' }
];

const contactRequests = [
  { id: 1, property: 'North Loop Retail Plaza', rep: 'Ananya Rao', status: 'New', date: 'Today' },
  { id: 2, property: 'Canal View High Street', rep: 'Rohan P', status: 'In Discussion', date: '2 days ago' },
  { id: 3, property: 'Summit Office Park', rep: 'Sana Iqbal', status: 'Closed', date: '1 week ago' }
];

const requirementList = [
  { id: 1, title: 'Retail Store - Vijayawada', location: 'Vijayawada', size: '2000-3000 sq.ft.', budget: 'Up to ₹1,50,000/month', type: 'Retail', status: 'Active' },
  { id: 2, title: 'Quick Service Outlet', location: 'Guntur', size: '1200-1800 sq.ft.', budget: 'Up to ₹80,000/month', type: 'Retail', status: 'Draft' }
];

const myProperties = [
  { id: 1, name: 'Prime Street Retail', location: 'Vijayawada', size: '3200 sq.ft.', rent: '₹1,80,000/month', status: 'Active' },
  { id: 2, name: 'Urban Square Plaza', location: 'Hyderabad', size: '4500 sq.ft.', rent: '₹2,40,000/month', status: 'Available' }
];

const css = `
  :root {
    --locentra-bg: #f5f7fb;
    --locentra-surface: #ffffff;
    --locentra-surface-alt: #eef4ff;
    --locentra-line: #dfe7f4;
    --locentra-text: #0f172a;
    --locentra-text-soft: #475569;
    --locentra-muted: #64748b;
    --locentra-primary: #1d4ed8;
    --locentra-primary-strong: #163aa8;
    --locentra-primary-soft: #eaf1ff;
    --locentra-success: #1ea96a;
    --locentra-success-soft: #eafaf2;
    --locentra-warning: #d49a18;
    --locentra-warning-soft: #fff6dc;
    --locentra-danger: #d6374a;
    --locentra-shadow: 0 18px 42px rgba(15, 23, 42, 0.08);
    --locentra-shadow-soft: 0 12px 30px rgba(15, 23, 42, 0.04);
    --radius-xl: 28px;
    --radius-lg: 22px;
    --radius-md: 16px;
    --radius-sm: 12px;
  }

  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    margin: 0;
    background:
      radial-gradient(circle at top left, rgba(29, 78, 216, 0.08), transparent 40%),
      var(--locentra-bg);
    color: var(--locentra-text);
    font-family: Inter, "Segoe UI", sans-serif;
  }

  a { text-decoration: none; color: inherit; }
  button, input, select, textarea { font: inherit; }
  img { display: block; max-width: 100%; }

  .locentra-app {
    min-height: 100vh;
  }

  .container {
    width: min(1200px, calc(100% - 32px));
    margin: 0 auto;
  }

  .topbar {
    position: sticky;
    top: 0;
    z-index: 40;
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border-bottom: 1px solid rgba(145, 163, 188, 0.22);
  }

  .topbar-inner {
    width: min(1200px, calc(100% - 32px));
    margin: 0 auto;
    padding: 18px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    color: var(--locentra-text);
  }

  .brand-mark {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: grid;
    place-items: center;
    background: linear-gradient(135deg, var(--locentra-primary), #66a3ff);
    color: white;
    font-weight: 800;
    box-shadow: 0 12px 28px rgba(29, 78, 216, 0.25);
  }

  .brand-name {
    display: flex;
    flex-direction: column;
    line-height: 1.1;
  }

  .brand-name strong {
    font-size: 1.08rem;
    letter-spacing: -0.03em;
  }

  .brand-name span {
    font-size: 0.68rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--locentra-muted);
  }

  .main-nav {
    display: flex;
    align-items: center;
    gap: 22px;
    flex-wrap: wrap;
  }

  .main-nav a {
    color: var(--locentra-text-soft);
    font-weight: 600;
    transition: color 0.2s ease;
    position: relative;
  }

  .main-nav a:hover {
    color: var(--locentra-primary);
  }

  .main-nav a.active {
    color: var(--locentra-primary);
  }

  .main-nav a.active::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -6px;
    height: 2px;
    background: var(--locentra-primary);
    border-radius: 999px;
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .btn {
    appearance: none;
    border: 0;
    border-radius: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 18px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  }

  .btn:hover {
    transform: translateY(-1px);
  }

  .btn-primary {
    background: linear-gradient(135deg, var(--locentra-primary), var(--locentra-primary-strong));
    color: white;
    box-shadow: 0 16px 32px rgba(29, 78, 216, 0.22);
  }

  .btn-secondary {
    background: white;
    color: var(--locentra-text);
    border: 1px solid var(--locentra-line);
    box-shadow: var(--locentra-shadow-soft);
  }

  .btn-soft {
    background: var(--locentra-primary-soft);
    color: var(--locentra-primary);
  }

  .btn-plain {
    background: rgba(15, 23, 42, 0.04);
    color: var(--locentra-text);
  }

  .btn-small {
    padding: 8px 12px;
    font-size: 0.82rem;
  }

  .full-width { width: 100%; }

  .page {
    padding: 42px 0 60px;
  }

  .section {
    margin-top: 36px;
  }

  .eyebrow {
    margin: 0 0 10px;
    color: var(--locentra-primary);
    font-size: 0.72rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    font-weight: 800;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 20px;
  }

  .section-header h2 {
    margin: 0;
    font-size: clamp(2rem, 2.8vw, 2.8rem);
    line-height: 1.1;
    letter-spacing: -0.06em;
  }

  .link {
    color: var(--locentra-primary);
    font-weight: 700;
  }

  .hero {
    padding-top: 32px;
  }

  .hero-grid {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 24px;
    align-items: stretch;
  }

  .hero-panel {
    background: rgba(255,255,255,0.95);
    border: 1px solid var(--locentra-line);
    border-radius: 30px;
    box-shadow: var(--locentra-shadow);
    padding: 34px 30px;
  }

  .hero-panel h1 {
    margin: 0;
    font-size: clamp(2.8rem, 5vw, 4.6rem);
    line-height: 0.98;
    letter-spacing: -0.08em;
  }

  .hero-panel p {
    margin: 18px 0 24px;
    color: var(--locentra-text-soft);
    font-size: 1.06rem;
    line-height: 1.8;
    max-width: 620px;
  }

  .hero-actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 26px;
  }

  .hero-search {
    max-width: 760px;
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr 1fr auto;
    gap: 10px;
    padding: 12px;
    border-radius: 18px;
    background: linear-gradient(180deg, rgba(238,244,255,0.9), rgba(255,255,255,0.95));
    border: 1px solid var(--locentra-line);
  }

  .hero-search input,
  .hero-search select,
  .field input,
  .field select,
  .field textarea {
    width: 100%;
    padding: 13px 14px;
    border-radius: 12px;
    border: 1px solid var(--locentra-line);
    background: white;
    color: var(--locentra-text);
    outline: none;
  }

  .hero-search input:focus,
  .hero-search select:focus,
  .field input:focus,
  .field select:focus,
  .field textarea:focus {
    border-color: rgba(29, 78, 216, 0.4);
    box-shadow: 0 0 0 4px rgba(29, 78, 216, 0.08);
  }

  .hero-visual {
    position: relative;
    overflow: hidden;
    border-radius: 30px;
    background: linear-gradient(135deg, #12284a 0%, #1d4ed8 52%, #4ea0ff 100%);
    box-shadow: 0 24px 52px rgba(29, 78, 216, 0.18);
    padding: 26px;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 410px;
  }

  .hero-visual::before {
    content: '';
    position: absolute;
    inset: 20px auto auto -20px;
    width: 220px;
    height: 220px;
    background: rgba(255,255,255,0.14);
    filter: blur(18px);
    border-radius: 50%;
  }

  .hero-visual-head {
    position: relative;
    z-index: 1;
  }

  .mini-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 7px 10px;
    border-radius: 999px;
    background: rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.92);
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-weight: 700;
  }

  .hero-visual h2 {
    margin: 18px 0 0;
    font-size: clamp(2rem, 3vw, 2.9rem);
    line-height: 1.05;
    letter-spacing: -0.06em;
  }

  .hero-card-stack {
    position: relative;
    z-index: 1;
    margin-top: 18px;
  }

  .float-card {
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.14);
    backdrop-filter: blur(10px);
    border-radius: 18px;
    padding: 16px 18px;
    box-shadow: 0 16px 32px rgba(15, 23, 42, 0.12);
  }

  .float-card.top {
    width: min(300px, 80%);
    margin-left: auto;
  }

  .float-card .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .float-card .label {
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.7);
  }

  .float-card strong {
    font-size: 1.6rem;
    letter-spacing: -0.05em;
  }

  .sparkline {
    margin-top: 16px;
    height: 92px;
    display: flex;
    align-items: flex-end;
    gap: 12px;
  }

  .sparkline span {
    display: block;
    width: 14%;
    border-radius: 10px 10px 0 0;
    background: rgba(255,255,255,0.95);
  }

  .sparkline span:nth-child(1) { height: 32%; }
  .sparkline span:nth-child(2) { height: 44%; }
  .sparkline span:nth-child(3) { height: 38%; }
  .sparkline span:nth-child(4) { height: 72%; }
  .sparkline span:nth-child(5) { height: 64%; }
  .sparkline span:nth-child(6) { height: 92%; }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(180px, 1fr));
    gap: 18px;
    margin-top: 30px;
  }

  .stat-card {
    background: white;
    border: 1px solid var(--locentra-line);
    border-radius: 22px;
    box-shadow: var(--locentra-shadow-soft);
    padding: 22px 18px;
  }

  .stat-card span {
    display: block;
    color: var(--locentra-muted);
    font-size: 0.8rem;
    margin-bottom: 12px;
  }

  .stat-card strong {
    display: block;
    font-size: clamp(1.8rem, 2vw, 2.3rem);
    letter-spacing: -0.06em;
    margin-bottom: 8px;
  }

  .stat-card small {
    color: var(--locentra-success);
    font-weight: 700;
  }

  .feature-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
  }

  .feature-card {
    background: white;
    border: 1px solid var(--locentra-line);
    border-radius: 24px;
    padding: 26px 22px;
    box-shadow: var(--locentra-shadow-soft);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .feature-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--locentra-shadow);
  }

  .feature-icon {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    display: grid;
    place-items: center;
    background: var(--locentra-primary-soft);
    color: var(--locentra-primary);
    font-size: 1.2rem;
    margin-bottom: 18px;
  }

  .feature-card h3 {
    margin: 0 0 10px;
    font-size: 1.4rem;
    letter-spacing: -0.04em;
  }

  .feature-card p {
    margin: 0;
    color: var(--locentra-text-soft);
    line-height: 1.7;
  }

  .steps-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 18px;
  }

  .step-card {
    background: white;
    border: 1px solid var(--locentra-line);
    border-radius: 22px;
    padding: 24px 18px;
    box-shadow: var(--locentra-shadow-soft);
  }

  .step-number {
    width: 42px;
    height: 42px;
    display: grid;
    place-items: center;
    border-radius: 12px;
    background: var(--locentra-primary-soft);
    color: var(--locentra-primary);
    font-weight: 800;
    margin-bottom: 16px;
  }

  .step-card h3 {
    margin: 0 0 10px;
    font-size: 1.18rem;
    letter-spacing: -0.03em;
  }

  .step-card p {
    margin: 0;
    color: var(--locentra-text-soft);
    line-height: 1.7;
  }

  .property-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 22px;
  }

  .property-card {
    background: white;
    border: 1px solid var(--locentra-line);
    border-radius: 24px;
    overflow: hidden;
    box-shadow: var(--locentra-shadow-soft);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .property-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--locentra-shadow);
  }

  .property-visual {
    position: relative;
    height: 210px;
    background:
      linear-gradient(135deg, rgba(19, 35, 61, 0.14), rgba(29, 78, 216, 0.08)),
      linear-gradient(135deg, #dfeafe 0%, #cfe1ff 45%, #bfe2fb 100%);
    border-bottom: 1px solid var(--locentra-line);
    overflow: hidden;
  }

  .property-visual::before {
    content: '';
    position: absolute;
    inset: 16px 16px auto auto;
    width: 120px;
    height: 120px;
    border-radius: 20px;
    background: rgba(255,255,255,0.32);
    border: 1px solid rgba(255,255,255,0.4);
    transform: rotate(12deg);
  }

  .property-visual::after {
    content: '';
    position: absolute;
    left: 22px;
    right: 22px;
    bottom: 24px;
    height: 72px;
    border-radius: 14px;
    background: linear-gradient(180deg, rgba(255,255,255,0.18), rgba(15,23,42,0.14));
  }

  .property-body {
    padding: 18px 18px 20px;
  }

  .property-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
  }

  .property-head h3 {
    margin: 0 0 6px;
    font-size: 1.15rem;
    letter-spacing: -0.03em;
  }

  .property-head p {
    margin: 0;
    color: var(--locentra-muted);
    font-size: 0.86rem;
  }

  .match-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--locentra-primary-soft);
    color: var(--locentra-primary);
    border-radius: 999px;
    padding: 7px 10px;
    font-size: 0.72rem;
    font-weight: 800;
    white-space: nowrap;
  }

  .property-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 18px;
    color: var(--locentra-text-soft);
    font-size: 0.82rem;
  }

  .property-footer {
    margin-top: 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 7px 10px;
    border-radius: 999px;
    background: var(--locentra-success-soft);
    color: var(--locentra-success);
    font-size: 0.72rem;
    font-weight: 800;
  }

  .card-shell {
    background: white;
    border: 1px solid var(--locentra-line);
    border-radius: 24px;
    box-shadow: var(--locentra-shadow-soft);
    overflow: hidden;
  }

  .cta-card {
    margin-top: 38px;
    background: linear-gradient(135deg, #0f1f39 0%, #1d4ed8 100%);
    border-radius: 30px;
    padding: 30px 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    color: white;
    box-shadow: 0 22px 50px rgba(29, 78, 216, 0.18);
  }

  .cta-card h3 {
    margin: 0 0 8px;
    font-size: clamp(1.8rem, 2.5vw, 2.6rem);
    letter-spacing: -0.06em;
  }

  .cta-card p {
    margin: 0;
    color: rgba(255,255,255,0.8);
  }

  .cta-actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }

  .footer {
    margin-top: 60px;
    border-top: 1px solid rgba(148, 163, 184, 0.3);
    background: rgba(255,255,255,0.5);
  }

  .footer-inner {
    width: min(1200px, calc(100% - 32px));
    margin: 0 auto;
    padding: 26px 0 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    color: var(--locentra-text-soft);
  }

  .footer-links {
    display: flex;
    align-items: center;
    gap: 18px;
    flex-wrap: wrap;
  }

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 22px;
  }

  .page-header h1 {
    margin: 0;
    font-size: clamp(2.2rem, 4vw, 3rem);
    letter-spacing: -0.06em;
  }

  .filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin: 18px 0 24px;
  }

  .chip {
    border: 1px solid var(--locentra-line);
    background: white;
    color: var(--locentra-text);
    border-radius: 999px;
    padding: 9px 14px;
    font-weight: 700;
    cursor: pointer;
  }

  .chip.active {
    background: var(--locentra-primary);
    border-color: var(--locentra-primary);
    color: white;
  }

  .dashboard-grid {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 20px;
    min-height: calc(100vh - 150px);
  }

  .sidebar {
    background: white;
    border: 1px solid var(--locentra-line);
    border-radius: 24px;
    box-shadow: var(--locentra-shadow-soft);
    padding: 18px 14px;
    height: fit-content;
  }

  .sidebar h3 {
    margin: 0 0 18px;
    padding: 0 8px;
    font-size: 1.1rem;
  }

  .side-nav {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .side-link {
    padding: 11px 12px;
    border-radius: 12px;
    color: var(--locentra-text-soft);
    font-weight: 600;
  }

  .side-link.active {
    background: var(--locentra-primary-soft);
    color: var(--locentra-primary);
  }

  .content-panel {
    background: white;
    border: 1px solid var(--locentra-line);
    border-radius: 24px;
    box-shadow: var(--locentra-shadow-soft);
    padding: 24px;
  }

  .stats-row {
    display: grid;
    grid-template-columns: repeat(4, minmax(150px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }

  .two-col {
    display: grid;
    grid-template-columns: 1.25fr 1fr;
    gap: 20px;
  }

  .list-stack {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .list-row {
    display: grid;
    grid-template-columns: 1.3fr 0.8fr auto;
    gap: 8px;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid var(--locentra-line);
  }

  .list-row:last-child { border-bottom: 0; }

  .list-row strong, .list-row small {
    display: block;
  }

  .list-row strong {
    font-size: 0.98rem;
  }

  .list-row small {
    color: var(--locentra-muted);
    margin-top: 4px;
  }

  .label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 6px 10px;
    border-radius: 999px;
    background: rgba(29, 78, 216, 0.08);
    color: var(--locentra-primary);
    font-size: 0.72rem;
    font-weight: 800;
  }

  .detail-layout {
    display: grid;
    grid-template-columns: 1.2fr 0.8fr;
    gap: 24px;
  }

  .detail-gallery {
    height: 440px;
    background: linear-gradient(135deg, #dff0ff 0%, #b7d6ff 100%);
    border: 1px solid var(--locentra-line);
    border-radius: 30px;
    box-shadow: var(--locentra-shadow-soft);
    position: relative;
    overflow: hidden;
  }

  .detail-gallery::before {
    content: '';
    position: absolute;
    inset: 20px 20px auto auto;
    width: 160px;
    height: 160px;
    border-radius: 24px;
    background: rgba(255,255,255,0.28);
    transform: rotate(12deg);
  }

  .detail-gallery::after {
    content: '';
    position: absolute;
    left: 28px;
    right: 28px;
    bottom: 28px;
    height: 100px;
    border-radius: 18px;
    background: linear-gradient(180deg, rgba(255,255,255,0.18), rgba(15,23,42,0.12));
  }

  .detail-card {
    background: white;
    border: 1px solid var(--locentra-line);
    border-radius: 26px;
    padding: 24px;
    box-shadow: var(--locentra-shadow-soft);
  }

  .detail-card h1 {
    margin: 0 0 12px;
    font-size: clamp(2.1rem, 3vw, 3.2rem);
    letter-spacing: -0.06em;
  }

  .detail-card p {
    margin: 0;
    color: var(--locentra-text-soft);
  }

  .detail-metrics {
    margin: 24px 0;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }

  .metric-box {
    background: var(--locentra-surface-alt);
    border: 1px solid var(--locentra-line);
    border-radius: 18px;
    padding: 14px 12px;
  }

  .metric-box strong {
    display: block;
    font-size: 1.14rem;
    margin-bottom: 6px;
  }

  .metric-box span {
    color: var(--locentra-muted);
    font-size: 0.8rem;
  }

  .detail-actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 16px;
  }

  .form-panel {
    max-width: 760px;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
  }

  .field label {
    font-weight: 700;
  }

  .field textarea {
    min-height: 110px;
    resize: vertical;
  }

  .progress {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }

  .progress-step {
    flex: 1;
    min-width: 120px;
    padding: 8px 10px;
    border-radius: 999px;
    background: var(--locentra-primary-soft);
    color: var(--locentra-primary);
    text-align: center;
    font-size: 0.78rem;
    font-weight: 800;
  }

  .progress-step.active {
    background: var(--locentra-primary);
    color: white;
  }

  .auth-shell {
    min-height: calc(100vh - 120px);
    display: grid;
    place-items: center;
    padding: 40px 20px;
  }

  .auth-card {
    width: min(100%, 480px);
    background: white;
    border: 1px solid var(--locentra-line);
    border-radius: 28px;
    box-shadow: var(--locentra-shadow);
    padding: 28px;
  }

  .auth-card h1 {
    margin: 0 0 12px;
    font-size: clamp(2rem, 4vw, 2.6rem);
    letter-spacing: -0.06em;
  }

  .auth-card p {
    color: var(--locentra-text-soft);
    margin-bottom: 18px;
  }

  .auth-lnk {
    color: var(--locentra-primary);
    font-weight: 700;
  }

  @media (max-width: 1000px) {
    .hero-grid,
    .detail-layout,
    .two-col,
    .dashboard-grid {
      grid-template-columns: 1fr;
    }

    .property-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .steps-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .nav {
      display: none;
    }
  }

  @media (max-width: 760px) {
    .topbar-inner {
      width: min(100% - 20px, 1200px);
    }

    .hero-search {
      grid-template-columns: 1fr;
    }

    .stats-grid,
    .property-grid,
    .steps-grid,
    .stats-row,
    .feature-grid {
      grid-template-columns: 1fr;
    }

    .btn {
      width: 100%;
    }

    .nav-actions {
      display: none;
    }

    .cta-card,
    .page-header,
    .section-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .hero-panel {
      padding: 24px 18px;
    }

    .hero-visual {
      min-height: 340px;
      padding: 18px;
    }
  }
`;

function Logo() {
  return (
    <div className="brand">
      <div className="brand-mark">L</div>
      <div className="brand-name">
        <strong>Locentra</strong>
        <span>Site selection</span>
      </div>
    </div>
  );
}

function Navbar() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Logo />

        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/properties">Properties</NavLink>
          <NavLink to="/how-it-works">How It Works</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>

        <div className="nav-actions">
          <Link to="/login" className="btn btn-secondary">Login</Link>
          <Link to="/register" className="btn btn-primary">Get Started</Link>
        </div>
      </div>
    </header>
  );
}

function HomePage() {
  const valueStats = [
    { label: 'Properties', value: '248' },
    { label: 'Locations', value: '31' },
    { label: 'Retailers', value: '1.2k' },
    { label: 'Representatives', value: '96' }
  ];

  return (
    <div className="page">
      <div className="container">
        <section className="hero">
          <div className="hero-grid">
            <div className="hero-panel">
              <p className="eyebrow">Commercial real estate, simplified</p>
              <h1>Find the Right Location for Your Business</h1>
              <p>
                Discover commercial properties that match your business requirements and connect
                with local tenant representatives with real confidence.
              </p>

              <div className="hero-actions">
                <Link to="/properties" className="btn btn-primary">Find Properties</Link>
                <Link to="/register" className="btn btn-secondary">List Your Property</Link>
              </div>

              <div className="hero-search">
                <input type="text" value="Vijayawada" readOnly />
                <select defaultValue="Retail">
                  <option>Retail</option>
                  <option>Office</option>
                  <option>Industrial</option>
                  <option>Shopping Center</option>
                </select>
                <input type="text" value="2,000–3,000 sq.ft." readOnly />
                <input type="text" value="₹1.5L/month" readOnly />
                <button type="button" className="btn btn-primary">Search</button>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-visual-head">
                <span className="mini-badge">Market signal</span>
                <h2>High-potential spaces with real demand</h2>
              </div>

              <div className="hero-card-stack">
                <div className="float-card top">
                  <div className="row">
                    <span className="label">Match</span>
                    <strong>92%</strong>
                  </div>
                </div>

                <div className="sparkline" aria-hidden="true">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>

          <div className="stats-grid">
            {valueStats.map((item) => (
              <div key={item.label} className="stat-card">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <small>+12.4%</small>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <h2>Everything you need to find your next location.</h2>
          </div>

          <div className="steps-grid">
            {[
              ['Tell us what you need', 'Define your city, budget, size, and property type to get curated matches.'],
              ['Discover suitable properties', 'Compare locations based on fit, demand, visibility, parking, and lease terms.'],
              ['Connect with a representative', 'Move faster with trusted tenant representatives who understand the market.'],
              ['Move forward confidently', 'Review, shortlist, and secure the right location for your next growth step.']
            ].map(([title, description], index) => (
              <div className="step-card" key={title}>
                <div className="step-number">{index + 1}</div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <h2>Why Locentra</h2>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">◎</div>
              <h3>Smart Property Search</h3>
              <p>Search cities, corridors, and business-focused property types with clear fit criteria.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <h3>Requirement-Based Matching</h3>
              <p>Instantly compare locations against your budget, size, parking, foot traffic, and more.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">◌</div>
              <h3>Local Representatives</h3>
              <p>Connect with trusted local experts who understand area demand and commercial opportunities.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">◍</div>
              <h3>Simple Lead Management</h3>
              <p>Keep track of saved properties, contact requests, and opportunities from one place.</p>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <h2>Featured properties</h2>
            <Link to="/properties" className="link">View all</Link>
          </div>

          <div className="property-grid">
            {properties.slice(0, 3).map((property) => (
              <article className="property-card" key={property.id}>
                <div className="property-visual" />
                <div className="property-body">
                  <div className="property-head">
                    <div>
                      <h3>{property.name}</h3>
                      <p>{property.city}, {property.state}</p>
                    </div>
                    <span className="match-badge">{property.match}% match</span>
                  </div>

                  <div className="property-meta">
                    <span>{property.type}</span>
                    <span>{property.size}</span>
                    <span>{property.rent}</span>
                  </div>

                  <div className="property-footer">
                    <span className="status-pill">{property.status}</span>
                    <Link to={`/properties/${property.id}`} className="link">View details</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="cta-card">
            <div>
              <h3>Ready to find your next business location?</h3>
              <p>Locate the right commercial opportunity with speed, clarity, and confidence.</p>
            </div>

            <div className="cta-actions">
              <Link to="/register" className="btn btn-primary">Get Started</Link>
              <Link to="/properties" className="btn btn-secondary">Explore listings</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function HowItWorksPage() {
  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <p className="eyebrow">Process</p>
            <h1>How Locentra Works</h1>
          </div>
        </div>

        <div className="steps-grid">
          {[
            ['Tell us what you need', 'Share your city, size, budget, and property type so we can narrow the right opportunities.'],
            ['Discover suitable properties', 'View high-fit listings and compare them across rent, footprint, traffic, and parking.'],
            ['Connect with a representative', 'Reach out to a local specialist and request detailed property information.'],
            ['Move forward with confidence', 'Shortlist, evaluate, and decide quickly with a clearer understanding of the market.']
          ].map(([title, description], index) => (
            <div className="step-card" key={title}>
              <div className="step-number">{index + 1}</div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <p className="eyebrow">About</p>
            <h1>Built for smarter location decisions.</h1>
          </div>
        </div>

        <div className="feature-card">
          <p>
            Locentra helps businesses discover, compare, and pursue commercial spaces with more
            clarity. It brings together requirement-driven discovery, local market insight, and a
            smoother path to connect with tenant representatives and finalize the best location for
            growth.
          </p>
        </div>
      </div>
    </div>
  );
}

function LoginPage() {
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <p className="eyebrow">Welcome back</p>
        <h1>Sign in to continue</h1>

        <div className="field">
          <label>Email</label>
          <input type="email" placeholder="you@example.com" />
        </div>

        <div className="field">
          <label>Password</label>
          <input type="password" placeholder="••••••••" />
        </div>

        <div className="row-between" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '20px' }}>
          <label><input type="checkbox" /> Remember me</label>
          <a href="#" className="auth-lnk">Forgot password?</a>
        </div>

        <Link to="/retailer-dashboard" className="btn btn-primary full-width">Sign In</Link>

        <p style={{ textAlign: 'center', marginTop: '18px' }}>
          Don’t have an account? <Link to="/register" className="auth-lnk">Create account</Link>
        </p>
      </div>
    </div>
  );
}

function RegisterPage() {
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <p className="eyebrow">Create account</p>
        <h1>Create your Locentra account</h1>

        <div className="field">
          <label>Full Name</label>
          <input type="text" placeholder="Your full name" />
        </div>

        <div className="field">
          <label>Company Name</label>
          <input type="text" placeholder="Your company" />
        </div>

        <div className="field">
          <label>Email</label>
          <input type="email" placeholder="you@example.com" />
        </div>

        <div className="field">
          <label>Phone</label>
          <input type="tel" placeholder="+91 98765 43210" />
        </div>

        <div className="field">
          <label>Password</label>
          <input type="password" placeholder="Enter password" />
        </div>

        <div className="field">
          <label>Confirm Password</label>
          <input type="password" placeholder="Confirm password" />
        </div>

        <Link to="/retailer-dashboard" className="btn btn-primary full-width">Create Account</Link>

        <p style={{ textAlign: 'center', marginTop: '18px' }}>
          Already have an account? <Link to="/login" className="auth-lnk">Login</Link>
        </p>
      </div>
    </div>
  );
}

function PropertiesPage() {
  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <p className="eyebrow">Discover</p>
            <h1>Find your next location</h1>
          </div>
        </div>

        <div className="filter-bar">
          <button className="chip active" type="button">All</button>
          <button className="chip" type="button">Retail</button>
          <button className="chip" type="button">Office</button>
          <button className="chip" type="button">Industrial</button>
        </div>

        <div className="property-grid">
          {properties.map((property) => (
            <article className="property-card" key={property.id}>
              <div className="property-visual" />
              <div className="property-body">
                <div className="property-head">
                  <div>
                    <h3>{property.name}</h3>
                    <p>{property.city}, {property.state}</p>
                  </div>
                  <span className="match-badge">{property.match}% match</span>
                </div>

                <div className="property-meta">
                  <span>{property.type}</span>
                  <span>{property.size}</span>
                  <span>{property.rent}</span>
                </div>

                <div className="property-footer">
                  <span className="status-pill">{property.status}</span>
                  <Link to={`/properties/${property.id}`} className="link">View details</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function PropertyDetailsPage() {
  const { id } = useParams();
  const property = properties.find((item) => Number(item.id) === Number(id)) || properties[0];

  return (
    <div className="page">
      <div className="container">
        <div className="detail-layout">
          <div className="detail-gallery" />

          <div className="detail-card">
            <p className="eyebrow">{property.type}</p>
            <h1>{property.name}</h1>
            <p>{property.city}, {property.state}</p>

            <div className="detail-metrics">
              <div className="metric-box">
                <strong>{property.size}</strong>
                <span>Size</span>
              </div>
              <div className="metric-box">
                <strong>{property.rent}</strong>
                <span>Rent</span>
              </div>
              <div className="metric-box">
                <strong>{property.match}%</strong>
                <span>Match score</span>
              </div>
            </div>

            <div className="detail-actions">
              <button type="button" className="btn btn-primary">Contact representative</button>
              <button type="button" className="btn btn-secondary">Save property</button>
            </div>

            <div className="feature-card">
              <h3 style={{ marginTop: 0, marginBottom: 12 }}>Property information</h3>
              <ul className="feature-list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--locentra-text-soft)' }}>
                <li>Parking: {property.parking ? 'Available' : 'Not available'}</li>
                <li>Foot traffic: {property.footTraffic}</li>
                <li>Availability: {property.status}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RetailerDashboardPage() {
  return (
    <div className="page">
      <div className="container">
        <div className="dashboard-grid">
          <aside className="sidebar">
            <h3>Retailer</h3>
            <div className="side-nav">
              <NavLink to="/retailer-dashboard" className="side-link active">Dashboard</NavLink>
              <NavLink to="/create-requirement" className="side-link">My Requirements</NavLink>
              <NavLink to="/properties" className="side-link">Find Properties</NavLink>
              <NavLink to="/saved" className="side-link">Saved Properties</NavLink>
              <NavLink to="/contact-requests" className="side-link">Contact Requests</NavLink>
              <NavLink to="/login" className="side-link">Profile</NavLink>
            </div>
          </aside>

          <main className="content-panel">
            <div className="page-header">
              <div>
                <p className="eyebrow">Good morning</p>
                <h1>Find the right location for your next store.</h1>
              </div>
              <Link to="/create-requirement" className="btn btn-primary">+ Create requirement</Link>
            </div>

            <div className="stats-row">
              <div className="stat-card">
                <span>Active Requirements</span>
                <strong>2</strong>
                <small>+1 this month</small>
              </div>
              <div className="stat-card">
                <span>Saved Properties</span>
                <strong>8</strong>
                <small>+3 this week</small>
              </div>
              <div className="stat-card">
                <span>New Matches</span>
                <strong>12</strong>
                <small>+7 this week</small>
              </div>
              <div className="stat-card">
                <span>Contact Requests</span>
                <strong>3</strong>
                <small>2 pending</small>
              </div>
            </div>

            <div className="two-col">
              <div className="feature-card">
                <div className="section-header" style={{ marginBottom: 14 }}>
                  <h3 style={{ margin: 0 }}>My requirements</h3>
                  <Link to="/create-requirement" className="link">View all</Link>
                </div>

                <div className="list-stack">
                  {requirementList.map((req) => (
                    <div key={req.id} className="list-row">
                      <div>
                        <strong>{req.title}</strong>
                        <small>{req.location}</small>
                      </div>
                      <span className="label">{req.status}</span>
                      <button type="button" className="btn btn-secondary btn-small">View</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="feature-card">
                <div className="section-header" style={{ marginBottom: 14 }}>
                  <h3 style={{ margin: 0 }}>Recommended properties</h3>
                  <Link to="/properties" className="link">Explore</Link>
                </div>

                <div className="list-stack">
                  {properties.slice(0, 3).map((prop) => (
                    <div className="list-row" key={prop.id}>
                      <div>
                        <strong>{prop.name}</strong>
                        <small>{prop.city}</small>
                      </div>
                      <span className="label">{prop.match}%</span>
                      <button type="button" className="btn btn-secondary btn-small">Save</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function CreateRequirementPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <p className="eyebrow">Requirement setup</p>
            <h1>Create requirement</h1>
          </div>
        </div>

        <div className="content-panel form-panel">
          <div className="progress">
            <div className={`progress-step ${step === 1 ? 'active' : ''}`}>Business info</div>
            <div className={`progress-step ${step === 2 ? 'active' : ''}`}>Location</div>
            <div className={`progress-step ${step === 3 ? 'active' : ''}`}>Requirements</div>
            <div className={`progress-step ${step === 4 ? 'active' : ''}`}>Review</div>
          </div>

          {step === 1 && (
            <>
              <div className="field">
                <label>Business Name</label>
                <input type="text" placeholder="Apex Retail Group" />
              </div>
              <div className="field">
                <label>Business Type</label>
                <select defaultValue="Retail">
                  <option>Retail</option>
                  <option>Food & Beverage</option>
                  <option>Healthcare</option>
                  <option>Fashion</option>
                </select>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="field">
                <label>City</label>
                <input type="text" placeholder="Vijayawada" />
              </div>
              <div className="field">
                <label>Preferred Area</label>
                <input type="text" placeholder="Moghalrajpuram" />
              </div>
              <div className="field">
                <label>Nearby Landmark</label>
                <input type="text" placeholder="Near Benz Circle" />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="field">
                <label>Property Type</label>
                <select defaultValue="Retail">
                  <option>Retail</option>
                  <option>Office</option>
                  <option>Industrial</option>
                  <option>Mixed Use</option>
                </select>
              </div>

              <div className="field">
                <label>Minimum Size</label>
                <input type="text" placeholder="2000 sq.ft." />
              </div>

              <div className="field">
                <label>Budget</label>
                <input type="text" placeholder="Up to ₹1,50,000/month" />
              </div>

              <div className="field">
                <label>Additional Preferences</label>
                <textarea placeholder="Parking preferred, foot traffic, visibility..." />
              </div>
            </>
          )}

          {step === 4 && (
            <div className="feature-card">
              <h3 style={{ marginTop: 0 }}>Requirement summary</h3>
              <ul className="feature-list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--locentra-text-soft)' }}>
                <li>Business: Apex Retail Group</li>
                <li>Location: Vijayawada</li>
                <li>Size: 2000-3000 sq.ft.</li>
                <li>Budget: Up to ₹1,50,000/month</li>
                <li>Type: Retail</li>
              </ul>
            </div>
          )}

          <div className="row-between" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginTop: '18px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setStep((s) => Math.max(1, s - 1))}>Back</button>
            <button type="button" className="btn btn-primary" onClick={() => setStep((s) => Math.min(4, s + 1))}>
              {step === 4 ? 'Submit requirement' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SavedPropertiesPage() {
  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <p className="eyebrow">Saved</p>
            <h1>Saved properties</h1>
          </div>
        </div>

        <div className="property-grid">
          {properties.slice(0, 3).map((property) => (
            <article className="property-card" key={property.id}>
              <div className="property-visual" />
              <div className="property-body">
                <div className="property-head">
                  <div>
                    <h3>{property.name}</h3>
                    <p>{property.city}, {property.state}</p>
                  </div>
                  <span className="match-badge">{property.match}% match</span>
                </div>

                <div className="property-meta">
                  <span>{property.type}</span>
                  <span>{property.size}</span>
                  <span>{property.rent}</span>
                </div>

                <div className="property-footer">
                  <span className="status-pill">Saved</span>
                  <button type="button" className="btn btn-secondary btn-small">Remove</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactRequestsPage() {
  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <p className="eyebrow">Inbox</p>
            <h1>Contact requests</h1>
          </div>
        </div>

        <div className="content-panel">
          <div className="list-stack">
            {contactRequests.map((req) => (
              <div className="list-row" key={req.id}>
                <div>
                  <strong>{req.property}</strong>
                  <small>{req.rep}</small>
                </div>
                <span className="label">{req.status}</span>
                <small>{req.date}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RepresentativeDashboardPage() {
  return (
    <div className="page">
      <div className="container">
        <div className="dashboard-grid">
          <aside className="sidebar">
            <h3>Representative</h3>
            <div className="side-nav">
              <NavLink to="/tenant-dashboard" className="side-link active">Dashboard</NavLink>
              <NavLink to="/my-properties" className="side-link">My Properties</NavLink>
              <NavLink to="/add-property" className="side-link">Add Property</NavLink>
              <NavLink to="/leads" className="side-link">Retailer Requests</NavLink>
              <NavLink to="/login" className="side-link">Profile</NavLink>
            </div>
          </aside>

          <main className="content-panel">
            <div className="page-header">
              <div>
                <p className="eyebrow">Welcome back</p>
                <h1>John Morgan</h1>
              </div>
            </div>

            <div className="stats-row">
              <div className="stat-card">
                <span>Total Properties</span>
                <strong>12</strong>
                <small>+2 this quarter</small>
              </div>
              <div className="stat-card">
                <span>Active Listings</span>
                <strong>9</strong>
                <small>3 pending</small>
              </div>
              <div className="stat-card">
                <span>New Leads</span>
                <strong>5</strong>
                <small>+2 this week</small>
              </div>
              <div className="stat-card">
                <span>Active Deals</span>
                <strong>3</strong>
                <small>2 closing</small>
              </div>
            </div>

            <div className="two-col">
              <div className="feature-card">
                <div className="section-header" style={{ marginBottom: 14 }}>
                  <h3 style={{ margin: 0 }}>Recent leads</h3>
                  <Link to="/leads" className="link">Open</Link>
                </div>

                <div className="list-stack">
                  {leads.map((lead) => (
                    <div className="list-row" key={lead.id}>
                      <div>
                        <strong>{lead.retailer}</strong>
                        <small>{lead.city}</small>
                      </div>
                      <span className="label">{lead.status}</span>
                      <button type="button" className="btn btn-secondary btn-small">View</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="feature-card">
                <div className="section-header" style={{ marginBottom: 14 }}>
                  <h3 style={{ margin: 0 }}>Quarterly performance</h3>
                </div>
                <ul className="feature-list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--locentra-text-soft)' }}>
                  <li>12 deals in pipeline</li>
                  <li>87% site-visit conversion</li>
                  <li>4 high-fit listings added this month</li>
                </ul>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function AddPropertyPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <p className="eyebrow">Property onboarding</p>
            <h1>Add property</h1>
          </div>
        </div>

        <div className="content-panel form-panel">
          <div className="progress">
            <div className={`progress-step ${step === 1 ? 'active' : ''}`}>Property info</div>
            <div className={`progress-step ${step === 2 ? 'active' : ''}`}>Location</div>
            <div className={`progress-step ${step === 3 ? 'active' : ''}`}>Details</div>
            <div className={`progress-step ${step === 4 ? 'active' : ''}`}>Preview</div>
          </div>

          {step === 1 && (
            <>
              <div className="field">
                <label>Property Name</label>
                <input type="text" placeholder="Prime Street Retail" />
              </div>
              <div className="field">
                <label>Property Type</label>
                <select defaultValue="Retail">
                  <option>Retail</option>
                  <option>Industrial</option>
                  <option>Office</option>
                  <option>Shopping Center</option>
                </select>
              </div>
              <div className="field">
                <label>Description</label>
                <textarea placeholder="High-visibility retail property with strong footfall." />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="field">
                <label>City</label>
                <input type="text" placeholder="Vijayawada" />
              </div>
              <div className="field">
                <label>Area</label>
                <input type="text" placeholder="Moghalrajpuram" />
              </div>
              <div className="field">
                <label>Address</label>
                <input type="text" placeholder="12, MG Road" />
              </div>
              <div className="field">
                <label>Landmark</label>
                <input type="text" placeholder="Near Benz Circle" />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="field">
                <label>Size</label>
                <input type="text" placeholder="3200 sq.ft." />
              </div>
              <div className="field">
                <label>Monthly Rent</label>
                <input type="text" placeholder="₹1,80,000/month" />
              </div>
              <div className="field">
                <label>Parking</label>
                <select defaultValue="Available">
                  <option>Available</option>
                  <option>Limited</option>
                  <option>Not Available</option>
                </select>
              </div>
              <div className="field">
                <label>Foot Traffic</label>
                <select defaultValue="High">
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </>
          )}

          {step === 4 && (
            <div className="feature-card">
              <h3 style={{ marginTop: 0 }}>Preview</h3>
              <ul className="feature-list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--locentra-text-soft)' }}>
                <li>Property Name: Prime Street Retail</li>
                <li>Location: Vijayawada</li>
                <li>Size: 3200 sq.ft.</li>
                <li>Rent: ₹1,80,000/month</li>
              </ul>
            </div>
          )}

          <div className="row-between" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginTop: '18px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setStep((s) => Math.max(1, s - 1))}>Back</button>
            <button type="button" className="btn btn-primary" onClick={() => setStep((s) => Math.min(4, s + 1))}>
              {step === 4 ? 'Publish property' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MyPropertiesPage() {
  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <p className="eyebrow">Portfolio</p>
            <h1>My properties</h1>
          </div>
        </div>

        <div className="content-panel">
          <div className="list-stack">
            {myProperties.map((property) => (
              <div className="list-row" key={property.id}>
                <div>
                  <strong>{property.name}</strong>
                  <small>{property.location}</small>
                </div>
                <span className="label">{property.size}</span>
                <span className="label">{property.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LeadsPage() {
  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <p className="eyebrow">Pipeline</p>
            <h1>Leads</h1>
          </div>
        </div>

        <div className="content-panel">
          <div className="list-stack">
            {leads.map((lead) => (
              <div className="list-row" key={lead.id}>
                <div>
                  <strong>{lead.retailer}</strong>
                  <small>{lead.property}</small>
                </div>
                <span className="label">{lead.status}</span>
                <button type="button" className="btn btn-secondary btn-small">Update</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking...");

  useEffect(() => {
    checkBackendHealth()
      .then(() => setBackendStatus("Backend Connected"))
      .catch(() => setBackendStatus("Backend Disconnected"));
  }, []);

  return (
    <div className="locentra-app">
      {import.meta.env.DEV && (
        <div
          style={{
            position: "fixed",
            bottom: "16px",
            right: "16px",
            zIndex: 9999,
            padding: "8px 12px",
            borderRadius: "8px",
            background:
              backendStatus === "Backend Connected" ? "#dcfce7" : "#fee2e2",
            color:
              backendStatus === "Backend Connected" ? "#166534" : "#991b1b",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          {backendStatus}
        </div>
      )}

      <style>{css}</style>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/properties/:id" element={<PropertyDetailsPage />} />
        <Route path="/retailer-dashboard" element={<RetailerDashboardPage />} />
        <Route path="/create-requirement" element={<CreateRequirementPage />} />
        <Route path="/saved" element={<SavedPropertiesPage />} />
        <Route path="/contact-requests" element={<ContactRequestsPage />} />
        <Route path="/tenant-dashboard" element={<RepresentativeDashboardPage />} />
        <Route path="/add-property" element={<AddPropertyPage />} />
        <Route path="/my-properties" element={<MyPropertiesPage />} />
        <Route path="/leads" element={<LeadsPage />} />
      </Routes>

      <footer className="footer">
        <div className="footer-inner">
          <div><strong>Locentra</strong> © 2026</div>
          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/properties">Properties</Link>
            <Link to="/how-it-works">How it works</Link>
            <Link to="/about">About</Link>
            <Link to="/login">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
