# How I Use MCP to Get Live Documentation While Coding

*A practical look at Model Context Protocol and my context7 setup*

---

If you've ever been mid-flow writing code with an AI assistant and thought "I wish it knew the latest docs for this library," MCP solves that problem. Let me show you how I use it daily.

---

## What Is MCP?

MCP (Model Context Protocol) is Anthropic's open standard for connecting AI assistants to external tools and data sources. Think of it as a universal adapter that lets Claude (or other AI assistants) talk to anything — databases, APIs, file systems, documentation servers.

```
BEFORE MCP                           WITH MCP
─────────────────────────────────────────────────────────────
You: "How do I use the new          You: "How do I use the new
     Next.js 15 feature?"                Next.js 15 feature?"
                                             │
AI: *uses training data*            AI: ────►│ MCP Server
    *might be outdated*                      │ (context7)
    *might hallucinate*                      ▼
                                    Fetches LIVE docs
                                             │
                                             ▼
                                    AI: *uses current docs*
                                        *accurate answer*
```

The key insight: instead of hoping the AI's training data is current, MCP lets it fetch live information.

---

## My Setup: context7 for Documentation

I use [context7](https://github.com/upstash/context7) as my documentation MCP server. Here's what it does:

1. I mention a library (like "Next.js" or "Supabase")
2. context7 fetches the current documentation
3. Claude gets that documentation as context
4. I get answers based on the *actual* current docs, not training data from months ago

### Why This Matters

Libraries change constantly. Between when Claude was trained and today:
- Next.js shipped new features
- Supabase updated their API
- React patterns evolved
- New packages were released

Without MCP, you're working with stale information. With context7, you're working with today's docs.

---

## How It Works in Practice

Here's an example from my workflow:

**Me:** "I need to implement server actions in Next.js 15. Show me the current pattern."

**What happens behind the scenes:**

```
┌─────────────────────────────────────────────────────────┐
│ 1. Claude recognizes I need Next.js documentation      │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ 2. MCP call to context7: "fetch Next.js docs"          │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ 3. context7 retrieves current Next.js documentation    │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ 4. Claude receives docs as context                     │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│ 5. Claude answers using CURRENT patterns, not outdated │
└─────────────────────────────────────────────────────────┘
```

The difference is night and day. Instead of "I think this is how it works based on my training," I get "Here's how it works according to the current documentation."

---

## Setting Up context7

If you're using Claude Code or another MCP-compatible client, adding context7 is straightforward.

### 1. Add to Your MCP Configuration

In your Claude Code settings (or MCP config file):

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    }
  }
}
```

### 2. That's It

Seriously. Once configured, Claude can access documentation for popular libraries automatically.

---

## When I Use It

**Learning new libraries:**
Instead of bouncing between browser tabs and my editor, I ask Claude directly. It fetches the docs and explains them in context of what I'm building.

**Checking current patterns:**
"Is this still the recommended way to do X in React?" — now I get an answer based on current React docs, not patterns from a year ago.

**Debugging with accurate info:**
When something isn't working, having current docs means Claude can identify if I'm using a deprecated pattern or missing a new requirement.

**Staying current:**
Libraries I use regularly (Next.js, Supabase, Tailwind) update frequently. MCP keeps my development workflow aligned with current best practices.

---

## MCP Beyond Documentation

context7 is just one MCP server. The protocol is designed for much more:

```
MCP USE CASES
────────────────────────────────────────────────────
Documentation   ─── context7, official docs servers
File Systems    ─── Read/write local files
Databases       ─── Query your actual data
APIs            ─── Connect to any service
Git             ─── Repository operations
Browser         ─── Web automation
Custom Tools    ─── Build your own integrations
```

The pattern is always the same: give the AI access to current information instead of relying on training data.

---

## Why MCP Matters for AI Development

If you're building AI applications (which the Lockheed Martin role focuses on), understanding MCP is increasingly important:

1. **It's becoming the standard** — Anthropic designed it, but it's open and being adopted broadly

2. **It solves the "stale knowledge" problem** — AI assistants can access current information

3. **It enables tool use** — AI can *do* things, not just generate text

4. **It's composable** — multiple MCP servers can work together

For anyone building AI utilities and tools (like the role describes), MCP is how you connect AI to everything else.

---

## What I've Learned

After using MCP daily for documentation:

**The good:**
- Dramatically fewer "let me verify that" moments
- Code examples that actually work with current library versions
- Faster development because I'm not context-switching to docs sites

**The considerations:**
- Depends on the MCP server's reliability
- Some docs are better structured than others
- Still need to understand what you're asking for

**The insight:**
MCP isn't magic — it's plumbing. But good plumbing makes everything else work better.

---

## Getting Started

If you want to try this workflow:

1. **Use an MCP-compatible client** — Claude Code, Continue, or build your own
2. **Add context7** — the JSON config above is all you need
3. **Ask questions that benefit from current docs** — library features, API patterns, deprecation questions

The first time Claude answers with "according to the current Next.js documentation..." instead of hedging about training data, you'll get it.

---

## What's Next

I'm exploring building my own MCP server to connect Claude to project-specific data — think local databases, custom APIs, internal documentation. The protocol is well-designed and the tooling is maturing quickly.

If you're interested in the technical details of building MCP servers, let me know. That could be a future post.

---

*Using MCP in your workflow? I'd love to hear what servers you're running and how it's changed your development process.*
