import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, NavLink, Navigate, useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  checkBackendHealth,
  clearAuthentication,
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
  getRequirementMatchesSummary,
  getAuthenticatedRole,
  loginAccount,
  removeFavorite,
  saveFavorite,
  registerAccount,
} from './services/api';


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
  const location = useLocation();
  const [role, setRole] = useState(getAuthenticatedRole);

  useEffect(() => {
    function syncRole() {
      setRole(getAuthenticatedRole());
    }

    syncRole();
    window.addEventListener('storage', syncRole);
    window.addEventListener('locentra-auth-change', syncRole);
    return () => {
      window.removeEventListener('storage', syncRole);
      window.removeEventListener('locentra-auth-change', syncRole);
    };
  }, [location.pathname]);

  const dashboardPath = role === 'tenantRepresentative'
    ? '/representative/dashboard'
    : role === 'retailer' ? '/retailer-dashboard' : null;

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Logo />

        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/properties">Properties</NavLink>
          <NavLink to="/how-it-works">How It Works</NavLink>
          <NavLink to="/about">About</NavLink>
          {dashboardPath && <NavLink to={dashboardPath} end>Dashboard</NavLink>}
        </nav>

        <div className="nav-actions">
          <Link to="/login" className="btn btn-secondary">Login</Link>
          <Link to="/register" className="btn btn-primary">Get Started</Link>
        </div>
      </div>
    </header>
  );
}

function RequireRole({ roles, children }) {
  const [role, setRole] = useState(getAuthenticatedRole);

  useEffect(() => {
    function syncRole() {
      setRole(getAuthenticatedRole());
    }

    window.addEventListener('storage', syncRole);
    window.addEventListener('locentra-auth-change', syncRole);
    return () => {
      window.removeEventListener('storage', syncRole);
      window.removeEventListener('locentra-auth-change', syncRole);
    };
  }, []);

  if (!role) return <Navigate to="/login" replace />;
  if (!roles.includes(role)) {
    return (
      <Navigate
        to={role === 'tenantRepresentative' ? '/representative/dashboard' : '/retailer-dashboard'}
        replace
      />
    );
  }

  return children;
}

