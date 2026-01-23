# Handoff 21 — Vybraný směr BP: Billing Reminder Engine + výzkum “test cheating”
Datum: 2026-01-22

## Stav rozhodnutí
- Uživatel se rozhodl upustit od “LLM Visibility Engine”, protože část problému by šla zredukovat na **structured output** a nebyla by to vhodná “hard logic” doména pro výzkum kvality testů.
- Nově zvolený testbed/praktický výstup: **Billing Reminder Engine** (dunning/reminder logika).

## Proč Billing Reminder Engine (dle uživatele)
- Má **hard logic** (state machine, časové výpočty, business days).
- Je **high-stakes** (chybné připomínky/eskalace = ztráta peněz/klienta).
- Je to **užitečné do budoucna** a přenositelné do DF.
- Má **jasné invarianty** a je vhodné pro **mutation testing**.

## Výzkumný cíl (směr)
- Fokus: jak coding agenti při psaní testů **“cheatují”** (optimalizují na “zelené testy”) a jak tomu zabránit nastavením procesu/instrukcí.
- Zamýšlené podmínky: agent s přístupem k implementaci vs agent se specifikací; případně doplňky jako test-plan šablona a adversarial reviewer agent.

## Poznámky k scope
- Doporučení: začít “core” komponentami s tvrdým ground truth (např. state machine + business days), a až potom rozšiřovat o scheduler/grace/escalation.
- Pokud je potřeba izolace od interních systémů, integraci do DF uvádět jen jako obecný příklad / future work (ne jako interní detail).


# cely handoff

# BP: Billing Reminder Engine + AI Agent Testing Research

## Kontext

Bakalářská práce o nastavení prostředí a procesů pro spolehlivou práci AI agentů s codebase. Výzkumný focus na **testování** - jak coding agenti "cheatují" při psaní testů a jak se tomu vyvarovat.

**Praktický výstup:** Billing Reminder Engine (pak se integruje do DigitalFusion)

**Výzkumný výstup:** Analýza chování AI agentů při testování, metodologie prevence cheatování

---

## Proč Billing Reminder Engine

| Kritérium | Hodnocení |
|-----------|-----------|
| **Hard logic** | ✅ State machine, časové výpočty, business days |
| **High-stakes** | ✅ Špatná připomínka = ztráta klienta nebo peněz |
| **Není outsourcované** | ✅ Fakturoid má basic, custom flow musíme sami |
| **Jasné invarianty** | ✅ Deterministické, matematicky ověřitelné |
| **Užitečné pro DF** | ✅ Issue #97, #106 to přímo potřebují |
| **Testovatelné** | ✅ Mutation testing funguje perfektně |

### Proč ne jiné projekty

| Projekt | Problém |
|---------|---------|
| LLM Visibility Engine | Není hard logic - vše dělá LLM přes structured output |
| Invoice Calculator | Fakturoid to už řeší |
| Contract State Machine | Documenso to už řeší |

---

## Billing Reminder Engine - Co to je

Systém pro automatické připomínky nezaplacených faktur a správu dunning flow.

### Use Cases

1. **Připomínky před splatností** - "Za 7 dní je splatná faktura"
2. **Připomínky po splatnosti** - "Faktura je 3 dny po splatnosti"
3. **Eskalace** - "Faktura je 30 dní po splatnosti → pozastavit služby"
4. **Grace period** - "Klient má splátkový kalendář → jiná pravidla"
5. **Business days** - "Přeskočit víkendy a svátky"

### Proč to Fakturoid/Stripe neřeší

- **Fakturoid** - má basic připomínky, ale ne custom flow, ne integrace s naším systémem
- **Stripe** - dunning jen pro card subscriptions, ne pro bankovní převody
- **Potřebujeme** - custom stavy, integrace s deal lifecycle, eskalace na člověka

---

## Architektura

