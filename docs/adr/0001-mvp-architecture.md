# ADR 0001: One Vercel Next.js app with live scene code generation

## Status

Accepted — 2026-07-19

## Context

MVP needs public demo fast, no database/auth, protected model cost, live GPT
evidence, and a port of existing three.js/anime.js code execution/repair flow.

## Decision

Use one Next.js App Router project on Vercel. Browser owns renderer and scene
execution; server routes own demo-cookie verification, simulated-data
validation, and GPT-5.6 Terra calls. URL query parameters contain all
shareable state. Use an HTTP-only signed cookie for lightweight access control.

## Consequences

Fast deploy and no service operations. No persistence or multi-user features.
The browser executes model-generated code, acceptable only for this tightly
prompted hackathon demo; future product needs a declarative visualization schema
or isolated renderer.
