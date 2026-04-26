# Writing Style & Cognitive Profile Analysis

**Subject:** User (Tony Nguyen), VŠE Praha, FIS, Aplikovaná informatika
**Corpus:** 1,530 Bakalarka project messages + 6 daily notes
**Date of analysis:** 2026-02-21

---

## 1. Communication Style

### 1.1 Language & Code-Switching

The user writes almost exclusively in Czech, but with heavy English technical terminology embedded naturally within Czech sentences. This is not occasional borrowing but systematic code-switching -- approximately 7.1% of messages contain 2 or more English technical terms. Examples:

> "hele ja prave vidim gap te memory layer, my nepotrebujeme rag nebo neco takoveho co my potrebujeme je agenty na management/governance v contextu dokumentace v git platforms"

> "pojdme pouzit github at si zbytecne nekomplikujeme zivot prosim"

> "hele muzes udelat commit a push at to verzujeme nejak prosim"

The English terms are always domain-specific (scaffolding, governance, ablation, TDD, baseline, workflow, meta-prompting, compliance) and treated as the natural vocabulary for these concepts. The user explicitly decided on this convention:

> "ja bych napriklad domain veci proste cesky jako billing reminder a industry standard veci pojmenovat anglicky"

Czech is used for reasoning, emotion, and interpersonal communication. English is used for technical precision. Diacritics are mostly omitted (writing "prosim" not "prosím", "udelat" not "udělat"), indicating fast typing without autocorrect -- prioritizing speed over polish.

### 1.2 Sentence Structure & Complexity

- **Average message length:** 25.1 words (median: 18 words)
- **Average sentence length:** 15.0 words
- **Distribution:** 66.5% medium (6-30 words), 21.8% long (31-80 words), 3.4% very long (>80 words)

Messages are typically short to medium but can become extended stream-of-consciousness when the user is working through a complex idea. The very long messages (80+ words) are almost always the user "thinking out loud":

> "ja bych rekl ze ten framework by byl vystup pro teoretickou cast a pak konfigurace agentu a projektu by mel byt pratickou casti ? v tomto priapde mel by byt projekt nejakou jednoduchy projekt nebo ta konfigurace(ta musi byt taky nekde ulozena aby to bylo univerzalni a znovupouzitelny ne ?) a ja premyslel kam ukladat tu konfigurace a rikal jsem si ze cli je to co vscihni agenti maji stejny, pak jsou tady standardy jako skills.md, nebo jak bychom se nadtim meli zamyslet ?"

Punctuation is minimal. Question marks are used heavily (69.7% of messages contain at least one), but periods and commas are almost absent. The writing reads like spoken Czech transcribed directly.

### 1.3 Distinctive Opening Patterns

Messages follow highly predictable opening patterns:

| Opener | Count | Function |
|--------|-------|----------|
| "okkey" | 240 | Acknowledging then pivoting/continuing |
| "a " | 191 | Adding to previous thought, building on |
| "no " | 165 | Responding, qualifying ("well...") |
| "jo" | 105 | Agreeing before adding nuance |
| "hele" | 66 | Attention-getter, introducing new topic |
| "ale" | 66 | Disagreeing, objecting |
| "ne " | 34 | Direct contradiction |
| "pojdme" | 22 | Action-oriented, moving forward |

The "okkey" opener is the signature transition device -- it signals "I've processed what you said, now here is what I think/want." The characteristic spelling "okkey" (not "okay" or "okey") is consistent across 266 uses.

### 1.4 Distinctive Phrases & Verbal Tics

- **"prosim"** (311 uses) -- almost always appended to requests, softening directives
- **"vlastne"** (197 uses) -- "actually/essentially" -- reveals mid-thought reframing, constantly reconsidering what something "really" is
- **"teda"** (161 uses) -- "so/then" -- used for logical transitions
- **"prave"** (108 uses) -- "exactly/just" -- emphasizing what matters
- **"dava to smysl"** (12 explicit uses, many implied) -- constant checking for logical coherence
- **"ne ?"** -- tag question appended constantly, seeking confirmation

The phrase "pojdme" (let's go) appears 197 times, revealing a preference for collaborative forward motion. The user rarely says "udělej" (do it) without "pojdme" (let's).

---

## 2. Cognitive Patterns

### 2.1 Thinking Mode: Exploratory & Divergent

The defining cognitive feature is **real-time thinking out loud**. The user does not arrive with formed conclusions -- they form conclusions *during* the conversation. This is evident in:

- 69.7% of messages contain question marks
- 31.3% contain 2+ questions (multiple questions in a single message)
- 31.7% contain hedging language ("nevim", "mozna", "asi", "myslim")

Example of real-time thinking:

