# Proposed updates for onevarez.com

Reviewed the live site on 2026-10-16. It's a single v0.dev-generated page with a terminal theme. The source isn't in this repo, so these are proposals rather than a diff.

## Fix first (credibility)

1. **Page title is "v0 App".** Set a real `<title>` ("Oscar Nevarez · Software, data and AI consulting"), a meta description, Open Graph tags and a favicon. This is what shows in Google results and link previews.
2. **"SUCCESS_RATE: 98.7%" reads as made up.** Drop it, or replace it with numbers you can back: 20+ years, 100+ projects, 5,000+ daily loads on systems your team built at Kamina GO.
3. **The testimonial "S.JOHNSON, CTO@INNOVATETECH" looks like placeholder copy.** Replace it with a real, attributable quote (with permission and a LinkedIn link), or remove it.
4. **There is no way to contact you.** "INITIATE_CONTACT.EXE" doesn't link anywhere visible. Add `oscar@onevarez.com`, a booking link if you use one, and LinkedIn/GitHub.
5. **Footer says © 2025 and "Built with v0".** Update the year (or render it dynamically) and remove the v0 badge.

## Content to add

6. **Positioning that matches your resume.** The tagline "SOFTWARE_ENGINEER | DATA_ARCHITECT | AI_SPECIALIST" undersells the CTO and Tech Lead Manager track. Suggested: "Engineering leader and builder. AI agents in production, data platforms, cloud." 
7. **Two or three short case studies** instead of three bare service labels:
   - Kamina GO (Grupo Traxión): AI proof-of-delivery extraction, per-document model routing, an internal Slack LLM agent, multi-tenant analytics, at 5,000+ movements a day.
   - Prixz: CTO through the move from last-mile delivery to Mexico's first native online pharmacy.
   - Smart Document Router: serverless classify, extract, embed and route pipeline on Bedrock, Textract and pgvector.
8. **Services with outcomes**, e.g. "AI document pipelines", "Internal LLM agents and MCP integrations", "Cloud and data platform architecture", each with one line on what the client gets.
9. **Products**: a small block for Nullcolor (and Kineto), which shows you ship your own software.
10. **Link to onevarez.dev** as "What I build", so .com stays the services site and .dev is the builder portfolio.
11. **Bilingual (ES/EN) toggle**, since your clients are in Mexico and across the Americas.

## Design and tech

12. Keep the terminal flavour as an accent, not for every label. All-caps snake_case copy is hard to read and hard for search engines to match.
13. Add JSON-LD `Person`/`ProfessionalService` markup and a sitemap.
14. Move the site's content into data (the same JSON Resume file used on onevarez.dev) so both sites stay in sync and can be merged later.

## Merge path

When you're ready to merge, onevarez.dev's `content/profile.json` and its page sections can become a `/builder` route on onevarez.com, with onevarez.dev redirecting there (or the reverse, if you'd rather make .dev the main site).
