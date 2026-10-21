/**
 * ============================================================================
 * TU TIÊN KỲ TRUYỆN: THIÊN ĐẠO LUÂN HỒI
 * Web Game Tu Tiên Thế Giới Mở (2D Pixel Art UI/Scene RPG + Turn-based Combat)
 * 100% Procedural Pixel Art trên Canvas - Chạy trực tiếp trên mọi trình duyệt
 * ============================================================================
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. PROCEDURAL PIXEL SPRITES & RENDER HELPER
  // ==========================================================================
  const SPRITES = {
    // 1. Nhân vật đả tọa (16x16)
    playerMeditate: {
      w: 16, h: 16,
      palette: {
        '.': null,
        'B': '#090d16', 'S': '#fcd34d', 'G': '#f59e0b',
        'W': '#f8fafc', 'C': '#0284c7', 'D': '#1e293b', 'L': '#38bdf8'
      },
      data: [
        "......GGGG......",
        ".....BBBBBB.....",
        ".....BBBBBB.....",
        "....BBSSSSBB....",
        "....BSSSSSSB....",
        "....B.S..S.B....",
        "....B.SSSS.B....",
        ".....WWWWWW.....",
        "....WWWCWWWW....",
        "...WWWWLWWWWW...",
        "...WWWWWWWWWW...",
        "..WWW.WWWW.WWW..",
        "..WW..CCCC..WW..",
        ".DD...SSSS...DD.",
        "WWWWWWWWWWWWWWWW",
        "DDDDDDDDDDDDDDDD"
      ]
    },

    // 2. Nhân vật chiến đấu (16x16)
    playerBattle: {
      w: 16, h: 16,
      palette: {
        '.': null,
        'B': '#090d16', 'G': '#fbbf24', 'S': '#fde047',
        'W': '#f1f5f9', 'C': '#0369a1', 'K': '#38bdf8',
        'M': '#cbd5e1', 'H': '#d97706'
      },
      data: [
        "......GG........",
        ".....BBBB.......",
        "....BBSSSS......",
        "....B.S..S......",
        "....B.SSSS......",
        ".....WWCC.......",
        "....WWCCCC..K...",
        "..WWWWCCCC.KMK..",
        "..S.WWWWWW.KMK..",
        "....WW.WW..KMK..",
        "...WWW.WWW.KMK..",
        "...WW...WW..H...",
        "..SW.....WS.S...",
        "..BB.....BB.....",
        ".BBB.....BBB....",
        "................"
      ]
    },

    // 3. Yêu Lang (16x16)
    monsterWolf: {
      w: 16, h: 16,
      palette: {
        '.': null,
        'G': '#475569', 'D': '#1e293b', 'L': '#94a3b8',
        'R': '#ef4444', 'W': '#ffffff', 'B': '#0f172a'
      },
      data: [
        "....DD.....DD...",
        "...DGG.....GGD..",
        "..DGGGD...DGGGD.",
        "..DGGGGDDDGGLD..",
        "..DGGGRDDDRGLD..",
        "..DGGGGWWWGGGD..",
        "..DGGGGGGGGGGGD.",
        ".DGGGGGGGGGGGGGD",
        ".DGGGGGGGGGGGGGD",
        "DDGGGGGGGGGGGGDD",
        ".DGGGGGGGGGGGGGD",
        "..DGGGD..DGGGD..",
        "..DGGD....DGGD..",
        "..DGG......GG...",
        "..DWD......DWD..",
        "................"
      ]
    },

    // 4. Xích Diễm Hổ (16x16)
    monsterTiger: {
      w: 16, h: 16,
      palette: {
        '.': null,
        'O': '#f97316', 'R': '#dc2626', 'B': '#18181b',
        'Y': '#fde047', 'W': '#ffffff', 'F': '#fbbf24'
      },
      data: [
        "..B..B.....B..B.",
        ".BOOOB.....BOOOB",
        ".BOBOOBBBBBOBOOB",
        "..BOOOOYOYOOOOB.",
        "..BOOOWWWWWOOOB.",
        "...BOOBBBBOOB...",
        "..FROOOOOOOORF..",
        ".FROOOBBOBBOORF.",
        "RROOOOOOOOOOOORR",
        ".RROOOOBBBOOOORR",
        "..RROOOOOOOORR..",
        "...ROO.....OOR..",
        "...RO.......OR..",
        "...RO.......OR..",
        "...WW.......WW..",
        "................"
      ]
    },

    // 5. Huyết Ma Tà Tu (16x16)
    monsterCultist: {
      w: 16, h: 16,
      palette: {
        '.': null,
        'D': '#09090b', 'R': '#991b1b', 'B': '#ef4444',
        'S': '#e2e8f0', 'P': '#7e22ce'
      },
      data: [
        "......DDDD......",
        ".....DDDDDD.....",
        "....DDDSSSDD....",
        "...DDDSBSBSDD...",
        "...DDDSSSSSDD...",
        "....DDDSRSDDD...",
        "...PPDDDDDDDPP..",
        "..PPDDRRRRDDDPP.",
        "..PDDRRRRRRDDP..",
        "..PDDRRRRRRDDP..",
        "..PDDRDRRDRDDP..",
        "..PDDDDDDDDDDP..",
        "...DDD.DD.DDD...",
        "...DD..DD..DD...",
        "...DD..DD..DD...",
        "..PPP......PPP.."
      ]
    },

    // 6. Cổ Thụ Yêu (16x16)
    monsterTree: {
      w: 16, h: 16,
      palette: {
        '.': null,
        'G': '#166534', 'L': '#22c55e', 'B': '#451a03',
        'D': '#78350f', 'R': '#ef4444', 'P': '#a855f7'
      },
      data: [
        "....GGGGGGGG....",
        "...GGLGGLLGGGG..",
        "..GGLLGGGGLLGGG.",
        ".GGGGLLGGGGGGGGG",
        ".GGGGPPGGPPGGGGG",
        "..GGGPPGGPPGGGG.",
        "....GGDBBDGG....",
        "....DDBBBDDD....",
        "...DDBRDBRDDB...",
        "...DDBBDDBBDD...",
        "...DDBBBBBBDD...",
        "..DDDBBDBBBDDD..",
        ".DDDDDBBBBDDDDD.",
        "DDD..DDBBDD..DDD",
        "DD....DBBD....DD",
        "......BBBB......"
      ]
    },

    // 7. Cổ Giao Long (24x24)
    monsterDragon: {
      w: 24, h: 24,
      palette: {
        '.': null,
        'C': '#065f46', 'E': '#10b981', 'G': '#34d399',
        'Y': '#facc15', 'W': '#ffffff', 'R': '#f87171',
        'H': '#fbbf24', 'B': '#064e3b'
      },
      data: [
        ".........HH..HH.........",
        "........HHH..HHH........",
        ".......HHCCBBCC.........",
        "......HHCCECCEEBB.......",
        ".....HHCEEECCEEEBB......",
        "....HHCEEYECCYEEBB......",
        "...HHCCEEEECCEEEEBB.....",
        "..HHCCEEEEWRWWEEEBB.....",
        "..HHCCEEEEWRWWEEEBB.....",
        "...HHCCEEEEWWEEEBB......",
        "....BBCCEEEEEEEBB.......",
        ".....BBBCCEEEEBB........",
        "......BBBCEEECCBB.......",
        ".......BBCEEEECCBB......",
        "......BBCCEEEEEECCBB....",
        "....BBCCEEEEEEEEEECCBB..",
        "...BBCEEECCCCCCEEEEECCB.",
        "..BBCEECCBB..BBCCEEEECCB",
        ".BBCEECCB......BBCEEEECC",
        "BBCEECCB........BBCEEEEC",
        "BCEECCB..........BBCEEEC",
        "BCEECB............BBCEEC",
        "BBCCB..............BBCCB",
        ".BBB................BBB."
      ]
    },

    // 8. Khôi Lỗi Cự Nhân (16x16)
    monsterGolem: {
      w: 16, h: 16,
      palette: {
        '.': null,
        'S': '#64748b', 'D': '#334155', 'G': '#fbbf24',
        'B': '#0284c7', 'R': '#475569'
      },
      data: [
        "....SSSSSSSS....",
        "...SDDDDDDDDDS...",
        "...SDBBSSDDBDS...",
        "...SDSSSSDSSDS...",
        "...SDSSGGSSSDS...",
        "....SSSSSSSS....",
        "..SSSDDDGDDDSS..",
        ".SSSSDDSGSDSSSSS",
        ".SSSSDDSGSDSSSSS",
        ".SSSSDDSGSDSSSSS",
        "..SSSDDDDDDDSSS.",
        "...SSSDDDDDDSSS.",
        "...SSD......DSS.",
        "...SSD......DSS.",
        "..SSSD......DSSS",
        "..SSSS......SSSS"
      ]
    },

    // Cảnh vật
    sceneMountain: {
      w: 24, h: 16,
      palette: {
        '.': null,
        'S': '#ffffff', 'C': '#38bdf8', 'M': '#334155',
        'D': '#1e293b', 'W': '#f8fafc', 'G': '#166534'
      },
      data: [
        "...........SS...........",
        "..........SSSS..........",
        ".........SSSSSS.........",
        "........SSMMMMSS........",
        ".......SSMMMMMMSS.......",
        "......SSMMGGMMMMSS......",
        ".....SSMMGGGMMMMMMS.....",
        "....WWSSMMMMMMMMMMMSW...",
        "...WWWWMMMMMMGGMMMMMW...",
        "..WWWWWWMMMMGGGGMMMWWW..",
        ".WW..WWMMMMMMMMMMMMW.WW.",
        ".....WWMMMMMMMMMMMMWW...",
        "....DDDDMMMMMMMMMMDDDD..",
        "...DDDDDDDDDDDDDDDDDDDD.",
        "..DDDDDDDDDDDDDDDDDDDDDD",
        "DDDDDDDDDDDDDDDDDDDDDDDD"
      ]
    },

    scenePine: {
      w: 16, h: 16,
      palette: {
        '.': null,
        'G': '#15803d', 'L': '#4ade80', 'B': '#78350f', 'D': '#451a03'
      },
      data: [
        ".......GG.......",
        "......GGGG......",
        ".....GLGGGG.....",
        "....GGLGGGGG....",
        ".....GGGGGG.....",
        "....GGGGGGGG....",
        "...GLGGGGGGGG...",
        "..GGLGGGGGGGGG..",
        "....GGGGGGGG....",
        "...GGGGGGGGGG...",
        "..GLGGGGGGGGGG..",
        "......DDDBB.....",
        ".....DDBBB......",
        ".....DDBB.......",
        "....DDDBB.......",
        "...DDDDDBBB....."
      ]
    },

    sceneCushion: {
      w: 16, h: 8,
      palette: {
        '.': null,
        'Y': '#facc15', 'O': '#d97706', 'B': '#78350f', 'W': '#fef08a'
      },
      data: [
        "....WWWWWWWW....",
        "..WWYYYYYYYYWW..",
        ".WYYYYYYYYYYYYW.",
        ".YYYYYYYYYYYYYY.",
        "OOOOOOOOOOOOOOOO",
        ".OOOOOOOOOOOOOO.",
        "..BBBBBBBBBBBB..",
        "....BBBBBBBB...."
      ]
    },

    sceneFurnace: {
      w: 16, h: 16,
      palette: {
        '.': null,
        'F': '#ef4444', 'Y': '#fbbf24', 'B': '#b45309',
        'D': '#78350f', 'W': '#f8fafc', 'Q': '#38bdf8'
      },
      data: [
        ".....WW...WW....",
        "......WW.WW.....",
        ".......WWW......",
        "......BBBB......",
        ".....BBDDDB.....",
        "....BBBDDDBB....",
        "...BBBBBBBBBB...",
        "..BBBBQQQQBBBB..",
        "..BBBBQFFQBBBB..",
        "..BBBBQYYQBBBB..",
        "..BBBBBBBBBBBB..",
        "...BBBDDDBBBB...",
        "....BBDDDBBB....",
        "....BB.BB.BB....",
        "...DD..DD..DD...",
        "...DD..DD..DD..."
      ]
    },

    sceneMoon: {
      w: 16, h: 16,
      palette: {
        '.': null,
        'Y': '#fef08a', 'M': '#facc15', 'W': '#ffffff', 'C': '#ca8a04'
      },
      data: [
        "......YYYY......",
        "....YYMMMMYY....",
        "...YMMMMMMMMY...",
        "..YMMWWMMMMMMY..",
        ".YMMWWWWMMCCMMY.",
        ".YMMWWWWMMCCMMY.",
        "YMMMWWMMMMMMMMMY",
        "YMMMMMMMMCCMMMMY",
        "YMMMMMMMMCCMMMMY",
        "YMMCCMMMMMMMMMMY",
        ".YMMCCMMMMMMMMY.",
        ".YMMMMMMMMMMMMY.",
        "..YMMMMMMMMMMY..",
        "...YMMMMMMMMY...",
        "....YYMMMMYY....",
        "......YYYY......"
      ]
    }
  };

  function drawPixelSprite(ctx, sprite, x, y, scale = 3, flipH = false, flashColor = null) {
    if (!sprite || !sprite.data) return;
    ctx.save();
    if (flipH) {
      ctx.translate(x + sprite.w * scale, y);
      ctx.scale(-1, 1);
    } else {
      ctx.translate(x, y);
    }
    for (let r = 0; r < sprite.h; r++) {
      const rowStr = sprite.data[r];
      if (!rowStr) continue;
      for (let c = 0; c < sprite.w; c++) {
        const char = rowStr[c];
        const color = sprite.palette[char];
        if (color) {
          ctx.fillStyle = flashColor ? flashColor : color;
          ctx.fillRect(c * scale, r * scale, scale, scale);
        }
      }
    }
    ctx.restore();
  }

  function drawProceduralLightning(ctx, x1, y1, x2, y2, branches = 3, color = '#38bdf8', width = 3) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.shadowColor = '#67e8f9';
    ctx.shadowBlur = 12;

    const drawSegment = (startX, startY, endX, endY, depth) => {
      if (depth <= 0) {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        return;
      }
      const midX = (startX + endX) / 2 + (Math.random() - 0.5) * 35;
      const midY = (startY + endY) / 2 + (Math.random() - 0.5) * 15;
      drawSegment(startX, startY, midX, midY, depth - 1);
      drawSegment(midX, midY, endX, endY, depth - 1);
      if (Math.random() < 0.4) {
        const branchEndX = midX + (Math.random() - 0.5) * 40;
        const branchEndY = midY + Math.random() * 30;
        drawSegment(midX, midY, branchEndX, branchEndY, depth - 2);
      }
    };

    drawSegment(x1, y1, x2, y2, branches);
    ctx.restore();
  }

  // ==========================================================================
  // 2. PROCEDURAL SOUND SYNTHESIZER (WEB AUDIO API)
  // ==========================================================================
  class SoundSystem {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggleSound() {
      this.enabled = !this.enabled;
      return this.enabled;
    }

    playMeditateDing() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.exponentialRampToValueAtTime(1760, t + 0.1);
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.6);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.8);
    }

    playSwordSlash() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(700, t);
      osc.frequency.exponentialRampToValueAtTime(120, t + 0.15);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.2);
    }

    playThunder() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.8;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1;

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, t);
      filter.frequency.exponentialRampToValueAtTime(60, t + 0.7);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + 0.8);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      whiteNoise.start(t);
      whiteNoise.stop(t + 0.8);
    }

    playBreakthrough() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        const t = this.ctx.currentTime + i * 0.1;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.7);
      });
    }

    playLoot() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, t);
      osc.frequency.setValueAtTime(1318.51, t + 0.08);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.3);
    }

    playCheatSystem() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const notes = [440, 554.37, 659.25, 880, 1108.73];
      notes.forEach((freq, idx) => {
        const t = this.ctx.currentTime + idx * 0.07;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.002, t + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.4);
      });
    }

    playClick() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(160, t + 0.05);
      gain.gain.setValueAtTime(0.08, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.05);
    }

    playHurt() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.exponentialRampToValueAtTime(50, t + 0.2);
      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    }
  }

  const sound = new SoundSystem();

  // ==========================================================================
  // 3. GAME DATA (CẢNH GIỚI, LINH CĂN, THỂ CHẤT, KIM THỦ CHỈ, THẾ GIỚI)
  // ==========================================================================
  const REALMS = [
    // Luyện Khí 1 -> 10
    { id: 'lk_1', name: 'Luyện Khí Tầng 1', major: 'Luyện Khí', minor: 'Tầng 1', maxExp: 100, hp: 150, mp: 60, atk: 25, def: 12, spd: 15, lifespan: 100, rate: 0.95 },
    { id: 'lk_2', name: 'Luyện Khí Tầng 2', major: 'Luyện Khí', minor: 'Tầng 2', maxExp: 220, hp: 200, mp: 85, atk: 35, def: 18, spd: 18, lifespan: 100, rate: 0.92 },
    { id: 'lk_3', name: 'Luyện Khí Tầng 3', major: 'Luyện Khí', minor: 'Tầng 3', maxExp: 380, hp: 260, mp: 110, atk: 48, def: 25, spd: 22, lifespan: 100, rate: 0.90 },
    { id: 'lk_4', name: 'Luyện Khí Tầng 4', major: 'Luyện Khí', minor: 'Tầng 4', maxExp: 600, hp: 340, mp: 140, atk: 65, def: 34, spd: 26, lifespan: 100, rate: 0.88 },
    { id: 'lk_5', name: 'Luyện Khí Tầng 5', major: 'Luyện Khí', minor: 'Tầng 5', maxExp: 900, hp: 440, mp: 180, atk: 85, def: 45, spd: 30, lifespan: 105, rate: 0.85 },
    { id: 'lk_6', name: 'Luyện Khí Tầng 6', major: 'Luyện Khí', minor: 'Tầng 6', maxExp: 1300, hp: 560, mp: 230, atk: 110, def: 58, spd: 35, lifespan: 105, rate: 0.82 },
    { id: 'lk_7', name: 'Luyện Khí Tầng 7', major: 'Luyện Khí', minor: 'Tầng 7', maxExp: 1800, hp: 700, mp: 290, atk: 140, def: 74, spd: 40, lifespan: 110, rate: 0.80 },
    { id: 'lk_8', name: 'Luyện Khí Tầng 8', major: 'Luyện Khí', minor: 'Tầng 8', maxExp: 2500, hp: 860, mp: 360, atk: 180, def: 95, spd: 46, lifespan: 110, rate: 0.76 },
    { id: 'lk_9', name: 'Luyện Khí Tầng 9', major: 'Luyện Khí', minor: 'Tầng 9', maxExp: 3400, hp: 1050, mp: 450, atk: 230, def: 120, spd: 52, lifespan: 115, rate: 0.72 },
    { id: 'lk_10', name: 'Luyện Khí Đỉnh Phong', major: 'Luyện Khí', minor: 'Đỉnh Phong', maxExp: 5000, hp: 1300, mp: 560, atk: 290, def: 155, spd: 60, lifespan: 120, rate: 0.60, isMajorBreakthrough: true, pillNeeded: 'Trúc Cơ Đan' },

    // Trúc Cơ
    { id: 'tc_1', name: 'Trúc Cơ Sơ Kỳ', major: 'Trúc Cơ', minor: 'Sơ Kỳ', maxExp: 8000, hp: 2000, mp: 800, atk: 420, def: 230, spd: 75, lifespan: 200, rate: 0.70 },
    { id: 'tc_2', name: 'Trúc Cơ Trung Kỳ', major: 'Trúc Cơ', minor: 'Trung Kỳ', maxExp: 13000, hp: 3000, mp: 1200, atk: 600, def: 330, spd: 90, lifespan: 220, rate: 0.65 },
    { id: 'tc_3', name: 'Trúc Cơ Hậu Kỳ', major: 'Trúc Cơ', minor: 'Hậu Kỳ', maxExp: 20000, hp: 4400, mp: 1700, atk: 850, def: 470, spd: 110, lifespan: 240, rate: 0.60 },
    { id: 'tc_4', name: 'Trúc Cơ Đỉnh Phong', major: 'Trúc Cơ', minor: 'Đỉnh Phong', maxExp: 32000, hp: 6200, mp: 2400, atk: 1200, def: 650, spd: 135, lifespan: 260, rate: 0.50, isMajorBreakthrough: true, pillNeeded: 'Kim Đan Hóa Thần Hoàn' },

    // Kim Đan
    { id: 'kd_1', name: 'Kim Đan Sơ Kỳ', major: 'Kim Đan', minor: 'Sơ Kỳ', maxExp: 50000, hp: 9500, mp: 3500, atk: 1800, def: 980, spd: 165, lifespan: 500, rate: 0.60 },
    { id: 'kd_2', name: 'Kim Đan Trung Kỳ', major: 'Kim Đan', minor: 'Trung Kỳ', maxExp: 78000, hp: 14000, mp: 5000, atk: 2600, def: 1400, spd: 200, lifespan: 550, rate: 0.55 },
    { id: 'kd_3', name: 'Kim Đan Hậu Kỳ', major: 'Kim Đan', minor: 'Hậu Kỳ', maxExp: 120000, hp: 20000, mp: 7000, atk: 3700, def: 2000, spd: 240, lifespan: 600, rate: 0.50 },
    { id: 'kd_4', name: 'Kim Đan Đỉnh Phong', major: 'Kim Đan', minor: 'Đỉnh Phong', maxExp: 180000, hp: 28000, mp: 9800, atk: 5200, def: 2800, spd: 290, lifespan: 650, rate: 0.42, isMajorBreakthrough: true, pillNeeded: 'Ngưng Anh Đan' },

    // Nguyên Anh
    { id: 'na_1', name: 'Nguyên Anh Sơ Kỳ', major: 'Nguyên Anh', minor: 'Sơ Kỳ', maxExp: 280000, hp: 40000, mp: 14000, atk: 7500, def: 4000, spd: 350, lifespan: 1000, rate: 0.50 },
    { id: 'na_2', name: 'Nguyên Anh Trung Kỳ', major: 'Nguyên Anh', minor: 'Trung Kỳ', maxExp: 420000, hp: 58000, mp: 20000, atk: 10500, def: 5600, spd: 420, lifespan: 1100, rate: 0.46 },
    { id: 'na_3', name: 'Nguyên Anh Hậu Kỳ', major: 'Nguyên Anh', minor: 'Hậu Kỳ', maxExp: 620000, hp: 82000, mp: 28000, atk: 14500, def: 7800, spd: 500, lifespan: 1200, rate: 0.42 },
    { id: 'na_4', name: 'Nguyên Anh Đỉnh Phong', major: 'Nguyên Anh', minor: 'Đỉnh Phong', maxExp: 900000, hp: 115000, mp: 38000, atk: 20000, def: 10500, spd: 600, lifespan: 1300, rate: 0.35, isMajorBreakthrough: true, pillNeeded: 'Hóa Thần Đan' },

    // Hóa Thần
    { id: 'ht_1', name: 'Hóa Thần Sơ Kỳ', major: 'Hóa Thần', minor: 'Sơ Kỳ', maxExp: 1400000, hp: 160000, mp: 52000, atk: 28000, def: 14500, spd: 720, lifespan: 2500, rate: 0.45 },
    { id: 'ht_2', name: 'Hóa Thần Trung Kỳ', major: 'Hóa Thần', minor: 'Trung Kỳ', maxExp: 2100000, hp: 220000, mp: 70000, atk: 38000, def: 20000, spd: 850, lifespan: 2700, rate: 0.40 },
    { id: 'ht_3', name: 'Hóa Thần Hậu Kỳ', major: 'Hóa Thần', minor: 'Hậu Kỳ', maxExp: 3100000, hp: 300000, mp: 95000, atk: 52000, def: 27000, spd: 1000, lifespan: 2900, rate: 0.36 },
    { id: 'ht_4', name: 'Hóa Thần Đỉnh Phong', major: 'Hóa Thần', minor: 'Đỉnh Phong', maxExp: 4500000, hp: 420000, mp: 130000, atk: 70000, def: 36000, spd: 1200, lifespan: 3200, rate: 0.30, isMajorBreakthrough: true, pillNeeded: 'Hư Thiên Đan' },

    // Luyện Hư
    { id: 'lh_1', name: 'Luyện Hư Sơ Kỳ', major: 'Luyện Hư', minor: 'Sơ Kỳ', maxExp: 6500000, hp: 580000, mp: 180000, atk: 95000, def: 49000, spd: 1450, lifespan: 5000, rate: 0.40 },
    { id: 'lh_2', name: 'Luyện Hư Trung Kỳ', major: 'Luyện Hư', minor: 'Trung Kỳ', maxExp: 9200000, hp: 780000, mp: 240000, atk: 128000, def: 65000, spd: 1750, lifespan: 5500, rate: 0.35 },
    { id: 'lh_3', name: 'Luyện Hư Hậu Kỳ', major: 'Luyện Hư', minor: 'Hậu Kỳ', maxExp: 13000000, hp: 1050000, mp: 320000, atk: 170000, def: 86000, spd: 2100, lifespan: 6000, rate: 0.32 },
    { id: 'lh_4', name: 'Luyện Hư Đỉnh Phong', major: 'Luyện Hư', minor: 'Đỉnh Phong', maxExp: 18000000, hp: 1400000, mp: 420000, atk: 225000, def: 115000, spd: 2500, lifespan: 6500, rate: 0.28, isMajorBreakthrough: true, pillNeeded: 'Hợp Nguyên Đan' },

    // Hợp Thể
    { id: 'hop_1', name: 'Hợp Thể Sơ Kỳ', major: 'Hợp Thể', minor: 'Sơ Kỳ', maxExp: 26000000, hp: 1900000, mp: 560000, atk: 300000, def: 150000, spd: 3000, lifespan: 10000, rate: 0.35 },
    { id: 'hop_2', name: 'Hợp Thể Trung Kỳ', major: 'Hợp Thể', minor: 'Trung Kỳ', maxExp: 38000000, hp: 2600000, mp: 750000, atk: 400000, def: 200000, spd: 3600, lifespan: 11000, rate: 0.32 },
    { id: 'hop_3', name: 'Hợp Thể Hậu Kỳ', major: 'Hợp Thể', minor: 'Hậu Kỳ', maxExp: 55000000, hp: 3500000, mp: 1000000, atk: 530000, def: 270000, spd: 4300, lifespan: 12000, rate: 0.28 },
    { id: 'hop_4', name: 'Hợp Thể Đỉnh Phong', major: 'Hợp Thể', minor: 'Đỉnh Phong', maxExp: 80000000, hp: 4800000, mp: 1350000, atk: 700000, def: 360000, spd: 5100, lifespan: 13000, rate: 0.25, isMajorBreakthrough: true, pillNeeded: 'Càn Khôn Đan' },

    // Đại Thừa
    { id: 'dt_1', name: 'Đại Thừa Sơ Kỳ', major: 'Đại Thừa', minor: 'Sơ Kỳ', maxExp: 120000000, hp: 6500000, mp: 1800000, atk: 920000, def: 480000, spd: 6000, lifespan: 30000, rate: 0.30 },
    { id: 'dt_2', name: 'Đại Thừa Trung Kỳ', major: 'Đại Thừa', minor: 'Trung Kỳ', maxExp: 180000000, hp: 8800000, mp: 2400000, atk: 1220000, def: 640000, spd: 7000, lifespan: 33000, rate: 0.28 },
    { id: 'dt_3', name: 'Đại Thừa Hậu Kỳ', major: 'Đại Thừa', minor: 'Hậu Kỳ', maxExp: 260000000, hp: 12000000, mp: 3200000, atk: 1600000, def: 850000, spd: 8200, lifespan: 36000, rate: 0.25 },
    { id: 'dt_4', name: 'Đại Thừa Đỉnh Phong', major: 'Đại Thừa', minor: 'Đỉnh Phong', maxExp: 400000000, hp: 16000000, mp: 4300000, atk: 2150000, def: 1120000, spd: 9600, lifespan: 40000, rate: 0.20, isMajorBreakthrough: true, pillNeeded: 'Cửu Thiên Độ Kiếp Đan' },

    // Độ Kiếp
    { id: 'dk_1', name: 'Độ Kiếp Sơ Kỳ', major: 'Độ Kiếp', minor: 'Sơ Kỳ', maxExp: 600000000, hp: 22000000, mp: 6000000, atk: 2850000, def: 1500000, spd: 11500, lifespan: 100000, rate: 0.25 },
    { id: 'dk_2', name: 'Độ Kiếp Trung Kỳ', major: 'Độ Kiếp', minor: 'Trung Kỳ', maxExp: 900000000, hp: 30000000, mp: 8000000, atk: 3800000, def: 2000000, spd: 13800, lifespan: 120000, rate: 0.22 },
    { id: 'dk_3', name: 'Độ Kiếp Hậu Kỳ', major: 'Độ Kiếp', minor: 'Hậu Kỳ', maxExp: 1400000000, hp: 42000000, mp: 11000000, atk: 5100000, def: 2700000, spd: 16500, lifespan: 150000, rate: 0.18 },
    { id: 'dk_4', name: 'Độ Kiếp Viên Mãn (Phi Thăng)', major: 'Độ Kiếp', minor: 'Viên Mãn', maxExp: 2200000000, hp: 60000000, mp: 16000000, atk: 7000000, def: 3700000, spd: 20000, lifespan: 999999, rate: 0.15, isAscension: true }
  ];

  const SPIRITUAL_ROOTS = [
    { name: 'Ngũ Hành Tạp Linh Căn', type: 'Tạp Linh Căn', speedMod: 0.6, dmgMod: 1.0, desc: 'Năm hệ hỗn loạn, tu luyện gian nan, bù lại dung nạp vạn pháp.' },
    { name: 'Tứ Tạp Linh Căn', type: 'Tứ Linh Căn', speedMod: 0.8, dmgMod: 1.05, desc: 'Bốn hệ tương sinh tương khắc, tư chất tầm thường.' },
    { name: 'Tam Linh Căn', type: 'Tam Linh Căn', speedMod: 1.0, dmgMod: 1.15, desc: 'Ba hệ cân bằng, thiên hạ tu sĩ đại đa số sở hữu.' },
    { name: 'Song Linh Căn (Thủy Mộc)', type: 'Song Linh Căn', speedMod: 1.35, dmgMod: 1.25, desc: 'Thủy sinh Mộc, linh lực dồi dào, sinh cơ bất tuyệt.' },
    { name: 'Song Linh Căn (Hỏa Thổ)', type: 'Song Linh Căn', speedMod: 1.35, dmgMod: 1.3, desc: 'Hỏa sinh Thổ, cương mãnh kiên cố, lực áp quần hùng.' },
    { name: 'Thiên Kim Linh Căn', type: 'Thiên Linh Căn', speedMod: 1.8, dmgMod: 1.45, critMod: 0.15, desc: 'Vô kiên bất tồi, vạn kiếm quy tông, sát phạt đứng đầu.' },
    { name: 'Thiên Mộc Linh Căn', type: 'Thiên Linh Căn', speedMod: 1.8, dmgMod: 1.35, hpMod: 0.25, desc: 'Sinh cơ vĩnh tồn, tự động hồi phục 5% HP mỗi lượt combat.' },
    { name: 'Thiên Thủy Linh Căn', type: 'Thiên Linh Căn', speedMod: 1.8, dmgMod: 1.35, mpMod: 0.35, desc: 'Bao dung vạn tượng, linh lực vô cùng vô tận, giảm 25% tiêu hao MP.' },
    { name: 'Thiên Hỏa Linh Căn', type: 'Thiên Linh Căn', speedMod: 1.8, dmgMod: 1.5, critMod: 0.2, desc: 'Thiêu đốt vạn vật, đòn đánh có xác suất thiêu đốt thiêu rụi mục tiêu.' },
    { name: 'Thiên Thổ Linh Căn', type: 'Thiên Linh Căn', speedMod: 1.8, dmgMod: 1.3, defMod: 0.35, desc: 'Hậu đức tải vật, phòng ngự bất hoại, giảm 20% sát thương nhận vào.' },
    { name: 'Dị Linh Căn - Lôi Linh Căn', type: 'Dị Linh Căn', speedMod: 2.1, dmgMod: 1.6, critMod: 0.25, desc: 'Sức mạnh Cửu Thiên Thần Lôi, có 25% xác suất làm tê liệt đối thủ 1 lượt.' },
    { name: 'Dị Linh Căn - Phong Linh Căn', type: 'Dị Linh Căn', speedMod: 2.0, dmgMod: 1.4, spdMod: 0.4, dodgeMod: 0.2, desc: 'Thân hình tựa gió, thân pháp tăng vọt, né đòn chí mạng.' },
    { name: 'Dị Linh Căn - Băng Linh Căn', type: 'Dị Linh Căn', speedMod: 2.0, dmgMod: 1.45, freezeMod: 0.2, desc: 'Hàn khí thấu xương, có 20% khả năng đóng băng khiến địch mất lượt.' },
    { name: 'Dị Linh Căn - Ám Linh Căn', type: 'Dị Linh Căn', speedMod: 2.1, dmgMod: 1.5, lifeStealMod: 0.2, desc: 'Bóng tối thôn phệ, hút 20% sát thương gây ra thành khí huyết.' },
    { name: 'Dị Linh Căn - Kiếm Linh Căn', type: 'Dị Linh Căn', speedMod: 2.2, dmgMod: 1.7, critMod: 0.3, desc: 'Trời sinh Kiếm Phôi, sát thương công pháp kiếm thuật tăng 40%.' }
  ];

  const PHYSIQUES = [
    { name: 'Phàm Thể', tier: 'Phàm', chance: 0.50, desc: 'Thân thể người phàm tục cốt, không có đặc tính đặc thù.', hpBonus: 0, defBonus: 0, breakBonus: 0 },
    { name: 'Hậu Thiên Linh Thể', tier: 'Linh Thể', chance: 0.30, desc: 'Thân thể hấp thu thiên địa linh khí mà sinh, +15% HP, +10% Phòng ngự.', hpBonus: 0.15, defBonus: 0.10, breakBonus: 0.05 },
    { name: 'Tiên Thiên Đạo Thể', tier: 'Đạo Thể', chance: 0.14, desc: 'Thân hòa với đại đạo, +25% HP, +20% Tu vi nhận được, +10% Tỷ lệ đột phá.', hpBonus: 0.25, defBonus: 0.15, breakBonus: 0.10, expBonus: 0.20 },
    { name: 'Cửu Dương Bá Thể', tier: 'Bá Thể', chance: 0.03, desc: 'Khí huyết cuồn cuộn như biển, giảm 20% mọi sát thương nhận vào, phản đòn 25%.', hpBonus: 0.40, defBonus: 0.30, reflectBonus: 0.25, breakBonus: 0.08 },
    { name: 'Kiếm Tâm Thông Minh', tier: 'Kiếm Tâm', chance: 0.02, desc: 'Tâm trong như gương, +25% Tỷ lệ bạo kích, bỏ qua 30% giáp của đối thủ.', critBonus: 0.25, armorPen: 0.30, breakBonus: 0.08 },
    { name: 'Hoang Cổ Thánh Thể', tier: 'Thánh Thể', chance: 0.005, desc: 'Thánh thể cái thế thượng cổ, +60% HP, +40% Công kích, miễn nhiễm hoàn toàn tâm ma.', hpBonus: 0.60, atkBonus: 0.40, defBonus: 0.35, breakBonus: 0.15 },
    { name: 'Hỗn Độn Đạo Thể', tier: 'Thần Thể', chance: 0.005, desc: 'Thể chất chí tôn mở mang càn khôn, +50% toàn bộ thuộc tính, +30% Tốc độ tu luyện, +25% Tỷ lệ đột phá.', allBonus: 0.50, expBonus: 0.30, breakBonus: 0.25 }
  ];

  const CULTIVATION_PATHS = {
    kiem_tu: {
      id: 'kiem_tu',
      name: 'Kiếm Tu',
      title: 'Kiếm Đạo Độc Tôn',
      desc: 'Nhất kiếm phá vạn pháp. Bạo kích cao ngất ngưởng, sát phạt quyết đoán, bỏ qua phòng ngự.',
      bonus: { atk: 25, crit: 0.15, critDmg: 0.3 },
      startSkill: {
        id: 'skill_kiem_1',
        name: 'Nhất Kiếm Tây Lai',
        mpCost: 25,
        cd: 2,
        dmgMult: 2.2,
        desc: 'Ngưng tụ kiếm khí chém ra một kiếm kinh thiên, có 35% bỏ qua giáp mục tiêu.'
      },
      startArtifact: {
        id: 'art_kiem_1',
        name: 'Thanh Trúc Phi Kiếm',
        type: 'weapon',
        atk: 35,
        crit: 0.05,
        desc: 'Thanh phong trúc chế thành phi kiếm, sắc bén bất phàm.'
      },
      startManual: {
        name: 'Thanh Nguyên Kiếm Điển',
        desc: 'Bí tịch kiếm tu cơ bản của Thanh Vân Tông, tăng 10% Công kích và 5% Bạo kích.'
      }
    },
    phap_tu: {
      id: 'phap_tu',
      name: 'Pháp Tu Ngũ Hành',
      title: 'Vạn Pháp Quy Tông',
      desc: 'Linh lực như biển sâu, hô phong hoán vũ, dùng ngũ hành thần thông áp chế quần ma.',
      bonus: { mp: 100, atk: 20, def: 15 },
      startSkill: {
        id: 'skill_phap_1',
        name: 'Cửu Thiên Huyền Hỏa',
        mpCost: 35,
        cd: 2,
        dmgMult: 2.0,
        burnChance: 0.5,
        desc: 'Giáng xuống cột lửa ngút trời, 50% thiêu đốt đối thủ gây sát thương liên tục.'
      },
      startArtifact: {
        id: 'art_phap_1',
        name: 'Ngũ Hành Linh Châu',
        type: 'artifact',
        mp: 120,
        atk: 25,
        desc: 'Hạt châu ẩn chứa khí tức ngũ hành, gia trì thần thông pháp thuật.'
      },
      startManual: {
        name: 'Hỗn Nguyên Ngũ Hành Quyết',
        desc: 'Đạo gia chính thống tâm pháp, tăng 15% Linh Lực và 10% sát thương ngũ hành.'
      }
    },
    the_tu: {
      id: 'the_tu',
      name: 'Thể Tu',
      title: 'Kim Thân Bất Diệt',
      desc: 'Lấy thân làm bảo khí, huyết khí ngút trời. Máu dày giáp lớn, phản chấn thương tàn bạo.',
      bonus: { hp: 250, def: 35, atk: 15 },
      startSkill: {
        id: 'skill_the_1',
        name: 'Bá Vương Khí Kình',
        mpCost: 20,
        cd: 3,
        dmgMult: 1.8,
        stunChance: 0.4,
        desc: 'Quyền kình bá đạo làm rung chuyển hư không, có 40% làm choáng địch 1 lượt.'
      },
      startArtifact: {
        id: 'art_the_1',
        name: 'Huyền Thiết Trọng Thuẫn',
        type: 'armor',
        hp: 150,
        def: 40,
        desc: 'Lá chắn đúc từ thiên ngoại huyền thiết, phòng ngự kiên cố.'
      },
      startManual: {
        name: 'Bất Diệt Kim Thân Thần Quyết',
        desc: 'Môn công pháp rèn thể thượng thừa, tăng 25% HP và 15% Phòng Ngự.'
      }
    },
    dan_y_tu: {
      id: 'dan_y_tu',
      name: 'Đan / Y Tu',
      title: 'Hồi Xuân Diệu Thủ',
      desc: 'Luyện đan chế dược, cứu người tế thế, hoặc dùng kỳ độc giết người trong vô hình.',
      bonus: { hp: 120, mp: 80, alchemyBonus: 0.25 },
      startSkill: {
        id: 'skill_dan_1',
        name: 'Bách Thảo Hồi Xuân',
        mpCost: 30,
        cd: 2,
        dmgMult: 1.2,
        healPercent: 0.35,
        desc: 'Vừa đánh thương tổn đối thủ, vừa dẫn dắt thảo mộc tinh hoa hồi 35% HP.'
      },
      startArtifact: {
        id: 'art_dan_1',
        name: 'Thần Nông Dược Đỉnh',
        type: 'artifact',
        hp: 100,
        mp: 80,
        desc: 'Cổ đỉnh lưu lại từ dược các thượng cổ, tăng 20% hiệu quả đan dược.'
      },
      startManual: {
        name: 'Thần Nông Dược Kinh',
        desc: 'Tâm pháp y tu danh chấn cửu châu, tăng 20% khả năng luyện đan và hồi phục.'
      }
    },
    ma_tu: {
      id: 'ma_tu',
      name: 'Ma Tu',
      title: 'Huyết Sát Ma Đạo',
      desc: 'Nghịch thiên cầu đạo, hiến tế huyết khí đổi lấy sức mạnh hủy thiên diệt địa, hút máu cuồng bạo.',
      bonus: { atk: 35, hp: -50, lifeSteal: 0.2 },
      startSkill: {
        id: 'skill_ma_1',
        name: 'Huyết Ảnh Thao Thiên',
        mpCost: 20,
        hpCostPercent: 0.1,
        cd: 2,
        dmgMult: 2.8,
        lifeStealPercent: 0.3,
        desc: 'Hiến tế 10% HP hiện tại, giáng đòn sát thương hủy diệt và hút lại 30% sát thương đó.'
      },
      startArtifact: {
        id: 'art_ma_1',
        name: 'Cửu U Chiêu Hồn Kỳ',
        type: 'weapon',
        atk: 45,
        lifeSteal: 0.1,
        desc: 'Ma kỳ tụ tập oán hồn u minh, mỗi đòn đánh hút sinh cơ kẻ địch.'
      },
      startManual: {
        name: 'Huyết Sát Ma Kinh',
        desc: 'Ma công thượng thừa ghi chép cách biến huyết khí thành sát lực kinh hoàng.'
      }
    }
  };

  const CHEAT_CORES = {
    signin: {
      id: 'signin',
      name: 'Hệ Thống Đánh Dấu (Sign-in)',
      desc: 'Mỗi năm tu tiên (hoặc mỗi khi bước chân tới địa điểm mới), được bấm Đánh Dấu nhận tài nguyên cực phẩm (Linh Thạch, Đan Dược, Thiên Tài Địa Bảo).'
    },
    proficiency: {
      id: 'proficiency',
      name: 'Hệ Thống Độ Thông Thạo (Proficiency)',
      desc: 'Đánh quái hoặc thi triển công pháp càng nhiều thì độ thuần thục tự động tăng vọt, đột phá cấp kỹ năng không tốn tài nguyên.'
    },
    gacha: {
      id: 'gacha',
      name: 'Hệ Thống Rút Thưởng Vạn Giới (Gacha)',
      desc: 'Chiến đấu và tu luyện tích lũy Điểm Thiên Cơ, dùng để quay Vòng Quay Vạn Giới nhận Thần Binh, Tiên Đan, Bí Cảnh Phù.'
    },
    devour: {
      id: 'devour',
      name: 'Hệ Thống Cắn Nuốt (Devour)',
      desc: 'Mỗi khi tiêu diệt yêu thú hoặc tà tu, lập tức cắn nuốt hấp thu trực tiếp vĩnh viễn một phần Khí Huyết, Công Kích và Tu Vi của chúng.'
    }
  };

  const CHEAT_PERKS = {
    breakthrough_guard: {
      id: 'breakthrough_guard',
      name: 'Thiên Đạo Hộ Thể',
      desc: '+30% Tỷ lệ đột phá cảnh giới, miễn trừ trọng thương do tâm ma phản phệ khi thất bại.'
    },
    double_loot: {
      id: 'double_loot',
      name: 'Tài Thông Thần Minh',
      desc: 'Nhân đôi (x2) toàn bộ Linh Thạch và Thảo Dược, Khoáng Thạch thu hoạch được từ mọi nguồn.'
    },
    immortal_body: {
      id: 'immortal_body',
      name: 'Bất Tử Chi Khu',
      desc: 'Miễn nhiễm 1 đòn chí mạng trong mỗi trận chiến, đồng thời lập tức hồi phục 35% Khí Huyết.'
    },
    escape_master: {
      id: 'escape_master',
      name: 'Thần Ma Độn Pháp',
      desc: '+50% Thân pháp, luôn luôn bỏ chạy thành công 100% trong mọi tình huống gặp kẻ địch hung hãn.'
    }
  };

  const WORLD_REGIONS = [
    {
      id: 'region_1',
      name: 'Linh Sơn Ngoại Vi',
      reqRealmIndex: 0,
      dangerLevel: 'Thấp (Luyện Khí Kỳ)',
      desc: 'Rừng cây xanh tốt bao quanh tiên phong, nơi đệ tử nhập môn rèn luyện và hái thuốc.',
      monsters: ['wolf_novice', 'boar_novice', 'snake_novice'],
      herbs: ['herb_linhchi', 'herb_thanh_u'],
      ores: ['ore_huyenthiet'],
      lootStoneRange: [10, 30]
    },
    {
      id: 'region_2',
      name: 'Vạn Yêu Sơn Mạch',
      reqRealmIndex: 10,
      dangerLevel: 'Trung Bình (Trúc Cơ Kỳ)',
      desc: 'Dãy núi ngút ngàn đầy yêu khí hung hãn, cọp dữ gầm thét, độc xà lượn quanh.',
      monsters: ['tiger_fire', 'bear_black', 'eagle_blood'],
      herbs: ['herb_hoaviem', 'herb_bachnien'],
      ores: ['ore_tutinh', 'ore_huyenthiet'],
      lootStoneRange: [50, 150]
    },
    {
      id: 'region_3',
      name: 'Cổ Kiếm Bí Cảnh',
      reqRealmIndex: 14,
      dangerLevel: 'Cao (Kim Đan Kỳ)',
      desc: 'Phế tích thượng cổ kiếm tông lưu lại, kiếm ý tung hoành, khôi lỗi hộ kiếm tuần tra.',
      monsters: ['golem_sword', 'ghost_swordsman', 'cultist_dark'],
      herbs: ['herb_bachnien', 'herb_longhuyet'],
      ores: ['ore_tutinh', 'ore_thienngoai'],
      lootStoneRange: [200, 500]
    },
    {
      id: 'region_4',
      name: 'Huyết Sát Ma Vực',
      reqRealmIndex: 18,
      dangerLevel: 'Rất Nguy Hiểm (Nguyên Anh Kỳ)',
      desc: 'Biển máu u ám ngút trời, nơi tà tu và đại ma đầu ẩn náu tế luyện ma khí.',
      monsters: ['cultist_elder', 'blood_fiend', 'wolf_demon_king'],
      herbs: ['herb_longhuyet', 'herb_cuuchuyen'],
      ores: ['ore_thienngoai', 'ore_huyettinh'],
      lootStoneRange: [600, 1500]
    },
    {
      id: 'region_5',
      name: 'Thượng Cổ Vực Thẳm',
      reqRealmIndex: 22,
      dangerLevel: 'Tuyệt Địa Hung Hiểm (Hóa Thần+)',
      desc: 'Khe nứt hư không thông đến di tích tiên ma cổ đại, nơi cự long và thụ yêu ngàn năm thống trị.',
      monsters: ['dragon_ancient', 'tree_ancient', 'golem_divine'],
      herbs: ['herb_cuuchuyen', 'herb_thienkiem'],
      ores: ['ore_huyettinh', 'ore_hondon'],
      lootStoneRange: [2000, 5000]
    }
  ];

  const MONSTERS = {
    wolf_novice: {
      id: 'wolf_novice', name: 'U Minh Yêu Lang', spriteKey: 'monsterWolf',
      hp: 200, mp: 50, atk: 32, def: 14, spd: 20, exp: 40, stone: 15,
      skills: [{ name: 'Lang Trảo Liêm', dmgMult: 1.2 }],
      drops: [{ item: 'herb_linhchi', chance: 0.6 }, { item: 'ore_huyenthiet', chance: 0.4 }]
    },
    boar_novice: {
      id: 'boar_novice', name: 'Cương Nha Hắc Trư', spriteKey: 'monsterWolf',
      hp: 320, mp: 20, atk: 25, def: 25, spd: 12, exp: 45, stone: 18,
      skills: [{ name: 'Man Lực Xung Tràng', dmgMult: 1.3 }],
      drops: [{ item: 'ore_huyenthiet', chance: 0.7 }]
    },
    snake_novice: {
      id: 'snake_novice', name: 'Lục Hoa Độc Xà', spriteKey: 'monsterTree',
      hp: 180, mp: 60, atk: 38, def: 10, spd: 26, exp: 42, stone: 20,
      skills: [{ name: 'Độc Dịch Phun Trào', dmgMult: 1.1, poison: true }],
      drops: [{ item: 'herb_thanh_u', chance: 0.6 }]
    },
    tiger_fire: {
      id: 'tiger_fire', name: 'Xích Diễm Hổ', spriteKey: 'monsterTiger',
      hp: 2800, mp: 400, atk: 580, def: 280, spd: 85, exp: 450, stone: 120,
      skills: [{ name: 'Hổ Khiếu Hỏa Ba', dmgMult: 1.4, burn: true }],
      drops: [{ item: 'herb_hoaviem', chance: 0.7 }, { item: 'ore_tutinh', chance: 0.5 }]
    },
    bear_black: {
      id: 'bear_black', name: 'Bạo Nộ Cuồng Hùng', spriteKey: 'monsterTiger',
      hp: 4200, mp: 200, atk: 500, def: 420, spd: 60, exp: 480, stone: 130,
      skills: [{ name: 'Liệt Địa Chấn Kích', dmgMult: 1.5 }],
      drops: [{ item: 'herb_bachnien', chance: 0.6 }]
    },
    eagle_blood: {
      id: 'eagle_blood', name: 'Huyết Dực Thần Điêu', spriteKey: 'monsterWolf',
      hp: 2400, mp: 600, atk: 650, def: 220, spd: 120, exp: 500, stone: 150,
      skills: [{ name: 'Huyết Vũ Trảm Không', dmgMult: 1.6 }],
      drops: [{ item: 'herb_hoaviem', chance: 0.5 }, { item: 'ore_tutinh', chance: 0.5 }]
    },
    golem_sword: {
      id: 'golem_sword', name: 'Cổ Kiếm Khôi Lỗi', spriteKey: 'monsterGolem',
      hp: 18000, mp: 2000, atk: 2400, def: 1800, spd: 150, exp: 3500, stone: 400,
      skills: [{ name: 'Bát Hoang Kiếm Trận', dmgMult: 1.5 }],
      drops: [{ item: 'ore_thienngoai', chance: 0.7 }, { item: 'herb_longhuyet', chance: 0.4 }]
    },
    ghost_swordsman: {
      id: 'ghost_swordsman', name: 'Tàn Hồn Kiếm Tiên', spriteKey: 'monsterCultist',
      hp: 14000, mp: 5000, atk: 3200, def: 1100, spd: 220, exp: 4200, stone: 500,
      skills: [{ name: 'Vạn Kiếm Quy Tông', dmgMult: 1.8 }],
      drops: [{ item: 'ore_thienngoai', chance: 0.6 }, { item: 'herb_bachnien', chance: 0.8 }]
    },
    cultist_dark: {
      id: 'cultist_dark', name: 'U Hồn Tà Tu', spriteKey: 'monsterCultist',
      hp: 16000, mp: 4000, atk: 2900, def: 1300, spd: 180, exp: 3800, stone: 450,
      skills: [{ name: 'Huyết Hồn Trảo', dmgMult: 1.4, lifeSteal: 0.2 }],
      drops: [{ item: 'herb_longhuyet', chance: 0.6 }]
    },
    cultist_elder: {
      id: 'cultist_elder', name: 'Huyết Ma Trưởng Lão', spriteKey: 'monsterCultist',
      hp: 75000, mp: 25000, atk: 13500, def: 6800, spd: 450, exp: 28000, stone: 1200,
      skills: [{ name: 'Huyết Lôi Ma Kiếp', dmgMult: 2.0 }],
      drops: [{ item: 'ore_huyettinh', chance: 0.8 }, { item: 'herb_cuuchuyen', chance: 0.4 }]
    },
    blood_fiend: {
      id: 'blood_fiend', name: 'Sát Lục Ma Tướng', spriteKey: 'monsterGolem',
      hp: 95000, mp: 15000, atk: 15500, def: 9500, spd: 380, exp: 32000, stone: 1400,
      skills: [{ name: 'Cuồng Bạo Huyết Trảm', dmgMult: 2.2 }],
      drops: [{ item: 'ore_huyettinh', chance: 0.7 }]
    },
    wolf_demon_king: {
      id: 'wolf_demon_king', name: 'Huyết Nguyệt Yêu Vương', spriteKey: 'monsterWolf',
      hp: 85000, mp: 20000, atk: 17000, def: 7200, spd: 520, exp: 35000, stone: 1600,
      skills: [{ name: 'U Minh Ma Cào', dmgMult: 2.1 }],
      drops: [{ item: 'herb_longhuyet', chance: 0.8 }, { item: 'herb_cuuchuyen', chance: 0.5 }]
    },
    dragon_ancient: {
      id: 'dragon_ancient', name: 'Thái Cổ Bích Giao Long', spriteKey: 'monsterDragon',
      hp: 350000, mp: 120000, atk: 65000, def: 35000, spd: 950, exp: 250000, stone: 4000,
      skills: [{ name: 'Long Tức Băng Phong', dmgMult: 2.4, freeze: true }],
      drops: [{ item: 'ore_hondon', chance: 0.8 }, { item: 'herb_thienkiem', chance: 0.6 }]
    },
    tree_ancient: {
      id: 'tree_ancient', name: 'Vạn Niên Hủ Mộc Yêu Vương', spriteKey: 'monsterTree',
      hp: 550000, mp: 80000, atk: 52000, def: 45000, spd: 600, exp: 280000, stone: 4500,
      skills: [{ name: 'Vạn Căn Toả Mệnh', dmgMult: 2.0, heal: 0.2 }],
      drops: [{ item: 'herb_thienkiem', chance: 0.8 }, { item: 'herb_cuuchuyen', chance: 0.9 }]
    },
    golem_divine: {
      id: 'golem_divine', name: 'Hỗn Độn Thạch Hoàng', spriteKey: 'monsterGolem',
      hp: 650000, mp: 50000, atk: 75000, def: 55000, spd: 700, exp: 350000, stone: 5000,
      skills: [{ name: 'Càn Khôn Nhất Kích', dmgMult: 2.6 }],
      drops: [{ item: 'ore_hondon', chance: 0.9 }]
    }
  };

  const ITEMS = {
    // Dược thảo
    herb_linhchi: { id: 'herb_linhchi', name: 'Linh Chi Thảo', type: 'herb', desc: 'Linh thảo sơ cấp chứa linh khí trời đất.', price: 15 },
    herb_thanh_u: { id: 'herb_thanh_u', name: 'Thanh U Thảo', type: 'herb', desc: 'Thảo mộc thanh mát dùng chế tạo thuốc hồi linh.', price: 20 },
    herb_hoaviem: { id: 'herb_hoaviem', name: 'Hỏa Viêm Thảo', type: 'herb', desc: 'Linh thảo sinh trưởng cạnh dung nham, dương khí sung túc.', price: 60 },
    herb_bachnien: { id: 'herb_bachnien', name: 'Bách Niên Linh Dược', type: 'herb', desc: 'Dược liệu trăm năm, dược lực thuần hậu.', price: 150 },
    herb_longhuyet: { id: 'herb_longhuyet', name: 'Long Huyết Thảo', type: 'herb', desc: 'Thảo mộc hấp thu huyết mạch giao long, đỏ rực như máu.', price: 400 },
    herb_cuuchuyen: { id: 'herb_cuuchuyen', name: 'Cửu Chuyển Tiên Thảo', type: 'herb', desc: 'Linh chi chín màu tỏa ánh hào quang, vô cùng hiếm gặp.', price: 1200 },
    herb_thienkiem: { id: 'herb_thienkiem', name: 'Thiên Kiếm Thảo', type: 'herb', desc: 'Lá cây sắc nhọn như phi kiếm, ẩn chứa kiếm ý thiên nhiên.', price: 3000 },

    // Khoáng thạch
    ore_huyenthiet: { id: 'ore_huyenthiet', name: 'Huyền Thiết Tinh', type: 'ore', desc: 'Quặng sắt đen rắn chắc, dùng rèn pháp khí sơ cấp.', price: 20 },
    ore_tutinh: { id: 'ore_tutinh', name: 'Tử Tinh Khoáng', type: 'ore', desc: 'Khoáng thạch tím chứa linh lực ổn định.', price: 75 },
    ore_thienngoai: { id: 'ore_thienngoai', name: 'Thiên Ngoại Vẫn Thiết', type: 'ore', desc: 'Thiên thạch rơi xuống từ cửu tiêu hư không.', price: 300 },
    ore_huyettinh: { id: 'ore_huyettinh', name: 'Huyết Ma Thạch', type: 'ore', desc: 'Huyết thạch ma đạo đúc vũ khí khát máu.', price: 800 },
    ore_hondon: { id: 'ore_hondon', name: 'Hỗn Độn Thần Thiết', type: 'ore', desc: 'Thần tài khai thiên lập địa, vô kiên bất tồi.', price: 2500 },

    // Đan dược
    pill_hoixuan: { id: 'pill_hoixuan', name: 'Hồi Xuân Đan', type: 'pill', healPercent: 0.5, desc: 'Lập tức hồi phục 50% Khí Huyết (HP).', price: 40 },
    pill_tulinh: { id: 'pill_tulinh', name: 'Tụ Linh Đan', type: 'pill', mpPercent: 0.6, desc: 'Lập tức hồi phục 60% Linh Lực (MP).', price: 50 },
    pill_tukhi: { id: 'pill_tukhi', name: 'Tụ Khí Đan', type: 'pill', expGain: 350, desc: 'Uống vào tăng trực tiếp 350 điểm Tu Vi.', price: 80 },
    pill_trucco: { id: 'pill_trucco', name: 'Trúc Cơ Đan', type: 'pill', isBreakthrough: true, breakBonus: 0.35, desc: 'Bảo vật đột phá Trúc Cơ, tăng 35% tỷ lệ thành công.', price: 300 },
    pill_kimdan: { id: 'pill_kimdan', name: 'Kim Đan Hóa Thần Hoàn', type: 'pill', isBreakthrough: true, breakBonus: 0.30, desc: 'Tăng 30% tỷ lệ đột phá Kim Đan Kỳ.', price: 1000 },
    pill_ngungan: { id: 'pill_ngungan', name: 'Ngưng Anh Đan', type: 'pill', isBreakthrough: true, breakBonus: 0.25, desc: 'Phá đan thành anh, tăng 25% tỷ lệ đột phá Nguyên Anh.', price: 3500 },
    pill_hoathan: { id: 'pill_hoathan', name: 'Hóa Thần Đan', type: 'pill', isBreakthrough: true, breakBonus: 0.20, desc: 'Tăng 20% tỷ lệ đột phá Hóa Thần Kỳ.', price: 10000 },
    pill_huthien: { id: 'pill_huthien', name: 'Hư Thiên Đan', type: 'pill', isBreakthrough: true, breakBonus: 0.20, desc: 'Tăng 20% tỷ lệ đột phá Luyện Hư Kỳ.', price: 25000 },
    pill_hopnguyen: { id: 'pill_hopnguyen', name: 'Hợp Nguyên Đan', type: 'pill', isBreakthrough: true, breakBonus: 0.18, desc: 'Tăng 18% tỷ lệ đột phá Hợp Thể Kỳ.', price: 60000 },
    pill_cankhon: { id: 'pill_cankhon', name: 'Càn Khôn Đan', type: 'pill', isBreakthrough: true, breakBonus: 0.15, desc: 'Tăng 15% tỷ lệ đột phá Đại Thừa Kỳ.', price: 150000 },
    pill_dokiep: { id: 'pill_dokiep', name: 'Cửu Thiên Độ Kiếp Đan', type: 'pill', isBreakthrough: true, breakBonus: 0.15, desc: 'Tăng 15% tỷ lệ đột phá Độ Kiếp Kỳ.', price: 400000 },
    pill_daotam: { id: 'pill_daotam', name: 'Đạo Tâm Đan', type: 'pill', breakBonus: 0.20, desc: 'Thanh tẩy tâm ma, tăng 20% tỷ lệ đột phá cho mọi cảnh giới.', price: 800 },
    pill_tho_nguyen: { id: 'pill_tho_nguyen', name: 'Cửu Chuyển Thọ Nguyên Đan', type: 'pill', lifespanGain: 50, desc: 'Tăng thêm 50 năm thọ nguyên.', price: 1500 },

    // Vũ khí
    wpn_thanhphong: { id: 'wpn_thanhphong', name: 'Thanh Phong Kiếm', type: 'weapon', atk: 45, crit: 0.05, desc: 'Kiếm sắc bén gió lướt.', price: 150 },
    wpn_xichtieu: { id: 'wpn_xichtieu', name: 'Xích Tiêu Kiếm', type: 'weapon', atk: 260, crit: 0.1, desc: 'Thân kiếm đỏ rực như lửa.', price: 1200 },
    wpn_tramyeu: { id: 'wpn_tramyeu', name: 'Trảm Yêu Cự Kiếm', type: 'weapon', atk: 1200, crit: 0.15, desc: 'Bảo kiếm trảm sát ngàn yêu ma.', price: 5000 },
    wpn_tienkiem: { id: 'wpn_tienkiem', name: 'Bát Hoang Tiên Kiếm', type: 'weapon', atk: 8500, crit: 0.25, desc: 'Tiên kiếm thượng cổ vô địch.', price: 30000 },

    // Hộ giáp
    arm_huyenthiet: { id: 'arm_huyenthiet', name: 'Huyền Thiết Giáp', type: 'armor', hp: 200, def: 35, desc: 'Giáp sắt bền bỉ che chắn yếu huyệt.', price: 150 },
    arm_tinhvan: { id: 'arm_tinhvan', name: 'Tinh Vân Đạo Bào', type: 'armor', hp: 1200, def: 180, desc: 'Dệt từ mây tía tinh tú ngàn năm.', price: 1200 },
    arm_longlan: { id: 'arm_longlan', name: 'Long Lân Bảo Giáp', type: 'armor', hp: 6000, def: 850, desc: 'Vảy rồng cổ đại kết thành hộ giáp.', price: 6000 },
    arm_hondon: { id: 'arm_hondon', name: 'Hỗn Độn Tiên Y', type: 'armor', hp: 35000, def: 4500, desc: 'Đạo y bất hoại chống đỡ thiên kiếp.', price: 40000 },

    // Pháp bảo
    art_guong: { id: 'art_guong', name: 'Bát Quái Hộ Tâm Kính', type: 'artifact', hp: 300, def: 50, mp: 100, desc: 'Gương đồng hộ tâm soi tỏ tà ma.', price: 300 },
    art_chuoi: { id: 'art_chuoi', name: 'Bồ Đề Chuỗi Hạt', type: 'artifact', mp: 500, atk: 120, desc: 'Hạt bồ đề tĩnh tâm ngưng thần.', price: 1500 },
    art_dinh: { id: 'art_dinh', name: 'Sơn Hà Xã Tắc Đỉnh', type: 'artifact', hp: 8000, atk: 1500, def: 600, desc: 'Thu nhỏ cảnh giới núi sông trấn áp càn khôn.', price: 12000 }
  };

  const RECIPES = [
    { id: 'rec_hoixuan', name: 'Hồi Xuân Đan', type: 'alchemy', resultId: 'pill_hoixuan', ingredients: { herb_linhchi: 2 }, successRate: 0.90, desc: 'Cần 2 Linh Chi Thảo.' },
    { id: 'rec_tulinh', name: 'Tụ Linh Đan', type: 'alchemy', resultId: 'pill_tulinh', ingredients: { herb_thanh_u: 2 }, successRate: 0.88, desc: 'Cần 2 Thanh U Thảo.' },
    { id: 'rec_tukhi', name: 'Tụ Khí Đan', type: 'alchemy', resultId: 'pill_tukhi', ingredients: { herb_linhchi: 2, herb_thanh_u: 1, ore_huyenthiet: 1 }, successRate: 0.85, desc: 'Cần 2 Linh Chi Thảo, 1 Thanh U Thảo, 1 Huyền Thiết Tinh.' },
    { id: 'rec_trucco', name: 'Trúc Cơ Đan', type: 'alchemy', resultId: 'pill_trucco', ingredients: { herb_thanh_u: 4, herb_hoaviem: 2, ore_tutinh: 1 }, successRate: 0.70, desc: 'Cần 4 Thanh U Thảo, 2 Hỏa Viêm Thảo, 1 Tử Tinh Khoáng.' },
    { id: 'rec_kimdan', name: 'Kim Đan Hóa Thần Hoàn', type: 'alchemy', resultId: 'pill_kimdan', ingredients: { herb_hoaviem: 3, herb_bachnien: 2, ore_tutinh: 2 }, successRate: 0.60, desc: 'Cần 3 Hỏa Viêm Thảo, 2 Bách Niên Linh Dược, 2 Tử Tinh Khoáng.' },
    { id: 'rec_daotam', name: 'Đạo Tâm Đan', type: 'alchemy', resultId: 'pill_daotam', ingredients: { herb_bachnien: 3, herb_longhuyet: 1, ore_thienngoai: 1 }, successRate: 0.65, desc: 'Cần 3 Bách Niên Linh Dược, 1 Long Huyết Thảo, 1 Thiên Ngoại Vẫn Thiết.' },
    { id: 'rec_thanhphong', name: 'Thanh Phong Kiếm', type: 'forge', resultId: 'wpn_thanhphong', ingredients: { ore_huyenthiet: 4, herb_thanh_u: 2 }, successRate: 0.85, desc: 'Cần 4 Huyền Thiết Tinh, 2 Thanh U Thảo.' },
    { id: 'rec_xichtieu', name: 'Xích Tiêu Kiếm', type: 'forge', resultId: 'wpn_xichtieu', ingredients: { ore_tutinh: 4, herb_hoaviem: 3 }, successRate: 0.75, desc: 'Cần 4 Tử Tinh Khoáng, 3 Hỏa Viêm Thảo.' },
    { id: 'rec_tinhvan', name: 'Tinh Vân Đạo Bào', type: 'forge', resultId: 'arm_tinhvan', ingredients: { ore_tutinh: 3, herb_bachnien: 3 }, successRate: 0.75, desc: 'Cần 3 Tử Tinh Khoáng, 3 Bách Niên Linh Dược.' },
    { id: 'rec_longlan', name: 'Long Lân Bảo Giáp', type: 'forge', resultId: 'arm_longlan', ingredients: { ore_thienngoai: 4, herb_longhuyet: 3 }, successRate: 0.65, desc: 'Cần 4 Thiên Ngoại Vẫn Thiết, 3 Long Huyết Thảo.' }
  ];

  const RANDOM_EVENTS = [
    {
      id: 'event_di_hai',
      title: 'Kỳ Ngộ: Di Hài Tiền Bối',
      desc: 'Đạo hữu bước vào một sơn động u tịch, phát hiện bộ hài cốt của một vị tiền bối tọa hóa đã ngàn năm, bên cạnh có chiếc nhẫn trữ vật lờ mờ ánh sáng.',
      choices: [
        { text: 'Kính cẩn bái lạy 3 lạy rồi mới cung kính thu nhặt', action: 'respect' },
        { text: 'Lao vào chộp lấy nhẫn trữ vật ngay lập tức', action: 'rush' },
        { text: 'Cảm thấy nguy hiểm rình rập, quay đầu rời đi', action: 'leave' }
      ]
    },
    {
      id: 'event_nu_tu',
      title: 'Kỳ Ngộ: Nữ Tu Gặp Nạn',
      desc: 'Một vị nữ tu Thanh Vân Tông y phục rách rưới đang bị bầy U Minh Lang vây khốn, linh lực sắp cạn kiệt, lớn tiếng cầu cứu đạo hữu!',
      choices: [
        { text: 'Rút kiếm xuất kích cứu viện', action: 'save' },
        { text: 'Đợi hai bên lưỡng bại câu thương rồi ngư ông đắc lợi', action: 'sneak' },
        { text: 'Đạo hữu tự lo thân mình chưa xong, né tránh thật xa', action: 'ignore' }
      ]
    },
    {
      id: 'event_linh_tuyen',
      title: 'Kỳ Ngộ: Cổ Tuyền Linh Thủy',
      desc: 'Giữa khe núi đá nứt ra một dòng suối phát ra hào quang ngũ sắc, linh khí bốc lên nghi ngút ngưng kết thành sương mù.',
      choices: [
        { text: 'Uống một ngụm lớn thanh tẩy đan điền', action: 'drink' },
        { text: 'Ngồi xếp bằng trong suối ngâm mình rèn luyện thể phách', action: 'bathe' },
        { text: 'Lấy hồ lô ra múc đầy mang về tích trữ', action: 'bottle' }
      ]
    },
    {
      id: 'event_ta_tu',
      title: 'Kỳ Ngộ: Tà Tu Mời Chào',
      desc: 'Một hắc y quái nhân chặn đường ngươi, mỉm cười tà dị chìa ra một viên Huyết Đan: "Viên đan này giúp ngươi tăng vọt tu vi, chỉ cần trả bằng 100 Linh Thạch và 5 năm thọ nguyên..."',
      choices: [
        { text: 'Trừ ma vệ đạo! Rút kiếm trảm sát tà ma', action: 'fight_cultist' },
        { text: 'Đánh đổi thọ nguyên lấy sức mạnh tức thì', action: 'accept_deal' },
        { text: 'Thi triển độn pháp chạy trốn thật nhanh', action: 'flee' }
      ]
    }
  ];

  const SECTS = [
    {
      id: 'sect_thanhvan',
      name: 'Thanh Vân Kiếm Tông',
      type: 'Chính Đạo Kiếm Tu',
      desc: 'Tông môn đệ nhất kiếm đạo, lấy kiếm nhập đạo, phong cốt lẫm liệt.',
      ranks: [
        { rank: 'Tạp Dịch Đệ Tử', minContrib: 0, salary: 10 },
        { rank: 'Ngoại Môn Đệ Tử', minContrib: 100, salary: 30 },
        { rank: 'Nội Môn Đệ Tử', minContrib: 500, salary: 80 },
        { rank: 'Chân Truyền Đệ Tử', minContrib: 2000, salary: 250 },
        { rank: 'Hộ Pháp Trưởng Lão', minContrib: 6000, salary: 700 },
        { rank: 'Chưởng Môn Chí Tôn', minContrib: 15000, salary: 2000 }
      ],
      manuals: [
        { id: 'man_thanhvan_1', name: 'Thanh Phong Tam Thức', cost: 150, atk: 40, desc: 'Tăng 40 điểm Công kích vĩnh viễn.' },
        { id: 'man_thanhvan_2', name: 'Vạn Kiếm Quy Nhất Quyết', cost: 800, crit: 0.1, atk: 150, desc: 'Tăng 10% Bạo kích và 150 Công kích.' },
        { id: 'man_thanhvan_3', name: 'Thanh Vân Hộ Thể Thuẫn', cost: 2500, def: 350, hp: 1200, desc: 'Tăng 350 Phòng ngự và 1200 HP.' }
      ]
    },
    {
      id: 'sect_dandinh',
      name: 'Đan Đỉnh Thần Môn',
      type: 'Trung Lập Đan Tu',
      desc: 'Nơi quy tụ các bậc thầy luyện đan, nắm giữ vô số đan phương cổ truyền.',
      ranks: [
        { rank: 'Đồng Tử Thổi Lửa', minContrib: 0, salary: 15 },
        { rank: 'Học Đồ Luyện Đan', minContrib: 100, salary: 40 },
        { rank: 'Đan Sư Nội Môn', minContrib: 500, salary: 100 },
        { rank: 'Đại Đan Sư Chân Truyền', minContrib: 2000, salary: 300 },
        { rank: 'Đan Các Trưởng Lão', minContrib: 6000, salary: 800 },
        { rank: 'Môn Chủ Đan Thần', minContrib: 15000, salary: 2500 }
      ],
      manuals: [
        { id: 'man_dan_1', name: 'Dược Lý Tinh Yếu', cost: 150, hp: 200, desc: 'Tăng 200 HP vĩnh viễn.' },
        { id: 'man_dan_2', name: 'Tam Muội Chân Hỏa Quyết', cost: 800, atk: 120, mp: 300, desc: 'Tăng 120 Công kích và 300 Linh Lực.' },
        { id: 'man_dan_3', name: 'Cửu Chuyển Hoàn Hồn Bí Lục', cost: 2500, hp: 2500, desc: 'Tăng 2500 HP và 30 năm thọ nguyên.' }
      ]
    },
    {
      id: 'sect_thienma',
      name: 'Cửu U Ma Giáo',
      type: 'Ma Đạo Thao Thiên',
      desc: 'Lấy sát nhập đạo, kẻ mạnh làm vua, coi thường thiên địa pháp tắc.',
      ranks: [
        { rank: 'Huyết Nô Nhập Môn', minContrib: 0, salary: 20 },
        { rank: 'Hắc Y Ma Đồ', minContrib: 100, salary: 50 },
        { rank: 'Ma Tướng Nội Môn', minContrib: 500, salary: 120 },
        { rank: 'Ma Tử Chân Truyền', minContrib: 2000, salary: 350 },
        { rank: 'U Minh Trưởng Lão', minContrib: 6000, salary: 900 },
        { rank: 'Giáo Chủ Ma Tôn', minContrib: 15000, salary: 3000 }
      ],
      manuals: [
        { id: 'man_ma_1', name: 'Huyết Sát Nhập Thể', cost: 150, atk: 60, desc: 'Tăng 60 Công kích vĩnh viễn.' },
        { id: 'man_ma_2', name: 'Thiên Ma Cắn Nuốt Pháp', cost: 800, atk: 180, lifeSteal: 0.05, desc: 'Tăng 180 Công kích và 5% Hút Máu.' },
        { id: 'man_ma_3', name: 'Cửu U Ma Thần Biến', cost: 2500, atk: 600, hp: 2000, desc: 'Tăng 600 Công kích và 2000 HP.' }
      ]
    }
  ];

  const SECT_QUESTS = [
    { id: 'quest_herb', name: 'Hái Thảo Dược Nộp Sơn Môn', desc: 'Tìm kiếm nộp 3 cành Linh Chi Thảo cho dược phòng.', reqItem: 'herb_linhchi', reqCount: 3, contrib: 40, stone: 30 },
    { id: 'quest_ore', name: 'Đào Khoáng Rèn Khí', desc: 'Khai thác nộp 2 khối Huyền Thiết Tinh cho khí các.', reqItem: 'ore_huyenthiet', reqCount: 2, contrib: 45, stone: 35 },
    { id: 'quest_patrol', name: 'Tuần Tra Sơn Cước Trừ Yêu', desc: 'Tiêu diệt 3 con yêu lang quấy nhiễu phàm nhân dưới chân núi.', contrib: 60, stone: 50 },
    { id: 'quest_donate', name: 'Quyên Góp Linh Thạch Kiến Thiết Tông Môn', desc: 'Tự nguyện quyên góp 100 Linh Thạch mở rộng sơn môn.', costStone: 100, contrib: 120, stone: 0 }
  ];

  // ==========================================================================
  // 4. PIXEL CANVAS RENDERER & PARTICLE ENGINE
  // ==========================================================================
  const SCENES = {
    MEDITATE: 'MEDITATE',
    TRIBULATION: 'TRIBULATION',
    COMBAT: 'COMBAT',
    ALCHEMY: 'ALCHEMY'
  };

  class PixelRenderer {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.width = canvas.width = 640;
      this.height = canvas.height = 360;
      this.ctx.imageSmoothingEnabled = false;

      this.currentScene = SCENES.MEDITATE;
      this.particles = [];
      this.floatingTexts = [];
      this.stars = [];
      this.time = 0;
      this.shakeDuration = 0;
      this.shakeIntensity = 0;

      this.combatState = {
        playerFlash: null,
        monsterFlash: null,
        playerOffsetX: 0,
        monsterOffsetX: 0,
        slashEffect: null,
        monsterSpriteKey: 'monsterWolf'
      };

      this.initStars();
      this.loop = this.loop.bind(this);
      requestAnimationFrame(this.loop);
    }

    initStars() {
      this.stars = [];
      for (let i = 0; i < 60; i++) {
        this.stars.push({
          x: Math.random() * this.width,
          y: Math.random() * (this.height * 0.6),
          size: Math.random() < 0.2 ? 2 : 1,
          color: Math.random() < 0.5 ? '#ffffff' : (Math.random() < 0.5 ? '#fef08a' : '#38bdf8'),
          twinkleSpeed: 0.02 + Math.random() * 0.05,
          twinklePhase: Math.random() * Math.PI * 2
        });
      }
    }

    setScene(scene) {
      this.currentScene = scene;
    }

    triggerShake(duration = 20, intensity = 6) {
      this.shakeDuration = duration;
      this.shakeIntensity = intensity;
    }

    addFloatingText(text, x, y, color = '#f87171', isCrit = false) {
      this.floatingTexts.push({
        text,
        x: x + (Math.random() - 0.5) * 20,
        y,
        vy: -1.2,
        alpha: 1.0,
        color,
        isCrit,
        life: 60
      });
    }

    addSlashEffect(x, y, type = 'sword') {
      this.combatState.slashEffect = {
        x, y, frame: 0, maxFrame: 15, type
      };
    }

    spawnQiParticles() {
      if (this.particles.length > 50) return;
      const colors = ['#38bdf8', '#34d399', '#facc15', '#f87171', '#c084fc'];
      const angle = Math.random() * Math.PI * 2;
      const dist = 140 + Math.random() * 80;
      const targetX = 320;
      const targetY = 210;

      this.particles.push({
        x: targetX + Math.cos(angle) * dist,
        y: targetY + Math.sin(angle) * dist,
        targetX,
        targetY,
        speed: 1.2 + Math.random() * 1.5,
        size: Math.random() < 0.3 ? 3 : 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.8,
        life: 90
      });
    }

    spawnLightningSparks(x, y) {
      for (let i = 0; i < 15; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 5;
        this.particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 2,
          color: Math.random() < 0.5 ? '#38bdf8' : '#ffffff',
          alpha: 1,
          life: 25,
          isSpark: true
        });
      }
    }

    loop() {
      this.time++;

      this.ctx.save();
      if (this.shakeDuration > 0) {
        const sx = (Math.random() - 0.5) * this.shakeIntensity;
        const sy = (Math.random() - 0.5) * this.shakeIntensity;
        this.ctx.translate(sx, sy);
        this.shakeDuration--;
      }

      this.ctx.fillStyle = '#090d16';
      this.ctx.fillRect(0, 0, this.width, this.height);

      switch (this.currentScene) {
        case SCENES.MEDITATE:
          this.renderMeditateScene();
          break;
        case SCENES.TRIBULATION:
          this.renderTribulationScene();
          break;
        case SCENES.COMBAT:
          this.renderCombatScene();
          break;
        case SCENES.ALCHEMY:
          this.renderAlchemyScene();
          break;
        default:
          this.renderMeditateScene();
      }

      this.updateAndDrawParticles();
      this.updateAndDrawFloatingTexts();

      this.ctx.restore();
      requestAnimationFrame(this.loop);
    }

    renderMeditateScene() {
      const ctx = this.ctx;

      this.stars.forEach(s => {
        const a = (Math.sin(this.time * s.twinkleSpeed + s.twinklePhase) + 1) / 2;
        ctx.fillStyle = s.color;
        ctx.globalAlpha = 0.3 + a * 0.7;
        ctx.fillRect(s.x, s.y, s.size, s.size);
      });
      ctx.globalAlpha = 1.0;

      drawPixelSprite(ctx, SPRITES.sceneMoon, 510, 30, 3);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      const cloud1X = ((this.time * 0.3) % (this.width + 100)) - 50;
      ctx.fillRect(cloud1X, 55, 90, 8);
      ctx.fillRect(cloud1X + 15, 48, 60, 7);

      drawPixelSprite(ctx, SPRITES.sceneMountain, 40, 110, 4);
      drawPixelSprite(ctx, SPRITES.sceneMountain, 380, 130, 3.5);

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 270, this.width, 90);
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 270, this.width, 4);

      drawPixelSprite(ctx, SPRITES.scenePine, 60, 174, 6);
      drawPixelSprite(ctx, SPRITES.sceneFurnace, 490, 190, 5);

      if (this.time % 12 === 0) {
        this.particles.push({
          x: 530 + (Math.random() - 0.5) * 10,
          y: 190,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -0.8 - Math.random() * 0.5,
          size: 3,
          color: '#f8fafc',
          alpha: 0.6,
          life: 70,
          isSmoke: true
        });
      }

      drawPixelSprite(ctx, SPRITES.sceneCushion, 272, 260, 6);

      const floatY = Math.sin(this.time * 0.05) * 4;
      ctx.save();
      const haloAlpha = 0.2 + (Math.sin(this.time * 0.08) + 1) * 0.15;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.globalAlpha = haloAlpha;
      ctx.beginPath();
      ctx.ellipse(320, 215 + floatY, 48, 56, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      drawPixelSprite(ctx, SPRITES.playerMeditate, 272, 170 + floatY, 6);

      if (this.time % 4 === 0) {
        this.spawnQiParticles();
      }

      ctx.font = '13px "Courier New", monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'center';
      ctx.fillText('Đang đả tọa hấp thu thiên địa linh khí...', 320, 335);
    }

    renderTribulationScene() {
      const ctx = this.ctx;
      const bgDarkness = Math.sin(this.time * 0.1) > 0.8 ? '#1e1b4b' : '#020617';
      ctx.fillStyle = bgDarkness;
      ctx.fillRect(0, 0, this.width, this.height);

      ctx.fillStyle = '#0f172a';
      for (let i = 0; i < 8; i++) {
        const cx = (i * 90 + this.time * 0.5) % (this.width + 100) - 50;
        ctx.beginPath();
        ctx.arc(cx, 40, 50, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = '#1c1917';
      ctx.fillRect(0, 280, this.width, 80);
      ctx.fillStyle = '#44403c';
      ctx.fillRect(0, 280, this.width, 3);

      drawPixelSprite(ctx, SPRITES.playerBattle, 272, 185, 6);

      if (this.time % 18 < 6) {
        drawProceduralLightning(ctx, 320 + (Math.random() - 0.5) * 60, 20, 320, 185, 4, '#67e8f9', 4);
        if (this.time % 18 === 1) {
          this.triggerShake(12, 8);
          this.spawnLightningSparks(320, 195);
        }
      }

      ctx.font = 'bold 16px "Courier New", monospace';
      ctx.fillStyle = '#ef4444';
      ctx.textAlign = 'center';
      ctx.fillText('CỬU THIÊN THẦN LÔI THIÊN KIẾP', 320, 70);
    }

    renderCombatScene() {
      const ctx = this.ctx;
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, this.width, this.height);

      drawPixelSprite(ctx, SPRITES.sceneMountain, 100, 100, 3);
      drawPixelSprite(ctx, SPRITES.sceneMountain, 360, 120, 3);

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 260, this.width, 100);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(0, 260, this.width, 2);

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(320, 60);
      ctx.lineTo(320, 260);
      ctx.stroke();
      ctx.setLineDash([]);

      const px = 140 + this.combatState.playerOffsetX;
      const py = 165;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(px + 48, py + 95, 36, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      drawPixelSprite(ctx, SPRITES.playerBattle, px, py, 6, false, this.combatState.playerFlash);

      const mx = 410 + this.combatState.monsterOffsetX;
      const my = 150;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(mx + 48, my + 110, 44, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      const monsterSprite = SPRITES[this.combatState.monsterSpriteKey] || SPRITES.monsterWolf;
      const monsterScale = monsterSprite.w === 24 ? 5 : 6;
      drawPixelSprite(ctx, monsterSprite, mx, my, monsterScale, true, this.combatState.monsterFlash);

      if (this.combatState.slashEffect) {
        const slash = this.combatState.slashEffect;
        slash.frame++;

        ctx.save();
        if (slash.type === 'sword') {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 5;
          ctx.shadowColor = '#bae6fd';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          const startArc = -Math.PI * 0.4 + (slash.frame / slash.maxFrame) * Math.PI * 0.6;
          ctx.arc(slash.x, slash.y, 45, startArc, startArc + Math.PI * 0.5);
          ctx.stroke();
        } else if (slash.type === 'fire') {
          ctx.fillStyle = slash.frame % 2 === 0 ? '#ef4444' : '#fbbf24';
          for (let i = 0; i < 6; i++) {
            const fx = slash.x + (Math.random() - 0.5) * 45;
            const fy = slash.y + (Math.random() - 0.5) * 45;
            ctx.fillRect(fx, fy, 8, 8);
          }
        } else if (slash.type === 'lightning') {
          drawProceduralLightning(ctx, slash.x - 20, slash.y - 60, slash.x, slash.y, 3, '#c084fc', 3);
        }
        ctx.restore();

        if (slash.frame >= slash.maxFrame) {
          this.combatState.slashEffect = null;
        }
      }

      this.combatState.playerOffsetX *= 0.8;
      this.combatState.monsterOffsetX *= 0.8;
    }

    renderAlchemyScene() {
      const ctx = this.ctx;
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(0, 0, this.width, this.height);

      drawPixelSprite(ctx, SPRITES.sceneFurnace, 240, 100, 10);

      const fireHeight = 12 + Math.sin(this.time * 0.2) * 5;
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(270, 260 - fireHeight, 100, fireHeight);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(290, 260 - fireHeight * 0.8, 60, fireHeight * 0.8);

      if (this.time % 6 === 0) {
        const colors = ['#f43f5e', '#a855f7', '#3b82f6', '#10b981', '#f59e0b'];
        this.particles.push({
          x: 320 + (Math.random() - 0.5) * 30,
          y: 110,
          vx: (Math.random() - 0.5) * 0.6,
          vy: -1.0 - Math.random() * 0.8,
          size: 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 0.8,
          life: 80,
          isSmoke: true
        });
      }

      ctx.font = '14px "Courier New", monospace';
      ctx.fillStyle = '#cbd5e1';
      ctx.textAlign = 'center';
      ctx.fillText('Đan hỏa hừng hực, lò thần thai nghén tạo hóa...', 320, 310);
    }

    updateAndDrawParticles() {
      const ctx = this.ctx;
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.life--;
        if (p.isSpark) {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.2;
        } else if (p.isSmoke) {
          p.x += p.vx;
          p.y += p.vy;
        } else {
          const dx = p.targetX - p.x;
          const dy = p.targetY - p.y;
          p.x += dx * 0.04 * p.speed;
          p.y += dy * 0.04 * p.speed;
        }
        p.alpha = Math.max(0, p.life / 60);

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        ctx.restore();

        if (p.life <= 0) this.particles.splice(i, 1);
      }
    }

    updateAndDrawFloatingTexts() {
      const ctx = this.ctx;
      for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
        const ft = this.floatingTexts[i];
        ft.life--;
        ft.y += ft.vy;
        ft.alpha = Math.max(0, ft.life / 50);

        ctx.save();
        ctx.globalAlpha = ft.alpha;
        ctx.font = ft.isCrit ? 'bold 20px "Courier New", monospace' : 'bold 15px "Courier New", monospace';
        ctx.fillStyle = ft.color;
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 4;
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();

        if (ft.life <= 0) this.floatingTexts.splice(i, 1);
      }
    }
  }

  // ==========================================================================
  // 5. TURN-BASED COMBAT ENGINE
  // ==========================================================================
  class CombatEngine {
    constructor(renderer, logCallback, onCombatEndCallback) {
      this.renderer = renderer;
      this.addLog = logCallback;
      this.onCombatEnd = onCombatEndCallback;

      this.inCombat = false;
      this.player = null;
      this.monster = null;

      this.playerCombat = {
        curHp: 0, maxHp: 0, curMp: 0, maxMp: 0,
        actionGauge: 0, skillCooldown: 0, artifactCooldown: 0,
        immortalTriggered: false, isDefending: false,
        poisonTurns: 0, burnTurns: 0, frozenTurns: 0
      };

      this.monsterCombat = {
        curHp: 0, maxHp: 0, curMp: 0,
        actionGauge: 0, frozenTurns: 0, stunnedTurns: 0,
        poisonTurns: 0, burnTurns: 0
      };

      this.isPlayerTurn = false;
      this.combatInterval = null;
    }

    startCombat(player, monsterData) {
      this.inCombat = true;
      this.player = player;
      this.monster = JSON.parse(JSON.stringify(monsterData));

      this.playerCombat = {
        curHp: this.player.curHp,
        maxHp: this.player.maxHp,
        curMp: this.player.curMp,
        maxMp: this.player.maxMp,
        actionGauge: 0,
        skillCooldown: 0,
        artifactCooldown: 0,
        immortalTriggered: false,
        isDefending: false,
        poisonTurns: 0,
        burnTurns: 0,
        frozenTurns: 0
      };

      this.monsterCombat = {
        curHp: this.monster.hp,
        maxHp: this.monster.hp,
        curMp: this.monster.mp,
        actionGauge: 0,
        frozenTurns: 0,
        stunnedTurns: 0,
        poisonTurns: 0,
        burnTurns: 0
      };

      this.renderer.combatState.monsterSpriteKey = this.monster.spriteKey || 'monsterWolf';
      this.renderer.setScene(SCENES.COMBAT);

      this.addLog(`⚔️ Đụng độ hung hiểm! Đạo hữu tao ngộ 【${this.monster.name}】! Chuẩn bị nghênh địch!`, 'battle');
      sound.playThunder();

      this.runCombatLoop();
    }

    runCombatLoop() {
      if (this.combatInterval) clearInterval(this.combatInterval);
      this.combatInterval = setInterval(() => {
        if (!this.inCombat || this.isPlayerTurn) return;

        const pSpeed = Math.max(10, this.player.totalSpd);
        const mSpeed = Math.max(10, this.monster.spd);

        this.playerCombat.actionGauge += pSpeed * 0.15;
        this.monsterCombat.actionGauge += mSpeed * 0.15;

        this.updateCombatUI();

        if (this.playerCombat.actionGauge >= 100) {
          this.playerCombat.actionGauge = 0;
          this.triggerPlayerTurn();
        } else if (this.monsterCombat.actionGauge >= 100) {
          this.monsterCombat.actionGauge = 0;
          this.triggerMonsterTurn();
        }
      }, 100);
    }

    triggerPlayerTurn() {
      if (this.playerCombat.curHp <= 0) return;

      if (this.playerCombat.poisonTurns > 0) {
        const pDmg = Math.floor(this.playerCombat.maxHp * 0.05);
        this.playerCombat.curHp = Math.max(1, this.playerCombat.curHp - pDmg);
        this.renderer.addFloatingText(`-${pDmg} Độc`, 170, 180, '#a855f7');
        this.addLog(`Độc khí công tâm! Đạo hữu mất ${pDmg} Khí Huyết!`, 'danger');
        this.playerCombat.poisonTurns--;
      }

      if (this.playerCombat.skillCooldown > 0) this.playerCombat.skillCooldown--;
      if (this.playerCombat.artifactCooldown > 0) this.playerCombat.artifactCooldown--;

      if (this.player.spiritualRoot && this.player.spiritualRoot.name === 'Thiên Mộc Linh Căn') {
        const heal = Math.floor(this.playerCombat.maxHp * 0.05);
        this.playerCombat.curHp = Math.min(this.playerCombat.maxHp, this.playerCombat.curHp + heal);
        this.renderer.addFloatingText(`+${heal} Sinh Cơ`, 170, 160, '#34d399');
      }

      this.isPlayerTurn = true;
      this.updateCombatButtons(true);
      this.updateCombatUI();
    }

    playerNormalAttack() {
      if (!this.isPlayerTurn) return;
      this.isPlayerTurn = false;
      this.updateCombatButtons(false);

      sound.playSwordSlash();
      this.renderer.combatState.playerOffsetX = 35;
      this.renderer.addSlashEffect(440, 200, 'sword');

      setTimeout(() => {
        const baseAtk = this.player.totalAtk;
        const monDef = this.monster.def;
        let dmg = Math.max(1, Math.floor(baseAtk * (1 + (Math.random() - 0.5) * 0.2) - monDef * 0.4));

        const isCrit = Math.random() < this.player.totalCrit;
        if (isCrit) {
          dmg = Math.floor(dmg * (1.5 + (this.player.totalCritDmg || 0.5)));
          this.renderer.triggerShake(10, 5);
        }

        if (this.player.physique && this.player.physique.armorPen) {
          dmg += Math.floor(monDef * 0.3);
        }

        this.monsterCombat.curHp = Math.max(0, this.monsterCombat.curHp - dmg);
        this.renderer.combatState.monsterFlash = '#ffffff';
        setTimeout(() => { this.renderer.combatState.monsterFlash = null; }, 120);

        this.renderer.addFloatingText(isCrit ? `BẠO! -${dmg}` : `-${dmg}`, 440, 160, isCrit ? '#fbbf24' : '#ef4444', isCrit);
        this.addLog(`Đạo hữu vung kiếm xuất kích, gây cho 【${this.monster.name}】 ${dmg} sát thương!${isCrit ? ' (Bạo Kích!!)' : ''}`, isCrit ? 'crit' : 'normal');

        this.handleLifeSteal(dmg);
        this.updateCombatUI();
        if (this.checkCombatOver()) return;
      }, 200);
    }

    playerCastSkill() {
      if (!this.isPlayerTurn) return;
      const skill = this.player.activeSkill;
      if (!skill) return;

      if (this.playerCombat.skillCooldown > 0) {
        this.addLog(`Kỹ năng 【${skill.name}】 chưa hồi chiêu (${this.playerCombat.skillCooldown} lượt)!`, 'warning');
        return;
      }
      if (this.playerCombat.curMp < skill.mpCost) {
        this.addLog(`Linh lực không đủ để thi triển 【${skill.name}】 (cần ${skill.mpCost} MP)!`, 'warning');
        return;
      }

      this.playerCombat.curMp -= skill.mpCost;
      if (skill.hpCostPercent) {
        const hpLoss = Math.floor(this.playerCombat.curHp * skill.hpCostPercent);
        this.playerCombat.curHp = Math.max(1, this.playerCombat.curHp - hpLoss);
        this.renderer.addFloatingText(`-${hpLoss} Huyết`, 170, 180, '#ef4444');
      }

      this.playerCombat.skillCooldown = skill.cd || 2;
      this.isPlayerTurn = false;
      this.updateCombatButtons(false);

      sound.playThunder();
      this.renderer.combatState.playerOffsetX = 40;
      this.renderer.triggerShake(14, 6);

      const effectType = skill.burnChance ? 'fire' : (skill.stunChance ? 'sword' : 'lightning');
      this.renderer.addSlashEffect(440, 190, effectType);

      setTimeout(() => {
        let dmg = Math.max(1, Math.floor(this.player.totalAtk * (skill.dmgMult || 1.8) - this.monster.def * 0.3));
        const isCrit = Math.random() < this.player.totalCrit;
        if (isCrit) dmg = Math.floor(dmg * 1.8);

        this.monsterCombat.curHp = Math.max(0, this.monsterCombat.curHp - dmg);
        this.renderer.combatState.monsterFlash = '#ffffff';
        setTimeout(() => { this.renderer.combatState.monsterFlash = null; }, 150);

        this.renderer.addFloatingText(`TUYỆT KỸ! -${dmg}`, 440, 150, '#38bdf8', true);
        this.addLog(`Đạo hữu thi triển 【${skill.name}】, oanh kích 【${this.monster.name}】 nhận ${dmg} sát thương hủy diệt!`, 'skill');

        if (this.player.cheatCore && this.player.cheatCore.id === 'proficiency') {
          this.player.skillMastery = (this.player.skillMastery || 0) + 1;
          this.addLog(`[Kim Thủ Chỉ] Độ thông thạo kỹ năng tăng thêm (+1)!`, 'system');
        }

        if (skill.healPercent) {
          const heal = Math.floor(this.playerCombat.maxHp * skill.healPercent);
          this.playerCombat.curHp = Math.min(this.playerCombat.maxHp, this.playerCombat.curHp + heal);
          this.renderer.addFloatingText(`+${heal} HP`, 170, 160, '#34d399');
          this.addLog(`Đạo hữu hồi phục ${heal} Khí Huyết!`, 'heal');
        }

        if (skill.lifeStealPercent) {
          const sHeal = Math.floor(dmg * skill.lifeStealPercent);
          this.playerCombat.curHp = Math.min(this.playerCombat.maxHp, this.playerCombat.curHp + sHeal);
          this.renderer.addFloatingText(`+${sHeal} Hút`, 170, 160, '#f43f5e');
        }

        if (skill.stunChance && Math.random() < skill.stunChance) {
          this.monsterCombat.stunnedTurns = 1;
          this.addLog(`【${this.monster.name}】 bị quyền kình đánh choáng váng mất lượt!`, 'skill');
        }

        this.updateCombatUI();
        if (this.checkCombatOver()) return;
      }, 250);
    }

    playerUseArtifact() {
      if (!this.isPlayerTurn) return;
      if (this.playerCombat.artifactCooldown > 0) {
        this.addLog(`Pháp bảo đang tích tụ linh uy (${this.playerCombat.artifactCooldown} lượt)!`, 'warning');
        return;
      }

      const art = this.player.equippedArtifact || this.player.startArtifact;
      if (!art) {
        this.addLog('Đạo hữu chưa trang bị Pháp bảo nào!', 'warning');
        return;
      }

      this.playerCombat.artifactCooldown = 3;
      this.isPlayerTurn = false;
      this.updateCombatButtons(false);

      sound.playCheatSystem();
      this.renderer.triggerShake(12, 6);
      this.renderer.addSlashEffect(440, 190, 'lightning');

      setTimeout(() => {
        const dmg = Math.floor(this.player.totalAtk * 1.5 + (art.atk || 50));
        this.monsterCombat.curHp = Math.max(0, this.monsterCombat.curHp - dmg);
        this.renderer.addFloatingText(`PHÁP BẢO! -${dmg}`, 440, 160, '#c084fc', true);
        this.addLog(`Đạo hữu tế xuất 【${art.name}】, thần quang đại phóng giáng xuống ${dmg} sát thương!`, 'artifact');

        this.playerCombat.isDefending = true;
        this.updateCombatUI();
        if (this.checkCombatOver()) return;
      }, 200);
    }

    playerUsePill(pillId) {
      if (!this.isPlayerTurn) return;
      const count = this.player.inventory[pillId] || 0;
      if (count <= 0) {
        this.addLog(`Trong túi không có đan dược này!`, 'warning');
        return;
      }

      this.player.inventory[pillId]--;
      this.isPlayerTurn = false;
      this.updateCombatButtons(false);

      sound.playLoot();
      if (pillId === 'pill_hoixuan') {
        const heal = Math.floor(this.playerCombat.maxHp * 0.5);
        this.playerCombat.curHp = Math.min(this.playerCombat.maxHp, this.playerCombat.curHp + heal);
        this.renderer.addFloatingText(`+${heal} HP`, 170, 160, '#34d399');
        this.addLog(`Đạo hữu nuốt vào Hồi Xuân Đan, sinh cơ tràn trề hồi phục ${heal} Khí Huyết!`, 'heal');
      } else if (pillId === 'pill_tulinh') {
        const mana = Math.floor(this.playerCombat.maxMp * 0.6);
        this.playerCombat.curMp = Math.min(this.playerCombat.maxMp, this.playerCombat.curMp + mana);
        this.renderer.addFloatingText(`+${mana} MP`, 170, 160, '#38bdf8');
        this.addLog(`Đạo hữu nuốt vào Tụ Linh Đan, linh đan tan ra hồi phục ${mana} Linh Lực!`, 'heal');
      }
      this.updateCombatUI();
    }

    playerFlee() {
      if (!this.isPlayerTurn) return;
      const hasEscapePerk = this.player.cheatPerk && this.player.cheatPerk.id === 'escape_master';
      const fleeChance = hasEscapePerk ? 1.0 : (this.player.totalSpd / (this.player.totalSpd + this.monster.spd * 0.8));

      if (hasEscapePerk || Math.random() < fleeChance) {
        this.addLog(`💨 Đạo hữu thi triển thân pháp tuyệt luân, thuận lợi đào thoát khỏi trận chiến!`, 'system');
        sound.playClick();
        this.endCombat(false, true);
      } else {
        this.isPlayerTurn = false;
        this.updateCombatButtons(false);
        this.addLog(`Bỏ chạy bất thành! Bị 【${this.monster.name}】 phong tỏa đường lui!`, 'danger');
        sound.playHurt();
      }
    }

    triggerMonsterTurn() {
      if (this.monsterCombat.curHp <= 0) return;

      if (this.monsterCombat.stunnedTurns > 0) {
        this.monsterCombat.stunnedTurns--;
        this.addLog(`【${this.monster.name}】 bị choáng váng không thể hành động!`, 'skill');
        return;
      }
      if (this.monsterCombat.frozenTurns > 0) {
        this.monsterCombat.frozenTurns--;
        this.addLog(`【${this.monster.name}】 bị hàn băng đóng băng không thể nhúc nhích!`, 'skill');
        return;
      }

      this.renderer.combatState.monsterOffsetX = -35;
      this.renderer.addSlashEffect(190, 200, 'sword');
      sound.playHurt();

      setTimeout(() => {
        const useSkill = this.monster.skills && this.monster.skills.length > 0 && Math.random() < 0.4;
        let dmgMult = 1.0;
        let skillName = '';
        if (useSkill) {
          const monSkill = this.monster.skills[0];
          dmgMult = monSkill.dmgMult || 1.3;
          skillName = `【${monSkill.name}】`;
        }

        const monAtk = this.monster.atk * dmgMult;
        let playerDef = this.player.totalDef;
        if (this.playerCombat.isDefending) {
          playerDef *= 1.4;
          this.playerCombat.isDefending = false;
        }

        let dmg = Math.max(1, Math.floor(monAtk * (1 + (Math.random() - 0.5) * 0.15) - playerDef * 0.35));

        if (this.player.physique && this.player.physique.tier === 'Bá Thể') {
          dmg = Math.floor(dmg * 0.8);
        }

        this.playerCombat.curHp -= dmg;
        this.renderer.combatState.playerFlash = '#ef4444';
        setTimeout(() => { this.renderer.combatState.playerFlash = null; }, 120);

        this.renderer.addFloatingText(`-${dmg}`, 190, 160, '#ef4444');
        this.addLog(`【${this.monster.name}】 ${skillName ? 'tung sát chiêu ' + skillName : 'tấn công cuồng bạo'}, đánh trúng đạo hữu ${dmg} sát thương!`, 'danger');

        if (this.player.physique && this.player.physique.reflectBonus) {
          const reflectDmg = Math.floor(dmg * this.player.physique.reflectBonus);
          this.monsterCombat.curHp = Math.max(0, this.monsterCombat.curHp - reflectDmg);
          this.renderer.addFloatingText(`PHẢN! -${reflectDmg}`, 440, 170, '#f97316');
          this.addLog(`Thể phách cứng như sắt thép! Đạo hữu phản chấn lại ${reflectDmg} sát thương!`, 'normal');
        }

        if (this.playerCombat.curHp <= 0 && !this.playerCombat.immortalTriggered) {
          if (this.player.cheatPerk && this.player.cheatPerk.id === 'immortal_body') {
            this.playerCombat.immortalTriggered = true;
            this.playerCombat.curHp = Math.floor(this.playerCombat.maxHp * 0.35);
            sound.playCheatSystem();
            this.renderer.triggerShake(15, 8);
            this.renderer.addFloatingText('BẤT TỬ CHI KHU!', 190, 140, '#facc15', true);
            this.addLog(`[Kim Thủ Chỉ] 【Bất Tử Chi Khu】 phát động! Đạo hữu miễn nhiễm tử kiếp, sinh mệnh phục hồi 35%!`, 'system');
          }
        }

        this.updateCombatUI();
        if (this.checkCombatOver()) return;
      }, 200);
    }

    handleLifeSteal(dmg) {
      const lMod = (this.player.spiritualRoot && this.player.spiritualRoot.lifeStealMod) || 0;
      const pathMod = (this.player.cultivationPath && this.player.cultivationPath.id === 'ma_tu') ? 0.2 : 0;
      const totalLs = lMod + pathMod;
      if (totalLs > 0) {
        const heal = Math.floor(dmg * totalLs);
        this.playerCombat.curHp = Math.min(this.playerCombat.maxHp, this.playerCombat.curHp + heal);
        this.renderer.addFloatingText(`+${heal} Hút`, 170, 160, '#f43f5e');
      }
    }

    checkCombatOver() {
      if (this.monsterCombat.curHp <= 0) {
        this.handleVictory();
        return true;
      }
      if (this.playerCombat.curHp <= 0) {
        this.handleDefeat();
        return true;
      }
      return false;
    }

    handleVictory() {
      this.addLog(`🎉 Đại thắng! Đạo hữu đã chém gục 【${this.monster.name}】 dưới chân!`, 'victory');
      sound.playBreakthrough();

      let expGain = this.monster.exp || 50;
      expGain = Math.floor(expGain * (this.player.comprehension / 100));

      let stoneGain = this.monster.stone || 20;
      if (this.player.cheatPerk && this.player.cheatPerk.id === 'double_loot') {
        stoneGain *= 2;
      }

      this.player.exp += expGain;
      this.player.spiritStones = (this.player.spiritStones || 0) + stoneGain;
      this.addLog(`Thu hoạch: +${expGain} Tu Vi, +${stoneGain} Linh Thạch.`, 'loot');

      if (this.monster.drops) {
        this.monster.drops.forEach(drop => {
          let chance = drop.chance || 0.5;
          if (this.player.cheatPerk && this.player.cheatPerk.id === 'double_loot') chance = Math.min(1.0, chance * 1.5);
          if (Math.random() < chance) {
            this.player.inventory[drop.item] = (this.player.inventory[drop.item] || 0) + 1;
            this.addLog(`Nhặt được chiến lợi phẩm: 【${drop.item}】 x1!`, 'loot');
          }
        });
      }

      if (this.player.cheatCore && this.player.cheatCore.id === 'devour') {
        const bonusAtk = Math.max(1, Math.floor(this.monster.atk * 0.03));
        const bonusHp = Math.max(5, Math.floor(this.monster.hp * 0.02));
        const bonusExp = Math.floor(this.monster.exp * 0.5);

        this.player.bonusAtk = (this.player.bonusAtk || 0) + bonusAtk;
        this.player.bonusHp = (this.player.bonusHp || 0) + bonusHp;
        this.player.exp += bonusExp;

        sound.playCheatSystem();
        this.addLog(`🌀 [Kim Thủ Chỉ] 【Thần Cấp Cắn Nuốt】 phát động! Cắn nuốt thi hài ma thú: +${bonusAtk} Công kích vĩnh viễn, +${bonusHp} HP vĩnh viễn, +${bonusExp} Tu Vi!`, 'system');
      }

      this.endCombat(true, false);
    }

    handleDefeat() {
      this.addLog(`💀 Thất bại thảm hại! Đạo hữu trọng thương trước vuốt sắc của 【${this.monster.name}】! May nhờ bảo bối hộ thể giữ lại một tia tàn hồn!`, 'danger');
      sound.playHurt();

      this.player.spiritStones = Math.floor(this.player.spiritStones * 0.9);
      this.player.curHp = Math.floor(this.player.maxHp * 0.2);
      this.endCombat(false, false);
    }

    endCombat(won, fled) {
      this.inCombat = false;
      if (this.combatInterval) clearInterval(this.combatInterval);

      this.player.curHp = this.playerCombat.curHp;
      this.player.curMp = this.playerCombat.curMp;
      this.updateCombatButtons(false);

      setTimeout(() => {
        this.renderer.setScene(SCENES.MEDITATE);
        if (this.onCombatEnd) this.onCombatEnd(won, fled);
      }, 1500);
    }

    updateCombatUI() {
      const pNameEl = document.getElementById('combat-player-name');
      const pHpEl = document.getElementById('combat-player-hp');
      const pMpEl = document.getElementById('combat-player-mp');
      const pGaugeEl = document.getElementById('combat-player-gauge');

      const mNameEl = document.getElementById('combat-monster-name');
      const mHpEl = document.getElementById('combat-monster-hp');
      const mGaugeEl = document.getElementById('combat-monster-gauge');

      if (pNameEl && this.player) pNameEl.textContent = this.player.name;
      if (pHpEl) pHpEl.style.width = `${Math.max(0, Math.min(100, (this.playerCombat.curHp / this.playerCombat.maxHp) * 100))}%`;
      if (pMpEl) pMpEl.style.width = `${Math.max(0, Math.min(100, (this.playerCombat.curMp / this.playerCombat.maxMp) * 100))}%`;
      if (pGaugeEl) pGaugeEl.style.width = `${Math.max(0, Math.min(100, this.playerCombat.actionGauge))}%`;

      if (mNameEl && this.monster) mNameEl.textContent = this.monster.name;
      if (mHpEl) mHpEl.style.width = `${Math.max(0, Math.min(100, (this.monsterCombat.curHp / this.monsterCombat.maxHp) * 100))}%`;
      if (mGaugeEl) mGaugeEl.style.width = `${Math.max(0, Math.min(100, this.monsterCombat.actionGauge))}%`;
    }

    updateCombatButtons(enabled) {
      const btnAttack = document.getElementById('btn-combat-attack');
      const btnSkill = document.getElementById('btn-combat-skill');
      const btnArtifact = document.getElementById('btn-combat-artifact');
      const btnPill = document.getElementById('btn-combat-pill');
      const btnFlee = document.getElementById('btn-combat-flee');

      [btnAttack, btnSkill, btnArtifact, btnPill, btnFlee].forEach(btn => {
        if (btn) btn.disabled = !enabled;
      });

      if (btnSkill && this.player && this.player.activeSkill) {
        btnSkill.textContent = `2. Kỹ Năng: ${this.player.activeSkill.name} (${this.player.activeSkill.mpCost} MP)${this.playerCombat.skillCooldown > 0 ? ` [${this.playerCombat.skillCooldown}]` : ''}`;
      }
    }
  }

  // ==========================================================================
  // 6. GAME SYSTEMS (TU LUYỆN, ĐỘ KIẾP, THẾ GIỚI MỞ, TÔNG MÔN, PHƯỜNG THỊ)
  // ==========================================================================
  class GameSystems {
    constructor(renderer, logCallback) {
      this.renderer = renderer;
      this.addLog = logCallback;
      this.player = null;
      this.combatEngine = null;
      this.currentRegion = WORLD_REGIONS[0];
      this.marketItems = [];
      this.idleTimer = null;
      this.saveTimer = null;
    }

    setCombatEngine(combatEngine) {
      this.combatEngine = combatEngine;
    }

    initNewCharacter(daoHieu, root, physique, comprehension, pathId, cheatName, coreId, perkId) {
      const path = CULTIVATION_PATHS[pathId];
      const core = CHEAT_CORES[coreId];
      const perk = CHEAT_PERKS[perkId];

      this.player = {
        name: daoHieu || 'Vô Danh Tu Sĩ',
        realmIndex: 0,
        exp: 0,
        age: 16,
        month: 1,
        spiritualRoot: root,
        physique: physique,
        comprehension: comprehension,
        cultivationPath: path,

        cheatSystemName: cheatName || 'Hệ Thống Vô Địch',
        cheatCore: core,
        cheatPerk: perk,
        cheatPoints: 50,
        lastSignInYear: -1,
        signedRegions: {},
        skillMastery: 1,

        bonusHp: 0, bonusMp: 0, bonusAtk: 0, bonusDef: 0, bonusSpd: 0,

        equippedWeapon: path.startArtifact.type === 'weapon' ? path.startArtifact : null,
        equippedArmor: path.startArtifact.type === 'armor' ? path.startArtifact : null,
        equippedArtifact: path.startArtifact.type === 'artifact' ? path.startArtifact : null,
        activeSkill: path.startSkill,

        spiritStones: 100,
        inventory: {
          pill_hoixuan: 3,
          pill_tulinh: 2,
          pill_tukhi: 2,
          herb_linhchi: 5,
          ore_huyenthiet: 3
        },

        sectId: null,
        sectContrib: 0,
        sectSalaryClaimedYear: -1,
        isInjured: false
      };

      this.recalculatePlayerStats();
      this.player.curHp = this.player.maxHp;
      this.player.curMp = this.player.maxMp;

      this.refreshMarket();
      this.startLoops();

      this.addLog(`📜 Thiên Mệnh sơ định! Đạo hữu 【${this.player.name}】 chính thức bước chân vào tiên đồ!`, 'golden');
      this.addLog(`Linh căn: 【${root.name}】 | Thể chất: 【${physique.name}】 | Ngộ tính: 【${comprehension}%】`, 'system');
      this.addLog(`Kim Thủ Chỉ thức tỉnh: 【${this.player.cheatSystemName}】 (${core.name})!`, 'system');
    }

    recalculatePlayerStats() {
      const p = this.player;
      if (!p) return;
      const base = REALMS[p.realmIndex];

      let phyHp = 0, phyDef = 0, phyAtk = 0;
      if (p.physique) {
        if (p.physique.hpBonus) phyHp += p.physique.hpBonus;
        if (p.physique.defBonus) phyDef += p.physique.defBonus;
        if (p.physique.atkBonus) phyAtk += p.physique.atkBonus;
        if (p.physique.allBonus) {
          phyHp += p.physique.allBonus;
          phyDef += p.physique.allBonus;
          phyAtk += p.physique.allBonus;
        }
      }

      const pathBonus = (p.cultivationPath && p.cultivationPath.bonus) || {};
      const wpnAtk = (p.equippedWeapon && p.equippedWeapon.atk) || 0;
      const armHp = (p.equippedArmor && p.equippedArmor.hp) || 0;
      const armDef = (p.equippedArmor && p.equippedArmor.def) || 0;
      const artHp = (p.equippedArtifact && p.equippedArtifact.hp) || 0;
      const artMp = (p.equippedArtifact && p.equippedArtifact.mp) || 0;
      const artAtk = (p.equippedArtifact && p.equippedArtifact.atk) || 0;
      const artDef = (p.equippedArtifact && p.equippedArtifact.def) || 0;

      p.maxHp = Math.floor((base.hp + (pathBonus.hp || 0) + armHp + artHp + (p.bonusHp || 0)) * (1 + phyHp));
      p.maxMp = Math.floor((base.mp + (pathBonus.mp || 0) + artMp + (p.bonusMp || 0)) * (1 + ((p.spiritualRoot && p.spiritualRoot.mpMod) || 0)));
      p.totalAtk = Math.floor((base.atk + (pathBonus.atk || 0) + wpnAtk + artAtk + (p.bonusAtk || 0)) * (1 + phyAtk) * ((p.spiritualRoot && p.spiritualRoot.dmgMod) || 1));
      p.totalDef = Math.floor((base.def + (pathBonus.def || 0) + armDef + artDef + (p.bonusDef || 0)) * (1 + phyDef));

      let spdMod = 1.0;
      if (p.cheatPerk && p.cheatPerk.id === 'escape_master') spdMod += 0.5;
      if (p.spiritualRoot && p.spiritualRoot.spdMod) spdMod += p.spiritualRoot.spdMod;
      p.totalSpd = Math.floor((base.spd + (p.bonusSpd || 0)) * spdMod);

      p.totalCrit = 0.05 + ((pathBonus.crit || 0)) + ((p.spiritualRoot && p.spiritualRoot.critMod) || 0) + ((p.physique && p.physique.critBonus) || 0) + ((p.equippedWeapon && p.equippedWeapon.crit) || 0);
      p.totalCritDmg = 0.5 + (pathBonus.critDmg || 0);
      p.maxLifespan = base.lifespan + (p.bonusLifespan || 0);

      if (p.curHp > p.maxHp) p.curHp = p.maxHp;
      if (p.curMp > p.maxMp) p.curMp = p.maxMp;
    }

    startLoops() {
      if (this.idleTimer) clearInterval(this.idleTimer);
      if (this.saveTimer) clearInterval(this.saveTimer);

      this.idleTimer = setInterval(() => {
        if (!this.player) return;
        if (this.combatEngine && this.combatEngine.inCombat) return;

        this.tickCultivation();
        this.tickTime();
        this.updateUI();
      }, 1000);

      this.saveTimer = setInterval(() => {
        this.saveToLocalStorage();
      }, 5000);
    }

    tickCultivation() {
      const p = this.player;
      const baseRealm = REALMS[p.realmIndex];
      if (p.exp >= baseRealm.maxExp) return;

      const baseExpPerSec = Math.max(1, Math.floor(Math.sqrt(baseRealm.maxExp) * 0.12));
      let expGain = baseExpPerSec * (p.comprehension / 100);
      if (p.spiritualRoot && p.spiritualRoot.speedMod) expGain *= p.spiritualRoot.speedMod;
      if (p.physique && p.physique.expBonus) expGain *= (1 + p.physique.expBonus);

      if (p.cheatCore && p.cheatCore.id === 'proficiency') {
        expGain *= 1.25;
      }

      p.exp = Math.min(baseRealm.maxExp, p.exp + Math.max(1, Math.floor(expGain)));
      p.curHp = Math.min(p.maxHp, p.curHp + Math.ceil(p.maxHp * 0.02));
      p.curMp = Math.min(p.maxMp, p.curMp + Math.ceil(p.maxMp * 0.03));
    }

    tickTime() {
      const p = this.player;
      this.timeCounter = (this.timeCounter || 0) + 1;
      if (this.timeCounter >= 60) {
        this.timeCounter = 0;
        p.month++;
        if (p.month > 12) {
          p.month = 1;
          p.age++;
          this.addLog(`⏳ Tuế nguyệt thoi đưa! Một năm trôi qua, đạo hữu nay đã ${p.age} tuổi.`, 'system');

          if (p.cheatCore && p.cheatCore.id === 'gacha') {
            p.cheatPoints = (p.cheatPoints || 0) + 50;
            this.addLog(`[Kim Thủ Chỉ] Tích lũy 1 năm tu đạo: +50 Điểm Thiên Cơ!`, 'system');
          }

          this.refreshMarket();
          if (p.age >= p.maxLifespan) {
            this.handleDeathByAge();
          }
        }
      }
    }

    activeGatherQi() {
      if (!this.player) return;
      const p = this.player;
      const baseRealm = REALMS[p.realmIndex];

      if (p.exp >= baseRealm.maxExp) {
        this.addLog('Tu vi đã chạm bình cảnh đỉnh phong! Cần lập tức đả tọa đột phá!', 'warning');
        return;
      }

      sound.playMeditateDing();
      const gain = Math.max(2, Math.floor(Math.sqrt(baseRealm.maxExp) * 0.3 * (p.comprehension / 100)));
      p.exp = Math.min(baseRealm.maxExp, p.exp + gain);

      this.renderer.addFloatingText(`+${gain} Tu Vi`, 320, 160, '#38bdf8');
      this.renderer.spawnQiParticles();
      this.updateUI();
    }

    breakthrough() {
      const p = this.player;
      if (!p) return;
      const realm = REALMS[p.realmIndex];

      if (p.exp < realm.maxExp) {
        this.addLog(`Tu vi chưa đạt đỉnh phong (${p.exp}/${realm.maxExp}), cưỡng ép đột phá ắt tẩu hỏa nhập ma!`, 'warning');
        return;
      }

      let successChance = realm.rate;
      successChance += (p.comprehension - 80) * 0.002;
      if (p.physique && p.physique.breakBonus) successChance += p.physique.breakBonus;

      let usedPill = null;
      if (realm.pillNeeded && p.inventory[this.getPillIdByName(realm.pillNeeded)] > 0) {
        const pillId = this.getPillIdByName(realm.pillNeeded);
        p.inventory[pillId]--;
        usedPill = realm.pillNeeded;
        successChance += 0.35;
      } else if (p.inventory['pill_daotam'] > 0) {
        p.inventory['pill_daotam']--;
        usedPill = 'Đạo Tâm Đan';
        successChance += 0.20;
      }

      if (p.cheatPerk && p.cheatPerk.id === 'breakthrough_guard') {
        successChance += 0.30;
      }

      successChance = Math.min(0.98, Math.max(0.05, successChance));

      if (realm.isMajorBreakthrough || realm.isAscension) {
        this.renderer.setScene(SCENES.TRIBULATION);
        this.addLog(`⚡ CỬU THIÊN THẦN LÔI HẠNG GIÁNG! Đạo hữu dẫn động Thiên Kiếp đột phá 【${realm.major}】!`, 'danger');
        sound.playThunder();

        setTimeout(() => {
          this.resolveBreakthrough(successChance, usedPill);
        }, 3500);
      } else {
        this.resolveBreakthrough(successChance, usedPill);
      }
    }

    resolveBreakthrough(successChance, usedPill) {
      const p = this.player;
      const realm = REALMS[p.realmIndex];
      const isSuccess = Math.random() < successChance;

      if (isSuccess) {
        p.realmIndex++;
        p.exp = 0;
        this.recalculatePlayerStats();
        p.curHp = p.maxHp;
        p.curMp = p.maxMp;

        const newRealm = REALMS[p.realmIndex];
        sound.playBreakthrough();
        this.renderer.setScene(SCENES.MEDITATE);

        this.addLog(`✨ ĐỘT PHÁ THÀNH CÔNG! Chúc mừng đạo hữu ngưng tụ đại đạo, thăng tiến 【${newRealm.name}】!`, 'golden');
        if (usedPill) this.addLog(`Đã tiêu hao 1 viên 【${usedPill}】 hộ trì kinh mạch bình an!`, 'loot');
        this.addLog(`Chỉ số tăng vọt! Thọ nguyên tăng lên ${p.maxLifespan} tuổi!`, 'system');

        if (newRealm.isAscension) {
          this.addLog(`🌟 PHI THĂNG TIÊN GIỚI! Đạo hữu đã vượt qua cửu cửu thiên kiếp, công đức viên mãn, phi thăng hóa tiên!`, 'golden');
        }
      } else {
        sound.playHurt();
        this.renderer.setScene(SCENES.MEDITATE);
        p.exp = Math.floor(p.exp * 0.6);

        if (p.cheatPerk && p.cheatPerk.id === 'breakthrough_guard') {
          this.addLog(`💔 Đột phá thất bại! May nhờ có 【Thiên Đạo Hộ Thể】 bảo hộ chân nguyên, miễn trừ tâm ma phản phệ!`, 'system');
        } else {
          p.curHp = Math.max(1, Math.floor(p.curHp * 0.3));
          this.addLog(`💀 Đột phá thất bại! Bị lôi kiếp cùng tâm ma phản phệ, thổ huyết trọng thương, mất đi 40% tu vi!`, 'danger');
        }
      }

      this.updateUI();
    }

    exploreWorld() {
      if (!this.player) return;
      const p = this.player;

      if (p.realmIndex < this.currentRegion.reqRealmIndex) {
        const reqRealm = REALMS[this.currentRegion.reqRealmIndex];
        this.addLog(`Vùng đất 【${this.currentRegion.name}】 hung hiểm dị thường! Cần đạt cảnh giới 【${reqRealm.name}】 mới được vào!`, 'warning');
        return;
      }

      if (p.cheatCore && p.cheatCore.id === 'signin') {
        if (!p.signedRegions[this.currentRegion.id]) {
          p.signedRegions[this.currentRegion.id] = true;
          const rewardStones = 200 + this.currentRegion.reqRealmIndex * 50;
          p.spiritStones += rewardStones;
          this.addLog(`🌀 [Kim Thủ Chỉ] Lần đầu đặt chân đến 【${this.currentRegion.name}】! Đánh Dấu nhận ngay ${rewardStones} Linh Thạch!`, 'system');
          sound.playCheatSystem();
        }
      }

      const rng = Math.random();
      if (rng < 0.45) {
        const monList = this.currentRegion.monsters;
        const monKey = monList[Math.floor(Math.random() * monList.length)];
        const monData = MONSTERS[monKey];
        if (monData && this.combatEngine) {
          this.combatEngine.startCombat(this.player, monData);
        }
        return;
      }

      if (rng < 0.75) {
        const event = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
        this.showEventModal(event);
        return;
      }

      sound.playLoot();
      let herbs = this.currentRegion.herbs;
      let ores = this.currentRegion.ores;
      let isHerb = Math.random() < 0.5;
      let lootId = isHerb ? herbs[Math.floor(Math.random() * herbs.length)] : ores[Math.floor(Math.random() * ores.length)];
      let count = (p.cheatPerk && p.cheatPerk.id === 'double_loot') ? 2 : 1;

      p.inventory[lootId] = (p.inventory[lootId] || 0) + count;
      const itemData = ITEMS[lootId];
      this.addLog(`🌿 Du ngoạn trong 【${this.currentRegion.name}】, đạo hữu may mắn tìm thấy 【${itemData.name}】 x${count}!`, 'loot');

      const minStone = this.currentRegion.lootStoneRange[0];
      const maxStone = this.currentRegion.lootStoneRange[1];
      let stones = Math.floor(minStone + Math.random() * (maxStone - minStone));
      if (p.cheatPerk && p.cheatPerk.id === 'double_loot') stones *= 2;
      p.spiritStones += stones;
      this.addLog(`Nhặt thêm ${stones} Linh Thạch tinh khiết nằm trong hốc đá.`, 'loot');

      this.updateUI();
    }

    showEventModal(event) {
      const modal = document.getElementById('event-modal');
      const titleEl = document.getElementById('event-title');
      const descEl = document.getElementById('event-desc');
      const choicesContainer = document.getElementById('event-choices');
      if (!modal) return;

      titleEl.textContent = event.title;
      descEl.textContent = event.desc;
      choicesContainer.innerHTML = '';

      event.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'pixel-btn choice-btn';
        btn.textContent = choice.text;
        btn.onclick = () => {
          modal.classList.add('hidden');
          this.resolveEventChoice(choice.action);
        };
        choicesContainer.appendChild(btn);
      });

      modal.classList.remove('hidden');
    }

    resolveEventChoice(action) {
      const p = this.player;
      sound.playClick();

      switch (action) {
        case 'respect':
          p.inventory['pill_trucco'] = (p.inventory['pill_trucco'] || 0) + 1;
          p.spiritStones += 150;
          this.addLog('Tiền bối hiển linh! Nhẫn trữ vật tự động mở ra: Nhận 1 viên Trúc Cơ Đan và 150 Linh Thạch!', 'golden');
          break;
        case 'rush':
          if (Math.random() < 0.5) {
            p.inventory['wpn_xichtieu'] = (p.inventory['wpn_xichtieu'] || 0) + 1;
            this.addLog('Vận may tột đỉnh! Đoạt được Xích Tiêu Kiếm trong nhẫn trữ vật!', 'golden');
          } else {
            p.curHp = Math.max(1, Math.floor(p.curHp * 0.5));
            this.addLog('Trúng bẫy độc tàn hồn của tiền bối! Khí huyết tổn hao một nửa!', 'danger');
          }
          break;
        case 'leave':
          this.addLog('Đạo hữu cẩn trọng lùi lại, tâm cảnh không gợn sóng, an toàn rời khỏi.', 'system');
          break;
        case 'save':
          p.inventory['pill_kimdan'] = (p.inventory['pill_kimdan'] || 0) + 1;
          this.addLog('Nữ tu cảm kích khôn cùng, tặng đạo hữu 1 viên Kim Đan Hóa Thần Hoàn rồi ngự kiếm rời đi!', 'golden');
          break;
        case 'sneak':
          p.spiritStones += 80;
          this.addLog('Nhặt được túi linh thạch của người đã khuất, tăng 80 Linh Thạch.', 'loot');
          break;
        case 'ignore':
          this.addLog('Tu tiên giới tàn khốc, đạo hữu lạnh lùng quay lưng không đoái hoài.', 'system');
          break;
        case 'drink':
          const expGain = Math.floor(1500 * (p.comprehension / 100));
          p.exp += expGain;
          this.addLog(`Linh dịch tẩy tủy! Tu vi bạo tăng ${expGain} điểm!`, 'golden');
          break;
        case 'bathe':
          p.bonusDef = (p.bonusDef || 0) + 15;
          this.recalculatePlayerStats();
          this.addLog('Ngâm suối tiên gân cốt cứng như thép! Phòng ngự tăng vĩnh viễn +15 điểm!', 'golden');
          break;
        case 'bottle':
          p.inventory['pill_tulinh'] = (p.inventory['pill_tulinh'] || 0) + 3;
          this.addLog('Thu thập được 3 bình Linh Thủy (Tụ Linh Đan x3)!', 'loot');
          break;
        case 'fight_cultist':
          const cultistMon = MONSTERS['cultist_dark'];
          if (this.combatEngine && cultistMon) {
            this.combatEngine.startCombat(this.player, cultistMon);
            const tabCombatBtn = document.querySelector('[data-tab="tab-combat"]');
            if (tabCombatBtn) tabCombatBtn.click();
          }
          break;
        case 'accept_deal':
          p.spiritStones -= 100;
          p.age += 5;
          p.exp += 3000;
          this.addLog('Uống Huyết Đan tà đạo: Đổi 100 Linh Thạch và 5 năm thọ nguyên lấy 3000 Tu Vi!', 'danger');
          break;
        case 'flee':
          this.addLog('Đạo hữu lùi bước thần tốc, tà tu đuổi theo không kịp đành chửi thề bỏ đi.', 'system');
          break;
      }
      this.updateUI();
    }

    triggerSignIn() {
      const p = this.player;
      if (p.lastSignInYear === p.age) {
        this.addLog(`Năm nay đạo hữu đã điểm danh nhận thưởng rồi! Hãy đợi sang năm mới!`, 'warning');
        return;
      }
      p.lastSignInYear = p.age;
      const rewardStone = 300 + p.realmIndex * 150;
      p.spiritStones += rewardStone;
      p.inventory['pill_tukhi'] = (p.inventory['pill_tukhi'] || 0) + 2;

      sound.playCheatSystem();
      this.addLog(`🌀 [Kim Thủ Chỉ] 【Đánh Dấu Thành Công】! Nhận ${rewardStone} Linh Thạch + 2 Tụ Khí Đan!`, 'system');
      this.updateUI();
    }

    triggerGachaSpin() {
      const p = this.player;
      if ((p.cheatPoints || 0) < 50) {
        this.addLog(`Điểm Thiên Cơ không đủ (cần 50 Điểm)! Hãy lịch luyện và tu đạo thêm!`, 'warning');
        return;
      }

      p.cheatPoints -= 50;
      sound.playCheatSystem();

      const roll = Math.random();
      if (roll < 0.05) {
        p.inventory['wpn_tienkiem'] = (p.inventory['wpn_tienkiem'] || 0) + 1;
        this.addLog(`🌟 [RÚT THƯỞNG VẠN GIỚI - SSR] Bát Hoang Tiên Kiếm thượng cổ giáng thế nhập vào túi đồ!`, 'golden');
        sound.playBreakthrough();
      } else if (roll < 0.20) {
        p.inventory['pill_tho_nguyen'] = (p.inventory['pill_tho_nguyen'] || 0) + 1;
        this.addLog(`✨ [RÚT THƯỞNG VẠN GIỚI - SR] Quay trúng 1 viên 【Cửu Chuyển Thọ Nguyên Đan】 (+50 năm thọ nguyên)!`, 'golden');
      } else if (roll < 0.50) {
        p.inventory['pill_kimdan'] = (p.inventory['pill_kimdan'] || 0) + 1;
        this.addLog(`💎 [RÚT THƯỞNG VẠN GIỚI - R] Quay trúng 1 viên 【Kim Đan Hóa Thần Hoàn】!`, 'loot');
      } else {
        p.spiritStones += 500;
        this.addLog(`🎁 [RÚT THƯỞNG VẠN GIỚI] Quay trúng túi lớn 500 Linh Thạch!`, 'loot');
      }

      this.updateUI();
    }

    upgradeSkillMastery() {
      const p = this.player;
      if ((p.skillMastery || 1) >= 5) {
        this.addLog('Kỹ năng đã đạt cảnh giới Xuất Thần Nhập Hóa cao nhất!', 'warning');
        return;
      }

      p.skillMastery = (p.skillMastery || 1) + 1;
      if (p.activeSkill) {
        p.activeSkill.dmgMult = Number((p.activeSkill.dmgMult * 1.25).toFixed(2));
      }
      sound.playCheatSystem();
      this.addLog(`🌀 [Kim Thủ Chỉ] 【Đốn Ngộ Thành Công】! Kỹ năng 【${p.activeSkill.name}】 thăng lên Tầng ${p.skillMastery}! Sát thương tăng 25%!`, 'system');
      this.updateUI();
    }

    craftRecipe(recipeId) {
      const p = this.player;
      const recipe = RECIPES.find(r => r.id === recipeId);
      if (!recipe) return;

      for (const [itemId, count] of Object.entries(recipe.ingredients)) {
        if ((p.inventory[itemId] || 0) < count) {
          const itemObj = ITEMS[itemId];
          this.addLog(`Không đủ nguyên liệu 【${itemObj.name}】 (cần ${count}, có ${p.inventory[itemId] || 0})!`, 'warning');
          return;
        }
      }

      for (const [itemId, count] of Object.entries(recipe.ingredients)) {
        p.inventory[itemId] -= count;
      }

      this.renderer.setScene(SCENES.ALCHEMY);
      let rate = recipe.successRate;
      if (p.cultivationPath && p.cultivationPath.id === 'dan_y_tu') rate += 0.15;

      setTimeout(() => {
        this.renderer.setScene(SCENES.MEDITATE);
        if (Math.random() < rate) {
          sound.playLoot();
          p.inventory[recipe.resultId] = (p.inventory[recipe.resultId] || 0) + 1;
          const resultItem = ITEMS[recipe.resultId];
          this.addLog(`🔥 Luyện chế thành công! Lò thần mở nắp, nhận được 【${resultItem.name}】 x1!`, 'loot');
        } else {
          sound.playHurt();
          this.addLog(`💥 Nổ lò! Dược lực mất cân bằng khiến đan dược cháy thành tro bụi!`, 'danger');
        }
        this.updateUI();
      }, 1500);
    }

    refreshMarket() {
      const keys = Object.keys(ITEMS);
      const shuffled = keys.sort(() => 0.5 - Math.random());
      this.marketItems = shuffled.slice(0, 6).map(k => ITEMS[k]);
      this.renderMarketUI();
    }

    buyItem(itemId) {
      const p = this.player;
      const item = ITEMS[itemId];
      if (!item) return;

      if (p.spiritStones < item.price) {
        this.addLog(`Linh Thạch không đủ để mua 【${item.name}】 (cần ${item.price} Linh Thạch)!`, 'warning');
        return;
      }

      p.spiritStones -= item.price;
      p.inventory[itemId] = (p.inventory[itemId] || 0) + 1;
      sound.playLoot();
      this.addLog(`Đã mua 【${item.name}】 x1 từ Phường Thị với giá ${item.price} Linh Thạch.`, 'loot');
      this.updateUI();
    }

    sellItem(itemId) {
      const p = this.player;
      const count = p.inventory[itemId] || 0;
      if (count <= 0) return;

      const item = ITEMS[itemId];
      const sellPrice = Math.max(1, Math.floor(item.price * 0.5));
      p.inventory[itemId]--;
      p.spiritStones += sellPrice;

      sound.playClick();
      this.addLog(`Đã bán 【${item.name}】 x1 thu về ${sellPrice} Linh Thạch.`, 'loot');
      this.updateUI();
    }

    joinSect(sectId) {
      const p = this.player;
      const sect = SECTS.find(s => s.id === sectId);
      if (!sect) return;

      p.sectId = sect.id;
      p.sectContrib = 0;
      sound.playBreakthrough();
      this.addLog(`🏯 Đạo hữu chính thức bái nhập 【${sect.name}】! Trở thành đệ tử Tạp dịch sơn môn!`, 'golden');
      this.updateUI();
    }

    claimSectSalary() {
      const p = this.player;
      if (!p || !p.sectId) return;

      if (p.sectSalaryClaimedYear === p.age) {
        this.addLog(`Năm nay đạo hữu đã nhận bổng lộc tông môn rồi!`, 'warning');
        return;
      }

      const curRank = this.getCurrentSectRank();
      const salary = curRank.salary || 10;
      p.sectSalaryClaimedYear = p.age;
      p.spiritStones += salary;
      sound.playLoot();
      this.addLog(`Nhận bổng lộc hàng năm của chức vị 【${curRank.rank}】: +${salary} Linh Thạch!`, 'loot');
      this.updateUI();
    }

    completeSectQuest(questId) {
      const p = this.player;
      const quest = SECT_QUESTS.find(q => q.id === questId);
      if (!quest) return;

      if (quest.reqItem) {
        if ((p.inventory[quest.reqItem] || 0) < quest.reqCount) {
          this.addLog(`Chưa đủ nguyên liệu giao nộp nhiệm vụ!`, 'warning');
          return;
        }
        p.inventory[quest.reqItem] -= quest.reqCount;
      } else if (quest.costStone) {
        if (p.spiritStones < quest.costStone) {
          this.addLog(`Không đủ linh thạch để quyên góp!`, 'warning');
          return;
        }
        p.spiritStones -= quest.costStone;
      }

      p.sectContrib += quest.contrib;
      if (quest.stone) p.spiritStones += quest.stone;

      sound.playLoot();
      this.addLog(`Hoàn thành nhiệm vụ 【${quest.name}】! Nhận +${quest.contrib} Điểm Cống Hiến${quest.stone ? `, +${quest.stone} Linh Thạch` : ''}!`, 'loot');
      this.checkSectPromotion();
      this.updateUI();
    }

    getCurrentSectRank() {
      const p = this.player;
      if (!p || !p.sectId) return null;
      const sect = SECTS.find(s => s.id === p.sectId);
      let rank = sect.ranks[0];
      for (let r of sect.ranks) {
        if (p.sectContrib >= r.minContrib) rank = r;
      }
      return rank;
    }

    checkSectPromotion() {
      const curRank = this.getCurrentSectRank();
      if (curRank && curRank.rank !== this.player.lastSectRank) {
        this.player.lastSectRank = curRank.rank;
        sound.playBreakthrough();
        this.addLog(`🎉 Chúc mừng đạo hữu cống hiến vượt bậc, được thăng làm 【${curRank.rank}】 trong tông môn!`, 'golden');
      }
    }

    buySectManual(manualId) {
      const p = this.player;
      if (!p || !p.sectId) return;
      const sect = SECTS.find(s => s.id === p.sectId);
      const man = sect.manuals.find(m => m.id === manualId);
      if (!man) return;

      if (p.sectContrib < man.cost) {
        this.addLog(`Điểm Cống Hiến không đủ (cần ${man.cost} điểm)!`, 'warning');
        return;
      }

      p.sectContrib -= man.cost;
      if (man.atk) p.bonusAtk = (p.bonusAtk || 0) + man.atk;
      if (man.def) p.bonusDef = (p.bonusDef || 0) + man.def;
      if (man.hp) p.bonusHp = (p.bonusHp || 0) + man.hp;
      if (man.mp) p.bonusMp = (p.bonusMp || 0) + man.mp;

      this.recalculatePlayerStats();
      sound.playBreakthrough();
      this.addLog(`📖 Đổi được bí tịch 【${man.name}】 tại Tàng Kinh Các! Thuộc tính tăng vĩnh viễn!`, 'golden');
      this.updateUI();
    }

    useInventoryItem(itemId) {
      const p = this.player;
      if (!p) return;
      const count = p.inventory[itemId] || 0;
      if (count <= 0) return;

      const item = ITEMS[itemId];
      if (!item) return;

      if (item.type === 'pill') {
        if (item.healPercent) {
          p.curHp = Math.min(p.maxHp, p.curHp + Math.floor(p.maxHp * item.healPercent));
          p.inventory[itemId]--;
          sound.playLoot();
          this.addLog(`Uống 【${item.name}】, hồi phục ${Math.floor(item.healPercent * 100)}% Khí Huyết!`, 'heal');
        } else if (item.mpPercent) {
          p.curMp = Math.min(p.maxMp, p.curMp + Math.floor(p.maxMp * item.mpPercent));
          p.inventory[itemId]--;
          sound.playLoot();
          this.addLog(`Uống 【${item.name}】, hồi phục ${Math.floor(item.mpPercent * 100)}% Linh Lực!`, 'heal');
        } else if (item.expGain) {
          let gain = Math.floor(item.expGain * (p.comprehension / 100));
          p.exp += gain;
          p.inventory[itemId]--;
          sound.playLoot();
          this.addLog(`Uống 【${item.name}】, đan khí hóa tu vi tăng +${gain} Tu Vi!`, 'golden');
        } else if (item.lifespanGain) {
          p.bonusLifespan = (p.bonusLifespan || 0) + item.lifespanGain;
          p.inventory[itemId]--;
          this.recalculatePlayerStats();
          sound.playBreakthrough();
          this.addLog(`Nuốt vào 【${item.name}】! Kéo dài thọ nguyên thêm +${item.lifespanGain} năm!`, 'golden');
        } else if (item.isBreakthrough) {
          this.addLog(`【${item.name}】 là đan dược dùng khi bấm nút [Đột Phá] cảnh giới! Hãy giữ lại trong túi!`, 'warning');
        }
      } else if (item.type === 'weapon') {
        p.equippedWeapon = item;
        this.recalculatePlayerStats();
        sound.playClick();
        this.addLog(`Đã trang bị vũ khí: 【${item.name}】!`, 'system');
      } else if (item.type === 'armor') {
        p.equippedArmor = item;
        this.recalculatePlayerStats();
        sound.playClick();
        this.addLog(`Đã trang bị hộ giáp: 【${item.name}】!`, 'system');
      }

      this.updateUI();
    }

    handleDeathByAge() {
      sound.playHurt();
      alert(`Đại Hạn Đã Tới! Đạo hữu 【${this.player.name}】 thọ nguyên cạn kiệt, tọa hóa tán tiêu vào thiên địa... Hãy luân hồi chuyển thế!`);
      this.resetCharacter();
    }

    resetCharacter() {
      localStorage.removeItem('tutien_savegame');
      location.reload();
    }

    saveToLocalStorage() {
      if (!this.player) return;
      try {
        localStorage.setItem('tutien_savegame', JSON.stringify(this.player));
      } catch (e) {
        console.error('Lưu game thất bại:', e);
      }
    }

    loadFromLocalStorage() {
      try {
        const dataStr = localStorage.getItem('tutien_savegame');
        if (dataStr) {
          this.player = JSON.parse(dataStr);
          this.recalculatePlayerStats();
          this.refreshMarket();
          this.startLoops();
          this.addLog(`Đã tự động tải dữ liệu đạo hữu 【${this.player.name}】 thành công!`, 'system');
          return true;
        }
      } catch (e) {
        console.error('Tải game thất bại:', e);
      }
      return false;
    }

    exportSaveJSON() {
      if (!this.player) return null;
      return JSON.stringify(this.player, null, 2);
    }

    importSaveJSON(jsonStr) {
      try {
        const parsed = JSON.parse(jsonStr);
        if (parsed && parsed.name && parsed.realmIndex !== undefined) {
          this.player = parsed;
          this.recalculatePlayerStats();
          this.saveToLocalStorage();
          this.updateUI();
          this.addLog(`Nhập dữ liệu nhân vật 【${this.player.name}】 thành công!`, 'golden');
          return true;
        }
      } catch (e) {
        alert('Chuỗi JSON không hợp lệ!');
      }
      return false;
    }

    getPillIdByName(name) {
      for (const [id, item] of Object.entries(ITEMS)) {
        if (item.name === name) return id;
      }
      return 'pill_trucco';
    }

    updateUI() {
      if (!this.player) return;
      const p = this.player;
      const base = REALMS[p.realmIndex];

      const nameEl = document.getElementById('player-name');
      const pathEl = document.getElementById('player-path');
      const realmEl = document.getElementById('player-realm');
      const ageEl = document.getElementById('player-age');

      const hpTextEl = document.getElementById('player-hp-text');
      const hpBarEl = document.getElementById('player-hp-bar');
      const mpTextEl = document.getElementById('player-mp-text');
      const mpBarEl = document.getElementById('player-mp-bar');
      const expTextEl = document.getElementById('player-exp-text');
      const expBarEl = document.getElementById('player-exp-bar');

      const atkEl = document.getElementById('player-stat-atk');
      const defEl = document.getElementById('player-stat-def');
      const spdEl = document.getElementById('player-stat-spd');
      const critEl = document.getElementById('player-stat-crit');
      const rootEl = document.getElementById('player-stat-root');
      const phyEl = document.getElementById('player-stat-phy');
      const compEl = document.getElementById('player-stat-comp');
      const stonesEl = document.getElementById('player-stones');
      const btnBreakthrough = document.getElementById('btn-breakthrough');

      if (nameEl) nameEl.textContent = p.name;
      if (pathEl) pathEl.textContent = p.cultivationPath ? p.cultivationPath.name : 'Tán Tu';
      if (realmEl) realmEl.textContent = base.name;
      if (ageEl) ageEl.textContent = `${p.age} / ${p.maxLifespan} tuổi (Tháng ${p.month})`;

      if (hpTextEl) hpTextEl.textContent = `${p.curHp} / ${p.maxHp}`;
      if (hpBarEl) hpBarEl.style.width = `${Math.max(0, Math.min(100, (p.curHp / p.maxHp) * 100))}%`;

      if (mpTextEl) mpTextEl.textContent = `${p.curMp} / ${p.maxMp}`;
      if (mpBarEl) mpBarEl.style.width = `${Math.max(0, Math.min(100, (p.curMp / p.maxMp) * 100))}%`;

      if (expTextEl) expTextEl.textContent = `${p.exp} / ${base.maxExp} (${Math.floor((p.exp / base.maxExp) * 100)}%)`;
      if (expBarEl) expBarEl.style.width = `${Math.max(0, Math.min(100, (p.exp / base.maxExp) * 100))}%`;

      if (atkEl) atkEl.textContent = p.totalAtk;
      if (defEl) defEl.textContent = p.totalDef;
      if (spdEl) spdEl.textContent = p.totalSpd;
      if (critEl) critEl.textContent = `${Math.floor(p.totalCrit * 100)}%`;
      if (rootEl) rootEl.textContent = p.spiritualRoot ? p.spiritualRoot.name : 'Chưa rõ';
      if (phyEl) phyEl.textContent = p.physique ? p.physique.name : 'Phàm Thể';
      if (compEl) compEl.textContent = `${p.comprehension}% (x${(p.comprehension / 100).toFixed(2)})`;
      if (stonesEl) stonesEl.textContent = p.spiritStones || 0;

      if (btnBreakthrough) {
        if (p.exp >= base.maxExp) {
          btnBreakthrough.disabled = false;
          btnBreakthrough.classList.add('glow-breakthrough');
          btnBreakthrough.textContent = base.isMajorBreakthrough ? '⚡ ĐỘ KIẾP ĐỘT PHÁ' : '✨ ĐỘT PHÁ CẢNH GIỚI';
        } else {
          btnBreakthrough.disabled = true;
          btnBreakthrough.classList.remove('glow-breakthrough');
          btnBreakthrough.textContent = 'Tu Vi Chưa Đủ';
        }
      }

      this.renderInventoryUI();
      this.renderSectUI();
      this.renderCheatUI();
      this.renderForgeUI();
    }

    renderInventoryUI() {
      const listEl = document.getElementById('inventory-list');
      if (!listEl || !this.player) return;
      listEl.innerHTML = '';

      const p = this.player;
      const invKeys = Object.keys(p.inventory).filter(k => p.inventory[k] > 0);

      if (invKeys.length === 0) {
        listEl.innerHTML = '<div class="empty-hint" style="color: var(--text-dim);">Túi đồ rỗng tuếch, chưa có vật phẩm nào!</div>';
        return;
      }

      invKeys.forEach(k => {
        const item = ITEMS[k];
        if (!item) return;

        const itemCard = document.createElement('div');
        itemCard.className = 'inventory-card pixel-box';
        itemCard.innerHTML = `
          <div class="item-name">${item.name} <span class="item-count">x${p.inventory[k]}</span></div>
          <div class="item-desc">${item.desc}</div>
          <div class="item-actions">
            <button class="pixel-btn small-btn btn-use">${item.type === 'pill' ? 'Dùng' : (item.type === 'weapon' || item.type === 'armor' ? 'Trang bị' : 'Bán')}</button>
          </div>
        `;

        itemCard.querySelector('.btn-use').onclick = () => {
          if (item.type === 'pill' || item.type === 'weapon' || item.type === 'armor') {
            this.useInventoryItem(k);
          } else {
            this.sellItem(k);
          }
        };

        listEl.appendChild(itemCard);
      });

      const wpnEl = document.getElementById('equip-weapon');
      const armEl = document.getElementById('equip-armor');
      const artEl = document.getElementById('equip-artifact');

      if (wpnEl) wpnEl.textContent = p.equippedWeapon ? `${p.equippedWeapon.name} (+${p.equippedWeapon.atk} Công)` : 'Chưa có';
      if (armEl) armEl.textContent = p.equippedArmor ? `${p.equippedArmor.name} (+${p.equippedArmor.def} Thủ, +${p.equippedArmor.hp} HP)` : 'Chưa có';
      if (artEl) artEl.textContent = p.equippedArtifact ? `${p.equippedArtifact.name}` : 'Chưa có';
    }

    renderSectUI() {
      const p = this.player;
      const sectNoJoinEl = document.getElementById('sect-no-join');
      const sectJoinedEl = document.getElementById('sect-joined');

      if (!sectNoJoinEl || !sectJoinedEl || !p) return;

      if (!p.sectId) {
        sectNoJoinEl.classList.remove('hidden');
        sectJoinedEl.classList.add('hidden');
        return;
      }

      sectNoJoinEl.classList.add('hidden');
      sectJoinedEl.classList.remove('hidden');

      const sect = SECTS.find(s => s.id === p.sectId);
      const curRank = this.getCurrentSectRank();

      const nameEl = document.getElementById('sect-name-display');
      const rankEl = document.getElementById('sect-rank-display');
      const contribEl = document.getElementById('sect-contrib-display');

      if (nameEl) nameEl.textContent = sect.name;
      if (rankEl) rankEl.textContent = curRank.rank;
      if (contribEl) contribEl.textContent = p.sectContrib;

      const questListEl = document.getElementById('sect-quest-list');
      if (questListEl) {
        questListEl.innerHTML = '';
        SECT_QUESTS.forEach(q => {
          const row = document.createElement('div');
          row.className = 'quest-row pixel-box';
          row.innerHTML = `
            <div><strong>${q.name}</strong>: ${q.desc}</div>
            <button class="pixel-btn small-btn">Nộp (${q.contrib} Cống hiến)</button>
          `;
          row.querySelector('button').onclick = () => this.completeSectQuest(q.id);
          questListEl.appendChild(row);
        });
      }

      const manualListEl = document.getElementById('sect-manual-list');
      if (manualListEl) {
        manualListEl.innerHTML = '';
        sect.manuals.forEach(m => {
          const row = document.createElement('div');
          row.className = 'quest-row pixel-box';
          row.innerHTML = `
            <div><strong>${m.name}</strong> - ${m.desc} (Giá: ${m.cost} Cống hiến)</div>
            <button class="pixel-btn small-btn">Đổi</button>
          `;
          row.querySelector('button').onclick = () => this.buySectManual(m.id);
          manualListEl.appendChild(row);
        });
      }
    }

    renderCheatUI() {
      const p = this.player;
      if (!p) return;
      const nameEl = document.getElementById('cheat-title');
      const coreEl = document.getElementById('cheat-core-name');
      const perkEl = document.getElementById('cheat-perk-name');
      const actionContainer = document.getElementById('cheat-action-container');

      if (!nameEl) return;
      nameEl.textContent = p.cheatSystemName;
      coreEl.textContent = p.cheatCore ? `${p.cheatCore.name}: ${p.cheatCore.desc}` : '';
      perkEl.textContent = p.cheatPerk ? `${p.cheatPerk.name}: ${p.cheatPerk.desc}` : '';

      if (actionContainer) {
        actionContainer.innerHTML = '';
        if (p.cheatCore && p.cheatCore.id === 'signin') {
          const btn = document.createElement('button');
          btn.className = 'pixel-btn primary-btn';
          btn.textContent = p.lastSignInYear === p.age ? 'Đã Đánh Dấu Năm Nay' : 'Đánh Dấu Nhận Thưởng';
          btn.disabled = p.lastSignInYear === p.age;
          btn.onclick = () => this.triggerSignIn();
          actionContainer.appendChild(btn);
        } else if (p.cheatCore && p.cheatCore.id === 'gacha') {
          const btn = document.createElement('button');
          btn.className = 'pixel-btn primary-btn';
          btn.textContent = `Quay Vạn Giới (50 Điểm) [Hiện có: ${p.cheatPoints || 0}]`;
          btn.onclick = () => this.triggerGachaSpin();
          actionContainer.appendChild(btn);
        } else if (p.cheatCore && p.cheatCore.id === 'proficiency') {
          const btn = document.createElement('button');
          btn.className = 'pixel-btn primary-btn';
          btn.textContent = `Đốn Ngộ Nâng Cấp Kỹ Năng (Cấp ${p.skillMastery || 1} -> ${(p.skillMastery || 1) + 1})`;
          btn.onclick = () => this.upgradeSkillMastery();
          actionContainer.appendChild(btn);
        } else if (p.cheatCore && p.cheatCore.id === 'devour') {
          const info = document.createElement('div');
          info.className = 'devour-info';
          info.innerHTML = `Đã cắn nuốt tăng thêm: <strong>+${p.bonusHp || 0} HP</strong>, <strong>+${p.bonusAtk || 0} Công Kích</strong> vĩnh viễn!`;
          actionContainer.appendChild(info);
        }
      }
    }

    renderForgeUI() {
      const container = document.getElementById('recipe-list');
      if (!container) return;
      container.innerHTML = '';

      RECIPES.forEach(r => {
        const card = document.createElement('div');
        card.className = 'recipe-card pixel-box';
        card.innerHTML = `
          <div class="recipe-name">${r.name} (${r.type === 'alchemy' ? 'Đan Dược' : 'Trang Bị'})</div>
          <div class="recipe-desc">${r.desc} - Tỷ lệ thành công: ${Math.floor(r.successRate * 100)}%</div>
          <button class="pixel-btn small-btn">Khai Lò Luyện Chế</button>
        `;
        card.querySelector('button').onclick = () => this.craftRecipe(r.id);
        container.appendChild(card);
      });
    }

    renderMarketUI() {
      const container = document.getElementById('market-item-list');
      if (!container) return;
      container.innerHTML = '';

      this.marketItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'market-card pixel-box';
        card.innerHTML = `
          <div class="item-name">${item.name}</div>
          <div class="item-desc">${item.desc}</div>
          <div class="item-price" style="color: var(--text-gold);">💰 Giá: ${item.price} Linh Thạch</div>
          <button class="pixel-btn small-btn">Mua</button>
        `;
        card.querySelector('button').onclick = () => this.buyItem(item.id);
        container.appendChild(card);
      });
    }
  }

  // ==========================================================================
  // 7. APP CONTROLLER & LOGGING
  // ==========================================================================
  function addLog(text, type = 'normal') {
    const container = document.getElementById('log-messages');
    if (!container) return;
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = text;
    container.appendChild(entry);
    container.scrollTop = container.scrollHeight;
  }

  function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tab') === tabId);
    });
    document.querySelectorAll('.tab-pane').forEach(p => {
      p.classList.toggle('active', p.id === tabId);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const mainCanvas = document.getElementById('main-canvas');
    const renderer = new PixelRenderer(mainCanvas);
    const systems = new GameSystems(renderer, addLog);

    const combatEngine = new CombatEngine(renderer, addLog, () => {
      systems.updateUI();
      switchTab('tab-world');
    });
    systems.setCombatEngine(combatEngine);

    const avatarCanvas = document.getElementById('avatar-canvas');
    if (avatarCanvas) {
      const actx = avatarCanvas.getContext('2d');
      actx.imageSmoothingEnabled = false;
      actx.fillStyle = '#0f172a';
      actx.fillRect(0, 0, 48, 48);
      drawPixelSprite(actx, SPRITES.playerMeditate, 0, 0, 3);
    }

    const hasSave = systems.loadFromLocalStorage();
    if (hasSave) {
      document.getElementById('creation-modal').classList.add('hidden');
      systems.updateUI();
    } else {
      initCreationModal(systems);
    }

    setupUIEvents(systems, combatEngine, renderer);
  });

  function setupUIEvents(systems, combatEngine, renderer) {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playClick();
        const tabId = btn.getAttribute('data-tab');
        switchTab(tabId);

        if (tabId === 'tab-alchemy') {
          renderer.setScene(SCENES.ALCHEMY);
        } else if (tabId === 'tab-combat' && combatEngine.inCombat) {
          renderer.setScene(SCENES.COMBAT);
        } else {
          renderer.setScene(SCENES.MEDITATE);
        }
      });
    });

    const btnGatherQi = document.getElementById('btn-gather-qi');
    if (btnGatherQi) btnGatherQi.addEventListener('click', () => systems.activeGatherQi());

    const btnUseExpPill = document.getElementById('btn-use-exp-pill');
    if (btnUseExpPill) btnUseExpPill.addEventListener('click', () => systems.useInventoryItem('pill_tukhi'));

    const btnBreakthrough = document.getElementById('btn-breakthrough');
    if (btnBreakthrough) btnBreakthrough.addEventListener('click', () => systems.breakthrough());

    const selectRegion = document.getElementById('select-region');
    const regionInfo = document.getElementById('region-info');
    if (selectRegion && regionInfo) {
      WORLD_REGIONS.forEach((reg, index) => {
        const opt = document.createElement('option');
        opt.value = index;
        opt.textContent = `${reg.name} (${reg.dangerLevel})`;
        selectRegion.appendChild(opt);
      });

      const updateRegionDisplay = () => {
        const reg = WORLD_REGIONS[selectRegion.value];
        systems.currentRegion = reg;
        const reqRealm = REALMS[reg.reqRealmIndex];
        regionInfo.innerHTML = `
          <div><strong>Địa Điểm:</strong> ${reg.name}</div>
          <div><strong>Độ Nguy Hiểm:</strong> ${reg.dangerLevel}</div>
          <div><strong>Yêu Cầu Cảnh Giới:</strong> ${reqRealm.name}+</div>
          <div style="font-size: 11px; color: var(--text-dim); margin-top: 4px;">${reg.desc}</div>
        `;
      };
      selectRegion.addEventListener('change', updateRegionDisplay);
      updateRegionDisplay();
    }

    const btnExplore = document.getElementById('btn-explore');
    if (btnExplore) {
      btnExplore.addEventListener('click', () => {
        systems.exploreWorld();
        if (combatEngine.inCombat) switchTab('tab-combat');
      });
    }

    const btnAttack = document.getElementById('btn-combat-attack');
    const btnSkill = document.getElementById('btn-combat-skill');
    const btnArtifact = document.getElementById('btn-combat-artifact');
    const btnPill = document.getElementById('btn-combat-pill');
    const btnFlee = document.getElementById('btn-combat-flee');

    if (btnAttack) btnAttack.addEventListener('click', () => combatEngine.playerNormalAttack());
    if (btnSkill) btnSkill.addEventListener('click', () => combatEngine.playerCastSkill());
    if (btnArtifact) btnArtifact.addEventListener('click', () => combatEngine.playerUseArtifact());
    if (btnPill) btnPill.addEventListener('click', () => combatEngine.playerUsePill('pill_hoixuan'));
    if (btnFlee) btnFlee.addEventListener('click', () => combatEngine.playerFlee());

    const btnSound = document.getElementById('btn-sound-toggle');
    if (btnSound) {
      btnSound.addEventListener('click', () => {
        const isEnabled = sound.toggleSound();
        btnSound.textContent = isEnabled ? '🔊 Âm Thanh: BẬT' : '🔇 Âm Thanh: TẮT';
      });
    }

    const btnSave = document.getElementById('btn-save');
    if (btnSave) {
      btnSave.addEventListener('click', () => {
        systems.saveToLocalStorage();
        sound.playLoot();
        addLog('💾 Đã lưu dữ liệu tu tiên vào thần thức (localStorage)!', 'system');
      });
    }

    const btnExport = document.getElementById('btn-export-json');
    const jsonModal = document.getElementById('json-modal');
    const jsonText = document.getElementById('json-textarea');
    const btnJsonAction = document.getElementById('btn-json-action');
    const btnJsonClose = document.getElementById('btn-json-close');

    if (btnExport && jsonModal && jsonText) {
      btnExport.addEventListener('click', () => {
        const jsonStr = systems.exportSaveJSON();
        jsonText.value = jsonStr || '';
        btnJsonAction.textContent = 'Sao Chép JSON';
        btnJsonAction.onclick = () => {
          navigator.clipboard.writeText(jsonText.value);
          alert('Đã sao chép chuỗi JSON vào bộ nhớ đệm!');
        };
        jsonModal.classList.remove('hidden');
      });
    }

    const btnImport = document.getElementById('btn-import-json');
    if (btnImport && jsonModal && jsonText) {
      btnImport.addEventListener('click', () => {
        jsonText.value = '';
        btnJsonAction.textContent = 'Khôi Phục Dữ Liệu';
        btnJsonAction.onclick = () => {
          if (systems.importSaveJSON(jsonText.value)) {
            jsonModal.classList.add('hidden');
          }
        };
        jsonModal.classList.remove('hidden');
      });
    }

    if (btnJsonClose && jsonModal) {
      btnJsonClose.addEventListener('click', () => jsonModal.classList.add('hidden'));
    }

    const btnReset = document.getElementById('btn-reset-char');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm('Đạo hữu có chắc chắn muốn tán công luân hồi, xóa bỏ toàn bộ tu vi để tái sinh không?')) {
          systems.resetCharacter();
        }
      });
    }

    const btnClearLog = document.getElementById('btn-clear-log');
    if (btnClearLog) {
      btnClearLog.addEventListener('click', () => {
        const logContainer = document.getElementById('log-messages');
        if (logContainer) logContainer.innerHTML = '';
      });
    }

    const btnRefreshMarket = document.getElementById('btn-refresh-market');
    if (btnRefreshMarket) {
      btnRefreshMarket.addEventListener('click', () => {
        if (!systems.player) return;
        if (systems.player.spiritStones < 20) {
          addLog('Linh Thạch không đủ để làm mới Phường Thị (cần 20 Linh Thạch)!', 'warning');
          return;
        }
        systems.player.spiritStones -= 20;
        sound.playClick();
        systems.refreshMarket();
        addLog('Đã tiêu tốn 20 Linh Thạch làm mới hàng hóa Phường Thị!', 'system');
        systems.updateUI();
      });
    }

    const btnSectSalary = document.getElementById('btn-sect-salary');
    if (btnSectSalary) {
      btnSectSalary.addEventListener('click', () => systems.claimSectSalary());
    }

    const sectListContainer = document.getElementById('sect-options-list');
    if (sectListContainer) {
      sectListContainer.innerHTML = '';
      SECTS.forEach(sect => {
        const card = document.createElement('div');
        card.className = 'selectable-card';
        card.innerHTML = `
          <div class="card-title">${sect.name}</div>
          <div class="card-desc">${sect.type} - ${sect.desc}</div>
          <button class="pixel-btn small-btn primary-btn" style="margin-top: 6px;">Bái Nhập Tông Môn</button>
        `;
        card.querySelector('button').onclick = () => systems.joinSect(sect.id);
        sectListContainer.appendChild(card);
      });
    }
  }

  // ==========================================================================
  // 8. MODAL: THIÊN MỆNH LUÂN HỒI (3 BƯỚC KHỞI TẠO ĐỘC NHẤT)
  // ==========================================================================
  function initCreationModal(systems) {
    const modal = document.getElementById('creation-modal');
    modal.classList.remove('hidden');

    let rolledDestiny = null;
    let selectedPathId = 'kiem_tu';
    let selectedCoreId = 'signin';
    let selectedPerkId = 'breakthrough_guard';

    const btnRoll = document.getElementById('btn-roll-destiny');
    const resultBox = document.getElementById('destiny-result-box');
    const rollRootEl = document.getElementById('roll-root');
    const rollPhyEl = document.getElementById('roll-physique');
    const rollCompEl = document.getElementById('roll-comp');
    const btnStart = document.getElementById('btn-start-game');

    btnRoll.onclick = () => {
      sound.playCheatSystem();
      btnRoll.disabled = true;
      btnRoll.textContent = '🔒 Đã Định Thiên Mệnh';

      const rootRoll = Math.random();
      let root = SPIRITUAL_ROOTS[0];
      if (rootRoll < 0.20) root = SPIRITUAL_ROOTS[0];
      else if (rootRoll < 0.45) root = SPIRITUAL_ROOTS[1];
      else if (rootRoll < 0.70) root = SPIRITUAL_ROOTS[2];
      else if (rootRoll < 0.85) root = SPIRITUAL_ROOTS[3 + Math.floor(Math.random() * 2)];
      else if (rootRoll < 0.95) root = SPIRITUAL_ROOTS[5 + Math.floor(Math.random() * 5)];
      else root = SPIRITUAL_ROOTS[10 + Math.floor(Math.random() * 5)];

      const phyRoll = Math.random();
      let phy = PHYSIQUES[0];
      let cumulative = 0;
      for (const p of PHYSIQUES) {
        cumulative += p.chance;
        if (phyRoll <= cumulative) {
          phy = p;
          break;
        }
      }

      const comp = Math.floor(50 + Math.random() * 71);
      rolledDestiny = { root, physique: phy, comprehension: comp };

      resultBox.classList.remove('hidden');
      rollRootEl.textContent = `${root.name} (${root.desc})`;
      rollPhyEl.textContent = `${phy.name} [${phy.tier}] (${phy.desc})`;
      rollCompEl.textContent = `${comp}% ${comp >= 100 ? '⭐ [Thiên tài ngàn năm]' : (comp < 70 ? '⚠️ [Tư chất ngu độn]' : '⚡ [Bình thường]')}`;

      checkReady();
    };

    const pathsContainer = document.getElementById('paths-container');
    pathsContainer.innerHTML = '';
    Object.values(CULTIVATION_PATHS).forEach(path => {
      const card = document.createElement('div');
      card.className = `selectable-card ${path.id === selectedPathId ? 'selected' : ''}`;
      card.innerHTML = `
        <div class="card-title">${path.name}</div>
        <div class="card-desc">${path.title}</div>
        <div class="card-desc" style="color: var(--text-cyan); font-size: 10px;">${path.desc}</div>
        <div style="font-size: 10px; color: var(--text-gold); margin-top: 4px;">Tặng: ${path.startSkill.name} + ${path.startArtifact.name}</div>
      `;
      card.onclick = () => {
        sound.playClick();
        selectedPathId = path.id;
        pathsContainer.querySelectorAll('.selectable-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        checkReady();
      };
      pathsContainer.appendChild(card);
    });

    const coresContainer = document.getElementById('cheat-cores-container');
    coresContainer.innerHTML = '';
    Object.values(CHEAT_CORES).forEach(core => {
      const card = document.createElement('div');
      card.className = `selectable-card ${core.id === selectedCoreId ? 'selected' : ''}`;
      card.innerHTML = `
        <div class="card-title">${core.name}</div>
        <div class="card-desc">${core.desc}</div>
      `;
      card.onclick = () => {
        sound.playClick();
        selectedCoreId = core.id;
        coresContainer.querySelectorAll('.selectable-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        checkReady();
      };
      coresContainer.appendChild(card);
    });

    const perksContainer = document.getElementById('cheat-perks-container');
    perksContainer.innerHTML = '';
    Object.values(CHEAT_PERKS).forEach(perk => {
      const card = document.createElement('div');
      card.className = `selectable-card ${perk.id === selectedPerkId ? 'selected' : ''}`;
      card.innerHTML = `
        <div class="card-title">${perk.name}</div>
        <div class="card-desc">${perk.desc}</div>
      `;
      card.onclick = () => {
        sound.playClick();
        selectedPerkId = perk.id;
        perksContainer.querySelectorAll('.selectable-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        checkReady();
      };
      perksContainer.appendChild(card);
    });

    function checkReady() {
      if (rolledDestiny && selectedPathId && selectedCoreId && selectedPerkId) {
        btnStart.disabled = false;
      }
    }

    btnStart.onclick = () => {
      sound.playBreakthrough();
      const daoHieuInput = document.getElementById('input-dao-hieu').value.trim() || 'Hàn Lập';
      const cheatNameInput = document.getElementById('input-cheat-name').value.trim() || 'Hệ Thống Vô Địch';

      systems.initNewCharacter(
        daoHieuInput,
        rolledDestiny.root,
        rolledDestiny.physique,
        rolledDestiny.comprehension,
        selectedPathId,
        cheatNameInput,
        selectedCoreId,
        selectedPerkId
      );

      modal.classList.add('hidden');
      systems.saveToLocalStorage();
      systems.updateUI();
    };
  }

})();
