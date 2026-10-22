# E2E Test Infra: Tu Tiên Kỳ Truyện

## Test Philosophy
- Opaque-box, requirement-driven.
- Automated testing via Node.js headless scripts, Puppeteer integration, and direct engine validation.
- Methodology: Category-Partition + Boundary Value Analysis + Pairwise Combinatorial + Adversarial Red Team stress testing.

## Feature Inventory Mapping
| # | Feature | Requirement | Tier 1 (Coverage) | Tier 2 (Boundary) | Tier 3 (Cross) | Tier 4 (Scenario) |
|---|---------|-------------|:-----------------:|:-----------------:|:--------------:|:-----------------:|
| 1 | Combat 5 Daoist Paths | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| 2 | Status Effects & DoT | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| 3 | Evasion, DR, Realm Diff | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| 4 | Monster AI & Rage | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ | ✓ |
| 5 | Alchemy Mini-game & Flame | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ | ✓ |
| 6 | Pill Quality & Explosion | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ | ✓ |
| 7 | Dược Điển & Đan Phương | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ | ✓ |
| 8 | Roguelike Dungeon (DAG) | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ | ✓ |
| 9 | Sect Hierarchy & Quests | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ | ✓ |
| 10 | Tàng Kinh Các Exchange | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ | ✓ |
| 11 | GameState Migration & Save | ORIGINAL_REQUEST §R4 | 5 | 5 | ✓ | ✓ |
| 12 | Zero-Leak & Memory Lifecycle | ORIGINAL_REQUEST §R4 | 5 | 5 | ✓ | ✓ |
| 13 | Responsive 16:9 & Syntax Health| ORIGINAL_REQUEST §R4 | 5 | 5 | ✓ | ✓ |

## Test Runner Architecture
- `test_adversarial.js`: Node test suite covering logic, math, migration, and state.
- `test_combat_sect.js`: Puppeteer end-to-end browser execution test.
- `node --check game.js`: Syntax zero-error enforcement.