```
┌─────────────────────────────────────────────────────────────────┐
│                     Pure Business Logic                         │
│                                                                 │
│  DunningStateMachine     - stavy faktury, validní přechody      │
│  ReminderScheduler       - kdy poslat jakou připomínku          │
│  GracePeriodCalculator   - výpočet grace period                 │
│  BusinessDaysCalculator  - přeskočení víkendů/svátků            │
│  EscalationRules         - kdy eskalovat na člověka             │
│  ProrationCalculator     - částečné období (bonus)              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Simple Test Harness                         │
│                     (pro BP experimenty)                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Klíčové komponenty

### 1. DunningStateMachine

```typescript
type DunningState =
  | 'current'      // faktura vystavena, před splatností
  | 'due_soon'     // blíží se splatnost (7 dní)
  | 'overdue'      // po splatnosti
  | 'grace'        // v grace period (splátkový kalendář)
  | 'suspended'    // služby pozastaveny
  | 'paid'         // zaplaceno
  | 'written_off'; // odepsáno jako nedobytné

type DunningEvent =
  | 'invoice_created'
  | 'due_date_approaching'   // 7 dní před
  | 'due_date_passed'        // den po splatnosti
  | 'reminder_sent'          // připomínka odeslána
  | 'grace_period_started'   // dohodnut splátkový kalendář
  | 'grace_period_ended'     // grace period vypršela
  | 'payment_received'       // platba přijata
  | 'write_off_approved';    // schváleno odepsání

function transition(current: DunningState, event: DunningEvent): DunningState;
function canTransition(from: DunningState, to: DunningState): boolean;
function getValidEvents(state: DunningState): DunningEvent[];
```

**Invarianty:**
- `paid` je terminální stav - žádný event ho nezmění
- `current` → `suspended` není validní (musí projít přes `overdue`)
- `payment_received` z jakéhokoliv stavu → `paid`

### 2. ReminderScheduler

```typescript
interface ReminderConfig {
  beforeDue: number[];    // [7, 3, 1] = 7, 3, 1 den před
  afterDue: number[];     // [1, 3, 7, 14, 30] = 1, 3, 7, 14, 30 dní po
  useBusinessDays: boolean;
}

interface ScheduledReminder {
  type: 'before_due' | 'after_due' | 'escalation';
  scheduledFor: Date;
  invoiceId: string;
}

function getNextReminder(invoice: Invoice, config: ReminderConfig, now: Date): ScheduledReminder | null;
function getReminderSchedule(invoice: Invoice, config: ReminderConfig): ScheduledReminder[];
function shouldSendReminder(invoice: Invoice, reminderType: string, now: Date): boolean;
```

**Invarianty:**
- Zaplacená faktura → žádné další připomínky
- Připomínka se nepošle dvakrát (deduplikace)
- Pořadí: before_due → after_due → escalation

### 3. BusinessDaysCalculator

```typescript
interface BusinessDaysConfig {
  workdays: number[];           // [1,2,3,4,5] = Po-Pá
  holidays: Date[];             // seznam svátků
  timezone: string;             // 'Europe/Prague'
}

function addBusinessDays(date: Date, days: number, config: BusinessDaysConfig): Date;
function subtractBusinessDays(date: Date, days: number, config: BusinessDaysConfig): Date;
function isBusinessDay(date: Date, config: BusinessDaysConfig): boolean;
function getBusinessDaysBetween(start: Date, end: Date, config: BusinessDaysConfig): number;
```

**Invarianty:**
- `addBusinessDays(friday, 1)` = pondělí (přeskočí víkend)
- `addBusinessDays(date, 0)` = date (nebo další business day pokud není)
- `getBusinessDaysBetween(monday, friday)` = 5

### 4. GracePeriodCalculator

```typescript
interface GracePeriod {
  startDate: Date;
  endDate: Date;
  reason: 'payment_plan' | 'negotiation' | 'dispute';
  installments?: number;
}

