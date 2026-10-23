---
title: "Account signal sheet"
description: "Turns a quarter of LinkedIn® Ads, website and CRM data into one ranked list of the accounts sales should call this month, after throwing out the companies that were never real"
area: "signal-to-sales"
status: "ready"
author: "justin-rowe"
rules:
  - give-sales-a-weekly-ranked-list
  - check-who-your-ads-actually-reach
order: 1
changes: "Reads your data, changes nothing"
firstRun: "About 10 minutes"
connectors:
  - Claude
  - LinkedIn® Ads export
  - CRM export
  - DemandSense (optional)
page:
  does:
    headline: "Most target account lists are ranked on data that hasn’t been cleaned."
    body:
      - "Pull a quarter of engagement data and the top of the list is usually wrong: your own staff, competitors checking you out, bots, ISPs, and people whose profile lists an employer that doesn’t exist. Rank it as it comes and sales calls the wrong companies."
      - "This cleans the signal first and only then scores it. What comes out is a spreadsheet: who engaged, what they read, whether they are already in your CRM, who owns them, and one line a rep can say out loud."
  prompt:
    headline: "Paste it into Claude."
    context: "Run it on the sample client first, then on your own exports or DemandSense"
    tabs:
      - label: "Sample client"
        text: |-
          Load the account signal sheet skill from The B2B AI Standard and run it on the bundled sample client, Northwind Merch.

          Follow the four steps in order: clean the signal, fit and heat, match to the CRM, hand off. Never rank before the cleaning step is clean.

          Reply with the cleaning summary first, then the priority 1 accounts with their hand-off lines, the customers engaging as expansion, and any source that is missing or capped. Don’t total deal values.
      - label: "Your exports"
        text: |-
          Load the account signal sheet skill from The B2B AI Standard and run it on the exports I’ve attached.

          Follow the four steps in order: clean the signal, fit and heat, match to the CRM, hand off. Never rank before the cleaning step is clean.

          Reply with the cleaning summary first, then the priority 1 accounts with their hand-off lines, the customers engaging as expansion, and any source that is missing or capped. Don’t total deal values.
      - label: "DemandSense"
        text: |-
          Load the account signal sheet skill from The B2B AI Standard and run it on my DemandSense workspace. Pull the data through the connector rather than asking me for exports.

          Follow the four steps in order: clean the signal, fit and heat, match to the CRM, hand off. Never rank before the cleaning step is clean.

          Reply with the cleaning summary first, then the priority 1 accounts with their hand-off lines, the customers engaging as expansion, and any source that is missing or capped. Don’t total deal values.
    install:
      - label: "Claude Code"
        text: |-
          /plugin marketplace add demandsense/the-ai-standard
          /plugin install account-signal-routine
    source: "https://github.com/demandsense/the-ai-standard/tree/main/skills/account-signal-sheet"
  output:
    headline: "One profile was seven of the best-looking accounts."
    stats:
      - value: "16"
        label: "companies came in from the quarter"
      - value: "10"
        label: "removed or flagged before ranking"
        accent: true
      - value: "6"
        label: "reached sales, each with a name"
    # Placeholder screenshots (Notion template gallery) until the real outputs arrive
    items:
      - title: "Act now"
        caption: "The Act now tab of ten, run on the sample client that ships with the skill. Nothing edited by hand"
        src: "/outputs/placeholder/notion-1.png"
      - title: "Accelerate"
        caption: "Open deals with fresh engagement"
        src: "/outputs/placeholder/notion-2.png"
      - title: "Expand"
        caption: "Customers engaging, for expansion"
        src: "/outputs/placeholder/notion-3.png"
      - title: "Watch"
        caption: "Accounts warming up, not ready yet"
        src: "/outputs/placeholder/notion-4.png"
      - title: "Influenced deals"
        caption: "Deals the ads touched before they opened"
        src: "/outputs/placeholder/notion-5.png"
      - title: "Peers"
        caption: "Lookalikes of the accounts that converted"
        src: "/outputs/placeholder/notion-1.png"
      - title: "Exclusions"
        caption: "Companies to strip from targeting"
        src: "/outputs/placeholder/notion-2.png"
      - title: "Cleaning report"
        caption: "What was struck before ranking, and why"
        src: "/outputs/placeholder/notion-3.png"
      - title: "Sources"
        caption: "Every export used, with its row counts"
        src: "/outputs/placeholder/notion-4.png"
      - title: "Score"
        caption: "How each account was scored"
        src: "/outputs/placeholder/notion-5.png"
  steps:
    - title: "Clean the signal"
      text: "Removes your own company, competitors, ISPs and bots. Flags profiles appearing as several companies at once. Checks that every export came back complete rather than truncated, and stops here if one didn’t."
    - title: "Score fit and heat"
      text: "Puts what survived through your ICP filter, sends anything off-profile to an exclusion list for whoever runs the ads, and ranks the rest on who engaged, how often and how recently."
    - title: "Match to the CRM"
      text: "Sorts every account into new, open deal, closed-lost or customer. Customers go to expansion and never count as new business; open deals go to their owner, so SDRs stay off accounts that are mid-deal."
    - title: "Write the hand-off"
      text: "One line per account: who engaged, what they read, who owns it, what to do next. Plus a column for the account team to record what was decided."
  useWhen:
    - icon: "page"
      title: "You owe someone an impact report."
      text: "A QBR, an EBR, or a monthly client report where the question is which accounts moved and what marketing had to do with it."
    - icon: "case"
      title: "Sales says the leads are bad."
      text: "This shows you how many were never real companies before you change anything about the targeting."
    - icon: "reach"
      title: "You run an account list and can’t tell who it reached."
      text: "Engagement looks healthy in the totals and you want it account by account instead."
    - icon: "pair"
      title: "You’re handing accounts to SDRs."
      text: "It checks the CRM first, so nobody cold-pitches a company that already has an open deal."
  partOf: "Justin’s monthly routine, start to finish. This skill is all four of its steps"
---
