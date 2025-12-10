# ABIEZER "ABE" REYES

## Full-Stack Developer

**Orlando, FL 32839**
**abe.raise@gmail.com**
**https://needthisdone.com**
**https://github.com/AbeJitsu**

---

## PROFESSIONAL SUMMARY

Career built on discipline and proven growth: Army paramedic (5 years) making life-or-death decisions under pressure, then Toyota (7 years) advancing through three roles to Finance Manager. That foundation of leadership, systematic thinking, and earning trust through results now drives software development work.

Transitioned to software development in 2023 with the same commitment that earned promotions at Toyota and kept patients alive in the Army. Systematic problem-solver influenced by algorithmic thinking and computational approaches to decision-making.

---

## TECHNICAL SKILLS

**Frontend Development**
React, Next.js (SSR, API routes), Vue.js, Quasar Framework, TailwindCSS, HTML/CSS, JavaScript, TypeScript
Responsive Design: Mobile-first approach, CSS Grid/Flexbox, flexible layouts, cross-device optimization
Modern tooling: Puck (component-based page builder), Storybook, Playwright (E2E testing), Vitest (unit/integration testing)
Accessibility & Testing: WCAG AA compliance, dark mode implementation, visual regression testing

**Backend & APIs**
Node.js, Express.js, Python
RESTful API design, OAuth authentication, Google APIs integration

**Databases & Caching**
PostgreSQL (Supabase with pgvector for semantic search), MongoDB Atlas, MySQL, Redis

**DevOps & Infrastructure**
Docker (multi-environment containerization: prod, dev, e2e, test), Nginx (reverse proxy, load balancing, SSL/TLS)
Docker Compose (multi-service orchestration), Redis (in-memory caching with pattern invalidation and TTL management)
Git/GitHub (version control, CI/CD pipelines with GitHub Actions, professional branch strategy), Monorepo architecture
Google Cloud Platform (OAuth, Calendar/Meet APIs, cloud services), Vercel, Heroku, Railway, DigitalOcean

**AI & RAG Systems**
RAG (Retrieval-Augmented Generation) implementation: semantic search, vector embeddings, intelligent content retrieval
OpenAI API (embeddings, completions, prompt engineering), Vercel AI SDK (real-time streaming chat interfaces)
Supabase pgvector for vector storage and similarity search
Context-aware chatbots with intelligent indexing and hash-based change detection
Claude Code (agentic workflows, development automation)

**E-commerce & CMS**
Medusa (headless e-commerce)

---

## PROFESSIONAL EXPERIENCE

**Full-Stack Developer**
*Acadio | Educational LMS Platform | Spring 2025 - Winter 2025*

* Identified manual workflows consuming weeks of team time and automated them away. Flashcard generation, validation, and correction now runs in minutes
* Built multi-phase validation pipelines that catch errors programmatically instead of requiring manual review
* Became the go-to problem-solver for complex technical challenges others couldn't resolve

**Freelance Web Developer**
*Self-Employed | Independent Contractor | Fall 2023 - Spring 2025*

* Built custom web applications and automation tools for clients while developing full-stack expertise
* Mastered modern development workflow including Git, testing, and deployment pipelines
* Transitioned from learning fundamentals to delivering production-ready solutions for real clients

**Finance Manager**
*Toyota | Career Progression: Salesperson → Sales Manager → Finance Manager | Spring 2017 - Winter 2023*

* Advanced through three progressive roles demonstrating consistent leadership growth and business acumen
* Mastered financial analysis, customer relationship management, and sales processes. Communication skills directly transfer to understanding user needs in software development
* Developed systematic approach to problem-solving and process optimization that translates to building efficient, user-focused software systems

**Admissions Representative**
*Full Sail University | Winter Park, FL | 2012 - 2017*

* Excelled in role requiring strong interpersonal and communication skills, aiding students in educational decision-making

**Paramedic**
*U.S. Army | 1996 - 2001*

* Delivered emergency medical care under high-pressure conditions requiring rapid decision-making and problem-solving
* Maintained critical systems and protocols with zero-margin-for-error responsibility
* Developed discipline, systematic thinking, and attention to detail. Core skills transferable to software architecture and testing

---

## KEY PROJECTS

**needthisdone.com** | *Founder & Full-Stack Developer | November 2025 - Present*

Built a complete e-commerce platform that demonstrates full-stack mastery across architecture, DevOps, testing, and production thinking. This isn't a learning project—it's a production system handling real user traffic, real payments, and real complexity. Includes features that require serious engineering: e-commerce shopping flows, user authentication, order management, admin dashboard, and a component-based page builder (Puck) so non-technical users can create pages without touching code.