function calculateGracePeriod(invoice: Invoice, config: GracePeriodConfig): GracePeriod;
function isInGracePeriod(invoice: Invoice, now: Date): boolean;
function getGraceEndDate(invoice: Invoice): Date | null;
```

### 5. EscalationRules

```typescript
type EscalationAction =
  | 'send_reminder'
  | 'send_final_warning'
  | 'suspend_service'
  | 'notify_human'
  | 'start_collection';

interface EscalationRule {
  condition: (invoice: Invoice, now: Date) => boolean;
  action: EscalationAction;
  priority: number;
}

function getEscalationAction(invoice: Invoice, now: Date, rules: EscalationRule[]): EscalationAction | null;
function shouldEscalateToHuman(invoice: Invoice, now: Date): boolean;
```

**Invarianty:**
- `> 30 dní overdue` → vždy `notify_human`
- `invoice.hasPaymentPlan` → nikdy `suspend_service`
- Pravidla se evaluují podle priority

---

## Příklady invariantů pro testy

```typescript
// === State Machine ===
// Validní přechody
assert(transition('current', 'due_date_approaching') === 'due_soon');
assert(transition('overdue', 'payment_received') === 'paid');

// Nevalidní přechody (zůstává ve stejném stavu)
assert(transition('paid', 'due_date_passed') === 'paid');
assert(transition('current', 'grace_period_ended') === 'current');

// Terminální stav
assert(transition('paid', 'any_event') === 'paid');
assert(transition('written_off', 'payment_received') === 'written_off');

// === Business Days ===
// Víkend
const friday = new Date('2026-01-23'); // pátek
const monday = new Date('2026-01-26'); // pondělí
assert(addBusinessDays(friday, 1, config).equals(monday));

// Svátek (1.1.)
const dec31 = new Date('2025-12-31'); // středa
const jan2 = new Date('2026-01-02');  // pátek
assert(addBusinessDays(dec31, 1, configWithHolidays).equals(jan2));

// Záporné dny
assert(subtractBusinessDays(monday, 1, config).equals(friday));

// === Reminder Scheduling ===
const invoice = { dueDate: new Date('2026-02-01'), status: 'current' };

// 7 dní před
assert(shouldSendReminder(invoice, 'before_7', new Date('2026-01-25')) === true);

// Po zaplacení - žádné připomínky
const paidInvoice = { ...invoice, status: 'paid' };
assert(getNextReminder(paidInvoice, config, now) === null);

// === Escalation ===
const overdueInvoice = { daysOverdue: 35, hasPaymentPlan: false };
assert(shouldEscalateToHuman(overdueInvoice, now) === true);

const withPaymentPlan = { daysOverdue: 35, hasPaymentPlan: true };
assert(getEscalationAction(withPaymentPlan, now, rules) !== 'suspend_service');
```

---

## BP Výzkum: AI Agent Testing

### Problém

Když AI agent píše testy a **vidí implementaci**, může "cheatovat":

| Typ cheatu | Popis | Příklad |
|------------|-------|---------|
| **Triviální assertions** | Test vždy projde | `expect(true).toBe(true)` |
| **Tautologie** | Kopíruje logiku z kódu | Test opakuje if/else z implementace |
| **Hardcoded values** | Testuje jen konkrétní hodnoty z kódu | `expect(result).toBe(7)` bez důvodu proč 7 |
| **Missing edge cases** | Chybí hraničí případy | Žádné testy pro víkend, svátek, empty input |
| **Missing negative tests** | Chybí testy co NEMÁ fungovat | Žádné testy pro nevalidní přechody |

### Příklad cheatu na DunningStateMachine

**Implementace:**
```typescript
function transition(current: DunningState, event: DunningEvent): DunningState {
  if (current === 'paid') return 'paid'; // terminal

  const transitions = {
    current: { due_date_approaching: 'due_soon', payment_received: 'paid' },
    due_soon: { due_date_passed: 'overdue', payment_received: 'paid' },
    overdue: { grace_period_started: 'grace', payment_received: 'paid' },
    // ...
  };

  return transitions[current]?.[event] ?? current;
}
```

**Cheat test (agent vidí implementaci):**
```typescript
test('transition works', () => {
  // Agent vidí že 'current' + 'due_date_approaching' = 'due_soon'
  expect(transition('current', 'due_date_approaching')).toBe('due_soon');
  // Žádné edge cases, žádné negative tests
});
```

**Správný test (agent vidí jen specifikaci):**
```typescript
describe('DunningStateMachine', () => {
  describe('valid transitions', () => {
    test('current → due_soon when due date approaches', () => {
      expect(transition('current', 'due_date_approaching')).toBe('due_soon');
    });

    test('any state → paid when payment received', () => {
      const states: DunningState[] = ['current', 'due_soon', 'overdue', 'grace'];
      states.forEach(state => {
        expect(transition(state, 'payment_received')).toBe('paid');
      });
    });
  });

  describe('invalid transitions (state unchanged)', () => {
    test('current cannot skip to suspended', () => {
      expect(transition('current', 'grace_period_ended')).toBe('current');
    });

    test('paid is terminal - no event changes it', () => {
      const events: DunningEvent[] = ['due_date_passed', 'grace_period_ended'];
      events.forEach(event => {
        expect(transition('paid', event)).toBe('paid');
      });
    });
  });

  describe('edge cases', () => {
    test('handles unknown event gracefully', () => {
      expect(transition('current', 'unknown_event' as any)).toBe('current');
    });
  });
});
```

### Experimenty

```
A:  Agent má implementaci + specifikaci
    → baseline "jak moc cheatuje"