function LogoutButton() {
  const navigate = useNavigate();

  function handleLogout() {
    clearAuthentication();
    navigate('/login', { replace: true, state: { loggedOut: true } });
  }

  return (
    <button className="side-link side-logout" type="button" onClick={handleLogout}>
      Logout
    </button>
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
              <div className="home-window-header"><span className="home-window-brand"><b>L</b> Locentra</span><span className="home-window-status"><i /> PREVIEW ONLY</span></div>
              <div className="home-window-title"><span>Let's find your next space</span><small>Tell us what you have in mind</small></div>
              <div className="home-form-row"><span><small>PROPERTY TYPE</small><strong>Retail space</strong></span><span><small>LOCATION</small><strong>Choose an area</strong></span></div>
              <div className="home-form-row"><span><small>SPACE NEEDED</small><strong>e.g. 2,000 sq.ft.</strong></span><span><small>MONTHLY BUDGET</small><strong>Set your range</strong></span></div>
              <Link to="/register" className="home-form-submit">Create an account to build a search <LandingIcon name="arrow" size={15} /></Link>
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
                  style={property.imageUrl && !isPlaceholderPropertyImage(property.imageUrl) ? {
                    backgroundImage: `linear-gradient(180deg, rgba(17,44,57,.02), rgba(17,44,57,.2)), url("${property.imageUrl}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  } : undefined}
                >
                  <span className="home-property-pill">{property.propertyType}</span>
                  {(!property.imageUrl || isPlaceholderPropertyImage(property.imageUrl)) && <>
                    <span className="home-scene-sun" />
                    <span className="home-scene-building"><i /><i /><i /><i /><i /><i /><i /><i /><i /></span>
                    <span className="home-scene-foreground" />
                  </>}
                  <span className="home-scene-label">{!property.imageUrl || isPlaceholderPropertyImage(property.imageUrl) ? 'ILLUSTRATIVE PREVIEW' : 'LOCENTRA'} <i>·</i> {property.city.toUpperCase()}</span>
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    function clearLoginFields() {
      setEmail('');
      setPassword('');
    }

    clearLoginFields();
    window.addEventListener('locentra-auth-change', clearLoginFields);
    return () => window.removeEventListener('locentra-auth-change', clearLoginFields);
  }, [location.key, location.state?.loggedOut]);

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
      navigate(result.user.role === 'tenantRepresentative' ? '/representative/dashboard' : '/retailer-dashboard');
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
          <form className="auth-card login-auth-card" autoComplete="off" onSubmit={handleSubmit}>
            {location.state?.registrationSuccess && <p className="auth-feedback auth-feedback-success" role="status">{location.state.registrationSuccess}</p>}
            <div className="field">
              <label htmlFor="login-email">Email address</label>
              <input id="login-email" name="email" type="email" autoComplete="off" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.currentTarget.value)} required />
            </div>
            <div className="field">
              <label htmlFor="login-password">Password</label>
              <div className="auth-password-wrap">
                <input id="login-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="off" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.currentTarget.value)} required />
                <button type="button" className="auth-password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((shown) => !shown)}>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <div className="login-form-options">
              <label><input name="remember" type="checkbox" /> Remember me</label>
              <span className="login-recovery-note">Password recovery is not available yet.</span>
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
        company: formData.get('company'),
        phone: formData.get('phone'),
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

const PROPERTY_CATEGORIES = [
  'All',
  'Retail',
  'Office',
  'Warehouse',
  'Industrial',
  'Shopping Center',
  'Land',
  'Mixed Use',
  'Other',
];

function formatPropertyNumber(value) {
  if (value === null || value === undefined || value === '') return 'Not provided';
  const number = Number(value);
  return Number.isFinite(number) ? number.toLocaleString() : 'Not provided';
}

function isPlaceholderPropertyImage(imageUrl) {
  if (typeof imageUrl !== 'string' || !imageUrl.trim()) return false;
  try {
    return ['placehold.co', 'placehold.it'].includes(new URL(imageUrl).hostname.toLowerCase());
  } catch {
    return false;
  }
}

function PropertyImage({ imageUrl, title, className }) {
  const [hasFailed, setHasFailed] = useState(false);

  if (!imageUrl || isPlaceholderPropertyImage(imageUrl) || hasFailed) {
    return (
      <div className={`${className} property-image-fallback`} role="img" aria-label={`Image unavailable for ${title || 'this property'}`}>
        <LandingIcon name="building" size={30} />
        <span>Image unavailable</span>
      </div>
    );
  }

  return (
    <img
      className={className}
      src={imageUrl}
      alt={`${title || 'Property'} image`}
      loading="lazy"
      decoding="async"
      onError={() => setHasFailed(true)}
    />
  );
}

function PropertiesPage() {
  const [activeType, setActiveType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [minimumBudget, setMinimumBudget] = useState('');
  const [maximumBudget, setMaximumBudget] = useState('');
  const [minimumArea, setMinimumArea] = useState('');
  const [maximumArea, setMaximumArea] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [listingState, setListingState] = useState({ status: 'loading', properties: [] });
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;
    getProperties()
      .then((result) => {
        if (active) setListingState({ status: 'success', properties: result.properties || [] });
      })
      .catch(() => {
        if (active) setListingState({ status: 'error', properties: [] });
      });
    return () => { active = false; };
  }, [retryCount]);

  const normalizedSearch = searchTerm.trim().toLocaleLowerCase();
  const normalizedCategory = activeType.toLocaleLowerCase().replace(/\s+/g, '');
  function isWithinRange(value, minimum, maximum) {
    if (minimum === '' && maximum === '') return true;
    if (value === null || value === undefined || value === '') return false;
    const number = Number(value);
    if (!Number.isFinite(number)) return false;
    return (minimum === '' || number >= Number(minimum))
      && (maximum === '' || number <= Number(maximum));
  }

  const visibleProperties = listingState.properties
    .filter((property) => (
      (activeType === 'All'
        || String(property.propertyType || '').toLocaleLowerCase().replace(/\s+/g, '') === normalizedCategory)
      && (!normalizedSearch || [
        property.title,
        property.location,
        property.city,
        property.propertyType,
      ].filter(Boolean).join(' ').toLocaleLowerCase().includes(normalizedSearch))
      && isWithinRange(property.monthlyRent, minimumBudget, maximumBudget)
      && isWithinRange(property.areaSqFt, minimumArea, maximumArea)
    ))
    .sort((left, right) => {
      if (sortOrder === 'price-ascending') {
        const leftPrice = Number(left.monthlyRent);
        const rightPrice = Number(right.monthlyRent);
        const hasLeftPrice = left.monthlyRent !== null && left.monthlyRent !== undefined && left.monthlyRent !== '' && Number.isFinite(leftPrice);
        const hasRightPrice = right.monthlyRent !== null && right.monthlyRent !== undefined && right.monthlyRent !== '' && Number.isFinite(rightPrice);
        if (hasLeftPrice !== hasRightPrice) return hasLeftPrice ? -1 : 1;
        if (hasLeftPrice) return leftPrice - rightPrice;
        return 0;
      }
      if (sortOrder === 'price-descending') {
        const leftPrice = Number(left.monthlyRent);
        const rightPrice = Number(right.monthlyRent);
        const hasLeftPrice = left.monthlyRent !== null && left.monthlyRent !== undefined && left.monthlyRent !== '' && Number.isFinite(leftPrice);
        const hasRightPrice = right.monthlyRent !== null && right.monthlyRent !== undefined && right.monthlyRent !== '' && Number.isFinite(rightPrice);
        if (hasLeftPrice !== hasRightPrice) return hasLeftPrice ? -1 : 1;
        if (hasLeftPrice) return rightPrice - leftPrice;
        return 0;
      }
      return new Date(right.createdAt || 0).getTime() - new Date(left.createdAt || 0).getTime();
    });
  const isLoading = listingState.status === 'loading';
  const hasError = listingState.status === 'error';
  const hasActiveFilters = activeType !== 'All'
    || Boolean(normalizedSearch || minimumBudget || maximumBudget || minimumArea || maximumArea);

  function clearFilters() {
    setActiveType('All');
    setSearchTerm('');
    setMinimumBudget('');
    setMaximumBudget('');
    setMinimumArea('');
    setMaximumArea('');
  }

  return (
    <main className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <p className="eyebrow">Discover</p>
            <h1>Find your next location</h1>
          </div>
        </div>

        <div className="property-controls">
          <div className="property-search">
            <label htmlFor="property-search">Search listings</label>
            <div className="property-search-input">
              <LandingIcon name="search" size={19} />
              <input
                id="property-search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Name, location, city, or category"
                autoComplete="off"
              />
              {searchTerm && (
                <button type="button" onClick={() => setSearchTerm('')} aria-label="Clear property search">
                  Clear
                </button>
              )}
            </div>
          </div>
          <div className="property-sort">
            <label htmlFor="property-sort">Sort by</label>
            <select id="property-sort" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
              <option value="newest">Newest first</option>
              <option value="price-ascending">Price: low to high</option>
              <option value="price-descending">Price: high to low</option>
            </select>
          </div>
        </div>

        <div className="property-filter-ranges">
          <fieldset className="property-range-group">
            <legend>Monthly budget (₹)</legend>
            <div className="property-range-inputs">
              <input
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                aria-label="Minimum monthly budget"
                placeholder="Min"
                value={minimumBudget}
                onChange={(event) => setMinimumBudget(event.target.value)}
              />
              <input
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                aria-label="Maximum monthly budget"
                placeholder="Max"
                value={maximumBudget}
                onChange={(event) => setMaximumBudget(event.target.value)}
              />
            </div>
          </fieldset>
          <fieldset className="property-range-group">
            <legend>Area (sq.ft.)</legend>
            <div className="property-range-inputs">
              <input
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                aria-label="Minimum area in square feet"
                placeholder="Min"
                value={minimumArea}
                onChange={(event) => setMinimumArea(event.target.value)}
              />
              <input
                type="number"
                min="0"
                step="any"
                inputMode="decimal"
                aria-label="Maximum area in square feet"
                placeholder="Max"
                value={maximumArea}
                onChange={(event) => setMaximumArea(event.target.value)}
              />
            </div>
          </fieldset>
        </div>

        <div className="filter-bar" role="group" aria-label="Filter properties by category">
          {PROPERTY_CATEGORIES.map((filter) => (
            <button
              key={filter}
              className={`chip${activeType === filter ? ' active' : ''}`}
              type="button"
              aria-pressed={activeType === filter}
              onClick={() => setActiveType(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {isLoading && <p className="property-listing-message" role="status">Loading properties...</p>}
        {hasError && (
          <div className="property-listing-error" role="alert">
            <p>Properties could not be loaded right now. Please check your connection and try again.</p>
            <button className="btn btn-secondary" type="button" onClick={() => {
              setListingState({ status: 'loading', properties: [] });
              setRetryCount((count) => count + 1);
            }}>Retry</button>
          </div>
        )}
        {!isLoading && !hasError && (
          <>
            <p className="property-result-count" aria-live="polite" role="status">
              {visibleProperties.length} {visibleProperties.length === 1 ? 'property' : 'properties'} found
              {activeType !== 'All' ? ` in ${activeType}` : ''}
              {normalizedSearch ? ` for “${searchTerm.trim()}”` : ''}
            </p>
            {visibleProperties.length > 0 ? (
              <div className="property-grid">
                {visibleProperties.map((property) => (
                  <article className="property-card" key={property._id}>
                    <Link to={`/properties/${property._id}`} className="property-card-link" aria-label={`View details for ${property.title || 'property'}`}>
                    <div className="property-visual">
                      <PropertyImage imageUrl={property.imageUrl} title={property.title} className="property-visual-image" />
                    </div>
                    <div className="property-body">
                      <div className="property-head">
                        <div>
                          <h2>{property.title || 'Untitled property'}</h2>
                          <p>{[property.location, property.city].filter(Boolean).join(', ') || 'Location not provided'}</p>
                        </div>
                      </div>

                      <div className="property-meta">
                        <span>{property.propertyType || 'Category not provided'}</span>
                        <span>{formatPropertyNumber(property.areaSqFt)} sq.ft.</span>
                        <span>{property.monthlyRent === null || property.monthlyRent === undefined || property.monthlyRent === '' ? 'Rent not provided' : `₹${formatPropertyNumber(property.monthlyRent)}/month`}</span>
                      </div>

                      <div className="property-footer">
                        {property.footTraffic
                          ? <span className="status-pill">{property.footTraffic} foot traffic</span>
                          : <span className="property-detail-unavailable">Foot traffic not provided</span>}
                        <span className="link">View Details</span>
                      </div>
                    </div>
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className="properties-empty-state" role="status">
                <span><LandingIcon name="search" size={24} /></span>
                <h2>No properties found</h2>
                <p>
                  {hasActiveFilters
                    ? 'Try adjusting or clearing your filters to see more listings.'
                    : `There are no ${activeType === 'All' ? 'property' : activeType.toLowerCase()} listings published yet.`}
                </p>
                {hasActiveFilters
                  ? <button className="btn btn-secondary" type="button" onClick={clearFilters}>Clear filters</button>
                  : <Link className="link" to="/login">Are you a tenant representative? Sign in to publish a listing.</Link>}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

function PropertyDetailsPage() {
  const { id } = useParams();
  const [propertyState, setPropertyState] = useState({ id: null, property: null });
  const [retryCount, setRetryCount] = useState(0);
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
      .catch((error) => {
        if (!active) return;
        const message = error.message?.toLowerCase().includes('property not found')
          ? 'This property is no longer available.'
          : 'Property details could not be loaded. Please try again.';
        setLoadError({ id, message });
      });
    return () => { active = false; };
  }, [id, retryCount]);

  useEffect(() => {
      if (property) {
        setPageMetadata(`${property.title || 'Property Details'} | Locentra`, `Explore ${property.title || 'this property'} in ${[property.location, property.city].filter(Boolean).join(', ') || 'a commercial location'}. Review the property details and contact its representative.`);
      }
  }, [property]);

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
        {isLoading && <p className="property-listing-message" role="status">Loading property details...</p>}
        {!isLoading && currentLoadError && !property && (
          <div className="property-listing-error" role="alert">
            <p>{currentLoadError}</p>
            <button className="btn btn-secondary" type="button" onClick={() => {
              setLoadError({ id: null, message: '' });
              setRetryCount((count) => count + 1);
            }}>Retry</button>
          </div>
        )}
        {property && <>
        <div className="detail-layout">
          <div className="detail-gallery">
            <PropertyImage key={property._id} imageUrl={property.imageUrl} title={property.title} className="detail-gallery-image" />
          </div>

          <div className="detail-card">
            <p className="eyebrow">{property.propertyType || 'Property category'}</p>
            <h1>{property.title || 'Property details'}</h1>
            <p>{[property.location, property.city].filter(Boolean).join(', ') || 'Location not provided'}</p>

            <div className="detail-metrics">
              <div className="metric-box">
                <strong>{formatPropertyNumber(property.areaSqFt)} sq.ft.</strong>
                <span>Size</span>
              </div>
              <div className="metric-box">
                <strong>{property.monthlyRent === null || property.monthlyRent === undefined || property.monthlyRent === '' ? 'Rent not provided' : `₹${formatPropertyNumber(property.monthlyRent)}/month`}</strong>
                <span>Rent</span>
              </div>
              <div className="metric-box">
                <strong>{property.footTraffic || 'Not provided'}</strong>
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
                <li>Parking: {property.parking === undefined || property.parking === null ? 'Not provided' : property.parking ? 'Available' : 'Not available'}</li>
                <li>Foot traffic: {property.footTraffic || 'Not provided'}</li>
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
  const navigate = useNavigate();
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
  const [isAuthorized, setIsAuthorized] = useState(false);
  const matchRequestId = useRef(0);
  const requestedRequirementId = location.state?.requirementId;

  useEffect(() => {
    let active = true;
    const requestId = ++matchRequestId.current;

    async function loadRequirements() {
      setRequirementsLoading(true);
      setDashboardError('');
      try {
        const profileResult = await getProfile();
        if (!active) return;
        if (profileResult.user.role !== 'retailer') {
          navigate('/representative/dashboard', { replace: true });
          return;
        }
        setIsAuthorized(true);

        const [matchResult, favoritesResult, contactsResult] = await Promise.all([
          getRequirementMatchesSummary(requestedRequirementId),
          getFavorites(),
          getContactRequests(),
        ]);
        if (!active) return;
        setRequirements(matchResult.requirements);
        setSavedCount(favoritesResult.favorites.length);
        setSavedPropertyIds(favoritesResult.favorites.map((favorite) => favorite.property?._id).filter(Boolean));
        setContactRequestCount(contactsResult.requests.length);
        setContactedPropertyIds(contactsResult.requests.map((request) => request.property?._id).filter(Boolean));
        setProfile(profileResult.user);
        const target = matchResult.requirements.find((item) => item._id === requestedRequirementId)
          || matchResult.requirements[0];
        setSelectedRequirement(target || null);
        if (target) {
          setMatchesLoading(true);
          if (matchRequestId.current === requestId) {
            setMatches(matchResult.matches);
            setMatchCount(matchResult.matchCount);
          }
        } else {
          if (matchRequestId.current === requestId) {
            setMatches([]);
            setMatchCount(0);
          }
        }
      } catch (error) {
        if (active && /please sign in|session is invalid|session has expired|account could not be found/i.test(error.message || '')) {
          navigate('/login', { replace: true });
          return;
        }
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
  }, [navigate, requestedRequirementId]);

  async function showRequirementMatches(requirement) {
    const requestId = ++matchRequestId.current;
    setSelectedRequirement(requirement);
    setMatches([]);
    setDashboardError('');
    setMatchesLoading(true);
    try {
      const result = await getRequirementMatches(requirement._id);
      if (matchRequestId.current === requestId) setMatches(result.matches);
    } catch (error) {
      if (matchRequestId.current === requestId) {
        if (/please sign in|session is invalid|session has expired|account could not be found/i.test(error.message || '')) {
          navigate('/login', { replace: true });
          return;
        }
        setDashboardError(error.message || 'Unable to load matching properties.');
      }
    } finally {
      if (matchRequestId.current === requestId) setMatchesLoading(false);
    }
  }

  if (!isAuthorized || requirementsLoading) {
    return (
      <main className="page">
        <div className="container">
          <p role="status">Verifying retailer access and loading your dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="dashboard-grid">
          <aside className="sidebar">
            <h3>Retailer</h3>
            <div className="side-nav">
              <NavLink to="/retailer-dashboard" end className={({ isActive }) => `side-link${isActive ? ' active' : ''}`}>Dashboard</NavLink>
              <NavLink to="/create-requirement" className="side-link">My Requirements</NavLink>
              <NavLink to="/properties" className="side-link">Find Properties</NavLink>
              <NavLink to="/saved" className="side-link">Saved Properties</NavLink>
              <NavLink to="/contact-requests" className="side-link">Contact Requests</NavLink>
              <NavLink to="/profile" className="side-link">Profile</NavLink>
              <LogoutButton />
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
                          <strong>{property.monthlyRent === null || property.monthlyRent === undefined || property.monthlyRent === '' ? 'Not provided' : `₹${formatPropertyNumber(property.monthlyRent)}`}</strong>
                        </div>
                        <div>
                          <span>Area</span>
                          <strong>{property.areaSqFt === null || property.areaSqFt === undefined || property.areaSqFt === '' ? 'Not provided' : `${formatPropertyNumber(property.areaSqFt)} sq.ft.`}</strong>
                        </div>
                        <div>
                          <span>Parking</span>
                          <strong>{property.parking === null || property.parking === undefined ? 'Not provided' : property.parking ? 'Available' : 'Unavailable'}</strong>
                        </div>
                        <div>
                          <span>Foot traffic</span>
                          <strong>{property.footTraffic || 'Not provided'}</strong>
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
            {dashboardError && <p className="auth-feedback auth-feedback-error" role="alert">{dashboardError} {/please sign in|session is invalid|session has expired|account could not be found/i.test(dashboardError) && <Link to="/login">Sign in again</Link>}</p>}
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
                  {PROPERTY_CATEGORIES.filter((category) => category !== 'All').map((category) => (
                    <option key={category}>{category}</option>
                  ))}
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
  const [removingPropertyId, setRemovingPropertyId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    let active = true;
    getFavorites()
      .then((result) => { if (active) setFavorites(result.favorites); })
      .catch((error) => { if (active) setErrorMessage(error.message || 'Unable to load saved properties.'); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, []);

  async function handleRemove(propertyId) {
    setRemovingPropertyId(propertyId);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      await removeFavorite(propertyId);
      setFavorites((current) => current.filter((favorite) => favorite.property?._id !== propertyId));
      setSuccessMessage('Property removed from your saved list.');
    } catch (error) {
      setErrorMessage(error.message || 'Unable to remove saved property.');
    } finally {
      setRemovingPropertyId(null);
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
        {successMessage && <p className="auth-feedback auth-feedback-success" role="status">{successMessage}</p>}
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
                  <span>{property.propertyType || 'Category not provided'}</span>
                  <span>{formatPropertyNumber(property.areaSqFt)} sq.ft.</span>
                  <span>{property.monthlyRent === null || property.monthlyRent === undefined || property.monthlyRent === '' ? 'Rent not provided' : `₹${formatPropertyNumber(property.monthlyRent)}/month`}</span>
                </div>

                <div className="property-footer">
                  <span className="status-pill">Saved</span>
                  <div className="detail-actions">
                    <Link to={`/properties/${property._id}`} className="btn btn-secondary btn-small">View Details</Link>
                    <button type="button" className="btn btn-secondary btn-small" onClick={() => handleRemove(property._id)} disabled={removingPropertyId === property._id}>{removingPropertyId === property._id ? 'Removing...' : 'Remove'}</button>
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
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;
    getContactRequests()
      .then((result) => { if (active) setRequests(result.requests); })
      .catch((error) => { if (active) setErrorMessage(error.message || 'Unable to load contact requests.'); })
      .finally(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [retryCount]);

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
        {errorMessage && (
          <div className="auth-feedback auth-feedback-error" role="alert">
            <p>{errorMessage}</p>
            {/please sign in|session is invalid|session has expired|account could not be found/i.test(errorMessage)
              ? <Link to="/login">Sign in</Link>
              : <button type="button" className="btn btn-secondary btn-small" onClick={() => {
                setIsLoading(true);
                setErrorMessage('');
                setRetryCount((count) => count + 1);
              }}>Retry</button>}
          </div>
        )}
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
                  <small>
                    {request.representative?.name || 'Representative'}
                    {request.property && ` · ${[request.property.location, request.property.city].filter(Boolean).join(', ')}`}
                  </small>
                </div>
                <span className="label">{request.status ? `${request.status.charAt(0).toUpperCase()}${request.status.slice(1)}` : 'Status unavailable'}</span>
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
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [properties, setProperties] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;
    async function loadDashboard() {
      try {
        const profileResult = await getProfile();
        if (!active) return;
        if (profileResult.user.role !== 'tenantRepresentative') {
          navigate('/retailer-dashboard', { replace: true });
          return;
        }
        setIsAuthorized(true);

        const [propertyResult, requestResult] = await Promise.all([
          getMyProperties(),
          getReceivedContactRequests(),
        ]);
        if (!active) return;
        setProfile(profileResult.user);
        setProperties(propertyResult.properties);
        setRequests(requestResult.requests);
      } catch (error) {
        if (!active) return;
        if (/please sign in|session is invalid|session has expired|account could not be found/i.test(error.message || '')) {
          navigate('/login', { replace: true });
          return;
        }
        setErrorMessage(error.message || 'Unable to load your representative dashboard.');
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadDashboard();
    return () => { active = false; };
  }, [navigate, retryCount]);

  const pendingRequests = requests.filter((request) => request.status === 'pending').length;
  const completedRequests = requests.filter((request) => request.status === 'completed').length;

  if (!isAuthorized || isLoading) {
    return (
      <main className="page">
        <div className="container">
          <p role="status">Verifying representative access and loading your dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="dashboard-grid">
          <aside className="sidebar">
            <h3>Representative</h3>
            <div className="side-nav">
              <NavLink to="/representative/dashboard" end className={({ isActive }) => `side-link${isActive ? ' active' : ''}`}>Dashboard</NavLink>
              <NavLink to="/my-properties" className="side-link">My Properties</NavLink>
              <NavLink to="/add-property" className="side-link">Add Property</NavLink>
              <NavLink to="/leads" className="side-link">Retailer Requests</NavLink>
              <NavLink to="/profile" className="side-link">Profile</NavLink>
              <LogoutButton />
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
            {errorMessage && (
              <div className="auth-feedback auth-feedback-error" role="alert">
                <p>{errorMessage}</p>
                <button className="btn btn-secondary" type="button" onClick={() => {
                  setErrorMessage('');
                  setIsLoading(true);
                  setIsAuthorized(false);
                  setRetryCount((count) => count + 1);
                }}>Retry</button>
              </div>
            )}

            {!isLoading && !errorMessage && <div className="stats-row">
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
            </div>}

            {!isLoading && !errorMessage && <div className="two-col">
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
            </div>}
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
                  {PROPERTY_CATEGORIES.filter((category) => category !== 'All').map((category) => (
                    <option key={category}>{category}</option>
                  ))}
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

function setMetaContent(attribute, key, content) {
  let meta = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, key);
    document.head.append(meta);
  }
  meta.setAttribute('content', content);
}

function setPageMetadata(title, description) {
  document.title = title;
  setMetaContent('name', 'description', description);
  setMetaContent('property', 'og:title', title);
  setMetaContent('property', 'og:description', description);
  setMetaContent('property', 'og:type', 'website');
  setMetaContent('property', 'og:url', window.location.href);
  setMetaContent('name', 'twitter:card', 'summary_large_image');
  setMetaContent('name', 'twitter:title', title);
  setMetaContent('name', 'twitter:description', description);
}

function NotFoundPage() {
  return (
    <main className="page">
      <div className="container not-found-state">
        <p className="eyebrow">Page not found</p>
        <h1>We couldn't find that page.</h1>
        <p>The address may have changed, or the page may no longer be available.</p>
        <div>
          <Link className="btn btn-primary" to="/">Go to Home</Link>
          <Link className="btn btn-secondary" to="/properties">Browse properties</Link>
        </div>
      </div>
    </main>
  );
}

function App() {
  const location = useLocation();
  const [backendStatus, setBackendStatus] = useState("Checking...");

  useEffect(() => {
    checkBackendHealth()
      .then(() => setBackendStatus("Backend Connected"))
      .catch(() => setBackendStatus("Backend Disconnected"));
  }, []);

  useEffect(() => {
    const path = location.pathname.replace(/\/+$/, '') || '/';
    const metadata = {
      '/': ['Locentra | Commercial Real Estate Site Selection', 'Discover commercial properties, compare locations, and connect with tenant representatives on Locentra.'],
      '/how-it-works': ['How Locentra Works', 'Learn how Locentra helps businesses describe their location needs, explore commercial properties, and connect with representatives.'],
      '/about': ['About Locentra', 'Learn about Locentra’s commercial property discovery and site-selection platform.'],
      '/properties': ['Properties | Locentra', 'Search commercial property listings by name, location, city, or category. Compare rent and area details on Locentra.'],
      '/login': ['Sign In | Locentra', 'Sign in to manage your commercial property search, saved listings, and requirements on Locentra.'],
      '/register': ['Create an Account | Locentra', 'Create a Locentra account to discover commercial properties or connect businesses with suitable locations.'],
      '/retailer-dashboard': ['Retailer Dashboard | Locentra', 'Review your requirements, matched commercial properties, saved listings, and contact requests on Locentra.'],
      '/create-requirement': ['Create a Requirement | Locentra', 'Save your business location, property type, size, and budget preferences to discover relevant commercial properties.'],
      '/saved': ['Saved Properties | Locentra', 'Review commercial properties you have saved for your site-selection search.'],
      '/contact-requests': ['Contact Requests | Locentra', 'Review the contact requests you have sent to commercial property representatives.'],
      '/profile': ['Your Profile | Locentra', 'Review your Locentra account profile and role.'],
      '/representative/dashboard': ['Representative Dashboard | Locentra', 'Manage your commercial property listings, retailer requests, and recent leads on Locentra.'],
      '/my-properties': ['My Properties | Locentra', 'Review the commercial properties you have published on Locentra.'],
      '/add-property': ['Add a Property | Locentra', 'Publish a commercial property listing with its location, category, size, and rent details.'],
      '/leads': ['Retailer Requests | Locentra', 'Review incoming retailer contact requests for your commercial property listings.'],
    };
    const [title, description] = path.startsWith('/properties/')
      ? ['Property Details | Locentra', 'Review commercial property details, location, size, and rent, and connect with its representative on Locentra.']
      : metadata[path] || ['Page Not Found | Locentra', 'The page you requested could not be found. Browse commercial property listings on Locentra.'];
    setPageMetadata(title, description);
  }, [location.pathname]);

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

      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/how-it-works" element={<HowItWorksPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/properties/:id" element={<PropertyDetailsPage />} />
        <Route path="/retailer-dashboard" element={<RequireRole roles={['retailer']}><RetailerDashboardPage /></RequireRole>} />
        <Route path="/create-requirement" element={<RequireRole roles={['retailer']}><CreateRequirementPage /></RequireRole>} />
        <Route path="/saved" element={<RequireRole roles={['retailer']}><SavedPropertiesPage /></RequireRole>} />
        <Route path="/contact-requests" element={<RequireRole roles={['retailer']}><ContactRequestsPage /></RequireRole>} />
        <Route path="/profile" element={<RequireRole roles={['retailer', 'tenantRepresentative']}><ProfilePage /></RequireRole>} />
        <Route path="/representative/dashboard" element={<RequireRole roles={['tenantRepresentative']}><RepresentativeDashboardPage /></RequireRole>} />
        <Route path="/tenant-dashboard" element={<Navigate to="/representative/dashboard" replace />} />
        <Route path="/add-property" element={<RequireRole roles={['tenantRepresentative']}><AddPropertyPage /></RequireRole>} />
        <Route path="/my-properties" element={<RequireRole roles={['tenantRepresentative']}><MyPropertiesPage /></RequireRole>} />
        <Route path="/leads" element={<RequireRole roles={['tenantRepresentative']}><LeadsPage /></RequireRole>} />
        <Route path="*" element={<NotFoundPage />} />
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