**Architecture & Performance:**
* Three-tier system that scales intelligently: Nginx reverse proxy handles traffic distribution and SSL termination, Next.js handles the frontend and API routes, Medusa manages headless e-commerce logic, Supabase (PostgreSQL with pgvector) handles authentication and user data separately. This separation of concerns means each component scales independently
* Intelligent indexing strategy: Built a system that indexes pages on load and uses hash-based checks to detect changes, preventing unnecessary reindexing every time a user accesses the system. This solves the metadata maintenance nightmare that typically plagued smaller systems—pages stay up-to-date without constant regeneration overhead
* Headless e-commerce integration with Medusa supporting product catalog with variants, cart management, order processing, order history, and payment flows. The architecture allows adding mobile or third-party integrations without rebuilding the core system
* RAG (Retrieval-Augmented Generation) chatbot system combines semantic search with LLM completions for intelligent responses. Uses Supabase pgvector to store OpenAI embeddings, enabling similarity search across indexed content. Retrieves contextually relevant information and passes it to GPT for natural language responses. Intelligent indexing with hash-based change detection keeps vector database current. Demonstrates prompt engineering to optimize context window usage and response quality

**Testing & Quality (Comprehensive, Not Afterthought):**
* E2E test suite with Playwright covering complete user journeys: detailed shopping flows (product browsing, variant selection, cart operations), checkout process with payment, authentication flows, admin dashboard functions, dark mode functionality. Not just happy path testing—tests cover real user scenarios
* Unit and integration tests with Vitest across utilities, components, and business logic. Accessibility testing verifying WCAG AA compliance across all components with minimum 5:1 contrast ratios
* Dark mode implementation demonstrating component design that adapts seamlessly across light/dark themes. Tests verify that theme switching doesn't introduce visual regressions
* Tests are automated—GitHub Actions runs the full test suite on every push before deployment

**Infrastructure & DevOps (Production-Grade Thinking):**
* Multi-environment Docker containerization: production-optimized builds for minimal image size and fastest startup, development with hot reload for rapid iteration, separate E2E testing environment with Playwright support, unit testing configs. Development environment mirrors production exactly—if it works locally, it works in production
* Docker Compose orchestration managing all services together (Next.js, Medusa, PostgreSQL, Redis, Supabase connection). New developers can spin up the entire system with one command
* Nginx reverse proxy handling SSL/TLS encryption, load balancing, static asset optimization and caching. The configuration reflects production concerns: security headers, proper cache control, efficient asset serving
* GitHub Actions CI/CD pipeline automating testing and deployment. Code doesn't ship without passing tests—verification is automatic and systematic
* Database migrations and version-controlled schema management with Supabase. Database changes are tracked, reversible, and applied consistently across environments

**Code Quality & Professional Standards:**
* TypeScript with strict type safety throughout the application. Type safety catches errors at compile time, preventing bugs from reaching users
* Shared design system with Storybook component library - comprehensive examples for every component. Non-developers can see how components behave and developers have a single source of truth. Admin dashboard with system monitoring, user management, and real-time status indicators
* Professional git workflow: main branch (production-ready code only), dev branch (active development), experiment branch (R&D and long-term explorations). Release management is systematic and transparent
* Clear architecture documentation and developer setup guides. Future developers can understand how the system works without needing to reverse-engineer it
* Component library design allowing code reuse across the application. Dark mode support baked in from the component level

**Why This Matters:**
This project demonstrates the difference between building features and architecting systems. Every decision—from how to structure the Docker environments to how to organize the component library to the git branching strategy—reflects production thinking and a commitment to quality that persists beyond the initial launch. Building the component-based page builder wasn't the hardest part. The hard part was architecting a system that's easy to use, easy to understand, easy to test, and easy to scale.

---

## EDUCATION

**Computer Science Foundations | Khan Academy | 2023**

* AP Computer Science Principles: Algorithms, data structures, programming, networking, cybersecurity, data analysis, simulations, and computing innovations
* Computers and the Internet: Computer architecture, digital information, Internet protocols, online security, encryption, and web protocols

**Professional Coursework | Udemy | 2023**

* Vue.js Complete Guide: Component architecture, state management, routing, Composition API
* 100 Days of Code Web Development Bootcamp: Full-stack development, frontend frameworks, backend architecture, SQL/NoSQL databases

**Self-Taught Development | January 2023 - Present**

* 2023: Mastered MEVN stack fundamentals (MongoDB, Express.js, Vue.js, Node.js)
* 2024: Applied knowledge through freelance full-stack projects and continued learning
* 2025: Elevated skills with professional experience and modern tooling adoption (Claude Code, Next.js, Docker, DevOps)