B1: Agent má jen specifikaci (interface + docs)
    → izolace pomáhá?

B2: Agent má specifikaci + test-plan šablonu
    → strukturované zadání pomáhá?

B3: Agent má specifikaci + adversarial reviewer (druhý agent)
    → peer review pomáhá?
```

### Metriky

| Metrika | Co měří |
|---------|---------|
| **Mutation score** | Kolik mutantů test zabije (vyšší = lepší) |
| **Edge case coverage** | Má testy pro hraničí případy? |
| **Negative test ratio** | Poměr testů "co NEMÁ fungovat" |
| **Cheat pattern count** | Kolik cheatů z taxonomie obsahuje |

---

## Struktura BP repo

```
billing-reminder-engine/
├── src/
│   ├── domain/                    ← PŘENOSITELNÁ LOGIKA
│   │   ├── dunning-state-machine.ts
│   │   ├── reminder-scheduler.ts
│   │   ├── business-days-calculator.ts
│   │   ├── grace-period-calculator.ts
│   │   ├── escalation-rules.ts
│   │   └── index.ts
│   │
│   ├── types/
│   │   └── index.ts               ← typy, interfaces
│   │
│   └── config/
│       ├── holidays-cz.ts         ← české svátky
│       └── default-config.ts
│
├── specs/                         ← SPECIFIKACE PRO AGENTA (bez implementace)
│   ├── dunning-state-machine.md
│   ├── reminder-scheduler.md
│   ├── business-days-calculator.md
│   └── ...
│
├── tests/                         ← GENEROVANÉ AGENTEM
│   ├── agent-with-impl/           ← experiment A
│   ├── agent-spec-only/           ← experiment B1
│   ├── agent-with-template/       ← experiment B2
│   └── agent-with-reviewer/       ← experiment B3
│
├── evaluation/                    ← EVALUACE TESTŮ
│   ├── mutation-testing/
│   ├── cheat-detection/
│   └── reports/
│
├── docs/
│   └── thesis/                    ← BP text
│
└── README.md
```

---

## Integrace do DigitalFusion (po BP)

```typescript
// handlers/invoice/check-due-invoices.ts (scheduler job)
async function checkDueInvoices() {
  const invoices = await invoiceRepository.findPending();
  const now = new Date();

  for (const invoice of invoices) {
    // PURE LOGIC (z BP)
    const shouldRemind = shouldSendReminder(invoice, 'before_7', now);

    if (shouldRemind) {
      await emit('ReminderDue', {
        invoiceId: invoice.id,
        type: 'before_due_7'
      });
    }
  }
}

