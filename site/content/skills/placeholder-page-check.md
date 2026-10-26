---
title: "Placeholder page check"
description: "Which paid clicks came from employers that don’t exist, and the exact names to exclude"
area: "budget-reach"
status: "ready"
author: "bogdan-liutic"
rules:
  - check-who-your-ads-actually-reach
order: 2
changes: "Reads your data, changes nothing"
firstRun: "About 5 minutes"
connectors:
  - Claude
  - ChatGPT
  - Gemini
  - LinkedIn Ads export
# Placeholder page copy (structure from Figma 919:23317); replace with the author’s own
page:
  does:
    headline: "Some of the companies you pay to reach don’t exist."
    body:
      - "People list employers like “Self-employed”, “Stealth” or “Confidential”, and LinkedIn treats each as a company. On an account list, those pages soak up clicks at a price that looks cheap and healthy."
      - "This reads every employer behind a paid click, flags the ones that stand for no real company, and gives you the exact names to exclude, matched exactly so a real company is never caught by accident."
  prompt:
    headline: "Paste it into Claude."
    context: "Run it on the sample data first, then on your own export"
    tabs:
      - label: "Sample client"
        text: |-
          Load the placeholder page check skill from The B2B AI Standard and run it on the bundled sample client, Northwind Merch.

          Read every employer behind a paid click, flag the placeholder pages, and match names exactly.

          Reply with the share of clicks and spend that went to placeholders, then the exact names to exclude. Don’t exclude anything by partial match.
      - label: "Your exports"
        text: |-
          Load the placeholder page check skill from The B2B AI Standard and run it on the exports I’ve attached.

          Read every employer behind a paid click, flag the placeholder pages, and match names exactly.

          Reply with the share of clicks and spend that went to placeholders, then the exact names to exclude. Don’t exclude anything by partial match.
      - label: "DemandSense"
        text: |-
          Load the placeholder page check skill from The B2B AI Standard and run it on my DemandSense workspace. Pull the data through the connector rather than asking me for exports.

          Read every employer behind a paid click, flag the placeholder pages, and match names exactly.

          Reply with the share of clicks and spend that went to placeholders, then the exact names to exclude. Don’t exclude anything by partial match.
    install:
      - label: "Claude Code"
        text: |-
          /plugin marketplace add bogdanl-rgb/cr8-plugins
          /plugin install signal-loop
    source: "https://github.com/bogdanl-rgb/cr8-plugins"
  output:
    headline: "Half the clicks went to a company that doesn’t exist."
    stats:
      - value: "708"
        label: "paid clicks on one ad set"
      - value: "350"
        label: "came from one placeholder employer"
        accent: true
      - value: "12"
        label: "names to exclude, matched exactly"
    # Placeholder screenshots (Notion template gallery) until the real outputs arrive
    items:
      - title: "Exclusion list"
        caption: "The placeholder employers, by exact name"
        src: "/outputs/placeholder/notion-1.png"
      - title: "Share of clicks"
        caption: "How much of each ad set went to them"
        src: "/outputs/placeholder/notion-2.png"
      - title: "Before and after"
        caption: "Cost per click with and without them"
        src: "/outputs/placeholder/notion-3.png"
    note: "One ad set, 7 Aug to 5 Sep 2026: **49% of the clicks** came from people listing the same placeholder employer."
  steps:
    - title: "Read the employers"
      text: "Lists every employer behind a paid click, with its share of clicks and spend."
    - title: "Flag the placeholders"
      text: "Matches names that stand for no real company: self-employed, stealth, confidential and their variants."
    - title: "Write the list"
      text: "Returns the exact names to exclude and what they cost."
  stepsNote:
    headline: "Only exact names are flagged."
    context: "A real company with a similar name is never excluded by accident"
  useWhen:
    - title: "A cheap ad set looks too good."
      text: "Low cost per click on an account list is often placeholder pages, not real interest."
    - title: "You’re about to rank accounts by engagement."
      text: "Strip the companies that don’t exist first."
    - title: "You start a new account list."
      text: "Check it once in the first two weeks, before the budget scales."
---