> "me spis znepokojuje ze uz nevim podle ceho mam urcit scope prace jak nadtim premyslet ?"

> "no prave vsechno tohle a udelat na to agenty. propojit agenty a git a propojit to s tim dokumentacnim a projekt managemnt nastrojema co git platformy poskytuji"

The user regularly begins with an idea, questions it mid-sentence, branches to a related thought, and sometimes returns to the original point. This is not disorganized -- it is **associative exploration**.

### 2.2 Abstraction Preference

The user strongly gravitates toward abstract, systems-level thinking. They consistently resist premature concretization:

> "tedka zabihame do implementacnich detailu, ale to je asi dobre, ale hlavni je ted dulezity udelat scope"

> "okkey ale pojdme kapitolu po kapitole ne ? a navic bychom to meli psat tak aby se to bylo dostatecne abstraktni a pak to budeme iterativne rozbijet pritom kdyz budeme delat research"

They think **top-down** -- from the big picture to details, getting frustrated when pushed to specifics too early:

> "to jsou moc uzke zamereni, my potrebujem siroky zaber"

> "ja nedelam pouze dokumentacniho agenta ja se snazim delat vsechny agenty dokumentacni je jeden z mnoho"

However, when they do go concrete, they go very concrete -- discussing specific tools, API keys, CLI commands. The oscillation between abstract strategy and concrete tooling is rapid and fluid.

### 2.3 Handling Uncertainty

The user has a **high tolerance for ambiguity** but simultaneously seeks frequent validation. Key patterns:

- They sit with uncertainty openly: "sam v tom mam zmatek a nevim jak bych mel postupovat"
- They acknowledge not knowing: "nevim" appears 49 times, "ja nevim" is a common phrase
- But they constantly check: "dava to smysl ?" (12x), "ne ?" (confirmation-seeking in 260 messages, 17% of all)

This is not insecurity -- it is **collaborative sensemaking**. The user treats the AI as a thinking partner and uses questions to calibrate their understanding:

> "me napada me napadlo nemeli bychom ty sources nejak nacpat do vektorove DB a pak zkusit udelat search ? to by se hodilo pro psani bakalarky ne ?"

### 2.4 Metacognition

Explicit metacognitive statements appear in 1.9% of messages, but implicit metacognition is far more frequent. The user regularly steps back from the task to ask *how they should think about it*:

> "yes udelal bych to tak ale chtel bych se nadtim zamyslet metakognitvne ? jak bych mel premyslet pri vykonavani tehle cinnosti ? jak to delat optimlane ?"

> "je to tak vubec vedecky spravne ?"

> "jak mam uvazovat nadtim jestli je to tak dobre napsany ? a jak nadtim premyslet ?"

This is a strong differentiator -- the user does not just want to do things, they want to understand the framework for doing things correctly.

### 2.5 Idea Transitions

The user transitions between ideas in three characteristic ways:

1. **"a ted me napada..."** (and now it occurs to me...) -- spontaneous associations mid-conversation
2. **"ale pockej..."** (but wait...) -- interrupting own line of thought when seeing a problem
3. **"vlastne..."** (actually...) -- retroactive reframing of what was just said

This creates a non-linear discussion flow where multiple threads run in parallel. A single message can touch 3-4 distinct topics:

> "jo a tedme napada jak je ta specifikace tak tam rozdelime na subissue nebo jak to bude vlastne ? podle ceho pojedou agenti ? a jak to traackovat do issue to resime ted nebo tam na to mame vlastni sekci ?"

---

## 3. Argumentation Style

### 3.1 Reasoning from Experience and Intuition

The user reasons primarily from **personal experience and intuition**, then seeks academic/theoretical backing:

> "ja tomu rozumim intuitivne ze zkusenosti, prakticky a ted jenom potrebuju najit ty pasaze"

> "necetl jsem nic, ctu systemove veci ktere jsou univerzalni tady ty odborne si myslim ze je lepsi ze zkusenosti delat"

They have strong opinions formed through practice but are aware they need to ground them academically for the thesis:

> "meli bychom nemeli bychom ty zmeny v tech iteracich vlastne udovodnit nejakou literaturou ? delame to tak ?"

### 3.2 The "Yes, But..." Pattern

148 messages (9.7%) follow a "yes, but..." structure -- agreeing with the premise while immediately adding qualifications or redirections:

> "jo nejak tak ale rikasm si jestli bychom meli mit nejaky sekvenci orchestraci pomoci skriptu jako variantu nebo spise ne ?"

> "jo a co thesis nemusim tam nejak oduvodnit co jsme udelali a jak to navrhujeme ?"

This reveals a thinker who **engages with proposals rather than rejecting them**, but rarely accepts anything without modification.

