import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, NavLink, useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  checkBackendHealth,
  createContactRequest,
  createProperty,
  createRequirement,
  getContactRequests,
  getFavoriteStatus,
  getFavorites,
  getMyProperties,
  getProfile,
  getProperties,
  getReceivedContactRequests,
  getProperty,
  getRequirements,
  getRequirementMatches,
  loginAccount,
  removeFavorite,
  saveFavorite,
  registerAccount,
} from './services/api';

const css = `
  :root {
    --locentra-bg: #f5f7f6;
    --locentra-surface: #ffffff;
    --locentra-surface-alt: #edf3ef;
    --locentra-line: #e2e9e5;
    --locentra-text: #132a39;
    --locentra-text-soft: #405761;
    --locentra-muted: #687b85;
    --locentra-primary: #1c5368;
    --locentra-primary-strong: #123847;
    --locentra-primary-soft: #eaf1ed;
    --locentra-success: #4d8060;
    --locentra-success-soft: #edf5ee;
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

  .landing-page {
    --landing-ink: #172b3b;
    --landing-muted: #61717c;
    --landing-blue: #1d4f66;
    --landing-blue-dark: #153849;
    --landing-accent: #e8b64c;
    --landing-line: #e2e9e7;
    padding: 36px 0 8px;
    overflow: hidden;
  }

  .landing-container {
    width: min(1160px, calc(100% - 40px));
    margin: 0 auto;
  }

  .landing-hero {
    min-height: 510px;
    display: grid;
    grid-template-columns: 1.02fr 0.98fr;
    align-items: center;
    gap: clamp(32px, 6vw, 76px);
    padding: 42px 0 46px;
  }

  .landing-hero-copy {
    max-width: 580px;
  }

  .landing-eyebrow {
    display: flex;
    align-items: center;
    gap: 9px;
    margin: 0 0 17px;
    color: var(--landing-blue);
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.13em;
    line-height: 1.5;
    text-transform: uppercase;
  }

  .landing-eyebrow > span {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--landing-accent);
    box-shadow: 0 0 0 4px rgba(232, 182, 76, 0.18);
  }

  .landing-hero h1 {
    max-width: 630px;
    margin: 0;
    color: var(--landing-ink);
    font-size: clamp(3rem, 5.8vw, 5.3rem);
    font-weight: 750;
    letter-spacing: -0.075em;
    line-height: 0.99;
  }

  .landing-hero h1 em {
    color: var(--landing-blue);
    font-style: normal;
  }

  .landing-lede {
    max-width: 510px;
    margin: 23px 0 0;
    color: var(--landing-muted);
    font-size: 1.05rem;
    line-height: 1.8;
  }

  .landing-actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 28px;
  }

  .landing-button {
    min-height: 50px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    border: 1px solid transparent;
    border-radius: 12px;
    padding: 0 20px;
    font-weight: 750;
    line-height: 1.2;
    transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
  }

  .landing-button:hover {
    transform: translateY(-2px);
  }

  .landing-button:focus-visible,
  .landing-text-link:focus-visible {
    outline: 3px solid rgba(232, 182, 76, 0.75);
    outline-offset: 3px;
  }

  .landing-button-primary {
    background: var(--landing-blue);
    color: white;
    box-shadow: 0 12px 24px rgba(29, 79, 102, 0.2);
  }

  .landing-button-primary:hover {
    background: var(--landing-blue-dark);
    box-shadow: 0 15px 28px rgba(29, 79, 102, 0.26);
  }

  .landing-button-secondary {
    background: white;
    border-color: var(--landing-line);
    color: var(--landing-ink);
  }

  .landing-assurance {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 20px 0 0;
    color: var(--landing-muted);
    font-size: 0.81rem;
  }

  .landing-assurance span {
    display: grid;
    width: 19px;
    height: 19px;
    place-items: center;
    border-radius: 50%;
    background: #e5f1e9;
    color: #3c7b52;
    font-size: 0.72rem;
    font-weight: 800;
  }

  .landing-hero-art {
    min-height: 425px;
    position: relative;
    isolation: isolate;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(215, 226, 224, 0.9);
    border-radius: 30px;
    background:
      radial-gradient(circle at 77% 17%, rgba(232, 182, 76, 0.18), transparent 28%),
      linear-gradient(140deg, #e9f0ed 0%, #f7f6f0 62%, #f0eee5 100%);
    box-shadow: 0 24px 50px rgba(23, 43, 59, 0.09);
    overflow: hidden;
  }

  .landing-hero-art::before,
  .landing-hero-art::after {
    content: '';
    position: absolute;
    z-index: -1;
    border: 1px solid rgba(29, 79, 102, 0.09);
    border-radius: 50%;
  }

  .landing-hero-art::before {
    width: 410px;
    height: 410px;
    right: -135px;
    top: -180px;
  }

  .landing-hero-art::after {
    width: 320px;
    height: 320px;
    left: -165px;
    bottom: -190px;
  }

  .landing-art-label {
    position: absolute;
    top: 25px;
    left: 27px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--landing-blue);
    font-size: 0.72rem;
    font-weight: 750;
    letter-spacing: 0.07em;
    text-transform: uppercase;
  }

  .landing-art-label span {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #64a27a;
  }

  .landing-map {
    position: relative;
    width: min(75%, 350px);
    height: 275px;
    border: 1px solid rgba(29, 79, 102, 0.1);
    border-radius: 48% 43% 42% 46%;
    background-color: rgba(255, 255, 255, 0.46);
    background-image:
      linear-gradient(28deg, transparent 46%, rgba(29, 79, 102, 0.12) 47%, rgba(29, 79, 102, 0.12) 49%, transparent 50%),
      linear-gradient(112deg, transparent 43%, rgba(29, 79, 102, 0.1) 44%, rgba(29, 79, 102, 0.1) 46%, transparent 47%),
      linear-gradient(0deg, transparent 70%, rgba(29, 79, 102, 0.08) 71%, rgba(29, 79, 102, 0.08) 73%, transparent 74%);
    transform: rotate(-7deg);
  }

  .landing-map-block {
    position: absolute;
    border: 1px solid rgba(29, 79, 102, 0.09);
    border-radius: 14px;
    background: rgba(223, 234, 225, 0.76);
  }

  .landing-map-block.block-one {
    width: 85px;
    height: 60px;
    top: 35px;
    left: 37px;
    transform: rotate(12deg);
  }

  .landing-map-block.block-two {
    width: 95px;
    height: 66px;
    top: 121px;
    right: 37px;
    background: rgba(240, 230, 203, 0.8);
    transform: rotate(-9deg);
  }

  .landing-map-block.block-three {
    width: 62px;
    height: 75px;
    bottom: 25px;
    left: 73px;
    transform: rotate(-13deg);
  }

  .landing-map-road {
    position: absolute;
    z-index: 1;
    border: 1px dashed rgba(29, 79, 102, 0.28);
  }

  .landing-map-road.road-one {
    width: 175px;
    top: 93px;
    left: 83px;
    transform: rotate(34deg);
  }

  .landing-map-road.road-two {
    width: 190px;
    top: 151px;
    left: 71px;
    transform: rotate(-37deg);
  }

  .landing-map-pin {
    position: absolute;
    z-index: 2;
    top: 88px;
    left: 48%;
    width: 48px;
    height: 48px;
    display: grid;
    place-items: center;
    border: 5px solid white;
    border-radius: 50% 50% 50% 8px;
    background: var(--landing-blue);
    box-shadow: 0 8px 20px rgba(29, 79, 102, 0.28);
    color: white;
    font-size: 0.84rem;
    font-weight: 800;
    transform: rotate(-45deg);
  }

  .landing-map-pin span {
    transform: rotate(45deg);
  }

  .landing-match-card {
    position: absolute;
    z-index: 3;
    right: 22px;
    bottom: 73px;
    display: flex;
    align-items: center;
    gap: 11px;
    min-width: 245px;
    padding: 13px 15px;
    border: 1px solid rgba(226, 233, 231, 0.95);
    border-radius: 15px;
    background: white;
    box-shadow: 0 15px 36px rgba(23, 43, 59, 0.13);
  }

  .landing-match-icon {
    width: 39px;
    height: 39px;
    display: grid;
    place-items: center;
    border-radius: 12px;
    background: #edf3ef;
    color: var(--landing-blue);
    font-size: 1.3rem;
  }

  .landing-match-card strong,
  .landing-match-card small {
    display: block;
  }

  .landing-match-card strong {
    color: var(--landing-ink);
    font-size: 0.84rem;
  }

  .landing-match-card small {
    margin-top: 3px;
    color: var(--landing-muted);
    font-size: 0.68rem;
  }

  .landing-match-arrow {
    margin-left: auto;
    color: var(--landing-blue);
    font-weight: 800;
  }

  .landing-art-note {
    position: absolute;
    left: 25px;
    bottom: 25px;
    color: var(--landing-muted);
    font-size: 0.72rem;
  }

  .landing-art-note span {
    margin-right: 7px;
    color: var(--landing-blue);
    font-weight: 800;
  }

  .landing-promise {
    display: flex;
    justify-content: space-around;
    gap: 18px;
    border-top: 1px solid var(--landing-line);
    border-bottom: 1px solid var(--landing-line);
    padding: 21px 10px;
    color: var(--landing-muted);
    font-size: 0.84rem;
    font-weight: 650;
    text-align: center;
  }

  .landing-section {
    padding: 91px 0 5px;
  }

  .landing-section-heading {
    max-width: 640px;
    margin: 0 auto 35px;
    text-align: center;
  }

  .landing-section-heading .landing-eyebrow {
    justify-content: center;
  }

  .landing-section-heading h2,
  .landing-audience-intro h2,
  .landing-onboarding h2,
  .landing-final-cta h2 {
    margin: 0;
    color: var(--landing-ink);
    font-size: clamp(2rem, 4vw, 3.25rem);
    font-weight: 750;
    letter-spacing: -0.065em;
    line-height: 1.08;
  }

  .landing-section-heading > p:last-child {
    max-width: 560px;
    margin: 13px auto 0;
    color: var(--landing-muted);
    font-size: 0.96rem;
    line-height: 1.75;
  }

  .landing-steps {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 17px;
  }

  .landing-step-card,
  .landing-benefit-card,
  .landing-audience-card {
    border: 1px solid var(--landing-line);
    border-radius: 19px;
    background: #fff;
    box-shadow: 0 12px 32px rgba(23, 43, 59, 0.045);
  }

  .landing-step-card {
    position: relative;
    min-height: 215px;
    padding: 24px 23px;
  }

  .landing-step-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 25px;
  }

  .landing-step-top > span {
    color: #94a3a4;
    font-size: 0.77rem;
    font-weight: 800;
    letter-spacing: 0.1em;
  }

  .landing-step-top i,
  .landing-card-icon,
  .landing-audience-icon {
    display: grid;
    place-items: center;
    border-radius: 13px;
    background: #edf3ef;
    color: var(--landing-blue);
    font-style: normal;
    font-size: 1.2rem;
  }

  .landing-step-top i {
    width: 42px;
    height: 42px;
  }

  .landing-step-card h3,
  .landing-benefit-card h3,
  .landing-audience-card h3 {
    margin: 0 0 9px;
    color: var(--landing-ink);
    font-size: 1.11rem;
    letter-spacing: -0.035em;
  }

  .landing-step-card p,
  .landing-benefit-card p,
  .landing-audience-card > p {
    margin: 0;
    color: var(--landing-muted);
    font-size: 0.87rem;
    line-height: 1.72;
  }

  .landing-why {
    padding-bottom: 20px;
  }

  .landing-benefit-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 17px;
  }

  .landing-benefit-card {
    min-height: 205px;
    padding: 24px;
    transition: transform 180ms ease, box-shadow 180ms ease;
  }

  .landing-benefit-card:hover,
  .landing-audience-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 18px 38px rgba(23, 43, 59, 0.09);
  }

  .landing-card-icon {
    width: 45px;
    height: 45px;
    margin-bottom: 20px;
  }

  .landing-audiences {
    display: grid;
    grid-template-columns: 0.78fr 1.22fr;
    align-items: center;
    gap: clamp(32px, 6vw, 76px);
    margin-top: 90px;
    padding: 58px clamp(24px, 5vw, 62px);
    border-radius: 26px;
    background: #edf2ef;
  }

  .landing-audience-intro .landing-eyebrow {
    align-items: flex-start;
    max-width: 320px;
  }

  .landing-audience-intro h2 {
    font-size: clamp(2rem, 3.6vw, 2.9rem);
  }

  .landing-audience-intro > p:last-child {
    margin: 16px 0 0;
    color: var(--landing-muted);
    font-size: 0.92rem;
    line-height: 1.8;
  }

  .landing-audience-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  .landing-audience-card {
    padding: 21px 19px;
    transition: transform 180ms ease, box-shadow 180ms ease;
  }

  .landing-audience-icon {
    width: 42px;
    height: 42px;
    margin-bottom: 17px;
  }

  .landing-audience-card ul {
    display: grid;
    gap: 11px;
    margin: 19px 0 20px;
    padding: 0;
    list-style: none;
  }

  .landing-audience-card li {
    display: flex;
    gap: 8px;
    color: var(--landing-muted);
    font-size: 0.76rem;
    line-height: 1.5;
  }

  .landing-audience-card li span {
    flex: 0 0 auto;
    color: #4a8b61;
    font-weight: 800;
  }

  .landing-text-link {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: var(--landing-blue);
    font-size: 0.84rem;
    font-weight: 800;
  }

  .landing-text-link span {
    transition: transform 180ms ease;
  }

  .landing-text-link:hover span {
    transform: translateX(3px);
  }

  .landing-onboarding {
    display: grid;
    grid-template-columns: 1fr 0.9fr;
    align-items: center;
    gap: clamp(35px, 7vw, 90px);
    padding: 94px 6% 20px;
  }

  .landing-onboarding-copy {
    max-width: 480px;
  }

  .landing-onboarding-copy h2 {
    font-size: clamp(2rem, 3.8vw, 3.1rem);
  }

  .landing-onboarding-copy > p:not(.landing-eyebrow) {
    margin: 17px 0 21px;
    color: var(--landing-muted);
    font-size: 0.96rem;
    line-height: 1.8;
  }

  .landing-onboarding-list {
    display: grid;
    gap: 13px;
  }

  .landing-onboarding-list > div {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 17px 19px;
    border: 1px solid var(--landing-line);
    border-radius: 15px;
    background: white;
    box-shadow: 0 10px 28px rgba(23, 43, 59, 0.04);
  }

  .landing-onboarding-list > div > span {
    flex: 0 0 auto;
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: #f8f1df;
    color: #86651f;
    font-size: 0.83rem;
    font-weight: 800;
  }

  .landing-onboarding-list p,
  .landing-onboarding-list small {
    display: block;
  }

  .landing-onboarding-list p {
    margin: 0;
  }

  .landing-onboarding-list strong {
    color: var(--landing-ink);
    font-size: 0.88rem;
  }

  .landing-onboarding-list small {
    margin-top: 4px;
    color: var(--landing-muted);
    font-size: 0.78rem;
    line-height: 1.5;
  }

  .landing-featured {
    padding-top: 84px;
  }

  .landing-featured-heading {
    max-width: none;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 25px;
    text-align: left;
  }

  .landing-featured-heading .landing-eyebrow {
    justify-content: flex-start;
  }

  .landing-featured-heading > div > p:last-child {
    margin: 12px 0 0;
    color: var(--landing-muted);
    font-size: 0.92rem;
    line-height: 1.7;
  }

  .landing-featured .property-grid {
    gap: 17px;
  }

  .landing-featured .property-card {
    border-color: var(--landing-line);
    border-radius: 18px;
    box-shadow: 0 12px 32px rgba(23, 43, 59, 0.05);
  }

  .landing-featured .property-visual {
    background:
      linear-gradient(135deg, rgba(21, 56, 73, 0.16), rgba(232, 182, 76, 0.08)),
      linear-gradient(135deg, #e8eeea 0%, #d4e2dc 48%, #ecdfbd 100%);
  }

  .landing-final-cta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 28px;
    margin: 89px 0 30px;
    padding: clamp(30px, 5vw, 54px);
    border-radius: 25px;
    background:
      radial-gradient(circle at 84% 5%, rgba(232, 182, 76, 0.2), transparent 28%),
      linear-gradient(125deg, #153849 0%, #1d4f66 100%);
    box-shadow: 0 22px 48px rgba(21, 56, 73, 0.18);
    color: white;
  }

  .landing-final-cta .landing-eyebrow {
    color: #f0cd7b;
  }

  .landing-final-cta h2 {
    max-width: 620px;
    color: white;
    font-size: clamp(2rem, 4vw, 3.2rem);
  }

  .landing-final-cta > div > p:last-child {
    max-width: 590px;
    margin: 13px 0 0;
    color: rgba(255, 255, 255, 0.76);
    font-size: 0.92rem;
    line-height: 1.7;
  }

  .landing-final-cta .landing-actions {
    flex: 0 0 auto;
    margin-top: 0;
  }

  .landing-button-light {
    background: #f2c75e;
    color: #243748;
  }

  .landing-button-light:hover {
    background: #ffda79;
  }

  .landing-button-outline {
    border-color: rgba(255, 255, 255, 0.35);
    background: rgba(255, 255, 255, 0.06);
    color: white;
  }

  @media (max-width: 1000px) {
    .landing-hero {
      gap: 30px;
    }

    .landing-audiences {
      grid-template-columns: 1fr;
      gap: 28px;
    }

    .landing-audience-intro {
      max-width: 600px;
    }

    .landing-final-cta {
      align-items: flex-start;
      flex-direction: column;
    }

    .landing-final-cta .landing-actions {
      margin-top: 4px;
    }
  }

  @media (max-width: 760px) {
    .landing-page {
      padding-top: 14px;
    }

    .landing-container {
      width: min(100% - 28px, 560px);
    }

    .landing-hero {
      grid-template-columns: 1fr;
      gap: 34px;
      padding: 37px 0 30px;
    }

    .landing-hero h1 {
      max-width: 540px;
      font-size: clamp(2.8rem, 12vw, 4rem);
    }

    .landing-lede {
      font-size: 0.98rem;
    }

    .landing-hero-art {
      min-height: 345px;
      border-radius: 23px;
    }

    .landing-map {
      width: 76%;
      height: 235px;
      transform: scale(0.88) rotate(-7deg);
    }

    .landing-match-card {
      right: 12px;
      bottom: 56px;
      min-width: 225px;
      padding: 11px;
    }

    .landing-art-label {
      top: 19px;
      left: 19px;
    }

    .landing-art-note {
      left: 19px;
      bottom: 17px;
    }

    .landing-promise {
      align-items: flex-start;
      flex-direction: column;
      gap: 12px;
      padding: 18px 5px;
      text-align: left;
    }

    .landing-section {
      padding-top: 68px;
    }

    .landing-section-heading {
      margin-bottom: 26px;
      text-align: left;
    }

    .landing-section-heading .landing-eyebrow {
      justify-content: flex-start;
    }

    .landing-section-heading > p:last-child {
      margin-left: 0;
    }

    .landing-steps,
    .landing-benefit-grid {
      grid-template-columns: 1fr;
    }

    .landing-step-card {
      min-height: auto;
    }

    .landing-audiences {
      margin-top: 66px;
      padding: 29px 19px;
      border-radius: 20px;
    }

    .landing-audience-grid {
      grid-template-columns: 1fr;
    }

    .landing-onboarding {
      grid-template-columns: 1fr;
      gap: 28px;
      padding: 68px 2px 6px;
    }

    .landing-featured {
      padding-top: 67px;
    }

    .landing-featured-heading {
      align-items: flex-start;
    }

    .landing-featured-heading .landing-text-link {
      margin-top: 2px;
    }

    .landing-featured .property-grid {
      grid-template-columns: 1fr;
    }

    .landing-final-cta {
      gap: 22px;
      margin: 66px 0 18px;
      padding: 29px 22px;
      border-radius: 21px;
    }

    .landing-final-cta .landing-actions {
      align-items: stretch;
      flex-direction: column;
      width: 100%;
    }

    .landing-button {
      width: auto;
    }
  }

  @media (max-width: 420px) {
    .landing-hero-copy > .landing-actions {
      align-items: stretch;
      flex-direction: column;
    }

    .landing-hero-copy > .landing-actions .landing-button {
      width: 100%;
    }

    .landing-featured-heading {
      flex-direction: column;
    }

    .landing-map {
      margin-left: -16px;
    }
  }

  .home-landing {
    --home-ink: #132a39;
    --home-ink-soft: #354b57;
    --home-muted: #687b85;
    --home-brand: #1c5368;
    --home-brand-dark: #123847;
    --home-gold: #e9bd62;
    --home-line: #e4e9e7;
    --home-surface: #ffffff;
    color: var(--home-ink);
    overflow: clip;
    background: #fff;
  }

  .home-shell {
    width: min(1160px, calc(100% - 48px));
    margin: 0 auto;
  }

  .home-hero {
    position: relative;
    overflow: hidden;
    background:
      radial-gradient(ellipse at 74% 48%, rgba(42, 100, 120, 0.27), transparent 42%),
      linear-gradient(112deg, #102c3b 0%, #173f50 54%, #1d5366 100%);
    color: white;
  }

  .home-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0.12;
    background-image: linear-gradient(rgba(255,255,255,.13) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.13) 1px, transparent 1px);
    background-size: 54px 54px;
    mask-image: linear-gradient(90deg, transparent 4%, #000 80%);
    pointer-events: none;
  }

  .home-hero-glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(1px);
    pointer-events: none;
    animation: home-glow-drift 15s ease-in-out infinite alternate;
  }

  .home-hero-glow-one {
    width: 480px;
    height: 480px;
    top: -280px;
    right: 4%;
    background: radial-gradient(circle, rgba(233, 189, 98, 0.2), transparent 67%);
  }

  .home-hero-glow-two {
    width: 380px;
    height: 380px;
    bottom: -290px;
    left: 33%;
    background: radial-gradient(circle, rgba(99, 166, 171, 0.23), transparent 68%);
    animation-delay: -5s;
  }

  .home-hero-layout {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1.02fr 0.98fr;
    align-items: center;
    gap: clamp(35px, 6vw, 78px);
    min-height: 602px;
    padding-top: 44px;
    padding-bottom: 37px;
  }

  .home-hero-copy {
    max-width: 590px;
    animation: home-fade-up 700ms cubic-bezier(.2,.7,.25,1) both;
  }

  .home-eyebrow {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0 0 17px;
    color: var(--home-brand);
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.14em;
    line-height: 1.55;
    text-transform: uppercase;
  }

  .home-eyebrow > span:not(.home-eyebrow-number) {
    width: 8px;
    height: 8px;
    flex: 0 0 auto;
    border-radius: 50%;
    background: var(--home-gold);
    box-shadow: 0 0 0 5px rgba(233, 189, 98, 0.12);
  }

  .home-hero-eyebrow {
    color: #f1d48f;
  }

  .home-hero h1 {
    max-width: 650px;
    margin: 0;
    color: #fff;
    font-size: clamp(3.1rem, 5.6vw, 5.15rem);
    font-weight: 730;
    letter-spacing: -0.075em;
    line-height: 0.99;
  }

  .home-hero-description {
    max-width: 510px;
    margin: 23px 0 0;
    color: rgba(242, 247, 246, 0.76);
    font-size: 1.02rem;
    line-height: 1.8;
  }

  .home-hero-actions,
  .home-final-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 28px;
  }

  .home-button {
    min-height: 50px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 11px;
    border: 1px solid transparent;
    border-radius: 10px;
    padding: 0 20px;
    font-size: 0.87rem;
    font-weight: 750;
    line-height: 1.2;
    transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease, border-color 180ms ease;
  }

  .home-button:hover {
    transform: translateY(-2px);
  }

  .home-button:focus-visible,
  .home-inline-link:focus-visible,
  .home-property-link:focus-visible {
    outline: 3px solid rgba(233, 189, 98, 0.8);
    outline-offset: 3px;
  }

  .home-button-accent {
    background: var(--home-gold);
    color: #203747;
    box-shadow: 0 12px 27px rgba(8, 25, 33, 0.2);
  }

  .home-button-accent:hover {
    background: #f4d17e;
    box-shadow: 0 15px 32px rgba(8, 25, 33, 0.3);
  }

  .home-button-glass {
    border-color: rgba(255,255,255,.27);
    background: rgba(255,255,255,.06);
    color: white;
  }

  .home-button-glass:hover,
  .home-button-final-outline:hover {
    background: rgba(255,255,255,.13);
    border-color: rgba(255,255,255,.52);
  }

  .home-hero-note {
    display: flex;
    align-items: center;
    gap: 11px;
    margin-top: 31px;
    color: rgba(242, 247, 246, 0.72);
    font-size: 0.75rem;
  }

  .home-avatars {
    display: flex;
    padding-left: 2px;
  }

  .home-avatars i {
    width: 27px;
    height: 27px;
    display: grid;
    place-items: center;
    margin-left: -3px;
    border: 2px solid #183f4e;
    border-radius: 50%;
    background: #dbe8df;
    color: var(--home-brand-dark);
    font-size: 0.61rem;
    font-style: normal;
    font-weight: 800;
  }

  .home-avatars i:nth-child(2) {
    background: #ead6aa;
  }

  .home-avatars i:nth-child(3) {
    background: #eaf1ee;
  }

  .home-hero-visual {
    position: relative;
    min-height: 414px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(255,255,255,.13);
    border-radius: 24px;
    background: linear-gradient(145deg, rgba(255,255,255,.1), rgba(255,255,255,.025));
    box-shadow: 0 28px 75px rgba(5, 24, 32, .22), inset 0 1px 0 rgba(255,255,255,.1);
    animation: home-fade-up 850ms 120ms cubic-bezier(.2,.7,.25,1) both;
    isolation: isolate;
  }

  .home-hero-visual::before {
    content: '';
    position: absolute;
    z-index: -1;
    inset: 12% 11% 11%;
    border-radius: 50%;
    background: rgba(137, 177, 167, .13);
    filter: blur(28px);
  }

  .home-visual-orbit {
    position: absolute;
    z-index: -1;
    border: 1px solid rgba(233, 189, 98, .17);
    border-radius: 50%;
  }

  .orbit-one {
    width: 370px;
    height: 370px;
    animation: home-orbit-pulse 8s ease-in-out infinite;
  }

  .orbit-two {
    width: 290px;
    height: 290px;
    border-color: rgba(255,255,255,.13);
    animation: home-orbit-pulse 8s 1s ease-in-out infinite reverse;
  }

  .home-visual-topline {
    position: absolute;
    top: 24px;
    left: 24px;
    display: flex;
    align-items: center;
    gap: 8px;
    color: rgba(255,255,255,.66);
    font-size: 0.6rem;
    font-weight: 800;
    letter-spacing: .12em;
  }

  .home-live-dot,
  .home-window-status i,
  .home-property-status i {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #9bc99c;
    box-shadow: 0 0 0 4px rgba(155, 201, 156, .14);
  }

  .home-visual-building {
    position: relative;
    width: min(77%, 355px);
    height: 270px;
    margin-top: 14px;
    perspective: 700px;
    animation: home-building-float 6s ease-in-out infinite;
  }

  .home-building-skyline {
    position: absolute;
    right: 8%;
    bottom: 43px;
    left: 0;
    height: 142px;
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    opacity: .38;
  }

  .home-building-skyline i {
    width: 16%;
    height: 80%;
    border: 1px solid rgba(255,255,255,.25);
    border-bottom: 0;
    background: linear-gradient(180deg, rgba(104, 159, 165, .56), rgba(42, 92, 105, .5));
  }

  .home-building-skyline i:nth-child(2) { height: 100%; }
  .home-building-skyline i:nth-child(3) { height: 68%; }
  .home-building-skyline i:nth-child(4) { height: 88%; }

  .home-building-main {
    position: absolute;
    z-index: 2;
    right: 20%;
    bottom: 42px;
    left: 9%;
    height: 190px;
    padding: 19px 17px 0;
    border: 1px solid rgba(255,255,255,.48);
    border-bottom: 0;
    background: linear-gradient(135deg, #e9e5d6 0%, #c6d1c7 100%);
    box-shadow: 0 20px 45px rgba(3, 18, 24, .25);
    transform: skewY(-2deg);
  }

  .home-building-sign {
    width: max-content;
    margin-bottom: 12px;
    padding: 4px 7px;
    background: #1e5365;
    color: #f5d685;
    font-size: .49rem;
    font-weight: 800;
    letter-spacing: .12em;
  }

  .home-building-windows {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 7px;
  }

  .home-building-windows i {
    height: 31px;
    border: 1px solid rgba(27, 73, 83, .21);
    background: linear-gradient(140deg, #91b7b4, #477d87);
    box-shadow: inset 0 0 0 3px rgba(229, 236, 224, .24);
  }

  .home-building-windows i:nth-child(3n) {
    background: linear-gradient(140deg, #f0d997, #b78649);
  }

  .home-building-entry {
    position: absolute;
    right: 39%;
    bottom: 0;
    width: 36px;
    height: 43px;
    border: 2px solid rgba(27, 73, 83, .24);
    border-bottom: 0;
    background: linear-gradient(140deg, #477d87, #315e6a);
  }

  .home-building-side {
    position: absolute;
    z-index: 1;
    right: 5%;
    bottom: 43px;
    width: 18%;
    height: 172px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-content: start;
    gap: 8px 5px;
    padding: 18px 8px 0;
    border: 1px solid rgba(255,255,255,.35);
    border-bottom: 0;
    background: linear-gradient(145deg, #abbcaf, #7e9a95);
    transform: skewY(27deg);
  }

  .home-building-side i {
    height: 24px;
    border: 1px solid rgba(255,255,255,.25);
    background: #487c83;
  }

  .home-building-ground {
    position: absolute;
    right: 0;
    bottom: 31px;
    left: 0;
    height: 15px;
    border-radius: 50%;
    background: rgba(4, 22, 29, .45);
    filter: blur(5px);
  }

  .home-property-float {
    position: absolute;
    z-index: 3;
    display: flex;
    align-items: center;
    gap: 10px;
    border: 1px solid rgba(22, 56, 67, .08);
    border-radius: 12px;
    background: #fff;
    color: var(--home-ink);
    box-shadow: 0 15px 38px rgba(5, 23, 30, .23);
  }

  .home-property-float-top {
    top: 92px;
    right: 14px;
    padding: 10px 13px;
    animation: home-card-float 6s ease-in-out infinite;
  }

  .home-property-float-bottom {
    bottom: 61px;
    left: 12px;
    padding: 11px 13px;
    animation: home-card-float 6s 1.2s ease-in-out infinite;
  }

  .home-property-float small,
  .home-property-float strong,
  .home-visual-stamp small,
  .home-visual-stamp strong,
  .home-rep-note small,
  .home-rep-note strong {
    display: block;
  }

  .home-property-float small,
  .home-visual-stamp small,
  .home-rep-note small {
    color: #7a8a8e;
    font-size: .53rem;
    font-weight: 800;
    letter-spacing: .08em;
  }

  .home-property-float strong,
  .home-visual-stamp strong,
  .home-rep-note strong {
    margin-top: 3px;
    color: var(--home-ink);
    font-size: .72rem;
  }

  .home-float-icon,
  .home-match-ring,
  .home-float-arrow {
    flex: 0 0 auto;
    display: grid;
    place-items: center;
  }

  .home-float-icon {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: #eaf1ed;
    color: var(--home-brand);
  }

  .home-match-ring {
    width: 33px;
    height: 33px;
    border: 2px solid #7eaf8a;
    border-radius: 50%;
    color: #548260;
    font-size: .85rem;
    font-weight: 800;
  }

  .home-float-arrow {
    width: 28px;
    height: 28px;
    margin-left: 3px;
    border-radius: 50%;
    background: #f5f2e9;
    color: var(--home-brand);
  }

  .home-visual-caption {
    position: absolute;
    right: 22px;
    bottom: 20px;
    left: 22px;
    display: flex;
    gap: 9px;
    color: rgba(255,255,255,.6);
    font-size: .62rem;
  }

  .home-visual-caption span:first-child {
    color: #f1d48f;
    font-weight: 800;
  }

  .home-hero-bottom {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 15px;
    padding-top: 16px;
    padding-bottom: 20px;
    border-top: 1px solid rgba(255,255,255,.15);
    color: rgba(255,255,255,.54);
    font-size: .57rem;
    font-weight: 750;
    letter-spacing: .14em;
  }

  .home-bottom-rule {
    width: 45px;
    height: 1px;
    background: rgba(233,189,98,.6);
  }

  .home-hero-bottom > span:last-child {
    margin-left: auto;
  }

  .home-metrics-section {
    border-bottom: 1px solid var(--home-line);
    background: #fafbf9;
  }

  .home-metrics {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    padding-top: 22px;
    padding-bottom: 22px;
  }

  .home-metric {
    position: relative;
    display: flex;
    align-items: center;
    gap: 13px;
    padding: 7px 18px;
  }

  .home-metric:first-child { padding-left: 0; }
  .home-metric:last-child { padding-right: 0; }

  .home-metric-icon,
  .home-benefit-icon {
    flex: 0 0 auto;
    display: grid;
    place-items: center;
    width: 43px;
    height: 43px;
    border: 1px solid #e1e9e4;
    border-radius: 12px;
    background: #f0f4ef;
    color: var(--home-brand);
  }

  .home-metric-copy strong,
  .home-metric-copy small {
    display: block;
  }

  .home-metric-copy strong {
    color: var(--home-ink);
    font-size: .79rem;
  }

  .home-metric-copy small {
    margin-top: 4px;
    color: var(--home-muted);
    font-size: .65rem;
    line-height: 1.4;
  }

  .home-metric-divider {
    position: absolute;
    top: 10px;
    right: 0;
    bottom: 10px;
    width: 1px;
    background: var(--home-line);
  }

  .home-section {
    padding: 91px 0;
  }

  .home-section-heading {
    max-width: 650px;
    margin: 0 auto 39px;
    text-align: center;
  }

  .home-section-heading .home-eyebrow {
    justify-content: center;
  }

  .home-section-heading h2,
  .home-audience-copy h2,
  .home-onboarding-copy h2,
  .home-final-layout h2 {
    margin: 0;
    color: var(--home-ink);
    font-size: clamp(2.1rem, 4vw, 3.25rem);
    font-weight: 740;
    letter-spacing: -.065em;
    line-height: 1.08;
  }

  .home-section-heading > p:last-child,
  .home-featured-heading > div > p:last-child {
    max-width: 570px;
    margin: 13px auto 0;
    color: var(--home-muted);
    font-size: .93rem;
    line-height: 1.75;
  }

  .home-process-section {
    padding-bottom: 79px;
  }

  .home-process-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }

  .home-process-card {
    position: relative;
    min-height: 228px;
    padding: 24px 24px 26px;
    border: 1px solid var(--home-line);
    border-radius: 16px;
    background: linear-gradient(155deg, #fff, #fbfcfa);
    box-shadow: 0 9px 28px rgba(19, 42, 57, .045);
    transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
  }

  .home-process-card:hover,
  .home-benefit-card:hover,
  .home-property-card:hover {
    transform: translateY(-5px);
    border-color: #d0ded7;
    box-shadow: 0 18px 42px rgba(19, 42, 57, .1);
  }

  .home-process-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 26px;
  }

  .home-process-card-top > span {
    color: #9aa8a6;
    font-size: .74rem;
    font-weight: 800;
    letter-spacing: .12em;
  }

  .home-process-card-top i {
    width: 42px;
    height: 42px;
    display: grid;
    place-items: center;
    border: 1px solid #e4ebe5;
    border-radius: 12px;
    background: #f0f4ef;
    color: var(--home-brand);
    font-style: normal;
  }

  .home-process-card h3,
  .home-benefit-card h3 {
    margin: 0 0 9px;
    color: var(--home-ink);
    font-size: 1.08rem;
    letter-spacing: -.035em;
  }

  .home-process-card p,
  .home-benefit-card p {
    margin: 0;
    color: var(--home-muted);
    font-size: .85rem;
    line-height: 1.72;
  }

  .home-process-connector {
    position: absolute;
    z-index: 2;
    top: 39px;
    right: -18px;
    width: 34px;
    height: 34px;
    display: grid;
    place-items: center;
    border: 1px solid var(--home-line);
    border-radius: 50%;
    background: white;
    color: var(--home-brand);
  }

  .home-benefits-section {
    padding-top: 70px;
    padding-bottom: 96px;
    background: #f8faf8;
  }

  .home-benefit-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
  }

  .home-benefit-card {
    position: relative;
    min-height: 225px;
    padding: 22px 19px;
    border: 1px solid var(--home-line);
    border-radius: 15px;
    background: #fff;
    box-shadow: 0 9px 26px rgba(19,42,57,.035);
    transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
  }

  .home-benefit-icon {
    width: 42px;
    height: 42px;
    margin-bottom: 23px;
  }

  .home-benefit-index {
    position: absolute;
    top: 32px;
    right: 19px;
    color: #a4afac;
    font-size: .68rem;
    font-weight: 800;
    letter-spacing: .08em;
  }

  .home-benefit-card h3 {
    font-size: .97rem;
  }

  .home-benefit-card p {
    font-size: .8rem;
  }

  .home-benefit-link {
    display: grid;
    width: 29px;
    height: 29px;
    place-items: center;
    margin-top: 17px;
    border-radius: 50%;
    background: #f3f6f3;
    color: var(--home-brand);
    transition: transform 180ms ease, background 180ms ease;
  }

  .home-benefit-card:hover .home-benefit-link {
    transform: translateX(3px);
    background: #e9f0eb;
  }

  .home-audience {
    padding: 86px 0;
  }

  .home-retailers {
    background: white;
  }

  .home-representatives {
    background: #f8faf8;
  }

  .home-audience-layout {
    display: grid;
    grid-template-columns: .9fr 1.1fr;
    align-items: center;
    gap: clamp(45px, 8vw, 104px);
  }

  .home-audience-reverse {
    grid-template-columns: 1.1fr .9fr;
  }

  .home-audience-copy {
    max-width: 475px;
  }

  .home-eyebrow-number {
    color: #ad8b48;
    font-size: .72rem;
  }

  .home-audience-copy h2 {
    font-size: clamp(2.05rem, 3.55vw, 3rem);
  }

  .home-audience-copy > p:not(.home-eyebrow) {
    margin: 17px 0 0;
    color: var(--home-muted);
    font-size: .92rem;
    line-height: 1.8;
  }

  .home-check-list {
    display: grid;
    gap: 13px;
    margin: 24px 0 23px;
    padding: 0;
    list-style: none;
  }

  .home-check-list li {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    color: var(--home-ink-soft);
    font-size: .83rem;
    line-height: 1.5;
  }

  .home-check-list svg {
    flex: 0 0 auto;
    margin-top: 1px;
    color: #518b68;
  }

  .home-inline-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--home-brand);
    font-size: .84rem;
    font-weight: 800;
    transition: color 160ms ease, gap 160ms ease;
  }

  .home-inline-link:hover {
    gap: 12px;
    color: var(--home-brand-dark);
  }

  .home-audience-visual {
    position: relative;
    min-height: 370px;
    display: grid;
    place-items: center;
    overflow: hidden;
    border: 1px solid #e0e8e2;
    border-radius: 21px;
    background:
      radial-gradient(circle at 88% 14%, rgba(233,189,98,.16), transparent 29%),
      linear-gradient(140deg, #eaf0e9, #f6f4ec);
  }

  .home-audience-visual::before,
  .home-audience-visual::after {
    content: '';
    position: absolute;
    border: 1px solid rgba(28,83,104,.09);
    border-radius: 50%;
  }

  .home-audience-visual::before {
    width: 380px;
    height: 380px;
    top: -235px;
    right: -115px;
  }

  .home-audience-visual::after {
    width: 270px;
    height: 270px;
    bottom: -195px;
    left: -115px;
  }

  .home-search-window,
  .home-rep-board {
    position: relative;
    z-index: 1;
    width: min(84%, 430px);
    padding: 21px;
    border: 1px solid rgba(221,230,224,.95);
    border-radius: 14px;
    background: rgba(255,255,255,.96);
    box-shadow: 0 22px 50px rgba(19,42,57,.12);
  }

  .home-window-header,
  .home-rep-board-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 14px;
    border-bottom: 1px solid #edf0ec;
  }

  .home-window-brand {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: #2d4651;
    font-size: .72rem;
    font-weight: 800;
  }

  .home-window-brand b {
    width: 22px;
    height: 22px;
    display: grid;
    place-items: center;
    border-radius: 7px;
    background: var(--home-brand);
    color: white;
    font-size: .69rem;
  }

  .home-window-status {
    display: flex;
    align-items: center;
    gap: 7px;
    color: #84918d;
    font-size: .5rem;
    font-weight: 800;
    letter-spacing: .08em;
  }

  .home-window-status i {
    width: 6px;
    height: 6px;
  }

  .home-window-title {
    margin: 18px 0 15px;
  }

  .home-window-title span,
  .home-window-title small {
    display: block;
  }

  .home-window-title span {
    color: var(--home-ink);
    font-size: .96rem;
    font-weight: 750;
  }

  .home-window-title small {
    margin-top: 4px;
    color: var(--home-muted);
    font-size: .65rem;
  }

  .home-form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 9px;
    margin-bottom: 9px;
  }

  .home-form-row > span {
    min-width: 0;
    padding: 10px;
    border: 1px solid #e8eeea;
    border-radius: 8px;
    background: #fbfcfb;
  }

  .home-form-row small,
  .home-form-row strong {
    display: block;
  }

  .home-form-row small {
    color: #899690;
    font-size: .48rem;
    font-weight: 800;
    letter-spacing: .07em;
  }

  .home-form-row strong {
    overflow: hidden;
    margin-top: 5px;
    color: #435760;
    font-size: .64rem;
    font-weight: 650;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .home-form-submit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    margin-top: 12px;
    padding: 10px;
    border-radius: 8px;
    background: var(--home-brand);
    color: white;
    font-size: .66rem;
    font-weight: 750;
  }

  .home-visual-stamp {
    position: absolute;
    right: 13px;
    bottom: 28px;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 11px 13px;
    border: 1px solid #e6ebe5;
    border-radius: 11px;
    background: white;
    box-shadow: 0 12px 28px rgba(19,42,57,.11);
  }

  .home-visual-stamp > svg {
    color: var(--home-brand);
  }

  .home-visual-stamp small {
    font-size: .47rem;
  }

  .home-visual-stamp strong {
    font-size: .64rem;
  }

  .home-rep-visual {
    background:
      radial-gradient(circle at 15% 83%, rgba(91,139,130,.13), transparent 31%),
      linear-gradient(145deg, #e8efec, #edf1ed 58%, #e5ecea);
  }

  .home-rep-board {
    width: min(83%, 425px);
    padding: 18px;
  }

  .home-rep-board-heading {
    padding-bottom: 12px;
    color: var(--home-ink);
    font-size: .76rem;
    font-weight: 750;
  }

  .home-rep-more {
    color: #82918d;
    letter-spacing: 2px;
  }

  .home-rep-chart {
    margin-top: 16px;
    padding: 12px 13px 10px;
    border: 1px solid #e9eeea;
    border-radius: 9px;
    background:
      repeating-linear-gradient(to bottom, transparent, transparent 35px, #edf1ee 36px),
      #fbfcfb;
  }

  .home-chart-label {
    color: #53666c;
    font-size: .61rem;
    font-weight: 700;
  }

  .home-chart-bars {
    height: 88px;
    display: flex;
    align-items: flex-end;
    gap: 6px;
    margin-top: 10px;
  }

  .home-chart-bars i {
    flex: 1;
    min-width: 5px;
    height: 35%;
    border-radius: 3px 3px 0 0;
    background: linear-gradient(180deg, #78a794, #4e7e77);
    transform-origin: bottom;
    animation: home-chart-grow 900ms cubic-bezier(.2,.7,.25,1) both;
  }

  .home-chart-bars i:nth-child(3n) { height: 74%; animation-delay: 90ms; }
  .home-chart-bars i:nth-child(3n + 1) { height: 53%; animation-delay: 150ms; }
  .home-chart-bars i:nth-child(4n) { height: 91%; animation-delay: 220ms; }
  .home-chart-bars i:nth-child(7n) { height: 100%; animation-delay: 290ms; }

  .home-chart-base {
    display: flex;
    justify-content: space-between;
    margin-top: 7px;
    color: #95a19d;
    font-size: .43rem;
    font-weight: 700;
  }

  .home-rep-mini-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-top: 9px;
  }

  .home-rep-mini-cards > span {
    padding: 10px;
    border: 1px solid #e9eeea;
    border-radius: 8px;
    background: white;
  }

  .home-rep-mini-cards small,
  .home-rep-mini-cards strong {
    display: block;
  }

  .home-rep-mini-cards small {
    color: #899690;
    font-size: .44rem;
    font-weight: 800;
    letter-spacing: .05em;
  }

  .home-rep-mini-cards strong {
    margin-top: 5px;
    color: #435760;
    font-size: .62rem;
  }

  .home-rep-note {
    position: absolute;
    right: 10px;
    bottom: 24px;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 11px 13px;
    border: 1px solid #e6ebe5;
    border-radius: 11px;
    background: white;
    box-shadow: 0 12px 28px rgba(19,42,57,.11);
  }

  .home-rep-note-icon {
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    border-radius: 9px;
    background: #eaf1ed;
    color: var(--home-brand);
  }

  .home-rep-note small { font-size: .46rem; }
  .home-rep-note strong { font-size: .65rem; }

  .home-featured-section {
    padding-top: 83px;
    padding-bottom: 91px;
    background: white;
  }

  .home-featured-heading {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 29px;
  }

  .home-featured-heading .home-eyebrow {
    margin-bottom: 12px;
  }

  .home-featured-heading h2 {
    margin: 0;
    color: var(--home-ink);
    font-size: clamp(2rem, 3.6vw, 2.85rem);
    font-weight: 740;
    letter-spacing: -.065em;
    line-height: 1.1;
  }

  .home-featured-heading > div > p:last-child {
    margin: 10px 0 0;
    font-size: .87rem;
  }

  .home-featured-heading > .home-inline-link {
    flex: 0 0 auto;
    margin-bottom: 4px;
  }

  .home-property-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 15px;
  }

  .home-property-empty {
    grid-column: 1 / -1;
    display: grid;
    justify-items: start;
    gap: 9px;
    padding: 27px;
    border: 1px solid var(--home-line);
    border-radius: 15px;
    background: linear-gradient(120deg, #fff, #f6f8f5);
    color: var(--home-muted);
    font-size: .84rem;
    line-height: 1.6;
  }

  .home-property-empty strong {
    color: var(--home-ink);
    font-size: 1rem;
  }

  .home-property-card {
    overflow: hidden;
    border: 1px solid var(--home-line);
    border-radius: 14px;
    background: white;
    box-shadow: 0 8px 27px rgba(19,42,57,.045);
    transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
  }

  .home-property-image {
    position: relative;
    height: 155px;
    display: block;
    overflow: hidden;
    background:
      linear-gradient(180deg, rgba(17,44,57,.02), rgba(17,44,57,.2)),
      linear-gradient(135deg, #d5e2d8, #ebdfbf);
  }

  .home-property-image::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(0deg, rgba(17,42,53,.4), transparent 48%);
  }

  .home-property-scene-2 .home-property-image { background: linear-gradient(145deg,#c7d4d5,#e4ddc5); }
  .home-property-scene-3 .home-property-image { background: linear-gradient(145deg,#d4e2df,#c5d5cf); }
  .home-property-scene-4 .home-property-image { background: linear-gradient(145deg,#e3decf,#d1dfd8); }

  .home-scene-sun {
    position: absolute;
    top: 22px;
    right: 27px;
    width: 31px;
    height: 31px;
    border-radius: 50%;
    background: rgba(241, 207, 130, .8);
    filter: blur(.2px);
  }

  .home-scene-building {
    position: absolute;
    right: 12%;
    bottom: 20px;
    left: 10%;
    height: 84px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
    padding: 14px 12px 0;
    border: 1px solid rgba(255,255,255,.72);
    border-bottom: 0;
    background: linear-gradient(130deg,#e7e5d8,#b9c9bd);
    box-shadow: 0 10px 20px rgba(20,46,50,.12);
    transition: transform 400ms ease;
  }

  .home-scene-building i {
    height: 29px;
    border: 1px solid rgba(255,255,255,.43);
    background: linear-gradient(140deg,#75a1a0,#376b76);
  }

  .home-scene-building i:nth-child(4n + 1) {
    background: linear-gradient(140deg,#edd493,#b58751);
  }

  .home-property-card:hover .home-scene-building {
    transform: scale(1.06);
  }

  .home-scene-foreground {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    height: 22px;
    background: linear-gradient(180deg,rgba(34,68,65,.13),rgba(34,68,65,.46));
  }

  .home-property-pill {
    position: absolute;
    z-index: 2;
    top: 11px;
    left: 11px;
    padding: 5px 8px;
    border: 1px solid rgba(255,255,255,.63);
    border-radius: 99px;
    background: rgba(255,255,255,.88);
    color: var(--home-brand-dark);
    font-size: .57rem;
    font-weight: 800;
  }

  .home-scene-label {
    position: absolute;
    z-index: 2;
    bottom: 9px;
    left: 11px;
    color: rgba(255,255,255,.9);
    font-size: .48rem;
    font-weight: 800;
    letter-spacing: .1em;
  }

  .home-scene-label i {
    padding: 0 3px;
    color: #f2cf7e;
    font-style: normal;
  }

  .home-property-content {
    padding: 15px 14px 13px;
  }

  .home-property-location {
    display: flex;
    align-items: center;
    gap: 5px;
    color: var(--home-muted);
    font-size: .64rem;
  }

  .home-property-location svg {
    color: var(--home-brand);
  }

  .home-property-content h3 {
    min-height: 39px;
    margin: 8px 0 13px;
    color: var(--home-ink);
    font-size: .91rem;
    letter-spacing: -.025em;
    line-height: 1.35;
  }

  .home-property-data {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 8px;
    padding: 11px 0;
    border-top: 1px solid #edf0ed;
    border-bottom: 1px solid #edf0ed;
  }

  .home-property-data small,
  .home-property-data strong {
    display: block;
  }

  .home-property-data small {
    color: #899690;
    font-size: .49rem;
    font-weight: 800;
    letter-spacing: .06em;
  }

  .home-property-data strong {
    overflow: hidden;
    margin-top: 5px;
    color: #334a55;
    font-size: .63rem;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .home-property-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding-top: 12px;
  }

  .home-property-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #62806d;
    font-size: .59rem;
    font-weight: 700;
  }

  .home-property-status i {
    width: 6px;
    height: 6px;
    background: #70a47e;
    box-shadow: none;
  }

  .home-property-link {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: var(--home-brand);
    font-size: .63rem;
    font-weight: 800;
  }

  .home-onboarding-section {
    padding: 81px 0;
    background: #f5f8f5;
  }

  .home-onboarding-layout {
    display: grid;
    grid-template-columns: .95fr 1.05fr;
    align-items: center;
    gap: clamp(40px, 7vw, 85px);
  }

  .home-onboarding-copy {
    max-width: 480px;
  }

  .home-onboarding-copy h2 {
    font-size: clamp(2.1rem, 3.7vw, 3.15rem);
  }

  .home-onboarding-copy > p:not(.home-eyebrow) {
    margin: 15px 0 22px;
    color: var(--home-muted);
    font-size: .91rem;
    line-height: 1.8;
  }

  .home-button-dark {
    background: var(--home-brand);
    color: white;
    box-shadow: 0 10px 23px rgba(28,83,104,.15);
  }

  .home-button-dark:hover {
    background: var(--home-brand-dark);
    box-shadow: 0 13px 28px rgba(28,83,104,.2);
  }

  .home-onboarding-steps {
    display: grid;
    gap: 11px;
  }

  .home-onboarding-step {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 16px 17px;
    border: 1px solid #e2e9e4;
    border-radius: 12px;
    background: white;
    box-shadow: 0 8px 23px rgba(19,42,57,.035);
    transition: transform 180ms ease, box-shadow 180ms ease;
  }

  .home-onboarding-step:hover {
    transform: translateX(3px);
    box-shadow: 0 12px 28px rgba(19,42,57,.075);
  }

  .home-onboarding-number {
    flex: 0 0 auto;
    width: 39px;
    height: 39px;
    display: grid;
    place-items: center;
    border-radius: 11px;
    background: #f5f0e2;
    color: #967338;
    font-size: .7rem;
    font-weight: 850;
  }

  .home-onboarding-step-copy {
    flex: 1 1 auto;
  }

  .home-onboarding-step-copy strong,
  .home-onboarding-step-copy small {
    display: block;
  }

  .home-onboarding-step-copy strong {
    color: var(--home-ink);
    font-size: .82rem;
  }

  .home-onboarding-step-copy small {
    margin-top: 4px;
    color: var(--home-muted);
    font-size: .72rem;
    line-height: 1.5;
  }

  .home-onboarding-step > svg {
    flex: 0 0 auto;
    color: #789087;
  }

  .home-final-section {
    position: relative;
    overflow: hidden;
    padding: 67px 0;
    background: linear-gradient(115deg, #153949, #1c5368);
    color: white;
  }

  .home-final-pattern {
    position: absolute;
    top: -235px;
    right: -65px;
    width: 570px;
    height: 570px;
    border: 1px solid rgba(255,255,255,.12);
    border-radius: 50%;
  }

  .home-final-pattern::before,
  .home-final-pattern::after {
    content: '';
    position: absolute;
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 50%;
  }

  .home-final-pattern::before { inset: 42px; }
  .home-final-pattern::after { inset: 96px; }

  .home-final-layout {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 35px;
  }

  .home-final-layout .home-eyebrow {
    color: #f1d48f;
  }

  .home-final-layout h2 {
    max-width: 610px;
    color: white;
    font-size: clamp(2.15rem, 4.1vw, 3.5rem);
  }

  .home-final-layout > div:first-child > p:last-child {
    margin: 12px 0 0;
    color: rgba(255,255,255,.73);
    font-size: .9rem;
    line-height: 1.7;
  }

  .home-final-actions {
    flex: 0 0 auto;
    margin-top: 0;
  }

  .home-button-final-outline {
    border-color: rgba(255,255,255,.34);
    background: rgba(255,255,255,.04);
    color: white;
  }

  .home-reveal {
    opacity: 1;
    transform: none;
  }

  .home-landing.reveal-ready .home-reveal {
    opacity: 0;
    transform: translateY(19px);
    transition: opacity 620ms ease, transform 620ms cubic-bezier(.2,.7,.25,1);
    transition-delay: var(--reveal-delay, 0ms);
  }

  .home-landing.reveal-ready .home-reveal.is-visible {
    opacity: 1;
    transform: translateY(0);
  }

  .home-landing .topbar {
    border-bottom-color: rgba(145, 163, 188, .19);
  }

  .home-landing + .footer,
  .locentra-app:has(.home-landing) .footer {
    margin-top: 0;
    border-top-color: #e5eae7;
    background: #f8faf8;
  }

  @keyframes home-fade-up {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes home-card-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-7px); }
  }

  @keyframes home-building-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }

  @keyframes home-glow-drift {
    from { transform: translate3d(-10px, 0, 0) scale(.96); }
    to { transform: translate3d(16px, 14px, 0) scale(1.04); }
  }

  @keyframes home-orbit-pulse {
    0%, 100% { opacity: .4; transform: scale(.98); }
    50% { opacity: .85; transform: scale(1.02); }
  }

  @keyframes home-chart-grow {
    from { transform: scaleY(.15); opacity: .4; }
    to { transform: scaleY(1); opacity: 1; }
  }

  @media (max-width: 1050px) {
    .home-hero-layout {
      grid-template-columns: 1fr .9fr;
      gap: 34px;
    }

    .home-hero h1 {
      font-size: clamp(3rem, 5.5vw, 4.3rem);
    }

    .home-metric {
      gap: 9px;
      padding-right: 11px;
      padding-left: 11px;
    }

    .home-metric-icon {
      width: 38px;
      height: 38px;
    }

    .home-metric-copy strong { font-size: .72rem; }
    .home-metric-copy small { font-size: .6rem; }

    .home-benefit-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .home-property-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 760px) {
    .locentra-app:has(.home-landing) .topbar-inner {
      width: min(100% - 28px, 560px);
      flex-wrap: wrap;
      gap: 10px;
      padding: 12px 0 9px;
    }

    .locentra-app:has(.home-landing) .main-nav {
      order: 3;
      width: 100%;
      justify-content: space-between;
      gap: 8px;
      padding: 7px 0 3px;
    }

    .locentra-app:has(.home-landing) .main-nav a {
      font-size: .75rem;
    }

    .locentra-app:has(.home-landing) .main-nav a.active::after {
      bottom: -4px;
    }

    .locentra-app:has(.home-landing) .nav-actions {
      display: flex;
      gap: 0;
      margin-left: auto;
    }

    .locentra-app:has(.home-landing) .nav-actions .btn-secondary {
      display: none;
    }

    .locentra-app:has(.home-landing) .nav-actions .btn-primary {
      width: auto;
      padding: 9px 13px;
      font-size: .77rem;
    }

    .home-shell {
      width: min(100% - 34px, 560px);
    }

    .home-hero-layout {
      grid-template-columns: 1fr;
      gap: 31px;
      min-height: 0;
      padding-top: 52px;
      padding-bottom: 31px;
    }

    .home-hero h1 {
      max-width: 580px;
      font-size: clamp(2.8rem, 11vw, 4rem);
    }

    .home-hero-description {
      font-size: .95rem;
    }

    .home-hero-visual {
      min-height: 355px;
    }

    .home-visual-building {
      transform: scale(.87);
    }

    .home-metrics {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 4px 0;
      padding-top: 15px;
      padding-bottom: 15px;
    }

    .home-metric {
      padding: 11px 7px;
    }

    .home-metric:nth-child(odd) {
      padding-left: 0;
    }

    .home-metric:nth-child(even) {
      padding-right: 0;
      padding-left: 12px;
    }

    .home-metric:nth-child(2) .home-metric-divider {
      display: none;
    }

    .home-metric-copy strong { font-size: .71rem; }
    .home-metric-copy small { font-size: .58rem; }

    .home-section {
      padding: 68px 0;
    }

    .home-section-heading {
      margin-bottom: 27px;
      text-align: left;
    }

    .home-section-heading .home-eyebrow {
      justify-content: flex-start;
    }

    .home-section-heading > p:last-child {
      margin-left: 0;
    }

    .home-process-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .home-process-card {
      min-height: 0;
      padding: 19px;
    }

    .home-process-card-top {
      margin-bottom: 17px;
    }

    .home-process-connector {
      display: none;
    }

    .home-benefits-section {
      padding: 66px 0 72px;
    }

    .home-benefit-grid {
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .home-benefit-card {
      min-height: 220px;
      padding: 17px 14px;
    }

    .home-benefit-index {
      top: 27px;
      right: 13px;
    }

    .home-benefit-icon {
      width: 38px;
      height: 38px;
      margin-bottom: 18px;
    }

    .home-benefit-card h3 { font-size: .87rem; }
    .home-benefit-card p { font-size: .74rem; }

    .home-audience {
      padding: 68px 0;
    }

    .home-audience-layout,
    .home-audience-reverse {
      grid-template-columns: 1fr;
      gap: 29px;
    }

    .home-audience-reverse .home-rep-visual {
      order: 2;
    }

    .home-audience-reverse .home-audience-copy {
      order: 1;
    }

    .home-audience-visual {
      min-height: 340px;
    }

    .home-featured-section {
      padding: 67px 0;
    }

    .home-featured-heading {
      align-items: flex-start;
      flex-direction: column;
      gap: 14px;
    }

    .home-property-grid {
      grid-template-columns: 1fr 1fr;
      gap: 11px;
    }

    .home-property-image {
      height: 125px;
    }

    .home-property-content {
      padding: 12px 10px 11px;
    }

    .home-property-content h3 {
      min-height: 43px;
      font-size: .81rem;
    }

    .home-property-data {
      grid-template-columns: 1fr;
      gap: 8px;
    }

    .home-property-footer {
      align-items: flex-start;
      flex-direction: column;
    }

    .home-onboarding-section {
      padding: 66px 0;
    }

    .home-onboarding-layout {
      grid-template-columns: 1fr;
      gap: 28px;
    }

    .home-final-section {
      padding: 53px 0;
    }

    .home-final-layout {
      align-items: flex-start;
      flex-direction: column;
      gap: 20px;
    }

    .home-final-actions {
      margin-top: 0;
    }
  }

  @media (max-width: 420px) {
    .home-shell {
      width: calc(100% - 28px);
    }

    .locentra-app:has(.home-landing) .brand {
      gap: 8px;
    }

    .locentra-app:has(.home-landing) .brand-mark {
      width: 35px;
      height: 35px;
    }

    .locentra-app:has(.home-landing) .brand-name strong {
      font-size: .95rem;
    }

    .locentra-app:has(.home-landing) .main-nav a {
      font-size: .68rem;
    }

    .home-hero-layout {
      padding-top: 39px;
    }

    .home-hero h1 {
      font-size: clamp(2.6rem, 11.5vw, 3.35rem);
    }

    .home-hero-actions {
      align-items: stretch;
      flex-direction: column;
    }

    .home-button {
      width: 100%;
    }

    .home-hero-visual {
      min-height: 310px;
    }

    .home-visual-building {
      width: 84%;
      transform: scale(.78);
    }

    .home-property-float-top {
      top: 62px;
      right: 8px;
      padding: 8px;
    }

    .home-property-float-bottom {
      bottom: 47px;
      left: 7px;
      padding: 8px;
    }

    .home-property-float small { font-size: .46rem; }
    .home-property-float strong { font-size: .64rem; }

    .home-visual-caption {
      right: 12px;
      bottom: 14px;
      left: 12px;
      font-size: .55rem;
    }

    .home-hero-bottom {
      gap: 8px;
      font-size: .47rem;
      letter-spacing: .09em;
    }

    .home-bottom-rule {
      width: 22px;
    }

    .home-metric {
      gap: 7px;
    }

    .home-metric-icon {
      width: 33px;
      height: 33px;
    }

    .home-metric-icon svg {
      width: 18px;
      height: 18px;
    }

    .home-metric-copy strong { font-size: .63rem; }
    .home-metric-copy small { font-size: .53rem; }

    .home-benefit-grid {
      grid-template-columns: 1fr;
    }

    .home-benefit-card {
      min-height: 0;
    }

    .home-benefit-card p {
      max-width: 320px;
    }

    .home-audience-visual {
      min-height: 308px;
    }

    .home-search-window,
    .home-rep-board {
      width: calc(100% - 40px);
      padding: 14px;
    }

    .home-property-grid {
      grid-template-columns: 1fr;
    }

    .home-property-image {
      height: 165px;
    }

    .home-property-content h3 {
      min-height: 0;
    }

    .home-property-data {
      grid-template-columns: 1fr 1.2fr;
    }

    .home-property-footer {
      align-items: center;
      flex-direction: row;
    }

    .home-final-actions {
      align-items: stretch;
      flex-direction: column;
      width: 100%;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .home-landing *,
    .home-landing *::before,
    .home-landing *::after {
      scroll-behavior: auto !important;
      animation-duration: .01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: .01ms !important;
    }
  }

  .locentra-app:not(:has(.home-landing)) {
    min-height: 100vh;
    background:
      radial-gradient(ellipse at 12% 0%, rgba(28, 83, 104, .055), transparent 28%),
      #f5f7f6;
    color: #132a39;
  }

  .locentra-app:not(:has(.home-landing)) .topbar {
    background: rgba(255, 255, 255, .94);
    border-bottom-color: rgba(145, 163, 188, .2);
    box-shadow: 0 5px 20px rgba(19, 42, 57, .035);
  }

  .locentra-app:not(:has(.home-landing)) .topbar-inner {
    min-height: 76px;
  }

  .locentra-app:not(:has(.home-landing)) .brand-mark {
    background: linear-gradient(140deg, #1c5368, #347c88);
    box-shadow: 0 9px 21px rgba(28, 83, 104, .22);
  }

  .locentra-app:not(:has(.home-landing)) .btn {
    border-radius: 10px;
    transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease, border-color 180ms ease;
  }

  .locentra-app:not(:has(.home-landing)) .btn:hover {
    transform: translateY(-1px);
  }

  .locentra-app:not(:has(.home-landing)) .btn-primary {
    background: linear-gradient(135deg, #1c5368, #123847);
    box-shadow: 0 10px 22px rgba(28, 83, 104, .17);
  }

  .locentra-app:not(:has(.home-landing)) .btn-primary:hover {
    box-shadow: 0 13px 26px rgba(28, 83, 104, .24);
  }

  .locentra-app:not(:has(.home-landing)) .btn-secondary {
    border-color: #e0e8e3;
    background: #fff;
    color: #203b49;
    box-shadow: 0 5px 15px rgba(19, 42, 57, .045);
  }

  .locentra-app:not(:has(.home-landing)) .page {
    min-height: calc(100vh - 160px);
    padding: 46px 0 72px;
    animation: app-page-enter 420ms cubic-bezier(.2,.7,.25,1) both;
  }

  .locentra-app:not(:has(.home-landing)) .page-header {
    margin-bottom: 25px;
  }

  .locentra-app:not(:has(.home-landing)) .page-header h1 {
    color: #132a39;
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 740;
    letter-spacing: -.065em;
    line-height: 1.08;
  }

  .locentra-app:not(:has(.home-landing)) .eyebrow {
    color: #1c5368;
  }

  .locentra-app:not(:has(.home-landing)) .container {
    width: min(1160px, calc(100% - 48px));
  }

  .locentra-app:not(:has(.home-landing)) .property-grid {
    gap: 18px;
  }

  .locentra-app:not(:has(.home-landing)) .property-card,
  .locentra-app:not(:has(.home-landing)) .feature-card,
  .locentra-app:not(:has(.home-landing)) .step-card,
  .locentra-app:not(:has(.home-landing)) .detail-card,
  .locentra-app:not(:has(.home-landing)) .content-panel,
  .locentra-app:not(:has(.home-landing)) .sidebar,
  .locentra-app:not(:has(.home-landing)) .auth-card,
  .locentra-app:not(:has(.home-landing)) .stat-card {
    border-color: #e2e9e5;
    border-radius: 16px;
    box-shadow: 0 9px 28px rgba(19, 42, 57, .05);
  }

  .locentra-app:not(:has(.home-landing)) .property-card {
    animation: app-card-enter 500ms cubic-bezier(.2,.7,.25,1) both;
  }

  .locentra-app:not(:has(.home-landing)) .property-card:nth-child(2) { animation-delay: 45ms; }
  .locentra-app:not(:has(.home-landing)) .property-card:nth-child(3) { animation-delay: 90ms; }
  .locentra-app:not(:has(.home-landing)) .property-card:nth-child(4) { animation-delay: 135ms; }
  .locentra-app:not(:has(.home-landing)) .property-card:nth-child(5) { animation-delay: 180ms; }
  .locentra-app:not(:has(.home-landing)) .property-card:nth-child(6) { animation-delay: 225ms; }

  .locentra-app:not(:has(.home-landing)) .property-card:hover,
  .locentra-app:not(:has(.home-landing)) .feature-card:hover {
    transform: translateY(-4px);
    border-color: #d0ded7;
    box-shadow: 0 18px 39px rgba(19, 42, 57, .1);
  }

  .locentra-app:not(:has(.home-landing)) .property-visual {
    height: 190px;
    background:
      linear-gradient(180deg, rgba(17, 44, 57, .03), rgba(17, 44, 57, .22)),
      linear-gradient(135deg, #d5e2d8 0%, #e7e3d3 52%, #c7d8d2 100%);
  }

  .locentra-app:not(:has(.home-landing)) .property-visual::before {
    top: 16px;
    right: 16px;
    width: 112px;
    height: 84px;
    border: 0;
    border-radius: 12px;
    background: linear-gradient(140deg, rgba(255,255,255,.2), rgba(28,83,104,.11));
    transform: none;
  }

  .locentra-app:not(:has(.home-landing)) .property-visual::after {
    right: 25px;
    bottom: 18px;
    left: 25px;
    height: 70px;
    border-radius: 9px 9px 2px 2px;
    background:
      linear-gradient(90deg, transparent 8%, rgba(240, 210, 141, .76) 8% 17%, transparent 17% 26%, rgba(86, 133, 139, .85) 26% 36%, transparent 36% 45%, rgba(86, 133, 139, .85) 45% 55%, transparent 55% 64%, rgba(240, 210, 141, .76) 64% 74%, transparent 74% 83%, rgba(86, 133, 139, .85) 83% 93%, transparent 93%),
      linear-gradient(180deg, #dce3d6 0 22%, #c2d0c6 22% 100%);
  }

  .locentra-app:not(:has(.home-landing)) .property-body {
    padding: 18px 18px 19px;
  }

  .locentra-app:not(:has(.home-landing)) .property-head h3 {
    color: #172f3e;
    font-size: 1.03rem;
  }

  .locentra-app:not(:has(.home-landing)) .property-head p {
    color: #687b85;
  }

  .locentra-app:not(:has(.home-landing)) .match-badge {
    background: #eaf1ed;
    color: #1c5368;
  }

  .locentra-app:not(:has(.home-landing)) .property-meta {
    gap: 8px;
  }

  .locentra-app:not(:has(.home-landing)) .property-meta span {
    padding: 6px 8px;
    border: 1px solid #e8eeea;
    border-radius: 7px;
    background: #fafcfb;
    color: #4a616b;
    font-size: .72rem;
  }

  .locentra-app:not(:has(.home-landing)) .property-footer {
    padding-top: 14px;
    border-top: 1px solid #edf0ed;
  }

  .locentra-app:not(:has(.home-landing)) .property-footer .link,
  .locentra-app:not(:has(.home-landing)) .link {
    color: #1c5368;
  }

  .locentra-app:not(:has(.home-landing)) .status-pill {
    background: #edf5ee;
    color: #4d8060;
  }

  .locentra-app:not(:has(.home-landing)) .filter-bar {
    gap: 9px;
    margin: 20px 0 25px;
  }

  .locentra-app:not(:has(.home-landing)) .chip {
    min-height: 39px;
    border-color: #e0e8e3;
    background: #fff;
    color: #405761;
    box-shadow: 0 4px 12px rgba(19,42,57,.035);
    transition: color 160ms ease, border-color 160ms ease, background 160ms ease, transform 160ms ease, box-shadow 160ms ease;
  }

  .locentra-app:not(:has(.home-landing)) .chip:hover {
    transform: translateY(-1px);
    border-color: #9ab9b3;
  }

  .locentra-app:not(:has(.home-landing)) .chip.active {
    border-color: #1c5368;
    background: #1c5368;
    color: white;
    box-shadow: 0 8px 17px rgba(28,83,104,.17);
  }

  .properties-empty-state {
    display: grid;
    justify-items: center;
    padding: 58px 22px;
    border: 1px dashed #cad8d0;
    border-radius: 16px;
    background: rgba(255,255,255,.72);
    text-align: center;
  }

  .properties-empty-state > span {
    width: 48px;
    height: 48px;
    display: grid;
    place-items: center;
    border-radius: 14px;
    background: #eaf1ed;
    color: #1c5368;
  }

  .properties-empty-state h2 {
    margin: 16px 0 7px;
    color: #132a39;
    font-size: 1.25rem;
  }

  .properties-empty-state p {
    max-width: 400px;
    margin: 0 0 19px;
    color: #687b85;
    font-size: .89rem;
    line-height: 1.65;
  }

  .locentra-app:not(:has(.home-landing)) .steps-grid {
    gap: 16px;
  }

  .locentra-app:not(:has(.home-landing)) .step-card {
    position: relative;
    border-radius: 16px;
    transition: transform 180ms ease, box-shadow 180ms ease;
    animation: app-card-enter 500ms cubic-bezier(.2,.7,.25,1) both;
  }

  .locentra-app:not(:has(.home-landing)) .step-card:nth-child(2) { animation-delay: 70ms; }
  .locentra-app:not(:has(.home-landing)) .step-card:nth-child(3) { animation-delay: 140ms; }
  .locentra-app:not(:has(.home-landing)) .step-card:nth-child(4) { animation-delay: 210ms; }

  .locentra-app:not(:has(.home-landing)) .step-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 34px rgba(19,42,57,.09);
  }

  .locentra-app:not(:has(.home-landing)) .step-number,
  .locentra-app:not(:has(.home-landing)) .feature-icon {
    background: #eaf1ed;
    color: #1c5368;
  }

  .locentra-app:not(:has(.home-landing)) .feature-card h3,
  .locentra-app:not(:has(.home-landing)) .step-card h3 {
    color: #172f3e;
  }

  .locentra-app:not(:has(.home-landing)) .detail-layout {
    align-items: start;
    gap: 20px;
  }

  .locentra-app:not(:has(.home-landing)) .detail-gallery {
    min-height: 460px;
    border-color: #dce6e0;
    border-radius: 18px;
    background:
      linear-gradient(180deg, rgba(18,56,71,.02), rgba(18,56,71,.32)),
      linear-gradient(145deg, #e1e8dc 0 30%, #c5d5ce 30% 41%, #e6dfc9 41% 51%, #c8d6ce 51% 67%, #a6c0b5 67% 100%);
    box-shadow: 0 15px 38px rgba(19,42,57,.08);
  }

  .locentra-app:not(:has(.home-landing)) .detail-gallery::before {
    top: 14%;
    right: 12%;
    width: 110px;
    height: 110px;
    border-color: rgba(255,255,255,.3);
    background: rgba(233,189,98,.26);
  }

  .locentra-app:not(:has(.home-landing)) .detail-gallery::after {
    bottom: 30px;
    height: 145px;
    border-radius: 12px 12px 2px 2px;
    background:
      linear-gradient(90deg, transparent 7%, #eacb83 7% 15%, transparent 15% 24%, #4d7b80 24% 34%, transparent 34% 42%, #4d7b80 42% 52%, transparent 52% 61%, #eacb83 61% 71%, transparent 71% 80%, #4d7b80 80% 92%, transparent 92%),
      linear-gradient(180deg, #e6e4d6 0 24%, #b9c9bd 24% 100%);
  }

  .locentra-app:not(:has(.home-landing)) .detail-card {
    position: sticky;
    top: 100px;
    padding: 27px;
  }

  .locentra-app:not(:has(.home-landing)) .detail-card h1 {
    color: #132a39;
    font-weight: 740;
    font-size: clamp(1.8rem, 3.2vw, 2.75rem);
    line-height: 1.12;
    letter-spacing: -.05em;
    overflow-wrap: anywhere;
    text-wrap: pretty;
  }

  .locentra-app:not(:has(.home-landing)) .metric-box {
    border-color: #e2e9e5;
    border-radius: 12px;
    background: #f7f9f7;
  }

  .locentra-app:not(:has(.home-landing)) .metric-box strong {
    color: #173847;
    font-size: 1rem;
    overflow-wrap: anywhere;
  }

  .locentra-app:not(:has(.home-landing)) .metric-box span {
    color: #687b85;
  }

  .locentra-app:not(:has(.home-landing)) .detail-actions {
    align-items: stretch;
  }

  .locentra-app:not(:has(.home-landing)) .dashboard-grid {
    align-items: start;
    gap: 18px;
  }

  .locentra-app:not(:has(.home-landing)) .sidebar {
    position: sticky;
    top: 98px;
    padding: 17px 12px;
  }

  .locentra-app:not(:has(.home-landing)) .sidebar h3 {
    padding: 2px 10px 13px;
    border-bottom: 1px solid #edf0ed;
    color: #173847;
  }

  .locentra-app:not(:has(.home-landing)) .side-link {
    transition: color 150ms ease, background 150ms ease, transform 150ms ease;
  }

  .locentra-app:not(:has(.home-landing)) .side-link:hover {
    transform: translateX(2px);
    background: #f5f8f6;
    color: #1c5368;
  }

  .locentra-app:not(:has(.home-landing)) .side-link.active {
    background: #eaf1ed;
    color: #1c5368;
  }

  .locentra-app:not(:has(.home-landing)) .content-panel {
    min-width: 0;
    padding: 25px;
  }

  .locentra-app:not(:has(.home-landing)) .stats-row {
    gap: 12px;
  }

  .locentra-app:not(:has(.home-landing)) .stat-card {
    padding: 18px 16px;
    background: linear-gradient(150deg, #fff, #fbfcfb);
  }

  .locentra-app:not(:has(.home-landing)) .stat-card span {
    color: #687b85;
    font-size: .73rem;
  }

  .locentra-app:not(:has(.home-landing)) .stat-card strong {
    color: #163949;
  }

  .locentra-app:not(:has(.home-landing)) .two-col {
    gap: 14px;
  }

  .locentra-app:not(:has(.home-landing)) .two-col > .feature-card {
    min-width: 0;
    padding: 20px 17px;
  }

  .locentra-app:not(:has(.home-landing)) .list-row {
    grid-template-columns: minmax(0, 1.3fr) minmax(82px, .8fr) auto;
    gap: 10px;
    padding: 14px 0;
  }

  .locentra-app:not(:has(.home-landing)) .list-row strong {
    color: #1c3542;
    font-size: .87rem;
  }

  .locentra-app:not(:has(.home-landing)) .list-row small {
    color: #73838a;
    font-size: .75rem;
  }

  .locentra-app:not(:has(.home-landing)) .label {
    border-radius: 99px;
    background: #edf3ef;
    color: #426b59;
  }

  .locentra-app:not(:has(.home-landing)) .retailer-dashboard-sections {
    display: grid;
    gap: 22px;
  }

  .locentra-app:not(:has(.home-landing)) .retailer-requirements-section,
  .locentra-app:not(:has(.home-landing)) .retailer-matches-section {
    min-width: 0;
    padding: 24px;
  }

  .locentra-app:not(:has(.home-landing)) .retailer-requirements-section > p,
  .locentra-app:not(:has(.home-landing)) .retailer-matches-section > p {
    margin: 0 0 16px;
  }

  .locentra-app:not(:has(.home-landing)) .retailer-matches-section {
    background: linear-gradient(145deg, #fff, #f7faf8);
    border-color: #dce8df;
  }

  .locentra-app:not(:has(.home-landing)) .retailer-match-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    margin-top: 20px;
  }

  .locentra-app:not(:has(.home-landing)) .retailer-match-card {
    display: flex;
    flex-direction: column;
    min-width: 0;
    padding: 18px;
    border: 1px solid #e2e9e5;
    border-radius: 14px;
    background: #fff;
    box-shadow: 0 8px 22px rgba(19, 42, 57, .045);
  }

  .locentra-app:not(:has(.home-landing)) .retailer-match-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 14px;
  }

  .locentra-app:not(:has(.home-landing)) .retailer-match-type,
  .locentra-app:not(:has(.home-landing)) .retailer-match-score {
    display: inline-flex;
    align-items: center;
    max-width: 100%;
    border-radius: 999px;
    padding: 6px 10px;
    font-size: .7rem;
    font-weight: 750;
    line-height: 1.25;
  }

  .locentra-app:not(:has(.home-landing)) .retailer-match-type {
    overflow-wrap: anywhere;
    background: #f1f5f2;
    color: #4c6260;
  }

  .locentra-app:not(:has(.home-landing)) .retailer-match-score {
    flex: 0 0 auto;
    background: #eaf4ec;
    color: #34704c;
  }

  .locentra-app:not(:has(.home-landing)) .retailer-match-card h4 {
    margin: 0;
    color: #1c3542;
    font-size: 1rem;
    line-height: 1.4;
    letter-spacing: -.02em;
    overflow-wrap: anywhere;
  }

  .locentra-app:not(:has(.home-landing)) .retailer-match-location {
    margin: 6px 0 16px;
    color: #687b85;
    font-size: .81rem;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }

  .locentra-app:not(:has(.home-landing)) .retailer-match-description {
    margin: -7px 0 14px;
    color: #536970;
    font-size: .77rem;
    line-height: 1.55;
    overflow-wrap: anywhere;
  }

  .locentra-app:not(:has(.home-landing)) .retailer-match-metrics {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    padding: 14px 0;
    border-top: 1px solid #edf1ee;
    border-bottom: 1px solid #edf1ee;
  }

  .locentra-app:not(:has(.home-landing)) .retailer-match-metrics > div {
    min-width: 0;
  }

  .locentra-app:not(:has(.home-landing)) .retailer-match-metrics span,
  .locentra-app:not(:has(.home-landing)) .retailer-match-metrics strong {
    display: block;
    overflow-wrap: anywhere;
  }

  .locentra-app:not(:has(.home-landing)) .retailer-match-metrics span {
    margin-bottom: 4px;
    color: #75858a;
    font-size: .69rem;
  }

  .locentra-app:not(:has(.home-landing)) .retailer-match-metrics strong {
    color: #1c3542;
    font-size: .8rem;
  }

  .locentra-app:not(:has(.home-landing)) .retailer-match-reasons {
    flex: 1 0 auto;
    margin: 13px 0 16px;
    color: #536970;
    font-size: .76rem;
    line-height: 1.55;
    overflow-wrap: anywhere;
  }

  .locentra-app:not(:has(.home-landing)) .retailer-match-actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    margin: auto 0 0;
  }

  .locentra-app:not(:has(.home-landing)) .retailer-match-actions .btn {
    min-width: 0;
    padding: 9px 8px;
    text-align: center;
    white-space: normal;
    line-height: 1.35;
    overflow-wrap: anywhere;
  }

  .locentra-app:not(:has(.home-landing)) .retailer-match-actions .btn:first-child {
    grid-column: 1 / -1;
  }

  .locentra-app:not(:has(.home-landing)) .form-panel {
    width: min(100%, 780px);
    padding: clamp(20px, 4vw, 34px);
  }

  .locentra-app:not(:has(.home-landing)) .field {
    margin-bottom: 18px;
  }

  .locentra-app:not(:has(.home-landing)) .field label {
    color: #263f4a;
    font-size: .84rem;
    font-weight: 700;
  }

  .locentra-app:not(:has(.home-landing)) .field input,
  .locentra-app:not(:has(.home-landing)) .field select,
  .locentra-app:not(:has(.home-landing)) .field textarea {
    min-height: 46px;
    border-color: #dfe7e2;
    border-radius: 10px;
    background: #fcfdfc;
    color: #18313f;
    font-size: .9rem;
    transition: border-color 160ms ease, box-shadow 160ms ease, background 160ms ease;
  }

  .locentra-app:not(:has(.home-landing)) .field input::placeholder,
  .locentra-app:not(:has(.home-landing)) .field textarea::placeholder {
    color: #9aa7a6;
  }

  .locentra-app:not(:has(.home-landing)) .field input:focus,
  .locentra-app:not(:has(.home-landing)) .field select:focus,
  .locentra-app:not(:has(.home-landing)) .field textarea:focus {
    border-color: rgba(28,83,104,.55);
    background: white;
    box-shadow: 0 0 0 4px rgba(28,83,104,.09);
  }

  .locentra-app:not(:has(.home-landing)) .progress {
    gap: 8px;
  }

  .locentra-app:not(:has(.home-landing)) .progress-step {
    border: 1px solid #e2e9e5;
    background: #f7f9f7;
    color: #6c7d83;
  }

  .locentra-app:not(:has(.home-landing)) .progress-step.active {
    border-color: #1c5368;
    background: #1c5368;
    color: white;
  }

  .locentra-app:not(:has(.home-landing)) .auth-shell {
    min-height: calc(100vh - 168px);
    padding: 52px 20px;
    background:
      radial-gradient(circle at 15% 20%, rgba(28,83,104,.07), transparent 27%),
      radial-gradient(circle at 85% 80%, rgba(233,189,98,.11), transparent 24%);
  }

  .locentra-app:not(:has(.home-landing)) .auth-card {
    padding: 34px;
    border-radius: 18px;
    box-shadow: 0 20px 54px rgba(19,42,57,.1);
    animation: app-card-enter 500ms cubic-bezier(.2,.7,.25,1) both;
  }

  .locentra-app:not(:has(.home-landing)) .auth-card h1 {
    color: #132a39;
    font-size: clamp(1.9rem, 4vw, 2.45rem);
    line-height: 1.1;
  }

  .locentra-app:not(:has(.home-landing)) .auth-card > p:not(.eyebrow) {
    color: #687b85;
    font-size: .85rem;
  }

  .locentra-app:not(:has(.home-landing)) .auth-card > .row-between {
    color: #536770;
    font-size: .8rem;
  }

  .locentra-app:not(:has(.home-landing)) .auth-card input[type="checkbox"] {
    accent-color: #1c5368;
  }

  .locentra-app:not(:has(.home-landing)) .auth-lnk {
    color: #1c5368;
  }

  .locentra-app:not(:has(.home-landing)) .footer {
    margin-top: 0;
    border-top-color: #e2e9e5;
    background: #f8faf8;
  }

  .locentra-app:not(:has(.home-landing)) .footer-inner {
    width: min(1160px, calc(100% - 48px));
    padding: 25px 0 32px;
    font-size: .81rem;
  }

  .locentra-app:not(:has(.home-landing)) .footer-inner strong {
    color: #173847;
  }

  .locentra-app:not(:has(.home-landing)) .footer-links {
    gap: 15px;
  }

  .locentra-app:not(:has(.home-landing)) .footer-links a {
    transition: color 150ms ease;
  }

  .locentra-app:not(:has(.home-landing)) .footer-links a:hover {
    color: #1c5368;
  }

  .about-intro {
    display: grid;
    grid-template-columns: 1.02fr .98fr;
    align-items: center;
    gap: clamp(36px, 7vw, 84px);
    min-height: 390px;
    padding: 28px 0 54px;
  }

  .about-intro-copy {
    max-width: 560px;
  }

  .about-intro-copy h1 {
    margin: 0;
    color: #132a39;
    font-size: clamp(2.5rem, 5vw, 4.2rem);
    font-weight: 740;
    letter-spacing: -.075em;
    line-height: 1.02;
  }

  .about-intro-copy > p:not(.eyebrow) {
    max-width: 515px;
    margin: 19px 0 0;
    color: #687b85;
    font-size: .97rem;
    line-height: 1.8;
  }

  .about-intro-actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 18px;
    margin-top: 25px;
  }

  .about-inline-link {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: #1c5368;
    font-size: .84rem;
    font-weight: 800;
  }

  .about-intro-visual {
    position: relative;
    min-height: 330px;
    display: grid;
    place-items: center;
    overflow: hidden;
    border: 1px solid #dfe8e1;
    border-radius: 19px;
    background:
      radial-gradient(circle at 75% 19%, rgba(233,189,98,.23), transparent 28%),
      linear-gradient(145deg,#e6eee8,#f4f1e7);
  }

  .about-visual-ring {
    position: absolute;
    border: 1px solid rgba(28,83,104,.12);
    border-radius: 50%;
  }

  .about-visual-ring.ring-one {
    width: 360px;
    height: 360px;
  }

  .about-visual-ring.ring-two {
    width: 265px;
    height: 265px;
  }

  .about-visual-building {
    position: relative;
    width: 57%;
    height: 180px;
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap: 9px;
    padding: 29px 20px 0;
    border: 1px solid rgba(255,255,255,.8);
    border-bottom: 0;
    background: linear-gradient(135deg,#e4e3d6,#a9beb3);
    box-shadow: 0 22px 40px rgba(19,42,57,.16);
    transform: skewY(-3deg);
  }

  .about-visual-building::before {
    content: 'LOCENTRA';
    position: absolute;
    top: 13px;
    left: 17px;
    color: #1c5368;
    font-size: .52rem;
    font-weight: 850;
    letter-spacing: .13em;
  }

  .about-visual-building i {
    height: 33px;
    border: 1px solid rgba(255,255,255,.55);
    background: linear-gradient(140deg,#80a8a5,#3b727a);
  }

  .about-visual-building i:nth-child(3n) {
    background: linear-gradient(140deg,#f0d795,#ad804b);
  }

  .about-visual-pin {
    position: absolute;
    top: 23%;
    right: 24%;
    width: 48px;
    height: 48px;
    display: grid;
    place-items: center;
    border: 4px solid white;
    border-radius: 50% 50% 50% 8px;
    background: #1c5368;
    box-shadow: 0 10px 24px rgba(19,42,57,.24);
    color: white;
    transform: rotate(-45deg);
  }

  .about-visual-pin svg {
    transform: rotate(45deg);
  }

  .about-visual-caption {
    position: absolute;
    right: 17px;
    bottom: 17px;
    left: 17px;
    color: #5f7477;
    font-size: .68rem;
    font-weight: 700;
    text-align: center;
  }

  .about-purpose {
    padding: 42px 0 10px;
    border-top: 1px solid #e3eae5;
  }

  .about-purpose-heading {
    max-width: 660px;
    margin-bottom: 28px;
  }

  .about-purpose-heading h2 {
    margin: 0;
    color: #132a39;
    font-size: clamp(1.8rem, 3.3vw, 2.7rem);
    font-weight: 740;
    letter-spacing: -.06em;
    line-height: 1.12;
  }

  .about-purpose-grid {
    display: grid;
    grid-template-columns: repeat(3,minmax(0,1fr));
    gap: 15px;
  }

  .about-purpose-card {
    min-height: 190px;
    padding: 21px;
    border: 1px solid #e2e9e5;
    border-radius: 15px;
    background: white;
    box-shadow: 0 9px 27px rgba(19,42,57,.045);
    transition: transform 180ms ease, box-shadow 180ms ease;
  }

  .about-purpose-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 34px rgba(19,42,57,.09);
  }

  .about-purpose-card > span {
    display: block;
    margin-bottom: 22px;
    color: #a78c57;
    font-size: .72rem;
    font-weight: 850;
    letter-spacing: .1em;
  }

  .about-purpose-card h3 {
    margin: 0 0 8px;
    color: #172f3e;
    font-size: 1rem;
    letter-spacing: -.03em;
  }

  .about-purpose-card p {
    margin: 0;
    color: #687b85;
    font-size: .82rem;
    line-height: 1.7;
  }

  @keyframes app-page-enter {
    from { opacity: 0; transform: translateY(7px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes app-card-enter {
    from { opacity: 0; transform: translateY(13px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 1000px) {
    .locentra-app:not(:has(.home-landing)) .dashboard-grid {
      grid-template-columns: minmax(0, 1fr);
      min-width: 0;
    }

    .locentra-app:not(:has(.home-landing)) .retailer-match-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .locentra-app:not(:has(.home-landing)) .dashboard-grid > *,
    .locentra-app:not(:has(.home-landing)) .sidebar,
    .locentra-app:not(:has(.home-landing)) .content-panel {
      min-width: 0;
    }

    .locentra-app:not(:has(.home-landing)) .sidebar {
      position: static;
      overflow: hidden;
    }

    .locentra-app:not(:has(.home-landing)) .side-nav {
      flex-direction: row;
      max-width: 100%;
      overflow-x: auto;
      padding: 2px 0 4px;
      scrollbar-width: thin;
    }

    .locentra-app:not(:has(.home-landing)) .side-link {
      flex: 0 0 auto;
      white-space: nowrap;
    }

    .locentra-app:not(:has(.home-landing)) .detail-layout {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 760px) {
    .locentra-app:not(:has(.home-landing)) .topbar-inner {
      width: min(100% - 28px, 560px);
      flex-wrap: wrap;
      gap: 9px;
      padding: 11px 0 8px;
    }

    .locentra-app:not(:has(.home-landing)) .main-nav {
      order: 3;
      width: 100%;
      justify-content: space-between;
      gap: 8px;
      padding: 7px 0 3px;
    }

    .locentra-app:not(:has(.home-landing)) .main-nav a {
      font-size: .75rem;
      white-space: nowrap;
    }

    .locentra-app:not(:has(.home-landing)) .nav-actions {
      display: flex;
      gap: 0;
      margin-left: auto;
    }

    .locentra-app:not(:has(.home-landing)) .nav-actions .btn-secondary {
      display: none;
    }

    .locentra-app:not(:has(.home-landing)) .nav-actions .btn-primary {
      width: auto;
      padding: 9px 13px;
      font-size: .77rem;
    }

    .locentra-app:not(:has(.home-landing)) .container,
    .locentra-app:not(:has(.home-landing)) .footer-inner {
      width: min(100% - 34px, 560px);
    }

    .locentra-app:not(:has(.home-landing)) .page {
      padding: 31px 0 52px;
    }

    .locentra-app:not(:has(.home-landing)) .page-header {
      align-items: flex-start;
      flex-direction: column;
      gap: 13px;
    }

    .locentra-app:not(:has(.home-landing)) .page-header h1 {
      font-size: clamp(1.9rem, 8vw, 2.55rem);
    }

    .locentra-app:not(:has(.home-landing)) .detail-layout {
      grid-template-columns: 1fr;
    }

    .locentra-app:not(:has(.home-landing)) .detail-gallery {
      min-height: 290px;
    }

    .locentra-app:not(:has(.home-landing)) .detail-card {
      position: static;
      padding: 21px;
    }

    .locentra-app:not(:has(.home-landing)) .detail-metrics {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 7px;
    }

    .locentra-app:not(:has(.home-landing)) .metric-box {
      padding: 12px 8px;
    }

    .locentra-app:not(:has(.home-landing)) .metric-box strong {
      font-size: .77rem;
    }

    .locentra-app:not(:has(.home-landing)) .content-panel {
      padding: 18px;
    }

    .locentra-app:not(:has(.home-landing)) .stats-row {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 9px;
    }

    .locentra-app:not(:has(.home-landing)) .stat-card {
      min-width: 0;
      padding: 15px 13px;
    }

    .locentra-app:not(:has(.home-landing)) .two-col {
      grid-template-columns: 1fr;
    }

    .locentra-app:not(:has(.home-landing)) .retailer-match-grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 12px;
    }

    .locentra-app:not(:has(.home-landing)) .retailer-requirements-section,
    .locentra-app:not(:has(.home-landing)) .retailer-matches-section {
      padding: 19px 16px;
    }

    .locentra-app:not(:has(.home-landing)) .list-row {
      grid-template-columns: minmax(0, 1fr) auto;
    }

    .locentra-app:not(:has(.home-landing)) .list-row > :last-child {
      grid-column: 2;
    }

    .locentra-app:not(:has(.home-landing)) .footer-inner {
      align-items: flex-start;
      flex-direction: column;
      gap: 13px;
    }

    .locentra-app:not(:has(.home-landing)) .footer-links {
      gap: 10px 15px;
    }

    .locentra-app:not(:has(.home-landing)) .auth-shell {
      min-height: calc(100vh - 178px);
      padding: 31px 14px;
    }

    .locentra-app:not(:has(.home-landing)) .auth-card {
      padding: 25px 21px;
    }

    .locentra-app:not(:has(.home-landing)) .detail-actions {
      flex-direction: column;
    }

    .locentra-app:not(:has(.home-landing)) .detail-actions .btn {
      width: 100%;
    }

    .locentra-app:not(:has(.home-landing)) .form-panel .row-between {
      align-items: stretch !important;
    }

    .locentra-app:not(:has(.home-landing)) .form-panel .row-between .btn {
      width: auto;
    }

    .about-intro {
      grid-template-columns: 1fr;
      min-height: 0;
      gap: 27px;
      padding: 9px 0 42px;
    }

    .about-intro-copy h1 {
      font-size: clamp(2.4rem, 9vw, 3.3rem);
    }

    .about-intro-visual {
      min-height: 285px;
    }

    .about-purpose {
      padding-top: 31px;
    }

    .about-purpose-grid {
      grid-template-columns: 1fr;
    }

    .about-purpose-card {
      min-height: 0;
    }

    .about-purpose-card > span {
      margin-bottom: 14px;
    }
  }

  @media (max-width: 420px) {
    .locentra-app:not(:has(.home-landing)) .container,
    .locentra-app:not(:has(.home-landing)) .footer-inner {
      width: calc(100% - 28px);
    }

    .locentra-app:not(:has(.home-landing)) .brand {
      gap: 8px;
    }

    .locentra-app:not(:has(.home-landing)) .brand-mark {
      width: 35px;
      height: 35px;
    }

    .locentra-app:not(:has(.home-landing)) .brand-name strong {
      font-size: .95rem;
    }

    .locentra-app:not(:has(.home-landing)) .main-nav a {
      font-size: .68rem;
    }

    .locentra-app:not(:has(.home-landing)) .property-grid {
      grid-template-columns: 1fr;
    }

    .locentra-app:not(:has(.home-landing)) .property-visual {
      height: 175px;
    }

    .locentra-app:not(:has(.home-landing)) .property-head {
      flex-wrap: wrap;
    }

    .locentra-app:not(:has(.home-landing)) .property-head h3 {
      font-size: 1rem;
    }

    .locentra-app:not(:has(.home-landing)) .property-meta {
      gap: 6px;
    }

    .locentra-app:not(:has(.home-landing)) .property-meta span {
      font-size: .68rem;
    }

    .locentra-app:not(:has(.home-landing)) .filter-bar {
      gap: 7px;
    }

    .locentra-app:not(:has(.home-landing)) .chip {
      padding: 8px 11px;
      font-size: .8rem;
    }

    .locentra-app:not(:has(.home-landing)) .stats-row {
      grid-template-columns: 1fr 1fr;
    }

    .locentra-app:not(:has(.home-landing)) .list-row {
      gap: 7px;
    }

    .locentra-app:not(:has(.home-landing)) .form-panel .row-between {
      flex-direction: column;
    }

    .locentra-app:not(:has(.home-landing)) .form-panel .row-between .btn {
      width: 100%;
    }

    .locentra-app:not(:has(.home-landing)) .detail-metrics {
      grid-template-columns: 1fr;
    }
  }

    .how-it-works-page {
      overflow: clip;
      background: #fff;
    }

    .how-hero {
      position: relative;
      overflow: hidden;
      background:
        radial-gradient(ellipse at 75% 42%, rgba(66, 130, 139, .2), transparent 38%),
        linear-gradient(112deg, #102c3b, #1c5368);
      color: white;
    }

    .how-hero::before {
      content: '';
      position: absolute;
      inset: 0;
      opacity: .1;
      background-image: linear-gradient(rgba(255,255,255,.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.15) 1px,transparent 1px);
      background-size: 52px 52px;
      mask-image: linear-gradient(90deg,transparent,#000);
      pointer-events: none;
    }

    .how-hero-glow {
      position: absolute;
      top: -270px;
      right: 9%;
      width: 520px;
      height: 520px;
      border-radius: 50%;
      background: radial-gradient(circle,rgba(233,189,98,.2),transparent 68%);
      animation: how-glow-drift 12s ease-in-out infinite alternate;
    }

    .how-hero-layout {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      gap: clamp(35px, 6vw, 75px);
      min-height: 510px;
      padding-top: 42px;
      padding-bottom: 42px;
    }

    .how-hero-copy {
      max-width: 560px;
      animation: auth-content-enter 650ms cubic-bezier(.2,.7,.25,1) both;
    }

    .how-hero-copy .eyebrow {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #f1d48f;
      letter-spacing: .12em;
    }

    .how-eyebrow-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #e9bd62;
      box-shadow: 0 0 0 5px rgba(233,189,98,.15);
    }

    .how-hero-copy h1 {
      margin: 0;
      color: #fff;
      font-size: clamp(2.8rem, 5.4vw, 4.7rem);
      font-weight: 740;
      letter-spacing: -.075em;
      line-height: 1.01;
    }

    .how-hero-copy > p:not(.eyebrow) {
      max-width: 510px;
      margin: 19px 0 0;
      color: rgba(242,247,246,.77);
      font-size: .98rem;
      line-height: 1.8;
    }

    .how-cta-button,
    .how-cta-outline {
      min-height: 49px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      border: 1px solid transparent;
      border-radius: 10px;
      padding: 0 19px;
      font-size: .85rem;
      font-weight: 800;
      transition: transform 180ms ease, background 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
    }

    .how-cta-button {
      margin-top: 24px;
      background: #e9bd62;
      color: #203747;
      box-shadow: 0 10px 25px rgba(5,24,32,.2);
    }

    .how-cta-button:hover {
      transform: translateY(-2px);
      background: #f3d17f;
      box-shadow: 0 14px 29px rgba(5,24,32,.26);
    }

    .how-hero-footnote {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 31px;
      color: rgba(242,247,246,.58);
      font-size: .68rem;
    }

    .how-hero-footnote span:first-child {
      color: #f1d48f;
      font-weight: 850;
      letter-spacing: .1em;
    }

    .how-hero-art {
      position: relative;
      min-height: 367px;
      display: grid;
      place-items: center;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,.15);
      border-radius: 21px;
      background: linear-gradient(140deg,rgba(255,255,255,.1),rgba(255,255,255,.025));
      box-shadow: 0 25px 60px rgba(4,22,30,.2),inset 0 1px rgba(255,255,255,.08);
      animation: auth-content-enter 800ms 90ms cubic-bezier(.2,.7,.25,1) both;
      isolation: isolate;
    }

    .how-art-grid {
      position: absolute;
      z-index: -1;
      inset: 0;
      opacity: .22;
      background-image: linear-gradient(rgba(255,255,255,.2) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.2) 1px,transparent 1px);
      background-size: 31px 31px;
      mask-image: radial-gradient(ellipse,#000,transparent 74%);
      animation: how-grid-drift 16s linear infinite;
    }

    .how-art-orbit {
      position: absolute;
      border: 1px solid rgba(233,189,98,.23);
      border-radius: 50%;
    }

    .how-art-orbit-one { width: 330px; height: 330px; animation: how-orbit-breathe 7s ease-in-out infinite; }
    .how-art-orbit-two { width: 245px; height: 245px; border-color: rgba(255,255,255,.17); animation: how-orbit-breathe 7s 1s ease-in-out infinite reverse; }

    .how-art-building {
      position: relative;
      z-index: 1;
      width: min(57%, 238px);
      height: 180px;
      padding: 29px 15px 0;
      border: 1px solid rgba(255,255,255,.58);
      border-bottom: 0;
      background: linear-gradient(135deg,#e6e4d7,#acbfb3);
      box-shadow: 0 24px 44px rgba(4,22,30,.27);
      animation: how-building-float 6.5s ease-in-out infinite;
      transform: skewY(-3deg);
    }

    .how-art-building-sign {
      position: absolute;
      top: 12px;
      left: 14px;
      color: #1c5368;
      font-size: .48rem;
      font-weight: 850;
      letter-spacing: .14em;
    }

    .how-art-windows {
      display: grid;
      grid-template-columns: repeat(4,1fr);
      gap: 7px;
    }

    .how-art-windows i {
      height: 33px;
      border: 1px solid rgba(255,255,255,.45);
      background: linear-gradient(135deg,#83a9a3,#3b7279);
    }

    .how-art-windows i:nth-child(3n) { background: linear-gradient(135deg,#efd794,#aa804d); }

    .how-art-door {
      position: absolute;
      bottom: 0;
      left: 43%;
      width: 34px;
      height: 40px;
      border: 2px solid rgba(22,66,78,.28);
      border-bottom: 0;
      background: #4d7e83;
    }

    .how-art-pin {
      position: absolute;
      z-index: 2;
      top: 21%;
      right: 26%;
      width: 45px;
      height: 45px;
      display: grid;
      place-items: center;
      border: 4px solid white;
      border-radius: 50% 50% 50% 8px;
      background: #1c5368;
      box-shadow: 0 9px 24px rgba(3,20,27,.28);
      color: white;
      animation: how-pin-float 5s ease-in-out infinite;
      transform: rotate(-45deg);
    }

    .how-art-pin svg { transform: rotate(45deg); }

    .how-art-float {
      position: absolute;
      z-index: 3;
      display: grid;
      grid-template-columns: 31px 1fr;
      align-items: center;
      column-gap: 8px;
      min-width: 174px;
      padding: 10px 11px;
      border: 1px solid rgba(255,255,255,.65);
      border-radius: 10px;
      background: rgba(255,255,255,.97);
      box-shadow: 0 13px 30px rgba(4,22,30,.2);
      animation: how-float-card 6s ease-in-out infinite;
    }

    .how-art-float > span:first-child {
      grid-row: span 2;
      width: 31px;
      height: 31px;
      display: grid;
      place-items: center;
      border-radius: 9px;
      background: #eaf1ed;
      color: #1c5368;
    }

    .how-art-float small { color: #81908f; font-size: .45rem; font-weight: 850; letter-spacing: .08em; }
    .how-art-float strong { color: #183441; font-size: .64rem; }
    .how-art-float-search { top: 63px; left: 12px; }
    .how-art-float-match { right: 11px; bottom: 46px; animation-delay: 1.1s; }
    .how-art-float .how-art-match-check { background: #edf4ee; color: #4f8561; font-weight: 850; }
    .how-art-caption { position: absolute; bottom: 16px; left: 19px; color: rgba(255,255,255,.57); font-size: .6rem; }

    .how-timeline-section {
      padding: 87px 0 91px;
      background:
        radial-gradient(ellipse at 48% 30%,rgba(28,83,104,.035),transparent 42%),
        #fff;
    }

    .how-section-heading {
      max-width: 650px;
      margin: 0 auto 56px;
      text-align: center;
    }

    .how-section-heading .eyebrow { justify-content: center; }

    .how-section-heading h2 {
      margin: 0;
      color: #132a39;
      font-size: clamp(2rem,4vw,3.1rem);
      font-weight: 740;
      letter-spacing: -.065em;
      line-height: 1.08;
    }

    .how-section-heading > p:last-child {
      max-width: 560px;
      margin: 13px auto 0;
      color: #687b85;
      font-size: .92rem;
      line-height: 1.75;
    }

    .how-timeline {
      position: relative;
      display: grid;
      gap: 23px;
      max-width: 940px;
      margin: 0 auto;
    }

    .how-timeline::before {
      content: '';
      position: absolute;
      top: 28px;
      bottom: 28px;
      left: 50%;
      width: 2px;
      background: #e1e9e4;
      transform: translateX(-50%);
    }

    .how-timeline::after {
      content: '';
      position: absolute;
      top: 28px;
      left: 50%;
      width: 2px;
      height: 0;
      background: linear-gradient(180deg,#e9bd62,#1c5368);
      transform: translateX(-50%);
      animation: how-timeline-progress 2.1s .25s cubic-bezier(.2,.7,.25,1) forwards;
      pointer-events: none;
    }

    .how-timeline-item {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: minmax(0,1fr) 82px minmax(0,1fr);
      align-items: center;
      min-height: 153px;
    }

    .how-timeline-node {
      grid-column: 2;
      grid-row: 1;
      justify-self: center;
      width: 66px;
      height: 66px;
      display: grid;
      place-items: center;
      border: 1px solid #dce7e0;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 7px 20px rgba(19,42,57,.08);
    }

    .how-timeline-node i {
      position: absolute;
      width: 44px;
      height: 44px;
      display: grid;
      place-items: center;
      border: 1px solid #dce8df;
      border-radius: 50%;
      background: #edf3ef;
      color: #1c5368;
      font-style: normal;
    }

    .how-timeline-node > span {
      position: absolute;
      z-index: 2;
      top: -4px;
      right: -4px;
      width: 23px;
      height: 23px;
      display: grid;
      place-items: center;
      border: 2px solid white;
      border-radius: 50%;
      background: #1c5368;
      color: white;
      font-size: .51rem;
      font-weight: 850;
    }

    .how-step-card {
      position: relative;
      grid-row: 1;
      padding: 20px 22px;
      border: 1px solid #e2e9e5;
      border-radius: 15px;
      background: linear-gradient(145deg,#fff,#fbfcfb);
      box-shadow: 0 10px 29px rgba(19,42,57,.05);
      transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
    }

    .how-step-card:hover {
      transform: translateY(-3px);
      border-color: #cddcd2;
      box-shadow: 0 17px 35px rgba(19,42,57,.095);
    }

    .timeline-right .how-step-card { grid-column: 3; }
    .timeline-left .how-step-card { grid-column: 1; }

    .how-step-card-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      color: #9a8a63;
      font-size: .6rem;
      font-weight: 850;
      letter-spacing: .1em;
    }

    .how-step-icon {
      display: none;
      color: #1c5368;
    }

    .how-step-card h3 {
      margin: 0 0 8px;
      color: #17313e;
      font-size: 1.05rem;
      letter-spacing: -.035em;
    }

    .how-step-card > p {
      margin: 0;
      color: #687b85;
      font-size: .82rem;
      line-height: 1.7;
    }

    .how-step-progress {
      height: 3px;
      overflow: hidden;
      margin-top: 17px;
      border-radius: 99px;
      background: #edf1ee;
    }

    .how-step-progress span {
      height: 100%;
      display: block;
      border-radius: inherit;
      background: linear-gradient(90deg,#1c5368,#e9bd62);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 850ms cubic-bezier(.2,.7,.25,1);
    }

    .how-timeline-item.is-visible .how-step-progress span { transform: scaleX(1); }

    .how-journey-note {
      padding: 0 0 83px;
      background: #fff;
    }

    .how-journey-inner {
      display: grid;
      grid-template-columns: 56px 1fr auto;
      align-items: center;
      gap: 21px;
      padding: 27px 30px;
      border: 1px solid #e0e8e2;
      border-radius: 16px;
      background: linear-gradient(110deg,#f3f7f3,#fbfaf5);
    }

    .how-journey-icon {
      width: 52px;
      height: 52px;
      display: grid;
      place-items: center;
      border: 1px solid #dfebe2;
      border-radius: 14px;
      background: white;
      color: #1c5368;
    }

    .how-journey-inner .eyebrow { margin-bottom: 7px; }

    .how-journey-inner h2 {
      margin: 0;
      color: #17313e;
      font-size: 1.35rem;
      letter-spacing: -.045em;
    }

    .how-journey-inner > div > p:last-child {
      margin: 7px 0 0;
      color: #687b85;
      font-size: .81rem;
      line-height: 1.6;
    }

    .how-inline-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: #1c5368;
      font-size: .81rem;
      font-weight: 800;
      white-space: nowrap;
    }

    .how-final-cta {
      position: relative;
      overflow: hidden;
      padding: 58px 0;
      background: linear-gradient(115deg,#153949,#1c5368);
    }

    .how-final-cta::after {
      content: '';
      position: absolute;
      top: -290px;
      right: -70px;
      width: 550px;
      height: 550px;
      border: 1px solid rgba(255,255,255,.13);
      border-radius: 50%;
      box-shadow: 0 0 0 42px rgba(255,255,255,.025),0 0 0 92px rgba(255,255,255,.02);
    }

    .how-final-inner {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 30px;
    }

    .how-final-inner .eyebrow { color: #f1d48f; }
    .how-final-inner h2 { max-width: 650px; margin: 0; color: #fff; font-size: clamp(2rem,4vw,3.1rem); font-weight: 740; letter-spacing: -.065em; line-height: 1.08; }
    .how-final-inner > div:first-child > p:last-child { margin: 10px 0 0; color: rgba(255,255,255,.73); font-size: .88rem; }
    .how-final-actions { display: flex; flex: 0 0 auto; flex-wrap: wrap; gap: 10px; }
    .how-final-actions .how-cta-button { margin: 0; }

    .how-cta-outline {
      border-color: rgba(255,255,255,.34);
      background: rgba(255,255,255,.035);
      color: #fff;
    }

    .how-cta-outline:hover {
      transform: translateY(-2px);
      border-color: rgba(255,255,255,.55);
      background: rgba(255,255,255,.12);
    }

    .how-it-works-page.reveal-ready .how-reveal {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 600ms ease, transform 600ms cubic-bezier(.2,.7,.25,1);
      transition-delay: var(--reveal-delay,0ms);
    }

    .how-it-works-page.reveal-ready .how-reveal.is-visible {
      opacity: 1;
      transform: translateY(0);
    }

    .login-page {
      --auth-ink: #132a39;
      --auth-muted: #687b85;
      --auth-brand: #1c5368;
      --auth-brand-dark: #123847;
      --auth-line: #e1e9e4;
      min-height: calc(100vh - 150px);
      display: grid;
      grid-template-columns: minmax(0,1.02fr) minmax(470px,.98fr);
      background: #f7f9f7;
    }

    .login-showcase {
      position: relative;
      min-height: 690px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
      padding: 34px clamp(35px,6vw,84px) 22px max(30px,calc((100vw - 1160px)/2));
      background:
        radial-gradient(ellipse at 76% 45%,rgba(64,128,139,.19),transparent 39%),
        linear-gradient(130deg,#102c3b,#1c5368);
      color: white;
      isolation: isolate;
    }

    .login-showcase-grid {
      position: absolute;
      z-index: -1;
      inset: 0;
      opacity: .15;
      background-image: linear-gradient(rgba(255,255,255,.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.15) 1px,transparent 1px);
      background-size: 45px 45px;
      mask-image: linear-gradient(120deg,transparent,#000 75%);
      animation: how-grid-drift 18s linear infinite;
    }

    .login-showcase-glow {
      position: absolute;
      z-index: -1;
      top: -240px;
      right: -180px;
      width: 560px;
      height: 560px;
      border-radius: 50%;
      background: radial-gradient(circle,rgba(233,189,98,.2),transparent 67%);
      animation: how-glow-drift 13s ease-in-out infinite alternate;
    }

    .login-brand,
    .register-brand {
      position: relative;
      z-index: 1;
      width: fit-content;
      display: grid;
      grid-template-columns: 39px auto;
      align-items: center;
      column-gap: 10px;
      color: white;
    }

    .login-brand > span,
    .register-brand > span {
      grid-row: span 2;
      width: 39px;
      height: 39px;
      display: grid;
      place-items: center;
      border: 1px solid rgba(255,255,255,.35);
      border-radius: 11px;
      background: rgba(255,255,255,.12);
      color: #f1d48f;
      font-size: 1.1rem;
      font-weight: 850;
    }

    .login-brand strong,
    .register-brand strong {
      align-self: end;
      font-size: 1.05rem;
      letter-spacing: -.03em;
    }

    .login-brand small,
    .register-brand small {
      align-self: start;
      margin-top: 3px;
      color: rgba(255,255,255,.66);
      font-size: .49rem;
      letter-spacing: .14em;
    }

    .login-showcase-content {
      position: relative;
      z-index: 1;
      width: min(100%,590px);
      margin: 43px 0 23px;
      animation: auth-content-enter 650ms cubic-bezier(.2,.7,.25,1) both;
    }

    .login-showcase-kicker {
      display: flex;
      align-items: center;
      gap: 9px;
      margin: 0 0 17px;
      color: #f1d48f;
      font-size: .62rem;
      font-weight: 850;
      letter-spacing: .12em;
    }

    .login-showcase-kicker i {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #e9bd62;
      box-shadow: 0 0 0 4px rgba(233,189,98,.14);
    }

    .login-showcase-content h1 {
      margin: 0;
      color: white;
      font-size: clamp(2.5rem,4.2vw,4rem);
      font-weight: 740;
      letter-spacing: -.075em;
      line-height: 1.02;
    }

    .login-showcase-content h1 em {
      color: #e9bd62;
      font-style: normal;
    }

    .login-showcase-description {
      max-width: 460px;
      margin: 16px 0 0;
      color: rgba(242,247,246,.74);
      font-size: .88rem;
      line-height: 1.75;
    }

    .login-showcase-visual {
      position: relative;
      height: 245px;
      margin-top: 21px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,.13);
      border-radius: 15px;
      background: linear-gradient(140deg,rgba(255,255,255,.085),rgba(255,255,255,.018));
      isolation: isolate;
    }

    .login-map-lines {
      position: absolute;
      z-index: -1;
      inset: -40%;
      opacity: .31;
      background-image:
        linear-gradient(29deg,transparent 48%,rgba(255,255,255,.19) 48.3%,rgba(255,255,255,.19) 48.7%,transparent 49%),
        linear-gradient(110deg,transparent 43%,rgba(233,189,98,.27) 43.4%,rgba(233,189,98,.27) 43.8%,transparent 44%),
        linear-gradient(rgba(255,255,255,.1) 1px,transparent 1px),
        linear-gradient(90deg,rgba(255,255,255,.1) 1px,transparent 1px);
      background-size: 100% 100%,100% 100%,34px 34px,34px 34px;
      animation: how-grid-drift 18s linear infinite;
    }

    .login-showcase-building {
      position: absolute;
      left: 22%;
      bottom: 36px;
      width: 48%;
      height: 137px;
      padding: 24px 13px 0;
      border: 1px solid rgba(255,255,255,.54);
      border-bottom: 0;
      background: linear-gradient(130deg,#e3e1d4,#9eb4aa);
      box-shadow: 0 19px 35px rgba(3,18,24,.23);
      animation: how-building-float 7s ease-in-out infinite;
      transform: skewY(-3deg);
    }

    .login-showcase-building > span {
      position: absolute;
      top: 9px;
      left: 11px;
      color: #1c5368;
      font-size: .42rem;
      font-weight: 850;
      letter-spacing: .12em;
    }

    .login-showcase-building > div {
      display: grid;
      grid-template-columns: repeat(4,1fr);
      gap: 6px;
    }

    .login-showcase-building i {
      height: 27px;
      border: 1px solid rgba(255,255,255,.42);
      background: linear-gradient(140deg,#80a5a0,#3e7078);
    }

    .login-showcase-building i:nth-child(3n) { background: linear-gradient(140deg,#eed48e,#a77c49); }

    .login-map-marker {
      position: absolute;
      z-index: 2;
      top: 28px;
      right: 27%;
      width: 40px;
      height: 40px;
      display: grid;
      place-items: center;
      border: 4px solid white;
      border-radius: 50% 50% 50% 8px;
      background: #1c5368;
      color: white;
      box-shadow: 0 9px 21px rgba(3,18,24,.25);
      animation: how-pin-float 5s ease-in-out infinite;
      transform: rotate(-45deg);
    }

    .login-map-marker svg { transform: rotate(45deg); }

    .login-float-card {
      position: absolute;
      z-index: 3;
      min-width: 147px;
      display: grid;
      grid-template-columns: 28px 1fr;
      align-items: center;
      column-gap: 7px;
      padding: 8px 9px;
      border: 1px solid rgba(255,255,255,.7);
      border-radius: 9px;
      background: rgba(255,255,255,.97);
      box-shadow: 0 11px 25px rgba(3,18,24,.2);
      animation: how-float-card 6.2s ease-in-out infinite;
    }

    .login-float-card > span:first-child {
      grid-row: span 2;
      width: 28px;
      height: 28px;
      display: grid;
      place-items: center;
      border-radius: 8px;
      background: #eaf1ed;
      color: #1c5368;
    }

    .login-float-card small { color: #81908f; font-size: .43rem; font-weight: 850; letter-spacing: .07em; }
    .login-float-card strong { color: #17313e; font-size: .58rem; }
    .login-float-card-one { top: 31px; left: 14px; }
    .login-float-card-two { right: 12px; bottom: 13px; animation-delay: 1.1s; }
    .login-float-check { background: #edf4ee !important; color: #4d8060 !important; font-weight: 850; }

    .login-showcase-footer {
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding-top: 14px;
      border-top: 1px solid rgba(255,255,255,.16);
      color: rgba(255,255,255,.53);
      font-size: .52rem;
      font-weight: 750;
      letter-spacing: .1em;
    }

    .login-form-side {
      position: relative;
      min-width: 0;
      display: grid;
      place-items: center;
      overflow: hidden;
      padding: 40px clamp(27px,5vw,72px);
      background:
        radial-gradient(ellipse at 87% 10%,rgba(28,83,104,.055),transparent 28%),
        #f7f9f7;
      isolation: isolate;
    }

    .login-form-decoration {
      position: absolute;
      z-index: -1;
      border: 1px solid rgba(28,83,104,.09);
      border-radius: 50%;
    }

    .login-form-decoration-one { top: -120px; right: -225px; width: 430px; height: 430px; }
    .login-form-decoration-two { bottom: -240px; left: -200px; width: 430px; height: 430px; border-color: rgba(233,189,98,.15); }

    .login-form-wrap {
      width: min(100%,430px);
      animation: auth-content-enter 560ms 100ms cubic-bezier(.2,.7,.25,1) both;
    }

    .login-form-heading {
      margin-bottom: 22px;
    }

    .login-form-icon {
      width: 44px;
      height: 44px;
      display: grid;
      place-items: center;
      margin-bottom: 21px;
      border: 1px solid #dfe8e2;
      border-radius: 13px;
      background: #edf3ef;
      color: #1c5368;
    }

    .login-form-heading .eyebrow { margin-bottom: 8px; }

    .login-form-heading h2 {
      margin: 0;
      color: #132a39;
      font-size: clamp(1.8rem,3vw,2.35rem);
      font-weight: 740;
      letter-spacing: -.065em;
      line-height: 1.1;
    }

    .login-form-heading > p:last-child {
      margin: 9px 0 0;
      color: #687b85;
      font-size: .86rem;
    }

    .login-auth-card,
    .register-auth-card {
      width: 100%;
      border: 1px solid rgba(221,231,225,.92);
      border-radius: 17px;
      background: rgba(255,255,255,.86);
      box-shadow: 0 18px 48px rgba(19,42,57,.09),inset 0 1px rgba(255,255,255,.9);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
    }

    .login-auth-card {
      padding: 23px;
    }

    .auth-feedback {
      margin: 0 0 15px;
      padding: 10px 12px;
      border: 1px solid;
      border-radius: 8px;
      font-size: .78rem;
      line-height: 1.45;
    }

    .auth-feedback-error {
      border-color: #efc7c2;
      background: #fff5f3;
      color: #8b3027;
    }

    .auth-feedback-success {
      border-color: #c8dfd0;
      background: #f1f8f3;
      color: #2d6944;
    }

    .login-submit:disabled,
    .register-submit:disabled {
      cursor: wait;
      opacity: .75;
      transform: none;
      box-shadow: none;
    }

    .login-auth-card .field,
    .register-auth-card .field {
      gap: 7px;
      margin-bottom: 16px;
    }

    .login-auth-card .field label,
    .register-auth-card .field label {
      color: #29434f;
      font-size: .78rem;
      font-weight: 750;
    }

    .login-auth-card .field input,
    .register-auth-card .field input {
      min-height: 46px;
      border: 1px solid #dfe7e2;
      border-radius: 9px;
      background: rgba(252,253,252,.94);
      color: #17313e;
      font-size: .86rem;
      transition: border-color 160ms ease,box-shadow 160ms ease,background 160ms ease;
    }

    .login-auth-card .field input:focus,
    .register-auth-card .field input:focus {
      border-color: rgba(28,83,104,.58);
      background: #fff;
      box-shadow: 0 0 0 4px rgba(28,83,104,.09);
    }

    .login-auth-card .field input::placeholder,
    .register-auth-card .field input::placeholder {
      color: #9aa7a6;
    }

    .auth-password-wrap {
      position: relative;
    }

    .auth-password-wrap input {
      padding-right: 66px !important;
    }

    .auth-password-toggle {
      position: absolute;
      top: 50%;
      right: 12px;
      border: 0;
      padding: 5px;
      background: transparent;
      color: #1c5368;
      cursor: pointer;
      font-size: .7rem;
      font-weight: 800;
      transform: translateY(-50%);
    }

    .auth-password-toggle:focus-visible {
      outline: 2px solid #1c5368;
      outline-offset: 2px;
      border-radius: 4px;
    }

    .login-form-options {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin: 3px 0 18px;
      color: #546971;
      font-size: .73rem;
    }

    .login-form-options label {
      display: inline-flex;
      align-items: center;
      gap: 7px;
    }

    .login-form-options input { accent-color: #1c5368; }
    .login-form-options .auth-lnk { font-size: .72rem; }

    .login-submit,
    .register-submit {
      min-height: 47px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 9px;
      border-radius: 9px;
      transition: transform 180ms ease,box-shadow 180ms ease,background 180ms ease;
    }

    .login-submit:hover,
    .register-submit:hover {
      transform: translateY(-2px);
      box-shadow: 0 14px 26px rgba(28,83,104,.24);
    }

    .login-register-prompt,
    .register-login-prompt {
      margin: 18px 0 0 !important;
      color: #687b85;
      font-size: .77rem;
      text-align: center;
    }

    .login-security-note {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      margin: 18px 0 0;
      color: #71827f;
      font-size: .68rem;
    }

    .login-security-note svg { color: #568568; }

    .register-page {
      --register-ink: #132a39;
      --register-muted: #687b85;
      --register-brand: #1c5368;
      --register-line: #e1e9e4;
      position: relative;
      min-height: calc(100vh - 150px);
      overflow: hidden;
      padding: 46px 24px 62px;
      background:
        radial-gradient(ellipse at 10% 15%,rgba(28,83,104,.075),transparent 28%),
        radial-gradient(ellipse at 92% 85%,rgba(233,189,98,.12),transparent 26%),
        #f5f8f5;
      isolation: isolate;
    }

    .register-background-orb {
      position: absolute;
      z-index: -1;
      border: 1px solid rgba(28,83,104,.08);
      border-radius: 50%;
      animation: how-orbit-breathe 11s ease-in-out infinite;
    }

    .register-orb-one { top: 150px; right: -190px; width: 430px; height: 430px; }
    .register-orb-two { bottom: -260px; left: -160px; width: 440px; height: 440px; border-color: rgba(233,189,98,.17); animation-delay: -3s; }

    .register-shell {
      width: min(1120px,100%);
      margin: 0 auto;
    }

    .register-heading {
      position: relative;
      display: grid;
      justify-items: center;
      margin-bottom: 30px;
      text-align: center;
      animation: auth-content-enter 570ms cubic-bezier(.2,.7,.25,1) both;
    }

    .register-brand {
      margin-bottom: 22px;
      color: #173847;
    }

    .register-brand > span {
      border-color: rgba(28,83,104,.15);
      background: linear-gradient(140deg,#1c5368,#347c88);
      color: #f1d48f;
      box-shadow: 0 8px 19px rgba(28,83,104,.16);
    }

    .register-brand small { color: #75858a; }
    .register-heading > .eyebrow { justify-content: center; margin-bottom: 9px; }

    .register-heading h1 {
      margin: 0;
      color: #132a39;
      font-size: clamp(2.15rem,4vw,3.25rem);
      font-weight: 740;
      letter-spacing: -.07em;
      line-height: 1.05;
    }

    .register-heading > p:last-child {
      max-width: 565px;
      margin: 11px 0 0;
      color: #687b85;
      font-size: .9rem;
      line-height: 1.7;
    }

    .register-layout {
      display: grid;
      grid-template-columns: minmax(280px,.74fr) minmax(0,1.26fr);
      align-items: stretch;
      gap: 17px;
    }

    .register-aside {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 590px;
      overflow: hidden;
      padding: 17px;
      border: 1px solid rgba(255,255,255,.2);
      border-radius: 17px;
      background: linear-gradient(145deg,#123543,#1c5368);
      box-shadow: 0 17px 42px rgba(19,42,57,.13);
      color: white;
      animation: auth-content-enter 620ms 40ms cubic-bezier(.2,.7,.25,1) both;
    }

    .register-aside-art {
      position: relative;
      min-height: 260px;
      display: grid;
      place-items: center;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 12px;
      background: linear-gradient(140deg,rgba(255,255,255,.1),rgba(255,255,255,.02));
      isolation: isolate;
    }

    .register-aside-grid {
      position: absolute;
      z-index: -1;
      inset: -20%;
      opacity: .32;
      background-image: linear-gradient(rgba(255,255,255,.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.15) 1px,transparent 1px);
      background-size: 29px 29px;
      mask-image: radial-gradient(ellipse,#000,transparent 72%);
      animation: how-grid-drift 17s linear infinite;
    }

    .register-aside-ring {
      position: absolute;
      border: 1px solid rgba(233,189,98,.23);
      border-radius: 50%;
    }

    .register-aside-ring.ring-a { width: 255px; height: 255px; }
    .register-aside-ring.ring-b { width: 184px; height: 184px; border-color: rgba(255,255,255,.16); }

    .register-aside-building {
      position: relative;
      width: 54%;
      height: 122px;
      display: grid;
      grid-template-columns: repeat(3,1fr);
      gap: 6px;
      padding: 25px 10px 0;
      border: 1px solid rgba(255,255,255,.5);
      border-bottom: 0;
      background: linear-gradient(135deg,#e5e2d3,#9fb5aa);
      box-shadow: 0 17px 30px rgba(4,22,30,.25);
      animation: how-building-float 6.5s ease-in-out infinite;
      transform: skewY(-3deg);
    }

    .register-aside-building::before {
      content: 'LOCENTRA';
      position: absolute;
      top: 9px;
      left: 10px;
      color: #1c5368;
      font-size: .39rem;
      font-weight: 850;
      letter-spacing: .12em;
    }

    .register-aside-building i {
      height: 25px;
      border: 1px solid rgba(255,255,255,.4);
      background: linear-gradient(140deg,#81a6a0,#3c727a);
    }

    .register-aside-building i:nth-child(3n) { background: linear-gradient(140deg,#efd591,#aa7f49); }

    .register-aside-pin {
      position: absolute;
      top: 16%;
      right: 23%;
      width: 37px;
      height: 37px;
      display: grid;
      place-items: center;
      border: 3px solid white;
      border-radius: 50% 50% 50% 7px;
      background: #1c5368;
      color: white;
      box-shadow: 0 7px 18px rgba(3,18,24,.25);
      animation: how-pin-float 5s ease-in-out infinite;
      transform: rotate(-45deg);
    }

    .register-aside-pin svg { transform: rotate(45deg); }

    .register-aside-float {
      position: absolute;
      right: 7px;
      bottom: 13px;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border: 1px solid rgba(255,255,255,.67);
      border-radius: 9px;
      background: white;
      color: #1c5368;
      box-shadow: 0 9px 23px rgba(3,18,24,.2);
      animation: how-float-card 6s ease-in-out infinite;
    }

    .register-aside-float small,
    .register-aside-float strong { display: block; }
    .register-aside-float small { color: #83908c; font-size: .43rem; font-weight: 850; letter-spacing: .07em; }
    .register-aside-float strong { margin-top: 3px; color: #17313e; font-size: .6rem; }

    .register-aside-copy {
      padding: 22px 5px 18px;
    }

    .register-aside-copy .eyebrow {
      color: #f1d48f;
      font-size: .6rem;
    }

    .register-aside-copy h2 {
      max-width: 330px;
      margin: 0;
      color: white;
      font-size: clamp(1.55rem,2.5vw,2rem);
      font-weight: 740;
      letter-spacing: -.06em;
      line-height: 1.08;
    }

    .register-aside-copy > p:last-child {
      max-width: 340px;
      margin: 11px 0 0;
      color: rgba(242,247,246,.7);
      font-size: .78rem;
      line-height: 1.7;
    }

    .register-aside-step {
      display: flex;
      align-items: center;
      gap: 9px;
      padding-top: 12px;
      border-top: 1px solid rgba(255,255,255,.16);
      color: rgba(255,255,255,.65);
      font-size: .63rem;
    }

    .register-aside-step > span:first-child {
      color: #f1d48f;
      font-weight: 850;
      letter-spacing: .1em;
    }

    .register-aside-step i {
      width: 6px;
      height: 6px;
      margin-left: auto;
      border-radius: 50%;
      background: #e9bd62;
      box-shadow: 0 0 0 4px rgba(233,189,98,.15);
    }

    .register-auth-card {
      padding: 27px clamp(22px,3vw,36px) 23px;
      animation: auth-content-enter 640ms 90ms cubic-bezier(.2,.7,.25,1) both;
    }

    .register-card-heading {
      margin-bottom: 17px;
    }

    .register-card-heading .eyebrow { margin-bottom: 6px; }

    .register-card-heading h2 {
      margin: 0;
      color: #132a39;
      font-size: 1.42rem;
      font-weight: 740;
      letter-spacing: -.05em;
    }

    .register-card-heading > p:last-child {
      margin: 6px 0 0;
      color: #687b85;
      font-size: .76rem;
    }

    .register-role-options {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 9px;
      margin-bottom: 17px;
    }

    .register-role-card {
      position: relative;
      min-width: 0;
      min-height: 102px;
      display: grid;
      grid-template-columns: 34px 1fr 15px;
      align-items: start;
      gap: 9px;
      border: 1px solid #e1e9e4;
      border-radius: 11px;
      padding: 12px 10px;
      background: rgba(255,255,255,.76);
      color: inherit;
      cursor: pointer;
      text-align: left;
      transition: border-color 180ms ease,background 180ms ease,box-shadow 180ms ease,transform 180ms ease;
    }

    .register-role-card:hover {
      transform: translateY(-2px);
      border-color: #b6cec1;
    }

    .register-role-card.selected {
      border-color: #4a8290;
      background: linear-gradient(145deg,#f1f6f2,#fff);
      box-shadow: 0 0 0 3px rgba(28,83,104,.09),0 8px 19px rgba(19,42,57,.06);
    }

    .register-role-card:focus-visible {
      outline: 3px solid rgba(28,83,104,.28);
      outline-offset: 2px;
    }

    .register-role-icon {
      width: 34px;
      height: 34px;
      display: grid;
      place-items: center;
      border-radius: 9px;
      background: #eff4f0;
      color: #1c5368;
      transition: background 180ms ease,color 180ms ease,transform 180ms ease;
    }

    .register-role-card.selected .register-role-icon {
      background: #1c5368;
      color: white;
      transform: scale(1.04);
    }

    .register-role-copy strong,
    .register-role-copy small { display: block; }

    .register-role-copy strong {
      margin-top: 2px;
      color: #193441;
      font-size: .71rem;
      line-height: 1.35;
    }

    .register-role-copy small {
      margin-top: 5px;
      color: #718187;
      font-size: .59rem;
      line-height: 1.45;
    }

    .register-role-radio {
      width: 14px;
      height: 14px;
      margin-top: 2px;
      border: 1px solid #b9c8c0;
      border-radius: 50%;
    }

    .register-role-card.selected .register-role-radio {
      border: 4px solid #1c5368;
      background: white;
    }

    .register-form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 12px;
    }

    .register-auth-card .field {
      margin-bottom: 12px;
    }

    .register-auth-card .field label { font-size: .72rem; }
    .register-auth-card .field input { min-height: 42px; font-size: .79rem; }
    .register-auth-card .auth-password-wrap input { padding-right: 56px !important; }
    .register-auth-card .auth-password-toggle { right: 8px; font-size: .64rem; }

    .register-submit {
      margin-top: 4px;
    }

    .login-register-prompt .auth-lnk,
    .register-login-prompt .auth-lnk {
      color: #1c5368;
      font-weight: 800;
    }

    @keyframes auth-content-enter {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes how-glow-drift {
      from { transform: translate3d(-8px,0,0) scale(.96); }
      to { transform: translate3d(16px,17px,0) scale(1.04); }
    }

    @keyframes how-grid-drift {
      from { background-position: 0 0; }
      to { background-position: 68px 68px; }
    }

    @keyframes how-orbit-breathe {
      0%,100% { opacity: .48; transform: scale(.98); }
      50% { opacity: .94; transform: scale(1.025); }
    }

    @keyframes how-building-float {
      0%,100% { translate: 0 0; }
      50% { translate: 0 -5px; }
    }

    @keyframes how-pin-float {
      0%,100% { translate: 0 0; }
      50% { translate: 0 -6px; }
    }

    @keyframes how-float-card {
      0%,100% { translate: 0 0; }
      50% { translate: 0 -5px; }
    }

    @keyframes how-timeline-progress {
      to { height: calc(100% - 56px); }
    }

    @media (max-width: 1000px) {
      .login-page {
        grid-template-columns: minmax(0,1fr) minmax(410px,.9fr);
      }

      .login-showcase {
        padding-right: 35px;
        padding-left: 35px;
      }

      .register-layout {
        grid-template-columns: minmax(240px,.65fr) minmax(0,1.35fr);
      }

      .register-aside { min-height: 640px; }
    }

    @media (max-width: 760px) {
      .how-hero-layout {
        grid-template-columns: 1fr;
        gap: 28px;
        min-height: 0;
        padding-top: 44px;
        padding-bottom: 36px;
      }

      .how-hero-copy h1 { font-size: clamp(2.6rem,9vw,3.8rem); }
      .how-hero-art { min-height: 315px; }

      .how-timeline-section { padding: 65px 0 70px; }
      .how-section-heading { margin-bottom: 35px; text-align: left; }
      .how-section-heading .eyebrow { justify-content: flex-start; }
      .how-section-heading > p:last-child { margin-left: 0; }

      .how-timeline {
        gap: 14px;
        padding-left: 7px;
      }

      .how-timeline::before,
      .how-timeline::after {
        right: auto;
        left: 23px;
      }

      .how-timeline::after {
        animation-name: how-timeline-progress-mobile;
      }

      .how-timeline-item {
        grid-template-columns: 47px minmax(0,1fr);
        min-height: 0;
        gap: 10px;
      }

      .how-timeline-node {
        grid-column: 1;
        width: 46px;
        height: 46px;
      }

      .how-timeline-node i {
        width: 34px;
        height: 34px;
      }

      .how-timeline-node i svg {
        width: 17px;
        height: 17px;
      }

      .how-timeline-node > span {
        top: -5px;
        right: -6px;
        width: 20px;
        height: 20px;
        font-size: .45rem;
      }

      .timeline-right .how-step-card,
      .timeline-left .how-step-card {
        grid-column: 2;
      }

      .how-step-card { padding: 17px; }
      .how-step-icon { display: inline-flex; }
      .how-step-card-meta { margin-bottom: 9px; }
      .how-step-card h3 { font-size: .96rem; }
      .how-step-card > p { font-size: .77rem; }

      .how-journey-note { padding-bottom: 64px; }
      .how-journey-inner {
        grid-template-columns: 44px 1fr;
        gap: 14px;
        padding: 20px 17px;
      }

      .how-journey-icon { width: 42px; height: 42px; border-radius: 11px; }
      .how-journey-inner h2 { font-size: 1.12rem; }
      .how-journey-inner > .how-inline-link { grid-column: 2; }

      .how-final-inner {
        align-items: flex-start;
        flex-direction: column;
      }

      .how-final-actions { width: 100%; }
      .how-final-actions > * { flex: 1 1 auto; }

      .login-page {
        min-height: 0;
        grid-template-columns: 1fr;
      }

      .login-showcase {
        min-height: 0;
        padding: 22px 24px 17px;
      }

      .login-showcase-content {
        width: min(100%,570px);
        margin: 34px auto 17px;
      }

      .login-showcase-content h1 { font-size: clamp(2.4rem,8vw,3.5rem); }
      .login-showcase-visual { height: 205px; }
      .login-showcase-building { height: 116px; }
      .login-showcase-building i { height: 21px; }
      .login-showcase-footer { font-size: .47rem; }

      .login-form-side {
        min-height: 0;
        padding: 37px 20px 43px;
      }

      .login-form-wrap { width: min(100%,480px); }
      .login-form-heading { margin-bottom: 18px; }
      .login-form-icon { display: none; }

      .register-page {
        min-height: 0;
        padding: 34px 18px 48px;
      }

      .register-heading { margin-bottom: 22px; }
      .register-brand { margin-bottom: 17px; }
      .register-heading h1 { font-size: clamp(2rem,7vw,2.8rem); }

      .register-layout {
        grid-template-columns: 1fr;
        gap: 13px;
      }

      .register-aside {
        min-height: 0;
        display: grid;
        grid-template-columns: minmax(125px,.7fr) 1.3fr;
        align-items: center;
        gap: 13px;
        padding: 12px;
      }

      .register-aside-art { min-height: 155px; }
      .register-aside-ring.ring-a { width: 155px; height: 155px; }
      .register-aside-ring.ring-b { width: 113px; height: 113px; }
      .register-aside-building { width: 60%; height: 75px; gap: 4px; padding: 19px 6px 0; }
      .register-aside-building i { height: 17px; }
      .register-aside-building::before { top: 6px; left: 7px; font-size: .32rem; }
      .register-aside-pin { top: 13%; right: 17%; width: 29px; height: 29px; }
      .register-aside-pin svg { width: 15px; height: 15px; }
      .register-aside-float { right: 4px; bottom: 6px; gap: 5px; padding: 5px 6px; }
      .register-aside-float > svg { width: 14px; height: 14px; }
      .register-aside-float small { font-size: .35rem; }
      .register-aside-float strong { font-size: .49rem; }
      .register-aside-copy { padding: 4px 2px; }
      .register-aside-copy .eyebrow { margin-bottom: 6px; font-size: .49rem; }
      .register-aside-copy h2 { font-size: 1.13rem; }
      .register-aside-copy > p:last-child { margin-top: 6px; font-size: .64rem; }
      .register-aside-step { grid-column: 1 / -1; padding-top: 8px; font-size: .57rem; }

      .register-auth-card { padding: 22px 18px 19px; }
    }

    @media (max-width: 480px) {
      .how-hero-layout,
      .how-timeline-section > .container,
      .how-journey-inner,
      .how-final-inner {
        width: calc(100% - 28px);
      }

      .how-hero-layout { padding-top: 34px; }
      .how-hero-copy h1 { font-size: clamp(2.35rem,10.5vw,3.1rem); }
      .how-hero-copy > p:not(.eyebrow) { font-size: .88rem; }
      .how-hero-art { min-height: 275px; }
      .how-art-building { width: 54%; height: 150px; }
      .how-art-windows { gap: 5px; }
      .how-art-windows i { height: 27px; }
      .how-art-float-search { top: 49px; left: 6px; }
      .how-art-float-match { right: 6px; bottom: 40px; }
      .how-art-float { min-width: 155px; padding: 8px; }
      .how-art-float strong { font-size: .57rem; }
      .how-art-caption { bottom: 11px; left: 11px; font-size: .53rem; }

      .how-final-actions {
        align-items: stretch;
        flex-direction: column;
      }

      .how-final-inner { width: calc(100% - 34px); }

      .login-showcase { padding-right: 17px; padding-left: 17px; }
      .login-showcase-content h1 { font-size: clamp(2.25rem,10vw,3rem); }
      .login-showcase-description { font-size: .81rem; }
      .login-showcase-visual { height: 183px; }
      .login-showcase-building { left: 19%; width: 54%; height: 105px; padding: 22px 9px 0; }
      .login-showcase-building i { height: 19px; }
      .login-map-marker { top: 18px; right: 23%; width: 34px; height: 34px; }
      .login-float-card-one { top: 22px; left: 6px; }
      .login-float-card-two { right: 5px; bottom: 7px; }
      .login-float-card { min-width: 132px; grid-template-columns: 24px 1fr; padding: 6px; }
      .login-float-card > span:first-child { width: 24px; height: 24px; }
      .login-float-card small { font-size: .37rem; }
      .login-float-card strong { font-size: .53rem; }
      .login-showcase-footer { font-size: .39rem; letter-spacing: .06em; }
      .login-form-side { padding: 30px 14px 35px; }
      .login-auth-card { padding: 19px; }

      .register-page { padding: 27px 12px 36px; }
      .register-heading h1 { font-size: 2rem; }
      .register-heading > p:last-child { font-size: .81rem; }
      .register-aside { grid-template-columns: minmax(112px,.68fr) 1.32fr; gap: 9px; padding: 9px; }
      .register-aside-art { min-height: 138px; }
      .register-aside-copy h2 { font-size: 1rem; }
      .register-aside-copy > p:last-child { font-size: .59rem; }
      .register-auth-card { padding: 19px 14px 16px; }
      .register-role-options { grid-template-columns: 1fr; gap: 7px; }
      .register-role-card { min-height: 76px; grid-template-columns: 34px 1fr 15px; align-items: center; }
      .register-role-copy small { margin-top: 3px; }
      .register-form-grid { grid-template-columns: 1fr; }
      .register-auth-card .field { margin-bottom: 11px; }
    }

    @keyframes how-timeline-progress-mobile {
      to { height: calc(100% - 46px); }
    }

    @media (prefers-reduced-motion: reduce) {
      .how-it-works-page *,
      .how-it-works-page *::before,
      .how-it-works-page *::after,
      .login-page *,
      .login-page *::before,
      .login-page *::after,
      .register-page *,
      .register-page *::before,
      .register-page *::after {
        scroll-behavior: auto !important;
        animation-duration: .01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: .01ms !important;
      }
    }

    @media (prefers-reduced-motion: reduce) {
    .locentra-app:not(:has(.home-landing)) *,
    .locentra-app:not(:has(.home-landing)) *::before,
    .locentra-app:not(:has(.home-landing)) *::after {
      scroll-behavior: auto !important;
      animation-duration: .01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: .01ms !important;
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

function LandingIcon({ name, size = 22 }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    match: <><path d="m12 3 2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2L12 3Z" /><path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14Z" /></>,
    details: <><path d="M4 5h16v14H4z" /><path d="M8 9h8M8 13h5M8 16h8" /></>,
    people: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    store: <><path d="M3 10h18l-2-6H5l-2 6Z" /><path d="M5 10v10h14V10M9 20v-6h6v6M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" /></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    chart: <><path d="M4 19V5M4 19h17" /><path d="m7 15 4-4 3 2 6-7" /></>,
    building: <><path d="M4 21V5l8-2v18M12 9h8v12M2 21h20" /><path d="M7 7h2M7 11h2M7 15h2M15 12h2M15 16h2" /></>
  };

  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {paths[name] || paths.arrow}
    </svg>
  );
}

function HomePage() {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [featuredPropertiesLoading, setFeaturedPropertiesLoading] = useState(true);
  const [featuredPropertiesError, setFeaturedPropertiesError] = useState('');

  useEffect(() => {
    let active = true;
    getProperties()
      .then((result) => {
        if (active) setFeaturedProperties(result.properties.slice(0, 4));
      })
      .catch((error) => {
        if (active) setFeaturedPropertiesError(error.message || 'Unable to load properties.');
      })
      .finally(() => {
        if (active) setFeaturedPropertiesLoading(false);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const landing = document.querySelector('.home-landing');
    if (!landing) return undefined;

    const revealItems = landing.querySelectorAll('.home-reveal');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'));
      return undefined;
    }

    landing.classList.add('reveal-ready');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const steps = [
    ['Tell Us Your Requirement', 'Share your preferred location, space, budget, and the kind of business you are growing.', 'search'],
    ['Discover Matching Properties', 'Explore commercial spaces that align with your needs and compare the details that matter.', 'match'],
    ['Connect With a Representative', 'Talk through your shortlist with a local tenant representative and plan your next move.', 'people']
  ];

  const benefits = [
    ['Requirement-Based Search', 'Set your location, space, and budget preferences to focus your search from the start.', 'search'],
    ['Property Matching', 'Find opportunities that line up with your priorities and compare them with confidence.', 'match'],
    ['Commercial Property Details', 'Review the property information that matters as you evaluate your next location.', 'details'],
    ['Representative Connections', 'Build a direct connection with a tenant representative when you are ready to move forward.', 'people']
  ];

  const metrics = [
    ['Smart property discovery', 'Search with your priorities in mind', 'search'],
    ['Property information', 'Review key details in one place', 'details'],
    ['Direct connections', 'Meet local tenant representatives', 'people'],
    ['Faster site selection', 'Move from search to shortlist', 'chart']
  ];

  const retailSteps = [
    'Tell us what type of property you need',
    'Set your location, size, and budget preferences',
    'Explore suitable commercial properties',
    'Connect with a representative when ready'
  ];

  const repSteps = [
    'Add and manage commercial properties',
    'Receive relevant retailer requirements',
    'Organize and follow up on leads',
    'Connect with potential clients'
  ];

  return (
    <main className="home-landing">
      <section className="home-hero">
        <div className="home-hero-glow home-hero-glow-one" />
        <div className="home-hero-glow home-hero-glow-two" />
        <div className="home-shell home-hero-layout">
          <div className="home-hero-copy">
            <p className="home-eyebrow home-hero-eyebrow"><span /> A better way to find your next location</p>
            <h1>Find the Right Space for Your Business</h1>
            <p className="home-hero-description">
              Locentra helps retailers discover suitable commercial properties and connect with
              tenant representatives who can help bring the next move into focus.
            </p>
            <div className="home-hero-actions">
              <Link to="/register" className="home-button home-button-accent">
                Get Started <LandingIcon name="arrow" size={18} />
              </Link>
              <Link to="/properties" className="home-button home-button-glass">
                Explore Properties
              </Link>
            </div>
            <div className="home-hero-note">
              <span className="home-avatars" aria-hidden="true"><i>L</i><i>R</i><i>✓</i></span>
              <span>For retailers and tenant representatives</span>
            </div>
          </div>

          <div className="home-hero-visual" aria-label="Locentra commercial property search preview">
            <div className="home-visual-orbit orbit-one" />
            <div className="home-visual-orbit orbit-two" />
            <div className="home-visual-topline"><span className="home-live-dot" /> LOCENTRA PROPERTY MATCH</div>
            <div className="home-visual-building" aria-hidden="true">
              <div className="home-building-skyline skyline-back"><i /><i /><i /><i /></div>
              <div className="home-building-main">
                <div className="home-building-sign">YOUR NEXT LOCATION</div>
                <div className="home-building-windows"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
                <div className="home-building-entry" />
              </div>
              <div className="home-building-side"><i /><i /><i /><i /><i /><i /></div>
              <div className="home-building-ground" />
            </div>
            <div className="home-property-float home-property-float-top">
              <span className="home-float-icon"><LandingIcon name="pin" size={17} /></span>
              <span><small>SEARCHING IN</small><strong>Your next market</strong></span>
            </div>
            <div className="home-property-float home-property-float-bottom">
              <span className="home-match-ring">✓</span>
              <span><small>REQUIREMENTS MATCHED</small><strong>A space that fits</strong></span>
              <span className="home-float-arrow"><LandingIcon name="arrow" size={17} /></span>
            </div>
            <div className="home-visual-caption"><span>01</span><span>Start with what matters to your business</span></div>
          </div>
        </div>
        <div className="home-shell home-hero-bottom">
          <span>COMMERCIAL REAL ESTATE, MADE CLEARER</span>
          <span className="home-bottom-rule" />
          <span>SEARCH · DISCOVER · CONNECT</span>
        </div>
      </section>

      <section className="home-metrics-section" aria-label="Locentra platform benefits">
        <div className="home-shell home-metrics">
          {metrics.map(([title, description, icon], index) => (
            <article className="home-metric home-reveal" key={title} style={{ '--reveal-delay': `${index * 80}ms` }}>
              <span className="home-metric-icon"><LandingIcon name={icon} size={21} /></span>
              <span className="home-metric-copy"><strong>{title}</strong><small>{description}</small></span>
              {index < metrics.length - 1 && <span className="home-metric-divider" aria-hidden="true" />}
            </article>
          ))}
        </div>
      </section>

      <section className="home-section home-process-section">
        <div className="home-shell">
          <div className="home-section-heading home-reveal">
            <p className="home-eyebrow">A clear path from search to connection</p>
            <h2>How Locentra Works</h2>
            <p>Three simple steps help turn your next location search into a focused plan.</p>
          </div>
          <div className="home-process-grid">
            {steps.map(([title, description, icon], index) => (
              <article className="home-process-card home-reveal" key={title} style={{ '--reveal-delay': `${index * 120}ms` }}>
                <div className="home-process-card-top"><span>0{index + 1}</span><i><LandingIcon name={icon} size={22} /></i></div>
                <h3>{title}</h3>
                <p>{description}</p>
                {index < steps.length - 1 && <span className="home-process-connector" aria-hidden="true"><LandingIcon name="arrow" size={17} /></span>}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-benefits-section">
        <div className="home-shell">
          <div className="home-section-heading home-reveal">
            <p className="home-eyebrow">Designed around better decisions</p>
            <h2>Why Choose Locentra?</h2>
            <p>Bring your requirements, useful property details, and local expertise together in one considered search.</p>
          </div>
          <div className="home-benefit-grid">
            {benefits.map(([title, description, icon], index) => (
              <article className="home-benefit-card home-reveal" key={title} style={{ '--reveal-delay': `${index * 85}ms` }}>
                <span className="home-benefit-icon"><LandingIcon name={icon} size={22} /></span>
                <span className="home-benefit-index">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="home-benefit-link" aria-hidden="true"><LandingIcon name="arrow" size={17} /></span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-audience home-retailers">
        <div className="home-shell home-audience-layout">
          <div className="home-audience-copy home-reveal">
            <p className="home-eyebrow"><span className="home-eyebrow-number">01</span> For retailers</p>
            <h2>Find a space that fits the way you do business.</h2>
            <p>From a first storefront to your next expansion, make the search yours. Set the criteria that matter and explore relevant commercial opportunities.</p>
            <ul className="home-check-list">
              {retailSteps.map((item) => <li key={item}><LandingIcon name="check" size={17} />{item}</li>)}
            </ul>
            <Link to="/register" className="home-inline-link">Start your search <LandingIcon name="arrow" size={17} /></Link>
          </div>
          <div className="home-audience-visual home-retailer-visual home-reveal">
            <div className="home-search-window">
              <div className="home-window-header"><span className="home-window-brand"><b>L</b> Locentra</span><span className="home-window-status"><i /> YOUR REQUIREMENT</span></div>
              <div className="home-window-title"><span>Let's find your next space</span><small>Tell us what you have in mind</small></div>
              <div className="home-form-row"><span><small>PROPERTY TYPE</small><strong>Retail space</strong></span><span><small>LOCATION</small><strong>Choose an area</strong></span></div>
              <div className="home-form-row"><span><small>SPACE NEEDED</small><strong>e.g. 2,000 sq.ft.</strong></span><span><small>MONTHLY BUDGET</small><strong>Set your range</strong></span></div>
              <span className="home-form-submit">Build my search <LandingIcon name="arrow" size={15} /></span>
            </div>
            <div className="home-visual-stamp"><LandingIcon name="store" size={19} /><span><small>MADE FOR GROWTH</small><strong>Your business, your next move</strong></span></div>
          </div>
        </div>
      </section>

      <section className="home-audience home-representatives">
        <div className="home-shell home-audience-layout home-audience-reverse">
          <div className="home-audience-visual home-rep-visual home-reveal">
            <div className="home-rep-board">
              <div className="home-rep-board-heading"><span>Property overview</span><span className="home-rep-more">•••</span></div>
              <div className="home-rep-chart">
                <span className="home-chart-label">New retailer requirements</span>
                <div className="home-chart-bars"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
                <div className="home-chart-base"><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span></div>
              </div>
              <div className="home-rep-mini-cards"><span><small>PROPERTY LISTINGS</small><strong>Manage in one place</strong></span><span><small>LEAD FOLLOW-UP</small><strong>Keep conversations moving</strong></span></div>
            </div>
            <div className="home-rep-note"><span className="home-rep-note-icon"><LandingIcon name="people" size={18} /></span><span><small>BUILT FOR CONNECTION</small><strong>Meet the right client</strong></span></div>
          </div>
          <div className="home-audience-copy home-reveal">
            <p className="home-eyebrow"><span className="home-eyebrow-number">02</span> For tenant representatives</p>
            <h2>Bring the right properties and people together.</h2>
            <p>Keep your commercial property activity organized while finding relevant retailer requirements and building meaningful client connections.</p>
            <ul className="home-check-list">
              {repSteps.map((item) => <li key={item}><LandingIcon name="check" size={17} />{item}</li>)}
            </ul>
            <Link to="/register" className="home-inline-link">Join Locentra <LandingIcon name="arrow" size={17} /></Link>
          </div>
        </div>
      </section>

      <section className="home-section home-featured-section">
        <div className="home-shell">
          <div className="home-featured-heading home-reveal">
            <div><p className="home-eyebrow">A first look at the marketplace</p><h2>Spaces worth exploring.</h2><p>Browse a selection of commercial opportunities listed on Locentra.</p></div>
            <Link to="/properties" className="home-inline-link">Explore all properties <LandingIcon name="arrow" size={17} /></Link>
          </div>
          <div className="home-property-grid">
            {featuredProperties.map((property, index) => (
              <article className={`home-property-card home-property-scene-${(index % 4) + 1} home-reveal is-visible`} key={property._id} style={{ '--reveal-delay': `${index * 90}ms` }}>
                <Link
                  to={`/properties/${property._id}`}
                  className="home-property-image"
                  aria-label={`View ${property.title}`}
                  style={property.imageUrl ? {
                    backgroundImage: `linear-gradient(180deg, rgba(17,44,57,.02), rgba(17,44,57,.2)), url("${property.imageUrl}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  } : undefined}
                >
                  <span className="home-property-pill">{property.propertyType}</span>
                  {!property.imageUrl && <>
                    <span className="home-scene-sun" />
                    <span className="home-scene-building"><i /><i /><i /><i /><i /><i /><i /><i /><i /></span>
                    <span className="home-scene-foreground" />
                  </>}
                  <span className="home-scene-label">LOCENTRA <i>·</i> {property.city.toUpperCase()}</span>
                </Link>
                <div className="home-property-content">
                  <div className="home-property-location"><LandingIcon name="pin" size={15} />{property.location}, {property.city}</div>
                  <h3>{property.title}</h3>
                  <div className="home-property-data"><span><small>AREA</small><strong>{Number(property.areaSqFt).toLocaleString()} sq.ft.</strong></span><span><small>ASKING RENT</small><strong>₹{Number(property.monthlyRent).toLocaleString()}/month</strong></span></div>
                  <div className="home-property-footer"><span className="home-property-status"><i />Listed</span><Link to={`/properties/${property._id}`} className="home-property-link">View details <LandingIcon name="arrow" size={15} /></Link></div>
                </div>
              </article>
            ))}
            {!featuredPropertiesLoading && featuredProperties.length === 0 && (
              <div className="home-property-empty home-reveal is-visible" role={featuredPropertiesError ? 'alert' : 'status'}>
                <strong>{featuredPropertiesError ? 'Properties are temporarily unavailable.' : 'New commercial listings are coming soon.'}</strong>
                <span>{featuredPropertiesError || 'Browse the marketplace to see all properties currently published by Locentra representatives.'}</span>
                <Link to="/properties" className="home-property-link">Explore properties <LandingIcon name="arrow" size={15} /></Link>
              </div>
            )}
            {featuredPropertiesLoading && <p role="status">Loading current property listings...</p>}
          </div>
        </div>
      </section>

      <section className="home-onboarding-section">
        <div className="home-shell home-onboarding-layout">
          <div className="home-onboarding-copy home-reveal">
            <p className="home-eyebrow">Your next step starts here</p>
            <h2>Start finding the right commercial space in minutes.</h2>
            <p>Create your account and move through a clear, simple onboarding designed to get your search underway.</p>
            <Link to="/register" className="home-button home-button-dark">Get Started <LandingIcon name="arrow" size={17} /></Link>
          </div>
          <div className="home-onboarding-steps">
            {[
              ['Create your account', 'Set up your Locentra profile in a few simple steps.'],
              ['Tell us what you need', 'Add your location, size, and budget preferences.'],
              ['Explore and connect', 'Review suitable spaces and reach out when ready.']
            ].map(([title, description], index) => (
              <article className="home-onboarding-step home-reveal" key={title} style={{ '--reveal-delay': `${index * 100}ms` }}>
                <span className="home-onboarding-number">0{index + 1}</span><span className="home-onboarding-step-copy"><strong>{title}</strong><small>{description}</small></span><LandingIcon name="arrow" size={17} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-final-section">
        <div className="home-final-pattern" aria-hidden="true" />
        <div className="home-shell home-final-layout home-reveal">
          <div><p className="home-eyebrow">Make your next move count</p><h2>Ready to find your next location?</h2><p>Let’s find a commercial space that makes sense for what comes next.</p></div>
          <div className="home-final-actions">
            <Link to="/register" className="home-button home-button-accent">Get Started <LandingIcon name="arrow" size={18} /></Link>
            <Link to="/properties" className="home-button home-button-final-outline">Explore Properties</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function HowItWorksPage() {
  useEffect(() => {
    const page = document.querySelector('.how-it-works-page');
    if (!page) return undefined;

    const items = page.querySelectorAll('.how-reveal');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion || !('IntersectionObserver' in window)) {
      items.forEach((item) => item.classList.add('is-visible'));
      return undefined;
    }

    page.classList.add('reveal-ready');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const steps = [
    ['Tell Us What You Need', 'Share your business type, preferred market, space needs, and budget. Start with what matters most to your next location.', 'search'],
    ['Discover Matching Properties', 'Explore commercial properties that align with your requirements and surface opportunities worth a closer look.', 'match'],
    ['Compare Your Options', 'Review location, size, rent, and property details side by side to build a shortlist that feels right.', 'details'],
    ['Connect With a Representative', 'Start a conversation with a tenant representative who can help you learn more about a promising space.', 'people'],
    ['Move Forward With Confidence', 'Take the next step with a clearer view of your options and the people who can help you move forward.', 'check']
  ];

  return (
    <main className="how-it-works-page">
      <section className="how-hero">
        <div className="how-hero-glow" />
        <div className="container how-hero-layout">
          <div className="how-hero-copy">
            <p className="eyebrow"><span className="how-eyebrow-dot" /> A considered journey, from search to site</p>
            <h1>A clearer path to your next location.</h1>
            <p>Finding a commercial space takes more than browsing listings. Locentra brings your requirements, relevant properties, and local expertise together in five simple steps.</p>
            <Link to="/register" className="how-cta-button">Start your search <LandingIcon name="arrow" size={18} /></Link>
            <div className="how-hero-footnote"><span>01 — 05</span><span>One step at a time. One better-informed decision.</span></div>
          </div>
          <div className="how-hero-art" aria-hidden="true">
            <div className="how-art-grid" />
            <div className="how-art-orbit how-art-orbit-one" />
            <div className="how-art-orbit how-art-orbit-two" />
            <div className="how-art-building">
              <div className="how-art-building-sign">LOCENTRA</div>
              <div className="how-art-windows">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div>
              <span className="how-art-door" />
            </div>
            <div className="how-art-pin"><LandingIcon name="pin" size={21} /></div>
            <div className="how-art-float how-art-float-search"><span><LandingIcon name="search" size={17} /></span><small>YOUR REQUIREMENT</small><strong>Search with purpose</strong></div>
            <div className="how-art-float how-art-float-match"><span className="how-art-match-check">✓</span><small>A BETTER FIT</small><strong>Options to explore</strong></div>
            <div className="how-art-caption">A good location starts with a good process.</div>
          </div>
        </div>
      </section>

      <section className="how-timeline-section">
        <div className="container">
          <header className="how-section-heading how-reveal">
            <p className="eyebrow">From first thought to next step</p>
            <h2>Five steps. A more confident search.</h2>
            <p>Move at your own pace. Each step makes it easier to understand your choices and decide what comes next.</p>
          </header>
          <div className="how-timeline">
            {steps.map(([title, description, icon], index) => (
              <article className={`how-timeline-item how-reveal ${index % 2 === 0 ? 'timeline-right' : 'timeline-left'}`} key={title} style={{ '--reveal-delay': `${index * 90}ms` }}>
                <div className="how-timeline-node"><span>0{index + 1}</span><i><LandingIcon name={icon} size={20} /></i></div>
                <div className="how-step-card">
                  <div className="how-step-card-meta"><span>STEP 0{index + 1}</span><span className="how-step-icon"><LandingIcon name={icon} size={18} /></span></div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <div className="how-step-progress"><span style={{ width: `${(index + 1) * 20}%` }} /></div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="how-journey-note">
        <div className="container how-journey-inner how-reveal">
          <span className="how-journey-icon"><LandingIcon name="building" size={25} /></span>
          <div><p className="eyebrow">A better way to move forward</p><h2>Your next location search can start right here.</h2><p>Tell Locentra what your business needs, then explore the possibilities with a clear place to begin.</p></div>
          <Link to="/properties" className="how-inline-link">Explore properties <LandingIcon name="arrow" size={17} /></Link>
        </div>
      </section>

      <section className="how-final-cta">
        <div className="container how-final-inner how-reveal">
          <div><p className="eyebrow">Make your next move count</p><h2>Ready to find your next location?</h2><p>Start with your requirements. We’ll help you take it from there.</p></div>
          <div className="how-final-actions">
            <Link to="/register" className="how-cta-button">Get Started <LandingIcon name="arrow" size={18} /></Link>
            <Link to="/properties" className="how-cta-outline">Explore Properties</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function AboutPage() {
  return (
    <div className="page about-page">
      <div className="container">
        <section className="about-intro">
          <div className="about-intro-copy">
            <p className="eyebrow">About Locentra</p>
            <h1>Built for smarter location decisions.</h1>
            <p>
              Finding the right commercial space should feel like a clear next step, not a maze of
              disconnected listings and conversations. Locentra brings the search and the people
              behind it closer together.
            </p>
            <div className="about-intro-actions">
              <Link to="/properties" className="btn btn-primary">Explore properties</Link>
              <Link to="/how-it-works" className="about-inline-link">See how it works <LandingIcon name="arrow" size={17} /></Link>
            </div>
          </div>
          <div className="about-intro-visual" aria-hidden="true">
            <span className="about-visual-ring ring-one" />
            <span className="about-visual-ring ring-two" />
            <span className="about-visual-building"><i /><i /><i /><i /><i /><i /><i /><i /><i /></span>
            <span className="about-visual-pin"><LandingIcon name="pin" size={24} /></span>
            <span className="about-visual-caption">A clearer path to your next location</span>
          </div>
        </section>
        <section className="about-purpose">
          <div className="about-purpose-heading">
            <p className="eyebrow">What guides us</p>
            <h2>Better property decisions start with a better-connected process.</h2>
          </div>
          <div className="about-purpose-grid">
            <article className="about-purpose-card"><span>01</span><h3>Start with the requirement</h3><p>Help businesses bring location, size, and budget priorities into focus before they begin comparing spaces.</p></article>
            <article className="about-purpose-card"><span>02</span><h3>Make discovery more useful</h3><p>Present commercial property details in a way that supports a more considered shortlist.</p></article>
            <article className="about-purpose-card"><span>03</span><h3>Bring people together</h3><p>Create a simpler path for retailers and tenant representatives to start a relevant conversation.</p></article>
          </div>
        </section>
      </div>
    </div>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    try {
      const result = await loginAccount({
        email: formData.get('email'),
        password: formData.get('password'),
      });
      const authentication = JSON.stringify({ token: result.token, user: result.user });
      const storage = formData.get('remember') === 'on' ? window.localStorage : window.sessionStorage;
      const otherStorage = storage === window.localStorage ? window.sessionStorage : window.localStorage;
      otherStorage.removeItem('locentraAuth');
      storage.setItem('locentraAuth', authentication);
      navigate(result.user.role === 'tenantRepresentative' ? '/tenant-dashboard' : '/retailer-dashboard');
    } catch (error) {
      setErrorMessage(error.message || 'Unable to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-showcase">
        <div className="login-showcase-glow" />
        <div className="login-showcase-grid" />
        <Link to="/" className="login-brand"><span>L</span><strong>Locentra</strong><small>SITE SELECTION</small></Link>
        <div className="login-showcase-content">
          <p className="login-showcase-kicker"><i /> YOUR NEXT CHAPTER STARTS WITH A LOCATION</p>
          <h1>Find the right space.<br /><em>Build the right future.</em></h1>
          <p className="login-showcase-description">A more considered way to discover commercial properties and connect with the people who know your market.</p>
          <div className="login-showcase-visual" aria-hidden="true">
            <div className="login-map-lines" />
            <div className="login-showcase-building"><span>LOCENTRA</span><div>{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div></div>
            <span className="login-map-marker"><LandingIcon name="pin" size={19} /></span>
            <div className="login-float-card login-float-card-one"><span><LandingIcon name="search" size={16} /></span><small>YOUR SEARCH</small><strong>Built around you</strong></div>
            <div className="login-float-card login-float-card-two"><span className="login-float-check">✓</span><small>LOCAL INSIGHT</small><strong>People who know the market</strong></div>
          </div>
        </div>
        <div className="login-showcase-footer"><span>COMMERCIAL REAL ESTATE, MADE CLEARER</span><span>LOCENTRA © 2026</span></div>
      </section>
      <section className="login-form-side">
        <div className="login-form-decoration login-form-decoration-one" />
        <div className="login-form-decoration login-form-decoration-two" />
        <div className="login-form-wrap">
          <div className="login-form-heading">
            <span className="login-form-icon"><LandingIcon name="building" size={20} /></span>
            <p className="eyebrow">Welcome back</p>
            <h2>Good to see you again.</h2>
            <p>Sign in to pick up where you left off.</p>
          </div>
          <form className="auth-card login-auth-card" onSubmit={handleSubmit}>
            {location.state?.registrationSuccess && <p className="auth-feedback auth-feedback-success" role="status">{location.state.registrationSuccess}</p>}
            <div className="field">
              <label htmlFor="login-email">Email address</label>
              <input id="login-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
            </div>
            <div className="field">
              <label htmlFor="login-password">Password</label>
              <div className="auth-password-wrap">
                <input id="login-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" required />
                <button type="button" className="auth-password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((shown) => !shown)}>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <div className="login-form-options">
              <label><input name="remember" type="checkbox" /> Remember me</label>
              <a href="#" className="auth-lnk">Forgot password?</a>
            </div>
            {errorMessage && <p className="auth-feedback auth-feedback-error" role="alert">{errorMessage}</p>}
            <button type="submit" className="btn btn-primary full-width login-submit" disabled={isSubmitting}>{isSubmitting ? 'Signing In...' : 'Sign In'} {!isSubmitting && <LandingIcon name="arrow" size={17} />}</button>
            <p className="login-register-prompt">New to Locentra? <Link to="/register" className="auth-lnk">Create an account</Link></p>
          </form>
          <p className="login-security-note"><LandingIcon name="check" size={15} /> Your site search is ready when you are.</p>
        </div>
      </section>
    </main>
  );
}

function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState('retailer');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const passwordConfirmation = form.elements.namedItem('confirmPassword');
    passwordConfirmation.setCustomValidity('');
    if (formData.get('password') !== formData.get('confirmPassword')) {
      passwordConfirmation.setCustomValidity('Passwords must match.');
      passwordConfirmation.reportValidity();
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    try {
      const result = await registerAccount({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        role: role === 'tenant-representative' ? 'tenantRepresentative' : 'retailer',
      });
      navigate('/login', {
        replace: true,
        state: { registrationSuccess: result.message || 'Account created. Please sign in.' },
      });
    } catch (error) {
      setErrorMessage(error.message || 'Unable to create your account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="register-page">
      <div className="register-background-orb register-orb-one" />
      <div className="register-background-orb register-orb-two" />
      <div className="register-shell">
        <header className="register-heading">
          <Link to="/" className="register-brand"><span>L</span><strong>Locentra</strong><small>SITE SELECTION</small></Link>
          <p className="eyebrow">A better location journey begins here</p>
          <h1>Let’s make room for what’s next.</h1>
          <p>Tell us how you work with commercial real estate. We’ll set up the right place to begin.</p>
        </header>
        <div className="register-layout">
          <aside className="register-aside">
            <div className="register-aside-art" aria-hidden="true">
              <div className="register-aside-grid" />
              <span className="register-aside-ring ring-a" />
              <span className="register-aside-ring ring-b" />
              <div className="register-aside-building"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
              <span className="register-aside-pin"><LandingIcon name="pin" size={19} /></span>
              <div className="register-aside-float"><LandingIcon name="match" size={17} /><span><small>GOOD THINGS START</small><strong>With the right space</strong></span></div>
            </div>
            <div className="register-aside-copy"><p className="eyebrow">One platform, two perspectives</p><h2>Make the next move a more informed one.</h2><p>Find commercial opportunities, share what you need, and connect with local expertise on Locentra.</p></div>
            <div className="register-aside-step"><span>01</span><span>Choose your path to get started</span><i /></div>
          </aside>
          <form className="auth-card register-auth-card" onSubmit={handleSubmit}>
            <div className="register-card-heading"><p className="eyebrow">Create your account</p><h2>First, tell us who you are.</h2><p>Choose the profile that best describes you.</p></div>
            <div className="register-role-options" role="group" aria-label="Choose your account role">
              <button type="button" className={`register-role-card${role === 'retailer' ? ' selected' : ''}`} aria-pressed={role === 'retailer'} onClick={() => setRole('retailer')}>
                <span className="register-role-icon"><LandingIcon name="store" size={21} /></span><span className="register-role-copy"><strong>Retailer</strong><small>Find the right commercial space for your business.</small></span><span className="register-role-radio" />
              </button>
              <button type="button" className={`register-role-card${role === 'tenant-representative' ? ' selected' : ''}`} aria-pressed={role === 'tenant-representative'} onClick={() => setRole('tenant-representative')}>
                <span className="register-role-icon"><LandingIcon name="people" size={21} /></span><span className="register-role-copy"><strong>Tenant Representative</strong><small>Connect businesses with suitable properties.</small></span><span className="register-role-radio" />
              </button>
            </div>
            <input type="hidden" name="role" value={role} />
            <div className="register-form-grid">
              <div className="field"><label htmlFor="register-name">Full Name</label><input id="register-name" name="name" type="text" autoComplete="name" placeholder="Your full name" required /></div>
              <div className="field"><label htmlFor="register-company">Company Name</label><input id="register-company" name="company" type="text" autoComplete="organization" placeholder="Your company" required /></div>
              <div className="field"><label htmlFor="register-email">Email</label><input id="register-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></div>
              <div className="field"><label htmlFor="register-phone">Phone</label><input id="register-phone" name="phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" required /></div>
              <div className="field"><label htmlFor="register-password">Password</label><div className="auth-password-wrap"><input id="register-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Create a password" required /><button type="button" className="auth-password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((shown) => !shown)}>{showPassword ? 'Hide' : 'Show'}</button></div></div>
              <div className="field"><label htmlFor="register-confirm-password">Confirm Password</label><div className="auth-password-wrap"><input id="register-confirm-password" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Confirm your password" required onChange={(event) => event.currentTarget.setCustomValidity('')} /><button type="button" className="auth-password-toggle" aria-label={showConfirmPassword ? 'Hide password' : 'Show password'} onClick={() => setShowConfirmPassword((shown) => !shown)}>{showConfirmPassword ? 'Hide' : 'Show'}</button></div></div>
            </div>
            {errorMessage && <p className="auth-feedback auth-feedback-error" role="alert">{errorMessage}</p>}
            <button type="submit" className="btn btn-primary full-width register-submit" disabled={isSubmitting}>{isSubmitting ? 'Creating Account...' : 'Create Account'} {!isSubmitting && <LandingIcon name="arrow" size={17} />}</button>
            <p className="register-login-prompt">Already have an account? <Link to="/login" className="auth-lnk">Sign in</Link></p>
          </form>
        </div>
      </div>
    </main>
  );
}

function PropertiesPage() {
  const [activeType, setActiveType] = useState('All');
  const [propertyData, setPropertyData] = useState({ type: null, properties: [] });
  const [errorMessage, setErrorMessage] = useState('');
  const filters = ['All', 'Retail', 'Office', 'Industrial'];
  const visibleProperties = propertyData.properties;
  const isLoading = propertyData.type !== activeType && !errorMessage;

  useEffect(() => {
    let active = true;
    getProperties(activeType)
      .then((result) => { if (active) setPropertyData({ type: activeType, properties: result.properties }); })
      .catch((error) => { if (active) setErrorMessage(error.message || 'Unable to load properties.'); });
    return () => { active = false; };
  }, [activeType]);

  function selectFilter(filter) {
    setErrorMessage('');
    setActiveType(filter);
  }

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
          {filters.map((filter) => (
            <button
              key={filter}
              className={`chip${activeType === filter ? ' active' : ''}`}
              type="button"
              aria-pressed={activeType === filter}
              onClick={() => selectFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {isLoading ? <p role="status">Loading properties...</p> : null}
        {errorMessage && <p className="auth-feedback auth-feedback-error" role="alert">{errorMessage}</p>}
        {!isLoading && !errorMessage && visibleProperties.length > 0 ? (
          <div className="property-grid">
            {visibleProperties.map((property) => (
              <article className="property-card" key={property._id}>
                <div className="property-visual" style={property.imageUrl ? { backgroundImage: `url("${property.imageUrl}")`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined} />
                <div className="property-body">
                  <div className="property-head">
                    <div>
                      <h3>{property.title}</h3>
                      <p>{property.location}, {property.city}</p>
                    </div>
                  </div>

                  <div className="property-meta">
                    <span>{property.propertyType}</span>
                    <span>{property.areaSqFt.toLocaleString()} sq.ft.</span>
                    <span>₹{property.monthlyRent.toLocaleString()}/month</span>
                  </div>

                  <div className="property-footer">
                    <span className="status-pill">{property.footTraffic} foot traffic</span>
                    <Link to={`/properties/${property._id}`} className="link">View Details</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}
        {!isLoading && !errorMessage && visibleProperties.length === 0 ? (
          <div className="properties-empty-state" role="status">
            <span><LandingIcon name="search" size={24} /></span>
            <h2>No properties found</h2>
            <p>There are no {activeType === 'All' ? 'property' : activeType.toLowerCase()} listings published yet. New properties appear here when a tenant representative lists them.</p>
            {activeType !== 'All' && <button className="btn btn-secondary" type="button" onClick={() => setActiveType('All')}>View all properties</button>}
            <Link className="link" to="/login">Are you a tenant representative? Sign in to publish a listing.</Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function PropertyDetailsPage() {
  const { id } = useParams();
  const [propertyState, setPropertyState] = useState({ id: null, property: null });
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isContacting, setIsContacting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loadError, setLoadError] = useState({ id: null, message: '' });
  const [requirementId, setRequirementId] = useState('');
  const property = propertyState.id === id ? propertyState.property : null;
  const isLoading = propertyState.id !== id && loadError.id !== id;
  const currentLoadError = loadError.id === id ? loadError.message : '';

  useEffect(() => {
    let active = true;
    getProperty(id)
      .then(async (result) => {
        if (!active) return;
        setPropertyState({ id, property: result.property });
        const [favoriteResult, requirementResult] = await Promise.all([
          getFavoriteStatus(id).catch(() => ({ saved: false })),
          getRequirements().catch(() => ({ requirements: [] })),
        ]);
        const existingContactRequests = await getContactRequests().catch(() => ({ requests: [] }));
        if (active) {
          setSaved(favoriteResult.saved);
          setRequirementId(requirementResult.requirements[0]?._id || '');
          setRequestSent(existingContactRequests.requests.some((request) => request.property?._id === id));
        }
      })
      .catch((error) => { if (active) setLoadError({ id, message: error.message || 'Unable to load this property.' }); });
    return () => { active = false; };
  }, [id]);

  async function toggleSaved() {
    setIsSaving(true);
    setErrorMessage('');
    setFeedback('');
    try {
      if (saved) {
        await removeFavorite(property._id);
        setSaved(false);
        setFeedback('Property removed from your saved list.');
      } else {
        await saveFavorite(property._id);
        setSaved(true);
        setFeedback('Property saved for later.');
      }
    } catch (error) {
      setErrorMessage(error.message || 'Unable to update saved properties.');
    } finally {
      setIsSaving(false);
    }
  }

  async function contactRepresentative() {
    setIsContacting(true);
    setErrorMessage('');
    setFeedback('');
    try {
      const result = await createContactRequest(property._id, requirementId);
      setRequestSent(true);
      setFeedback(result.message || 'Your request was sent to the representative.');
    } catch (error) {
      if (error.message?.includes('already sent')) {
        setRequestSent(true);
        setFeedback(error.message);
      } else {
        setErrorMessage(error.message || 'Unable to contact the representative.');
      }
    } finally {
      setIsContacting(false);
    }
  }

  return (
    <div className="page">
      <div className="container">
        {isLoading && <p role="status">Loading property details...</p>}
        {!isLoading && currentLoadError && !property && <p className="auth-feedback auth-feedback-error" role="alert">{currentLoadError}</p>}
        {property && <>
        <div className="detail-layout">
          <div className="detail-gallery" style={property.imageUrl ? { backgroundImage: `url("${property.imageUrl}")`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined} />

          <div className="detail-card">
            <p className="eyebrow">{property.propertyType}</p>
            <h1>{property.title}</h1>
            <p>{property.location}, {property.city}</p>

            <div className="detail-metrics">
              <div className="metric-box">
                <strong>{property.areaSqFt.toLocaleString()} sq.ft.</strong>
                <span>Size</span>
              </div>
              <div className="metric-box">
                <strong>₹{property.monthlyRent.toLocaleString()}/month</strong>
                <span>Rent</span>
              </div>
              <div className="metric-box">
                <strong>{property.footTraffic}</strong>
                <span>Foot traffic</span>
              </div>
            </div>

            <div className="detail-actions">
              <button type="button" className="btn btn-primary" onClick={contactRepresentative} disabled={isContacting || requestSent}>{isContacting ? 'Sending...' : requestSent ? 'Request Sent' : 'Contact Representative'}</button>
              <button type="button" className="btn btn-secondary" onClick={toggleSaved} disabled={isSaving}>{isSaving ? 'Saving...' : saved ? 'Saved' : 'Save Property'}</button>
            </div>

            {feedback && <p className="auth-feedback auth-feedback-success" role="status">{feedback} <Link to="/contact-requests">View contact requests</Link></p>}
            {errorMessage && <p className="auth-feedback auth-feedback-error" role="alert">{errorMessage} {errorMessage.includes('sign in') && <Link to="/login">Sign in</Link>}</p>}
            <div className="feature-card">
              <h3 style={{ marginTop: 0, marginBottom: 12 }}>Property information</h3>
              <ul className="feature-list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--locentra-text-soft)' }}>
                <li>Parking: {property.parking ? 'Available' : 'Not available'}</li>
                <li>Foot traffic: {property.footTraffic}</li>
                <li>Representative: {property.representative?.name || 'Not assigned'}</li>
                {property.description && <li>{property.description}</li>}
              </ul>
            </div>
          </div>
        </div>
        </>}
      </div>
    </div>
  );
}

function RetailerDashboardPage() {
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [requirements, setRequirements] = useState([]);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [matches, setMatches] = useState([]);
  const [savedCount, setSavedCount] = useState(0);
  const [savedPropertyIds, setSavedPropertyIds] = useState([]);
  const [contactRequestCount, setContactRequestCount] = useState(0);
  const [contactedPropertyIds, setContactedPropertyIds] = useState([]);
  const [contactFeedback, setContactFeedback] = useState('');
  const [matchCount, setMatchCount] = useState(0);
  const [requirementsLoading, setRequirementsLoading] = useState(true);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState('');
  const requestedRequirementId = location.state?.requirementId;

  useEffect(() => {
    let active = true;

    async function loadRequirements() {
      setRequirementsLoading(true);
      setDashboardError('');
      try {
        const [result, favoritesResult, contactsResult, profileResult] = await Promise.all([
          getRequirements(),
          getFavorites(),
          getContactRequests(),
          getProfile(),
        ]);
        if (!active) return;
        setRequirements(result.requirements);
        setSavedCount(favoritesResult.favorites.length);
        setSavedPropertyIds(favoritesResult.favorites.map((favorite) => favorite.property?._id).filter(Boolean));
        setContactRequestCount(contactsResult.requests.length);
        setContactedPropertyIds(contactsResult.requests.map((request) => request.property?._id).filter(Boolean));
        setProfile(profileResult.user);
        const target = result.requirements.find((item) => item._id === requestedRequirementId)
          || result.requirements[0];
        setSelectedRequirement(target || null);
        if (result.requirements.length) {
          setMatchesLoading(true);
          const matchResults = await Promise.all(result.requirements.map((item) => getRequirementMatches(item._id)));
          if (active) {
            const uniqueMatches = new Map();
            matchResults.flatMap((matchResult) => matchResult.matches).forEach((match) => {
              const current = uniqueMatches.get(match.property._id);
              if (!current || current.matchScore < match.matchScore) uniqueMatches.set(match.property._id, match);
            });
            setMatches(target ? matchResults[result.requirements.indexOf(target)].matches : []);
            setMatchCount(uniqueMatches.size);
          }
        } else {
          setMatches([]);
          setMatchCount(0);
        }
      } catch (error) {
        if (active) setDashboardError(error.message || 'Unable to load your requirements.');
      } finally {
        if (active) {
          setRequirementsLoading(false);
          setMatchesLoading(false);
        }
      }
    }

    loadRequirements();
    return () => { active = false; };
  }, [requestedRequirementId]);

  async function showRequirementMatches(requirement) {
    setSelectedRequirement(requirement);
    setMatches([]);
    setDashboardError('');
    setMatchesLoading(true);
    try {
      const result = await getRequirementMatches(requirement._id);
      setMatches(result.matches);
    } catch (error) {
      setDashboardError(error.message || 'Unable to load matching properties.');
    } finally {
      setMatchesLoading(false);
    }
  }

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
              <NavLink to="/profile" className="side-link">Profile</NavLink>
            </div>
          </aside>

          <main className="content-panel">
            <div className="page-header">
              <div>
                <p className="eyebrow">Good morning{profile?.name ? `, ${profile.name}` : ''}</p>
                <h1>Find the right location for your next store.</h1>
              </div>
              <Link to="/create-requirement" className="btn btn-primary">+ Create requirement</Link>
            </div>

            <div className="stats-row">
              <div className="stat-card">
                <span>Active Requirements</span>
                <strong>{requirements.filter((item) => item.status === 'active').length}</strong>
                <small>Submitted property searches</small>
              </div>
              <div className="stat-card">
                <span>Saved Properties</span>
                <strong>{savedCount}</strong>
                <small>Bookmarked for later</small>
              </div>
              <div className="stat-card">
                <span>Matching Properties</span>
                <strong>{matchCount}</strong>
                <small>Across your active requirements</small>
              </div>
              <div className="stat-card">
                <span>Contact Requests</span>
                <strong>{contactRequestCount}</strong>
                <small>Sent to representatives</small>
              </div>
            </div>

            <div className="retailer-dashboard-sections">
              <section className="feature-card retailer-requirements-section">
                <div className="section-header" style={{ marginBottom: 14 }}>
                  <h3 style={{ margin: 0 }}>My Requirements</h3>
                  <Link to="/create-requirement" className="link">View all</Link>
                </div>
                <p>Requirements you’ve submitted while searching for commercial property.</p>

                {requirementsLoading ? <p role="status">Loading your requirements...</p> : null}
                {!requirementsLoading && requirements.length === 0 ? (
                  <p>You haven’t submitted any requirements yet. Create one to get started.</p>
                ) : null}
                <div className="list-stack">
                  {requirements.map((req) => (
                    <div key={req._id} className="list-row">
                      <div>
                        <strong>{req.businessName}</strong>
                        <small>{req.preferredLocation} · {req.propertyType}</small>
                      </div>
                      <span className="label">{req.status}</span>
                      <button type="button" className="btn btn-secondary btn-small" onClick={() => showRequirementMatches(req)}>View</button>
                    </div>
                  ))}
                </div>
              </section>

              <section className="feature-card retailer-matches-section">
                <div className="section-header" style={{ marginBottom: 14 }}>
                  <h3 style={{ margin: 0 }}>Matching Properties</h3>
                  <Link to="/properties" className="link">Explore</Link>
                </div>
                <p>Properties scored against your submitted requirement preferences.</p>
                {selectedRequirement && <p>Matches for <strong>{selectedRequirement.businessName}</strong> in {selectedRequirement.preferredLocation}</p>}
                {matchesLoading && <p role="status">Finding properties that fit your requirements...</p>}
                {!matchesLoading && !dashboardError && selectedRequirement && matches.length === 0 && (
                  <p>No matching properties found for your current requirement.</p>
                )}
                <div className="retailer-match-grid">
                  {matches.slice(0, 4).map(({ property, matchScore, matchingReasons }) => (
                    <article className="retailer-match-card" key={property._id}>
                      <div className="retailer-match-card-header">
                        <span className="retailer-match-type">{property.propertyType}</span>
                        <span className="retailer-match-score">{matchScore}% Match</span>
                      </div>
                      <h4>{property.title}</h4>
                      <p className="retailer-match-location">{property.location}, {property.city}</p>
                      {property.description && <p className="retailer-match-description">{property.description}</p>}
                      <div className="retailer-match-metrics">
                        <div>
                          <span>Monthly rent</span>
                          <strong>₹{property.monthlyRent.toLocaleString()}</strong>
                        </div>
                        <div>
                          <span>Area</span>
                          <strong>{property.areaSqFt.toLocaleString()} sq.ft.</strong>
                        </div>
                        <div>
                          <span>Parking</span>
                          <strong>{property.parking ? 'Available' : 'Unavailable'}</strong>
                        </div>
                        <div>
                          <span>Foot traffic</span>
                          <strong>{property.footTraffic}</strong>
                        </div>
                      </div>
                      <p className="retailer-match-reasons">{matchingReasons.join(' ')}</p>
                      <div className="detail-actions retailer-match-actions">
                        <Link to={`/properties/${property._id}`} className="btn btn-primary btn-small">View Property</Link>
                        <button type="button" className="btn btn-secondary btn-small" onClick={async () => {
                          try {
                            if (savedPropertyIds.includes(property._id)) {
                              await removeFavorite(property._id);
                              setSavedPropertyIds((current) => current.filter((id) => id !== property._id));
                              setSavedCount((count) => Math.max(0, count - 1));
                            } else {
                              await saveFavorite(property._id);
                              const latestFavorites = await getFavorites();
                              setSavedPropertyIds(latestFavorites.favorites.map((favorite) => favorite.property?._id).filter(Boolean));
                              setSavedCount(latestFavorites.favorites.length);
                            }
                          } catch (error) {
                            setDashboardError(error.message || 'Unable to save property.');
                          }
                        }}>{savedPropertyIds.includes(property._id) ? 'Saved' : 'Save Property'}</button>
                        <button type="button" className="btn btn-secondary btn-small" onClick={async () => {
                          if (contactedPropertyIds.includes(property._id)) {
                            setContactFeedback('You have already sent a request for this property.');
                            return;
                          }
                          try {
                            await createContactRequest(property._id, selectedRequirement?._id);
                            const latestRequests = await getContactRequests();
                            setContactRequestCount(latestRequests.requests.length);
                            setContactedPropertyIds(latestRequests.requests.map((request) => request.property?._id).filter(Boolean));
                            setDashboardError('');
                            setContactFeedback('Your contact request was sent to the representative.');
                          } catch (error) {
                            if (error.message?.includes('already sent')) {
                              setContactedPropertyIds((current) => [...current, property._id]);
                              setContactFeedback(error.message);
                            } else {
                              setDashboardError(error.message || 'Unable to contact representative.');
                            }
                          }
                        }} disabled={contactedPropertyIds.includes(property._id)}>{contactedPropertyIds.includes(property._id) ? 'Request Sent' : 'Contact Representative'}</button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
            {contactFeedback && <p className="auth-feedback auth-feedback-success" role="status">{contactFeedback} <Link to="/contact-requests">View requests</Link></p>}
            <div className="feature-card" style={{ marginTop: 18 }}>
              <div className="section-header" style={{ marginBottom: 14 }}>
                <h3 style={{ margin: 0 }}>Profile</h3>
                <Link to="/profile" className="link">View profile</Link>
              </div>
              <p>Your account information. Your password is securely protected and is never displayed.</p>
              {profile && <p><strong>{profile.name}</strong> · {profile.email} · Retailer</p>}
            </div>
            {dashboardError && <p className="auth-feedback auth-feedback-error" role="alert">{dashboardError} <Link to="/login">Sign in again</Link></p>}
          </main>
        </div>
      </div>
    </div>
  );
}

function CreateRequirementPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formValues, setFormValues] = useState({
    businessName: '',
    businessType: '',
    city: '',
    preferredArea: '',
    nearbyLandmark: '',
    propertyType: '',
    minAreaSqFt: '',
    maxAreaSqFt: '',
    minBudget: '',
    maxBudget: '',
    parkingRequired: '',
    preferredFootTraffic: 'Medium',
    additionalPreferences: '',
  });

  function updateField(event) {
    const { name, value } = event.currentTarget;
    setFormValues((current) => ({ ...current, [name]: value }));
    setErrorMessage('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage('');
    const requiredFields = [
      ['businessName', 'Business Name'],
      ['businessType', 'Business Type'],
      ['city', 'City'],
      ['propertyType', 'Property Type'],
      ['minAreaSqFt', 'Minimum Size'],
      ['maxAreaSqFt', 'Maximum Size'],
      ['minBudget', 'Minimum Budget'],
      ['maxBudget', 'Maximum Budget'],
      ['parkingRequired', 'Parking preference'],
      ['preferredFootTraffic', 'Preferred foot traffic'],
    ];
    const missingField = requiredFields.find(([field]) => !String(formValues[field]).trim());
    if (missingField) {
      setErrorMessage(`${missingField[1]} is required.`);
      return;
    }

    const minAreaSqFt = Number(formValues.minAreaSqFt);
    const maxAreaSqFt = Number(formValues.maxAreaSqFt);
    const minBudget = Number(formValues.minBudget);
    const maxBudget = Number(formValues.maxBudget);
    if (![minAreaSqFt, maxAreaSqFt, minBudget, maxBudget].every((value) => Number.isFinite(value) && value >= 0)) {
      setErrorMessage('Area and budget values must be valid non-negative numbers.');
      return;
    }
    if (minAreaSqFt > maxAreaSqFt) {
      setErrorMessage('Minimum size cannot be greater than maximum size.');
      return;
    }
    if (minBudget > maxBudget) {
      setErrorMessage('Minimum budget cannot be greater than maximum budget.');
      return;
    }

    const preferredLocation = [formValues.city, formValues.preferredArea, formValues.nearbyLandmark]
      .map((value) => value.trim())
      .filter(Boolean)
      .join(', ');
    setIsSubmitting(true);
    try {
      const result = await createRequirement({
        businessName: formValues.businessName.trim(),
        businessType: formValues.businessType,
        preferredLocation,
        nearbyLandmark: formValues.nearbyLandmark.trim(),
        propertyType: formValues.propertyType,
        minAreaSqFt,
        maxAreaSqFt,
        minBudget,
        maxBudget,
        parkingRequired: formValues.parkingRequired === 'true',
        preferredFootTraffic: formValues.preferredFootTraffic,
        additionalPreferences: formValues.additionalPreferences.trim(),
      });
      navigate('/retailer-dashboard', { replace: true, state: { requirementId: result.requirement._id } });
    } catch (error) {
      setErrorMessage(error.message || 'Unable to save your requirement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const locationSummary = [formValues.city, formValues.preferredArea, formValues.nearbyLandmark]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(', ');

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
                <input name="businessName" type="text" value={formValues.businessName} onChange={updateField} placeholder="Apex Retail Group" />
              </div>
              <div className="field">
                <label>Business Type</label>
                <select name="businessType" value={formValues.businessType} onChange={updateField}>
                  <option value="">Select business type</option>
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
                <input name="city" type="text" value={formValues.city} onChange={updateField} placeholder="Vijayawada" />
              </div>
              <div className="field">
                <label>Preferred Area</label>
                <input name="preferredArea" type="text" value={formValues.preferredArea} onChange={updateField} placeholder="Moghalrajpuram" />
              </div>
              <div className="field">
                <label>Nearby Landmark</label>
                <input name="nearbyLandmark" type="text" value={formValues.nearbyLandmark} onChange={updateField} placeholder="Near Benz Circle" />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="field">
                <label>Property Type</label>
                <select name="propertyType" value={formValues.propertyType} onChange={updateField}>
                  <option value="">Select property type</option>
                  <option>Retail</option>
                  <option>Office</option>
                  <option>Industrial</option>
                  <option>Mixed Use</option>
                </select>
              </div>

              <div className="field">
                <label>Minimum Size</label>
                <input name="minAreaSqFt" type="number" min="0" value={formValues.minAreaSqFt} onChange={updateField} placeholder="1000 sq.ft." />
              </div>
              <div className="field">
                <label>Maximum Size</label>
                <input name="maxAreaSqFt" type="number" min="0" value={formValues.maxAreaSqFt} onChange={updateField} placeholder="3000 sq.ft." />
              </div>
              <div className="field">
                <label>Minimum Budget</label>
                <input name="minBudget" type="number" min="0" value={formValues.minBudget} onChange={updateField} placeholder="₹50,000/month" />
              </div>
              <div className="field">
                <label>Maximum Budget</label>
                <input name="maxBudget" type="number" min="0" value={formValues.maxBudget} onChange={updateField} placeholder="₹1,00,000/month" />
              </div>
              <div className="field">
                <label>Parking</label>
                <select name="parkingRequired" value={formValues.parkingRequired} onChange={updateField}>
                  <option value="">Select parking preference</option>
                  <option value="true">Required</option>
                  <option value="false">Not required</option>
                </select>
              </div>
              <div className="field">
                <label>Preferred Foot Traffic</label>
                <select name="preferredFootTraffic" value={formValues.preferredFootTraffic} onChange={updateField}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

              <div className="field">
                <label>Additional Preferences</label>
                <textarea name="additionalPreferences" value={formValues.additionalPreferences} onChange={updateField} placeholder="Parking preferred, foot traffic, visibility..." />
              </div>
            </>
          )}

          {step === 4 && (
            <div className="feature-card">
              <h3 style={{ marginTop: 0 }}>Requirement summary</h3>
              <ul className="feature-list" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--locentra-text-soft)' }}>
                <li>Business: {formValues.businessName || 'Not provided'} ({formValues.businessType || 'Business type not selected'})</li>
                <li>Location: {locationSummary || 'Not provided'}</li>
                <li>Size: {formValues.minAreaSqFt || '—'}-{formValues.maxAreaSqFt || '—'} sq.ft.</li>
                <li>Budget: ₹{formValues.minBudget || '—'}-₹{formValues.maxBudget || '—'}/month</li>
                <li>Type: {formValues.propertyType || 'Not selected'}</li>
                <li>Parking: {formValues.parkingRequired === 'true' ? 'Required' : formValues.parkingRequired === 'false' ? 'Not required' : 'Not selected'}</li>
                <li>Foot traffic: {formValues.preferredFootTraffic}</li>
              </ul>
            </div>
          )}

          {errorMessage && <p className="auth-feedback auth-feedback-error" role="alert">{errorMessage} <Link to="/login">Sign in</Link></p>}
          <div className="row-between" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginTop: '18px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setStep((s) => Math.max(1, s - 1))}>Back</button>
            <button type="button" className="btn btn-primary" disabled={isSubmitting} onClick={step === 4 ? handleSubmit : () => setStep((s) => Math.min(4, s + 1))}>
              {isSubmitting ? 'Submitting...' : step === 4 ? 'Submit requirement' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SavedPropertiesPage() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let active = true;
    getFavorites()
      .then((result) => { if (active) setFavorites(result.favorites); })
      .catch((error) => { if (active) setErrorMessage(error.message || 'Unable to load saved properties.'); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  async function handleRemove(propertyId) {
    try {
      await removeFavorite(propertyId);
      setFavorites((current) => current.filter((favorite) => favorite.property?._id !== propertyId));
    } catch (error) {
      setErrorMessage(error.message || 'Unable to remove saved property.');
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <p className="eyebrow">Saved</p>
            <h1>Saved properties</h1>
          </div>
        </div>

        {isLoading && <p role="status">Loading saved properties...</p>}
        {errorMessage && <p className="auth-feedback auth-feedback-error" role="alert">{errorMessage}</p>}
        {!isLoading && !errorMessage && favorites.length === 0 && (
          <div className="properties-empty-state" role="status">
            <span><LandingIcon name="search" size={24} /></span>
            <h2>No saved properties yet</h2>
            <p>Save a property you like and it will appear here for easy access.</p>
            <Link className="btn btn-primary" to="/properties">Explore properties</Link>
          </div>
        )}
        {!isLoading && !errorMessage && favorites.length > 0 && <div className="property-grid">
          {favorites.map(({ _id, property }) => property && (
            <article className="property-card" key={_id}>
              <div className="property-visual" style={property.imageUrl ? { backgroundImage: `url("${property.imageUrl}")`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined} />
              <div className="property-body">
                <div className="property-head">
                  <div>
                    <h3>{property.title}</h3>
                    <p>{property.location}, {property.city}</p>
                  </div>
                </div>

                <div className="property-meta">
                  <span>{property.propertyType}</span>
                  <span>{property.areaSqFt.toLocaleString()} sq.ft.</span>
                  <span>₹{property.monthlyRent.toLocaleString()}/month</span>
                </div>

                <div className="property-footer">
                  <span className="status-pill">Saved</span>
                  <div className="detail-actions">
                    <Link to={`/properties/${property._id}`} className="btn btn-secondary btn-small">View Details</Link>
                    <button type="button" className="btn btn-secondary btn-small" onClick={() => handleRemove(property._id)}>Remove</button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>}
      </div>
    </div>
  );
}

function ContactRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let active = true;
    getContactRequests()
      .then((result) => { if (active) setRequests(result.requests); })
      .catch((error) => { if (active) setErrorMessage(error.message || 'Unable to load contact requests.'); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <p className="eyebrow">Inbox</p>
            <h1>Contact requests</h1>
          </div>
        </div>

        {isLoading && <p role="status">Loading your contact requests...</p>}
        {errorMessage && <p className="auth-feedback auth-feedback-error" role="alert">{errorMessage} <Link to="/login">Sign in</Link></p>}
        {!isLoading && !errorMessage && requests.length === 0 && (
          <div className="properties-empty-state" role="status">
            <span><LandingIcon name="people" size={24} /></span>
            <h2>No contact requests yet</h2>
            <p>When you contact a property representative, your request and its status will appear here.</p>
          </div>
        )}
        {!isLoading && !errorMessage && requests.length > 0 && <div className="content-panel">
          <div className="list-stack">
            {requests.map((request) => (
              <div className="list-row" key={request._id}>
                <div>
                  <strong>{request.property?.title || 'Property no longer available'}</strong>
                  <small>{request.representative?.name || 'Representative'} · {request.property?.location}, {request.property?.city}</small>
                </div>
                <span className="label">{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span>
                <small>{new Date(request.createdAt).toLocaleDateString()}</small>
              </div>
            ))}
          </div>
        </div>}
      </div>
    </div>
  );
}

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let active = true;
    getProfile()
      .then((result) => { if (active) setProfile(result.user); })
      .catch((error) => { if (active) setErrorMessage(error.message || 'Unable to load your profile.'); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header"><div><p className="eyebrow">Account</p><h1>Profile</h1></div></div>
        <div className="content-panel">
          {isLoading && <p role="status">Loading your profile...</p>}
          {errorMessage && <p className="auth-feedback auth-feedback-error" role="alert">{errorMessage} <Link to="/login">Sign in</Link></p>}
          {profile && <>
            <div className="list-stack">
              <div className="list-row"><strong>Name</strong><span>{profile.name}</span></div>
              <div className="list-row"><strong>Email</strong><span>{profile.email}</span></div>
              <div className="list-row"><strong>Role</strong><span>{profile.role === 'retailer' ? 'Retailer' : 'Tenant Representative'}</span></div>
            </div>
            <p>Your password is securely protected and is never displayed in your profile.</p>
          </>}
        </div>
      </div>
    </div>
  );
}

function RepresentativeDashboardPage() {
  const [profile, setProfile] = useState(null);
  const [properties, setProperties] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([getProfile(), getMyProperties(), getReceivedContactRequests()])
      .then(([profileResult, propertyResult, requestResult]) => {
        if (!active) return;
        setProfile(profileResult.user);
        setProperties(propertyResult.properties);
        setRequests(requestResult.requests);
      })
      .catch((error) => {
        if (active) setErrorMessage(error.message || 'Unable to load your representative dashboard.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, []);

  const pendingRequests = requests.filter((request) => request.status === 'pending').length;
  const completedRequests = requests.filter((request) => request.status === 'completed').length;

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
              <NavLink to="/profile" className="side-link">Profile</NavLink>
            </div>
          </aside>

          <main className="content-panel">
            <div className="page-header">
              <div>
                <p className="eyebrow">Welcome back</p>
                <h1>{profile?.name || 'Representative dashboard'}</h1>
              </div>
            </div>

            {isLoading && <p role="status">Loading your properties and contact requests...</p>}
            {errorMessage && <p className="auth-feedback auth-feedback-error" role="alert">{errorMessage} <Link to="/login">Sign in</Link></p>}

            <div className="stats-row">
              <div className="stat-card">
                <span>Published Properties</span>
                <strong>{properties.length}</strong>
                <small>Your active marketplace listings</small>
              </div>
              <div className="stat-card">
                <span>Contact Requests</span>
                <strong>{requests.length}</strong>
                <small>Retailers interested in your listings</small>
              </div>
              <div className="stat-card">
                <span>Pending Requests</span>
                <strong>{pendingRequests}</strong>
                <small>Awaiting your follow-up</small>
              </div>
              <div className="stat-card">
                <span>Completed Requests</span>
                <strong>{completedRequests}</strong>
                <small>Marked completed</small>
              </div>
            </div>

            <div className="two-col">
              <div className="feature-card">
                <div className="section-header" style={{ marginBottom: 14 }}>
                  <h3 style={{ margin: 0 }}>Recent leads</h3>
                  <Link to="/leads" className="link">Open</Link>
                </div>

                {requests.length > 0 ? <div className="list-stack">
                  {requests.slice(0, 3).map((request) => (
                    <div className="list-row" key={request._id}>
                      <div>
                        <strong>{request.retailer?.name || 'Retailer'}</strong>
                        <small>{request.property?.title || 'Property'} · {request.property?.city || 'Location unavailable'}</small>
                      </div>
                      <span className="label">{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span>
                    </div>
                  ))}
                </div> : <p>No retailers have contacted you yet. Published listings and incoming requests will appear here.</p>}
              </div>

              <div className="feature-card">
                <div className="section-header" style={{ marginBottom: 14 }}>
                  <h3 style={{ margin: 0 }}>Grow your Locentra portfolio</h3>
                </div>
                <p>Publish accurate commercial property details so retailers can discover your listings and send you a contact request.</p>
                <Link to="/add-property" className="btn btn-primary">Add a property</Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function AddPropertyPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formValues, setFormValues] = useState({
    title: '',
    propertyType: 'Retail',
    description: '',
    city: '',
    area: '',
    address: '',
    landmark: '',
    areaSqFt: '',
    monthlyRent: '',
    parking: '',
    footTraffic: 'High',
  });

  function updateField(event) {
    const { name, value } = event.currentTarget;
    setFormValues((current) => ({ ...current, [name]: value }));
    setErrorMessage('');
  }

  async function handlePublish() {
    const requiredFields = [
      ['title', 'Property Name'],
      ['propertyType', 'Property Type'],
      ['city', 'City'],
      ['area', 'Area'],
      ['areaSqFt', 'Size'],
      ['monthlyRent', 'Monthly Rent'],
      ['parking', 'Parking'],
      ['footTraffic', 'Foot Traffic'],
    ];
    const missing = requiredFields.find(([key]) => !String(formValues[key]).trim());
    if (missing) {
      setErrorMessage(`${missing[1]} is required.`);
      return;
    }

    const areaSqFt = Number(formValues.areaSqFt);
    const monthlyRent = Number(formValues.monthlyRent);
    if (!Number.isFinite(areaSqFt) || areaSqFt <= 0 || !Number.isFinite(monthlyRent) || monthlyRent < 0) {
      setErrorMessage('Enter a valid property size and monthly rent.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const result = await createProperty({
        title: formValues.title.trim(),
        propertyType: formValues.propertyType,
        location: [formValues.area, formValues.address, formValues.landmark].map((part) => part.trim()).filter(Boolean).join(', '),
        city: formValues.city.trim(),
        areaSqFt,
        monthlyRent,
        parking: formValues.parking !== 'Not Available',
        footTraffic: formValues.footTraffic,
        description: formValues.description.trim(),
      });
      navigate(`/properties/${result.property._id}`, { replace: true });
    } catch (error) {
      setErrorMessage(error.message || 'Unable to publish this property.');
    } finally {
      setIsSubmitting(false);
    }
  }

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
                <input name="title" value={formValues.title} onChange={updateField} type="text" placeholder="Prime Street Retail" />
              </div>
              <div className="field">
                <label>Property Type</label>
                <select name="propertyType" value={formValues.propertyType} onChange={updateField}>
                  <option>Retail</option>
                  <option>Industrial</option>
                  <option>Office</option>
                  <option>Shopping Center</option>
                </select>
              </div>
              <div className="field">
                <label>Description</label>
                <textarea name="description" value={formValues.description} onChange={updateField} placeholder="High-visibility retail property with strong footfall." />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="field">
                <label>City</label>
                <input name="city" value={formValues.city} onChange={updateField} type="text" placeholder="Vijayawada" />
              </div>
              <div className="field">
                <label>Area</label>
                <input name="area" value={formValues.area} onChange={updateField} type="text" placeholder="Moghalrajpuram" />
              </div>
              <div className="field">
                <label>Address</label>
                <input name="address" value={formValues.address} onChange={updateField} type="text" placeholder="12, MG Road" />
              </div>
              <div className="field">
                <label>Landmark</label>
                <input name="landmark" value={formValues.landmark} onChange={updateField} type="text" placeholder="Near Benz Circle" />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="field">
                <label>Size</label>
                <input name="areaSqFt" value={formValues.areaSqFt} onChange={updateField} type="number" min="1" placeholder="3200 sq.ft." />
              </div>
              <div className="field">
                <label>Monthly Rent</label>
                <input name="monthlyRent" value={formValues.monthlyRent} onChange={updateField} type="number" min="0" placeholder="₹1,80,000/month" />
              </div>
              <div className="field">
                <label>Parking</label>
                <select name="parking" value={formValues.parking} onChange={updateField}>
                  <option value="">Select availability</option>
                  <option>Available</option>
                  <option>Limited</option>
                  <option>Not Available</option>
                </select>
              </div>
              <div className="field">
                <label>Foot Traffic</label>
                <select name="footTraffic" value={formValues.footTraffic} onChange={updateField}>
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
                <li>Property Name: {formValues.title || 'Not provided'}</li>
                <li>Location: {[formValues.area, formValues.address, formValues.landmark, formValues.city].filter(Boolean).join(', ') || 'Not provided'}</li>
                <li>Size: {formValues.areaSqFt || '—'} sq.ft.</li>
                <li>Rent: ₹{formValues.monthlyRent || '—'}/month</li>
                <li>Representative: Your account</li>
              </ul>
            </div>
          )}

          {errorMessage && <p className="auth-feedback auth-feedback-error" role="alert">{errorMessage}</p>}
          <div className="row-between" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginTop: '18px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setStep((s) => Math.max(1, s - 1))}>Back</button>
            <button type="button" className="btn btn-primary" disabled={isSubmitting} onClick={step === 4 ? handlePublish : () => setStep((s) => Math.min(4, s + 1))}>
              {isSubmitting ? 'Publishing...' : step === 4 ? 'Publish property' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MyPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let active = true;
    getMyProperties()
      .then((result) => { if (active) setProperties(result.properties); })
      .catch((error) => { if (active) setErrorMessage(error.message || 'Unable to load your properties.'); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <p className="eyebrow">Portfolio</p>
            <h1>My properties</h1>
          </div>
        </div>

        {isLoading && <p role="status">Loading your properties...</p>}
        {errorMessage && <p className="auth-feedback auth-feedback-error" role="alert">{errorMessage} <Link to="/login">Sign in</Link></p>}
        {!isLoading && !errorMessage && properties.length === 0 && <div className="properties-empty-state" role="status">
          <span><LandingIcon name="building" size={24} /></span>
          <h2>You have not published any properties yet</h2>
          <p>Properties you publish as a tenant representative will appear here and in the Locentra marketplace.</p>
          <Link to="/add-property" className="btn btn-primary">Add a property</Link>
        </div>}
        {!isLoading && !errorMessage && properties.length > 0 && <div className="property-grid">
          {properties.map((property) => (
            <article className="property-card" key={property._id}>
              <div className="property-visual" style={property.imageUrl ? { backgroundImage: `url("${property.imageUrl}")`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined} />
              <div className="property-body">
                <div className="property-head"><div><h3>{property.title}</h3><p>{property.location}, {property.city}</p></div></div>
                <div className="property-meta">
                  <span>{property.propertyType}</span>
                  <span>{property.areaSqFt.toLocaleString()} sq.ft.</span>
                  <span>₹{property.monthlyRent.toLocaleString()}/month</span>
                </div>
                <div className="property-footer"><span className="status-pill">Published</span><Link to={`/properties/${property._id}`} className="link">View Details</Link></div>
              </div>
            </article>
          ))}
        </div>}
      </div>
    </div>
  );
}

function LeadsPage() {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let active = true;
    getReceivedContactRequests()
      .then((result) => { if (active) setRequests(result.requests); })
      .catch((error) => { if (active) setErrorMessage(error.message || 'Unable to load retailer requests.'); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <p className="eyebrow">Pipeline</p>
            <h1>Leads</h1>
          </div>
        </div>

        {isLoading && <p role="status">Loading retailer requests...</p>}
        {errorMessage && <p className="auth-feedback auth-feedback-error" role="alert">{errorMessage} <Link to="/login">Sign in</Link></p>}
        {!isLoading && !errorMessage && requests.length === 0 && <div className="properties-empty-state" role="status">
          <span><LandingIcon name="people" size={24} /></span>
          <h2>No retailer requests yet</h2>
          <p>When a retailer contacts you about one of your published properties, the request will appear here.</p>
          <Link to="/my-properties" className="btn btn-secondary">View your properties</Link>
        </div>}
        {!isLoading && !errorMessage && requests.length > 0 && <div className="content-panel">
          <div className="list-stack">
            {requests.map((request) => (
              <div className="list-row" key={request._id}>
                <div>
                  <strong>{request.retailer?.name || 'Retailer'}</strong>
                  <small>{request.property?.title || 'Property no longer available'} · {request.property?.location}, {request.property?.city}</small>
                </div>
                <span className="label">{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span>
                <small>{new Date(request.createdAt).toLocaleDateString()}</small>
              </div>
            ))}
          </div>
        </div>}
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
        <Route path="/profile" element={<ProfilePage />} />
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