// handlers/invoice/payment-overdue.ts
async function handlePaymentOverdue(event: Event) {
  const { invoiceId } = event.payload;
  const invoice = await invoiceRepository.get(invoiceId);

  // PURE LOGIC (z BP)
  const nextState = transition(invoice.dunningState, 'due_date_passed');
  const escalation = getEscalationAction(invoice, new Date(), rules);

  await invoiceRepository.update(invoiceId, { dunningState: nextState });

  if (escalation === 'notify_human') {
    await emitFromHandler('RequestHumanReview', {
      title: 'Faktura vyžaduje pozornost',
      invoiceId,
      reason: 'overdue_30_days'
    }, event);
  }
}
```

---

## BP Struktura (kapitoly)

1. **Úvod**
   - AI agenti v softwarovém vývoji
   - Problém kvality AI-generovaných testů

2. **Teoretický rámec**
   - Taxonomie "cheatování" při generování testů
   - Mutation testing jako metrika kvality
   - Existující přístupy k AI-assisted testing

3. **Metodologie**
   - Case study: Billing Reminder Engine
   - Experimentální setup (A, B1, B2, B3)
   - Evaluační metriky

4. **Implementace**
   - Billing Reminder Engine (domain logic)
   - Specifikace pro agenta
   - Mutation testing pipeline

5. **Experimenty a výsledky**
   - Porovnání A vs B1 vs B2 vs B3
   - Detekované cheat patterns
   - Kvantitativní analýza

6. **Diskuze**
   - Interpretace výsledků
   - Limity studie
   - Praktická doporučení

7. **Závěr**
   - Best practices pro agentní testování
   - Budoucí práce

---

## Metadata

**Název BP:** "Kvalita testů generovaných AI coding agenty: analýza a prevence cheatování"

**Abstrakt:**
> Práce zkoumá chování AI coding agentů při generování testů pro softwarové projekty. Na případové studii Billing Reminder Engine - systému pro správu platebních připomínek - analyzujeme, kdy a jak agenti "cheatují" při psaní testů (triviální assertions, tautologické testy, chybějící edge cases). Pomocí mutation testingu měříme kvalitu generovaných testů a porovnáváme různé přístupy: agent s přístupem k implementaci vs. agent s pouze specifikací. Navrhujeme metodologii pro detekci problémů a doporučení pro nastavení prostředí, které cheatování minimalizuje.

**Klíčová slova:** AI agenti, testování softwaru, mutation testing, kvalita kódu, software engineering, dunning, billing

**Časový odhad:** 2-3 měsíce

---

## Výstupy

1. **Billing Reminder Engine** (funkční knihovna)
   - DunningStateMachine
   - ReminderScheduler
   - BusinessDaysCalculator
   - GracePeriodCalculator
   - EscalationRules

2. **Specifikace** (dokumenty pro agenta bez implementace)

3. **Test suites** (generované agentem v různých podmínkách)

4. **Evaluační framework** (mutation testing + cheat detection)

5. **BP text** s analýzou a doporučeními

6. **Integrace do DigitalFusion** (event handlers)

---

## Další kroky

1. [ ] Založit BP repo (billing-reminder-engine)
2. [ ] Napsat specifikace komponent (bez implementace!)
3. [ ] Implementovat domain logiku
4. [ ] Nastavit mutation testing (Stryker nebo custom)
5. [ ] Experiment A: agent s implementací píše testy
6. [ ] Experiment B1: agent jen se specifikací píše testy
7. [ ] Experiment B2: agent se specifikací + template
8. [ ] Experiment B3: agent + adversarial reviewer
9. [ ] Analyzovat výsledky
10. [ ] Napsat BP text

---

## Reference

- GitHub Issue #97 (Platební připomínky)
- GitHub Issue #106 (Care Phase - Renewal)
- Stryker Mutation Testing: https://stryker-mutator.io/