### 3.3 Logical Leaps

The user regularly makes 2-3 step logical leaps without explicit justification:

> "hele mozek se meni rychle ale na tak rychle aby se menili nase dlouhodobe hodnoty nebo ? co kdybychom mohli udelat snapshot mozku je to vubec mozny ?"

> "a tedka se pojdme zamyslet na zbytkem jak to zmenit podle tehle motivace na co se zamerit vice, lip to specifikovat a co muzeme nechat abstraktni ?"

The gap between observation and conclusion is often filled by implicit experience-based reasoning that the user does not verbalize. They expect the interlocutor to follow the same associative chain.

### 3.4 Disagreement Style

When disagreeing, the user is **direct but not confrontational**:

> "ani jedno my nesedi, proste schopnost agenta provest kvalitni praci ty omezeni nejsou podstatne nebo jo ?"

> "moc slozity, kazdy to dela jinak, za me to uplne invetuje wheel kdyz vlastne existuji github gitlab issues ?"

They use "ne" (no) directly, followed by an explanation. They are comfortable saying "to mi nesedi" (that doesn't work for me) without softening.

---

## 4. Blind Spots & Tendencies

### 4.1 Scope Expansion Tendency

The most prominent pattern across the entire corpus is **systematic scope expansion**. The user consistently pushes to broaden scope when the pragmatic move would be to narrow:

> "jako rozsirit je takovy ze bych chtel zahrnout vetsi scope, spis jako udelat komplet ai governance/management"

> "ja nedelam pouze dokumentacniho agenta ja se snazim delat vsechny agenty"

> "no prave vsechno tohle a udelat na to agenty"

> "asi bych chtel testovat agentni vyvoj obecne"

This is explicitly acknowledged in the conversation (scope creep is discussed as a concern), but the impulse recurs. The user wants to understand the whole system before committing to a part. This is intellectually admirable but creates practical tension with thesis deadlines.

### 4.2 Decision Deferral

While the user has strong intuitions, they frequently defer final decisions by framing everything as "still needing discussion":

> "to bychom meli dohledat na internetu"
> "pojdme to diskutovat"
> "je to k diskuzi jeste"
> "o tom bychom meli premyslet"

There is a bias toward **more exploration over commitment**. The number of "research" requests (100 uses of "research") versus concrete implementation decisions illustrates this.

### 4.3 Perfectionism-Pragmatism Tension

The user explicitly wants "disertace quality, BP scope" -- a perfectionist aspiration constrained by a pragmatic reality. This creates oscillation between:
- "udelame to metodicky jako disertace" (perfectionist)
- "proste to tak udelame" (pragmatic, when tired of deliberation)

### 4.4 Underestimating Written Communication Requirements

The user assumes understanding can be transferred quickly and informally. They frequently write long, stream-of-consciousness messages that mix observations, questions, decisions, and tangents in a single paragraph. When it comes to formal thesis writing, they are aware this does not work:

> "tpc nevim jak to zacit psat, musim si neco o tom nastudovat a pak to parafrazovat ?"

> "Okkey asi bude lepší kdyz to napisu sam a ty me to preformulujes aby to bylo gramatciyk spravne"

### 4.5 Tool Exploration Over Task Completion

The user has a strong tendency to explore tooling (RAG, ChromaDB, OCR, Overleaf, semantic search, MCP) before completing the primary task. Many sessions include substantial tooling setup that delays thesis writing.

### 4.6 Process Design Over Process Execution

There is a visible preference for **designing how to work** over actually working. A large portion of messages are about meta-workflow: how to organize information, what goes where, how to label things (raw/draft/final), how to iterate. This is itself valuable scaffolding, but risks becoming a procrastination pattern.

---

## 5. Emotional & Motivational Patterns

### 5.1 What Energizes

The user becomes visibly more engaged (longer messages, more ideas, more questions) when discussing:
- **Systems design** -- how things connect, how agents should orchestrate
- **Finding gaps** in existing tools/frameworks ("ty frameworky byli dobre ale tezke na pochopeni")
- **Novel ideas** that connect theory to practice ("me napadlo...")
- **Understanding "why"** rather than "what" or "how"

### 5.2 What Drains

Signs of frustration or impatience appear when:
- Forced to deal with low-level technical issues (LaTeX errors, PDF indexing)
- Asked to make premature decisions ("sam v tom mam zmatek")
- Things do not work as expected: "co se deje wtf ?", "pico ja neznam nic zpameti"
- Feeling time pressure from the thesis deadline

### 5.3 Frustration Expression

Frustration is expressed directly and informally (18 frustration markers total):

> "wtf u toho explicit to je ohovne"
> "co jsme celou dobu delali wtf ?"
> "pico ja neznam nic zpameti"

But frustration is always brief -- the user immediately pivots to problem-solving after expressing it.

### 5.4 Intrinsic vs. Extrinsic Motivation

The user is **overwhelmingly intrinsically motivated**. They want to understand, not just complete:

> "ja bych se chtel naucit poradne procesy v swe a nechat at to udelaji agents"

> "chci abys me navadel a poskytoval informace a pomohal chapat veci a nechci abys mi daval hned reseni"

> "nechceme nic uzavirat chceme diskutovat prave jeste"

The extrinsic driver (thesis deadline, supervisor expectations) is acknowledged but treated as a constraint rather than a motivator:

> "ale to je vzdycky rizeni ne ? asi to je jako scope dizertacni prace"

### 5.5 Relationship to Authority (Supervisor)

The user respects the supervisor but feels somewhat underestimated:

> "prislo mi ze mi neduveruje v moje skills a ja to naprosto chapu jenom si doma hraju s nejakym kodem, a nemam pracovni zkusenosti"

> "prislo mi ze me dost podcenoval"

> "a prijde mi ze typek pochybuje o mych schopnostech ale to asi neni profesionalni tam zminovat"

They take supervisor feedback seriously ("dbal jsem na vase rady") but maintain their own vision, especially regarding scope breadth.

---

## 6. Writing Voice Characteristics

### 6.1 Voice Profile

The natural voice is:
- **Colloquial Czech** with zero formality markers
- **Fast, associative, stream-of-consciousness**
- **Question-heavy** -- the voice questions itself constantly
- **Collaborative** -- "pojdme" (let's) rather than "udělej" (do it)
- **Direct** when disagreeing, soft when requesting

### 6.2 Humor

Humor is rare but when it appears, it is self-deprecating or absurdist:

> "ja bych tam dal neco jako joke, create gpt-5 make no mistake xD"

> "Vítejte na můj kanál, kde se vám připomíná, jaké je zvyky na bakalarske praci"

### 6.3 Speech-to-Text Influence

A subset of messages (approximately 8 identified) were clearly voice-dictated, showing transcription artifacts:

> "Vzpomínám si, že Někdo něco říkal o organizační režii, že to trvá, než to jako... Ale... A to by se mělo jako měnit nějak tím, že..."

> "Software-ové engineerství je Disciplína. Která se kompletně zabývá. o vyvoj softwaru"

These voice-dictated passages reveal the most "authentic" thinking voice -- heavily paused, self-correcting, with false starts and filler words ("jako", "vlastně", "ehm").

### 6.4 Academic Voice Gap

There is a significant gap between the natural communication style (informal, associative, question-driven) and the required thesis voice (formal, structured, assertion-driven). The user is aware of this:

> "hele budu to muset přepsat celý od znovu ne pomoci LLM, llm by mi melo pomoct tomu porozumet ne to psat za me"

> "Použij prosím můj slovo stát a můj slovník, pokud je to správně pro bakalářskou práci. Chci, aby se používalo víc moje slova, protože abychom se vyhnuli nějakýmu plagiátorství."

---

## 7. Summary: Key Traits for Thesis Voice Matching

### Strengths to Preserve
1. **Systems thinking** -- the ability to see connections between concepts
2. **Critical questioning** -- nothing is accepted without interrogation
3. **Intellectual honesty** -- comfortable saying "nevím" (I don't know)
4. **Practical grounding** -- always connecting theory to real tools and experience
5. **Intuitive pattern recognition** -- often right before finding the evidence

### Patterns to Watch
1. **Scope expansion** -- needs conscious constraint; set hard boundaries early
2. **Decision deferral** -- "let's discuss more" can become indefinite; set decision deadlines
3. **Tool exploration as displacement** -- tooling setup can substitute for thesis writing
4. **Process design over execution** -- meta-work on workflow can become its own procrastination
5. **Multi-topic messages** -- in formal writing, each paragraph needs one clear point
6. **Missing explicit logical connectors** -- the leaps between ideas that work in conversation need to be made explicit in prose

### Voice Translation Rules for Thesis
- Keep the user's natural tendency for concrete examples alongside abstract claims
- Preserve the "questioning" quality by framing contributions as research questions answered
- The "vlastne" (actually) reframing habit can become "upon closer examination" in academic prose
- The "hele, me napadlo" (hey, it occurred to me) insight moments need to become "this observation suggests that..."
- Maintain the user's preference for Czech domain terms + English technical terms
- The user's natural paragraph structure is: observation -> question -> tentative answer -> request for validation. In thesis form: claim -> evidence -> analysis -> implication.
