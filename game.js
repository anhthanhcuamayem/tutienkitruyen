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

    // Phi kiếm lơ lửng cho Kiếm Tu (8x16)
    flyingSword: {
      w: 8, h: 16,
      palette: {
        '.': null,
        'W': '#ffffff', 'C': '#38bdf8', 'B': '#0284c7', 'G': '#fbbf24', 'H': '#92400e'
      },
      data: [
        "...WW...",
        "...CC...",
        "...CC...",
        "..WCCW..",
        "..WCCW..",
        "..WCCW..",
        "..BCCB..",
        "..BCCB..",
        "...CC...",
        "...GG...",
        "..GGGG..",
        "...HH...",
        "...HH...",
        "...GG...",
        "....G...",
        "........"
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

  // ==========================================================================
  // 1.1 PROCEDURAL PIXEL SPRITES CHO TOÀN BỘ 73 VẬT PHẨM (CUSTOM HAND-DRAWN)
  // ==========================================================================
  const ITEM_PIXEL_SPRITES = {
  // --- 1. DƯỢC THẢO (10) ---
  herb_linhchi: {
    w: 12, h: 12,
    palette: { '.': null, 'R': '#ef4444', 'D': '#991b1b', 'W': '#ffffff', 'S': '#fef08a', 'B': '#ca8a04' },
    data: [
      "...RRRRR....",
      "..RRWWRRRD..",
      ".RRRRRRWWRD.",
      "RRWWRRRRRRDD",
      "RRRRRRWWRRDD",
      ".DDDDDDDDDD.",
      "....SSSS....",
      "....SSSS....",
      "....SSSS....",
      "...BBSSBB...",
      "..BBBBBBBB..",
      "............"
    ]
  },
  herb_thanh_u: {
    w: 12, h: 12,
    palette: { '.': null, 'G': '#22c55e', 'D': '#15803d', 'L': '#86efac', 'C': '#38bdf8', 'W': '#ffffff' },
    data: [
      "....LLG.....",
      "...LGGGD....",
      "...GGGGGD...",
      "....DGD.....",
      ".LLG.D.GLL..",
      "LGGD.D.DGGL.",
      "LGG.CWC.GGL.",
      ".D.CWWC.DG..",
      "...DCCD.D...",
      "....DDD.....",
      "....DDD.....",
      ".....D......"
    ]
  },
  herb_u_hon: {
    w: 12, h: 12,
    palette: { '.': null, 'P': '#a855f7', 'D': '#581c87', 'C': '#38bdf8', 'W': '#e0e7ff' },
    data: [
      "....W.......",
      "...CWC......",
      "...CPC...W..",
      "..CPDP..CWC.",
      "..PDPD..CPC.",
      "...DP..CPDP.",
      "....P..PDPD.",
      "...DDP..DP..",
      "....DD..PD..",
      "....DDD.DD..",
      ".....DDDD...",
      "......DD...."
    ]
  },
  herb_hoaviem: {
    w: 12, h: 12,
    palette: { '.': null, 'R': '#ef4444', 'O': '#f97316', 'Y': '#facc15', 'W': '#fef08a', 'G': '#16a34a' },
    data: [
      "....RO......",
      "...RORYO....",
      "..RORYWYO...",
      "..ORWWYYO...",
      "..OYWYYOR...",
      "...OYYOR....",
      "....ROR.....",
      ".....G......",
      "...GGG......",
      "..G.GG.GG...",
      "....GG.G....",
      "....G......."
    ]
  },
  herb_bachnien: {
    w: 12, h: 12,
    palette: { '.': null, 'P': '#f472b6', 'L': '#fbcfe8', 'D': '#db2777', 'Y': '#facc15', 'G': '#16a34a' },
    data: [
      "....LLP.....",
      "...LPPPP....",
      "..LPPYYPDD..",
      "..PPYYYYPD..",
      ".LPPYYPPDD..",
      ".PPPPPDDDD..",
      "..DDDDDDD...",
      ".....G......",
      "...GGG......",
      "..GG.GG.G...",
      ".....GG.....",
      "......G....."
    ]
  },
  herb_huyen_bang: {
    w: 12, h: 12,
    palette: { '.': null, 'C': '#38bdf8', 'L': '#bae6fd', 'W': '#ffffff', 'D': '#0284c7' },
    data: [
      ".....W......",
      "....LWL.....",
      "...CLWLC....",
      "....LWL.....",
      ".W..DCD..W..",
      "LLLCDWDCLLL.",
      ".W..DCD..W..",
      "....LWL.....",
      "...CLWLC....",
      "....LWL.....",
      ".....W......",
      "............"
    ]
  },
  herb_longhuyet: {
    w: 12, h: 12,
    palette: { '.': null, 'R': '#dc2626', 'D': '#7f1d1d', 'L': '#f87171', 'B': '#991b1b', 'G': '#15803d' },
    data: [
      ".....L......",
      "....LRD.....",
      "...LLRRD....",
      "....LRD.....",
      "..L..B..D...",
      ".LLR.B.RRD..",
      "..LRDBDRD...",
      "...R.B.R....",
      ".....B......",
      "...GGBGG....",
      "....GBG.....",
      ".....G......"
    ]
  },
  herb_cuuchuyen: {
    w: 12, h: 12,
    palette: { '.': null, 'Y': '#fbbf24', 'P': '#c084fc', 'R': '#f87171', 'C': '#38bdf8', 'W': '#ffffff', 'G': '#16a34a' },
    data: [
      "....R.C.....",
      "...RWWYC....",
      "..RRWWYYC...",
      "..P.WW.P....",
      ".PPWWWWPP...",
      "..PWWWWP....",
      "...GYYGG....",
      "....GG......",
      "...GGGG.....",
      "..GG..GG....",
      "............",
      "............"
    ]
  },
  herb_thienkiem: {
    w: 12, h: 12,
    palette: { '.': null, 'S': '#cbd5e1', 'W': '#f8fafc', 'G': '#22c55e', 'D': '#15803d', 'Y': '#eab308' },
    data: [
      ".....W......",
      "....WSW.....",
      "....WSW.....",
      "...WSSSD....",
      "...WSSSD....",
      "...WSSSD....",
      "..G.SSD.D...",
      ".GG.SSD.GG..",
      "GG..YYY..GG.",
      "....DDD.....",
      "....DDD.....",
      ".....D......"
    ]
  },
  herb_ngo_dao: {
    w: 12, h: 12,
    palette: { '.': null, 'G': '#15803d', 'L': '#4ade80', 'Y': '#facc15', 'W': '#fef08a', 'D': '#14532d' },
    data: [
      "......L.....",
      ".....LLG....",
      "....LLYLG...",
      "...LLYLYLG..",
      "..LLYYLYYLG.",
      ".LLYWWYYLLGD",
      ".LLYYLYYLLGD",
      "..DDLYLLGGD.",
      "...DDYLGGD..",
      "....DDGGD...",
      ".....DD.....",
      "......D....."
    ]
  },

  // --- 2. KHOÁNG THẠCH (7) ---
  ore_huyenthiet: {
    w: 12, h: 12,
    palette: { '.': null, 'B': '#0f172a', 'D': '#334155', 'M': '#64748b', 'L': '#94a3b8', 'W': '#cbd5e1' },
    data: [
      "....LLM.....",
      "...LWWWMM...",
      "..LWWMMMMD..",
      ".LWMDMMMMMD.",
      ".WMMDDDDMBD.",
      "LMMDDBBDMBBD",
      "MMDDBBBBMBBD",
      "MDDBBBBBBBD.",
      ".DDBBBBBBBD.",
      "..DBBBBBBD..",
      "...DBBBD....",
      "............"
    ]
  },
  ore_dong_tinh: {
    w: 12, h: 12,
    palette: { '.': null, 'C': '#0d9488', 'L': '#2dd4bf', 'B': '#b45309', 'Y': '#d97706', 'D': '#78350f' },
    data: [
      "....YYB.....",
      "...YYYYBD...",
      "..YYLLYYBD..",
      ".YYLLCYYYBD.",
      ".YLCLLCYYBD.",
      "YYCLLCYYBBD.",
      "YCCLLYYYBBD.",
      ".BCCCCYYBDD.",
      "..BCCCCBDD..",
      "...BBCCBD...",
      "....BBD.....",
      "............"
    ]
  },
  ore_tutinh: {
    w: 12, h: 12,
    palette: { '.': null, 'W': '#f3e8ff', 'L': '#c084fc', 'P': '#9333ea', 'D': '#581c87', 'B': '#3b0764' },
    data: [
      "....W...W...",
      "...LPL.LPL..",
      "..LPPPLPPPD.",
      "..LPPDLPDD..",
      ".W.PPDLPPD..",
      "LPL.PPLPPDD.",
      "LPPPLPPPDDD.",
      ".LPPDLPPDDB.",
      "..PPDLPPDDB.",
      "...DDBBDDB..",
      "....DBBDB...",
      ".....BBB...."
    ]
  },
  ore_thienngoai: {
    w: 12, h: 12,
    palette: { '.': null, 'R': '#ef4444', 'O': '#f97316', 'Y': '#facc15', 'W': '#fef08a', 'D': '#334155', 'B': '#0f172a' },
    data: [
      "..R.........",
      "...RO.......",
      "....ROY.....",
      ".....OWWDD..",
      "...DDOYYWDD.",
      "..DDROYYWDDB",
      ".DDROOYYWDDB",
      ".DROOYYWDDBB",
      "..DROYYWDDB.",
      "...DDBBDBB..",
      "....DDDDD...",
      "............"
    ]
  },
  ore_huyettinh: {
    w: 12, h: 12,
    palette: { '.': null, 'L': '#f87171', 'R': '#dc2626', 'D': '#991b1b', 'B': '#450a0a', 'W': '#ffffff' },
    data: [
      "....WLR.....",
      "...WLLRRD...",
      "..WLLRRRDD..",
      ".WLLRRRRRDD.",
      "WLLRRRRRRDD.",
      "LLRRRRRRRDDD",
      ".LRRRRRRDDD.",
      ".LRRRRRRDDB.",
      "..RRRRRDDB..",
      "...RRRDDBB..",
      "....RDDDB...",
      ".....BBB...."
    ]
  },
  ore_thai_at: {
    w: 12, h: 12,
    palette: { '.': null, 'W': '#fef9c3', 'Y': '#facc15', 'O': '#d97706', 'D': '#92400e', 'B': '#451a03' },
    data: [
      "....WWY.....",
      "...WWYYYO...",
      "..WWYYYYYO..",
      ".WWYYYYYYOD.",
      "WWYYYYYYYODD",
      "WYYYYYYYODDB",
      ".YYYYYYODDB.",
      ".YYYYYODDBB.",
      "..YYYODDBB..",
      "...YODDBB...",
      "....ODDB....",
      ".....BB....."
    ]
  },
  ore_hondon: {
    w: 12, h: 12,
    palette: { '.': null, 'W': '#ffffff', 'P': '#c084fc', 'C': '#38bdf8', 'Y': '#fbbf24', 'D': '#475569', 'B': '#090d16' },
    data: [
      "....WPC.....",
      "...WWPCDD...",
      "..WPCPCYDD..",
      ".WPCPCPCYD.",
      "WCPCPCPCYDD.",
      "PCPCYCYCDDDB",
      ".CPCYCYDDBB.",
      ".PCYCYDDBBB.",
      "..YCYDDBBB..",
      "...YDDBBBB..",
      "....DDBBB...",
      ".....BBB...."
    ]
  },

  // --- 3. DỊ BẢO YÊU THÚ (13) ---
  core_yeu_dan_1: {
    w: 12, h: 12,
    palette: { '.': null, 'W': '#ffffff', 'L': '#86efac', 'G': '#22c55e', 'D': '#15803d', 'B': '#14532d' },
    data: [
      "....LGG.....",
      "...LWWGG....",
      "..LWWGGGGD..",
      ".LWWGGGGGGD.",
      ".LGGGGGGGGD.",
      "LGGGGGGGGGGD",
      "GGGGGGGGGGDD",
      ".GGGGGGGGDD.",
      ".DGGGGGGDD..",
      "..DGGGGDD...",
      "...DDDDD....",
      "............"
    ]
  },
  core_yeu_dan_2: {
    w: 12, h: 12,
    palette: { '.': null, 'W': '#ffffff', 'L': '#7dd3fc', 'C': '#0ea5e9', 'D': '#0369a1', 'B': '#0c4a6e' },
    data: [
      "....LCC.....",
      "...LWWCC....",
      "..LWWCCCCD..",
      ".LWWCCCCCCD.",
      ".LCCCCCCCCD.",
      "LCCCCCCCCCCD",
      "CCCCCCCCCCDD",
      ".CCCCCCCCDD.",
      ".DCCCCCCDD..",
      "..DCCCCDD...",
      "...DDDDD....",
      "............"
    ]
  },
  core_yeu_dan_3: {
    w: 12, h: 12,
    palette: { '.': null, 'W': '#ffffff', 'L': '#fef08a', 'Y': '#eab308', 'D': '#a16207', 'B': '#713f12' },
    data: [
      "....LYY.....",
      "...LWWYY....",
      "..LWWYYYYD..",
      ".LWWYYYYYYD.",
      ".LYYYYYYYYD.",
      "LYYYYYYYYYYD",
      "YYYYYYYYYYDD",
      ".YYYYYYYYDD.",
      ".DYYYYYYDD..",
      "..DYYYYDD...",
      "...DDDDD....",
      "............"
    ]
  },
  core_yeu_dan_4: {
    w: 12, h: 12,
    palette: { '.': null, 'W': '#ffffff', 'L': '#d8b4fe', 'P': '#9333ea', 'D': '#6b21a8', 'B': '#3b0764' },
    data: [
      "....LPP.....",
      "...LWWPP....",
      "..LWWPPPPD..",
      ".LWWPPPPCCD.",
      ".LPPPPCCCCD.",
      "LPPPPCCCCCCD",
      "PPPPCCCCCCDD",
      ".PPPPCCCCDD.",
      ".DPPCCCCDD..",
      "..DPCCCDD...",
      "...DDDDD....",
      "............"
    ]
  },
  core_yeu_dan_5: {
    w: 12, h: 12,
    palette: { '.': null, 'W': '#ffffff', 'Y': '#fbbf24', 'O': '#ea580c', 'C': '#38bdf8', 'D': '#78350f' },
    data: [
      ".....W......",
      "....CWC.....",
      "...CYWYC....",
      "..CYYWYYC...",
      ".CYYW.WYYC..",
      "WYYW...WYYW.",
      ".CYYW.WYYC..",
      "..CYYWYYC...",
      "...CYWYC....",
      "....CWC.....",
      ".....W......",
      "............"
    ]
  },
  mat_lang_nanh: {
    w: 12, h: 12,
    palette: { '.': null, 'W': '#ffffff', 'S': '#e2e8f0', 'D': '#64748b', 'B': '#1e293b', 'R': '#dc2626' },
    data: [
      "....BBBD....",
      "...BBDDD....",
      "...BBDD.....",
      "....WSD.....",
      "....WSD.....",
      "...WWSD.....",
      "...WWSD.....",
      "..WWWSD.....",
      "..WWSDR.....",
      "..WWSD......",
      "...WD.......",
      "....D......."
    ]
  },
  mat_tru_nha: {
    w: 12, h: 12,
    palette: { '.': null, 'W': '#ffffff', 'S': '#cbd5e1', 'D': '#64748b', 'B': '#78350f' },
    data: [
      "W..........W",
      "WS........SW",
      "WSD......DSW",
      ".WSD....DSW.",
      ".WWSD..DSWW.",
      "..WWSDDSWW..",
      "...WWSSWW...",
      "....WSSW....",
      "...BBDDBB...",
      "...BBDDBB...",
      "....BBBB....",
      "............"
    ]
  },
  mat_xa_noc: {
    w: 12, h: 12,
    palette: { '.': null, 'G': '#22c55e', 'L': '#86efac', 'C': '#0f766e', 'W': '#ffffff', 'B': '#92400e' },
    data: [
      "....BB......",
      "....BB......",
      "...CCCC.....",
      "..CW..CCD...",
      ".CW....CCD..",
      ".CG..L..GD..",
      ".CGG.L.GGD..",
      ".CLGGGGGGD..",
      ".CGGGGGGGD..",
      "..CGGGGGCD..",
      "...DDDDDD...",
      "............"
    ]
  },
  mat_ho_bi: {
    w: 12, h: 12,
    palette: { '.': null, 'O': '#ea580c', 'Y': '#fbbf24', 'B': '#18181b', 'W': '#fef08a' },
    data: [
      "..YYYYYY....",
      ".YOYBBOYY...",
      "YOYB..BOYY..",
      "YOYBB..BOYY.",
      "YOY.BB..BOY.",
      "YOY..BB.BOY.",
      "YOY.BB..BOY.",
      "YOYBB..BOYY.",
      "YOYB..BOYY..",
      ".YOYBBOYY...",
      "..YYYYYY....",
      "............"
    ]
  },
  mat_hung_dam: {
    w: 12, h: 12,
    palette: { '.': null, 'R': '#b91c1c', 'D': '#7f1d1d', 'L': '#f87171', 'W': '#ffffff', 'B': '#450a0a' },
    data: [
      ".....D......",
      "....DLD.....",
      "...DLLRD....",
      "..DLWLRRD...",
      ".DLWWLRRRD..",
      ".DLLLRRRRDD.",
      "DLLLRRRRRRDD",
      "DLLRRRRRRRDD",
      ".DLRRRRRRDD.",
      "..DRRRRRDD..",
      "...DDDDDD...",
      "............"
    ]
  },
  mat_dieu_vu: {
    w: 12, h: 12,
    palette: { '.': null, 'R': '#ef4444', 'O': '#f97316', 'Y': '#fbbf24', 'D': '#991b1b', 'B': '#1e293b' },
    data: [
      ".......R....",
      "......RRD...",
      ".....RRRD...",
      "....RRRDD...",
      "...ORRRDD...",
      "..OORRDDD...",
      "..YOORDDD...",
      ".YYOOBDD....",
      ".YYOBDDD....",
      "..YOBDD.....",
      "...BDD......",
      "....B......."
    ]
  },
  mat_giao_lan: {
    w: 12, h: 12,
    palette: { '.': null, 'G': '#10b981', 'L': '#6ee7b7', 'D': '#047857', 'Y': '#facc15', 'W': '#ecfdf5' },
    data: [
      "....YYYY....",
      "...YLLLLY...",
      "..YLWWLLLY..",
      ".YLWGGGGLLY.",
      ".YLGGD.GGGY.",
      "YLGGD...GGGY",
      "YLGGD...GGGY",
      ".YGGD...DGY.",
      ".YGGD..DDGY.",
      "..YGGDDDDY..",
      "...YDDDDY...",
      "....YYYY...."
    ]
  },
  mat_hu_moc: {
    w: 12, h: 12,
    palette: { '.': null, 'B': '#78350f', 'D': '#451a03', 'Y': '#d97706', 'L': '#fde68a' },
    data: [
      "....BBBB....",
      "..BBYYYYBB..",
      ".BBYLLLLYBB.",
      ".BYLBBLLLYB.",
      "BYLBBYYLLYBD",
      "BYLBYLLLYYBD",
      "BYLBYLLLYYBD",
      "BYLBBLLYYYBD",
      ".BYLLYYYYBD.",
      ".BBDYYYYBBD.",
      "..BBDDDDBBD.",
      "....DDDD...."
    ]
  },

  // --- 4. ĐAN DƯỢC (17) ---
  pill_hoixuan: {
    w: 12, h: 12,
    palette: { '.': null, 'W': '#ffffff', 'L': '#86efac', 'G': '#22c55e', 'D': '#15803d' },
    data: [
      "....GGGG....",
      "..GGLLLLGG..",
      ".GGLWWLLLLG.",
      ".GGLWWLLLLG.",
      "GGLLWWLLLLGG",
      "GGLLWWLLLLGG",
      "GGWWWWWWLLGG",
      "GGWWWWWWLLGG",
      ".GGLLWWLLLG.",
      ".GGLLWWLLLG.",
      "..GGDDDDGG..",
      "....GGGG...."
    ]
  },
  pill_tulinh: {
    w: 12, h: 12,
    palette: { '.': null, 'W': '#ffffff', 'L': '#7dd3fc', 'C': '#0284c7', 'D': '#0369a1' },
    data: [
      "....CCCC....",
      "..CCLLLLCC..",
      ".CCLLWLLLLC.",
      ".CCLLWLLLLC.",
      "CCLLWWLLLLCC",
      "CCLLWWLLLLCC",
      "CCLWWWWLLLCC",
      "CCLWWWWLLLCC",
      ".CCLLWWLLLC.",
      ".CCDDLLLLLC.",
      "..CCDDDDCC..",
      "....CCCC...."
    ]
  },
  pill_tukhi: {
    w: 12, h: 12,
    palette: { '.': null, 'R': '#ef4444', 'L': '#fca5a5', 'W': '#ffffff', 'S': '#cbd5e1', 'D': '#991b1b', 'B': '#64748b' },
    data: [
      ".....LLR....",
      "....LLLRR...",
      "...LLLRRRR..",
      "..LLLRRRRRR.",
      ".LLLRRRRRRD.",
      ".LLRRRRRDDD.",
      ".WWSSSSSBBB.",
      "WWSSSSSSBBB.",
      ".WWSSSSSBB..",
      "..WWSSSSB...",
      "...WWSSB....",
      "....WSB....."
    ]
  },
  pill_bao_khi: {
    w: 12, h: 12,
    palette: { '.': null, 'R': '#ef4444', 'O': '#f97316', 'Y': '#facc15', 'W': '#ffffff' },
    data: [
      "..R...O...R.",
      "...R.OOO.R..",
      "....OOOOO...",
      "..OOWWWOOO..",
      ".OOWWYYYWOO.",
      "OOWYYYYYYWOO",
      "OOWYYYYYYWOO",
      ".OOWWYYYWOO.",
      "..OOWWWOOO..",
      "....OOOOO...",
      "...R.OOO.R..",
      "..R...O...R."
    ]
  },
  pill_ngung_than: {
    w: 12, h: 12,
    palette: { '.': null, 'C': '#06b6d4', 'L': '#a5f3fc', 'W': '#ffffff', 'D': '#0891b2' },
    data: [
      "....CCCC....",
      "..CCLLLLCC..",
      ".CCLLWLLLLC.",
      ".CCLWWWLLLC.",
      "CCLW.W.WLLCC",
      "CCLLWWWLLLLC",
      "CCLLLWLLLLCC",
      "CCLWWWWLLLCC",
      ".CCLLLLLLLC.",
      ".CCDDDDDDLC.",
      "..CCDDDDCC..",
      "....CCCC...."
    ]
  },
  pill_quy_nguyen: {
    w: 12, h: 12,
    palette: { '.': null, 'R': '#ef4444', 'G': '#22c55e', 'B': '#3b82f6', 'Y': '#eab308', 'W': '#ffffff' },
    data: [
      "....RRRR....",
      "..RRRRRRBB..",
      ".RRRR..WWBB.",
      ".RR..WW..BB.",
      "YY..WWWW..BB",
      "YY..WWWW..BB",
      "YY..WW..GGGG",
      "YYWW..GGGGGG",
      ".YYWW..GGGG.",
      ".YYYYGGGGGG.",
      "..YYYYGGGG..",
      "....GGGG...."
    ]
  },
  pill_tay_tuy: {
    w: 12, h: 12,
    palette: { '.': null, 'W': '#ffffff', 'S': '#e2e8f0', 'C': '#38bdf8', 'D': '#94a3b8' },
    data: [
      "....SSSS....",
      "..SSWWWWSS..",
      ".SSW.CC.WSS.",
      ".SS.CCCC.SS.",
      "SSW..CC..WSS",
      "SSW.CCCC.WSS",
      "SSW.CCCC.WSS",
      "SSW..CC..WSS",
      ".SS.CCCC.SS.",
      ".SSW.CC.WSS.",
      "..SSDDDDSS..",
      "....SSSS...."
    ]
  },
  pill_trucco: {
    w: 12, h: 12,
    palette: { '.': null, 'Y': '#eab308', 'L': '#fef08a', 'D': '#a16207', 'W': '#ffffff' },
    data: [
      ".YYYYYYYYYY.",
      "YYYYYYYYYYYY",
      "YYLLLLLLLLYY",
      "YYLWWWWWWLYY",
      "YYLWDDDDWLYY",
      "YYLWDDDDWLYY",
      "YYLWDDDDWLYY",
      "YYLWDDDDWLYY",
      "YYLWWWWWWLYY",
      "YYLLLLLLLLYY",
      "YYYYYYYYYYYY",
      ".YYYYYYYYYY."
    ]
  },
  pill_kimdan: {
    w: 12, h: 12,
    palette: { '.': null, 'Y': '#facc15', 'L': '#fef08a', 'W': '#ffffff', 'O': '#ea580c', 'D': '#b45309' },
    data: [
      "..Y...Y...Y.",
      "...YYYYYYY..",
      "..YYLLLLLYY.",
      ".YLLWWWWLLLY",
      "YLLWWWWWWLLD",
      "YLLWWWWWWLLD",
      "YLLWWWWWWLLD",
      "YLLLLWWLLLLD",
      ".YLLLLLLLLD.",
      "..YYDDDDDD..",
      "...YYYYYYD..",
      "..Y...D...D."
    ]
  },
  pill_ngungan: {
    w: 12, h: 12,
    palette: { '.': null, 'Y': '#facc15', 'W': '#ffffff', 'O': '#f97316', 'D': '#9a3412', 'L': '#fef08a' },
    data: [
      "....YYYY....",
      "..YYYYYYYY..",
      ".YYLWWWWLYY.",
      ".YYLWWWWLYY.",
      "YYLLW..WLLYY",
      "YYLLWWWWLLYY",
      "YYYLLWWLLYYY",
      "YYLLWWWWLLYY",
      ".YYLLLLLLYY.",
      ".YYDDDDDDYY.",
      "..YYDDDDYY..",
      "....YYYY...."
    ]
  },
  pill_hoathan: {
    w: 12, h: 12,
    palette: { '.': null, 'P': '#6b21a8', 'L': '#c084fc', 'C': '#38bdf8', 'W': '#ffffff', 'D': '#3b0764' },
    data: [
      "....PPPP....",
      "..PPLLLLPP..",
      ".PPL.W.LLLPP",
      ".PPLWWWWLLPP",
      "PPL.CWWC.LPP",
      "PPLCWWWWCLPP",
      "PPL.CWWC.LPP",
      "PPLWWWWLLLPP",
      ".PPL.W.LLLPP",
      ".PPDDDDDDLPP",
      "..PPDDDDPP..",
      "....PPPP...."
    ]
  },
  pill_huthien: {
    w: 12, h: 12,
    palette: { '.': null, 'P': '#9333ea', 'L': '#c084fc', 'B': '#090d16', 'W': '#ffffff' },
    data: [
      "....PPPP....",
      "..PPLLLLPP..",
      ".PPLBBBBLLPP",
      ".PLBBBBBBLLP",
      "PPLBBBBBBLLP",
      "PPLBBWBBBLPP",
      "PPLBBBBBBLLP",
      "PPLBBBBBBLLP",
      ".PLBBBBBBLLP",
      ".PPLBBBBLLPP",
      "..PPLLLLPP..",
      "....PPPP...."
    ]
  },
  pill_hopnguyen: {
    w: 12, h: 12,
    palette: { '.': null, 'W': '#ffffff', 'B': '#0f172a', 'S': '#cbd5e1', 'D': '#334155' },
    data: [
      "....WWWW....",
      "..WWWWWWBB..",
      ".WWWWBBWWBB.",
      ".WWWBBBB.WBB",
      "WWWWBBBB..BB",
      "WWWWBBBB..BB",
      "WW..WWWWBBBB",
      "WW..WWWWBBBB",
      ".WW.WWWWBBB.",
      ".WWBBWWWWBB.",
      "..WWBBBBBB..",
      "....BBBB...."
    ]
  },
  pill_cankhon: {
    w: 12, h: 12,
    palette: { '.': null, 'O': '#ea580c', 'Y': '#facc15', 'W': '#ffffff', 'C': '#38bdf8', 'D': '#7c2d12' },
    data: [
      ".......YY...",
      "....OOOO.Y..",
      "..OOLLLLOO.Y",
      ".OOLWLLLLOO.",
      "YYYYYYYYYYYY",
      "OOLLWWLLLLOO",
      ".OOLWWLLLOO.",
      "Y.OOLLLLOO..",
      ".Y..OOOO....",
      "..YY........",
      "............",
      "............"
    ]
  },
  pill_dokiep: {
    w: 12, h: 12,
    palette: { '.': null, 'P': '#6b21a8', 'D': '#3b0764', 'Y': '#facc15', 'W': '#ffffff', 'L': '#d8b4fe' },
    data: [
      "....PPPP....",
      "..PPLLLLPP..",
      ".PPL..YYLLPP",
      ".PPL.YY.LLPP",
      "PPLLYYYYLLPP",
      "PPLL.YY.LLPP",
      "PPLL..YYLLPP",
      "PPLL.YY.LLPP",
      ".PPL.YY.LLPP",
      ".PPL..Y.LLPP",
      "..PPDDDDPP..",
      "....PPPP...."
    ]
  },
  pill_daotam: {
    w: 12, h: 12,
    palette: { '.': null, 'W': '#ffffff', 'L': '#e0f2fe', 'C': '#38bdf8', 'D': '#0284c7' },
    data: [
      "...W....W...",
      "..WWW..WWW..",
      ".WWLLWWLLWW.",
      ".WLLLLLLLLW.",
      ".WLLCLLCLLW.",
      ".WLLLLLLLLW.",
      "..WLLLLLLW..",
      "...WLLLLW...",
      "....WLLW....",
      ".....WW.....",
      "......W.....",
      "............"
    ]
  },
  pill_tho_nguyen: {
    w: 12, h: 12,
    palette: { '.': null, 'Y': '#eab308', 'W': '#ffffff', 'L': '#fef08a', 'D': '#a16207' },
    data: [
      ".YYYYYYYYYY.",
      "..YWWWWWWY..",
      "...YLLLLY...",
      "....YLLY....",
      ".....YY.....",
      "....YLLY....",
      "...YLLLLY...",
      "..YLWLLWWY..",
      "..YWWWWWWY..",
      ".YYYYYYYYYY.",
      "............",
      "............"
    ]
  },

  // --- 5. PHÙ LỤC (8) ---
  talisman_don_dia: {
    w: 12, h: 12,
    palette: { '.': null, 'Y': '#fef08a', 'R': '#dc2626', 'B': '#92400e', 'W': '#ffffff' },
    data: [
      "..YYYYYYYY..",
      ".YRRRRRRRRY.",
      ".YR......RY.",
      ".YR..BB..RY.",
      ".YR.B..B.RY.",
      ".YR..BB..RY.",
      ".YR...B..RY.",
      ".YR.BB...RY.",
      ".YR......RY.",
      ".YRRRRRRRRY.",
      "..YYYYYYYY..",
      "............"
    ]
  },
  talisman_kim_cuong: {
    w: 12, h: 12,
    palette: { '.': null, 'Y': '#fef08a', 'R': '#dc2626', 'G': '#eab308', 'W': '#ffffff' },
    data: [
      "..YYYYYYYY..",
      ".YRRRRRRRRY.",
      ".YR..GG..RY.",
      ".YR.GGGG.RY.",
      ".YRGW..GGRY.",
      ".YRGGGGGGCRY.",
      ".YR.GGGG.RY.",
      ".YR..GG..RY.",
      ".YR...G..RY.",
      ".YRRRRRRRRY.",
      "..YYYYYYYY..",
      "............"
    ]
  },
  talisman_dan_loi: {
    w: 12, h: 12,
    palette: { '.': null, 'Y': '#fef08a', 'R': '#dc2626', 'B': '#0284c7', 'W': '#ffffff' },
    data: [
      "..YYYYYYYY..",
      ".YRRRRRRRRY.",
      ".YR...B..RY.",
      ".YR..BB..RY.",
      ".YR.BB...RY.",
      ".YRBBBBB.RY.",
      ".YR...BB.RY.",
      ".YR..BB..RY.",
      ".YR..B...RY.",
      ".YRRRRRRRRY.",
      "..YYYYYYYY..",
      "............"
    ]
  },
  talisman_liet_hoa: {
    w: 12, h: 12,
    palette: { '.': null, 'Y': '#fef08a', 'R': '#dc2626', 'F': '#ea580c', 'W': '#facc15' },
    data: [
      "..YYYYYYYY..",
      ".YRRRRRRRRY.",
      ".YR..F...RY.",
      ".YR.FFF..RY.",
      ".YR.FWF..RY.",
      ".YRFFFFF.RY.",
      ".YRFFWFF.RY.",
      ".YR.FFF..RY.",
      ".YR..F...RY.",
      ".YRRRRRRRRY.",
      "..YYYYYYYY..",
      "............"
    ]
  },
  talisman_bang_phong: {
    w: 12, h: 12,
    palette: { '.': null, 'Y': '#bae6fd', 'R': '#0369a1', 'C': '#38bdf8', 'W': '#ffffff' },
    data: [
      "..YYYYYYYY..",
      ".YRRRRRRRRY.",
      ".YR..W...RY.",
      ".YR.CWC..RY.",
      ".YRC.W.C.RY.",
      ".YRWWWWW.RY.",
      ".YRC.W.C.RY.",
      ".YR.CWC..RY.",
      ".YR..W...RY.",
      ".YRRRRRRRRY.",
      "..YYYYYYYY..",
      "............"
    ]
  },
  talisman_than_hanh: {
    w: 12, h: 12,
    palette: { '.': null, 'Y': '#fef08a', 'R': '#dc2626', 'W': '#ffffff', 'G': '#16a34a' },
    data: [
      "..YYYYYYYY..",
      ".YRRRRRRRRY.",
      ".YR..W...RY.",
      ".YR.WW...RY.",
      ".YR.WWW..RY.",
      ".YR..WWW.RY.",
      ".YR...WW.RY.",
      ".YR.WWW..RY.",
      ".YR.W....RY.",
      ".YRRRRRRRRY.",
      "..YYYYYYYY..",
      "............"
    ]
  },
  talisman_an_than: {
    w: 12, h: 12,
    palette: { '.': null, 'Y': '#e2e8f0', 'R': '#475569', 'P': '#9333ea', 'B': '#0f172a' },
    data: [
      "..YYYYYYYY..",
      ".YRRRRRRRRY.",
      ".YR......RY.",
      ".YR..PP..RY.",
      ".YR.PPPP.RY.",
      ".YRPPBBPP.RY.",
      ".YR.PPPP.RY.",
      ".YR..PP..RY.",
      ".YR......RY.",
      ".YRRRRRRRRY.",
      "..YYYYYYYY..",
      "............"
    ]
  },
  talisman_thien_nhan: {
    w: 12, h: 12,
    palette: { '.': null, 'Y': '#fef08a', 'R': '#dc2626', 'G': '#eab308', 'C': '#38bdf8', 'B': '#0f172a' },
    data: [
      "..YYYYYYYY..",
      ".YRRRRRRRRY.",
      ".YR......RY.",
      ".YR.GGGG.RY.",
      ".YRG.CC.GRY.",
      ".YRGCBBCGRY.",
      ".YRG.CC.GRY.",
      ".YR.GGGG.RY.",
      ".YR......RY.",
      ".YRRRRRRRRY.",
      "..YYYYYYYY..",
      "............"
    ]
  },

  // --- 6. TRÀ, RƯƠNG & KỲ VẬT (7) ---
  tea_ngo_dao: {
    w: 12, h: 12,
    palette: { '.': null, 'C': '#0d9488', 'G': '#22c55e', 'L': '#86efac', 'W': '#f0fdf4', 'B': '#78350f' },
    data: [
      "....W..W....",
      ".....W..W...",
      "...CCCCCC...",
      "..CLLLLLLC..",
      ".CGGGGGGGGC.",
      ".CGGGGGGGGC.",
      ".CGGGGGGGGC.",
      "..CGGGGGGC..",
      "...CCCCCC...",
      "...BBBBBB...",
      "..BBBBBBBB..",
      "............"
    ]
  },
  chest_tu_tru_vat: {
    w: 12, h: 12,
    palette: { '.': null, 'B': '#78350f', 'D': '#451a03', 'Y': '#eab308', 'W': '#fef08a' },
    data: [
      "....YYYY....",
      "....YYYY....",
      "...YYYYYY...",
      "..BBDDDDBB..",
      ".BBYYYYYYBB.",
      ".BBYYYYYYBB.",
      "BBDDDDDDDDBB",
      "BBBBBBBBBBBB",
      "BBBBBBBBBBBB",
      ".BBBBBBBBBB.",
      "..DDDDDDDD..",
      "............"
    ]
  },
  chest_bi_canh: {
    w: 12, h: 12,
    palette: { '.': null, 'B': '#78350f', 'D': '#451a03', 'M': '#94a3b8', 'Y': '#eab308', 'K': '#0f172a' },
    data: [
      "...MMMMMM...",
      "..MBBBBBDM..",
      ".MBBBBBBBDM.",
      "MMMMMMMMMMMM",
      "MBBBBYYBBBDM",
      "MBBBBKYBBBDM",
      "MBBBBKYBBBDM",
      "MMMMMMMMMMMM",
      "MDDDDYYDDDDK",
      "MDDDDYYDDDDK",
      "MDDDDDDDDDDK",
      ".KKKKKKKKKK."
    ]
  },
  chest_thien_co: {
    w: 12, h: 12,
    palette: { '.': null, 'Y': '#facc15', 'W': '#ffffff', 'O': '#ea580c', 'R': '#ef4444', 'C': '#38bdf8' },
    data: [
      "...YYYYYY...",
      "..YYWWWWYY..",
      ".YYWWWWWWYY.",
      "YYYYYYYYYYYY",
      "YYRRYYYYRRYY",
      "YYRRYCYYRRYY",
      "YYRRYCYYRRYY",
      "YYYYYYYYYYYY",
      "YYOYYYYYYOYY",
      "YYOYYYYYYOYY",
      "YYOOOOOOOOYY",
      ".YYYYYYYYYY."
    ]
  },
  map_tang_bao: {
    w: 12, h: 12,
    palette: { '.': null, 'Y': '#fef08a', 'B': '#ca8a04', 'R': '#ef4444', 'D': '#854d0e' },
    data: [
      ".YYYYYYYY...",
      "YYYYYYYYYY..",
      "YY..B..B.YY.",
      "YY.R.R...YY.",
      "YY..R..B.YY.",
      "YY.R.R...YY.",
      "YY...B..BYY.",
      "YY.......YY.",
      "YY..B..B.YY.",
      "YYYYYYYYYYD.",
      ".YYYYYYYYD..",
      "..DDDDDDD..."
    ]
  },
  tome_cong_phap_tan_thien: {
    w: 12, h: 12,
    palette: { '.': null, 'Y': '#fef08a', 'D': '#ca8a04', 'R': '#dc2626', 'B': '#1e293b' },
    data: [
      "...YYDDYY...",
      "..YYYYYYYY..",
      ".YYYYYYYYYY.",
      ".YY..RR..YY.",
      ".YY.RRRR.YY.",
      ".YY..RR..YY.",
      ".YY.B..B.YY.",
      ".YY..BB..YY.",
      ".YYYYYYYYYY.",
      "..YYYYYYYY..",
      "...YYDDYY...",
      "............"
    ]
  },
  pet_linh_thu_noan: {
    w: 12, h: 12,
    palette: { '.': null, 'W': '#ffffff', 'L': '#fbcfe8', 'P': '#ec4899', 'Y': '#facc15', 'D': '#be185d' },
    data: [
      "....PPPP....",
      "...PLWWLP...",
      "..PLWWWWLL..",
      ".PLWW.YWWLL.",
      ".PLW.YY.WLL.",
      "PLW.YY..WLLD",
      "PLWW.YY.WLLD",
      "PLLW..YYWLLD",
      ".PLLWWWWLLD.",
      ".PLLLLLLLLD.",
      "..PDDDDDDD..",
      "....DDDD...."
    ]
  },

  // --- 7. BINH KHÍ (4) ---
  wpn_thanhphong: {
    w: 12, h: 12,
    palette: { '.': null, 'W': '#ffffff', 'S': '#cbd5e1', 'C': '#0284c7', 'L': '#38bdf8', 'B': '#0f172a' },
    data: [
      "..........W.",
      ".........WS.",
      "........WSS.",
      ".......WSS..",
      "......WSS...",
      ".....WSS....",
      "....WSS.....",
      "...WSS......",
      "..LCL.......",
      ".LBC........",
      "B.L.........",
      "............"
    ]
  },
  wpn_xichtieu: {
    w: 12, h: 12,
    palette: { '.': null, 'R': '#ef4444', 'O': '#f97316', 'Y': '#facc15', 'W': '#ffffff', 'D': '#7f1d1d' },
    data: [
      "..........W.",
      ".........WRO",
      "........WRO.",
      ".......WRO..",
      "......WRO...",
      ".....WRO....",
      "....WRO.....",
      "...WRO......",
      "..YYO.......",
      ".DYD........",
      "D.D.........",
      "............"
    ]
  },
  wpn_tramyeu: {
    w: 12, h: 12,
    palette: { '.': null, 'W': '#ffffff', 'S': '#94a3b8', 'D': '#475569', 'B': '#1e293b', 'R': '#dc2626' },
    data: [
      ".......WWSS.",
      "......WWSSSD",
      ".....WWSSSDD",
      "....WWSSSDDB",
      "...WWSSSDDB.",
      "..WWSSSDDB..",
      ".WWSSSDDB...",
      ".DRSSDB.....",
      "..BBD.......",
      "...BB.......",
      "....B.......",
      "............"
    ]
  },
  wpn_tienkiem: {
    w: 12, h: 12,
    palette: { '.': null, 'Y': '#facc15', 'W': '#ffffff', 'O': '#ea580c', 'C': '#38bdf8' },
    data: [
      "W...W...W...",
      "WY.WYW.YW...",
      "WY.WYW.YW...",
      ".WYWYWYW....",
      "..YYYYY.....",
      "...WYW......",
      "...WYW......",
      "...WYW......",
      "..CCYCC.....",
      "...OYO......",
      "...OYO......",
      "....O......."
    ]
  },

  // --- 8. HỘ GIÁP (4) ---
  arm_huyenthiet: {
    w: 12, h: 12,
    palette: { '.': null, 'D': '#1e293b', 'M': '#475569', 'L': '#94a3b8', 'W': '#cbd5e1' },
    data: [
      ".LL......LL.",
      "LMMLL..LLMML",
      "LMWMMDDMMWML",
      "DMMMMDDMMMMD",
      "DMMMMDDMMMMD",
      ".DMMMDDMMMD.",
      ".DMMMDDMMMD.",
      ".DMMMDDMMMD.",
      ".DMMMDDMMMD.",
      ".DDDDDDDDDD.",
      "..DD....DD..",
      "............"
    ]
  },
  arm_tinhvan: {
    w: 12, h: 12,
    palette: { '.': null, 'P': '#9333ea', 'L': '#d8b4fe', 'C': '#38bdf8', 'Y': '#facc15', 'W': '#ffffff' },
    data: [
      ".PP......PP.",
      "PPLLP..PLLPP",
      "PPL.P..P.LPP",
      "PP...YY...PP",
      "PP..YYYY..PP",
      ".PP.YYYY.PP.",
      ".PPL.C..LPP.",
      ".PPL.W..LPP.",
      ".PPL....LPP.",
      ".PPLLLLLLPP.",
      "..PP....PP..",
      "............"
    ]
  },
  arm_longlan: {
    w: 12, h: 12,
    palette: { '.': null, 'G': '#059669', 'L': '#34d399', 'Y': '#facc15', 'D': '#064e3b', 'W': '#ecfdf5' },
    data: [
      ".YY......YY.",
      "YYGYY..YYGYY",
      "YGLGGYYGGLGY",
      "DGGGGYYGGGGD",
      "DGLGLYYLGLGD",
      ".DGGYYYYGGD.",
      ".DGLGLGLGLD.",
      ".DGGGGGGGGD.",
      ".DGLGLGLGLD.",
      ".DDDDDDDDDD.",
      "..DD....DD..",
      "............"
    ]
  },
  arm_hondon: {
    w: 12, h: 12,
    palette: { '.': null, 'W': '#ffffff', 'C': '#7dd3fc', 'P': '#e879f9', 'Y': '#fde047' },
    data: [
      ".WW......WW.",
      "WWCCW..WCCWW",
      "WWP.W..W.PWW",
      "WW...YY...WW",
      "WW..YYYY..WW",
      ".WW.YYYY.WW.",
      ".WWP....PWW.",
      ".WW.C..C.WW.",
      ".WWC....CWW.",
      ".WWWWWWWWWW.",
      "..WW....WW..",
      "............"
    ]
  },

  // --- 9. PHÁP BẢO (3) ---
  art_guong: {
    w: 12, h: 12,
    palette: { '.': null, 'Y': '#d97706', 'O': '#92400e', 'W': '#ffffff', 'B': '#0f172a', 'S': '#cbd5e1' },
    data: [
      "...YYYYYY...",
      "..YYYYYYYY..",
      ".YY......YY.",
      "YY..WWWW..YY",
      "YY.WWBBWW.YY",
      "YY.WBBBBW.YY",
      "YY.WBBBBW.YY",
      "YY.WWBBWW.YY",
      "YY..WWWW..YY",
      ".YY......YY.",
      "..YYYYYYYY..",
      "...YYYYYY..."
    ]
  },
  art_chuoi: {
    w: 12, h: 12,
    palette: { '.': null, 'B': '#78350f', 'D': '#451a03', 'Y': '#d97706', 'R': '#dc2626' },
    data: [
      "...BB..BB...",
      "..BB....BB..",
      ".BB......BB.",
      "BB........BB",
      "BB........BB",
      "BB........BB",
      ".BB......BB.",
      "..BB....BB..",
      "...BB..BB...",
      "....YYYY....",
      ".....RR.....",
      ".....RR....."
    ]
  },
  art_dinh: {
    w: 12, h: 12,
    palette: { '.': null, 'B': '#0d9488', 'L': '#2dd4bf', 'D': '#115e59', 'Y': '#facc15' },
    data: [
      ".BB......BB.",
      ".BB......BB.",
      "BBBBBBBBBBBB",
      "BBLLLLLLLLBB",
      "BBLDDDDDDLBB",
      "BBLDYYYYDLBB",
      "BBLDDDDDDLBB",
      ".BBLLLLLLBB.",
      "..BBBBBBBB..",
      "..BB....BB..",
      "..BB....BB..",
      "............"
    ]
  }
  };

  function getItemPixelSvg(itemId, size = 20) {
    const sprite = ITEM_PIXEL_SPRITES[itemId];
    if (!sprite) return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="${size}" height="${size}" class="item-pixel-icon"><rect width="12" height="12" fill="#64748b"/></svg>`;
    const { w, h, palette, data } = sprite;
    let rects = '';
    for (let y = 0; y < h; y++) {
      const row = data[y];
      if (!row) continue;
      let startX = -1;
      let currentColor = null;
      for (let x = 0; x < w; x++) {
        const char = row[x];
        const color = palette[char];
        if (color !== currentColor) {
          if (currentColor && startX >= 0) {
            rects += `<rect x="${startX}" y="${y}" width="${x - startX}" height="1" fill="${currentColor}"/>`;
          }
          currentColor = color;
          startX = color ? x : -1;
        }
      }
      if (currentColor && startX >= 0) {
        rects += `<rect x="${startX}" y="${y}" width="${w - startX}" height="1" fill="${currentColor}"/>`;
      }
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${size}" height="${size}" shape-rendering="crispEdges" class="item-pixel-icon">${rects}</svg>`;
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

    playHeal() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, t);
      osc.frequency.exponentialRampToValueAtTime(783.99, t + 0.25);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.005, t + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.35);
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

  // Cân bằng tiến độ: tốc độ hấp thu tăng chậm hơn so với ngưỡng đột phá,
  // còn Tụ Linh chủ động vẫn hữu ích nhưng không thể đẩy cấp quá nhanh.
  const CULTIVATION_BALANCE = Object.freeze({
    passiveRate: 0.08,
    activeGatherRate: 0.18,
    activeGatherCooldownMs: 1000
  });

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
        armorPen: 0.35,
        critBonus: 0.2,
        desc: 'Ngưng tụ kiếm khí chém ra một kiếm kinh thiên, bỏ qua 35% phòng ngự và +20% tỷ lệ bạo kích.'
      },
      skills: [
        {
          id: 'skill_kiem_1',
          name: 'Nhất Kiếm Tây Lai',
          mpCost: 25,
          cd: 2,
          dmgMult: 2.2,
          armorPen: 0.35,
          critBonus: 0.2,
          desc: 'Ngưng tụ kiếm khí chém ra một kiếm kinh thiên, bỏ qua 35% giáp và +20% Bạo Kích.'
        },
        {
          id: 'skill_kiem_2',
          name: 'Vạn Kiếm Quy Tông',
          mpCost: 40,
          cd: 3,
          dmgMult: 2.6,
          bleedChance: 0.85,
          bleedStacks: 2,
          desc: 'Ngưng kết vạn đạo phi kiếm phong tỏa hư không, 85% gây Xuất Huyết 2 tầng trong 3 hiệp.'
        }
      ],
      passive: {
        id: 'passive_kiem_1',
        name: 'Kiếm Khí Thông Thiên',
        desc: 'Mỗi đòn đánh trúng tích lũy 1 tầng Kiếm Khí (tối đa 5 tầng), mỗi tầng tăng 6% Sát Thương Bạo Kích.'
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
        burnChance: 0.75,
        burnTurns: 3,
        desc: 'Dẫn giáng cột lửa ngút trời, 75% thiêu đốt đối thủ gây sát thương liên tục 3 hiệp.'
      },
      skills: [
        {
          id: 'skill_phap_1',
          name: 'Cửu Thiên Huyền Hỏa',
          mpCost: 35,
          cd: 2,
          dmgMult: 2.0,
          burnChance: 0.75,
          burnTurns: 3,
          desc: 'Dẫn Cửu Thiên Chân Hỏa thiêu rụi mục tiêu, 75% gây Thiêu Đốt 3 hiệp.'
        },
        {
          id: 'skill_phap_2',
          name: 'Ngũ Hành Kim Giáp',
          mpCost: 40,
          cd: 3,
          dmgMult: 1.0,
          shieldPercentMp: 0.8,
          desc: 'Tụ linh khí ngũ hành tạo Kim Thân hộ thuẫn hấp thụ sát thương bằng 80% Linh Lực tối đa.'
        }
      ],
      passive: {
        id: 'passive_phap_1',
        name: 'Ngũ Hành Linh Thể',
        desc: 'Linh lực vô cùng vô tận, mỗi đòn đánh có 30% cơ hội phóng thích lôi quang làm Tê Liệt địch 1 hiệp.'
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
        cd: 2,
        dmgMult: 1.9,
        stunChance: 0.5,
        desc: 'Quyền kình bá đạo làm rung chuyển hư không, có 50% làm Tê Liệt / Choáng địch 1 hiệp.'
      },
      skills: [
        {
          id: 'skill_the_1',
          name: 'Bá Vương Khí Kình',
          mpCost: 20,
          cd: 2,
          dmgMult: 1.9,
          stunChance: 0.5,
          desc: 'Quyền kình bá đạo làm rung chuyển hư không, có 50% làm Tê Liệt địch 1 hiệp.'
        },
        {
          id: 'skill_the_2',
          name: 'Bất Diệt Kim Thân',
          mpCost: 30,
          cd: 3,
          dmgMult: 1.2,
          shieldPercentHp: 0.4,
          reflectBonus: 0.4,
          desc: 'Hóa thành Kim Thân chiến thần, nhận khiên bằng 40% HP tối đa và phản chấn 40% sát thương.'
        }
      ],
      passive: {
        id: 'passive_the_1',
        name: 'Cửu Chuyển Kim Cốt',
        desc: 'Đầu mỗi hiệp tự động hồi phục 4% HP tối đa, đồng thời phản chấn 15% sát thương cận chiến.'
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
        cleanse: true,
        desc: 'Hồi phục 35% HP và thanh tẩy mọi hiệu ứng bất lợi (Choáng, Đốt, Chảy Máu, Độc).'
      },
      skills: [
        {
          id: 'skill_dan_1',
          name: 'Bách Thảo Hồi Xuân',
          mpCost: 30,
          cd: 2,
          dmgMult: 1.2,
          healPercent: 0.35,
          cleanse: true,
          desc: 'Dẫn dắt mộc linh sinh cơ hồi 35% HP và thanh tẩy toàn bộ hiệu ứng xấu.'
        },
        {
          id: 'skill_dan_2',
          name: 'Vạn Độc Xuyên Tâm',
          mpCost: 35,
          cd: 3,
          dmgMult: 1.8,
          poisonChance: 0.85,
          poisonTurns: 3,
          defDebuff: 0.25,
          desc: 'Bắn ra độc châm cổ truyền, 85% gây Trúng Độc 3 hiệp và giảm 25% Phòng Ngự kẻ địch.'
        }
      ],
      passive: {
        id: 'passive_dan_1',
        name: 'Dược Thần Hộ Thể',
        desc: 'Kháng 100% Trúng Độc; hiệu quả đan dược hồi phục tăng 35%.'
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
        lifeStealPercent: 0.35,
        desc: 'Hiến tế 10% HP hiện tại, giáng đòn sát thương hủy diệt và hút lại 35% sát thương đó.'
      },
      skills: [
        {
          id: 'skill_ma_1',
          name: 'Huyết Ảnh Thao Thiên',
          mpCost: 20,
          hpCostPercent: 0.1,
          cd: 2,
          dmgMult: 2.8,
          lifeStealPercent: 0.35,
          desc: 'Hiến tế 10% HP hiện tại, giáng đòn hủy diệt và hút 35% sát thương thành sinh mệnh.'
        },
        {
          id: 'skill_ma_2',
          name: 'Ma Thần Cuồng Nộ',
          mpCost: 25,
          hpCostPercent: 0.12,
          cd: 3,
          dmgMult: 2.2,
          bleedChance: 0.8,
          bleedStacks: 2,
          lifeStealPercent: 0.4,
          desc: 'Kích phát cuồng nộ ma thần: gây sát thương nặng, 80% gây Xuất Huyết và hút 40% máu.'
        }
      ],
      passive: {
        id: 'passive_ma_1',
        name: 'Huyết Sát Nghịch Chuyển',
        desc: 'Khi Khí Huyết tụt xuống dưới 40%, bùng phát Cuồng Bạo: Tăng 35% Công Kích và 20% Bạo Kích.'
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
      gridX: 0, gridY: 0,
      terrain: 'Sơn lâm',
      reqRealmIndex: 0,
      dangerLevel: 'Thấp (Luyện Khí Kỳ)',
      desc: 'Rừng cây xanh tốt bao quanh tiên phong, nơi đệ tử nhập môn rèn luyện và hái thuốc.',
      monsters: ['wolf_novice', 'boar_novice', 'snake_novice'],
      herbs: ['herb_linhchi', 'herb_thanh_u'],
      ores: ['ore_huyenthiet', 'ore_dong_tinh'],
      materials: ['core_yeu_dan_1', 'mat_lang_nanh', 'mat_tru_nha', 'mat_xa_noc'],
      lootStoneRange: [10, 30]
    },
    {
      id: 'region_2',
      name: 'Vạn Yêu Sơn Mạch',
      gridX: 2, gridY: -1,
      terrain: 'Sơn mạch',
      reqRealmIndex: 10,
      dangerLevel: 'Trung Bình (Trúc Cơ Kỳ)',
      desc: 'Dãy núi ngút ngàn đầy yêu khí hung hãn, cọp dữ gầm thét, độc xà lượn quanh.',
      monsters: ['tiger_fire', 'bear_black', 'eagle_blood'],
      herbs: ['herb_hoaviem', 'herb_bachnien', 'herb_u_hon'],
      ores: ['ore_tutinh', 'ore_huyenthiet', 'ore_dong_tinh'],
      materials: ['core_yeu_dan_2', 'mat_ho_bi', 'mat_hung_dam', 'mat_dieu_vu'],
      lootStoneRange: [50, 150]
    },
    {
      id: 'region_3',
      name: 'Cổ Kiếm Bí Cảnh',
      gridX: 4, gridY: 0,
      terrain: 'Kiếm vực',
      reqRealmIndex: 14,
      dangerLevel: 'Cao (Kim Đan Kỳ)',
      desc: 'Phế tích thượng cổ kiếm tông lưu lại, kiếm ý tung hoành, khôi lỗi hộ kiếm tuần tra.',
      monsters: ['golem_sword', 'ghost_swordsman', 'cultist_dark'],
      herbs: ['herb_bachnien', 'herb_longhuyet', 'herb_huyen_bang'],
      ores: ['ore_tutinh', 'ore_thienngoai'],
      materials: ['core_yeu_dan_3'],
      lootStoneRange: [200, 500]
    },
    {
      id: 'region_4',
      name: 'Huyết Sát Ma Vực',
      gridX: 5, gridY: -2,
      terrain: 'Ma vực',
      reqRealmIndex: 18,
      dangerLevel: 'Rất Nguy Hiểm (Nguyên Anh Kỳ)',
      desc: 'Biển máu u ám ngút trời, nơi tà tu và đại ma đầu ẩn náu tế luyện ma khí.',
      monsters: ['cultist_elder', 'blood_fiend', 'wolf_demon_king'],
      herbs: ['herb_longhuyet', 'herb_cuuchuyen'],
      ores: ['ore_thienngoai', 'ore_huyettinh'],
      materials: ['core_yeu_dan_4'],
      lootStoneRange: [600, 1500]
    },
    {
      id: 'region_5',
      name: 'Thượng Cổ Vực Thẳm',
      gridX: 3, gridY: -4,
      terrain: 'Hư không',
      reqRealmIndex: 22,
      dangerLevel: 'Tuyệt Địa Hung Hiểm (Hóa Thần+)',
      desc: 'Khe nứt hư không thông đến di tích tiên ma cổ đại, nơi cự long và thụ yêu ngàn năm thống trị.',
      monsters: ['dragon_ancient', 'tree_ancient', 'golem_divine'],
      herbs: ['herb_cuuchuyen', 'herb_thienkiem', 'herb_ngo_dao'],
      ores: ['ore_huyettinh', 'ore_hondon', 'ore_thai_at'],
      materials: ['core_yeu_dan_5', 'mat_giao_lan', 'mat_hu_moc'],
      lootStoneRange: [2000, 5000]
    }
  ];

  // Các đạo hữu cư ngụ trong Vạn Giới. Đây là dữ liệu mô phỏng
  // để thế giới có cảm giác sống động ngay cả khi game chưa có máy chủ online.
  const WORLD_TRAVELERS = [
    { id: 'traveler_linh_nhi', name: 'Linh Nhi', title: 'Tán Tu Hái Thuốc', regionId: 'region_1', realmIndex: 2, faction: 'Tán Tu', mood: 'thân thiện' },
    { id: 'traveler_mac_van', name: 'Mặc Vân', title: 'Kiếm Tu Du Phương', regionId: 'region_2', realmIndex: 11, faction: 'Vân Kiếm Minh', mood: 'trầm mặc' },
    { id: 'traveler_thanh_lien', name: 'Thanh Liên Tiên Tử', title: 'Luyện Đan Sư', regionId: 'region_3', realmIndex: 15, faction: 'Thanh Liên Các', mood: 'nhã nhặn' },
    { id: 'traveler_huyet_sat', name: 'Huyết Sát Tử', title: 'Ma Tu Lãng Khách', regionId: 'region_4', realmIndex: 19, faction: 'Huyết Ảnh Điện', mood: 'nguy hiểm' },
    { id: 'traveler_tinh_ha', name: 'Tinh Hà Đạo Nhân', title: 'Tinh Không Khách', regionId: 'region_5', realmIndex: 23, faction: 'Tinh Hà Cổ Minh', mood: 'thần bí' }
  ];

  const WORLD_FACTIONS = [
    { id: 'faction_van_kiem', name: 'Vân Kiếm Minh', type: 'Liên minh kiếm tu', reqRealmIndex: 10, influence: 18, desc: 'Các kiếm tu kết minh, trọng lời hứa và giao ước.' },
    { id: 'faction_thanh_lien', name: 'Thanh Liên Các', type: 'Thế lực luyện đan', reqRealmIndex: 14, influence: 25, desc: 'Nắm giữ nhiều linh dược và bí phương thất truyền.' },
    { id: 'faction_tinh_ha', name: 'Tinh Hà Cổ Minh', type: 'Cổ minh hư không', reqRealmIndex: 22, influence: 40, desc: 'Thế lực cổ xưa canh giữ cánh cửa đi vào vực thẳm.' }
  ];

  const MONSTERS = {
    wolf_novice: {
      id: 'wolf_novice', name: 'U Minh Yêu Lang', spriteKey: 'monsterWolf',
      hp: 200, mp: 50, atk: 32, def: 14, spd: 20, exp: 40, stone: 15,
      skills: [{ name: 'Lang Trảo Liêm', dmgMult: 1.2 }],
      drops: [
        { item: 'herb_linhchi', chance: 0.6 },
        { item: 'ore_huyenthiet', chance: 0.4 },
        { item: 'core_yeu_dan_1', chance: 0.5 },
        { item: 'mat_lang_nanh', chance: 0.45 },
        { item: 'chest_tu_tru_vat', chance: 0.25 }
      ]
    },
    boar_novice: {
      id: 'boar_novice', name: 'Cương Nha Hắc Trư', spriteKey: 'monsterWolf',
      hp: 320, mp: 20, atk: 25, def: 25, spd: 12, exp: 45, stone: 18,
      skills: [{ name: 'Man Lực Xung Tràng', dmgMult: 1.3 }],
      drops: [
        { item: 'ore_huyenthiet', chance: 0.7 },
        { item: 'core_yeu_dan_1', chance: 0.5 },
        { item: 'mat_tru_nha', chance: 0.45 },
        { item: 'ore_dong_tinh', chance: 0.3 }
      ]
    },
    snake_novice: {
      id: 'snake_novice', name: 'Lục Hoa Độc Xà', spriteKey: 'monsterTree',
      hp: 180, mp: 60, atk: 38, def: 10, spd: 26, exp: 42, stone: 20,
      skills: [{ name: 'Độc Dịch Phun Trào', dmgMult: 1.1, poison: true }],
      drops: [
        { item: 'herb_thanh_u', chance: 0.6 },
        { item: 'core_yeu_dan_1', chance: 0.5 },
        { item: 'mat_xa_noc', chance: 0.5 },
        { item: 'herb_u_hon', chance: 0.3 }
      ]
    },
    tiger_fire: {
      id: 'tiger_fire', name: 'Xích Diễm Hổ', spriteKey: 'monsterTiger',
      hp: 2800, mp: 400, atk: 580, def: 280, spd: 85, exp: 450, stone: 120,
      skills: [{ name: 'Hổ Khiếu Hỏa Ba', dmgMult: 1.4, burn: true }],
      drops: [
        { item: 'herb_hoaviem', chance: 0.7 },
        { item: 'ore_tutinh', chance: 0.5 },
        { item: 'core_yeu_dan_2', chance: 0.6 },
        { item: 'mat_ho_bi', chance: 0.5 },
        { item: 'talisman_liet_hoa', chance: 0.25 },
        { item: 'chest_tu_tru_vat', chance: 0.35 }
      ]
    },
    bear_black: {
      id: 'bear_black', name: 'Bạo Nộ Cuồng Hùng', spriteKey: 'monsterTiger',
      hp: 4200, mp: 200, atk: 500, def: 420, spd: 60, exp: 480, stone: 130,
      skills: [{ name: 'Liệt Địa Chấn Kích', dmgMult: 1.5 }],
      drops: [
        { item: 'herb_bachnien', chance: 0.6 },
        { item: 'core_yeu_dan_2', chance: 0.6 },
        { item: 'mat_hung_dam', chance: 0.5 },
        { item: 'ore_tutinh', chance: 0.4 }
      ]
    },
    eagle_blood: {
      id: 'eagle_blood', name: 'Huyết Dực Thần Điêu', spriteKey: 'monsterWolf',
      hp: 2400, mp: 600, atk: 650, def: 220, spd: 120, exp: 500, stone: 150,
      skills: [{ name: 'Huyết Vũ Trảm Không', dmgMult: 1.6 }],
      drops: [
        { item: 'herb_hoaviem', chance: 0.5 },
        { item: 'core_yeu_dan_2', chance: 0.6 },
        { item: 'mat_dieu_vu', chance: 0.55 },
        { item: 'talisman_dan_loi', chance: 0.3 }
      ]
    },
    golem_sword: {
      id: 'golem_sword', name: 'Cổ Kiếm Khôi Lỗi', spriteKey: 'monsterGolem',
      hp: 18000, mp: 2000, atk: 2400, def: 1800, spd: 150, exp: 3500, stone: 400,
      skills: [{ name: 'Bát Hoang Kiếm Trận', dmgMult: 1.5 }],
      drops: [
        { item: 'ore_thienngoai', chance: 0.7 },
        { item: 'herb_longhuyet', chance: 0.4 },
        { item: 'core_yeu_dan_3', chance: 0.65 },
        { item: 'chest_bi_canh', chance: 0.3 }
      ]
    },
    ghost_swordsman: {
      id: 'ghost_swordsman', name: 'Tàn Hồn Kiếm Tiên', spriteKey: 'monsterCultist',
      hp: 14000, mp: 5000, atk: 3200, def: 1100, spd: 220, exp: 4200, stone: 500,
      skills: [{ name: 'Vạn Kiếm Quy Tông', dmgMult: 1.8 }],
      drops: [
        { item: 'ore_thienngoai', chance: 0.6 },
        { item: 'herb_bachnien', chance: 0.8 },
        { item: 'core_yeu_dan_3', chance: 0.65 },
        { item: 'chest_bi_canh', chance: 0.35 }
      ]
    },
    cultist_dark: {
      id: 'cultist_dark', name: 'U Hồn Tà Tu', spriteKey: 'monsterCultist',
      hp: 16000, mp: 4000, atk: 2900, def: 1300, spd: 180, exp: 3800, stone: 450,
      skills: [{ name: 'Huyết Hồn Trảo', dmgMult: 1.4, lifeSteal: 0.2 }],
      drops: [
        { item: 'herb_longhuyet', chance: 0.6 },
        { item: 'herb_u_hon', chance: 0.7 },
        { item: 'core_yeu_dan_3', chance: 0.6 },
        { item: 'talisman_don_dia', chance: 0.4 }
      ]
    },
    cultist_elder: {
      id: 'cultist_elder', name: 'Huyết Ma Trưởng Lão', spriteKey: 'monsterCultist',
      hp: 75000, mp: 25000, atk: 13500, def: 6800, spd: 450, exp: 28000, stone: 1200,
      skills: [{ name: 'Huyết Lôi Ma Kiếp', dmgMult: 2.0 }],
      drops: [
        { item: 'ore_huyettinh', chance: 0.8 },
        { item: 'herb_cuuchuyen', chance: 0.4 },
        { item: 'core_yeu_dan_4', chance: 0.75 },
        { item: 'pill_quy_nguyen', chance: 0.3 },
        { item: 'chest_bi_canh', chance: 0.5 }
      ]
    },
    blood_fiend: {
      id: 'blood_fiend', name: 'Sát Lục Ma Tướng', spriteKey: 'monsterGolem',
      hp: 95000, mp: 15000, atk: 15500, def: 9500, spd: 380, exp: 32000, stone: 1400,
      skills: [{ name: 'Cuồng Bạo Huyết Trảm', dmgMult: 2.2 }],
      drops: [
        { item: 'ore_huyettinh', chance: 0.7 },
        { item: 'core_yeu_dan_4', chance: 0.7 },
        { item: 'pill_bao_khi', chance: 0.4 },
        { item: 'chest_bi_canh', chance: 0.45 }
      ]
    },
    wolf_demon_king: {
      id: 'wolf_demon_king', name: 'Huyết Nguyệt Yêu Vương', spriteKey: 'monsterWolf',
      hp: 85000, mp: 20000, atk: 17000, def: 7200, spd: 520, exp: 35000, stone: 1600,
      skills: [{ name: 'U Minh Ma Cào', dmgMult: 2.1 }],
      drops: [
        { item: 'herb_longhuyet', chance: 0.8 },
        { item: 'herb_cuuchuyen', chance: 0.5 },
        { item: 'core_yeu_dan_4', chance: 0.8 },
        { item: 'chest_bi_canh', chance: 0.6 }
      ]
    },
    dragon_ancient: {
      id: 'dragon_ancient', name: 'Thái Cổ Bích Giao Long', spriteKey: 'monsterDragon',
      hp: 350000, mp: 120000, atk: 65000, def: 35000, spd: 950, exp: 250000, stone: 4000,
      skills: [{ name: 'Long Tức Băng Phong', dmgMult: 2.4, freeze: true }],
      drops: [
        { item: 'ore_hondon', chance: 0.8 },
        { item: 'herb_thienkiem', chance: 0.6 },
        { item: 'core_yeu_dan_5', chance: 0.85 },
        { item: 'mat_giao_lan', chance: 0.8 },
        { item: 'ore_thai_at', chance: 0.7 },
        { item: 'chest_thien_co', chance: 0.6 }
      ]
    },
    tree_ancient: {
      id: 'tree_ancient', name: 'Vạn Niên Hủ Mộc Yêu Vương', spriteKey: 'monsterTree',
      hp: 550000, mp: 80000, atk: 52000, def: 45000, spd: 600, exp: 280000, stone: 4500,
      skills: [{ name: 'Vạn Căn Toả Mệnh', dmgMult: 2.0, heal: 0.2 }],
      drops: [
        { item: 'herb_thienkiem', chance: 0.8 },
        { item: 'herb_cuuchuyen', chance: 0.9 },
        { item: 'core_yeu_dan_5', chance: 0.85 },
        { item: 'mat_hu_moc', chance: 0.8 },
        { item: 'herb_ngo_dao', chance: 0.75 },
        { item: 'chest_thien_co', chance: 0.6 }
      ]
    },
    golem_divine: {
      id: 'golem_divine', name: 'Hỗn Độn Thạch Hoàng', spriteKey: 'monsterGolem',
      hp: 650000, mp: 50000, atk: 75000, def: 55000, spd: 700, exp: 350000, stone: 5000,
      skills: [{ name: 'Càn Khôn Nhất Kích', dmgMult: 2.6 }],
      drops: [
        { item: 'ore_hondon', chance: 0.9 },
        { item: 'core_yeu_dan_5', chance: 0.9 },
        { item: 'ore_thai_at', chance: 0.8 },
        { item: 'chest_thien_co', chance: 0.7 }
      ]
    }
  };

  const ITEMS = {
    // ==========================================
    // 1. DƯỢC THẢO (LINH DƯỢC NGUYÊN LIỆU & NUỐT TRỰC TIẾP)
    // ==========================================
    herb_linhchi: {
      id: 'herb_linhchi', name: 'Linh Chi Thảo', type: 'herb', icon: '🍄',
      desc: 'Linh thảo sơ cấp chứa linh khí trời đất, tính ôn hòa. Nuốt trực tiếp hồi 20% HP & nạp +35 Tu Vi hoặc dùng luyện đan Luyện Khí.',
      rawEffectDesc: 'Hồi phục 20% Khí Huyết và nạp +35 Tu Vi',
      price: 15,
      howToGet: '🌿 Hái tại Linh Sơn Ngoại Vi | ⚔️ Diệt U Minh Yêu Lang | 🏪 Phường Thị (15 Linh Thạch)',
      sources: ['Linh Sơn Ngoại Vi', 'U Minh Yêu Lang', 'Phường Thị']
    },
    herb_thanh_u: {
      id: 'herb_thanh_u', name: 'Thanh U Thảo', type: 'herb', icon: '🌿',
      desc: 'Thảo mộc thanh mát dùng chế tạo thuốc hồi linh và đan giải độc. Nuốt trực tiếp lập tức hồi 25% Linh Lực.',
      rawEffectDesc: 'Hồi phục 25% Linh Lực và thanh lọc tâm trí',
      price: 20,
      howToGet: '🌿 Hái tại Linh Sơn Ngoại Vi, Vạn Yêu Sơn Mạch | ⚔️ Diệt Lục Hoa Độc Xà | 🏪 Phường Thị',
      sources: ['Linh Sơn Ngoại Vi', 'Vạn Yêu Sơn Mạch', 'Lục Hoa Độc Xà', 'Phường Thị']
    },
    herb_u_hon: {
      id: 'herb_u_hon', name: 'U Hồn Thảo', type: 'herb', icon: '🌾',
      desc: 'Linh thảo âm hàn sinh trưởng nơi thi cốt cổ xưa. Nuốt trực tiếp kích hoạt U Ảnh Bộ, tăng +20 Thân Pháp trong 3 phút.',
      rawEffectDesc: 'Kích phát U Ảnh Bộ, tăng +20 Thân Pháp trong 3 phút',
      price: 45,
      howToGet: '🌿 Hái tại Vạn Yêu Sơn Mạch | ⚔️ Rớt từ U Hồn Tà Tu, Lục Hoa Độc Xà | 🏪 Phường Thị',
      sources: ['Vạn Yêu Sơn Mạch', 'U Hồn Tà Tu', 'Phường Thị']
    },
    herb_hoaviem: {
      id: 'herb_hoaviem', name: 'Hỏa Viêm Thảo', type: 'herb', icon: '🌺',
      desc: 'Linh thảo sinh trưởng cạnh dung nham, dương khí sung túc. Nuốt trực tiếp kích hoạt Chân Hỏa Huyết, tăng +20 Công Kích trong 3 phút.',
      rawEffectDesc: 'Kích hoạt Chân Hỏa Huyết, tăng +20 Công Kích trong 3 phút',
      price: 60,
      howToGet: '🌿 Hái tại Vạn Yêu Sơn Mạch | ⚔️ Diệt Xích Diễm Hổ, Huyết Dực Thần Điêu | 🏪 Phường Thị',
      sources: ['Vạn Yêu Sơn Mạch', 'Xích Diễm Hổ', 'Phường Thị']
    },
    herb_bachnien: {
      id: 'herb_bachnien', name: 'Bách Niên Linh Dược', type: 'herb', icon: '🌸',
      desc: 'Dược liệu trăm năm giữa linh tuyền cấm địa, tích tụ tinh hoa đất trời. Nuốt trực tiếp hồi 60% HP & MP, tăng +150 Tu Vi.',
      rawEffectDesc: 'Uẩn dưỡng kinh mạch, hồi 60% HP & MP, nạp +150 Tu Vi',
      price: 150,
      howToGet: '🌿 Hái tại Cổ Kiếm Bí Cảnh | ⚔️ Diệt Bạo Nộ Cuồng Hùng, Tàn Hồn Kiếm Tiên | 🏪 Phường Thị',
      sources: ['Cổ Kiếm Bí Cảnh', 'Bạo Nộ Cuồng Hùng', 'Phường Thị']
    },
    herb_huyen_bang: {
      id: 'herb_huyen_bang', name: 'Huyền Băng Linh Thảo', type: 'herb', icon: '❄️',
      desc: 'Linh thảo ngàn năm đóng băng trên vách đá tuyết, trong suốt như ngọc. Nuốt trực tiếp ngưng tụ Hàn Băng Thuẫn, tăng +35 Phòng Ngự trong 3 phút.',
      rawEffectDesc: 'Ngưng tụ Hàn Băng Thuẫn, tăng +35 Phòng Ngự trong 3 phút',
      price: 280,
      howToGet: '🌿 Hái tại Cổ Kiếm Bí Cảnh | 📦 Rương Bí Cảnh | 🏪 Phường Thị',
      sources: ['Cổ Kiếm Bí Cảnh', 'Rương Bí Cảnh', 'Phường Thị']
    },
    herb_longhuyet: {
      id: 'herb_longhuyet', name: 'Long Huyết Thảo', type: 'herb', icon: '🩸',
      desc: 'Thảo mộc hấp thu huyết mạch giao long, đỏ rực như máu. Nuốt trực tiếp tôi luyện kinh mạch: Tăng vĩnh viễn +50 HP tối đa!',
      rawEffectDesc: 'Hấp thu huyết mạch Chân Long, tăng vĩnh viễn +50 HP tối đa',
      price: 400,
      howToGet: '🌿 Hái tại Huyết Sát Ma Vực | ⚔️ Diệt Huyết Nguyệt Yêu Vương, Ma Tướng | 🏪 Phường Thị',
      sources: ['Huyết Sát Ma Vực', 'Huyết Nguyệt Yêu Vương', 'Phường Thị']
    },
    herb_cuuchuyen: {
      id: 'herb_cuuchuyen', name: 'Cửu Chuyển Tiên Thảo', type: 'herb', icon: '🪷',
      desc: 'Linh chi chín màu tỏa ánh hào quang. Nuốt trực tiếp khai thông đại khiếu: Tăng vĩnh viễn +100 HP, +50 MP và nạp +500 Tu Vi!',
      rawEffectDesc: 'Khai thông cửu khiếu: Tăng vĩnh viễn +100 HP, +50 MP và +500 Tu Vi',
      price: 1200,
      howToGet: '🌿 Hái tại Thượng Cổ Vực Thẳm | ⚔️ Diệt Vạn Niên Hủ Mộc, Huyết Ma Trưởng Lão | 📦 Rương Cổ',
      sources: ['Thượng Cổ Vực Thẳm', 'Vạn Niên Hủ Mộc', 'Bí Cảnh']
    },
    herb_thienkiem: {
      id: 'herb_thienkiem', name: 'Thiên Kiếm Thảo', type: 'herb', icon: '🎋',
      desc: 'Lá cây sắc nhọn như phi kiếm cắm thẳng vào vách đá. Nuốt trực tiếp ngưng đọng Kiếm Ý: Tăng vĩnh viễn +10 Công Kích và +1% Bạo Kích!',
      rawEffectDesc: 'Ngưng đọng Kiếm Ý Tiên Thiên: Tăng vĩnh viễn +10 Công Kích & +1% Bạo Kích',
      price: 3000,
      howToGet: '🌿 Hái tại Thượng Cổ Vực Thẳm | ⚔️ Diệt Thái Cổ Bích Giao Long | 👑 Đổi Tông Môn',
      sources: ['Thượng Cổ Vực Thẳm', 'Thái Cổ Bích Giao Long', 'Tông Môn']
    },
    herb_ngo_dao: {
      id: 'herb_ngo_dao', name: 'Ngộ Đạo Cổ Trà Diệp', type: 'herb', icon: '🍃',
      desc: 'Lá trà hái từ cổ thụ ngàn năm nơi tiên giới. Nuốt trực tiếp tăng 50% tốc độ tu luyện trong 30 giây hoặc dùng hãm Ngộ Đạo Cổ Trà.',
      rawEffectDesc: 'Tăng 50% tốc độ tích lũy tu vi trong 30 giây',
      price: 300,
      howToGet: '🌿 Hái tại Thượng Cổ Vực Thẳm | 🍵 Kỳ Ngộ Trà Tiên | 📦 Rương Bí Cảnh',
      sources: ['Thượng Cổ Vực Thẳm', 'Kỳ Ngộ', 'Rương Bí Cảnh']
    },

    // ==========================================
    // 2. KHOÁNG THẠCH & TINH KIM (NGUYÊN LIỆU & THỐI LUYỆN)
    // ==========================================
    ore_huyenthiet: {
      id: 'ore_huyenthiet', name: 'Huyền Thiết Tinh', type: 'ore', icon: '⬛',
      desc: 'Quặng sắt đen rắn chắc, dùng rèn đúc và thối luyện pháp khí sơ cấp (+1 đến +3).',
      price: 20,
      howToGet: '⛏️ Đào mỏ tại Linh Sơn Ngoại Vi | ⚔️ Diệt Cương Nha Hắc Trư | 🏪 Phường Thị',
      sources: ['Linh Sơn Ngoại Vi', 'Cương Nha Hắc Trư', 'Phường Thị']
    },
    ore_dong_tinh: {
      id: 'ore_dong_tinh', name: 'Thanh Đồng Cổ Tinh', type: 'ore', icon: '🥉',
      desc: 'Tinh chất đồng xanh thượng cổ dẫn linh lực cực tốt, dùng chế tạo Bùa Chú và Pháp Khí.',
      price: 40,
      howToGet: '⛏️ Đào mỏ tại Linh Sơn Ngoại Vi, Vạn Yêu Sơn Mạch | 🏪 Phường Thị (40 Linh Thạch)',
      sources: ['Linh Sơn Ngoại Vi', 'Vạn Yêu Sơn Mạch', 'Phường Thị']
    },
    ore_tutinh: {
      id: 'ore_tutinh', name: 'Tử Tinh Khoáng', type: 'ore', icon: '🔮',
      desc: 'Khoáng thạch tím chứa linh lực ổn định, dùng đúc Xích Tiêu Kiếm và thối luyện trung cấp (+4 đến +6).',
      price: 75,
      howToGet: '⛏️ Đào mỏ tại Vạn Yêu Sơn Mạch | ⚔️ Diệt Xích Diễm Hổ | 🏪 Phường Thị',
      sources: ['Vạn Yêu Sơn Mạch', 'Xích Diễm Hổ', 'Phường Thị']
    },
    ore_thienngoai: {
      id: 'ore_thienngoai', name: 'Thiên Ngoại Vẫn Thiết', type: 'ore', icon: '☄️',
      desc: 'Thiên thạch rơi xuống từ cửu tiêu hư không, dùng rèn Trảm Yêu Cự Kiếm và thối luyện cao cấp (+7 đến +10).',
      price: 300,
      howToGet: '⛏️ Đào mỏ tại Cổ Kiếm Bí Cảnh | ⚔️ Diệt Cổ Kiếm Khôi Lỗi, Tàn Hồn Kiếm Tiên',
      sources: ['Cổ Kiếm Bí Cảnh', 'Cổ Kiếm Khôi Lỗi', 'Phường Thị']
    },
    ore_huyettinh: {
      id: 'ore_huyettinh', name: 'Huyết Ma Thạch', type: 'ore', icon: '🔴',
      desc: 'Huyết thạch ma đạo đúc vũ khí khát máu và hộ giáp phòng ngự tà ác.',
      price: 800,
      howToGet: '⛏️ Đào mỏ tại Huyết Sát Ma Vực | ⚔️ Diệt Sát Lục Ma Tướng, Huyết Ma Trưởng Lão',
      sources: ['Huyết Sát Ma Vực', 'Sát Lục Ma Tướng']
    },
    ore_thai_at: {
      id: 'ore_thai_at', name: 'Thái Ất Chân Kim', type: 'ore', icon: '🥇',
      desc: 'Kim loại tiên gia màu hoàng kim ánh bạch sắc, đúc phi kiếm thì sắc bén trảm phá hư không.',
      price: 1500,
      howToGet: '⛏️ Đào mỏ tại Thượng Cổ Vực Thẳm | ⚔️ Diệt Thái Cổ Bích Giao Long | 📦 Rương Chí Bảo',
      sources: ['Thượng Cổ Vực Thẳm', 'Thái Cổ Bích Giao Long']
    },
    ore_hondon: {
      id: 'ore_hondon', name: 'Hỗn Độn Thần Thiết', type: 'ore', icon: '✨',
      desc: 'Thần tài khai thiên lập địa, vô kiên bất tồi, dùng rèn Hỗn Độn Tiên Y và Bát Hoang Tiên Kiếm.',
      price: 2500,
      howToGet: '⛏️ Đào mỏ tại Thượng Cổ Vực Thẳm | ⚔️ Diệt Hỗn Độn Thạch Hoàng | 👑 Đổi Tông Môn',
      sources: ['Thượng Cổ Vực Thẳm', 'Hỗn Độn Thạch Hoàng', 'Tông Môn']
    },

    // ==========================================
    // 3. YÊU ĐAN & YÊU THÚ DỊ BẢO (NGUYÊN LIỆU)
    // ==========================================
    core_yeu_dan_1: {
      id: 'core_yeu_dan_1', name: 'Yêu Đan Nhất Giai', type: 'monster_mat', icon: '🟢',
      desc: 'Nội đan kết tinh linh khí của yêu thú Luyện Khí Kỳ. Dùng chế tạo Độn Địa Phù và Tụ Khí Đan.',
      price: 35,
      howToGet: '⚔️ Rớt khi trảm sát U Minh Yêu Lang, Cương Nha Hắc Trư, Lục Hoa Độc Xà (Linh Sơn Ngoại Vi)',
      sources: ['Linh Sơn Ngoại Vi', 'U Minh Yêu Lang', 'Cương Nha Hắc Trư']
    },
    core_yeu_dan_2: {
      id: 'core_yeu_dan_2', name: 'Yêu Đan Nhị Giai', type: 'monster_mat', icon: '🔵',
      desc: 'Nội đan đỏ thẫm chứa thú hồn mãnh liệt của yêu thú Trúc Cơ Kỳ. Nguyên liệu cốt lõi luyện Trúc Cơ Đan và Hàn Băng Phù.',
      price: 120,
      howToGet: '⚔️ Rớt khi diệt Xích Diễm Hổ, Bạo Nộ Cuồng Hùng, Huyết Dực Thần Điêu (Vạn Yêu Sơn Mạch)',
      sources: ['Vạn Yêu Sơn Mạch', 'Xích Diễm Hổ', 'Bạo Nộ Cuồng Hùng']
    },
    core_yeu_dan_3: {
      id: 'core_yeu_dan_3', name: 'Yêu Đan Tam Giai', type: 'monster_mat', icon: '🟡',
      desc: 'Nội đan Kim Đan Kỳ tỏa kim quang rực rỡ. Dùng luyện Kim Đan Hóa Thần Hoàn và Thiên Nhãn Phù.',
      price: 450,
      howToGet: '⚔️ Rớt khi diệt Cổ Kiếm Khôi Lỗi, Tàn Hồn Kiếm Tiên, U Hồn Tà Tu (Cổ Kiếm Bí Cảnh)',
      sources: ['Cổ Kiếm Bí Cảnh', 'Cổ Kiếm Khôi Lỗi', 'Tàn Hồn Kiếm Tiên']
    },
    core_yeu_dan_4: {
      id: 'core_yeu_dan_4', name: 'Yêu Đan Tứ Giai', type: 'monster_mat', icon: '🟣',
      desc: 'Huyết đan Nguyên Anh ngưng tụ sát khí cuồn cuộn. Nguyên liệu thượng thừa luyện Ngưng Anh Đan.',
      price: 1500,
      howToGet: '⚔️ Rớt khi diệt Huyết Ma Trưởng Lão, Sát Lục Ma Tướng, Huyết Nguyệt Yêu Vương (Huyết Sát Ma Vực)',
      sources: ['Huyết Sát Ma Vực', 'Huyết Ma Trưởng Lão', 'Huyết Nguyệt Yêu Vương']
    },
    core_yeu_dan_5: {
      id: 'core_yeu_dan_5', name: 'Thái Cổ Thần Hạch', type: 'monster_mat', icon: '🌟',
      desc: 'Tinh hạch chí tôn của thần thú viễn cổ, chứa đựng pháp tắc càn khôn. Dùng luyện Hóa Thần Đan.',
      price: 6000,
      howToGet: '👑 Tiêu diệt Boss Thái Cổ Bích Giao Long, Vạn Niên Hủ Mộc, Thạch Hoàng (Thượng Cổ Vực Thẳm)',
      sources: ['Thượng Cổ Vực Thẳm', 'Thái Cổ Bích Giao Long', 'Hỗn Độn Thạch Hoàng']
    },
    mat_lang_nanh: {
      id: 'mat_lang_nanh', name: 'U Minh Lang Nanh', type: 'monster_mat', icon: '🐺',
      desc: 'Nanh vuốt bén ngót của yêu lang hoang dã. Dùng rèn Thanh Phong Kiếm và chế tiễn ti.',
      price: 25,
      howToGet: '⚔️ Rớt từ U Minh Yêu Lang tại Linh Sơn Ngoại Vi',
      sources: ['Linh Sơn Ngoại Vi', 'U Minh Yêu Lang']
    },
    mat_tru_nha: {
      id: 'mat_tru_nha', name: 'Cương Nha Trư Nha', type: 'monster_mat', icon: '🐗',
      desc: 'Cặp nanh lợn rừng đen cứng như thép rèn. Dùng gia cố giáp trụ Huyền Thiết sơ cấp.',
      price: 30,
      howToGet: '⚔️ Rớt từ Cương Nha Hắc Trư tại Linh Sơn Ngoại Vi',
      sources: ['Linh Sơn Ngoại Vi', 'Cương Nha Hắc Trư']
    },
    mat_xa_noc: {
      id: 'mat_xa_noc', name: 'Lục Hoa Xà Nọc', type: 'monster_mat', icon: '🧪',
      desc: 'Nọc độc lục sắc kịch độc, dùng chế thuốc độc ám khí hoặc luyện Thanh Tâm Ngưng Thần Đan.',
      price: 30,
      howToGet: '⚔️ Rớt từ Lục Hoa Độc Xà tại Linh Sơn Ngoại Vi',
      sources: ['Linh Sơn Ngoại Vi', 'Lục Hoa Độc Xà']
    },
    mat_ho_bi: {
      id: 'mat_ho_bi', name: 'Xích Diễm Hổ Bì', type: 'monster_mat', icon: '🐅',
      desc: 'Tấm da hổ rực lửa bất xâm thủy hỏa. Dùng may Tinh Vân Đạo Bào và luyện Bạo Khí Cuồng Đan.',
      price: 100,
      howToGet: '⚔️ Rớt từ Xích Diễm Hổ tại Vạn Yêu Sơn Mạch',
      sources: ['Vạn Yêu Sơn Mạch', 'Xích Diễm Hổ']
    },
    mat_hung_dam: {
      id: 'mat_hung_dam', name: 'Cuồng Hùng Huyết Đảm', type: 'monster_mat', icon: '🐻',
      desc: 'Mật gấu cuồng bạo chứa đầy tinh huyết, dùng luyện thuốc cường hóa gân cốt và thể phách.',
      price: 120,
      howToGet: '⚔️ Rớt từ Bạo Nộ Cuồng Hùng tại Vạn Yêu Sơn Mạch',
      sources: ['Vạn Yêu Sơn Mạch', 'Bạo Nộ Cuồng Hùng']
    },
    mat_dieu_vu: {
      id: 'mat_dieu_vu', name: 'Huyết Dực Điêu Vũ', type: 'monster_mat', icon: '🪶',
      desc: 'Lông vũ thần điêu sắc nhọn như dao cạo, dùng chế tạo Thần Hành Phù và Ẩn Thân Phù.',
      price: 130,
      howToGet: '⚔️ Rớt từ Huyết Dực Thần Điêu tại Vạn Yêu Sơn Mạch',
      sources: ['Vạn Yêu Sơn Mạch', 'Huyết Dực Thần Điêu']
    },
    mat_giao_lan: {
      id: 'mat_giao_lan', name: 'Bích Giao Long Lân', type: 'monster_mat', icon: '🐉',
      desc: 'Vảy rồng lấp lánh lam quang, đao thương bất nhập, thủy hỏa bất hoại. Dùng chế Long Lân Bảo Giáp.',
      price: 1800,
      howToGet: '👑 Rớt từ Boss Thái Cổ Bích Giao Long tại Thượng Cổ Vực Thẳm',
      sources: ['Thượng Cổ Vực Thẳm', 'Thái Cổ Bích Giao Long']
    },
    mat_hu_moc: {
      id: 'mat_hu_moc', name: 'Vạn Niên Mộc Tâm', type: 'monster_mat', icon: '🪵',
      desc: 'Lõi cây vạn năm hấp thu tinh hoa nhật nguyệt, chứa đựng sức sống vô tận kéo dài thọ nguyên.',
      price: 2200,
      howToGet: '👑 Rớt từ Vạn Niên Hủ Mộc Yêu Vương tại Thượng Cổ Vực Thẳm',
      sources: ['Thượng Cổ Vực Thẳm', 'Vạn Niên Hủ Mộc']
    },

    // ==========================================
    // 4. VẬT PHẨM SỬ DỤNG: ĐAN DƯỢC
    // ==========================================
    pill_hoixuan: {
      id: 'pill_hoixuan', name: 'Hồi Xuân Đan', type: 'pill', icon: '💚', healPercent: 0.5,
      desc: 'Lập tức hồi phục 50% Khí Huyết (HP) tối đa.',
      price: 40,
      howToGet: '🧪 Luyện đan tại Động Phủ (2 Linh Chi Thảo) | 🏪 Phường Thị (40 Linh Thạch) | 🏯 Tông Môn',
      sources: ['Động Phủ Luyện Đan', 'Phường Thị', 'Tông Môn']
    },
    pill_tulinh: {
      id: 'pill_tulinh', name: 'Tụ Linh Đan', type: 'pill', icon: '💙', mpPercent: 0.6,
      desc: 'Lập tức hồi phục 60% Linh Lực (MP) tối đa.',
      price: 50,
      howToGet: '🧪 Luyện đan tại Động Phủ (2 Thanh U Thảo) | 🏪 Phường Thị (50 Linh Thạch)',
      sources: ['Động Phủ Luyện Đan', 'Phường Thị']
    },
    pill_tukhi: {
      id: 'pill_tukhi', name: 'Tụ Khí Đan', type: 'pill', icon: '💊', expGain: 350,
      desc: 'Uống vào tăng trực tiếp 350 điểm Tu Vi (hưởng thêm hệ số Ngộ Tính).',
      price: 80,
      howToGet: '🧪 Luyện đan (2 Linh Chi + 1 Thanh U + 1 Huyền Thiết) | 🏪 Phường Thị | 🎁 Điểm Danh',
      sources: ['Động Phủ Luyện Đan', 'Phường Thị', 'Điểm Danh']
    },
    pill_bao_khi: {
      id: 'pill_bao_khi', name: 'Bạo Khí Cuồng Đan', type: 'pill', icon: '💥', atkBuff: 0.35,
      desc: 'Bộc phát tiềm năng đan điền, tăng 35% Công Kích trong 5 hiệp đấu kế tiếp.',
      price: 150,
      howToGet: '🧪 Luyện đan (2 Hỏa Viêm Thảo + 1 Xích Diễm Hổ Bì) | 🏪 Phường Thị (150 Linh Thạch)',
      sources: ['Động Phủ Luyện Đan', 'Phường Thị', 'Xích Diễm Hổ']
    },
    pill_ngung_than: {
      id: 'pill_ngung_than', name: 'Thanh Tâm Ngưng Thần Đan', type: 'pill', icon: '🧘', cleanseDebuff: true, healPercent: 0.25,
      desc: 'Xua tan tà khí, hóa giải lập tức toàn bộ hiệu ứng xấu (Độc, Lửa, Xuất Huyết, Tê Liệt) và hồi 25% HP.',
      price: 120,
      howToGet: '🧪 Luyện đan (2 Thanh U Thảo + 1 U Hồn Thảo + 1 Lục Hoa Xà Nọc) | 🏪 Phường Thị',
      sources: ['Động Phủ Luyện Đan', 'Phường Thị']
    },
    pill_quy_nguyen: {
      id: 'pill_quy_nguyen', name: 'Ngũ Hành Quy Nguyên Đan', type: 'pill', icon: '🌀', healPercent: 1.0, mpPercent: 1.0,
      desc: 'Linh dược bảo mệnh cực phẩm, lập tức hồi phục đầy 100% Khí Huyết và 100% Linh Lực.',
      price: 800,
      howToGet: '🧪 Luyện đan (2 Bách Niên Dược + 1 Long Huyết Thảo + 1 Yêu Đan Tam Giai) | 📦 Rương Bí Cảnh',
      sources: ['Động Phủ Luyện Đan', 'Rương Bí Cảnh', 'Boss Thế Giới']
    },
    pill_tay_tuy: {
      id: 'pill_tay_tuy', name: 'Cửu Khiếu Tẩy Tủy Đan', type: 'pill', icon: '🧬', compGain: 3, fullHeal: true,
      desc: 'Tẩy rửa kinh mạch, tẩy bỏ phàm cốt: Hồi phục 100% HP, MP và tăng vĩnh viễn +3% Ngộ Tính!',
      price: 2500,
      howToGet: '🧪 Luyện đan Thượng phẩm | 🏯 Đổi tại Tông Môn (800 Cống Hiến) | 📦 Rương Bí Cảnh Boss',
      sources: ['Động Phủ Luyện Đan', 'Tông Môn', 'Rương Bí Cảnh']
    },
    pill_trucco: {
      id: 'pill_trucco', name: 'Trúc Cơ Đan', type: 'pill', icon: '🧱', isBreakthrough: true, breakBonus: 0.35,
      desc: 'Bảo vật đột phá Trúc Cơ Kỳ, tăng 35% tỷ lệ đột phá thành công khi sử dụng.',
      price: 300,
      howToGet: '🧪 Luyện đan (4 Thanh U + 2 Hỏa Viêm + 1 Tử Tinh Khoáng) | 🎁 Thưởng thăng Ngoại Môn Đệ Tử | 📦 Mở Rương Bí Cảnh',
      sources: ['Động Phủ Luyện Đan', 'Tông Môn', 'Rương Bí Cảnh']
    },
    pill_kimdan: {
      id: 'pill_kimdan', name: 'Kim Đan Hóa Thần Hoàn', type: 'pill', icon: '🌕', isBreakthrough: true, breakBonus: 0.30,
      desc: 'Tăng 30% tỷ lệ đột phá Kim Đan Kỳ thành công.',
      price: 1000,
      howToGet: '🧪 Luyện đan (3 Hỏa Viêm + 2 Bách Niên + 2 Tử Tinh Khoáng) | 🎁 Thưởng Chân Truyền Đệ Tử | 📦 Rương Cổ',
      sources: ['Động Phủ Luyện Đan', 'Tông Môn', 'Rương Bí Cảnh']
    },
    pill_ngungan: {
      id: 'pill_ngungan', name: 'Ngưng Anh Đan', type: 'pill', icon: '👶', isBreakthrough: true, breakBonus: 0.25,
      desc: 'Phá đan thành anh, tăng 25% tỷ lệ đột phá Nguyên Anh Kỳ.',
      price: 3500,
      howToGet: '🧪 Luyện đan (3 Long Huyết + 1 Cửu Chuyển + 2 Thiên Ngoại Vẫn Thiết) | 🏯 Trưởng Lão Tông Môn',
      sources: ['Động Phủ Luyện Đan', 'Tông Môn', 'Rương Bí Cảnh']
    },
    pill_hoathan: {
      id: 'pill_hoathan', name: 'Hóa Thần Đan', type: 'pill', icon: '🌌', isBreakthrough: true, breakBonus: 0.20,
      desc: 'Tăng 20% tỷ lệ đột phá Hóa Thần Kỳ.',
      price: 10000,
      howToGet: '🧪 Luyện đan (3 Cửu Chuyển + 1 Thiên Kiếm + 1 Hỗn Độn Thần Thiết) | 👑 Diệt Boss Thần Thú',
      sources: ['Động Phủ Luyện Đan', 'Boss Thế Giới']
    },
    pill_huthien: {
      id: 'pill_huthien', name: 'Hư Thiên Đan', type: 'pill', icon: '🕳️', isBreakthrough: true, breakBonus: 0.20,
      desc: 'Tăng 20% tỷ lệ đột phá Luyện Hư Kỳ.',
      price: 25000,
      howToGet: '📦 Rương Thiên Cơ Chí Bảo | 👑 Bí cảnh tầng 5 Boss rơi',
      sources: ['Rương Thiên Cơ', 'Boss Bí Cảnh']
    },
    pill_hopnguyen: {
      id: 'pill_hopnguyen', name: 'Hợp Nguyên Đan', type: 'pill', icon: '☯️', isBreakthrough: true, breakBonus: 0.18,
      desc: 'Tăng 18% tỷ lệ đột phá Hợp Thể Kỳ.',
      price: 60000,
      howToGet: '📦 Rương Thiên Cơ Chí Bảo | 👑 Kỳ Ngộ Thần Tiên',
      sources: ['Rương Thiên Cơ', 'Kỳ Ngộ']
    },
    pill_cankhon: {
      id: 'pill_cankhon', name: 'Càn Khôn Đan', type: 'pill', icon: '🪐', isBreakthrough: true, breakBonus: 0.15,
      desc: 'Tăng 15% tỷ lệ đột phá Đại Thừa Kỳ.',
      price: 150000,
      howToGet: '👑 Bí Cảnh Cực Hạn | 🌀 Kim Thủ Chỉ Thần Cấp',
      sources: ['Boss Bí Cảnh', 'Kim Thủ Chỉ']
    },
    pill_dokiep: {
      id: 'pill_dokiep', name: 'Cửu Thiên Độ Kiếp Đan', type: 'pill', icon: '🌩️', isBreakthrough: true, breakBonus: 0.15,
      desc: 'Tăng 15% tỷ lệ đột phá Độ Kiếp Kỳ phi thăng tiên giới.',
      price: 400000,
      howToGet: '👑 Đỉnh Phong Thiên Đạo | 📦 Thiên Cơ Chí Bảo Hạp',
      sources: ['Rương Thiên Cơ', 'Thiên Đạo']
    },
    pill_daotam: {
      id: 'pill_daotam', name: 'Đạo Tâm Đan', type: 'pill', icon: '🤍', breakBonus: 0.20,
      desc: 'Thanh tẩy tâm ma, tăng thêm 20% tỷ lệ đột phá cho mọi cảnh giới.',
      price: 800,
      howToGet: '🧪 Luyện đan (3 Bách Niên + 1 Long Huyết + 1 Vẫn Thiết) | 🏪 Phường Thị (800 Linh Thạch)',
      sources: ['Động Phủ Luyện Đan', 'Phường Thị']
    },
    pill_tho_nguyen: {
      id: 'pill_tho_nguyen', name: 'Cửu Chuyển Thọ Nguyên Đan', type: 'pill', icon: '⏳', lifespanGain: 50,
      desc: 'Tăng thêm 50 năm thọ nguyên cho nhân vật.',
      price: 1500,
      howToGet: '🧪 Luyện đan (2 Bách Niên + 1 Cửu Chuyển + 2 Tử Tinh Khoáng) | 🎁 Điểm Danh Kim Thủ Chỉ',
      sources: ['Động Phủ Luyện Đan', 'Kim Thủ Chỉ']
    },

    // ==========================================
    // 5. VẬT PHẨM SỬ DỤNG: BÙA CHÚ CHIẾN ĐẤU & KỲ MÔN
    // ==========================================
    talisman_don_dia: {
      id: 'talisman_don_dia', name: 'Độn Địa Phù', type: 'talisman', icon: '💨',
      desc: 'Phù triện cổ truyền ngưng tụ thổ độn thuật. Trong chiến đấu đào thoát 100% không mất mát; ngoài chiến đấu hồi 30% HP & MP về động phủ.',
      price: 120,
      howToGet: '🏪 Mua tại Phường Thị (120 Linh Thạch) | 🏯 Đổi tại Tông Môn (40 Cống Hiến) | 🧪 Luyện Phù',
      sources: ['Phường Thị', 'Tông Môn', 'Rương Trữ Vật']
    },
    talisman_kim_cuong: {
      id: 'talisman_kim_cuong', name: 'Kim Cương Hộ Thể Phù', type: 'talisman', icon: '🛡️', shieldAmount: 800,
      desc: 'Hóa thành kim quang lộng lẫy, tạo Hộ Thuẫn hấp thu 800 sát thương trong trận đấu (hoặc hồi 40% HP ngoài map).',
      price: 180,
      howToGet: '🏪 Mua tại Phường Thị (180 Linh Thạch) | 🏯 Tông Môn Đan Đỉnh | 📦 Rương Bí Cảnh',
      sources: ['Phường Thị', 'Tông Môn', 'Rương Bí Cảnh']
    },
    talisman_dan_loi: {
      id: 'talisman_dan_loi', name: 'Cửu Thiên Dẫn Lôi Phù', type: 'talisman', icon: '⚡', dmg: 1500, stunChance: 0.6,
      desc: 'Triệu hoán Cửu Thiên Thần Lôi oanh kích, gây 1500 sát thương Lôi và 60% làm Tê Liệt (Stun) đối thủ 1 hiệp.',
      price: 250,
      howToGet: '⚔️ Rớt từ Huyết Dực Thần Điêu | 🏪 Phường Thị (250 Linh Thạch) | 📦 Rương Bí Cảnh',
      sources: ['Vạn Yêu Sơn Mạch', 'Huyết Dực Thần Điêu', 'Phường Thị']
    },
    talisman_liet_hoa: {
      id: 'talisman_liet_hoa', name: 'Tam Muội Chân Hỏa Phù', type: 'talisman', icon: '🔥', dmg: 1200, burnTurns: 3,
      desc: 'Phóng chân hỏa thiêu rụi mục tiêu, gây 1200 sát thương và thiêu đốt (Burn) đối thủ 3 hiệp liên tiếp.',
      price: 220,
      howToGet: '⚔️ Rớt từ Xích Diễm Hổ | 🏪 Phường Thị | 🏯 Tông Môn Đan Đỉnh',
      sources: ['Vạn Yêu Sơn Mạch', 'Xích Diễm Hổ', 'Phường Thị']
    },
    talisman_bang_phong: {
      id: 'talisman_bang_phong', name: 'Hàn Băng Phong Ma Phù', type: 'talisman', icon: '🧊', dmg: 800, freezeTurn: 1,
      desc: 'Ngưng kết hàn khí cực độ, gây 800 sát thương Băng, Đóng Băng đối thủ 1 hiệp và trừ 50% thanh tốc độ hành động!',
      price: 240,
      howToGet: '🧪 Luyện Phù (1 Huyền Băng + 1 Thanh Đồng + 1 Yêu Đan Nhị Giai) | 🏪 Phường Thị',
      sources: ['Động Phủ Luyện Đan', 'Phường Thị']
    },
    talisman_than_hanh: {
      id: 'talisman_than_hanh', name: 'Thần Hành Biến Ảo Phù', type: 'talisman', icon: '🌪️', speedBuff: 0.5, dodgeBuff: 0.3,
      desc: 'Trong trận tăng 50% Thân Pháp & 30% Né Đòn trong 4 hiệp; ngoài map tăng vĩnh viễn +5 Thân Pháp!',
      price: 160,
      howToGet: '🏪 Mua tại Phường Thị (160 Linh Thạch) | 🌿 Kỳ ngộ Bí Cảnh | 📦 Rương Trữ Vật',
      sources: ['Phường Thị', 'Kỳ Ngộ']
    },
    talisman_an_than: {
      id: 'talisman_an_than', name: 'Hư Không Ẩn Thân Phù', type: 'talisman', icon: '👻', dodgeBuff: 1.0,
      desc: 'Hòa mình vào hư không, nhận 100% Né Đòn trong 2 hiệp đấu; ngoài map giúp chuyến du ngoạn kế tiếp 100% gặp kỳ ngộ!',
      price: 200,
      howToGet: '🧪 Luyện Phù (1 U Hồn + 1 Huyền Thiết + 1 Thần Điêu Lông Vũ) | 🏪 Phường Thị',
      sources: ['Động Phủ Luyện Đan', 'Phường Thị']
    },
    talisman_thien_nhan: {
      id: 'talisman_thien_nhan', name: 'Thiên Nhãn Phá Giáp Phù', type: 'talisman', icon: '👁️', critBonus: 0.35,
      desc: 'Khai mở thiên nhãn nhìn thấu tử huyệt: Đòn tấn công kế tiếp nhận +35% Bạo Kích và Bỏ qua 100% Giáp đối thủ!',
      price: 300,
      howToGet: '🧪 Luyện Phù (1 Thiên Kiếm Thảo + 1 Tử Tinh + 1 Yêu Đan Tam Giai) | 🏯 Tông Môn',
      sources: ['Động Phủ Luyện Đan', 'Tông Môn']
    },

    // ==========================================
    // 6. LINH TRÀ, RƯƠNG BẢO, TÀNG BẢO ĐỒ & THẦN THÚ
    // ==========================================
    tea_ngo_dao: {
      id: 'tea_ngo_dao', name: 'Ngộ Đạo Cổ Trà', type: 'tea', icon: '🍵', teaDuration: 60,
      desc: 'Nhấp một ngụm trà tiên, tâm cảnh đạt Thiên Nhân Hợp Nhất: Tăng gấp đôi (+100%) tốc độ tích lũy Tu Vi trong 60 giây!',
      price: 350,
      howToGet: '🍵 Pha chế từ Ngộ Đạo Cổ Trà Diệp | 🍵 Kỳ Ngộ Trà Tiên | 🏪 Phường Thị',
      sources: ['Thượng Cổ Vực Thẳm', 'Kỳ Ngộ', 'Phường Thị']
    },
    chest_tu_tru_vat: {
      id: 'chest_tu_tru_vat', name: 'Túi Trữ Vật Vô Chủ', type: 'chest', icon: '🎒',
      desc: 'Túi gấm càn khôn của tu sĩ bỏ mạng nơi hoang dã. Mở ra nhận 50 - 200 Linh Thạch và 1-3 nguyên liệu ngẫu nhiên.',
      price: 100,
      howToGet: '⚔️ Rớt khi diệt Yêu thú (Lang, Trư, Xà) | 🧭 Du ngoạn lịch luyện',
      sources: ['Linh Sơn Ngoại Vi', 'Vạn Yêu Sơn Mạch', 'Trảm Quái']
    },
    chest_bi_canh: {
      id: 'chest_bi_canh', name: 'Bảo Rương Bí Cảnh Cổ Đại', type: 'chest', icon: '📦',
      desc: 'Rương cổ bọc đồng trong di tích. Mở ra nhận 300 - 800 Linh Thạch, đan dược quý và trang bị Huyền Giai.',
      price: 450,
      howToGet: '🧭 Vượt phòng Bảo Rương trong Bí Cảnh Roguelike | ⚔️ Diệt Tinh Anh Quái Bí Cảnh',
      sources: ['Bí Cảnh Roguelike', 'Tinh Anh Quái']
    },
    chest_thien_co: {
      id: 'chest_thien_co', name: 'Thiên Cơ Chí Bảo Hạp', type: 'chest', icon: '🎁',
      desc: 'Hộp ngọc cửu sắc phong ấn. Mở ra nhận 1500 - 4000 Linh Thạch, Đan Dược Đột Phá hoặc Pháp Bảo Thiên Giai!',
      price: 2000,
      howToGet: '👑 Tiêu diệt Boss Thượng Cổ Vực Thẳm | 🌀 Kim Thủ Chỉ Điểm Danh Năm thứ 20',
      sources: ['Boss Thế Giới', 'Kim Thủ Chỉ']
    },
    map_tang_bao: {
      id: 'map_tang_bao', name: 'Tàng Bảo Đồ Thượng Cổ', type: 'treasure_map', icon: '🗺️',
      desc: 'Cổ đồ da cừu ghi dấu lối vào Tiên Phủ Cổ Xưa. Mở ra lập tức khai quật 500-1500 Linh Thạch, dược thảo quý và rương báu!',
      price: 600,
      howToGet: '⚔️ Rớt từ Tinh Anh / Boss Bí Cảnh & Thế Giới | 🏪 Phường Thị (600 Linh Thạch)',
      sources: ['Bí Cảnh Roguelike', 'Phường Thị', 'Boss Thế Giới']
    },
    tome_cong_phap_tan_thien: {
      id: 'tome_cong_phap_tan_thien', name: 'Thái Cổ Kiếm Ý Tàn Quyển', type: 'secret_tome', icon: '📜',
      desc: 'Mảnh da dê ghi chép kiếm ý tàn thiên viễn cổ. Tham ngộ tăng vĩnh viễn +15 Công Kích và +5 Thân Pháp!',
      price: 1800,
      howToGet: '📦 Rương Bí Cảnh Cổ Đại | 🏯 Đổi tại Tàng Kinh Các Tông Môn | 👑 Boss Thế Giới',
      sources: ['Rương Bí Cảnh', 'Tông Môn', 'Boss Thế Giới']
    },
    pet_linh_thu_noan: {
      id: 'pet_linh_thu_noan', name: 'Thái Cổ Linh Thú Noãn', type: 'pet_egg', icon: '🥚',
      desc: 'Trứng thần thú thái cổ phong ấn linh khí. Truyền 100 Linh Lực để ấp nở Linh Thú Hộ Mệnh đồng hành và trợ chiến!',
      price: 2500,
      howToGet: '📦 Rương Bí Cảnh Tầng 5 | 👑 Thái Cổ Bích Giao Long | 🌀 Kim Thủ Chỉ',
      sources: ['Rương Bí Cảnh', 'Boss Thế Giới', 'Kim Thủ Chỉ']
    },

    // ==========================================
    // 7. TRANG BỊ: VŨ KHÍ (CÓ ĐẶC TÍNH & THỐI LUYỆN)
    // ==========================================
    wpn_thanhphong: {
      id: 'wpn_thanhphong', name: 'Thanh Phong Kiếm', type: 'weapon', icon: '🗡️', atk: 45, crit: 0.05,
      trait: 'Ngự Phong: Tăng +15% Thân Pháp và +5% Né đòn khi lâm trận',
      desc: 'Kiếm sắc bén gió lướt, rèn từ Huyền Thiết và nanh vuốt yêu thú.',
      price: 150,
      howToGet: '🔨 Rèn tại Lò Rèn Động Phủ (4 Huyền Thiết Tinh + 2 Thanh U Thảo) | 🏪 Phường Thị (150 Linh Thạch)',
      sources: ['Lò Rèn Động Phủ', 'Phường Thị']
    },
    wpn_xichtieu: {
      id: 'wpn_xichtieu', name: 'Xích Tiêu Kiếm', type: 'weapon', icon: '⚔️', atk: 260, crit: 0.1,
      trait: 'Liệt Diễm: Đòn đánh 35% gây Thiêu Đốt thiêu rụi kinh mạch đối thủ',
      desc: 'Thân kiếm đỏ rực như lửa, chém ra kiếm khí thiêu rụi kinh mạch đối phương.',
      price: 1200,
      howToGet: '🔨 Rèn tại Lò Rèn (4 Tử Tinh Khoáng + 3 Hỏa Viêm Thảo) | 📦 Mở Rương Bí Cảnh Cổ',
      sources: ['Lò Rèn Động Phủ', 'Rương Bí Cảnh']
    },
    wpn_tramyeu: {
      id: 'wpn_tramyeu', name: 'Trảm Yêu Cự Kiếm', type: 'weapon', icon: '🪓', atk: 1200, crit: 0.15,
      trait: 'Trảm Yêu: Tăng +30% sát thương lên yêu quái, 20% gây Chảy Máu',
      desc: 'Bảo kiếm trảm sát ngàn yêu ma, sát khí ngút trời khiến yêu tà khiếp vía.',
      price: 5000,
      howToGet: '🔨 Rèn tại Lò Rèn (4 Thiên Ngoại Vẫn Thiết + 3 Long Huyết Thảo) | 🏯 Tàng Bảo Các Tông Môn',
      sources: ['Lò Rèn Động Phủ', 'Tông Môn']
    },
    wpn_tienkiem: {
      id: 'wpn_tienkiem', name: 'Bát Hoang Tiên Kiếm', type: 'weapon', icon: '🔱', atk: 8500, crit: 0.25,
      trait: 'Thiên Kiếm: Bộc phát Kiếm Khí Tiên Thiên, x2.5 sát thương Bạo Kích',
      desc: 'Tiên kiếm thượng cổ vô địch, một kiếm trảm toái hư không càn khôn.',
      price: 30000,
      howToGet: '🔨 Rèn Thần Khí (4 Hỗn Độn Thần Thiết + 2 Thái Ất Chân Kim) | 📦 Thiên Cơ Chí Bảo Hạp',
      sources: ['Lò Rèn Động Phủ', 'Rương Thiên Cơ']
    },

    // ==========================================
    // 8. TRANG BỊ: HỘ GIÁP (CÓ ĐẶC TÍNH & THỐI LUYỆN)
    // ==========================================
    arm_huyenthiet: {
      id: 'arm_huyenthiet', name: 'Huyền Thiết Giáp', type: 'armor', icon: '🥋', hp: 200, def: 35,
      trait: 'Thiết Bích: Hóa giải giảm bớt 20 sát thương từ mọi đòn đánh',
      desc: 'Giáp sắt bền bỉ che chắn yếu huyệt, phòng ngự vững chắc trước móng vuốt dã thú.',
      price: 150,
      howToGet: '🔨 Rèn tại Lò Rèn (4 Huyền Thiết Tinh + 2 Nanh Trư) | 🏪 Phường Thị (150 Linh Thạch)',
      sources: ['Lò Rèn Động Phủ', 'Phường Thị']
    },
    arm_tinhvan: {
      id: 'arm_tinhvan', name: 'Tinh Vân Đạo Bào', type: 'armor', icon: '👘', hp: 1200, def: 180,
      trait: 'Tinh Thần: Mỗi hiệp hồi phục 4% Khí Huyết, giảm 15% ST Pháp thuật',
      desc: 'Dệt từ mây tía tinh tú ngàn năm kết hợp Xích Diễm Hổ Bì, giảm thiểu sát thương pháp thuật.',
      price: 1200,
      howToGet: '🔨 Rèn tại Lò Rèn (3 Tử Tinh Khoáng + 3 Bách Niên Dược + 2 Da Hổ) | 📦 Rương Bí Cảnh',
      sources: ['Lò Rèn Động Phủ', 'Rương Bí Cảnh']
    },
    arm_longlan: {
      id: 'arm_longlan', name: 'Long Lân Bảo Giáp', type: 'armor', icon: '🦺', hp: 6000, def: 850,
      trait: 'Chân Long: Phản chấn 25% sát thương nhận lại cho kẻ tấn công',
      desc: 'Vảy rồng cổ đại kết thành hộ giáp, đao thương bất nhập, thủy hỏa bất hoại.',
      price: 6000,
      howToGet: '🔨 Rèn tại Lò Rèn (4 Thiên Ngoại Vẫn Thiết + 3 Long Lân Bích Giao) | 👑 Boss Thế Giới',
      sources: ['Lò Rèn Động Phủ', 'Thái Cổ Bích Giao Long']
    },
    arm_hondon: {
      id: 'arm_hondon', name: 'Hỗn Độn Tiên Y', type: 'armor', icon: '🥼', hp: 35000, def: 4500,
      trait: 'Hỗn Độn Bất Diệt: Khi máu < 30%, bùng nổ Hộ Thuẫn 2000 điểm',
      desc: 'Đạo y bất hoại chống đỡ cửu thiên thần lôi kiếp số, thần thông bất diệt.',
      price: 40000,
      howToGet: '🔨 Rèn Thần Giáp (4 Hỗn Độn Thần Thiết + 3 Thần Hạch) | 📦 Thiên Cơ Chí Bảo Hạp',
      sources: ['Lò Rèn Động Phủ', 'Rương Thiên Cơ']
    },

    // ==========================================
    // 9. TRANG BỊ: PHÁP BẢO (CÓ ĐẶC TÍNH & THỐI LUYỆN)
    // ==========================================
    art_guong: {
      id: 'art_guong', name: 'Bát Quái Hộ Tâm Kính', type: 'artifact', icon: '🪞', hp: 300, def: 50, mp: 100,
      trait: 'Hộ Tâm Quang: Tăng 10% Kháng Bạo Kích, phản xạ ma khí',
      desc: 'Gương đồng hộ tâm soi tỏ tà ma, phản xạ một phần sát thương của yêu thú.',
      price: 300,
      howToGet: '🔨 Rèn Pháp Bảo (3 Thanh Đồng Cổ Tinh + 1 Huyền Thiết) | 🏪 Phường Thị (300 Linh Thạch)',
      sources: ['Lò Rèn Động Phủ', 'Phường Thị']
    },
    art_chuoi: {
      id: 'art_chuoi', name: 'Bồ Đề Chuỗi Hạt', type: 'artifact', icon: '📿', mp: 500, atk: 120,
      trait: 'Bồ Đề Tĩnh Tâm: Tăng 20% Tốc độ tu vi khi thiền định, hồi 10% MP sau chiến thắng',
      desc: 'Hạt bồ đề tĩnh tâm ngưng thần, uẩn dưỡng đan điền dồi dào linh lực.',
      price: 1500,
      howToGet: '🏯 Đổi tại Tàng Kinh Các Tông Môn | 📦 Rương Bí Cảnh Cổ Đại',
      sources: ['Tông Môn', 'Rương Bí Cảnh']
    },
    art_dinh: {
      id: 'art_dinh', name: 'Sơn Hà Xã Tắc Đỉnh', type: 'artifact', icon: '🏺', hp: 8000, atk: 1500, def: 600,
      trait: 'Sơn Hà Trấn Khí: Kích hoạt gây choáng kẻ địch 1 hiệp và tăng 50% Giáp',
      desc: 'Thu nhỏ cảnh giới núi sông trấn áp càn khôn vạn dặm.',
      price: 12000,
      howToGet: '👑 Tiêu diệt Boss Thượng Cổ Vực Thẳm | 📦 Thiên Cơ Chí Bảo Hạp',
      sources: ['Boss Thế Giới', 'Rương Thiên Cơ']
    }
  };

  // Khởi tạo icon pixel art tự vẽ (Custom Drawn 12x12 Pixel Sprite) cho toàn bộ 73 vật phẩm
  Object.keys(ITEMS).forEach(k => {
    ITEMS[k].emoji = ITEMS[k].icon;
    ITEMS[k].icon = getItemPixelSvg(k, 20);
  });

  const COMPANIONS = {
    pet_thunder: {
      id: 'pet_thunder',
      name: 'Lôi Tích Thú',
      icon: '⚡',
      type: 'thunder',
      desc: 'Linh thú thần lôi thái cổ, trong chiến đấu giáng sấm sét gây sát thương sấm sét cuồng bạo.',
      combatProc: 'Lôi Đình Nhất Kích',
      bonusStats: { atk: 35, crit: 0.05, spd: 3 }
    },
    pet_fire: {
      id: 'pet_fire',
      name: 'Xích Diễm Hỏa Hồ',
      icon: '🔥',
      type: 'fire',
      desc: 'Linh hồ cửu vĩ thai nghén từ chân hỏa, phóng hỏa thiêu đốt địch thủ liên tục.',
      combatProc: 'Liệt Diễm Thiêu Hồn',
      bonusStats: { atk: 45, spd: 2 }
    },
    pet_turtle: {
      id: 'pet_turtle',
      name: 'Huyền Vũ Ấu Quy',
      icon: '🛡️',
      type: 'turtle',
      desc: 'Huyết mạch thần thú Huyền Vũ, tạo hộ thuẫn bảo hộ chủ nhân khi vào trận.',
      combatProc: 'Huyền Quy Hộ Thể',
      bonusStats: { def: 60, hp: 500 }
    },
    pet_rabbit: {
      id: 'pet_rabbit',
      name: 'Bích Ngọc Tiên Thỏ',
      icon: '🌸',
      type: 'rabbit',
      desc: 'Tiên thỏ ngậm tiên thảo tại cung trăng, trị liệu sinh cơ và tăng tốc độ tu vi.',
      combatProc: 'Ngọc Thỏ Trị Liệu',
      bonusStats: { hp: 300, mp: 100, spd: 5 }
    }
  };

  const HERB_ENCYCLOPEDIA = {
    herb_linhchi: {
      id: 'herb_linhchi',
      name: 'Linh Chi Thảo',
      grade: 'Nhất Giai Hạ Phẩm',
      nature: 'Ôn tính, ích khí kiện tỳ',
      reqRealm: 'Luyện Khí Tầng 1',
      regions: ['Linh Sơn Ngoại Vi (Khu vực 1)'],
      recipes: ['Hồi Xuân Đan', 'Tụ Khí Đan'],
      lore: 'Linh thảo sơ cấp hấp thu linh khí sương mai nơi khe núi, tính ôn hòa, là dược liệu nền tảng cho người mới tu tiên.'
    },
    herb_thanh_u: {
      id: 'herb_thanh_u',
      name: 'Thanh U Thảo',
      grade: 'Nhất Giai Trung Phẩm',
      nature: 'Lương tính, thanh tâm an thần',
      reqRealm: 'Luyện Khí Tầng 2',
      regions: ['Linh Sơn Ngoại Vi', 'Vạn Yêu Sơn Mạch'],
      recipes: ['Tụ Linh Đan', 'Trúc Cơ Đan'],
      lore: 'Mọc nơi bóng râm mát mẻ, lá tỏa hương thơm thoang thoảng giúp ngưng tụ linh lực đan điền.'
    },
    herb_hoaviem: {
      id: 'herb_hoaviem',
      name: 'Hỏa Viêm Thảo',
      grade: 'Nhị Giai Trung Phẩm',
      nature: 'Đại nhiệt, thuần dương chân hỏa',
      reqRealm: 'Trúc Cơ Kỳ',
      regions: ['Vạn Yêu Sơn Mạch (Khu vực 2)'],
      recipes: ['Trúc Cơ Đan', 'Kim Đan Hóa Thần Hoàn'],
      lore: 'Hấp thu địa hỏa dưới khe núi lửa mà lớn lên, thân cây đỏ rực như than hồng, chứa đựng hỏa linh khí dồi dào.'
    },
    herb_bachnien: {
      id: 'herb_bachnien',
      name: 'Bách Niên Linh Dược',
      grade: 'Tam Giai Thượng Phẩm',
      nature: 'Trung hòa, uẩn dưỡng kinh mạch',
      reqRealm: 'Kim Đan Kỳ',
      regions: ['Cổ Kiếm Bí Cảnh (Khu vực 3)'],
      recipes: ['Kim Đan Hóa Thần Hoàn', 'Đạo Tâm Đan', 'Cửu Chuyển Thọ Nguyên Đan'],
      lore: 'Cây thuốc sinh trưởng trăm năm giữa linh tuyền cấm địa, tích tụ tinh hoa đất trời, giúp đan điền kết tụ Kim Đan vững chắc.'
    },
    herb_longhuyet: {
      id: 'herb_longhuyet',
      name: 'Long Huyết Thảo',
      grade: 'Tứ Giai Thượng Phẩm',
      nature: 'Cương liệt, tôi luyện tiên cốt',
      reqRealm: 'Nguyên Anh Kỳ',
      regions: ['Huyết Sát Ma Vực (Khu vực 4)'],
      recipes: ['Đạo Tâm Đan', 'Ngưng Anh Đan'],
      lore: 'Tương truyền mọc trên mảnh đất từng có chân long nhỏ máu, cành lá đỏ tươi như ngọc bích, dược lực hung mãnh dị thường.'
    },
    herb_cuuchuyen: {
      id: 'herb_cuuchuyen',
      name: 'Cửu Chuyển Tiên Thảo',
      grade: 'Ngũ Giai Cực Phẩm',
      nature: 'Chí thuần, khai khiếu ngưng anh',
      reqRealm: 'Hóa Thần Kỳ',
      regions: ['Thượng Cổ Vực Thẳm (Khu vực 5)'],
      recipes: ['Ngưng Anh Đan', 'Hóa Thần Đan', 'Cửu Chuyển Thọ Nguyên Đan'],
      lore: 'Trải qua chín lần lột xác mới thành hình, tỏa ra hào quang cửu sắc, có thể giúp tu sĩ cảm ngộ thiên địa pháp tắc.'
    },
    herb_thienkiem: {
      id: 'herb_thienkiem',
      name: 'Thiên Kiếm Thảo',
      grade: 'Lục Giai Thần Phẩm',
      nature: 'Vô kiên bất tồi, sắc bén vô song',
      reqRealm: 'Luyện Hư / Hợp Thể Kỳ',
      regions: ['Thượng Cổ Vực Thẳm'],
      recipes: ['Hóa Thần Đan'],
      lore: 'Hình dáng như một thanh đoản kiếm cắm thẳng vào vách đá càn khôn, quanh thân kiếm khí sắc lạnh vù vù, trảm phá tâm ma.'
    }
  };

  const RECIPES = [
    { id: 'rec_hoixuan', name: 'Hồi Xuân Đan', type: 'alchemy', resultId: 'pill_hoixuan', reqRealmIndex: 0, ingredients: { herb_linhchi: 2 }, successRate: 0.90, desc: 'Cần 2 Linh Chi Thảo. Yêu cầu Luyện Khí Tầng 1.' },
    { id: 'rec_tulinh', name: 'Tụ Linh Đan', type: 'alchemy', resultId: 'pill_tulinh', reqRealmIndex: 1, ingredients: { herb_thanh_u: 2 }, successRate: 0.88, desc: 'Cần 2 Thanh U Thảo. Yêu cầu Luyện Khí Tầng 2.' },
    { id: 'rec_tukhi', name: 'Tụ Khí Đan', type: 'alchemy', resultId: 'pill_tukhi', reqRealmIndex: 2, ingredients: { herb_linhchi: 2, herb_thanh_u: 1, ore_huyenthiet: 1 }, successRate: 0.85, desc: 'Cần 2 Linh Chi Thảo, 1 Thanh U Thảo, 1 Huyền Thiết Tinh. Yêu cầu Luyện Khí Tầng 3.' },
    { id: 'rec_pill_ngung_than', name: 'Thanh Tâm Ngưng Thần Đan', type: 'alchemy', resultId: 'pill_ngung_than', reqRealmIndex: 3, ingredients: { herb_thanh_u: 2, herb_u_hon: 1, mat_xa_noc: 1 }, successRate: 0.85, desc: 'Cần 2 Thanh U Thảo, 1 U Hồn Thảo, 1 Lục Hoa Xà Nọc. Giải sạch mọi tà độc!' },
    { id: 'rec_talisman_don_dia', name: 'Độn Địa Phù', type: 'alchemy', resultId: 'talisman_don_dia', reqRealmIndex: 2, ingredients: { ore_dong_tinh: 1, herb_thanh_u: 2, core_yeu_dan_1: 1 }, successRate: 0.85, desc: 'Cần 1 Thanh Đồng Cổ Tinh, 2 Thanh U Thảo, 1 Yêu Đan Nhất Giai. Thoát hiểm 100%!' },
    { id: 'rec_talisman_kim_cuong', name: 'Kim Cương Hộ Thể Phù', type: 'alchemy', resultId: 'talisman_kim_cuong', reqRealmIndex: 6, ingredients: { ore_dong_tinh: 2, ore_huyenthiet: 2, core_yeu_dan_1: 1 }, successRate: 0.80, desc: 'Cần 2 Thanh Đồng Cổ Tinh, 2 Huyền Thiết, 1 Yêu Đan Nhất Giai. Tạo hộ thuẫn 800 HP.' },
    { id: 'rec_pill_bao_khi', name: 'Bạo Khí Cuồng Đan', type: 'alchemy', resultId: 'pill_bao_khi', reqRealmIndex: 8, ingredients: { herb_hoaviem: 2, mat_ho_bi: 1, core_yeu_dan_2: 1 }, successRate: 0.80, desc: 'Cần 2 Hỏa Viêm Thảo, 1 Xích Diễm Hổ Bì, 1 Yêu Đan Nhị Giai. Tăng 35% Công kích.' },
    { id: 'rec_talisman_dan_loi', name: 'Cửu Thiên Dẫn Lôi Phù', type: 'alchemy', resultId: 'talisman_dan_loi', reqRealmIndex: 10, ingredients: { ore_tutinh: 2, herb_hoaviem: 1, core_yeu_dan_2: 1 }, successRate: 0.75, desc: 'Cần 2 Tử Tinh Khoáng, 1 Hỏa Viêm Thảo, 1 Yêu Đan Nhị Giai. Sét đánh 1500 sát thương.' },
    { id: 'rec_trucco', name: 'Trúc Cơ Đan', type: 'alchemy', resultId: 'pill_trucco', reqRealmIndex: 9, ingredients: { herb_thanh_u: 4, herb_hoaviem: 2, ore_tutinh: 1 }, successRate: 0.70, desc: 'Cần 4 Thanh U Thảo, 2 Hỏa Viêm Thảo, 1 Tử Tinh Khoáng. Yêu cầu Luyện Khí Đỉnh Phong.' },
    { id: 'rec_tea_ngo_dao', name: 'Ngộ Đạo Cổ Trà', type: 'alchemy', resultId: 'tea_ngo_dao', reqRealmIndex: 10, ingredients: { herb_ngo_dao: 1, herb_bachnien: 1 }, successRate: 0.90, desc: 'Cần 1 Ngộ Đạo Cổ Trà Diệp, 1 Bách Niên Dược. Tăng 100% tốc độ tu luyện trong 60 giây.' },
    { id: 'rec_kimdan', name: 'Kim Đan Hóa Thần Hoàn', type: 'alchemy', resultId: 'pill_kimdan', reqRealmIndex: 13, ingredients: { herb_hoaviem: 3, herb_bachnien: 2, ore_tutinh: 2 }, successRate: 0.60, desc: 'Cần 3 Hỏa Viêm Thảo, 2 Bách Niên Linh Dược, 2 Tử Tinh Khoáng. Yêu cầu Trúc Cơ Đỉnh Phong.' },
    { id: 'rec_pill_quy_nguyen', name: 'Ngũ Hành Quy Nguyên Đan', type: 'alchemy', resultId: 'pill_quy_nguyen', reqRealmIndex: 14, ingredients: { herb_bachnien: 2, herb_longhuyet: 1, core_yeu_dan_3: 1 }, successRate: 0.65, desc: 'Cần 2 Bách Niên Dược, 1 Long Huyết Thảo, 1 Yêu Đan Tam Giai. Hồi 100% HP và MP.' },
    { id: 'rec_daotam', name: 'Đạo Tâm Đan', type: 'alchemy', resultId: 'pill_daotam', reqRealmIndex: 14, ingredients: { herb_bachnien: 3, herb_longhuyet: 1, ore_thienngoai: 1 }, successRate: 0.65, desc: 'Cần 3 Bách Niên Linh Dược, 1 Long Huyết Thảo, 1 Thiên Ngoại Vẫn Thiết. Yêu cầu Kim Đan Kỳ.' },
    { id: 'rec_ngungan', name: 'Ngưng Anh Đan', type: 'alchemy', resultId: 'pill_ngungan', reqRealmIndex: 17, ingredients: { herb_longhuyet: 3, herb_cuuchuyen: 1, ore_thienngoai: 2 }, successRate: 0.55, desc: 'Cần 3 Long Huyết Thảo, 1 Cửu Chuyển Tiên Thảo, 2 Thiên Ngoại Vẫn Thiết. Yêu cầu Kim Đan Đỉnh Phong.' },
    { id: 'rec_hoathan', name: 'Hóa Thần Đan', type: 'alchemy', resultId: 'pill_hoathan', reqRealmIndex: 21, ingredients: { herb_cuuchuyen: 3, herb_thienkiem: 1, ore_hondon: 1 }, successRate: 0.50, desc: 'Cần 3 Cửu Chuyển Tiên Thảo, 1 Thiên Kiếm Thảo, 1 Hỗn Độn Thần Thiết. Yêu cầu Nguyên Anh Đỉnh Phong.' },
    { id: 'rec_tho_nguyen', name: 'Cửu Chuyển Thọ Nguyên Đan', type: 'alchemy', resultId: 'pill_tho_nguyen', reqRealmIndex: 14, ingredients: { herb_bachnien: 2, herb_cuuchuyen: 1, ore_tutinh: 2 }, successRate: 0.60, desc: 'Cần 2 Bách Niên Linh Dược, 1 Cửu Chuyển Tiên Thảo, 2 Tử Tinh Khoáng. Yêu cầu Kim Đan Kỳ.' },
    { id: 'rec_thanhphong', name: 'Thanh Phong Kiếm', type: 'forge', resultId: 'wpn_thanhphong', reqRealmIndex: 0, ingredients: { ore_huyenthiet: 4, herb_thanh_u: 2 }, successRate: 0.85, desc: 'Cần 4 Huyền Thiết Tinh, 2 Thanh U Thảo.' },
    { id: 'rec_art_guong', name: 'Bát Quái Hộ Tâm Kính', type: 'forge', resultId: 'art_guong', reqRealmIndex: 0, ingredients: { ore_dong_tinh: 3, ore_huyenthiet: 2 }, successRate: 0.85, desc: 'Cần 3 Thanh Đồng Cổ Tinh, 2 Huyền Thiết Tinh.' },
    { id: 'rec_xichtieu', name: 'Xích Tiêu Kiếm', type: 'forge', resultId: 'wpn_xichtieu', reqRealmIndex: 10, ingredients: { ore_tutinh: 4, herb_hoaviem: 3 }, successRate: 0.75, desc: 'Cần 4 Tử Tinh Khoáng, 3 Hỏa Viêm Thảo.' },
    { id: 'rec_tinhvan', name: 'Tinh Vân Đạo Bào', type: 'forge', resultId: 'arm_tinhvan', reqRealmIndex: 10, ingredients: { ore_tutinh: 3, herb_bachnien: 3 }, successRate: 0.75, desc: 'Cần 3 Tử Tinh Khoáng, 3 Bách Niên Linh Dược.' },
    { id: 'rec_longlan', name: 'Long Lân Bảo Giáp', type: 'forge', resultId: 'arm_longlan', reqRealmIndex: 14, ingredients: { ore_thienngoai: 4, herb_longhuyet: 3 }, successRate: 0.65, desc: 'Cần 4 Thiên Ngoại Vẫn Thiết, 3 Long Huyết Thảo.' }
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
        { id: 'man_thanhvan_3', name: 'Thanh Vân Hộ Thể Thuẫn', cost: 2500, def: 350, hp: 1200, desc: 'Tăng 350 Phòng ngự và 1200 HP.' },
        {
          id: 'man_thanhvan_active',
          name: 'Kiếm Phổ: Vạn Kiếm Quy Tông',
          cost: 1500,
          activeSkill: {
            id: 'sect_skill_van_kiem',
            name: 'Vạn Kiếm Quy Tông',
            mpCost: 45,
            cd: 3,
            dmgMult: 2.7,
            bleedChance: 0.9,
            bleedStacks: 2,
            desc: 'Vạn kiếm tề phát, 90% gây Xuất Huyết 2 tầng trong 3 hiệp.'
          },
          desc: 'Tuyệt kỹ trấn phái: Lĩnh ngộ tuyệt kỹ kiếm pháp trác tuyệt.'
        }
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
        { id: 'man_dan_3', name: 'Cửu Chuyển Hoàn Hồn Bí Lục', cost: 2500, hp: 2500, desc: 'Tăng 2500 HP và 30 năm thọ nguyên.' },
        {
          id: 'man_dan_active',
          name: 'Bí Kíp: Tam Muội Chân Hỏa',
          cost: 1500,
          activeSkill: {
            id: 'sect_skill_tam_muoi',
            name: 'Tam Muội Chân Hỏa',
            mpCost: 45,
            cd: 3,
            dmgMult: 2.4,
            burnChance: 1.0,
            burnTurns: 3,
            desc: 'Phóng Tam Muội Chân Hỏa thiêu rụi mục tiêu 3 hiệp liên tiếp.'
          },
          desc: 'Tuyệt kỹ đan môn: Lĩnh ngộ chân hỏa thần thông thượng thừa.'
        }
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
        { id: 'man_ma_3', name: 'Cửu U Ma Thần Biến', cost: 2500, atk: 600, hp: 2000, desc: 'Tăng 600 Công kích và 2000 HP.' },
        {
          id: 'man_ma_active',
          name: 'Bí Kíp: Thiên Ma Thôn Phệ',
          cost: 1500,
          activeSkill: {
            id: 'sect_skill_thien_ma',
            name: 'Thiên Ma Thôn Phệ',
            mpCost: 40,
            cd: 3,
            dmgMult: 2.6,
            lifeStealPercent: 0.45,
            desc: 'Thôn phệ sinh cơ kẻ địch, hồi 45% sát thương gây ra.'
          },
          desc: 'Tuyệt kỹ ma môn: Lĩnh ngộ ma công cắn nuốt vạn linh.'
        }
      ]
    }
  ];

  const SECT_QUESTS = [
    // Bậc 0: Tạp Dịch
    { id: 'quest_herb', name: 'Hái Thảo Dược Nộp Sơn Môn', desc: 'Tìm kiếm nộp 3 cành Linh Chi Thảo cho dược phòng luyện đan.', reqItem: 'herb_linhchi', reqCount: 3, contrib: 40, stone: 30, minRankIndex: 0 },
    { id: 'quest_ore', name: 'Đào Khoáng Rèn Khí', desc: 'Khai thác nộp 2 khối Huyền Thiết Tinh cho khí các đúc binh khí.', reqItem: 'ore_huyenthiet', reqCount: 2, contrib: 45, stone: 35, minRankIndex: 0 },
    { id: 'quest_patrol', name: 'Tuần Tra Sơn Cước Trừ Yêu', desc: 'Tiêu diệt 3 con yêu lang quấy nhiễu phàm nhân dưới chân núi.', reqKills: 3, contrib: 60, stone: 50, minRankIndex: 0 },
    { id: 'quest_donate', name: 'Quyên Góp Linh Thạch Kiến Thiết Tông Môn', desc: 'Tự nguyện quyên góp 100 Linh Thạch mở rộng đại điện sơn môn.', costStone: 100, contrib: 120, stone: 0, minRankIndex: 0 },

    // Bậc 1: Ngoại Môn
    { id: 'quest_mine_tutinh', name: 'Khai Thác Tử Tinh Khoáng', desc: 'Nộp 2 khối Tử Tinh Khoáng cho luyện khí đường.', reqItem: 'ore_tutinh', reqCount: 2, contrib: 80, stone: 65, minRankIndex: 1 },
    { id: 'quest_patrol_snake', name: 'Tiễu Trừ Độc Xà Trùng Điệp', desc: 'Diệt 2 Lục Hoa Độc Xà trừ hại cho dược điền.', reqKills: 2, reqMonster: 'snake_novice', contrib: 90, stone: 75, minRankIndex: 1 },

    // Bậc 2: Nội Môn
    { id: 'quest_herb_hoaviem', name: 'Thu Thập Hỏa Viêm Thảo', desc: 'Nộp 2 cành Hỏa Viêm Thảo thu hái từ Vạn Yêu Sơn Mạch.', reqItem: 'herb_hoaviem', reqCount: 2, contrib: 150, stone: 130, minRankIndex: 2 },
    { id: 'quest_hunt_tiger', name: 'Trảm Sát Xích Diễm Hổ', desc: 'Trảm sát 1 đầu Xích Diễm Hổ hung hãn bảo vệ sơn môn.', reqKills: 1, reqMonster: 'tiger_fire', contrib: 180, stone: 160, minRankIndex: 2 },

    // Bậc 3: Chân Truyền
    { id: 'quest_submit_trucco', name: 'Cống Nộp Trúc Cơ Đan', desc: 'Luyện chế nộp 1 viên Trúc Cơ Đan hỗ trợ sư đệ phá cảnh.', reqItem: 'pill_trucco', reqCount: 1, contrib: 350, stone: 300, minRankIndex: 3 },
    { id: 'quest_clear_sword_ruins', name: 'Thanh Trừng Cổ Kiếm Khôi Lỗi', desc: 'Trảm sát 1 Cổ Kiếm Khôi Lỗi trong bí cảnh thu hồi kiếm phôi.', reqKills: 1, reqMonster: 'golem_sword', contrib: 400, stone: 360, minRankIndex: 3 },

    // Bậc 4: Trưởng Lão
    { id: 'quest_elder_guard', name: 'Tọa Trấn Hộ Sơn Đại Trận', desc: 'Vận chuyển linh lực đại đạo hộ trì sơn môn (yêu cầu Kim Đan+).', costMp: 300, contrib: 600, stone: 550, minRankIndex: 4 },
    { id: 'quest_slay_elder_boss', name: 'Thảo Phạt Huyết Ma Trưởng Lão', desc: 'Trảm sát 1 Huyết Ma Trưởng Lão chấn hưng uy danh môn phái.', reqKills: 1, reqMonster: 'cultist_elder', contrib: 950, stone: 850, minRankIndex: 4 }
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

  class ParticlePool {
    constructor(capacity = 250) {
      this.capacity = capacity;
      this.pool = new Array(capacity);
      for (let i = 0; i < capacity; i++) {
        this.pool[i] = {
          active: false,
          isSpiral: false,
          isSpark: false,
          isSmoke: false,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          r: 0,
          theta: 0,
          vr: 0,
          vTheta: 0,
          targetX: 0,
          targetY: 0,
          size: 2,
          color: '#ffffff',
          alpha: 1,
          life: 0,
          maxLife: 60,
          curling: 0,
          speed: 1
        };
      }
    }

    acquire() {
      for (let i = 0; i < this.capacity; i++) {
        if (!this.pool[i].active) {
          const p = this.pool[i];
          p.active = true;
          p.isSpiral = false;
          p.isSpark = false;
          p.isSmoke = false;
          p.curling = 0;
          p.speed = 1;
          return p;
        }
      }
      return null;
    }

    getActiveCount() {
      let count = 0;
      for (let i = 0; i < this.capacity; i++) {
        if (this.pool[i].active) count++;
      }
      return count;
    }
  }

  class FloatingTextPool {
    constructor(capacity = 60) {
      this.capacity = capacity;
      this.pool = new Array(capacity);
      for (let i = 0; i < capacity; i++) {
        this.pool[i] = {
          active: false,
          text: '',
          x: 0,
          y: 0,
          vy: -1.2,
          alpha: 1.0,
          color: '#f87171',
          isCrit: false,
          life: 0
        };
      }
    }

    acquire() {
      for (let i = 0; i < this.capacity; i++) {
        if (!this.pool[i].active) {
          const ft = this.pool[i];
          ft.active = true;
          return ft;
        }
      }
      return null;
    }
  }

  class PixelRenderer {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.width = canvas.width = 640;
      this.height = canvas.height = 360;
      this.ctx.imageSmoothingEnabled = false;

      this.currentScene = SCENES.MEDITATE;
      this.particlePool = new ParticlePool(250);
      this.particles = this.particlePool.pool;
      this.floatingTextPool = new FloatingTextPool(60);
      this.floatingTexts = this.floatingTextPool.pool;
      this.stars = [];
      this.time = 0;
      this.shakeDuration = 0;
      this.shakeIntensity = 0;

      this.meditateBg = null;
      this.meditateBgLoaded = false;
      if (typeof Image !== 'undefined') {
        const bgImg = new Image();
        bgImg.onload = () => {
          this.meditateBg = bgImg;
          this.meditateBgLoaded = true;
        };
        bgImg.onerror = () => {
          this.meditateBgLoaded = false;
        };
        bgImg.src = 'assets/meditation_bg.png';
      }

      this.combatState = {
        playerFlash: null,
        monsterFlash: null,
        playerOffsetX: 0,
        monsterOffsetX: 0,
        slashEffect: null,
        monsterSpriteKey: 'monsterWolf'
      };

      this.initStars();
      this.systems = null;
      this.isRunning = false;
      this.rafId = null;
      this.loop = this.loop.bind(this);
      this.startLoop();
    }

    startLoop() {
      if (this.isRunning) return;
      this.isRunning = true;
      this.rafId = requestAnimationFrame(this.loop);
    }

    pauseLoop() {
      if (!this.isRunning) return;
      this.isRunning = false;
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }

    checkVisibilityAndResume() {
      const isDocHidden = typeof document !== 'undefined' && document.hidden;
      const viewportEl = typeof document !== 'undefined' ? document.querySelector('.canvas-viewport') : null;
      const inCombat = typeof document !== 'undefined' && document.body.classList.contains('combat-active-mode');
      const isCharTab = typeof document !== 'undefined' && document.body.classList.contains('tab-nhanvat-active');
      const isVisible = inCombat || isCharTab || (viewportEl && window.getComputedStyle(viewportEl).display !== 'none');

      if (isDocHidden || !isVisible) {
        this.pauseLoop();
      } else {
        this.startLoop();
      }
    }

    setSystems(systems) {
      this.systems = systems;
    }

    initStars() {
      this.stars = [];
      for (let i = 0; i < 85; i++) {
        this.stars.push({
          x: Math.random() * this.width,
          y: Math.random() * (this.height * 0.65),
          size: Math.random() < 0.15 ? 2 : 1,
          color: Math.random() < 0.35 ? '#ffffff' : (Math.random() < 0.7 ? '#fef08a' : '#67e8f9'),
          twinkleSpeed: 0.02 + Math.random() * 0.05,
          twinklePhase: Math.random() * Math.PI * 2,
          isGlitter: Math.random() < 0.2
        });
      }
    }

    setScene(scene) {
      this.currentScene = scene;
      const statusText = document.getElementById('canvas-status-text');
      if (statusText) {
        if (scene === SCENES.COMBAT) {
          statusText.textContent = '⚔️ Sát khí ngút trời, trừ ma trảm yêu bảo vệ đại đạo!';
        } else if (scene === SCENES.TRIBULATION) {
          statusText.textContent = '⚡ Cửu thiên thần lôi giáng lâm, tôi luyện tiên cốt!';
        } else if (scene === SCENES.ALCHEMY) {
          statusText.textContent = '🧪 Đan hỏa hừng hực, lò thần khai mở thai nghén linh đan!';
        } else {
          statusText.textContent = '🧘 Đang đả tọa vận công, chu thiên hấp thu thiên địa linh khí...';
        }
      }
    }

    setStatusText(text) {
      const statusText = document.getElementById('canvas-status-text');
      if (statusText) statusText.textContent = text;
    }

    triggerShake(duration = 20, intensity = 6) {
      this.shakeDuration = duration;
      this.shakeIntensity = intensity;
    }

    addFloatingText(text, x, y, color = '#f87171', isCrit = false) {
      const ft = this.floatingTextPool.acquire();
      if (!ft) return;
      let finalX = x;
      let finalY = y;
      if (this.currentScene === SCENES.MEDITATE && this.meditateBgLoaded && this.meditateBg && x === 320 && y === 160) {
        finalX = 438;
        finalY = 150;
      }
      ft.text = text;
      ft.x = finalX + (Math.random() - 0.5) * 20;
      ft.y = finalY;
      ft.vy = -1.2;
      ft.alpha = 1.0;
      ft.color = color;
      ft.isCrit = isCrit;
      ft.life = 60;
    }

    addSlashEffect(x, y, type = 'sword') {
      this.combatState.slashEffect = {
        x, y, frame: 0, maxFrame: 15, type
      };
    }

    spawnQiParticles() {
      if (this.particlePool.getActiveCount() > 70) return;
      const colors = ['#38bdf8', '#34d399', '#facc15', '#f87171', '#c084fc', '#67e8f9'];
      const angle = Math.random() * Math.PI * 2;
      const radius = 130 + Math.random() * 90;
      const targetX = (this.meditateBgLoaded && this.meditateBg) ? 438 : 320;
      const targetY = (this.meditateBgLoaded && this.meditateBg) ? 195 : 210;

      const p = this.particlePool.acquire();
      if (!p) return;
      p.isSpiral = true;
      p.r = radius;
      p.theta = angle;
      p.vr = 1.1 + Math.random() * 1.2;
      p.vTheta = (0.035 + Math.random() * 0.03) * (Math.random() < 0.5 ? 1 : -1);
      p.targetX = targetX;
      p.targetY = targetY;
      p.x = targetX + Math.cos(angle) * radius;
      p.y = targetY + Math.sin(angle) * (radius * 0.48);
      p.size = Math.random() < 0.3 ? 3 : 2;
      p.color = colors[Math.floor(Math.random() * colors.length)];
      p.alpha = 0.9;
      p.life = 95;
      p.maxLife = 95;
    }

    spawnLightningSparks(x, y) {
      for (let i = 0; i < 15; i++) {
        const p = this.particlePool.acquire();
        if (!p) break;
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 5;
        p.isSpark = true;
        p.x = x;
        p.y = y;
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;
        p.size = 2;
        p.color = Math.random() < 0.5 ? '#38bdf8' : '#ffffff';
        p.alpha = 1;
        p.life = 25;
        p.maxLife = 25;
      }
    }

    spawnSmokeParticles(x, y, count = 30) {
      for (let i = 0; i < count; i++) {
        const p = this.particlePool.acquire();
        if (!p) break;
        p.isSmoke = true;
        p.x = x + (Math.random() - 0.5) * 30;
        p.y = y + (Math.random() - 0.5) * 20;
        p.vx = (Math.random() - 0.5) * 2.2;
        p.vy = -1.2 - Math.random() * 2.4;
        p.size = 3 + Math.floor(Math.random() * 4);
        p.color = Math.random() < 0.4 ? '#475569' : (Math.random() < 0.7 ? '#1e293b' : '#f97316');
        p.alpha = 0.85;
        p.curling = Math.random() * Math.PI * 2;
        p.life = 45 + Math.floor(Math.random() * 35);
        p.maxLife = p.life;
      }
    }

    loop() {
      if (!this.isRunning) return;
      this.time++;

      this.ctx.save();
      if (this.shakeDuration > 0) {
        const sx = (Math.random() - 0.5) * this.shakeIntensity;
        const sy = (Math.random() - 0.5) * this.shakeIntensity;
        this.ctx.translate(sx, sy);
        this.shakeDuration--;
      }

      this.ctx.fillStyle = '#07090e';
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
      this.rafId = requestAnimationFrame(this.loop);
    }

    renderMeditateScene() {
      const ctx = this.ctx;

      // Nâng cấp: Khi hình nền Pixel Art Thần Thoại đã tải thành công
      if (this.meditateBgLoaded && this.meditateBg) {
        ctx.save();
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(this.meditateBg, 0, 0, this.width, this.height);
        ctx.imageSmoothingEnabled = false;

        // Lớp hiệu ứng ánh sáng động & thở thần thoại (Dynamic Breathing Glows)
        ctx.globalCompositeOperation = 'lighter';

        // 1. Quầng trăng bạc thở nhẹ nhàng huyền ảo
        const moonGlow = 0.22 + Math.sin(this.time * 0.04) * 0.1;
        const moonGrad = ctx.createRadialGradient(184, 85, 20, 184, 85, 85);
        moonGrad.addColorStop(0, `rgba(224, 242, 254, ${moonGlow})`);
        moonGrad.addColorStop(0.5, `rgba(186, 230, 253, ${moonGlow * 0.5})`);
        moonGrad.addColorStop(1, 'rgba(186, 230, 253, 0)');
        ctx.fillStyle = moonGrad;
        ctx.beginPath();
        ctx.arc(184, 85, 85, 0, Math.PI * 2);
        ctx.fill();

        // 2. Phi Kiếm Thanh Quang Thần Khí Lơ Lửng Rực Rỡ
        const swordPulse = 0.35 + Math.sin(this.time * 0.08) * 0.2;
        const swordGrad = ctx.createRadialGradient(344, 145, 10, 344, 145, 70);
        swordGrad.addColorStop(0, `rgba(56, 189, 248, ${swordPulse})`);
        swordGrad.addColorStop(0.5, `rgba(103, 232, 249, ${swordPulse * 0.4})`);
        swordGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = swordGrad;
        ctx.beginPath();
        ctx.arc(344, 145, 70, 0, Math.PI * 2);
        ctx.fill();

        // 3. Kim Liên Tụ Linh Trận (Đài sen vàng phát quang nhịp nhàng)
        const lotusPulse = 0.32 + Math.sin(this.time * 0.06) * 0.18;
        const lotusGrad = ctx.createRadialGradient(438, 258, 20, 438, 258, 95);
        lotusGrad.addColorStop(0, `rgba(253, 224, 71, ${lotusPulse})`);
        lotusGrad.addColorStop(0.4, `rgba(245, 158, 11, ${lotusPulse * 0.6})`);
        lotusGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = lotusGrad;
        ctx.beginPath();
        ctx.ellipse(438, 258, 95, 45, 0, 0, Math.PI * 2);
        ctx.fill();

        // 4. Hộ Thể Kim Quang / Tử Quang theo cảnh giới bao bọc đan điền nhân vật
        const isHighRealm = this.systems && this.systems.player && this.systems.player.realmIndex >= 10;
        const auraColor = isHighRealm ? '245, 158, 11' : '56, 189, 248';
        const auraPulse = 0.22 + Math.sin(this.time * 0.07 + 1) * 0.14;
        const auraGrad = ctx.createRadialGradient(438, 195, 25, 438, 195, 85);
        auraGrad.addColorStop(0, `rgba(${auraColor}, ${auraPulse})`);
        auraGrad.addColorStop(0.6, `rgba(${auraColor}, ${auraPulse * 0.35})`);
        auraGrad.addColorStop(1, `rgba(${auraColor}, 0)`);
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(438, 195, 85, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // 5. Nếu có Linh Thú hộ mệnh: hiển thị hiệu ứng & danh hiệu đồng hành tại vị trí linh hồ
        if (this.systems && this.systems.player && this.systems.player.companion) {
          const pet = this.systems.player.companion;
          const petFloat = Math.sin(this.time * 0.08) * 3;
          const petX = 518;
          const petY = 265 + petFloat;

          ctx.save();
          const petGlow = ctx.createRadialGradient(petX, petY, 5, petX, petY, 32);
          petGlow.addColorStop(0, 'rgba(167, 243, 208, 0.45)');
          petGlow.addColorStop(1, 'rgba(167, 243, 208, 0)');
          ctx.fillStyle = petGlow;
          ctx.beginPath();
          ctx.arc(petX, petY, 32, 0, Math.PI * 2);
          ctx.fill();

          ctx.font = '8px "Press Start 2P", monospace, sans-serif';
          ctx.fillStyle = '#fde047';
          ctx.textAlign = 'center';
          ctx.shadowColor = '#000000';
          ctx.shadowBlur = 4;
          ctx.fillText(`${pet.icon || '🐾'} ${pet.name}`, petX, petY - 14);
          ctx.restore();
        }

        // Hạt linh khí xoắn ốc tụ về đan điền nhân vật
        if (this.time % 4 === 0) {
          this.spawnQiParticles();
        }
        return;
      }

      // 1. Bầu Trời Đêm & Ngân Hà Tinh Đới (Nebula Band)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 265);
      skyGrad.addColorStop(0, '#04060f');
      skyGrad.addColorStop(0.5, '#0a1024');
      skyGrad.addColorStop(1, '#121a30');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, this.width, 265);

      ctx.save();
      const nebulaGrad = ctx.createLinearGradient(120, 0, 480, 220);
      nebulaGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      nebulaGrad.addColorStop(0.4, 'rgba(129, 140, 248, 0.08)');
      nebulaGrad.addColorStop(0.6, 'rgba(192, 132, 252, 0.09)');
      nebulaGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = nebulaGrad;
      ctx.beginPath();
      ctx.ellipse(320, 95, 270, 50, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 2. Sao Lấp Lánh Đa Sắc (Twinkling Stars)
      this.stars.forEach(s => {
        const a = (Math.sin(this.time * s.twinkleSpeed + s.twinklePhase) + 1) / 2;
        ctx.fillStyle = s.color;
        ctx.globalAlpha = 0.25 + a * 0.75;
        ctx.fillRect(s.x, s.y, s.size, s.size);
        if (s.isGlitter && a > 0.8) {
          ctx.fillRect(s.x - 1, s.y, 3, 1);
          ctx.fillRect(s.x, s.y - 1, 1, 3);
        }
      });
      ctx.globalAlpha = 1.0;

      // 3. Mặt Trăng Cổ Phong có Quầng Sáng (Moon with Glowing Halos)
      const moonX = 520;
      const moonY = 55;
      ctx.save();
      const halo = ctx.createRadialGradient(moonX, moonY, 14, moonX, moonY, 55);
      halo.addColorStop(0, 'rgba(254, 240, 138, 0.3)');
      halo.addColorStop(0.5, 'rgba(254, 240, 138, 0.08)');
      halo.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(moonX, moonY, 55, 0, Math.PI * 2);
      ctx.fill();
      drawPixelSprite(ctx, SPRITES.sceneMoon, moonX - 24, moonY - 24, 3);
      ctx.restore();

      // 4. Mây Mù Cổ Trang Trôi Ngang 2 Lớp Xa - Gần (Parallax Clouds)
      // Lớp xa (Tối, trôi chậm)
      ctx.fillStyle = 'rgba(30, 41, 59, 0.4)';
      const farCloudX1 = ((this.time * 0.15) % (this.width + 160)) - 80;
      ctx.fillRect(farCloudX1, 46, 110, 8);
      ctx.fillRect(farCloudX1 + 18, 40, 75, 7);
      const farCloudX2 = (((this.time * 0.15) + 300) % (this.width + 160)) - 80;
      ctx.fillRect(farCloudX2, 88, 130, 8);
      ctx.fillRect(farCloudX2 + 25, 82, 80, 7);

      // Lớp gần (Bạc sáng, mỏng hơn)
      ctx.fillStyle = 'rgba(241, 245, 249, 0.14)';
      const nearCloudX1 = ((this.time * 0.32 + 160) % (this.width + 180)) - 90;
      ctx.fillRect(nearCloudX1, 62, 95, 7);
      ctx.fillRect(nearCloudX1 + 16, 56, 60, 6);

      // 5. Tiên Sơn Vạn Trượng & Đảo Bay Huyền Bí
      // Đảo bay viễn cảnh
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(225, 118, 38, 5);
      ctx.fillRect(229, 123, 30, 4);
      ctx.fillRect(235, 127, 18, 3);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.fillRect(223, 117, 42, 2);

      // Núi tiên xa xa
      drawPixelSprite(ctx, SPRITES.sceneMountain, 30, 108, 4);
      drawPixelSprite(ctx, SPRITES.sceneMountain, 390, 122, 3.8);

      // Sương mù chân núi
      const mistGrad = ctx.createLinearGradient(0, 215, 0, 265);
      mistGrad.addColorStop(0, 'rgba(15, 23, 42, 0)');
      mistGrad.addColorStop(1, 'rgba(15, 23, 42, 0.7)');
      ctx.fillStyle = mistGrad;
      ctx.fillRect(0, 215, this.width, 50);

      // 6. Tiên Nhai Khối Đá & Thảm Cỏ Linh Thảo Phát Sáng
      const cliffGrad = ctx.createLinearGradient(0, 265, 0, this.height);
      cliffGrad.addColorStop(0, '#1c263b');
      cliffGrad.addColorStop(0.08, '#131b2b');
      cliffGrad.addColorStop(1, '#090d16');
      ctx.fillStyle = cliffGrad;
      ctx.fillRect(0, 265, this.width, this.height - 265);

      // Viền cỏ linh thảo xanh biếc
      ctx.fillStyle = '#065f46';
      ctx.fillRect(0, 265, this.width, 5);
      ctx.fillStyle = '#059669';
      ctx.fillRect(0, 265, this.width, 2);

      // Các nhánh cỏ nhô lên & hoa tiên phát sáng
      for (let i = 0; i < this.width; i += 22) {
        const h = (i % 6) + 2;
        ctx.fillStyle = '#10b981';
        ctx.fillRect(i, 265 - h, 2, h);

        if (i % 66 === 0) {
          const flowerColor = i % 132 === 0 ? '#f472b6' : '#38bdf8';
          const fAlpha = 0.5 + Math.sin(this.time * 0.08 + i) * 0.45;
          ctx.save();
          ctx.fillStyle = flowerColor;
          ctx.globalAlpha = fAlpha;
          ctx.fillRect(i + 3, 263, 3, 3);
          ctx.restore();
        }
      }

      // 7. Cây Cổ Tùng & Lư Hương Bốc Khói Uốn Lượn
      drawPixelSprite(ctx, SPRITES.scenePine, 48, 168, 6.2);
      drawPixelSprite(ctx, SPRITES.sceneFurnace, 492, 184, 5.2);

      // Khói lư hương bốc lên
      if (this.time % 9 === 0) {
        this.particles.push({
          x: 532 + (Math.random() - 0.5) * 8,
          y: 184,
          vx: (Math.random() - 0.5) * 0.35,
          vy: -0.7 - Math.random() * 0.5,
          curling: Math.random() * Math.PI * 2,
          size: 3,
          color: Math.random() < 0.5 ? '#f8fafc' : '#cbd5e1',
          alpha: 0.65,
          life: 80,
          isSmoke: true
        });
      }

      // 8. Trận Pháp Bát Quái / Tụ Linh Trận Xoay Tròn Phát Sáng Dưới Đài Sen
      const cx = 320;
      const cy = 274;
      const formationAngle = this.time * 0.012;

      ctx.save();
      // Vòng tròn lớn Bát Quái
      ctx.strokeStyle = '#c89b3c';
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.4 + Math.sin(this.time * 0.06) * 0.2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 76, 24, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Vòng tròn nhỏ trung tâm
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.35 + Math.sin(this.time * 0.08) * 0.2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 52, 16, 0, 0, Math.PI * 2);
      ctx.stroke();

      // 8 Quẻ Bát Quái Xoay Tròn Quanh Trận Pháp
      ctx.fillStyle = '#fde047';
      for (let i = 0; i < 8; i++) {
        const theta = formationAngle + (i * Math.PI / 4);
        const rx = cx + Math.cos(theta) * 76;
        const ry = cy + Math.sin(theta) * 24;

        ctx.globalAlpha = 0.55 + Math.sin(this.time * 0.1 + i) * 0.35;
        ctx.fillRect(rx - 2, ry - 1, 5, 2);
        if (i % 2 === 0) {
          ctx.fillRect(rx - 3, ry - 2, 2, 1);
          ctx.fillRect(rx + 1, ry - 2, 2, 1);
        }
      }
      ctx.restore();

      // 9. Đài Sen Tụ Linh & Hộ Thể Kim Quang
      const floatY = Math.sin(this.time * 0.05) * 4;
      drawPixelSprite(ctx, SPRITES.sceneCushion, 272, 258 + floatY * 0.2, 6);

      // Quầng sáng hộ thể
      ctx.save();
      const haloAlpha = 0.2 + (Math.sin(this.time * 0.08) + 1) * 0.15;
      const isHighRealm = this.systems && this.systems.player && this.systems.player.realmIndex >= 10;
      ctx.strokeStyle = isHighRealm ? '#fbbf24' : '#38bdf8';
      ctx.lineWidth = 2;
      ctx.globalAlpha = haloAlpha;
      ctx.beginPath();
      ctx.ellipse(320, 214 + floatY, 48, 56, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 10. Sprite Nhân Vật Đả Tọa
      drawPixelSprite(ctx, SPRITES.playerMeditate, 272, 168 + floatY, 6);

      // Linh Thú Hộ Mệnh đồng hành bên đài sen
      if (this.systems && this.systems.player && this.systems.player.companion) {
        const pet = this.systems.player.companion;
        const petFloat = Math.sin(this.time * 0.08) * 3;
        const petX = 396;
        const petY = 222 + petFloat;

        ctx.save();
        // Vòng quang hoa dưới chân linh thú
        ctx.fillStyle = pet.type === 'thunder' ? 'rgba(56, 189, 248, 0.35)' :
                        pet.type === 'fire' ? 'rgba(239, 68, 68, 0.35)' :
                        pet.type === 'turtle' ? 'rgba(52, 211, 153, 0.35)' : 'rgba(244, 114, 182, 0.35)';
        ctx.beginPath();
        ctx.ellipse(petX, petY + 14, 16, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Icon Linh Thú bay bổng
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pet.icon || '🐾', petX, petY);

        // Danh hiệu / Tên linh thú nhỏ phía trên
        ctx.font = '8px "Press Start 2P", monospace, sans-serif';
        ctx.fillStyle = '#fde047';
        ctx.fillText(pet.name, petX, petY - 16);
        ctx.restore();
      }

      // Kiếm Tu: Phi Kiếm Thần Khí Lơ Lửng Sau Lưng
      const isSword = this.systems && this.systems.player && this.systems.player.cultivationPath && this.systems.player.cultivationPath.id === 'kiem_tu';
      if (isSword) {
        const swordY = 152 + floatY + Math.sin(this.time * 0.09) * 3;
        ctx.save();
        ctx.translate(252, swordY + 24);
        ctx.rotate(-0.25 + Math.sin(this.time * 0.06) * 0.05);
        drawPixelSprite(ctx, SPRITES.flyingSword, -12, -24, 3);
        ctx.strokeStyle = '#38bdf8';
        ctx.globalAlpha = 0.35 + Math.sin(this.time * 0.1) * 0.3;
        ctx.lineWidth = 1;
        ctx.strokeRect(-13, -25, 26, 50);
        ctx.restore();
      }

      // Hạt linh khí xoắn ốc tụ về đan điền
      if (this.time % 4 === 0) {
        this.spawnQiParticles();
      }
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
      const combat = this.systems && this.systems.combatEngine;

      // 1. Bầu Trời Chiến Trường Tiên Ma (Atmospheric Dark Crimson / Purple Sky)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 240);
      skyGrad.addColorStop(0, '#06020c');
      skyGrad.addColorStop(0.5, '#17061f');
      skyGrad.addColorStop(1, '#2c0c22');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, this.width, 240);

      // 2. Huyết Nguyệt / Quầng Sáng Đỏ Rực (Blood Moon)
      ctx.save();
      const moonX = 500;
      const moonY = 65;
      const moonHalo = ctx.createRadialGradient(moonX, moonY, 10, moonX, moonY, 55);
      moonHalo.addColorStop(0, 'rgba(248, 113, 113, 0.45)');
      moonHalo.addColorStop(0.5, 'rgba(239, 68, 68, 0.18)');
      moonHalo.addColorStop(1, 'rgba(239, 68, 68, 0)');
      ctx.fillStyle = moonHalo;
      ctx.beginPath();
      ctx.arc(moonX, moonY, 55, 0, Math.PI * 2);
      ctx.fill();

      // Mặt trăng đỏ
      ctx.fillStyle = '#fca5a5';
      ctx.beginPath();
      ctx.arc(moonX, moonY, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(moonX - 5, moonY - 3, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 3. Mây mù chiến trận vần vũ (Battle Storm Clouds)
      ctx.save();
      ctx.fillStyle = 'rgba(20, 10, 30, 0.7)';
      for (let i = 0; i < 5; i++) {
        const cx = ((i * 150 + this.time * 12) % (this.width + 100)) - 50;
        const cy = 40 + (i % 3) * 25;
        ctx.beginPath();
        ctx.arc(cx, cy, 35, 0, Math.PI * 2);
        ctx.arc(cx + 30, cy - 8, 25, 0, Math.PI * 2);
        ctx.arc(cx + 60, cy + 5, 30, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 4. Dãy Tiên Sơn Viễn Cảnh & Ma Khí Mờ Ảo
      drawPixelSprite(ctx, SPRITES.sceneMountain, 60, 90, 3.2);
      drawPixelSprite(ctx, SPRITES.sceneMountain, 340, 110, 3.0);

      // Tia chớp ma đạo thi thoảng giật chân trời
      if (Math.sin(this.time * 3) > 0.96) {
        ctx.strokeStyle = 'rgba(192, 132, 252, 0.35)';
        ctx.lineWidth = 2;
        drawProceduralLightning(ctx, 220 + Math.sin(this.time * 5) * 50, 20, 260, 180, 3, 'rgba(216, 180, 254, 0.6)', 2);
      }

      // 5. Mặt Đất Chiến Trường Đá Nứt Nẻ (Cracked Arena Ground)
      const groundGrad = ctx.createLinearGradient(0, 240, 0, this.height);
      groundGrad.addColorStop(0, '#1c1429');
      groundGrad.addColorStop(0.3, '#140d20');
      groundGrad.addColorStop(1, '#09050f');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, 240, this.width, this.height - 240);

      // Đường viền chiến ý phân cách
      ctx.fillStyle = '#c89b3c';
      ctx.fillRect(0, 240, this.width, 2);

      // Vạch cổ trận ngăn cách 2 bên
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.25)';
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(320, 120);
      ctx.lineTo(320, 280);
      ctx.stroke();
      ctx.setLineDash([]);

      // Tinh hỏa / tia lửa chiến trận bay lên từ mặt đất
      ctx.save();
      for (let i = 0; i < 8; i++) {
        const sparkX = (i * 85 + this.time * 20) % this.width;
        const sparkY = 270 - ((this.time * 35 + i * 25) % 65);
        ctx.fillStyle = i % 2 === 0 ? 'rgba(239, 68, 68, 0.6)' : 'rgba(250, 204, 21, 0.6)';
        ctx.fillRect(sparkX, sparkY, 2, 2);
      }
      ctx.restore();

      // 6. Trận Pháp Dưới Chân Đạo Hữu (Illuminated Cyan / Gold Battle Circle)
      const px = 140 + this.combatState.playerOffsetX;
      const pBob = Math.sin(this.time * 4) * 2;
      const py = 160 + pBob;

      ctx.save();
      ctx.fillStyle = 'rgba(56, 189, 248, 0.18)';
      ctx.beginPath();
      ctx.ellipse(px + 48, 258, 48, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 8 vòng sao / ấn ký bát quái nhỏ xoay quanh trận
      for (let i = 0; i < 8; i++) {
        const angle = this.time * 0.8 + (i * Math.PI / 4);
        const rx = px + 48 + Math.cos(angle) * 42;
        const ry = 258 + Math.sin(angle) * 11;
        ctx.fillStyle = 'rgba(250, 204, 21, 0.65)';
        ctx.fillRect(rx - 1, ry - 1, 3, 3);
      }
      ctx.restore();

      // Vẽ Phi Kiếm Hộ Thân lơ lửng nếu là Kiếm Tu
      if (this.systems && this.systems.player && this.systems.player.cultivationPath && this.systems.player.cultivationPath.id === 'kiem_tu') {
        const swordX = px - 18 + Math.cos(this.time * 3) * 6;
        const swordY = py - 10 + Math.sin(this.time * 4) * 8;
        ctx.save();
        ctx.translate(swordX + 8, swordY + 16);
        ctx.rotate(0.35 + Math.sin(this.time * 2) * 0.1);
        drawPixelSprite(ctx, SPRITES.flyingSword, -8, -16, 2.0);
        ctx.restore();
      }

      // Vẽ Nhân Vật Đạo Hữu Chiến Đấu
      drawPixelSprite(ctx, SPRITES.playerBattle, px, py, 6, false, this.combatState.playerFlash);

      // 7. Trận Pháp Ma Đạo Dưới Chân Yêu Quái (Demonic Red / Crimson Aura)
      const mx = 410 + this.combatState.monsterOffsetX;
      const mBob = Math.cos(this.time * 3) * 3;
      const my = 145 + mBob;

      ctx.save();
      ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.beginPath();
      ctx.ellipse(mx + 48, 258, 55, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Vòng hào quang hắc ám xoay ngược chiều
      for (let i = 0; i < 6; i++) {
        const angle = -this.time * 1.0 + (i * Math.PI / 3);
        const rx = mx + 48 + Math.cos(angle) * 48;
        const ry = 258 + Math.sin(angle) * 13;
        ctx.fillStyle = 'rgba(239, 68, 68, 0.8)';
        ctx.fillRect(rx - 1, ry - 1, 3, 3);
      }
      ctx.restore();

      // Vẽ Yêu Thú / Quái Vật
      const monsterSprite = SPRITES[this.combatState.monsterSpriteKey] || SPRITES.monsterWolf;
      const monsterScale = monsterSprite.w === 24 ? 5 : 6;
      drawPixelSprite(ctx, monsterSprite, mx, my, monsterScale, true, this.combatState.monsterFlash);

      // 8. Overhead Mini HUD Trên Canvas (Tên & Thanh Máu Nổi Trên Đầu)
      if (combat && combat.playerCombat && combat.monsterCombat) {
        ctx.save();
        // Đạo Hữu Mini Bar
        const pCur = combat.playerCombat.curHp;
        const pMax = combat.playerCombat.maxHp;
        const pRatio = Math.max(0, Math.min(1, pCur / pMax));
        const pBarX = px + 10;
        const pBarY = py - 18;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(pBarX - 1, pBarY - 1, 78, 9);
        ctx.fillStyle = '#334155';
        ctx.fillRect(pBarX, pBarY, 76, 7);
        ctx.fillStyle = pRatio > 0.4 ? '#38bdf8' : '#ef4444';
        ctx.fillRect(pBarX, pBarY, 76 * pRatio, 7);

        // Vẽ Hộ Thuẫn Kim Thân trên Đạo Hữu nếu có
        if (combat.playerCombat.statusEffects && combat.playerCombat.statusEffects.shield > 0) {
          ctx.save();
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.ellipse(px + 48, py + 48, 38, 52, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // Quái Vật Mini Bar
        const mCur = combat.monsterCombat.curHp;
        const mMax = combat.monsterCombat.maxHp;
        const mRatio = Math.max(0, Math.min(1, mCur / mMax));
        const mBarX = mx + 10;
        const mBarY = my - 18;

        // Ý Đồ Quái Vật (Telegraphed Intent)
        if (combat.monsterCombat.nextIntent) {
          ctx.save();
          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.fillRect(mBarX - 4, mBarY - 18, 90, 15);
          const isUltimate = combat.monsterCombat.nextIntent.type === 'enrage' || combat.monsterCombat.nextIntent.type === 'ultimate';
          ctx.strokeStyle = isUltimate ? '#ef4444' : '#f59e0b';
          ctx.strokeRect(mBarX - 4, mBarY - 18, 90, 15);
          ctx.fillStyle = isUltimate ? '#ef4444' : '#fef08a';
          ctx.font = 'bold 10px "Courier New", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(combat.monsterCombat.nextIntent.label, mBarX + 41, mBarY - 7);
          ctx.restore();
        }

        // Mini HP Bar
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(mBarX - 1, mBarY - 1, 82, 9);
        ctx.fillStyle = '#334155';
        ctx.fillRect(mBarX, mBarY, 80, 7);
        ctx.fillStyle = mRatio > 0.5 ? '#ef4444' : (mRatio > 0.2 ? '#f59e0b' : '#dc2626');
        ctx.fillRect(mBarX, mBarY, 80 * mRatio, 7);

        // Mini Rage Bar
        const rage = combat.monsterCombat.rage || 0;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(mBarX - 1, mBarY + 8, 82, 4);
        ctx.fillStyle = '#f97316';
        ctx.fillRect(mBarX, mBarY + 8, 80 * (rage / 100), 3);

        // Hộ Thuẫn Kim Thân trên Quái nếu có
        if (combat.monsterCombat.statusEffects && combat.monsterCombat.statusEffects.shield > 0) {
          ctx.save();
          ctx.strokeStyle = 'rgba(250, 204, 21, 0.85)';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.ellipse(mx + 48, my + 48, 44, 54, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        ctx.restore();
      }

      // 9. Hiệu Ứng Chém / Kỹ Năng (Slash Effects)
      if (this.combatState.slashEffect) {
        const slash = this.combatState.slashEffect;
        slash.frame++;

        ctx.save();
        if (slash.type === 'sword') {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 5;
          ctx.shadowColor = '#bae6fd';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          const startArc = -Math.PI * 0.4 + (slash.frame / slash.maxFrame) * Math.PI * 0.6;
          ctx.arc(slash.x, slash.y, 50, startArc, startArc + Math.PI * 0.5);
          ctx.stroke();
        } else if (slash.type === 'fire') {
          ctx.fillStyle = slash.frame % 2 === 0 ? '#ef4444' : '#fbbf24';
          for (let i = 0; i < 8; i++) {
            const fx = slash.x + (Math.random() - 0.5) * 55;
            const fy = slash.y + (Math.random() - 0.5) * 55;
            ctx.fillRect(fx, fy, 8, 8);
          }
        } else if (slash.type === 'lightning') {
          drawProceduralLightning(ctx, slash.x - 20, slash.y - 70, slash.x, slash.y, 4, '#c084fc', 3);
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

      const session = this.systems && this.systems.alchemySession;
      const isSessionActive = session && session.active;
      const fireMode = isSessionActive ? session.fireMode : 'gentle';
      const isMartial = fireMode === 'martial';

      const fireHeight = (isMartial ? 22 : 12) + Math.sin(this.time * 0.25) * 5;
      ctx.fillStyle = isMartial ? '#ef4444' : '#0284c7';
      ctx.fillRect(270, 260 - fireHeight, 100, fireHeight);
      ctx.fillStyle = isMartial ? '#fbbf24' : '#38bdf8';
      ctx.fillRect(290, 260 - fireHeight * 0.8, 60, fireHeight * 0.8);

      if (this.time % 5 === 0) {
        const colors = isMartial ? ['#f43f5e', '#ea580c', '#f59e0b'] : ['#38bdf8', '#06b6d4', '#10b981'];
        const p = this.particlePool.acquire();
        if (p) {
          p.isSmoke = true;
          p.x = 320 + (Math.random() - 0.5) * 30;
          p.y = 110;
          p.vx = (Math.random() - 0.5) * 0.6;
          p.vy = -1.0 - Math.random() * 0.8;
          p.size = 4;
          p.color = colors[Math.floor(Math.random() * colors.length)];
          p.alpha = 0.8;
          p.life = 65;
          p.maxLife = 65;
        }
      }

      // Nếu đang trong mini-game tương tác, vẽ nhiệt kế & vạch tối ưu
      if (isSessionActive) {
        const gaugeX = 540;
        const gaugeY = 70;
        const gaugeW = 20;
        const gaugeH = 180;

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(gaugeX, gaugeY, gaugeW, gaugeH);
        ctx.strokeStyle = '#475569';
        ctx.strokeRect(gaugeX, gaugeY, gaugeW, gaugeH);

        // Vùng Hoàng Kim (Optimal range)
        const optTop = gaugeY + gaugeH * (1 - session.targetMax / 100);
        const optH = gaugeH * ((session.targetMax - session.targetMin) / 100);
        ctx.fillStyle = 'rgba(34, 197, 94, 0.35)';
        ctx.fillRect(gaugeX + 1, optTop, gaugeW - 2, optH);

        // Mức nhiệt độ hiện tại
        const tempClamped = Math.max(0, Math.min(100, session.temp));
        const tempH = (gaugeH - 2) * (tempClamped / 100);
        ctx.fillStyle = tempClamped > 90 ? '#ef4444' : (tempClamped >= session.targetMin && tempClamped <= session.targetMax ? '#22c55e' : '#f59e0b');
        ctx.fillRect(gaugeX + 2, gaugeY + gaugeH - 2 - tempH, gaugeW - 4, tempH);

        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = '#f8fafc';
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.round(tempClamped)}°C`, gaugeX + 10, gaugeY + gaugeH + 16);

        ctx.font = '13px "Courier New", monospace';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(`Lò Thần: ${session.recipe.name} • Hỏa Hầu: ${isMartial ? 'VŨ HỎA 🔥' : 'VĂN HỎA ❄️'} • Tinh Thuần: ${Math.round(session.purity)}`, 320, 310);
      } else {
        ctx.font = '14px "Courier New", monospace';
        ctx.fillStyle = '#cbd5e1';
        ctx.textAlign = 'center';
        ctx.fillText('Đan hỏa hừng hực, lò thần thai nghén tạo hóa...', 320, 310);
      }
    }

    updateAndDrawParticles() {
      const ctx = this.ctx;
      const pool = this.particlePool.pool;
      const len = pool.length;

      for (let i = 0; i < len; i++) {
        const p = pool[i];
        if (!p.active) continue;

        p.life--;
        if (p.life <= 0) {
          p.active = false;
          continue;
        }

        if (p.isSpark) {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.2;
          p.alpha = Math.max(0, p.life / (p.maxLife || 25));
        } else if (p.isSmoke) {
          if (p.curling !== undefined) {
            p.curling += 0.05;
            p.x += p.vx + Math.sin(p.curling) * 0.4;
          } else {
            p.x += p.vx;
          }
          p.y += p.vy;
          p.alpha = Math.max(0, p.life / (p.maxLife || 80));
        } else if (p.isSpiral) {
          p.r = Math.max(2, p.r - p.vr);
          p.theta += p.vTheta;
          p.x = p.targetX + Math.cos(p.theta) * p.r;
          p.y = p.targetY + Math.sin(p.theta) * (p.r * 0.48);
          p.alpha = Math.max(0, Math.min(1, p.life / 65));

          // Draw trailing faint tail
          const tailX = p.targetX + Math.cos(p.theta - p.vTheta * 1.5) * (p.r + p.vr * 1.5);
          const tailY = p.targetY + Math.sin(p.theta - p.vTheta * 1.5) * ((p.r + p.vr * 1.5) * 0.48);

          ctx.save();
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = p.alpha * 0.35;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
          ctx.restore();
        } else {
          const dx = p.targetX - p.x;
          const dy = p.targetY - p.y;
          p.x += dx * 0.04 * (p.speed || 1);
          p.y += dy * 0.04 * (p.speed || 1);
          p.alpha = Math.max(0, p.life / 60);
        }

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        ctx.restore();
      }
    }

    updateAndDrawFloatingTexts() {
      const ctx = this.ctx;
      const pool = this.floatingTextPool.pool;
      const len = pool.length;

      for (let i = 0; i < len; i++) {
        const ft = pool[i];
        if (!ft.active) continue;

        ft.life--;
        if (ft.life <= 0) {
          ft.active = false;
          continue;
        }

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
      }
    }
  }

  // ==========================================================================
  // 5. TURN-BASED COMBAT ENGINE & COMBAT STATUS MANAGER (R1)
  // ==========================================================================
  class CombatStatusManager {
    static initStatuses() {
      return {
        stun: 0,
        burn: 0,
        bleed: 0,
        poison: 0,
        shield: 0
      };
    }

    static applyStatus(targetCombat, type, durationOrValue = 1) {
      if (!targetCombat.statusEffects) targetCombat.statusEffects = this.initStatuses();
      const s = targetCombat.statusEffects;
      if (type === 'stun') {
        s.stun = Math.max(s.stun, durationOrValue);
      } else if (type === 'burn') {
        s.burn = Math.max(s.burn, durationOrValue);
      } else if (type === 'bleed') {
        s.bleed = Math.min(5, (s.bleed || 0) + durationOrValue);
      } else if (type === 'poison') {
        s.poison = Math.max(s.poison, durationOrValue);
      } else if (type === 'shield') {
        s.shield = (s.shield || 0) + durationOrValue;
      }
    }

    static cleanse(targetCombat) {
      if (!targetCombat.statusEffects) return;
      const s = targetCombat.statusEffects;
      s.stun = 0;
      s.burn = 0;
      s.bleed = 0;
      s.poison = 0;
    }

    static absorbDamage(targetCombat, incomingDmg, renderer, x, y) {
      if (!targetCombat.statusEffects || targetCombat.statusEffects.shield <= 0) {
        return { absorbed: 0, remainingDmg: incomingDmg };
      }
      const shield = targetCombat.statusEffects.shield;
      if (shield >= incomingDmg) {
        targetCombat.statusEffects.shield -= incomingDmg;
        if (renderer) renderer.addFloatingText(`🛡️ Chặn -${incomingDmg}`, x, y, '#38bdf8');
        return { absorbed: incomingDmg, remainingDmg: 0 };
      } else {
        const absorbed = shield;
        targetCombat.statusEffects.shield = 0;
        if (renderer) renderer.addFloatingText(`🛡️ Vỡ Khiên -${absorbed}`, x, y, '#38bdf8');
        return { absorbed, remainingDmg: incomingDmg - absorbed };
      }
    }

    static tickTurn(targetCombat, isPlayer, renderer, addLog, targetName) {
      if (!targetCombat.statusEffects) targetCombat.statusEffects = this.initStatuses();
      const s = targetCombat.statusEffects;
      const floatX = isPlayer ? 170 : 440;
      const maxHp = targetCombat.maxHp || 100;

      // 1. Kịch Độc (Poison DoT)
      if (s.poison > 0) {
        const pDmg = Math.max(1, Math.floor(maxHp * 0.05));
        targetCombat.curHp = Math.max(0, targetCombat.curHp - pDmg);
        if (renderer) renderer.addFloatingText(`-${pDmg} Độc`, floatX, 175, '#a855f7');
        if (addLog) addLog(`☠️ 【${targetName}】 trúng kịch độc công tâm, khí huyết hao tổn ${pDmg}!`, 'danger');
        s.poison--;
      }

      // 2. Thiêu Đốt (Burn DoT)
      if (s.burn > 0) {
        const bDmg = Math.max(1, Math.floor(maxHp * 0.06));
        targetCombat.curHp = Math.max(0, targetCombat.curHp - bDmg);
        if (renderer) renderer.addFloatingText(`-${bDmg} Thiêu Đốt`, floatX, 155, '#f97316');
        if (addLog) addLog(`🔥 【${targetName}】 bị linh hỏa thiêu đốt, mất ${bDmg} Khí Huyết!`, 'danger');
        s.burn--;
      }

      // 3. Xuất Huyết (Bleed DoT stackable)
      if (s.bleed > 0) {
        const blDmg = Math.max(1, Math.floor(maxHp * 0.035 * s.bleed));
        targetCombat.curHp = Math.max(0, targetCombat.curHp - blDmg);
        if (renderer) renderer.addFloatingText(`-${blDmg} Xuất Huyết (${s.bleed}T)`, floatX, 135, '#dc2626');
        if (addLog) addLog(`🩸 【${targetName}】 vết thương xuất huyết dữ dội (${s.bleed} tầng), mất ${blDmg} Khí Huyết!`, 'danger');
        s.bleed = Math.max(0, s.bleed - 1);
      }

      // 4. Choáng / Tê Liệt (Stun check)
      if (s.stun > 0) {
        s.stun--;
        if (renderer) renderer.addFloatingText('TÊ LIỆT! MẤT LƯỢT', floatX, 120, '#38bdf8', true);
        if (addLog) addLog(`⚡ 【${targetName}】 bị tê liệt kinh mạch, choáng váng mất lượt hành động!`, 'skill');
        return true;
      }
      return false;
    }
  }

  class CombatEngine {
    constructor(renderer, logCallback, onCombatEndCallback) {
      this.renderer = renderer;
      this.addLog = logCallback;
      this.onCombatEnd = onCombatEndCallback;
      this.activeCombatEndHandler = onCombatEndCallback;

      this.inCombat = false;
      this.player = null;
      this.monster = null;

      this.playerCombat = {
        curHp: 0, maxHp: 0, curMp: 0, maxMp: 0,
        actionGauge: 0, skillCooldown: 0, skill2Cooldown: 0, artifactCooldown: 0,
        immortalTriggered: false, isDefending: false,
        statusEffects: CombatStatusManager.initStatuses(),
        swordQi: 0, berserkTurns: 0
      };

      this.monsterCombat = {
        curHp: 0, maxHp: 0, curMp: 0, maxMp: 0,
        actionGauge: 0,
        statusEffects: CombatStatusManager.initStatuses(),
        rage: 0,
        nextIntent: null
      };

      this.isPlayerTurn = false;
      this.isProcessingTurn = false;
      this.combatInterval = null;

      this.isAutoCombat = false;
      this.combatSpeed = 1; // 1x hoặc 2x
      this.roundCount = 1;
      this.resultAutoTimer = null;
    }

    setSystems(systems) {
      this.systems = systems;
      if (typeof window !== 'undefined' && !this.lifecycleSaveAttached) {
        this.lifecycleSaveAttached = true;
        window.addEventListener('beforeunload', () => {
          if (!this.inCombat || !this.player) return;
          this.player.curHp = Math.max(1, Math.min(this.player.maxHp, Math.floor(Number(this.playerCombat.curHp) || 0)));
          this.player.curMp = Math.max(0, Math.min(this.player.maxMp, Math.floor(Number(this.playerCombat.curMp) || 0)));
          if (this.systems && typeof this.systems.saveToLocalStorage === 'function') {
            this.systems.saveToLocalStorage();
          }
        });
      }
    }

    calculateEvasion(attackerSpd, defenderSpd, defenderDodgeMod = 0, deltaRealm = 0) {
      const spdDiff = defenderSpd - attackerSpd;
      let evasion = 0.04 + (spdDiff / (defenderSpd + attackerSpd * 1.5)) * 0.35 + (defenderDodgeMod || 0) + deltaRealm * 0.03;
      return Math.min(0.40, Math.max(0.02, evasion));
    }

    calculateDamage(attackerAtk, defenderDef, deltaRealm = 0, isSkill = false, skillMult = 1.0, isCrit = false, critMult = 1.5, defenderPoisoned = false) {
      const effectiveDef = defenderDef * (defenderPoisoned ? 0.8 : 1.0);
      const mitigation = effectiveDef / (effectiveDef + 150 + Math.max(0, -deltaRealm) * 30);
      let baseDmg = (attackerAtk * (isSkill ? skillMult : 1.0)) * (1 + (Math.random() - 0.5) * 0.16);
      let dmg = Math.max(1, Math.floor(baseDmg * (1 - mitigation)));

      // Áp Chế Cảnh Giới (Realm Gap Suppression)
      if (deltaRealm > 0) {
        dmg = Math.floor(dmg * (1 + deltaRealm * 0.12));
      } else if (deltaRealm < 0) {
        dmg = Math.floor(dmg * Math.max(0.20, 1 + deltaRealm * 0.12));
      }

      if (isCrit) {
        dmg = Math.floor(dmg * critMult);
      }
      return Math.max(1, dmg);
    }

    addCultivationExp(amount) {
      const p = this.player;
      if (!p) return 0;

      const realm = REALMS[p.realmIndex] || REALMS[0];
      const currentExp = Math.min(realm.maxExp, Math.max(0, Math.floor(Number(p.exp) || 0)));
      const safeAmount = Math.max(0, Math.floor(Number(amount) || 0));
      const nextExp = Math.min(realm.maxExp, currentExp + safeAmount);
      p.exp = nextExp;
      return nextExp - currentExp;
    }

    updateMonsterIntent() {
      if (!this.monster || !this.inCombat) return;
      if (this.monsterCombat.rage >= 90) {
        this.monsterCombat.nextIntent = {
          type: 'ultimate',
          label: '💥 TUYỆT SÁT CUỒNG NỘ',
          desc: 'Nộ khí ngập trời! Chuẩn bị phóng sát chiêu kinh thiên động địa!'
        };
      } else if (this.monsterCombat.curHp / this.monsterCombat.maxHp < 0.28 && Math.random() < 0.5) {
        this.monsterCombat.nextIntent = {
          type: 'defend',
          label: '🛡️ Kim Thân Phòng Ngự',
          desc: 'Ngưng tụ hộ thuẫn khí tráo giảm sát thương!'
        };
      } else if (this.monster.skills && this.monster.skills.length > 0 && Math.random() < 0.45) {
        const monSkill = this.monster.skills[0];
        this.monsterCombat.nextIntent = {
          type: 'skill',
          label: `⚡ ${monSkill.name}`,
          desc: `Chuẩn bị thi triển yêu thuật sát chiêu!`
        };
      } else {
        this.monsterCombat.nextIntent = {
          type: 'attack',
          label: '⚔️ Công Kích Cuồng Bạo',
          desc: 'Đòn tấn công cận chiến mãnh liệt.'
        };
      }
    }

    startCombat(player, monsterData, onCombatEnd = null) {
      if (this.systems && this.systems.breakthroughInProgress) {
        this.addLog('Đạo hữu đang độ kiếp, không thể tiến vào trận chiến!', 'warning');
        return false;
      }
      if (this.inCombat) return false;
      this.inCombat = true;
      this.isPlayerTurn = false;
      this.isProcessingTurn = false;
      this.roundCount = 1;
      this.player = player;
      this.monster = JSON.parse(JSON.stringify(monsterData));
      // Callback truyền riêng cho trận này chỉ có hiệu lực trong trận đó;
      // nếu không truyền, vẫn dùng callback mặc định để luôn thoát màn combat.
      this.activeCombatEndHandler = typeof onCombatEnd === 'function'
        ? onCombatEnd
        : this.onCombatEnd;

      this.playerCombat = {
        curHp: this.player.curHp,
        maxHp: this.player.maxHp,
        curMp: this.player.curMp,
        maxMp: this.player.maxMp,
        actionGauge: 0,
        skillCooldown: 0,
        skill2Cooldown: 0,
        artifactCooldown: 0,
        immortalTriggered: false,
        isDefending: false,
        statusEffects: CombatStatusManager.initStatuses(),
        swordQi: 0,
        berserkTurns: 0
      };

      this.monsterCombat = {
        curHp: this.monster.hp,
        maxHp: this.monster.hp,
        curMp: this.monster.mp || 50,
        maxMp: this.monster.mp || 50,
        actionGauge: 0,
        statusEffects: CombatStatusManager.initStatuses(),
        rage: 0,
        nextIntent: null
      };

      const overlay = document.getElementById('combat-result-overlay');
      if (overlay) overlay.classList.add('hidden');

      document.body.classList.add('combat-active-mode');
      const headerEl = document.getElementById('combat-active-header');
      if (headerEl) headerEl.classList.remove('hidden');

      const bannerMon = document.getElementById('combat-banner-monster');
      if (bannerMon) bannerMon.textContent = this.monster.name;
      const bannerEnemy = document.getElementById('combat-banner-enemy');
      if (bannerEnemy) bannerEnemy.textContent = this.monster.name;

      const roundEl = document.getElementById('combat-round-counter');
      if (roundEl) roundEl.textContent = 'Hiệp 1';

      this.renderer.combatState.monsterSpriteKey = this.monster.spriteKey || 'monsterWolf';
      this.renderer.setScene(SCENES.COMBAT);
      this.renderer.setStatusText(`⚔️ GIAO TRANH HUNG HIỂM: Đối đầu 【${this.monster.name}】!`);

      if (this.player.companion && this.player.companion.id === 'pet_turtle') {
        CombatStatusManager.applyStatus(this.playerCombat, 'shield', 500);
        this.addLog(`🐢 Linh thú 【Huyền Vũ Ấu Quy】 bảo hộ, kích hoạt Hộ Thuẫn 500 điểm khi vào trận!`, 'golden');
      }

      this.updateMonsterIntent();
      switchTab('tab-combat');

      this.addLog(`⚔️ Đụng độ hung hiểm! Đạo hữu tao ngộ 【${this.monster.name}】! Bước vào trận chiến sinh tử!`, 'battle');
      sound.playThunder();

      this.updateCombatButtons(false);
      this.updateCombatUI();
      this.runCombatLoop();
      this.renderer.checkVisibilityAndResume();
    }

    runCombatLoop() {
      if (this.combatInterval) clearInterval(this.combatInterval);
      const tickMs = 70;
      this.combatInterval = setInterval(() => {
        if (!this.inCombat || this.isPlayerTurn || this.isProcessingTurn) return;

        const pSpeed = Math.max(12, this.player.totalSpd || 15);
        const mSpeed = Math.max(10, this.monster.spd || 12);
        const speedRate = (this.combatSpeed || 1) * 0.22;

        this.playerCombat.actionGauge += pSpeed * speedRate;
        this.monsterCombat.actionGauge += mSpeed * speedRate;

        this.updateCombatUI();

        if (this.playerCombat.actionGauge >= 100) {
          this.playerCombat.actionGauge = 0;
          this.triggerPlayerTurn();
        } else if (this.monsterCombat.actionGauge >= 100) {
          this.monsterCombat.actionGauge = 0;
          this.triggerMonsterTurn();
        }
      }, tickMs);
    }

    triggerPlayerTurn() {
      if (this.playerCombat.curHp <= 0 || !this.inCombat) return;
      this.roundCount = (this.roundCount || 1) + 1;
      const roundEl = document.getElementById('combat-round-counter');
      if (roundEl) roundEl.textContent = `Hiệp ${Math.floor(this.roundCount / 2)}`;

      this.isProcessingTurn = true;

      // Xử lý hiệu ứng trạng thái đầu lượt Đạo Hữu
      const isStunned = CombatStatusManager.tickTurn(this.playerCombat, true, this.renderer, this.addLog, 'Đạo Hữu');

      if (this.playerCombat.skillCooldown > 0) this.playerCombat.skillCooldown--;
      if (this.playerCombat.skill2Cooldown > 0) this.playerCombat.skill2Cooldown--;
      if (this.playerCombat.artifactCooldown > 0) this.playerCombat.artifactCooldown--;
      if (this.playerCombat.berserkTurns > 0) this.playerCombat.berserkTurns--;
      if (this.playerCombat.eagleEyeTurns > 0) this.playerCombat.eagleEyeTurns--;

      // Đặc tính hộ giáp Tinh Vân Đạo Bào: Hồi phục 4% HP mỗi hiệp
      if (this.player.equippedArmor && this.player.equippedArmor.id === 'arm_tinhvan') {
        const regenArmor = Math.floor(this.playerCombat.maxHp * 0.04);
        this.playerCombat.curHp = Math.min(this.playerCombat.maxHp, this.playerCombat.curHp + regenArmor);
        this.renderer.addFloatingText(`+${regenArmor} Tinh Thần`, 170, 140, '#38bdf8');
      }

      // Đặc tính bị động Thể Tu (Cửu Chuyển Kim Cốt) hồi 4% HP mỗi lượt
      if (this.player.cultivationPath && this.player.cultivationPath.id === 'the_tu') {
        const regenHp = Math.floor(this.playerCombat.maxHp * 0.04);
        this.playerCombat.curHp = Math.min(this.playerCombat.maxHp, this.playerCombat.curHp + regenHp);
        this.renderer.addFloatingText(`+${regenHp} Khí Huyết`, 170, 150, '#34d399');
      }

      if (this.player.spiritualRoot && this.player.spiritualRoot.name === 'Thiên Mộc Linh Căn') {
        const heal = Math.floor(this.playerCombat.maxHp * 0.05);
        this.playerCombat.curHp = Math.min(this.playerCombat.maxHp, this.playerCombat.curHp + heal);
        this.renderer.addFloatingText(`+${heal} Sinh Cơ`, 170, 160, '#34d399');
      }

      if (this.checkCombatOver()) return;

      if (isStunned) {
        this.isProcessingTurn = false;
        this.updateCombatUI();
        const animDelay = this.combatSpeed === 2 ? 250 : 500;
        setTimeout(() => {
          if (this.inCombat) this.triggerMonsterTurn();
        }, animDelay);
        return;
      }

      this.isPlayerTurn = true;
      this.isProcessingTurn = false;
      this.updateCombatButtons(true);
      this.updateCombatUI();

      const actionsGrid = document.querySelector('.combat-actions-grid');
      if (actionsGrid) actionsGrid.classList.add('turn-active');

      if (this.isAutoCombat) {
        const delay = this.combatSpeed === 2 ? 150 : 280;
        setTimeout(() => {
          if (!this.inCombat || !this.isPlayerTurn || this.isProcessingTurn) return;
          this.executeAutoTurn();
        }, delay);
      } else {
        sound.playClick();
      }
    }

    executeAutoTurn() {
      if (!this.isPlayerTurn || this.isProcessingTurn) return;
      const skill = this.systems?.getEnhancedSkill((this.player.skills && this.player.skills[0]) || this.player.activeSkill) || ((this.player.skills && this.player.skills[0]) || this.player.activeSkill);
      const skill2 = this.systems?.getEnhancedSkill(this.player.skills && this.player.skills[1]) || (this.player.skills && this.player.skills[1]);
      const art = this.player.equippedArtifact;
      const pillCount = (this.player.inventory && this.player.inventory.pill_hoixuan) || 0;

      // 1. Cứu nguy nếu máu thấp < 35%
      if (this.playerCombat.curHp / this.playerCombat.maxHp < 0.35 && pillCount > 0) {
        this.playerUsePill('pill_hoixuan');
        return;
      }

      // 2. Tuyệt kỹ 2 nếu sẵn sàng
      if (skill2 && this.playerCombat.skill2Cooldown === 0 && this.playerCombat.curMp >= skill2.mpCost) {
        this.playerCastSkill(1);
        return;
      }

      // 3. Tuyệt kỹ 1 nếu sẵn sàng & đủ MP
      if (skill && this.playerCombat.skillCooldown === 0 && this.playerCombat.curMp >= skill.mpCost) {
        this.playerCastSkill(0);
        return;
      }

      // 4. Tế Pháp bảo nếu sẵn sàng
      if (art && this.playerCombat.artifactCooldown === 0) {
        this.playerUseArtifact();
        return;
      }

      // 5. Mặc định đánh thường
      this.playerNormalAttack();
    }

    toggleAutoCombat() {
      this.isAutoCombat = !this.isAutoCombat;
      const btn = document.getElementById('btn-combat-auto');
      if (btn) {
        btn.textContent = this.isAutoCombat ? '🤖 Tự Động: BẬT' : '🤖 Tự Động: TẮT';
        btn.classList.toggle('active', this.isAutoCombat);
      }
      sound.playClick();
      if (this.isAutoCombat && this.isPlayerTurn && !this.isProcessingTurn) {
        this.executeAutoTurn();
      }
    }

    toggleCombatSpeed() {
      this.combatSpeed = this.combatSpeed === 1 ? 2 : 1;
      const btn = document.getElementById('btn-combat-speed');
      if (btn) {
        btn.textContent = `⚡ ${this.combatSpeed}x`;
        btn.classList.toggle('active', this.combatSpeed === 2);
      }
      sound.playClick();
    }

    playerNormalAttack() {
      if (!this.isPlayerTurn || this.isProcessingTurn) return;
      this.isPlayerTurn = false;
      this.isProcessingTurn = true;
      this.updateCombatButtons(false);

      const actionsGrid = document.querySelector('.combat-actions-grid');
      if (actionsGrid) actionsGrid.classList.remove('turn-active');

      sound.playSwordSlash();
      this.renderer.combatState.playerOffsetX = 35;
      this.renderer.addSlashEffect(440, 200, 'sword');

      const animDelay = this.combatSpeed === 2 ? 110 : 200;
      setTimeout(() => {
        // Kiểm tra Né Đòn (Evasion của Quái)
        const monSpd = this.monster.spd || 15;
        const pSpd = this.player.totalSpd || 15;
        const playerRealm = this.player.realmIndex || 0;
        const monRealm = Math.floor(monSpd / 35);
        const deltaRealm = playerRealm - monRealm;
        const monEvasion = this.calculateEvasion(pSpd, monSpd, 0, -deltaRealm);

        if (Math.random() < monEvasion) {
          this.renderer.addFloatingText('NÉ ĐÒN!', 440, 160, '#38bdf8');
          this.addLog(`【${this.monster.name}】 thân hình thoăn thoắt né tránh đòn đánh thường của đạo hữu!`, 'battle');
          this.updateCombatUI();
          this.isProcessingTurn = false;
          return;
        }

        // Tích tầng Kiếm Khí cho Kiếm Tu
        if (this.player.cultivationPath && this.player.cultivationPath.id === 'kiem_tu') {
          this.playerCombat.swordQi = Math.min(5, (this.playerCombat.swordQi || 0) + 1);
        }

        // Bạo Kích
        let critRate = this.player.totalCrit || 0.05;
        let critDmgBonus = this.player.totalCritDmg || 0.5;
        if (this.playerCombat.swordQi > 0) {
          critRate += this.playerCombat.swordQi * 0.04;
          critDmgBonus += this.playerCombat.swordQi * 0.06;
        }
        if (this.playerCombat.berserkTurns > 0) {
          critRate += 0.25;
        }
        if (this.playerCombat.eagleEyeTurns > 0) {
          critRate += 0.35;
        }

        const isCrit = Math.random() < critRate;
        const isPoisoned = this.monsterCombat.statusEffects.poison > 0;
        let dmg = this.calculateDamage(this.player.totalAtk, this.monster.def, deltaRealm, false, 1.0, isCrit, 1.5 + critDmgBonus, isPoisoned);

        if (this.player.physique && this.player.physique.armorPen) {
          dmg += Math.floor(this.monster.def * 0.3);
        }
        if (this.playerCombat.eagleEyeTurns > 0) {
          dmg += Math.floor(this.monster.def * 0.8);
        }

        // Đặc tính Vũ khí: Trảm Yêu Cự Kiếm (+30% ST lên yêu thú)
        if (this.player.equippedWeapon && this.player.equippedWeapon.id === 'wpn_tramyeu') {
          dmg = Math.floor(dmg * 1.3);
          if (Math.random() < 0.25) {
            CombatStatusManager.applyStatus(this.monsterCombat, 'bleed', 2);
            this.addLog('🗡️ Trảm Yêu Cự Kiếm chém rách kinh mạch yêu quái, gây Xuất Huyết!', 'battle');
          }
        }

        // Trừ vào Kim Thân / Khiên trước
        const shieldRes = CombatStatusManager.absorbDamage(this.monsterCombat, dmg, this.renderer, 440, 140);
        const actualDmg = shieldRes.remainingDmg;

        this.monsterCombat.curHp = Math.max(0, this.monsterCombat.curHp - actualDmg);
        this.monsterCombat.rage = Math.min(100, (this.monsterCombat.rage || 0) + (isCrit ? 25 : 15));

        this.renderer.combatState.monsterFlash = '#ffffff';
        setTimeout(() => { this.renderer.combatState.monsterFlash = null; }, 100);

        if (actualDmg > 0) {
          this.renderer.addFloatingText(isCrit ? `BẠO! -${actualDmg}` : `-${actualDmg}`, 440, 160, isCrit ? '#fbbf24' : '#ef4444', isCrit);
          this.addLog(`Đạo hữu vung kiếm xuất kích, gây cho 【${this.monster.name}】 ${actualDmg} sát thương!${isCrit ? ' (Bạo Kích!!)' : ''}`, isCrit ? 'crit' : 'normal');
          this.handleLifeSteal(actualDmg);
        }

        // Đặc tính Vũ khí: Xích Tiêu Kiếm (35% Thiêu Đốt)
        if (this.player.equippedWeapon && this.player.equippedWeapon.id === 'wpn_xichtieu' && Math.random() < 0.35) {
          CombatStatusManager.applyStatus(this.monsterCombat, 'burn', 3);
          this.addLog('🔥 Chân hỏa từ Xích Tiêu Kiếm bùng cháy, thiêu đốt kinh mạch đối thủ 3 hiệp!', 'battle');
        }

        // Đặc tính Vũ khí: Vạn Kiếm Quy Tông (25% kích hoạt phi kiếm liên kích)
        if (this.player.equippedWeapon && this.player.equippedWeapon.id === 'wpn_thienkiem' && Math.random() < 0.25) {
          const extraDmg = Math.floor(this.player.totalAtk * 0.85);
          this.monsterCombat.curHp = Math.max(0, this.monsterCombat.curHp - extraDmg);
          this.renderer.addFloatingText(`VẠN KIẾM! -${extraDmg}`, 440, 130, '#fbbf24', true);
          this.addLog(`⚡ Vạn Kiếm Quy Tông! Phi kiếm bổ sung oanh kích thêm ${extraDmg} sát thương!`, 'golden');
        }

        // Đặc tính Pháp Bảo: Sơn Hà Xã Tắc Đỉnh (20% Choáng)
        if (this.player.equippedArtifact && this.player.equippedArtifact.id === 'art_dinh' && Math.random() < 0.20) {
          CombatStatusManager.applyStatus(this.monsterCombat, 'stun', 1);
          this.addLog('🏺 Sơn Hà Xã Tắc Đỉnh trấn áp càn khôn khiến đối thủ bị choáng 1 hiệp!', 'skill');
        }

        // Trợ chiến từ Linh Thú Hộ Mệnh
        if (this.player.companion) {
          if (this.player.companion.id === 'pet_thunder' && Math.random() < 0.6) {
            const petDmg = Math.max(15, Math.floor(this.player.totalAtk * 0.35));
            this.monsterCombat.curHp = Math.max(0, this.monsterCombat.curHp - petDmg);
            this.renderer.spawnLightningSparks(440, 160);
            this.renderer.addFloatingText(`⚡ LÔI THÚ -${petDmg}`, 440, 120, '#facc15');
            this.addLog(`⚡ Linh thú 【Lôi Tích Thú】 gầm vang, phóng sét đánh bồi ${petDmg} sát thương!`, 'golden');
          } else if (this.player.companion.id === 'pet_fire' && Math.random() < 0.6) {
            const petDmg = Math.max(10, Math.floor(this.player.totalAtk * 0.25));
            this.monsterCombat.curHp = Math.max(0, this.monsterCombat.curHp - petDmg);
            CombatStatusManager.applyStatus(this.monsterCombat, 'burn', 2);
            this.renderer.addFloatingText(`🔥 HỎA HỒ -${petDmg}`, 440, 120, '#ef4444');
            this.addLog(`🔥 Linh thú 【Xích Diễm Hỏa Hồ】 phun chân hỏa thiêu đốt gây ${petDmg} sát thương!`, 'golden');
          } else if (this.player.companion.id === 'pet_rabbit' && Math.random() < 0.7) {
            const heal = Math.max(25, Math.floor(this.playerCombat.maxHp * 0.08));
            this.playerCombat.curHp = Math.min(this.playerCombat.maxHp, this.playerCombat.curHp + heal);
            this.renderer.addFloatingText(`🌸 TIÊN THỎ +${heal}`, 170, 130, '#f472b6');
            this.addLog(`🌸 Linh thú 【Bích Ngọc Tiên Thỏ】 tụ linh sinh cơ hồi phục ${heal} Khí Huyết cho chủ nhân!`, 'heal');
          }
        }

        // Pháp Tu nội tại: 30% gây Tê Liệt
        if (this.player.cultivationPath && this.player.cultivationPath.id === 'phap_tu' && Math.random() < 0.30) {
          CombatStatusManager.applyStatus(this.monsterCombat, 'stun', 1);
          this.addLog(`Ngũ hành lôi quang kích phát! Khiến 【${this.monster.name}】 bị tê liệt 1 hiệp!`, 'skill');
        }

        this.updateCombatUI();
        if (this.checkCombatOver()) return;
        this.isProcessingTurn = false;
      }, animDelay);
    }

    playerCastSkill(skillIndex = 0) {
      if (!this.isPlayerTurn || this.isProcessingTurn) return;
      const skills = this.player.skills || (this.player.activeSkill ? [this.player.activeSkill] : []);
      const baseSkill = skills[skillIndex] || this.player.activeSkill;
      const skill = this.systems?.getEnhancedSkill(baseSkill) || baseSkill;
      if (!skill) return;

      const cdField = skillIndex === 1 ? 'skill2Cooldown' : 'skillCooldown';
      if (this.playerCombat[cdField] > 0) {
        this.addLog(`Kỹ năng 【${skill.name}】 chưa hồi chiêu (${this.playerCombat[cdField]} lượt)!`, 'warning');
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

      this.playerCombat[cdField] = skill.cd || 2;
      this.isPlayerTurn = false;
      this.isProcessingTurn = true;
      this.updateCombatButtons(false);

      const actionsGrid = document.querySelector('.combat-actions-grid');
      if (actionsGrid) actionsGrid.classList.remove('turn-active');

      sound.playThunder();
      this.renderer.combatState.playerOffsetX = 40;
      this.renderer.triggerShake(14, 6);

      const effectType = skill.burnChance ? 'fire' : (skill.stunChance ? 'sword' : 'lightning');
      this.renderer.addSlashEffect(440, 190, effectType);

      const animDelay = this.combatSpeed === 2 ? 140 : 250;
      setTimeout(() => {
        // Đan Tu: Bách Thảo Hồi Xuân giải trừ toàn bộ debuffs
        if (skill.cleanse) {
          CombatStatusManager.cleanse(this.playerCombat);
          this.renderer.addFloatingText('THANH TẨY!', 170, 140, '#38bdf8', true);
          this.addLog(`Đạo hữu thanh tẩy toàn bộ ác chú và trạng thái bất lợi!`, 'system');
        }

        // Hộ thuẫn từ kỹ năng (Pháp Tu / Thể Tu)
        if (skill.shieldPercentMp) {
          const sHp = Math.floor(this.playerCombat.maxMp * skill.shieldPercentMp);
          CombatStatusManager.applyStatus(this.playerCombat, 'shield', sHp);
          this.renderer.addFloatingText(`+${sHp} Khiên`, 170, 140, '#38bdf8');
          this.addLog(`Đạo hữu tạo Kim Thân Hộ Thuẫn hấp thụ ${sHp} sát thương!`, 'skill');
        }
        if (skill.shieldPercentHp) {
          const sHp = Math.floor(this.playerCombat.maxHp * skill.shieldPercentHp);
          CombatStatusManager.applyStatus(this.playerCombat, 'shield', sHp);
          this.renderer.addFloatingText(`+${sHp} Kim Thân`, 170, 140, '#facc15');
          this.addLog(`Bất Diệt Kim Thân giáng lâm! Nhận hộ thuẫn ${sHp} Khí Huyết!`, 'skill');
        }

        // Ma Tu Berserk Buff
        if (skill.berserkTurns) {
          this.playerCombat.berserkTurns = skill.berserkTurns;
          this.renderer.addFloatingText('CUỒNG BẠO!', 170, 130, '#ef4444', true);
          this.addLog(`Đạo hữu bùng nổ Ma Thần Cuồng Nộ! Công kích và hút máu tăng vọt!`, 'danger');
        }

        const playerRealm = this.player.realmIndex || 0;
        const monSpd = this.monster.spd || 15;
        const monRealm = Math.floor(monSpd / 35);
        const deltaRealm = playerRealm - monRealm;

        const isCrit = Math.random() < (this.player.totalCrit + (skill.critBonus || 0));
        let critMult = 1.8 + (this.player.totalCritDmg || 0.5);
        const isPoisoned = this.monsterCombat.statusEffects.poison > 0;
        let dmg = this.calculateDamage(this.player.totalAtk, this.monster.def, deltaRealm, true, skill.dmgMult || 1.8, isCrit, critMult, isPoisoned);

        if (skill.armorPen) {
          dmg += Math.floor(this.monster.def * skill.armorPen);
        }

        const shieldRes = CombatStatusManager.absorbDamage(this.monsterCombat, dmg, this.renderer, 440, 140);
        const actualDmg = shieldRes.remainingDmg;

        this.monsterCombat.curHp = Math.max(0, this.monsterCombat.curHp - actualDmg);
        this.monsterCombat.rage = Math.min(100, (this.monsterCombat.rage || 0) + (isCrit ? 28 : 20));

        this.renderer.combatState.monsterFlash = '#ffffff';
        setTimeout(() => { this.renderer.combatState.monsterFlash = null; }, 120);

        if (actualDmg > 0) {
          this.renderer.addFloatingText(`TUYỆT KỸ! -${actualDmg}`, 440, 150, '#38bdf8', true);
          this.addLog(`Đạo hữu thi triển 【${skill.name}】, oanh kích 【${this.monster.name}】 nhận ${actualDmg} sát thương!`, 'skill');
        }

        // Gán hiệu ứng trạng thái từ kỹ năng lên quái
        if (skill.burnChance && Math.random() < skill.burnChance) {
          CombatStatusManager.applyStatus(this.monsterCombat, 'burn', skill.burnTurns || 3);
          this.addLog(`Thiêu đốt bùng cháy trên người 【${this.monster.name}】!`, 'danger');
        }
        if (skill.stunChance && Math.random() < skill.stunChance) {
          CombatStatusManager.applyStatus(this.monsterCombat, 'stun', 1);
          this.addLog(`【${this.monster.name}】 bị quyền kình đánh choáng váng tê liệt!`, 'skill');
        }
        if (skill.bleedChance && Math.random() < skill.bleedChance) {
          CombatStatusManager.applyStatus(this.monsterCombat, 'bleed', skill.bleedStacks || 2);
          this.addLog(`Kiếm khí xé toạc hộ giáp! Gây Xuất Huyết lên 【${this.monster.name}】!`, 'danger');
        }
        if (skill.poisonChance && Math.random() < skill.poisonChance) {
          CombatStatusManager.applyStatus(this.monsterCombat, 'poison', skill.poisonTurns || 3);
          this.addLog(`Kịch độc ngấm vào tâm can 【${this.monster.name}】!`, 'danger');
        }

        if (skill.healPercent) {
          const heal = Math.floor(this.playerCombat.maxHp * skill.healPercent);
          this.playerCombat.curHp = Math.min(this.playerCombat.maxHp, this.playerCombat.curHp + heal);
          this.renderer.addFloatingText(`+${heal} HP`, 170, 160, '#34d399');
          this.addLog(`Đạo hữu hồi phục ${heal} Khí Huyết!`, 'heal');
        }

        if (skill.lifeStealPercent && actualDmg > 0) {
          const sHeal = Math.floor(actualDmg * skill.lifeStealPercent);
          this.playerCombat.curHp = Math.min(this.playerCombat.maxHp, this.playerCombat.curHp + sHeal);
          this.renderer.addFloatingText(`+${sHeal} Hút`, 170, 160, '#f43f5e');
        }

        this.updateCombatUI();
        if (this.checkCombatOver()) return;
        this.isProcessingTurn = false;
      }, animDelay);
    }

    playerUseArtifact() {
      if (!this.isPlayerTurn || this.isProcessingTurn) return;
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
      this.isProcessingTurn = true;
      this.updateCombatButtons(false);

      const actionsGrid = document.querySelector('.combat-actions-grid');
      if (actionsGrid) actionsGrid.classList.remove('turn-active');

      sound.playCheatSystem();
      this.renderer.triggerShake(12, 6);
      this.renderer.addSlashEffect(440, 190, 'lightning');

      const animDelay = this.combatSpeed === 2 ? 110 : 200;
      setTimeout(() => {
        const dmg = Math.floor(this.player.totalAtk * 1.5 + (art.atk || 50));
        const shieldRes = CombatStatusManager.absorbDamage(this.monsterCombat, dmg, this.renderer, 440, 140);
        const actualDmg = shieldRes.remainingDmg;

        this.monsterCombat.curHp = Math.max(0, this.monsterCombat.curHp - actualDmg);
        this.renderer.addFloatingText(`PHÁP BẢO! -${actualDmg}`, 440, 160, '#c084fc', true);
        this.addLog(`Đạo hữu tế xuất 【${art.name}】, thần quang đại phóng giáng xuống ${actualDmg} sát thương!`, 'artifact');

        // Bật Kim Thân hộ thuẫn nhỏ khi tế pháp bảo
        CombatStatusManager.applyStatus(this.playerCombat, 'shield', Math.floor(this.playerCombat.maxHp * 0.15));

        this.updateCombatUI();
        if (this.checkCombatOver()) return;
        this.isProcessingTurn = false;
      }, animDelay);
    }

    playerUsePill(pillId) {
      if (!this.isPlayerTurn || this.isProcessingTurn) return;
      const count = this.player.inventory[pillId] || 0;
      if (count <= 0) {
        this.addLog(`Trong túi không có đan dược này!`, 'warning');
        return;
      }

      this.player.inventory[pillId]--;
      this.isPlayerTurn = false;
      this.isProcessingTurn = true;
      this.updateCombatButtons(false);

      const actionsGrid = document.querySelector('.combat-actions-grid');
      if (actionsGrid) actionsGrid.classList.remove('turn-active');

      sound.playLoot();
      let healMult = 1.0;
      if (this.player.cultivationPath && this.player.cultivationPath.id === 'dan_y_tu') healMult = 1.35;

      if (pillId === 'pill_hoixuan') {
        const heal = Math.floor(this.playerCombat.maxHp * 0.5 * healMult);
        this.playerCombat.curHp = Math.min(this.playerCombat.maxHp, this.playerCombat.curHp + heal);
        this.renderer.addFloatingText(`+${heal} HP`, 170, 160, '#34d399');
        this.addLog(`Đạo hữu nuốt vào Hồi Xuân Đan, sinh cơ tràn trề hồi phục ${heal} Khí Huyết!`, 'heal');
      } else if (pillId === 'pill_tulinh') {
        const mana = Math.floor(this.playerCombat.maxMp * 0.6 * healMult);
        this.playerCombat.curMp = Math.min(this.playerCombat.maxMp, this.playerCombat.curMp + mana);
        this.renderer.addFloatingText(`+${mana} MP`, 170, 160, '#38bdf8');
        this.addLog(`Đạo hữu nuốt vào Tụ Linh Đan, linh đan tan ra hồi phục ${mana} Linh Lực!`, 'heal');
      } else if (pillId === 'pill_quy_nguyen') {
        this.playerCombat.curHp = this.playerCombat.maxHp;
        this.playerCombat.curMp = this.playerCombat.maxMp;
        this.renderer.addFloatingText(`HỒI PHỤC TOÀN BỘ!`, 170, 160, '#34d399', true);
        this.addLog(`Đạo hữu nuốt vào Ngũ Hành Quy Nguyên Đan, hồi phục toàn bộ 100% Khí Huyết & Linh Lực!`, 'golden');
      } else if (pillId === 'pill_ngung_than') {
        const heal = Math.floor(this.playerCombat.maxHp * 0.25 * healMult);
        this.playerCombat.curHp = Math.min(this.playerCombat.maxHp, this.playerCombat.curHp + heal);
        CombatStatusManager.cleanse(this.playerCombat);
        this.renderer.addFloatingText(`THANH TÂM`, 170, 160, '#38bdf8');
        this.addLog(`Đạo hữu nuốt vào Thanh Tâm Ngưng Thần Đan, hóa giải toàn bộ hiệu ứng xấu và hồi phục ${heal} Khí Huyết!`, 'heal');
      } else if (pillId === 'pill_bao_khi') {
        this.playerCombat.berserkTurns = 5;
        this.renderer.addFloatingText(`BẠO KHÍ +35%`, 170, 160, '#ef4444', true);
        this.addLog(`Đạo hữu nuốt vào Bạo Khí Cuồng Đan, đan điền cuộn trào tăng 35% Công Kích & Bạo Kích trong 5 hiệp!`, 'golden');
      }
      this.updateCombatUI();
      this.isProcessingTurn = false;
    }

    playerUseTalisman(talismanId) {
      if (!this.isPlayerTurn || this.isProcessingTurn) return;
      const count = (this.player.inventory && this.player.inventory[talismanId]) || 0;
      if (count <= 0) {
        this.addLog(`Trong túi không có phù lục này!`, 'warning');
        return;
      }

      this.player.inventory[talismanId]--;
      this.isPlayerTurn = false;
      this.isProcessingTurn = true;
      this.updateCombatButtons(false);

      const actionsGrid = document.querySelector('.combat-actions-grid');
      if (actionsGrid) actionsGrid.classList.remove('turn-active');

      const picker = document.getElementById('combat-item-picker');
      if (picker) picker.classList.add('hidden');

      sound.playBreakthrough();
      const item = ITEMS[talismanId] || { name: 'Phù Lục' };

      if (talismanId === 'talisman_dan_loi') {
        const dmg = Math.floor(this.player.totalAtk * 2.5 + 150);
        const shieldRes = CombatStatusManager.absorbDamage(this.monsterCombat, dmg, this.renderer, 440, 140);
        const actualDmg = shieldRes.remainingDmg;
        this.monsterCombat.curHp = Math.max(0, this.monsterCombat.curHp - actualDmg);
        this.renderer.spawnLightningSparks(440, 160);
        this.renderer.addFloatingText(`LÔI PHÙ -${actualDmg}`, 440, 140, '#facc15', true);
        this.addLog(`⚡ Đạo hữu kích hoạt 【${item.name}】! Cửu thiên cuồng lôi oanh kích ${actualDmg} sát thương sấm sét!`, 'golden');
        if (Math.random() < 0.5) {
          CombatStatusManager.applyStatus(this.monsterCombat, 'stun', 1);
          this.addLog(`Kình lôi tê dại khiến 【${this.monster.name}】 bị tê liệt 1 hiệp!`, 'skill');
        }
      } else if (talismanId === 'talisman_liet_hoa') {
        const dmg = Math.floor(this.player.totalAtk * 1.8);
        const shieldRes = CombatStatusManager.absorbDamage(this.monsterCombat, dmg, this.renderer, 440, 140);
        const actualDmg = shieldRes.remainingDmg;
        this.monsterCombat.curHp = Math.max(0, this.monsterCombat.curHp - actualDmg);
        CombatStatusManager.applyStatus(this.monsterCombat, 'burn', 3);
        this.renderer.addFloatingText(`HỎA PHÙ -${actualDmg}`, 440, 140, '#ef4444', true);
        this.addLog(`🔥 Đạo hữu ném ra 【${item.name}】! Chân hỏa thiêu rụi ${actualDmg} sát thương và gây Thiêu Đốt 3 hiệp!`, 'golden');
      } else if (talismanId === 'talisman_bang_phong') {
        const dmg = Math.floor(this.player.totalAtk * 1.2);
        const shieldRes = CombatStatusManager.absorbDamage(this.monsterCombat, dmg, this.renderer, 440, 140);
        const actualDmg = shieldRes.remainingDmg;
        this.monsterCombat.curHp = Math.max(0, this.monsterCombat.curHp - actualDmg);
        CombatStatusManager.applyStatus(this.monsterCombat, 'stun', 2);
        this.renderer.addFloatingText(`BĂNG PHONG -${actualDmg}`, 440, 140, '#38bdf8', true);
        this.addLog(`❄️ Đạo hữu phóng thích 【${item.name}】! Hàn khí ngàn năm đóng băng 【${this.monster.name}】 2 hiệp!`, 'heal');
      } else if (talismanId === 'talisman_kim_cuong') {
        const shieldVal = 800;
        CombatStatusManager.applyStatus(this.playerCombat, 'shield', shieldVal);
        this.renderer.addFloatingText(`KIM CƯƠNG +${shieldVal}`, 170, 160, '#fbbf24', true);
        this.addLog(`🛡️ Đạo hữu tế xuất 【${item.name}】! Kim quang rực rỡ tạo ${shieldVal} Hộ Thuẫn bảo hộ!`, 'golden');
      } else if (talismanId === 'talisman_an_than') {
        this.playerCombat.dodge100 = true;
        this.renderer.addFloatingText(`ẨN THÂN!`, 170, 160, '#c084fc', true);
        this.addLog(`👻 Đạo hữu dán lên 【${item.name}】! Thân ảnh hòa vào hư không, chắc chắn né tránh đòn công kế tiếp của địch thủ!`, 'golden');
      } else if (talismanId === 'talisman_thien_nhan') {
        this.playerCombat.eagleEyeTurns = 3;
        this.renderer.addFloatingText(`THIÊN NHÃN!`, 170, 160, '#fbbf24', true);
        this.addLog(`👁️ Khai mở 【${item.name}】! Nhìn thấu kinh mạch đối thủ: +35% Bạo Kích & Xuyên Giáp trong 3 hiệp!`, 'golden');
      } else if (talismanId === 'talisman_don_dia') {
        this.addLog(`💨 Đạo hữu kích hoạt 【Độn Địa Phù】, thổ độn ngàn dặm lập tức thoát ly sinh tử chiến 100%!`, 'golden');
        this.endCombat(false, true);
        return;
      }

      this.updateCombatUI();
      if (this.checkCombatOver()) return;
      this.isProcessingTurn = false;
    }

    playerFlee() {
      if (!this.isPlayerTurn || this.isProcessingTurn) return;
      const pInv = this.player.inventory || {};
      if (pInv.talisman_don_dia && pInv.talisman_don_dia > 0) {
        pInv.talisman_don_dia--;
        this.addLog(`💨 Đạo hữu kích hoạt 【Độn Địa Phù】, thổ độn ngàn dặm lập tức thoát ly sinh tử chiến 100%!`, 'golden');
        sound.playBreakthrough();
        this.endCombat(false, true);
        return;
      }
      const hasEscapePerk = this.player.cheatPerk && this.player.cheatPerk.id === 'escape_master';
      const fleeChance = hasEscapePerk ? 1.0 : (this.player.totalSpd / (this.player.totalSpd + this.monster.spd * 0.8));

      if (hasEscapePerk || Math.random() < fleeChance) {
        this.addLog(`💨 Đạo hữu thi triển thân pháp tuyệt luân, thuận lợi đào thoát khỏi trận chiến!`, 'system');
        sound.playClick();
        this.endCombat(false, true);
      } else {
        this.isPlayerTurn = false;
        this.updateCombatButtons(false);
        const actionsGrid = document.querySelector('.combat-actions-grid');
        if (actionsGrid) actionsGrid.classList.remove('turn-active');
        this.addLog(`Bỏ chạy bất thành! Bị 【${this.monster.name}】 phong tỏa đường lui!`, 'danger');
        sound.playHurt();
        this.isProcessingTurn = false;
      }
    }

    triggerMonsterTurn() {
      if (this.monsterCombat.curHp <= 0 || !this.inCombat) return;

      this.isProcessingTurn = true;

      // Xử lý hiệu ứng trạng thái đầu lượt Quái Vật
      const isStunned = CombatStatusManager.tickTurn(this.monsterCombat, false, this.renderer, this.addLog, this.monster.name);

      if (this.checkCombatOver()) return;

      if (isStunned) {
        this.isProcessingTurn = false;
        this.updateMonsterIntent();
        this.updateCombatUI();
        return;
      }

      this.renderer.combatState.monsterOffsetX = -35;
      this.renderer.addSlashEffect(190, 200, 'sword');
      sound.playHurt();

      const animDelay = this.combatSpeed === 2 ? 110 : 200;
      setTimeout(() => {
        const intent = this.monsterCombat.nextIntent || { type: 'attack' };

        // 1. Quái vật chọn hành vi Phòng Ngự
        if (intent.type === 'defend') {
          const shieldHp = Math.floor(this.monsterCombat.maxHp * 0.25);
          CombatStatusManager.applyStatus(this.monsterCombat, 'shield', shieldHp);
          this.renderer.addFloatingText(`+${shieldHp} Khiên`, 440, 140, '#facc15');
          this.addLog(`【${this.monster.name}】 co cụm phòng ngự, ngưng tụ ${shieldHp} Giáp Hộ Thể!`, 'skill');
          this.updateMonsterIntent();
          this.updateCombatUI();
          this.isProcessingTurn = false;
          return;
        }

        // 2. Tính tỷ lệ Né Đòn của Đạo Hữu
        if (this.playerCombat.dodge100) {
          this.playerCombat.dodge100 = false;
          this.renderer.addFloatingText('ẨN THÂN NÉ ĐÒN!', 190, 160, '#c084fc', true);
          this.addLog(`👻 Nhờ Ẩn Thân Tiên Phù, đạo hữu né tránh hoàn toàn đòn đánh của 【${this.monster.name}】!`, 'heal');
          this.updateMonsterIntent();
          this.updateCombatUI();
          this.isProcessingTurn = false;
          return;
        }

        const pSpd = this.player.totalSpd || 15;
        const monSpd = this.monster.spd || 15;
        const playerRealm = this.player.realmIndex || 0;
        const monRealm = Math.floor(monSpd / 35);
        const deltaRealm = monRealm - playerRealm;
        const pDodgeMod = (this.player.spiritualRoot && this.player.spiritualRoot.dodgeMod) || 0;
        const pEvasion = this.calculateEvasion(monSpd, pSpd, pDodgeMod, -deltaRealm);

        if (Math.random() < pEvasion) {
          this.renderer.addFloatingText('NÉ ĐÒN!', 190, 160, '#38bdf8');
          this.addLog(`Đạo hữu thi triển phiêu miểu thân pháp, né tránh hoàn toàn đòn đánh của 【${this.monster.name}】!`, 'battle');
          this.updateMonsterIntent();
          this.updateCombatUI();
          this.isProcessingTurn = false;
          return;
        }

        // 3. Sát thương Quái: thường, skill, hay Cuồng Nộ
        let dmgMult = 1.0;
        let isEnraged = intent.type === 'enrage' || intent.type === 'ultimate';
        let isSkill = intent.type === 'skill';
        let skillName = '';

        if (isEnraged) {
          dmgMult = 2.2;
          this.monsterCombat.rage = 0;
          this.renderer.triggerShake(20, 8);
          this.addLog(`💥 【${this.monster.name}】 bùng nổ nộ khí cực hạn, phóng thích Sát Chiêu Cuồng Nộ!`, 'danger');
        } else if (isSkill) {
          const monSkill = (this.monster.skills && this.monster.skills[0]) || { name: 'Yêu Kỹ', dmgMult: 1.4 };
          dmgMult = monSkill.dmgMult || 1.4;
          skillName = `【${monSkill.name}】`;
        }

        const isCrit = Math.random() < (this.monster.crit || 0.08);
        const isPoisoned = this.playerCombat.statusEffects.poison > 0;
        let dmg = this.calculateDamage(this.monster.atk, this.player.totalDef, deltaRealm, isSkill || isEnraged, dmgMult, isCrit, 1.5, isPoisoned);

        if (this.player.physique && this.player.physique.tier === 'Bá Thể') {
          dmg = Math.floor(dmg * 0.8);
        }

        // Hấp thụ qua Kim Thân của người chơi
        const shieldRes = CombatStatusManager.absorbDamage(this.playerCombat, dmg, this.renderer, 190, 140);
        const actualDmg = shieldRes.remainingDmg;

        this.playerCombat.curHp -= actualDmg;
        this.renderer.combatState.playerFlash = '#ef4444';
        setTimeout(() => { this.renderer.combatState.playerFlash = null; }, 100);

        if (actualDmg > 0) {
          this.renderer.addFloatingText(`-${actualDmg}`, 190, 160, '#ef4444');
          this.addLog(`【${this.monster.name}】 ${skillName ? 'tung sát chiêu ' + skillName : (isEnraged ? 'oanh kích cuồng nộ' : 'tấn công hung hãn')}, đánh trúng đạo hữu ${actualDmg} sát thương!${isCrit ? ' (Bạo Kích!!)' : ''}`, 'danger');
        }

        // Gán hiệu ứng từ quái lên người chơi
        if (this.monster.skills && this.monster.skills[0]) {
          const msk = this.monster.skills[0];
          if (msk.burn && Math.random() < 0.6) {
            CombatStatusManager.applyStatus(this.playerCombat, 'burn', 2);
            this.addLog(`Ngọn lửa ma quái thiêu đốt kinh mạch đạo hữu!`, 'danger');
          }
          if (msk.poison && Math.random() < 0.6) {
            // Đan Tu miễn nhiễm độc
            if (!this.player.cultivationPath || this.player.cultivationPath.id !== 'dan_y_tu') {
              CombatStatusManager.applyStatus(this.playerCombat, 'poison', 2);
              this.addLog(`Độc tố hủ cốt xâm nhập khí huyết!`, 'danger');
            }
          }
          if (msk.freeze && Math.random() < 0.4) {
            CombatStatusManager.applyStatus(this.playerCombat, 'stun', 1);
            this.addLog(`Hàn khí đóng băng thân hình đạo hữu!`, 'danger');
          }
        }
        if (isEnraged) {
          CombatStatusManager.applyStatus(this.playerCombat, 'bleed', 2);
        }

        // Phản đòn thể chất & Long Lân Bảo Giáp
        let totalReflect = (this.player.physique && this.player.physique.reflectBonus) || 0;
        if (this.player.cultivationPath && this.player.cultivationPath.id === 'the_tu') {
          totalReflect += 0.15;
        }
        if (this.player.equippedArmor && this.player.equippedArmor.id === 'arm_longlan') {
          totalReflect += 0.25;
        }
        if (totalReflect > 0 && actualDmg > 0) {
          const reflectDmg = Math.max(1, Math.floor(actualDmg * totalReflect));
          this.monsterCombat.curHp = Math.max(0, this.monsterCombat.curHp - reflectDmg);
          this.renderer.addFloatingText(`PHẢN! -${reflectDmg}`, 440, 170, '#f97316');
          this.addLog(`Thể phách cương mãnh & Long Lân phản chấn lại ${reflectDmg} sát thương cho đối thủ!`, 'normal');
        }

        // Hộ giáp Hỗn Độn Tiên Y: Kích hoạt Hộ Thuẫn khẩn cấp khi HP <= 30%
        if (this.player.equippedArmor && this.player.equippedArmor.id === 'arm_hondon' && !this.playerCombat.hondonShieldUsed) {
          if (this.playerCombat.curHp > 0 && (this.playerCombat.curHp / this.playerCombat.maxHp) <= 0.3) {
            this.playerCombat.hondonShieldUsed = true;
            CombatStatusManager.applyStatus(this.playerCombat, 'shield', 2000);
            this.renderer.addFloatingText('HỖN ĐỘN TIÊN THUẪN +2000', 190, 140, '#c084fc', true);
            this.addLog('🥼 Hỗn Độn Tiên Y bùng nổ chân nguyên hộ thể, ngưng tụ 2000 Hộ Thuẫn cứu mạng!', 'golden');
          }
        }

        // Kim Thủ Chỉ: Bất Tử Chi Khu
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

        this.updateMonsterIntent();
        this.updateCombatUI();
        if (this.checkCombatOver()) return;
        this.isProcessingTurn = false;
      }, animDelay);
    }

    handleLifeSteal(dmg) {
      const lMod = (this.player.spiritualRoot && this.player.spiritualRoot.lifeStealMod) || 0;
      const pathMod = (this.player.cultivationPath && this.player.cultivationPath.id === 'ma_tu') ? 0.2 : 0;
      const berserkMod = this.playerCombat.berserkTurns > 0 ? 0.25 : 0;
      const totalLs = lMod + pathMod + berserkMod + (this.player.bonusLifeSteal || 0);
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

      const actualExpGain = this.addCultivationExp(expGain);
      this.player.spiritStones = (this.player.spiritStones || 0) + stoneGain;
      this.addLog(`Thu hoạch: +${actualExpGain} Tu Vi, +${stoneGain} Linh Thạch.`, 'loot');

      if (this.player.equippedArtifact && this.player.equippedArtifact.id === 'art_chuoi') {
        const mpRestored = Math.floor(this.player.maxMp * 0.1);
        this.player.curMp = Math.min(this.player.maxMp, this.player.curMp + mpRestored);
        this.addLog(`📿 Bồ Đề Chuỗi Hạt ngưng thần tĩnh tâm, hồi phục ${mpRestored} Linh Lực sau trận chiến!`, 'heal');
      }

      let droppedItems = [];
      if (this.monster.drops) {
        this.monster.drops.forEach(drop => {
          let chance = drop.chance || 0.5;
          if (this.player.cheatPerk && this.player.cheatPerk.id === 'double_loot') chance = Math.min(1.0, chance * 1.5);
          if (Math.random() < chance) {
            this.player.inventory[drop.item] = (this.player.inventory[drop.item] || 0) + 1;
            const dropItem = ITEMS[drop.item];
            const dropName = dropItem ? dropItem.name : drop.item;
            droppedItems.push(dropName);
            this.addLog(`Nhặt được chiến lợi phẩm: 【${dropName}】 x1!`, 'loot');

            // Khai mở Dược Điển nếu là linh thảo
            if (drop.item.startsWith('herb_') && this.player.discoveredHerbs) {
              this.player.discoveredHerbs[drop.item] = true;
            }
          }
        });
      }

      if (this.player.cheatCore && this.player.cheatCore.id === 'devour') {
        const bonusAtk = Math.max(1, Math.floor(this.monster.atk * 0.03));
        const bonusHp = Math.max(5, Math.floor(this.monster.hp * 0.02));
        const bonusExp = Math.floor(this.monster.exp * 0.5);

        this.player.bonusAtk = (this.player.bonusAtk || 0) + bonusAtk;
        this.player.bonusHp = (this.player.bonusHp || 0) + bonusHp;
        const actualBonusExp = this.addCultivationExp(bonusExp);

        sound.playCheatSystem();
        this.addLog(`🌀 [Kim Thủ Chỉ] 【Thần Cấp Cắn Nuốt】 phát động! +${bonusAtk} Công kích vĩnh viễn, +${bonusHp} HP vĩnh viễn, +${actualBonusExp} Tu Vi!`, 'system');
      }

      this.showResultModal(true, {
        monsterName: this.monster.name,
        exp: actualExpGain,
        stone: stoneGain,
        drops: droppedItems
      });
    }

    handleDefeat() {
      this.addLog(`💀 Thất bại thảm hại! Đạo hữu trọng thương trước vuốt sắc của 【${this.monster.name}】! May nhờ bảo bối hộ thể giữ lại một tia tàn hồn!`, 'danger');
      sound.playHurt();

      this.player.spiritStones = Math.floor(this.player.spiritStones * 0.9);
      const recoveryHp = Math.max(1, Math.floor(this.player.maxHp * 0.2));
      this.playerCombat.curHp = recoveryHp;
      this.player.curHp = recoveryHp;

      this.showResultModal(false, {
        monsterName: this.monster.name
      });
    }

    showResultModal(isWin, data) {
      if (this.combatInterval) clearInterval(this.combatInterval);
      this.updateCombatButtons(false);

      // Trận chiến đã kết thúc về mặt gameplay, cho phép người chơi rời màn
      // hình combat ngay cả khi modal kết quả vẫn đang chờ tự đóng.
      if (document.body) document.body.classList.add('combat-result-ready');

      const overlay = document.getElementById('combat-result-overlay');
      const titleEl = document.getElementById('combat-result-title');
      const bodyEl = document.getElementById('combat-result-body');

      if (titleEl) {
        titleEl.textContent = isWin ? '🎉 ĐẠI THẮNG QUANG VINH!' : '💀 TRỌNG THƯƠNG THẤT BẠI!';
        titleEl.style.color = isWin ? '#facc15' : '#ef4444';
      }

      if (bodyEl) {
        if (isWin) {
          const dropTxt = data.drops && data.drops.length > 0 ? `<div style="margin-top: 4px;">🎁 Chiến lợi phẩm: <strong style="color: #6ee7b7;">${data.drops.join(', ')}</strong></div>` : '';
          bodyEl.innerHTML = `
            <div style="margin-bottom: 6px;">Đạo hữu đã chém gục 【${data.monsterName}】 dưới chân!</div>
            <div style="color: #38bdf8; font-weight: 700; font-size: 14px;">+${data.exp} Tu Vi &nbsp;•&nbsp; +${data.stone} Linh Thạch</div>
            ${dropTxt}
          `;
        } else {
          bodyEl.innerHTML = `
            <div style="margin-bottom: 6px;">Đạo hữu trọng thương trước hung uy của 【${data.monsterName}】!</div>
            <div style="color: #f87171;">Tổn thất 10% Linh Thạch, bảo tồn 20% Khí Huyết tạm lui!</div>
          `;
        }
      }

      if (overlay) overlay.classList.remove('hidden');

      if (this.resultAutoTimer) clearTimeout(this.resultAutoTimer);
      const autoCloseDelay = this.combatSpeed === 2 ? 1500 : 2500;
      this.resultAutoTimer = setTimeout(() => {
        this.closeResultAndEnd(isWin);
      }, autoCloseDelay);
    }

    closeResultAndEnd(won = null) {
      if (this.resultAutoTimer) {
        clearTimeout(this.resultAutoTimer);
        this.resultAutoTimer = null;
      }
      const overlay = document.getElementById('combat-result-overlay');
      if (overlay) overlay.classList.add('hidden');

      if (document.body) document.body.classList.remove('combat-result-ready');

      const isVictory = won !== null ? won : (this.monsterCombat.curHp <= 0);
      this.endCombat(isVictory, false);
    }

    endCombat(won, fled) {
      this.inCombat = false;
      this.isPlayerTurn = false;
      this.isProcessingTurn = false;
      if (this.combatInterval) clearInterval(this.combatInterval);
      if (this.resultAutoTimer) clearTimeout(this.resultAutoTimer);

      if (won || fled) {
        this.player.curHp = Math.max(1, Math.min(this.player.maxHp, this.playerCombat.curHp));
        this.player.curMp = Math.max(0, Math.min(this.player.maxMp, this.playerCombat.curMp));
      } else {
        this.player.curHp = Math.max(1, Math.floor(this.player.maxHp * 0.2));
        this.player.curMp = Math.max(0, Math.min(this.player.maxMp, this.playerCombat.curMp));
      }
      this.updateCombatButtons(false);

      const overlay = document.getElementById('combat-result-overlay');
      if (overlay) overlay.classList.add('hidden');

      const actionsGrid = document.querySelector('.combat-actions-grid');
      if (actionsGrid) actionsGrid.classList.remove('turn-active');

      if (won && this.player && this.player.sectId) {
        this.player.sectQuestKills = this.player.sectQuestKills || {};
        if (this.monster && this.monster.id) {
          this.player.sectQuestKills[this.monster.id] = (this.player.sectQuestKills[this.monster.id] || 0) + 1;
        }
        if (this.monster && this.monster.id === 'wolf_novice') {
          this.player.sectPatrolKills = (this.player.sectPatrolKills || 0) + 1;
          this.addLog(`[Tông Môn] Tích lũy chiến tích tuần tra: ${Math.min(3, this.player.sectPatrolKills)}/3 yêu lang!`, 'system');
        }
      }

      document.body.classList.remove('combat-active-mode', 'combat-result-ready');
      const headerEl = document.getElementById('combat-active-header');
      if (headerEl) headerEl.classList.add('hidden');

      this.renderer.setScene(SCENES.MEDITATE);
      this.renderer.setStatusText('Đang đả tọa hấp thu thiên địa linh khí...');
      const endHandler = this.activeCombatEndHandler;
      this.activeCombatEndHandler = null;
      if (endHandler) endHandler(won, fled);
      this.renderer.checkVisibilityAndResume();
    }

    updateCombatUI() {
      if (!this.player || !this.monster) return;

      const pCurHp = Math.max(0, this.playerCombat.curHp);
      const pMaxHp = Math.max(1, this.playerCombat.maxHp);
      const pCurMp = Math.max(0, this.playerCombat.curMp);
      const pMaxMp = Math.max(1, this.playerCombat.maxMp);
      const pGauge = Math.max(0, Math.min(100, this.playerCombat.actionGauge));

      const mCurHp = Math.max(0, this.monsterCombat.curHp);
      const mMaxHp = Math.max(1, this.monsterCombat.maxHp);
      const mGauge = Math.max(0, Math.min(100, this.monsterCombat.actionGauge));

      const pNameEl = document.getElementById('combat-player-name');
      const pHpEl = document.getElementById('combat-player-hp');
      const pHpTextEl = document.getElementById('combat-player-hp-text');
      const pMpEl = document.getElementById('combat-player-mp');
      const pMpTextEl = document.getElementById('combat-player-mp-text');
      const pGaugeEl = document.getElementById('combat-player-gauge');
      const pGaugeTextEl = document.getElementById('combat-player-gauge-text');
      const pStatusesEl = document.getElementById('combat-player-statuses');

      const mNameEl = document.getElementById('combat-monster-name');
      const mHpEl = document.getElementById('combat-monster-hp');
      const mHpTextEl = document.getElementById('combat-monster-hp-text');
      const mGaugeEl = document.getElementById('combat-monster-gauge');
      const mGaugeTextEl = document.getElementById('combat-monster-gauge-text');
      const mStatusesEl = document.getElementById('combat-monster-statuses');

      const turnIndicator = document.getElementById('combat-turn-indicator');
      const turnText = document.getElementById('combat-turn-text');

      if (pNameEl) pNameEl.textContent = this.player.name;
      if (pHpEl) pHpEl.style.width = `${Math.min(100, (pCurHp / pMaxHp) * 100)}%`;
      if (pHpTextEl) pHpTextEl.textContent = `HP: ${pCurHp}/${pMaxHp} (${Math.round((pCurHp / pMaxHp) * 100)}%)`;
      if (pMpEl) pMpEl.style.width = `${Math.min(100, (pCurMp / pMaxMp) * 100)}%`;
      if (pMpTextEl) pMpTextEl.textContent = `MP: ${pCurMp}/${pMaxMp}`;
      if (pGaugeEl) pGaugeEl.style.width = `${pGauge}%`;
      if (pGaugeTextEl) pGaugeTextEl.textContent = `Tốc Độ: ${Math.round(pGauge)}%`;

      if (mNameEl) mNameEl.textContent = this.monster.name;
      if (mHpEl) mHpEl.style.width = `${Math.min(100, (mCurHp / mMaxHp) * 100)}%`;
      if (mHpTextEl) mHpTextEl.textContent = `HP: ${mCurHp}/${mMaxHp} (${Math.round((mCurHp / mMaxHp) * 100)}%)`;
      if (mGaugeEl) mGaugeEl.style.width = `${mGauge}%`;
      if (mGaugeTextEl) mGaugeTextEl.textContent = `Tốc Độ: ${Math.round(mGauge)}%`;

      // Cập nhật thanh Nộ Quái & Ý Đồ trên DOM
      const mRageEl = document.getElementById('combat-monster-rage');
      const mRageTextEl = document.getElementById('combat-monster-rage-text');
      const mIntentEl = document.getElementById('combat-monster-intent');
      const rage = this.monsterCombat.rage || 0;
      if (mRageEl) mRageEl.style.width = `${rage}%`;
      if (mRageTextEl) mRageTextEl.textContent = `Nộ Khí: ${rage}%`;
      if (mIntentEl && this.monsterCombat.nextIntent) {
        mIntentEl.innerHTML = `<span class="intent-icon">${this.monsterCombat.nextIntent.label.slice(0, 2)}</span> <span class="intent-text">${this.monsterCombat.nextIntent.label}</span>`;
      }

      // Status badges
      if (pStatusesEl) {
        let tags = [];
        const ps = this.playerCombat.statusEffects;
        if (ps.stun > 0) tags.push(`<span class="combat-status-badge status-stun">⚡ Tê Liệt (${ps.stun})</span>`);
        if (ps.burn > 0) tags.push(`<span class="combat-status-badge status-burn">🔥 Thiêu Đốt (${ps.burn})</span>`);
        if (ps.bleed > 0) tags.push(`<span class="combat-status-badge status-bleed">🩸 Xuất Huyết (${ps.bleed}T)</span>`);
        if (ps.poison > 0) tags.push(`<span class="combat-status-badge status-poison">☠️ Trúng Độc (${ps.poison})</span>`);
        if (ps.shield > 0) tags.push(`<span class="combat-status-badge status-shield">🛡️ Kim Thân (${ps.shield})</span>`);
        if (this.playerCombat.swordQi > 0) tags.push(`<span class="combat-status-badge status-swordqi">🗡️ Kiếm Khí x${this.playerCombat.swordQi}</span>`);
        if (this.playerCombat.berserkTurns > 0) tags.push(`<span class="combat-status-badge status-berserk">👿 Cuồng Bạo (${this.playerCombat.berserkTurns})</span>`);
        if (this.playerCombat.immortalTriggered) tags.push(`<span class="combat-status-badge status-immortal">🌟 Bất Tử</span>`);
        pStatusesEl.innerHTML = tags.join('');
      }

      if (mStatusesEl) {
        let tags = [];
        const ms = this.monsterCombat.statusEffects;
        if (ms.stun > 0) tags.push(`<span class="combat-status-badge status-stun">⚡ Tê Liệt (${ms.stun})</span>`);
        if (ms.burn > 0) tags.push(`<span class="combat-status-badge status-burn">🔥 Thiêu Đốt (${ms.burn})</span>`);
        if (ms.bleed > 0) tags.push(`<span class="combat-status-badge status-bleed">🩸 Xuất Huyết (${ms.bleed}T)</span>`);
        if (ms.poison > 0) tags.push(`<span class="combat-status-badge status-poison">☠️ Trúng Độc (${ms.poison})</span>`);
        if (ms.shield > 0) tags.push(`<span class="combat-status-badge status-shield">🛡️ Hộ Thuẫn (${ms.shield})</span>`);
        mStatusesEl.innerHTML = tags.join('');
      }

      // Turn indicator
      if (turnIndicator && turnText) {
        if (this.isPlayerTurn) {
          turnIndicator.className = 'combat-turn-pill player-turn';
          turnText.innerHTML = '🔥 LƯỢT ĐẠO HỮU! 🔥';
        } else if (this.isProcessingTurn) {
          turnIndicator.className = 'combat-turn-pill processing-turn';
          turnText.innerHTML = '⚡ ĐANG XUẤT CHIÊU...';
        } else {
          turnIndicator.className = 'combat-turn-pill waiting-turn';
          turnText.innerHTML = '⏳ VẬN HÀNH KHÍ THẾ...';
        }
      }

      // Labels on buttons
      const pillCount = (this.player.inventory && this.player.inventory.pill_hoixuan) || 0;
      const pillLabel = document.getElementById('combat-pill-label');
      if (pillLabel) pillLabel.textContent = `🧪 Hồi Xuân (${pillCount > 0 ? `x${pillCount}` : 'Hết'})`;

      const baseSkill = (this.player.skills && this.player.skills[0]) || this.player.activeSkill;
      const skill = this.systems?.getEnhancedSkill(baseSkill) || baseSkill;
      const skillLabel = document.getElementById('combat-skill-label');
      if (skillLabel) {
        if (skill) {
          const cd = this.playerCombat.skillCooldown > 0 ? ` [${this.playerCombat.skillCooldown}]` : '';
          skillLabel.textContent = `⚡ ${skill.name} Lv.${skill.level || 1}${cd}`;
        } else {
          skillLabel.textContent = `⚡ Chưa Có`;
        }
      }

      const skill2 = this.systems?.getEnhancedSkill(this.player.skills && this.player.skills[1]) || (this.player.skills && this.player.skills[1]);
      const skill2Label = document.getElementById('combat-skill2-label');
      if (skill2Label) {
        if (skill2) {
          const cd2 = this.playerCombat.skill2Cooldown > 0 ? ` [${this.playerCombat.skill2Cooldown}]` : '';
          skill2Label.textContent = `🔥 ${skill2.name} Lv.${skill2.level || 1}${cd2}`;
        } else {
          skill2Label.textContent = `🔥 Tuyệt Kỹ 2`;
        }
      }

      const art = this.player.equippedArtifact;
      const artLabel = document.getElementById('combat-artifact-label');
      if (artLabel) {
        if (art) {
          const cd = this.playerCombat.artifactCooldown > 0 ? ` [${this.playerCombat.artifactCooldown}]` : '';
          artLabel.textContent = `🛡️ ${art.name}${cd}`;
        } else {
          artLabel.textContent = `🛡️ Chưa Có`;
        }
      }
    }

    updateCombatButtons(enabled) {
      const btnAttack = document.getElementById('btn-combat-attack');
      const btnSkill = document.getElementById('btn-combat-skill');
      const btnSkill2 = document.getElementById('btn-combat-skill2');
      const btnArtifact = document.getElementById('btn-combat-artifact');
      const btnPill = document.getElementById('btn-combat-pill');
      const btnFlee = document.getElementById('btn-combat-flee');

      if (btnAttack) btnAttack.disabled = !enabled;

      if (btnSkill) {
        const baseSkill = (this.player.skills && this.player.skills[0]) || this.player.activeSkill;
        const skill = this.systems?.getEnhancedSkill(baseSkill) || baseSkill;
        const canUseSkill = enabled && skill && this.playerCombat.skillCooldown === 0 && this.playerCombat.curMp >= skill.mpCost;
        btnSkill.disabled = !canUseSkill;
      }

      if (btnSkill2) {
        const skill2 = this.systems?.getEnhancedSkill(this.player.skills && this.player.skills[1]) || (this.player.skills && this.player.skills[1]);
        const canUseSkill2 = enabled && skill2 && this.playerCombat.skill2Cooldown === 0 && this.playerCombat.curMp >= skill2.mpCost;
        btnSkill2.disabled = !canUseSkill2;
      }

      if (btnArtifact) {
        const art = this.player.equippedArtifact;
        const canUseArt = enabled && art && this.playerCombat.artifactCooldown === 0;
        btnArtifact.disabled = !canUseArt;
      }

      if (btnPill) {
        const pInv = this.player.inventory || {};
        const pillCount = (pInv.pill_hoixuan || 0) + (pInv.pill_quy_nguyen || 0) + (pInv.pill_ngung_than || 0) + (pInv.pill_bao_khi || 0) + (pInv.pill_tulinh || 0);
        const canUsePill = enabled && pillCount > 0;
        btnPill.disabled = !canUsePill;
      }

      const btnTalisman = document.getElementById('btn-combat-talisman');
      if (btnTalisman) {
        const pInv = this.player.inventory || {};
        const talismanCount = (pInv.talisman_dan_loi || 0) + (pInv.talisman_liet_hoa || 0) + (pInv.talisman_bang_phong || 0) + (pInv.talisman_kim_cuong || 0) + (pInv.talisman_an_than || 0) + (pInv.talisman_thien_nhan || 0) + (pInv.talisman_don_dia || 0);
        btnTalisman.disabled = !enabled || talismanCount === 0;
      }

      if (btnFlee) btnFlee.disabled = !enabled;
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
      this.gatherQiCooldownUntil = 0;
      this.worldEncounter = null;
      this.worldSelectedCell = null;
      // Ngăn người chơi khởi tạo nhiều lần đột phá trong lúc đang chờ thiên kiếp.
      this.breakthroughInProgress = false;
      this.alchemySession = null;
      this.alchemyInterval = null;
      this.inventoryFilter = 'all';
      this.compendiumFilter = 'all';
      this.setupLifecycleListeners();
    }

    setupLifecycleListeners() {
      if (typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', () => {
          if (document.hidden) {
            this.pauseLoops();
          } else {
            if (this.player) this.startLoops();
          }
        });
      }
    }

    pauseLoops() {
      if (this.idleTimer) {
        clearInterval(this.idleTimer);
        this.idleTimer = null;
      }
      if (this.saveTimer) {
        clearInterval(this.saveTimer);
        this.saveTimer = null;
      }
    }

    normalizePlayerState(p) {
      if (!p || typeof p !== 'object' || Array.isArray(p)) return null;
      const finiteInt = (value, fallback, min = 0, max = Number.MAX_SAFE_INTEGER) => {
        const number = Number(value);
        if (!Number.isFinite(number)) return fallback;
        return Math.max(min, Math.min(max, Math.floor(number)));
      };
      const finiteNumber = (value, fallback, min = 0, max = Number.MAX_SAFE_INTEGER) => {
        const number = Number(value);
        if (!Number.isFinite(number)) return fallback;
        return Math.max(min, Math.min(max, number));
      };
      p.name = typeof p.name === 'string' && p.name.trim() ? p.name.trim().slice(0, 32) : 'Vô Danh Tu Sĩ';
      p.realmIndex = finiteInt(p.realmIndex, 0, 0, REALMS.length - 1);
      p.exp = finiteInt(p.exp, 0, 0, REALMS[p.realmIndex].maxExp);
      p.age = finiteInt(p.age, 16, 1, 9999);
      p.month = finiteInt(p.month, 1, 1, 12);
      p.comprehension = finiteInt(p.comprehension, 100, 1, 1000);
      p.spiritStones = finiteInt(p.spiritStones, 0);
      p.curHp = finiteInt(p.curHp, 1);
      p.curMp = finiteInt(p.curMp, 0);
      if (!p.inventory || typeof p.inventory !== 'object' || Array.isArray(p.inventory)) p.inventory = {};
      Object.keys(p.inventory).forEach(id => { p.inventory[id] = finiteInt(p.inventory[id], 0); });
      if (!p.signedRegions || typeof p.signedRegions !== 'object' || Array.isArray(p.signedRegions)) p.signedRegions = {};
      if (!p.sectQuestKills || typeof p.sectQuestKills !== 'object' || Array.isArray(p.sectQuestKills)) p.sectQuestKills = {};
      if (p.sectId === undefined) p.sectId = null;
      if (!p.skills || !Array.isArray(p.skills) || p.skills.length === 0) {
        if (p.cultivationPath && p.cultivationPath.skills && p.cultivationPath.skills.length > 0) {
          p.skills = JSON.parse(JSON.stringify(p.cultivationPath.skills));
        } else if (p.activeSkill) {
          p.skills = [p.activeSkill];
        } else {
          p.skills = [{
            id: 'sk_basic_qi',
            name: 'Ngự Khí Quyết',
            mpCost: 10,
            cooldown: 2,
            dmgMult: 1.25,
            desc: 'Tập trung linh khí tạo thành luồng khí kình tấn công địch nhân.'
          }];
        }
      }
      if (!p.activeSkill) p.activeSkill = p.skills[0];
      if (!p.skillLevels || typeof p.skillLevels !== 'object' || Array.isArray(p.skillLevels)) p.skillLevels = {};
      p.skills.forEach(skill => {
        if (!skill || !skill.id) return;
        const level = Number(p.skillLevels[skill.id]);
        p.skillLevels[skill.id] = Number.isFinite(level) ? Math.max(1, Math.min(5, Math.floor(level))) : 1;
      });
      if (!Array.isArray(p.knownSkills) || p.knownSkills.length === 0) {
        p.knownSkills = JSON.parse(JSON.stringify(p.skills));
      } else {
        p.skills.forEach(skill => {
          if (skill && skill.id && !p.knownSkills.some(known => known && known.id === skill.id)) {
            p.knownSkills.push(JSON.parse(JSON.stringify(skill)));
          }
        });
      }
      if (p.sectContribTotal === undefined) p.sectContribTotal = p.sectContrib || 0;
      if (p.sectPatrolKills === undefined) p.sectPatrolKills = 0;
      if (!p.sectManualsBought) p.sectManualsBought = [];
      if (p.sectSalaryClaimedYear === undefined) p.sectSalaryClaimedYear = -1;
      if (p.bonusCrit === undefined) p.bonusCrit = 0;
      if (p.bonusLifeSteal === undefined) p.bonusLifeSteal = 0;
      if (!p.unlockedHerbIds) p.unlockedHerbIds = ['herb_linhchi', 'herb_thanh_u', 'herb_hoaviem'];
      if (p.dungeonState === undefined) p.dungeonState = null;
      ['bonusHp', 'bonusMp', 'bonusAtk', 'bonusDef', 'bonusSpd', 'bonusLifespan', 'sectContrib', 'sectContribTotal', 'sectPatrolKills'].forEach(key => {
        p[key] = finiteInt(p[key], 0);
      });
      p.bonusCrit = finiteNumber(p.bonusCrit, 0, 0, 1);
      p.bonusLifeSteal = finiteNumber(p.bonusLifeSteal, 0, 0, 1);
      p.sectManualsBought = Array.isArray(p.sectManualsBought) ? p.sectManualsBought.filter(value => typeof value === 'string') : [];
      p.sectSalaryClaimedYear = Number.isFinite(Number(p.sectSalaryClaimedYear)) ? Math.floor(Number(p.sectSalaryClaimedYear)) : -1;
      p.daoTamBuff = Number.isFinite(Number(p.daoTamBuff)) ? Math.max(0, Math.min(0.2, Number(p.daoTamBuff))) : 0;
      ['equippedWeapon', 'equippedArmor', 'equippedArtifact'].forEach(key => {
        if (p[key] && typeof p[key] === 'object') p[key] = JSON.parse(JSON.stringify(p[key]));
        else p[key] = null;
      });
      return p;
    }

    getSkillLevel(skill) {
      if (!skill || !skill.id || !this.player) return 1;
      if (!this.player.skillLevels || typeof this.player.skillLevels !== 'object') this.player.skillLevels = {};
      const level = Number(this.player.skillLevels[skill.id]);
      return Number.isFinite(level) ? Math.max(1, Math.min(5, Math.floor(level))) : 1;
    }

    getEnhancedSkill(skill) {
      if (!skill) return skill;
      const level = this.getSkillLevel(skill);
      const rank = level - 1;
      const enhanced = { ...skill, level };
      enhanced.mpCost = Math.max(5, Math.ceil((skill.mpCost || 0) * (1 - rank * 0.03)));
      enhanced.dmgMult = Number(((skill.dmgMult || 1) * (1 + rank * 0.12)).toFixed(2));
      ['burnChance', 'stunChance', 'bleedChance', 'poisonChance'].forEach(key => {
        if (skill[key]) enhanced[key] = Math.min(1, Number((skill[key] + rank * 0.04).toFixed(2)));
      });
      if (skill.healPercent) enhanced.healPercent = Number((skill.healPercent + rank * 0.03).toFixed(2));
      if (skill.shieldPercentMp) enhanced.shieldPercentMp = Number((skill.shieldPercentMp + rank * 0.08).toFixed(2));
      if (skill.shieldPercentHp) enhanced.shieldPercentHp = Number((skill.shieldPercentHp + rank * 0.05).toFixed(2));
      if (skill.lifeStealPercent) enhanced.lifeStealPercent = Number((skill.lifeStealPercent + rank * 0.04).toFixed(2));
      return enhanced;
    }

    equipSkill(skillId, slot) {
      const p = this.player;
      if (!p || !Array.isArray(p.knownSkills)) return;
      const targetSlot = Number(slot);
      if (targetSlot !== 0 && targetSlot !== 1) return;
      const known = p.knownSkills.find(skill => skill && skill.id === skillId);
      if (!known) return;

      const currentSlot = (p.skills || []).findIndex(skill => skill && skill.id === skillId);
      if (currentSlot >= 0 && currentSlot !== targetSlot) {
        const oldTargetSkill = p.skills[targetSlot];
        p.skills[targetSlot] = p.skills[currentSlot];
        p.skills[currentSlot] = oldTargetSkill;
      } else {
        p.skills[targetSlot] = JSON.parse(JSON.stringify(known));
      }
      p.activeSkill = p.skills[0] || p.activeSkill;
      this.normalizePlayerState(p);
      this.saveToLocalStorage();
      this.updateUI();
      this.addLog(`⚔️ Đã tu chỉnh 【${known.name}】 vào ô kỹ năng ${targetSlot + 1}.`, 'skill');
    }

    upgradeSkill(skillId) {
      const p = this.player;
      if (!p || !Array.isArray(p.knownSkills)) return;
      const skill = p.knownSkills.find(item => item && item.id === skillId);
      if (!skill) return;
      const currentLevel = this.getSkillLevel(skill);
      if (currentLevel >= 5) {
        this.addLog(`【${skill.name}】 đã đạt tối đa cấp 5!`, 'warning');
        return;
      }

      const cost = 250 * currentLevel;
      if ((p.spiritStones || 0) < cost) {
        this.addLog(`Linh Thạch không đủ để nâng 【${skill.name}】 (cần ${cost}, hiện có ${p.spiritStones || 0})!`, 'warning');
        return;
      }

      p.spiritStones -= cost;
      p.skillLevels[skill.id] = currentLevel + 1;
      sound.playBreakthrough();
      this.addLog(`⚔️ 【${skill.name}】 đột phá lên cấp ${currentLevel + 1}! Sát thương và hiệu quả chiêu thức tăng.`, 'golden');
      this.saveToLocalStorage();
      this.updateUI();
    }

    renderSkillsUI() {
      const p = this.player;
      const list = document.getElementById('skill-list');
      const summary = document.getElementById('skill-panel-summary');
      if (!p || !list) return;
      this.normalizePlayerState(p);
      const knownSkills = p.knownSkills || p.skills || [];
      const equipped = p.skills || [];
      const escapeText = value => String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      }[char]));

      if (summary) {
        summary.textContent = `Ô 1: ${equipped[0]?.name || 'Trống'} • Ô 2: ${equipped[1]?.name || 'Trống'}`;
      }
      list.innerHTML = '';
      knownSkills.forEach(skill => {
        if (!skill) return;
        const level = this.getSkillLevel(skill);
        const enhanced = this.getEnhancedSkill(skill);
        const equippedSlot = equipped.findIndex(item => item && item.id === skill.id);
        const card = document.createElement('div');
        card.className = `skill-card${equippedSlot >= 0 ? ' equipped' : ''}`;
        card.innerHTML = `
          <div class="skill-card-title-row">
            <span class="skill-card-title">${escapeText(skill.name)}</span>
            <span class="skill-card-level">Cấp ${level}/5</span>
          </div>
          <div class="skill-card-desc">${escapeText(skill.desc || 'Một môn công pháp chưa rõ lai lịch.')}</div>
          <div class="skill-card-meta">
            <span>MP ${enhanced.mpCost}</span>
            <span>•</span>
            <span>倍率 x${enhanced.dmgMult}</span>
          </div>
          <div class="skill-card-actions">
            ${equippedSlot >= 0 ? `<span class="skill-equipped-badge">✅ Đang ở ô ${equippedSlot + 1}</span>` : ''}
            <button type="button" class="pixel-btn small-btn" data-skill-slot="0">Gắn ô 1</button>
            <button type="button" class="pixel-btn small-btn" data-skill-slot="1">Gắn ô 2</button>
            <button type="button" class="pixel-btn small-btn primary-btn" data-skill-upgrade ${level >= 5 ? 'disabled' : ''}>${level >= 5 ? '✅ Đã tối đa' : `Nâng cấp (${250 * level} 🪙)`}</button>
          </div>
        `;
        card.querySelectorAll('[data-skill-slot]').forEach(button => {
          button.addEventListener('click', () => this.equipSkill(skill.id, button.dataset.skillSlot));
        });
        card.querySelector('[data-skill-upgrade]')?.addEventListener('click', () => this.upgradeSkill(skill.id));
        list.appendChild(card);
      });
    }

    migrateSaveData(rawData) {
      if (!rawData) return null;
      let parsed = null;
      if (typeof rawData === 'string') {
        try {
          parsed = JSON.parse(rawData);
        } catch (e) {
          console.error('Failed to parse save data JSON:', e);
          return null;
        }
      } else {
        parsed = rawData;
      }
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;

      // Schema v1: raw player object or schemaVersion missing / < 2
      if (!parsed.schemaVersion || parsed.schemaVersion < 2) {
        const rawPlayer = parsed.player || parsed;
        const normalizedPlayer = this.normalizePlayerState(rawPlayer);
        if (!normalizedPlayer) return null;
        return {
          schemaVersion: 2,
          timestamp: Date.now(),
          player: normalizedPlayer,
          marketItems: Array.isArray(parsed.marketItems)
            ? parsed.marketItems.filter(item => item && ITEMS[item.id]).map(item => ({ ...JSON.parse(JSON.stringify(ITEMS[item.id])), stock: Math.max(0, Math.floor(Number(item.stock ?? 1) || 0)) }))
            : []
        };
      }

      // Schema v2
      parsed.player = this.normalizePlayerState(parsed.player);
      if (!parsed.player) return null;
      parsed.marketItems = Array.isArray(parsed.marketItems)
        ? parsed.marketItems.filter(item => item && ITEMS[item.id]).map(item => ({ ...JSON.parse(JSON.stringify(ITEMS[item.id])), stock: Math.max(0, Math.floor(Number(item.stock ?? 1) || 0)) }))
        : [];
      return parsed;
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
        worldLocation: 'region_1',
        worldGridPosition: { x: 0, y: 0 },
        worldResidence: null,
        worldFaction: null,
        worldAlliances: [],
        worldRelations: {},
        worldMetTravelers: [],
        worldEncounterRewardClaimed: false,
        skillMastery: 1,
        skillLevels: Object.fromEntries((path.skills || [path.startSkill]).map(skill => [skill.id, 1])),
        knownSkills: path.skills ? JSON.parse(JSON.stringify(path.skills)) : [path.startSkill],

        bonusHp: 0, bonusMp: 0, bonusAtk: 0, bonusDef: 0, bonusSpd: 0,

        equippedWeapon: path.startArtifact.type === 'weapon' ? JSON.parse(JSON.stringify(path.startArtifact)) : null,
        equippedArmor: path.startArtifact.type === 'armor' ? JSON.parse(JSON.stringify(path.startArtifact)) : null,
        equippedArtifact: path.startArtifact.type === 'artifact' ? JSON.parse(JSON.stringify(path.startArtifact)) : null,
        activeSkill: path.startSkill,
        skills: path.skills ? JSON.parse(JSON.stringify(path.skills)) : [path.startSkill],
        unlockedHerbIds: ['herb_linhchi', 'herb_thanh_u', 'herb_hoaviem'],
        dungeonState: null,

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
        sectContribTotal: 0,
        sectSalaryClaimedYear: -1,
        sectPatrolKills: 0,
        sectManualsBought: [],
        bonusCrit: 0,
        bonusLifeSteal: 0,
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
      p.realmIndex = Math.max(0, Math.min(REALMS.length - 1, Math.floor(Number(p.realmIndex) || 0)));
      const base = REALMS[p.realmIndex] || REALMS[REALMS.length - 1];

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
      const compBonus = (p.companion && p.companion.bonusStats) || {};

      const wpnRefine = (p.equippedWeapon && p.equippedWeapon.refineLevel) || 0;
      const armRefine = (p.equippedArmor && p.equippedArmor.refineLevel) || 0;
      const artRefine = (p.equippedArtifact && p.equippedArtifact.refineLevel) || 0;

      const wpnAtk = Math.floor(((p.equippedWeapon && p.equippedWeapon.atk) || 0) * (1 + wpnRefine * 0.15));
      const armHp = Math.floor(((p.equippedArmor && p.equippedArmor.hp) || 0) * (1 + armRefine * 0.15));
      const armDef = Math.floor(((p.equippedArmor && p.equippedArmor.def) || 0) * (1 + armRefine * 0.15));
      const artHp = Math.floor(((p.equippedArtifact && p.equippedArtifact.hp) || 0) * (1 + artRefine * 0.15));
      const artMp = Math.floor(((p.equippedArtifact && p.equippedArtifact.mp) || 0) * (1 + artRefine * 0.15));
      const artAtk = Math.floor(((p.equippedArtifact && p.equippedArtifact.atk) || 0) * (1 + artRefine * 0.15));
      const artDef = Math.floor(((p.equippedArtifact && p.equippedArtifact.def) || 0) * (1 + artRefine * 0.15));

      p.maxHp = Math.floor((base.hp + (pathBonus.hp || 0) + (compBonus.hp || 0) + armHp + artHp + (p.bonusHp || 0)) * (1 + phyHp));
      p.maxMp = Math.floor((base.mp + (pathBonus.mp || 0) + (compBonus.mp || 0) + artMp + (p.bonusMp || 0)) * (1 + ((p.spiritualRoot && p.spiritualRoot.mpMod) || 0)));
      p.totalAtk = Math.floor((base.atk + (pathBonus.atk || 0) + (compBonus.atk || 0) + wpnAtk + artAtk + (p.bonusAtk || 0)) * (1 + phyAtk) * ((p.spiritualRoot && p.spiritualRoot.dmgMod) || 1));
      p.totalDef = Math.floor((base.def + (pathBonus.def || 0) + (compBonus.def || 0) + armDef + artDef + (p.bonusDef || 0)) * (1 + phyDef));

      let spdMod = 1.0;
      if (p.cheatPerk && p.cheatPerk.id === 'escape_master') spdMod += 0.5;
      if (p.spiritualRoot && p.spiritualRoot.spdMod) spdMod += p.spiritualRoot.spdMod;
      p.totalSpd = Math.floor((base.spd + (compBonus.spd || 0) + (p.bonusSpd || 0)) * spdMod);

      p.totalCrit = 0.05 + ((pathBonus.crit || 0)) + ((p.spiritualRoot && p.spiritualRoot.critMod) || 0) + ((p.physique && p.physique.critBonus) || 0) + ((p.equippedWeapon && p.equippedWeapon.crit) || 0) + ((compBonus.crit || 0)) + (p.bonusCrit || 0);
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

    addCultivationExp(amount) {
      const p = this.player;
      if (!p) return 0;

      const realm = REALMS[p.realmIndex] || REALMS[0];
      const currentExp = Math.min(realm.maxExp, Math.max(0, Math.floor(Number(p.exp) || 0)));
      const safeAmount = Math.max(0, Math.floor(Number(amount) || 0));
      const nextExp = Math.min(realm.maxExp, currentExp + safeAmount);
      p.exp = nextExp;
      return nextExp - currentExp;
    }

    tickCultivation() {
      const p = this.player;
      this.ensureWorldState();
      const baseRealm = REALMS[p.realmIndex] || REALMS[REALMS.length - 1];
      if (p.exp >= baseRealm.maxExp) return;

      const baseExpPerSec = Math.max(1, Math.floor(Math.sqrt(baseRealm.maxExp) * CULTIVATION_BALANCE.passiveRate));
      let expGain = baseExpPerSec * (p.comprehension / 100);
      if (p.spiritualRoot && p.spiritualRoot.speedMod) expGain *= p.spiritualRoot.speedMod;
      if (p.physique && p.physique.expBonus) expGain *= (1 + p.physique.expBonus);
      if (p.worldResidence && p.worldResidence.regionId === p.worldLocation) {
        expGain *= 1 + ((p.worldResidence.level || 0) * 0.05);
      }

      if (p.cheatCore && p.cheatCore.id === 'proficiency') {
        expGain *= 1.25;
      }

      if (p.teaBuffUntil && Date.now() < p.teaBuffUntil) {
        expGain *= 2;
      }

      this.addCultivationExp(Math.max(1, Math.floor(expGain)));
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
            this.pauseLoops();
            this.handleDeathByAge();
            return;
          }
        }
      }
    }

    activeGatherQi() {
      if (!this.player) return;
      const p = this.player;
      const baseRealm = REALMS[p.realmIndex] || REALMS[REALMS.length - 1];

      if (p.exp >= baseRealm.maxExp) {
        this.addLog('Tu vi đã chạm bình cảnh đỉnh phong! Cần lập tức đả tọa đột phá!', 'warning');
        return;
      }

      const now = Date.now();
      if (now < this.gatherQiCooldownUntil) return;
      this.gatherQiCooldownUntil = now + CULTIVATION_BALANCE.activeGatherCooldownMs;
      const gatherButton = document.getElementById('btn-gather-qi');
      if (gatherButton) {
        gatherButton.disabled = true;
        setTimeout(() => {
          if (gatherButton && Date.now() >= this.gatherQiCooldownUntil) gatherButton.disabled = false;
        }, CULTIVATION_BALANCE.activeGatherCooldownMs);
      }

      sound.playMeditateDing();
      let gain = Math.max(2, Math.floor(Math.sqrt(baseRealm.maxExp) * CULTIVATION_BALANCE.activeGatherRate * (p.comprehension / 100)));
      if (p.teaBuffUntil && Date.now() < p.teaBuffUntil) {
        gain *= 2;
      }
      gain = this.addCultivationExp(gain);

      this.renderer.addFloatingText(`+${gain} Tu Vi`, 320, 160, '#38bdf8');
      this.renderer.spawnQiParticles();
      this.updateUI();
    }

    breakthrough() {
      const p = this.player;
      if (!p) return;

      // Độ kiếp có thời gian chờ; các click liên tiếp không được tạo thêm timer.
      if (this.breakthroughInProgress) return;

      if (this.combatEngine && this.combatEngine.inCombat) {
        this.addLog('Đang trong sinh tử chiến, không thể vừa giao chiến vừa độ kiếp!', 'warning');
        return;
      }

      if (p.realmIndex >= REALMS.length - 1) {
        this.addLog('Đạo hữu đã đạt cảnh giới tối cao của phiên bản hiện tại.', 'golden');
        return;
      }

      const realm = REALMS[p.realmIndex] || REALMS[REALMS.length - 1];

      if (p.exp < realm.maxExp) {
        this.addLog(`Tu vi chưa đạt đỉnh phong (${p.exp}/${realm.maxExp}), cưỡng ép đột phá ắt tẩu hỏa nhập ma!`, 'warning');
        return;
      }

      this.breakthroughInProgress = true;
      this.updateUI();

      let successChance = realm.rate;
      successChance += (p.comprehension - 80) * 0.002;
      if (p.physique && p.physique.breakBonus) successChance += p.physique.breakBonus;

      let usedPill = null;
      const pillId = realm.pillNeeded ? this.getPillIdByName(realm.pillNeeded) : null;
      if (pillId && p.inventory[pillId] > 0) {
        p.inventory[pillId]--;
        usedPill = realm.pillNeeded;
        successChance += 0.35;
      } else if (p.daoTamBuff > 0) {
        successChance += p.daoTamBuff;
        usedPill = 'Đạo Tâm Đan';
        p.daoTamBuff = 0;
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
      // Chỉ xử lý một lần cho mỗi lần bấm đột phá, kể cả khi có callback cũ bị gọi lại.
      if (!this.breakthroughInProgress) return;
      this.breakthroughInProgress = false;

      const p = this.player;
      if (!p) return;
      const oldRealm = REALMS[p.realmIndex];
      const oldHp = p.maxHp;
      const oldMp = p.maxMp;
      const oldAtk = p.totalAtk;
      const oldDef = p.totalDef;
      const oldLifespan = p.maxLifespan;
      const oldExp = p.exp;

      const isSuccess = Math.random() < successChance;

      if (isSuccess) {
        p.realmIndex = Math.min(REALMS.length - 1, p.realmIndex + 1);
        p.exp = 0;
        this.recalculatePlayerStats();
        p.curHp = p.maxHp;
        p.curMp = p.maxMp;

        const newRealm = REALMS[p.realmIndex] || REALMS[REALMS.length - 1];
        sound.playBreakthrough();
        this.renderer.setScene(SCENES.MEDITATE);

        this.addLog(`✨ ĐỘT PHÁ THÀNH CÔNG! Chúc mừng đạo hữu ngưng tụ đại đạo, thăng tiến 【${newRealm.name}】!`, 'golden');
        if (usedPill) this.addLog(`Đã tiêu hao 1 viên 【${usedPill}】 hộ trì kinh mạch bình an!`, 'loot');
        this.addLog(`Chỉ số tăng vọt! Thọ nguyên tăng lên ${p.maxLifespan} tuổi!`, 'system');

        if (newRealm.isAscension) {
          this.addLog(`🌟 PHI THĂNG TIÊN GIỚI! Đạo hữu đã vượt qua cửu cửu thiên kiếp, công đức viên mãn, phi thăng hóa tiên!`, 'golden');
        }

        const gains = {
          hp: Math.max(0, p.maxHp - oldHp),
          mp: Math.max(0, p.maxMp - oldMp),
          atk: Math.max(0, p.totalAtk - oldAtk),
          def: Math.max(0, p.totalDef - oldDef),
          lifespan: Math.max(0, p.maxLifespan - oldLifespan)
        };

        this.showBreakthroughModal({
          success: true,
          oldRealm,
          newRealm,
          gains,
          usedPill,
          isAscension: !!newRealm.isAscension
        });
      } else {
        sound.playHurt();
        this.renderer.setScene(SCENES.MEDITATE);
        p.exp = Math.floor(p.exp * 0.6);
        const savedByCheat = !!(p.cheatPerk && p.cheatPerk.id === 'breakthrough_guard');

        if (savedByCheat) {
          this.addLog(`💔 Đột phá thất bại! May nhờ có 【Thiên Đạo Hộ Thể】 bảo hộ chân nguyên, miễn trừ tâm ma phản phệ!`, 'system');
        } else {
          p.curHp = Math.max(1, Math.floor(p.curHp * 0.3));
          this.addLog(`💀 Đột phá thất bại! Bị lôi kiếp cùng tâm ma phản phệ, thổ huyết trọng thương, mất đi 40% tu vi!`, 'danger');
        }

        this.showBreakthroughModal({
          success: false,
          oldRealm,
          expLost: oldExp - p.exp,
          hpLost: savedByCheat ? 0 : Math.floor(oldHp * 0.7),
          savedByCheat
        });
      }

      this.updateUI();
    }

    showBreakthroughModal(data) {
      const modal = document.getElementById('breakthrough-modal');
      if (!modal) return;

      const headerText = document.getElementById('breakthrough-title-text');
      const oldRealmEl = document.getElementById('bt-old-realm');
      const newRealmEl = document.getElementById('bt-new-realm');
      const gainsGrid = document.getElementById('bt-gains-grid');
      const gainsBox = document.getElementById('bt-gains-container');
      const noteEl = document.getElementById('bt-extra-note');
      const btnClose = document.getElementById('btn-close-breakthrough');

      if (data.success) {
        if (headerText) headerText.textContent = data.isAscension ? '🌟 ĐỘ KIẾP PHI THĂNG HÓA TIÊN 🌟' : '⚡ ĐỘT PHÁ CẢNH GIỚI THÀNH CÔNG ⚡';
        if (oldRealmEl) oldRealmEl.textContent = data.oldRealm.name;
        if (newRealmEl) {
          newRealmEl.textContent = data.newRealm.name;
          newRealmEl.className = 'realm-name text-gold';
        }

        if (gainsBox) gainsBox.style.display = 'block';
        if (gainsGrid) {
          gainsGrid.innerHTML = `
            <div class="bt-gain-pill text-red">🩸 Khí Huyết: +${data.gains.hp} HP</div>
            <div class="bt-gain-pill text-cyan">💧 Linh Lực: +${data.gains.mp} MP</div>
            <div class="bt-gain-pill text-red">⚔️ Công Kích: +${data.gains.atk}</div>
            <div class="bt-gain-pill text-emerald">🛡️ Phòng Ngự: +${data.gains.def}</div>
            <div class="bt-gain-pill text-gold">⏳ Thọ Nguyên: +${data.gains.lifespan} Năm</div>
          `;
        }

        if (noteEl) {
          if (data.usedPill) {
            noteEl.innerHTML = `✨ Đã tiêu hao 1 viên <strong>【${data.usedPill}】</strong> hộ trì tâm mạch, ngưng tụ đạo quả bình an vô sự!`;
          } else if (data.isAscension) {
            noteEl.innerHTML = `🌟 Công đức viên mãn, vượt qua Cửu Cửu Thiên Kiếp, rũ bỏ phàm thai phi thăng Tiên Giới!`;
          } else {
            noteEl.innerHTML = `✨ Đại đạo viên mãn, chúc mừng đạo hữu tiến thêm một bước trên con đường trường sinh bất tử!`;
          }
        }
      } else {
        if (headerText) headerText.textContent = '💔 ĐỘ KIẾP THẤT BẠI 💔';
        if (oldRealmEl) oldRealmEl.textContent = data.oldRealm.name;
        if (newRealmEl) {
          newRealmEl.textContent = 'Bình Cảnh Vỡ Tan';
          newRealmEl.className = 'realm-name text-red';
        }

        if (gainsBox) gainsBox.style.display = 'none';

        if (noteEl) {
          if (data.savedByCheat) {
            noteEl.innerHTML = `🛡️ <strong>Kim Thủ Chỉ 【Thiên Đạo Hộ Thể】</strong> bảo hộ chân nguyên, miễn trừ tâm ma phản phệ! Mất ${data.expLost} Tu Vi tích lũy.`;
          } else {
            noteEl.innerHTML = `💀 Thiên kiếp và tâm ma phản phệ, thổ huyết trọng thương! Tổn thất <strong>${data.expLost} Tu Vi</strong> và suy giảm nguyên khí!`;
          }
        }
      }

      if (btnClose) {
        btnClose.onclick = () => {
          modal.classList.add('hidden');
        };
      }

      modal.classList.remove('hidden');
    }

    showItemDetail(itemId, source) {
      const p = this.player;
      if (!p) return;
      let item = ITEMS[itemId];

      // Nếu xem từ slot trang bị
      if (source && source.startsWith('equipped_')) {
        const slot = source.replace('equipped_', '');
        if (slot === 'weapon') item = p.equippedWeapon;
        if (slot === 'armor') item = p.equippedArmor;
        if (slot === 'artifact') item = p.equippedArtifact;
      }

      if (!item) return;

      const modal = document.getElementById('item-detail-modal');
      if (!modal) return;

      const iconEl = document.getElementById('item-detail-icon');
      const nameEl = document.getElementById('item-detail-name');
      const rarityEl = document.getElementById('item-detail-rarity');
      const typeEl = document.getElementById('item-detail-type');
      const countEl = document.getElementById('item-detail-count');
      const descEl = document.getElementById('item-detail-desc');
      const statsList = document.getElementById('item-detail-stats');
      const priceEl = document.getElementById('item-detail-price');
      const btnPrimary = document.getElementById('btn-item-action-primary');
      const btnSell = document.getElementById('btn-item-action-sell');
      const btnClose = document.getElementById('btn-close-item-detail');
      const btnCloseX = document.getElementById('btn-close-item-detail-x');

      // Phẩm cấp màu
      const price = item.price || 50;
      let rarity = 'Phàm Phẩm';
      let rarityColor = '#94a3b8';
      if (price > 30000) { rarity = 'Tiên Phẩm'; rarityColor = '#f87171'; }
      else if (price > 6000) { rarity = 'Thiên Giai'; rarityColor = '#fbbf24'; }
      else if (price > 1500) { rarity = 'Địa Giai'; rarityColor = '#c084fc'; }
      else if (price > 250) { rarity = 'Huyền Giai'; rarityColor = '#38bdf8'; }
      else if (price > 50) { rarity = 'Hoàng Giai'; rarityColor = '#34d399'; }

      // Icon & Loại
      const icon = item.icon || '💎';
      let typeName = 'Kỳ Trân Dị Bảo';
      if (item.type === 'pill') typeName = 'Đan Dược';
      else if (item.type === 'weapon') typeName = 'Binh Khí';
      else if (item.type === 'armor') typeName = 'Hộ Giáp';
      else if (item.type === 'artifact') typeName = 'Pháp Bảo';
      else if (item.type === 'herb') typeName = 'Linh Dược';
      else if (item.type === 'ore') typeName = 'Khoáng Thạch';
      else if (item.type === 'monster_mat') typeName = 'Dị Bảo Yêu Thú';
      else if (item.type === 'talisman') typeName = 'Phù Lục';
      else if (item.type === 'tea') typeName = 'Linh Trà';
      else if (item.type === 'chest') typeName = 'Bảo Hạp';
      else if (item.type === 'treasure_map') typeName = 'Cổ Đồ Tầm Bảo';
      else if (item.type === 'secret_tome') typeName = 'Tàn Quyển Bí Tịch';
      else if (item.type === 'pet_egg') typeName = 'Linh Thú Noãn';

      if (iconEl) iconEl.innerHTML = getItemPixelSvg(item.id, 44);
      if (nameEl) {
        nameEl.textContent = `${item.name}${item.refineLevel ? ' +' + item.refineLevel : ''}`;
        nameEl.style.color = rarityColor;
      }
      if (rarityEl) {
        rarityEl.textContent = rarity;
        rarityEl.style.color = rarityColor;
        rarityEl.style.borderColor = rarityColor;
      }
      if (typeEl) typeEl.textContent = typeName;

      const ownedCount = (p.inventory && p.inventory[item.id]) || (source && source.startsWith('equipped_') ? 1 : 0);
      if (countEl) countEl.textContent = `Sở Hữu: ${ownedCount}`;

      if (descEl) descEl.textContent = item.desc || 'Bảo vật linh diệu ẩn chứa thiên cơ.';
      if (priceEl) priceEl.textContent = `${item.price || 0} Linh Thạch`;

      // Thuộc tính
      if (statsList) {
        statsList.innerHTML = '';
        if (item.trait) statsList.innerHTML += `<div class="item-stat-badge text-gold">✨ Đặc Tính: ${item.trait}</div>`;
        if (item.rawEffectDesc) statsList.innerHTML += `<div class="item-stat-badge text-emerald">🍃 Dược Lực Nuốt Trực Tiếp: ${item.rawEffectDesc}</div>`;
        if (item.refineLevel) statsList.innerHTML += `<div class="item-stat-badge text-gold">🔨 Thối Luyện Cấp: +${item.refineLevel} (+${item.refineLevel * 15}% Chỉ số)</div>`;
        if (item.atk) statsList.innerHTML += `<div class="item-stat-badge text-red">⚔️ Công Kích: +${item.atk}</div>`;
        if (item.def) statsList.innerHTML += `<div class="item-stat-badge text-cyan">🛡️ Phòng Ngự: +${item.def}</div>`;
        if (item.hp) statsList.innerHTML += `<div class="item-stat-badge text-red">🩸 Khí Huyết: +${item.hp} HP</div>`;
        if (item.mp) statsList.innerHTML += `<div class="item-stat-badge text-cyan">💧 Linh Lực: +${item.mp} MP</div>`;
        if (item.crit) statsList.innerHTML += `<div class="item-stat-badge text-gold">⚡ Bạo Kích: +${Math.floor(item.crit * 100)}%</div>`;
        if (item.healPercent) statsList.innerHTML += `<div class="item-stat-badge text-emerald">🩸 Hồi Phục: +${Math.floor(item.healPercent * 100)}% Khí Huyết</div>`;
        if (item.mpPercent) statsList.innerHTML += `<div class="item-stat-badge text-cyan">💧 Hồi Phục: +${Math.floor(item.mpPercent * 100)}% Linh Lực</div>`;
        if (item.expGain) statsList.innerHTML += `<div class="item-stat-badge text-purple">🌟 Đan Khí: +${item.expGain} Tu Vi</div>`;
        if (item.breakBonus) statsList.innerHTML += `<div class="item-stat-badge text-gold">⚡ Tỷ Lệ Đột Phá: +${Math.floor(item.breakBonus * 100)}%</div>`;
        if (item.lifespanGain) statsList.innerHTML += `<div class="item-stat-badge text-gold">⏳ Kéo Dài Thọ Nguyên: +${item.lifespanGain} Năm</div>`;
        if (item.shieldAmount) statsList.innerHTML += `<div class="item-stat-badge text-gold">🛡️ Hộ Thuẫn: +${item.shieldAmount} Sát Thương</div>`;
        if (item.dmg) statsList.innerHTML += `<div class="item-stat-badge text-red">💥 Sát Thương: ${item.dmg} Điểm</div>`;
        if (item.speedBuff) statsList.innerHTML += `<div class="item-stat-badge text-cyan">💨 Thân Pháp: +${Math.floor(item.speedBuff * 100)}%</div>`;
        if (item.teaDuration) statsList.innerHTML += `<div class="item-stat-badge text-gold">🍵 Ngộ Đạo: x2 Tốc độ tu vi (${item.teaDuration}s)</div>`;
        if (item.cleanseDebuff) statsList.innerHTML += `<div class="item-stat-badge text-cyan">✨ Hóa Giải: Toàn bộ hiệu ứng xấu</div>`;
        if (item.compGain) statsList.innerHTML += `<div class="item-stat-badge text-gold">🧠 Ngộ Tính: +${item.compGain}% Vĩnh Viễn</div>`;

        if (statsList.innerHTML === '') {
          statsList.innerHTML = `<div class="item-stat-badge" style="color: var(--text-dim);">Vật phẩm tài nguyên quý giá dùng trong luyện đan hoặc rèn đúc pháp khí.</div>`;
        }
      }

      // Nguồn gốc & Cách thu thập
      const sourceSection = document.getElementById('item-detail-source-section');
      const sourceText = document.getElementById('item-detail-source-text');
      const sourceActions = document.getElementById('item-detail-source-actions');
      if (sourceSection && sourceText) {
        sourceText.textContent = item.howToGet || 'Vật phẩm có thể tìm thấy trong thế giới tu tiên qua lịch luyện, tầm bảo hoặc giao dịch.';
        if (sourceActions) {
          sourceActions.innerHTML = '';
          const sources = item.sources || [];
          const sourceStr = (item.howToGet || '') + ' ' + sources.join(' ');

          if (sourceStr.includes('Phường Thị') || sources.includes('market')) {
            const btn = document.createElement('button');
            btn.className = 'pixel-btn small-btn item-source-nav-btn';
            btn.innerHTML = '🏪 Đến Phường Thị';
            btn.onclick = () => {
              modal.classList.add('hidden');
              switchTab('tab-market');
            };
            sourceActions.appendChild(btn);
          }

          if (sourceStr.includes('Luyện đan') || sourceStr.includes('Luyện Đan') || sources.includes('alchemy')) {
            const btn = document.createElement('button');
            btn.className = 'pixel-btn small-btn item-source-nav-btn';
            btn.innerHTML = '🧪 Đến Lò Luyện Đan';
            btn.onclick = () => {
              modal.classList.add('hidden');
              switchTab('tab-alchemy');
            };
            sourceActions.appendChild(btn);
          }

          if (sourceStr.includes('Linh Sơn') || sourceStr.includes('Vạn Yêu') || sourceStr.includes('Cổ Kiếm') || sourceStr.includes('Huyết Sát') || sourceStr.includes('Thượng Cổ') || sourceStr.includes('Hái') || sourceStr.includes('Đào mỏ') || sourceStr.includes('Bí Cảnh')) {
            const btn = document.createElement('button');
            btn.className = 'pixel-btn small-btn item-source-nav-btn';
            btn.innerHTML = '🧭 Đến Vùng Săn / Hái';
            btn.onclick = () => {
              modal.classList.add('hidden');
              switchTab('tab-world');
            };
            sourceActions.appendChild(btn);
          }

          if (sourceStr.includes('Tông Môn') || sources.includes('sect')) {
            const btn = document.createElement('button');
            btn.className = 'pixel-btn small-btn item-source-nav-btn';
            btn.innerHTML = '🏯 Đến Tông Môn';
            btn.onclick = () => {
              modal.classList.add('hidden');
              switchTab('tab-sect');
            };
            sourceActions.appendChild(btn);
          }
        }
      }

      // Thao tác
      const closeModal = () => modal.classList.add('hidden');
      if (btnClose) btnClose.onclick = closeModal;
      if (btnCloseX) btnCloseX.onclick = closeModal;

      const btnRefine = document.getElementById('btn-item-action-refine');
      if (btnRefine) {
        if (item.type === 'weapon' || item.type === 'armor' || item.type === 'artifact') {
          btnRefine.style.display = 'inline-block';
          const curLvl = item.refineLevel || 0;
          const nextLvl = curLvl + 1;
          const stoneCost = nextLvl * 200;
          btnRefine.textContent = `🔨 Thối Luyện (+${nextLvl} • ${stoneCost} đá)`;
          btnRefine.onclick = () => {
            this.refineEquipment(item.id, source);
          };
        } else {
          btnRefine.style.display = 'none';
        }
      }

      if (source === 'inventory') {
        if (item.type === 'pill') {
          btnPrimary.style.display = 'inline-block';
          btnPrimary.textContent = '💊 Nuốt Dược';
          btnPrimary.onclick = () => {
            this.useInventoryItem(item.id);
            closeModal();
          };
        } else if (item.type === 'herb') {
          btnPrimary.style.display = 'inline-block';
          btnPrimary.textContent = '🍃 Nuốt Thảo Dược';
          btnPrimary.onclick = () => {
            this.useInventoryItem(item.id);
            closeModal();
          };
        } else if (item.type === 'tea') {
          btnPrimary.style.display = 'inline-block';
          btnPrimary.textContent = '🍵 Thưởng Trà';
          btnPrimary.onclick = () => {
            this.useInventoryItem(item.id);
            closeModal();
          };
        } else if (item.type === 'chest') {
          btnPrimary.style.display = 'inline-block';
          btnPrimary.textContent = '🎁 Khai Mở';
          btnPrimary.onclick = () => {
            this.useInventoryItem(item.id);
            closeModal();
          };
        } else if (item.type === 'talisman') {
          btnPrimary.style.display = 'inline-block';
          btnPrimary.textContent = '📜 Kích Hoạt Phù';
          btnPrimary.onclick = () => {
            this.useInventoryItem(item.id);
            closeModal();
          };
        } else if (item.type === 'treasure_map') {
          btnPrimary.style.display = 'inline-block';
          btnPrimary.textContent = '🗺️ Tầm Bảo Thám Hiểm';
          btnPrimary.onclick = () => {
            this.useInventoryItem(item.id);
            closeModal();
          };
        } else if (item.type === 'secret_tome') {
          btnPrimary.style.display = 'inline-block';
          btnPrimary.textContent = '📜 Lĩnh Ngộ Bí Tịch';
          btnPrimary.onclick = () => {
            this.useInventoryItem(item.id);
            closeModal();
          };
        } else if (item.type === 'pet_egg') {
          btnPrimary.style.display = 'inline-block';
          btnPrimary.textContent = '🥚 Ấp Trứng (100 MP)';
          btnPrimary.onclick = () => {
            this.useInventoryItem(item.id);
            closeModal();
          };
        } else if (item.type === 'weapon' || item.type === 'armor' || item.type === 'artifact') {
          btnPrimary.style.display = 'inline-block';
          btnPrimary.textContent = '⚔️ Trang Bị';
          btnPrimary.onclick = () => {
            this.useInventoryItem(item.id);
            closeModal();
          };
        } else {
          btnPrimary.style.display = 'none';
        }

        btnSell.style.display = 'inline-block';
        const sellPrice = Math.max(1, Math.floor((item.price || 10) * 0.5));
        btnSell.textContent = `💰 Bán (+${sellPrice} Linh Thạch)`;
        btnSell.onclick = () => {
          this.sellItem(item.id);
          closeModal();
        };
      } else if (source === 'market') {
        btnPrimary.style.display = 'inline-block';
        btnPrimary.textContent = `🛒 Mua (${item.price} Linh Thạch)`;
        btnPrimary.onclick = () => {
          this.buyItem(item.id);
          closeModal();
        };
        btnSell.style.display = 'none';
      } else if (source === 'compendium') {
        const owned = (p.inventory && p.inventory[item.id]) || 0;
        const canUse = item.type === 'pill' || item.type === 'herb' || item.type === 'tea' || item.type === 'chest' || item.type === 'talisman' || item.type === 'treasure_map' || item.type === 'secret_tome' || item.type === 'pet_egg' || item.type === 'weapon' || item.type === 'armor' || item.type === 'artifact';
        if (owned > 0 && canUse) {
          btnPrimary.style.display = 'inline-block';
          btnPrimary.textContent = (item.type === 'weapon' || item.type === 'armor' || item.type === 'artifact') ? '⚔️ Trang Bị' : 'Sử Dụng';
          btnPrimary.onclick = () => {
            this.useInventoryItem(item.id);
            closeModal();
          };
        } else {
          btnPrimary.style.display = 'none';
        }
        btnSell.style.display = 'none';
      } else if (source && source.startsWith('equipped_')) {
        const slot = source.replace('equipped_', '');
        btnPrimary.style.display = 'inline-block';
        btnPrimary.textContent = '🎽 Tháo Trang Bị';
        btnPrimary.onclick = () => {
          this.unequipItem(slot);
          closeModal();
        };
        btnSell.style.display = 'none';
      }

      modal.classList.remove('hidden');
    }

    refineEquipment(itemId, source) {
      const p = this.player;
      if (!p) return;
      let item = ITEMS[itemId] ? JSON.parse(JSON.stringify(ITEMS[itemId])) : null;
      let isEquipped = false;
      let slot = null;

      if (source && source.startsWith('equipped_')) {
        slot = source.replace('equipped_', '');
        if (slot === 'weapon') item = p.equippedWeapon;
        if (slot === 'armor') item = p.equippedArmor;
        if (slot === 'artifact') item = p.equippedArtifact;
        if (item) item = JSON.parse(JSON.stringify(item));
        isEquipped = true;
      } else {
        if (!p.inventory[itemId] || p.inventory[itemId] <= 0) return;
        if (item.type !== 'weapon' && item.type !== 'armor' && item.type !== 'artifact') return;
      }

      if (!item) return;

      const curLevel = item.refineLevel || 0;
      const nextLevel = curLevel + 1;
      const stoneCost = nextLevel * 200;

      let reqOre = 'ore_huyenthiet';
      let oreName = 'Huyền Thiết Khoáng';
      if (curLevel >= 9) { reqOre = 'ore_thai_at'; oreName = 'Thái Ất Tinh Kim'; }
      else if (curLevel >= 6) { reqOre = 'ore_tutinh'; oreName = 'Tử Tinh Khoáng'; }
      else if (curLevel >= 3) { reqOre = 'ore_dong_tinh'; oreName = 'Thanh Đồng Cổ Tinh'; }

      const reqOreCount = 2;
      const ownedOre = (p.inventory && p.inventory[reqOre]) || 0;

      if ((p.spiritStones || 0) < stoneCost) {
        this.addLog(`Thối luyện thất bại: Cần ${stoneCost} Linh Thạch (Hiện có: ${p.spiritStones || 0})!`, 'warning');
        return;
      }
      if (ownedOre < reqOreCount) {
        this.addLog(`Thối luyện thất bại: Cần ${reqOreCount}x ${oreName} để thối luyện cấp +${nextLevel}!`, 'warning');
        return;
      }

      p.spiritStones -= stoneCost;
      p.inventory[reqOre] -= reqOreCount;

      let successRate = 1.0;
      if (curLevel >= 9) successRate = 0.4;
      else if (curLevel >= 6) successRate = 0.6;
      else if (curLevel >= 3) successRate = 0.8;

      if (Math.random() <= successRate) {
        item.refineLevel = nextLevel;
        const targetSlot = slot || (item.type === 'weapon' ? 'weapon' : item.type === 'armor' ? 'armor' : 'artifact');
        if (isEquipped) {
          p[`equipped${targetSlot.charAt(0).toUpperCase()}${targetSlot.slice(1)}`] = item;
        } else {
          p.inventory[itemId]--;
          const oldItem = p[`equipped${targetSlot.charAt(0).toUpperCase()}${targetSlot.slice(1)}`];
          if (oldItem && oldItem.id) p.inventory[oldItem.id] = (p.inventory[oldItem.id] || 0) + 1;
          p[`equipped${targetSlot.charAt(0).toUpperCase()}${targetSlot.slice(1)}`] = item;
        }
        sound.playBreakthrough();
        this.renderer.addFloatingText(`THỐI LUYỆN +${nextLevel}!`, 320, 160, '#facc15', true);
        this.addLog(`🔥 Thối luyện thành công 【${item.name}】 lên +${nextLevel}! Uy lực tăng thêm 15%!`, 'golden');
      } else {
        sound.playHurt();
        this.renderer.addFloatingText(`THẤT BẠI!`, 320, 160, '#ef4444');
        this.addLog(`💥 Lửa lò bùng nổ, thối luyện 【${item.name}】 lên +${nextLevel} thất bại! Tiêu hao linh thạch và khoáng thạch.`, 'danger');
      }

      this.recalculatePlayerStats();
      this.updateUI();
      this.showItemDetail(item.id, source);
    }

    unequipItem(slot) {
      const p = this.player;
      if (!p) return;
      if (slot === 'weapon' && p.equippedWeapon) {
        const id = p.equippedWeapon.id;
        if (id) p.inventory[id] = (p.inventory[id] || 0) + 1;
        this.addLog(`Đã tháo vũ khí 【${p.equippedWeapon.name}】 cất vào túi đồ!`, 'system');
        p.equippedWeapon = null;
      } else if (slot === 'armor' && p.equippedArmor) {
        const id = p.equippedArmor.id;
        if (id) p.inventory[id] = (p.inventory[id] || 0) + 1;
        this.addLog(`Đã tháo hộ giáp 【${p.equippedArmor.name}】 cất vào túi đồ!`, 'system');
        p.equippedArmor = null;
      } else if (slot === 'artifact' && p.equippedArtifact) {
        const id = p.equippedArtifact.id;
        if (id) p.inventory[id] = (p.inventory[id] || 0) + 1;
        this.addLog(`Đã tháo pháp bảo 【${p.equippedArtifact.name}】 cất vào túi đồ!`, 'system');
        p.equippedArtifact = null;
      }
      this.recalculatePlayerStats();
      sound.playClick();
      this.updateUI();
    }

    showConfirm(title, message, onConfirm, onCancel) {
      const modal = document.getElementById('custom-confirm-modal');
      const titleEl = document.getElementById('confirm-title-text');
      const msgEl = document.getElementById('confirm-message-text');
      const btnYes = document.getElementById('btn-confirm-yes');
      const btnNo = document.getElementById('btn-confirm-no');
      if (!modal) {
        if (confirm(message)) { if (onConfirm) onConfirm(); } else { if (onCancel) onCancel(); }
        return;
      }
      if (titleEl) titleEl.textContent = title || 'THIÊN ĐẠO CẢNH BÁO';
      if (msgEl) msgEl.textContent = message || '';

      const cleanup = () => {
        modal.classList.add('hidden');
        btnYes.onclick = null;
        btnNo.onclick = null;
      };

      btnYes.onclick = () => {
        cleanup();
        if (onConfirm) onConfirm();
      };
      btnNo.onclick = () => {
        cleanup();
        if (onCancel) onCancel();
      };

      modal.classList.remove('hidden');
    }

    showAlert(title, message, onClose) {
      const modal = document.getElementById('custom-alert-modal');
      const titleEl = document.getElementById('alert-modal-header');
      const msgEl = document.getElementById('alert-message-text');
      const btnOk = document.getElementById('btn-alert-ok');
      if (!modal) {
        alert(message);
        if (onClose) onClose();
        return;
      }
      if (titleEl) titleEl.textContent = title || 'THIÊN THƯ THÔNG BÁO';
      if (msgEl) msgEl.textContent = message || '';

      const cleanup = () => {
        modal.classList.add('hidden');
        btnOk.onclick = null;
        if (onClose) onClose();
      };

      btnOk.onclick = cleanup;
      modal.classList.remove('hidden');
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

    ensureWorldState() {
      const p = this.player;
      if (!p) return;
      if (!p.worldLocation || !WORLD_REGIONS.some(r => r.id === p.worldLocation)) p.worldLocation = 'region_1';
      const savedRegion = WORLD_REGIONS.find(r => r.id === p.worldLocation) || WORLD_REGIONS[0];
      if (!p.worldGridPosition || !Number.isFinite(p.worldGridPosition.x) || !Number.isFinite(p.worldGridPosition.y)) {
        p.worldGridPosition = { x: savedRegion.gridX, y: savedRegion.gridY };
      }
      if (!p.worldAlliances) p.worldAlliances = [];
      if (!p.worldRelations) p.worldRelations = {};
      if (!p.worldMetTravelers) p.worldMetTravelers = [];
      if (p.worldEncounterRewardClaimed === undefined) p.worldEncounterRewardClaimed = false;
      if (p.worldFaction === undefined) p.worldFaction = null;
      if (p.worldResidence === undefined) p.worldResidence = null;
      if (!this.currentRegion || !WORLD_REGIONS.some(r => r.id === this.currentRegion.id)) {
        this.currentRegion = WORLD_REGIONS.find(r => r.id === p.worldLocation) || WORLD_REGIONS[0];
      }
    }

    getWorldRegion(regionId) {
      return WORLD_REGIONS.find(region => region.id === regionId) || WORLD_REGIONS[0];
    }

    getWorldTravelCost(region) {
      return 20 + Math.max(0, region.reqRealmIndex) * 5;
    }

    travelToWorldRegion(regionId) {
      const p = this.player;
      if (!p) return;
      this.ensureWorldState();
      const region = this.getWorldRegion(regionId);
      if (p.realmIndex < region.reqRealmIndex) {
        const reqRealm = REALMS[region.reqRealmIndex];
        this.addLog(`Chưa đủ tu vi để đi đến 【${region.name}】! Cần 【${reqRealm.name}】.`, 'warning');
        this.renderOpenWorldUI();
        return;
      }

      const cost = this.getWorldTravelCost(region);
      if (p.worldLocation !== region.id) {
        if ((p.spiritStones || 0) < cost) {
          this.addLog(`Không đủ Linh Thạch để vượt đường đến 【${region.name}】 (cần ${cost}).`, 'warning');
          return;
        }
        p.spiritStones -= cost;
        p.worldLocation = region.id;
        this.addLog(`🧭 Đạo hữu vượt qua ${cost} Linh Thạch truyền tống, đặt chân đến 【${region.name}】!`, 'system');
      } else {
        this.addLog(`Đạo hữu đang ở 【${region.name}】.`, 'system');
      }

      this.currentRegion = region;
      p.worldGridPosition = { x: region.gridX, y: region.gridY };
      this.worldEncounter = null;
      sound.playClick();
      this.updateUI();
    }

    openWorldExplore() {
      const p = this.player;
      if (!p) return;
      this.ensureWorldState();
      const region = this.getWorldRegion(p.worldLocation);
      this.currentRegion = region;
      if (p.realmIndex < region.reqRealmIndex) {
        this.exploreWorld();
        return;
      }

      // Mỗi chuyến đi có cơ hội gặp đạo hữu khác trước khi phát sinh kỳ ngộ hoặc chiến đấu.
      if (Math.random() < 0.35 && WORLD_TRAVELERS.some(t => t.regionId === region.id)) {
        this.meetWorldTraveler();
        return;
      }
      this.exploreWorld();
      this.renderOpenWorldUI();
    }

    meetWorldTraveler() {
      const p = this.player;
      if (!p) return;
      this.ensureWorldState();
      const travelers = WORLD_TRAVELERS.filter(t => t.regionId === p.worldLocation);
      if (travelers.length === 0) {
        this.addLog('Hôm nay vùng đất này vắng bóng đạo hữu, chỉ còn linh phong thổi qua.', 'system');
        return;
      }

      const traveler = travelers[Math.floor(Math.random() * travelers.length)];
      this.worldEncounter = traveler;
      p.worldEncounterRewardClaimed = false;
      if (!p.worldMetTravelers.includes(traveler.id)) p.worldMetTravelers.push(traveler.id);
      const realm = REALMS[Math.min(traveler.realmIndex, REALMS.length - 1)];
      this.addLog(`🤝 Gặp 【${traveler.name}】 — ${traveler.title}, cảnh giới 【${realm.name}】 tại 【${this.currentRegion.name}】.`, 'golden');
      sound.playClick();
      this.renderOpenWorldUI();
      this.saveToLocalStorage();
    }

    socializeWorldTraveler() {
      const player = this.player;
      const traveler = this.worldEncounter;
      if (!player || !traveler) return;
      this.ensureWorldState();
      if (player.worldEncounterRewardClaimed) {
        this.addLog(`【${traveler.name}】 đã nhận lời giao du trong lần gặp này. Hãy khám phá tiếp để gặp lại đạo hữu.`, 'warning');
        this.renderOpenWorldUI();
        return;
      }

      player.worldEncounterRewardClaimed = true;
      player.worldRelations[traveler.id] = (player.worldRelations[traveler.id] || 0) + 1;
      const gift = 40 + traveler.realmIndex * 10;
      player.spiritStones += gift;
      this.addLog(`🍵 Đạo hữu cùng 【${traveler.name}】 luận đạo giao du. Tình hữu nghị tăng lên, nhận ${gift} Linh Thạch!`, 'loot');
      sound.playLoot();
      this.updateUI();
      this.saveToLocalStorage();
    }

    recruitWorldTraveler() {
      const p = this.player;
      const traveler = this.worldEncounter;
      if (!p || !traveler) return;
      if (!p.worldFaction) {
        this.addLog('Cần lập thế lực riêng trước khi chiêu mộ đồng đạo.', 'warning');
        return;
      }
      p.worldFaction.members = p.worldFaction.members || [p.name];
      if (p.worldFaction.members.includes(traveler.name)) {
        this.addLog(`【${traveler.name}】 đã là thành viên của 【${p.worldFaction.name}】.`, 'warning');
        return;
      }
      const relation = p.worldRelations[traveler.id] || 0;
      if (relation < 1) {
        this.addLog(`Hãy giao du với 【${traveler.name}】 trước để tạo lòng tin.`, 'warning');
        return;
      }
      const cost = 250 + traveler.realmIndex * 25;
      if ((p.spiritStones || 0) < cost) {
        this.addLog(`Không đủ Linh Thạch chuẩn bị lễ vật chiêu mộ (cần ${cost}).`, 'warning');
        return;
      }
      p.spiritStones -= cost;
      p.worldFaction.members.push(traveler.name);
      p.worldFaction.influence = (p.worldFaction.influence || 0) + 5;
      this.addLog(`🏳️ 【${traveler.name}】 nhận lời gia nhập 【${p.worldFaction.name}】! Thế lực tăng 5 ảnh hưởng.`, 'golden');
      sound.playBreakthrough();
      this.updateUI();
    }

    createWorldFaction() {
      const p = this.player;
      if (!p) return;
      if (p.worldFaction) {
        this.addLog(`Đạo hữu đã có thế lực 【${p.worldFaction.name}】.`, 'warning');
        return;
      }
      const nameInput = document.getElementById('world-faction-name');
      const mottoInput = document.getElementById('world-faction-motto');
      const name = nameInput ? nameInput.value.trim() : '';
      const motto = mottoInput ? mottoInput.value.trim() : '';
      if (name.length < 2 || name.length > 24) {
        this.addLog('Tên thế lực cần dài từ 2 đến 24 ký tự.', 'warning');
        return;
      }
      const cost = 1200;
      const oreNeed = 2;
      if ((p.spiritStones || 0) < cost || (p.inventory.ore_huyenthiet || 0) < oreNeed) {
        this.addLog(`Lập thế lực cần ${cost} Linh Thạch và ${oreNeed} Huyền Thiết Tinh.`, 'warning');
        return;
      }
      p.spiritStones -= cost;
      p.inventory.ore_huyenthiet -= oreNeed;
      p.worldFaction = {
        id: `player_faction_${Date.now()}`,
        name,
        motto: motto || 'Đồng tâm đồng đạo, cùng vấn đỉnh trường sinh.',
        type: 'Thế lực do người chơi sáng lập',
        level: 1,
        influence: 10,
        foundedRegionId: p.worldLocation,
        members: [p.name]
      };
      this.addLog(`🏯 Lập 【${name}】 thành công tại 【${this.currentRegion.name}】! Các đạo hữu quanh vùng bắt đầu chú ý đến thế lực mới.`, 'golden');
      sound.playBreakthrough();
      this.updateUI();
    }

    upgradeWorldFaction() {
      const p = this.player;
      if (!p || !p.worldFaction) return;
      const faction = p.worldFaction;
      faction.level = faction.level || 1;
      if (faction.level >= 5) {
        this.addLog('Thế lực đã đạt cấp tối đa trong phiên bản hiện tại.', 'warning');
        return;
      }
      const cost = 900 * faction.level;
      if ((p.spiritStones || 0) < cost) {
        this.addLog(`Cần ${cost} Linh Thạch để mở rộng thế lực.`, 'warning');
        return;
      }
      p.spiritStones -= cost;
      faction.level++;
      faction.influence = (faction.influence || 0) + 15;
      this.addLog(`🏗️ 【${faction.name}】 mở rộng thành công lên cấp ${faction.level}, ảnh hưởng +15!`, 'golden');
      this.updateUI();
    }

    buildWorldResidence() {
      const p = this.player;
      if (!p) return;
      this.ensureWorldState();
      const region = this.getWorldRegion(p.worldLocation);
      if (p.worldResidence && p.worldResidence.regionId !== region.id) {
        this.addLog(`Đạo hữu đã có cư trú tại 【${this.getWorldRegion(p.worldResidence.regionId).name}】. Hãy nâng cấp hoặc di chuyển cư trú sau.`, 'warning');
        return;
      }
      const level = p.worldResidence ? p.worldResidence.level : 0;
      if (level >= 3) {
        this.addLog('Cư trú đã đạt cấp tối đa.', 'warning');
        return;
      }
      const nextLevel = level + 1;
      const stoneCost = level === 0 ? 500 : 700 * nextLevel;
      const oreCost = level === 0 ? 2 : nextLevel;
      const herbCost = level === 0 ? 3 : nextLevel + 1;
      if ((p.spiritStones || 0) < stoneCost || (p.inventory.ore_huyenthiet || 0) < oreCost || (p.inventory.herb_linhchi || 0) < herbCost) {
        this.addLog(`Xây cư trú cấp ${nextLevel} cần ${stoneCost} Linh Thạch, ${oreCost} Huyền Thiết Tinh và ${herbCost} Linh Chi Thảo.`, 'warning');
        return;
      }
      p.spiritStones -= stoneCost;
      p.inventory.ore_huyenthiet -= oreCost;
      p.inventory.herb_linhchi -= herbCost;
      p.worldResidence = {
        regionId: region.id,
        level: nextLevel,
        name: level === 0 ? `Động Phủ ${p.name}` : (p.worldResidence.name || `Động Phủ ${p.name}`)
      };
      this.addLog(`🏠 ${level === 0 ? 'Dựng cư trú' : 'Nâng cấp cư trú'} tại 【${region.name}】 thành công, đạt cấp ${nextLevel}!`, 'golden');
      sound.playLoot();
      this.updateUI();
    }

    formWorldAlliance(factionId) {
      const p = this.player;
      const faction = WORLD_FACTIONS.find(item => item.id === factionId);
      if (!p || !faction) return;
      if (!p.worldFaction) {
        this.addLog('Cần lập thế lực riêng trước khi kết minh.', 'warning');
        return;
      }
      if (p.worldAlliances.includes(faction.id)) {
        this.addLog(`Đã kết minh với 【${faction.name}】 rồi.`, 'warning');
        return;
      }
      if (p.realmIndex < faction.reqRealmIndex) {
        this.addLog(`Muốn kết minh với 【${faction.name}】 cần đạt 【${REALMS[faction.reqRealmIndex].name}】.`, 'warning');
        return;
      }
      const cost = 500 + faction.influence * 10;
      if ((p.spiritStones || 0) < cost) {
        this.addLog(`Cần ${cost} Linh Thạch để chuẩn bị lễ kết minh với 【${faction.name}】.`, 'warning');
        return;
      }
      p.spiritStones -= cost;
      p.worldAlliances.push(faction.id);
      p.worldFaction.influence = (p.worldFaction.influence || 0) + faction.influence;
      this.addLog(`🤝 【${p.worldFaction.name}】 chính thức kết minh cùng 【${faction.name}】!`, 'golden');
      sound.playBreakthrough();
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
          const drinkExpGain = this.addCultivationExp(expGain);
          this.addLog(`Linh dịch tẩy tủy! Tu vi bạo tăng ${drinkExpGain} điểm!`, 'golden');
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
          }
          break;
        case 'accept_deal':
          if ((p.spiritStones || 0) < 100) {
            this.addLog('Không đủ 100 Linh Thạch để giao dịch với tà tu.', 'warning');
            break;
          }
          p.spiritStones = Math.max(0, p.spiritStones - 100);
          p.age = Math.min(p.maxLifespan, p.age + 5);
          const dealExpGain = this.addCultivationExp(3000);
          this.addLog(`Uống Huyết Đan tà đạo: Đổi 100 Linh Thạch và 5 năm thọ nguyên lấy ${dealExpGain} Tu Vi!`, 'danger');
          if (p.age >= p.maxLifespan) this.handleDeathByAge();
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
      const combatSkill = (p.skills && p.skills[0]) || p.activeSkill;
      if (combatSkill) {
        combatSkill.dmgMult = Number(((combatSkill.dmgMult || 1) * 1.25).toFixed(2));
        p.activeSkill = combatSkill;
      }
      sound.playCheatSystem();
      this.addLog(`🌀 [Kim Thủ Chỉ] 【Đốn Ngộ Thành Công】! Kỹ năng 【${combatSkill ? combatSkill.name : 'chưa lĩnh ngộ'}】 thăng lên Tầng ${p.skillMastery}! Sát thương tăng 25%!`, 'system');
      this.updateUI();
    }

    craftRecipe(recipeId) {
      const recipe = RECIPES.find(r => r.id === recipeId);
      if (!recipe) return;
      if (recipe.type === 'alchemy') {
        this.startInteractiveAlchemy(recipeId);
      } else {
        this.craftEquipment(recipeId);
      }
    }

    craftEquipment(recipeId) {
      const p = this.player;
      const recipe = RECIPES.find(r => r.id === recipeId);
      if (!recipe) return;

      for (const [itemId, count] of Object.entries(recipe.ingredients)) {
        if ((p.inventory[itemId] || 0) < count) {
          const itemObj = ITEMS[itemId];
          this.addLog(`Không đủ nguyên liệu 【${itemObj ? itemObj.name : itemId}】 (cần ${count}, có ${p.inventory[itemId] || 0})!`, 'warning');
          return;
        }
      }

      for (const [itemId, count] of Object.entries(recipe.ingredients)) {
        p.inventory[itemId] -= count;
      }

      this.renderer.setScene(SCENES.ALCHEMY);
      let rate = recipe.successRate;
      if (p.cultivationPath && p.cultivationPath.id === 'luyen_khi_su') rate += 0.15;

      setTimeout(() => {
        this.renderer.setScene(SCENES.MEDITATE);
        if (Math.random() < rate) {
          sound.playLoot();
          p.inventory[recipe.resultId] = (p.inventory[recipe.resultId] || 0) + 1;
          const resultItem = ITEMS[recipe.resultId];
          this.addLog(`🔨 Rèn đúc thành công! Thần binh xuất thế, nhận được 【${resultItem ? resultItem.name : recipe.resultId}】 x1!`, 'loot');
          this.renderer.addFloatingText('RÈN THÀNH!', 320, 160, '#facc15', true);
        } else {
          sound.playHurt();
          this.addLog(`💥 Rèn thất bại! Thần thiết vỡ vụn do khống chế đan hỏa chưa chuẩn!`, 'danger');
        }
        this.updateUI();
      }, 1200);
    }

    startInteractiveAlchemy(recipeId) {
      const p = this.player;
      const recipe = RECIPES.find(r => r.id === recipeId);
      if (!recipe) return;

      if (this.alchemySession && this.alchemySession.active) {
        this.addLog('Lò luyện đang vận hành, hãy hoàn tất mẻ đan hiện tại!', 'warning');
        return;
      }

      for (const [itemId, count] of Object.entries(recipe.ingredients)) {
        if ((p.inventory[itemId] || 0) < count) {
          const itemObj = ITEMS[itemId];
          this.addLog(`Không đủ nguyên liệu 【${itemObj ? itemObj.name : itemId}】 (cần ${count}, có ${p.inventory[itemId] || 0})!`, 'warning');
          return;
        }
      }

      for (const [itemId, count] of Object.entries(recipe.ingredients)) {
        p.inventory[itemId] -= count;
      }

      let targetMin = 40;
      let targetMax = 70;
      if (recipe.reqRealmIndex >= 14) {
        targetMin = 50;
        targetMax = 65;
      }

      if (this.alchemyInterval) clearInterval(this.alchemyInterval);
      this.alchemySession = {
        active: true,
        recipe: recipe,
        temp: 35,
        purity: 50,
        fireMode: 'gentle',
        targetMin: targetMin,
        targetMax: targetMax,
        overheatTicks: 0
      };

      this.renderer.setScene(SCENES.ALCHEMY);
      this.updateAlchemyPanelUI();

      this.alchemyInterval = setInterval(() => {
        if (!this.alchemySession || !this.alchemySession.active) {
          clearInterval(this.alchemyInterval);
          return;
        }
        const sess = this.alchemySession;
        if (sess.fireMode === 'martial') {
          sess.temp = Math.min(105, sess.temp + 1.4);
        } else {
          sess.temp = Math.max(15, sess.temp - 0.8);
        }

        if (sess.temp >= sess.targetMin && sess.temp <= sess.targetMax) {
          sess.purity = Math.min(100, sess.purity + 0.6);
        } else {
          sess.purity = Math.max(0, sess.purity - 0.4);
        }

        if (sess.temp >= 95) {
          sess.overheatTicks++;
          if (sess.overheatTicks >= 20) {
            this.explodeCauldron();
            return;
          }
        } else {
          sess.overheatTicks = Math.max(0, sess.overheatTicks - 1);
        }

        this.updateAlchemyPanelUI();
      }, 100);

      this.addLog(`🔥 Khai lò! Bắt đầu luyện chế 【${recipe.name}】. Hãy giữ nhiệt độ trong khoảng [${targetMin}°C - ${targetMax}°C] rồi bấm Thu Đan!`, 'golden');
      this.updateUI();
    }

    setAlchemyFireMode(mode) {
      if (!this.alchemySession || !this.alchemySession.active) return;
      this.alchemySession.fireMode = mode;
      this.updateAlchemyPanelUI();
    }

    harvestPill() {
      if (!this.alchemySession || !this.alchemySession.active) return;
      const sess = this.alchemySession;
      if (this.alchemyInterval) clearInterval(this.alchemyInterval);
      sess.active = false;
      this.renderer.setScene(SCENES.MEDITATE);

      const purity = Math.round(sess.purity);
      let grade = 'Hạ Phẩm';
      let gradeBonus = '';
      let count = 1;

      if (purity >= 90) {
        grade = 'CỰC PHẨM';
        count = 2;
        gradeBonus = ' (Dược lực tuyệt đỉnh, sinh đôi đan x2!)';
      } else if (purity >= 70) {
        grade = 'THƯỢNG PHẨM';
        gradeBonus = ' (Dược lực tinh thuần 150%)';
      } else if (purity >= 50) {
        grade = 'TRUNG PHẨM';
        gradeBonus = ' (Dược lực đạt chuẩn)';
      } else {
        grade = 'HẠ PHẨM';
        gradeBonus = ' (Dược lực suy giảm do lẫn tạp chất)';
      }

      const p = this.player;
      p.inventory[sess.recipe.resultId] = (p.inventory[sess.recipe.resultId] || 0) + count;
      sound.playLoot();

      const resultItem = ITEMS[sess.recipe.resultId];
      this.addLog(`✨ Đan thành mở nắp! Luyện thành 【${resultItem ? resultItem.name : sess.recipe.resultId}】 x${count} — Phẩm cấp: 【${grade}】 (Tinh thuần: ${purity}%)${gradeBonus}!`, 'loot');
      this.renderer.addFloatingText(`${grade} ĐAN!`, 320, 160, purity >= 90 ? '#facc15' : '#38bdf8', true);

      this.alchemySession = null;
      this.updateAlchemyPanelUI();
      this.updateUI();
    }

    explodeCauldron() {
      if (this.alchemyInterval) clearInterval(this.alchemyInterval);
      if (this.alchemySession) this.alchemySession.active = false;
      this.alchemySession = null;

      this.renderer.triggerShake(14, 25);
      this.renderer.spawnSmokeParticles(25);
      sound.playHurt();

      this.addLog(`💥 NỔ LÒ! Nhiệt độ đan hỏa quá cao vượt ngưỡng khống chế khiến lò thần phát nổ! Toàn bộ linh dược hóa thành tro bụi!`, 'danger');
      this.renderer.addFloatingText('💥 NỔ LÒ ĐAN!', 320, 160, '#ef4444', true);

      setTimeout(() => {
        this.renderer.setScene(SCENES.MEDITATE);
        this.updateAlchemyPanelUI();
        this.updateUI();
      }, 1200);
    }

    updateAlchemyPanelUI() {
      const panel = document.getElementById('interactive-alchemy-panel');
      if (!panel) return;

      if (!this.alchemySession || !this.alchemySession.active) {
        panel.classList.add('hidden');
        return;
      }

      panel.classList.remove('hidden');
      const sess = this.alchemySession;
      const titleEl = document.getElementById('alchemy-recipe-title');
      const gradeEl = document.getElementById('alchemy-grade-preview');
      const purityBar = document.getElementById('alchemy-purity-bar');
      const purityText = document.getElementById('alchemy-purity-text');
      const tempBar = document.getElementById('alchemy-temp-bar');
      const tempText = document.getElementById('alchemy-temp-text');
      const rangeText = document.getElementById('alchemy-target-range');
      const btnMartial = document.getElementById('btn-fire-martial');
      const btnGentle = document.getElementById('btn-fire-gentle');

      if (titleEl) titleEl.textContent = `🔥 Đang Luyện: ${sess.recipe.name}`;
      if (rangeText) rangeText.textContent = `${sess.targetMin}°C - ${sess.targetMax}°C`;

      const purity = Math.round(sess.purity);
      if (purityBar) purityBar.style.width = `${purity}%`;
      if (purityText) purityText.textContent = `${purity}%`;

      let curGrade = 'Hạ Phẩm';
      if (purity >= 90) curGrade = 'Cực Phẩm ⭐⭐⭐';
      else if (purity >= 70) curGrade = 'Thượng Phẩm ⭐⭐';
      else if (purity >= 50) curGrade = 'Trung Phẩm ⭐';
      if (gradeEl) gradeEl.textContent = `Dự kiến: ${curGrade}`;

      const temp = Math.round(sess.temp);
      if (tempText) tempText.textContent = `${temp}°C`;
      if (tempBar) {
        tempBar.style.width = `${Math.min(100, Math.max(0, temp))}%`;
        if (temp >= 95) tempBar.style.background = '#ef4444';
        else if (temp >= sess.targetMin && temp <= sess.targetMax) tempBar.style.background = '#22c55e';
        else tempBar.style.background = '#f59e0b';
      }

      if (btnMartial && btnGentle) {
        if (sess.fireMode === 'martial') {
          btnMartial.style.boxShadow = '0 0 10px #ef4444';
          btnGentle.style.boxShadow = 'none';
        } else {
          btnGentle.style.boxShadow = '0 0 10px #38bdf8';
          btnMartial.style.boxShadow = 'none';
        }
      }
    }

    openHerbEncyclopedia() {
      const modal = document.getElementById('herb-encyclopedia-modal');
      const listEl = document.getElementById('herb-encyclopedia-list');
      if (!modal || !listEl) return;

      listEl.innerHTML = '';
      Object.values(HERB_ENCYCLOPEDIA).forEach(herb => {
        const card = document.createElement('div');
        card.className = 'pixel-box';
        card.style.background = 'rgba(30, 41, 59, 0.7)';
        card.style.padding = '8px';
        card.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: bold; color: var(--text-gold); font-size: 14px;">🌿 ${herb.name}</span>
            <span class="badge-realm" style="font-size: 11px;">${herb.grade} • ${herb.nature}</span>
          </div>
          <div style="font-size: 12px; color: #94a3b8; margin: 4px 0;"><strong>Khu vực phân bố:</strong> ${herb.regions.join(', ')}</div>
          <div style="font-size: 12px; color: var(--text-dim); margin-bottom: 4px;"><em>"${herb.lore}"</em></div>
          <div style="font-size: 11px; color: #38bdf8;"><strong>Đan phương tương thích:</strong> ${herb.recipes.map(rId => {
            const r = RECIPES.find(rec => rec.id === rId);
            return r ? r.name : rId;
          }).join(', ')}</div>
        `;
        listEl.appendChild(card);
      });

      modal.classList.remove('hidden');
    }

    closeHerbEncyclopedia() {
      const modal = document.getElementById('herb-encyclopedia-modal');
      if (modal) modal.classList.add('hidden');
    }

    generateDungeon(region) {
      const nodes = [
        { id: 'f1_n1', floor: 1, type: 'combat', name: 'Canh Cổng Yêu Binh', status: 'available', nextNodes: ['f2_n1', 'f2_n2'] },
        { id: 'f1_n2', floor: 1, type: 'treasure', name: 'Túi Trữ Vật Rơi Rớt', status: 'available', nextNodes: ['f2_n2', 'f2_n3'] },

        { id: 'f2_n1', floor: 2, type: 'combat', name: 'Yêu Thú Trùng Vòng', status: 'locked', nextNodes: ['f3_n1', 'f3_n2'] },
        { id: 'f2_n2', floor: 2, type: 'event', name: 'Cấm Chế Cổ Trận', status: 'locked', nextNodes: ['f3_n1', 'f3_n2', 'f3_n3'] },
        { id: 'f2_n3', floor: 2, type: 'rest', name: 'Linh Tuyền Tĩnh Tọa', status: 'locked', nextNodes: ['f3_n2', 'f3_n3'] },

        { id: 'f3_n1', floor: 3, type: 'combat', name: 'Bầy Hung Thú', status: 'locked', nextNodes: ['f4_n1'] },
        { id: 'f3_n2', floor: 3, type: 'treasure', name: 'Bảo Khố Thượng Cổ', status: 'locked', nextNodes: ['f4_n1', 'f4_n2'] },
        { id: 'f3_n3', floor: 3, type: 'rest', name: 'Dược Điền Di Tích', status: 'locked', nextNodes: ['f4_n2'] },

        { id: 'f4_n1', floor: 4, type: 'elite', name: 'Thống Lãnh Yêu Ma (Tinh Anh)', status: 'locked', nextNodes: ['f5_n1'] },
        { id: 'f4_n2', floor: 4, type: 'treasure', name: 'Mật Thất Bí Kíp', status: 'locked', nextNodes: ['f5_n1'] },

        { id: 'f5_n1', floor: 5, type: 'boss', name: `Thủ Lĩnh Bí Cảnh 【${region.name}】`, status: 'locked', nextNodes: [] }
      ];

      return {
        regionId: region.id,
        regionName: region.name,
        currentFloor: 1,
        currentNodeId: null,
        cleared: false,
        nodes: nodes
      };
    }

    startDungeon(regionId) {
      const p = this.player;
      if (!p) return;
      const region = WORLD_REGIONS.find(r => r.id === regionId) || WORLD_REGIONS[0];
      if (p.realmIndex < region.reqRealmIndex) {
        this.addLog(`Cảnh giới chưa đủ để khai mở Bí Cảnh 【${region.name}】! (Cần: ${REALMS[region.reqRealmIndex].name})`, 'warning');
        return;
      }

      p.dungeonState = this.generateDungeon(region);
      this.addLog(`🌀 Đã bước vào Bí Cảnh 【${region.name}】! Cấm chế thượng cổ phong tỏa lối thoát, hãy vượt qua 5 tầng để thu hoạch cơ duyên!`, 'golden');
      this.renderDungeonMapUI();
      this.updateUI();
    }

    retreatDungeon() {
      const p = this.player;
      if (!p || !p.dungeonState) return;

      if (confirm('Đạo hữu có chắc muốn rút lui khỏi Bí Cảnh? Tiến trình thám hiểm hiện tại sẽ được lưu giữ hoặc làm mới!')) {
        p.dungeonState = null;
        const container = document.getElementById('dungeon-container');
        if (container) container.classList.add('hidden');
        this.addLog('💨 Đã an toàn rút lui khỏi Bí Cảnh trở về!', 'system');
        this.updateUI();
      }
    }

    enterDungeonNode(nodeId) {
      const p = this.player;
      if (!p || !p.dungeonState) return;
      const node = p.dungeonState.nodes.find(n => n.id === nodeId);
      if (!node || node.status !== 'available') {
        this.addLog('Lối đi này hiện chưa mở hoặc đã hoàn thành!', 'warning');
        return;
      }

      p.dungeonState.currentNodeId = nodeId;
      p.dungeonState.currentFloor = node.floor;
      node.status = 'current';
      this.renderDungeonMapUI();

      const region = WORLD_REGIONS.find(r => r.id === p.dungeonState.regionId) || WORLD_REGIONS[0];

      if (node.type === 'combat' || node.type === 'elite' || node.type === 'boss') {
        let monKey = region.monsters[Math.floor(Math.random() * region.monsters.length)];
        let baseMon = MONSTERS[monKey] || MONSTERS['wolf_novice'];
        let mon = JSON.parse(JSON.stringify(baseMon));

        if (node.type === 'elite') {
          mon.name = `[Tinh Anh] ${mon.name}`;
          mon.hp = Math.floor(mon.hp * 1.4);
          mon.atk = Math.floor(mon.atk * 1.3);
          mon.exp = Math.floor(mon.exp * 1.5);
          mon.stone = Math.floor(mon.stone * 1.5);
        } else if (node.type === 'boss') {
          mon.name = `👑 [THỦ LĨNH] ${mon.name}`;
          mon.hp = Math.floor(mon.hp * 2.2);
          mon.atk = Math.floor(mon.atk * 1.6);
          mon.def = Math.floor(mon.def * 1.4);
          mon.exp = Math.floor(mon.exp * 3.0);
          mon.stone = Math.floor(mon.stone * 4.0);
        }

        this.addLog(`⚔️ Bước vào phòng thử thách: Chạm trán 【${mon.name}】!`, 'battle');
        this.combatEngine.startCombat(this.player, mon, (won, fled) => {
          if (won) {
            this.handleDungeonNodeCleared(nodeId);
          } else {
            this.addLog('Thử thách thất bại! Bí cảnh bài xích đạo hữu trở ra...', 'danger');
            p.dungeonState = null;
            this.renderDungeonMapUI();
            this.updateUI();
          }
        });
      } else if (node.type === 'treasure') {
        const stones = Math.floor(Math.random() * 80) + 40;
        const herbKeys = region.herbs && region.herbs.length > 0 ? region.herbs : ['herb_linhchi'];
        const gainedHerb = herbKeys[Math.floor(Math.random() * herbKeys.length)];
        p.spiritStones += stones;
        p.inventory[gainedHerb] = (p.inventory[gainedHerb] || 0) + 2;
        sound.playLoot();

        const herbObj = ITEMS[gainedHerb];
        this.addLog(`🎁 Mở bảo rương tại phòng! Thu được +${stones} Linh Thạch và 【${herbObj ? herbObj.name : gainedHerb}】 x2!`, 'loot');
        this.renderer.addFloatingText(`+${stones} Linh Thạch`, 320, 160, '#facc15');
        this.handleDungeonNodeCleared(nodeId);
      } else if (node.type === 'rest') {
        const healHp = Math.floor(p.maxHp * 0.5);
        const healMp = Math.floor(p.maxMp * 0.5);
        p.curHp = Math.min(p.maxHp, p.curHp + healHp);
        p.curMp = Math.min(p.maxMp, p.curMp + healMp);
        sound.playBreakthrough();
        this.addLog(`💧 Ngồi đả tọa bên linh tuyền cổ xưa, hồi phục ${healHp} HP và ${healMp} MP!`, 'system');
        this.renderer.addFloatingText(`+${healHp} HP`, 320, 160, '#34d399');
        this.handleDungeonNodeCleared(nodeId);
      } else if (node.type === 'event') {
        const roll = Math.random();
        if (roll > 0.4) {
          const expGain = 150 * node.floor;
          const actualExpGain = this.addCultivationExp(expGain);
          this.addLog(`📜 Chiêm ngưỡng bia văn cổ đại, đạo tâm đại chấn! Thu được +${actualExpGain} Điểm Tu Vi!`, 'golden');
        } else {
          const dmg = Math.floor(p.maxHp * 0.15);
          p.curHp = Math.max(1, p.curHp - dmg);
          sound.playHurt();
          this.addLog(`⚡ Cấm chế bẫy cổ xưa kích hoạt! Bị thiên lôi phản phệ mất ${dmg} HP!`, 'danger');
        }
        this.handleDungeonNodeCleared(nodeId);
      }
    }

    handleDungeonNodeCleared(nodeId) {
      const p = this.player;
      if (!p || !p.dungeonState) return;
      const node = p.dungeonState.nodes.find(n => n.id === nodeId);
      if (!node) return;

      node.status = 'cleared';

      if (node.nextNodes && node.nextNodes.length > 0) {
        node.nextNodes.forEach(nxtId => {
          const nxt = p.dungeonState.nodes.find(n => n.id === nxtId);
          if (nxt && nxt.status === 'locked') {
            nxt.status = 'available';
          }
        });
      }

      if (node.floor === 5) {
        p.dungeonState.cleared = true;
        sound.playBreakthrough();
        this.renderer.addFloatingText('ĐẠI PHÁ BÍ CẢNH!', 320, 140, '#facc15', true);
        const grandBonus = 500;
        p.spiritStones += grandBonus;
        p.inventory['pill_trucco'] = (p.inventory['pill_trucco'] || 0) + 1;
        this.addLog(`👑 ĐẠI THẮNG QUANG VINH! Đạo hữu đã chinh phục toàn bộ 5 tầng Bí Cảnh 【${p.dungeonState.regionName}】! Thưởng lớn: +${grandBonus} Linh Thạch & 1 Trúc Cơ Đan!`, 'golden');
      }

      this.renderDungeonMapUI();
      this.updateUI();
    }

    renderDungeonMapUI() {
      const container = document.getElementById('dungeon-container');
      const mapEl = document.getElementById('dungeon-node-map');
      const titleEl = document.getElementById('dungeon-title');
      const statusText = document.getElementById('dungeon-status-text');

      if (!container || !mapEl) return;
      const p = this.player;
      if (!p || !p.dungeonState) {
        container.classList.add('hidden');
        return;
      }

      container.classList.remove('hidden');
      const ds = p.dungeonState;
      if (titleEl) titleEl.textContent = `🏯 ${ds.regionName} — Tầng ${ds.currentFloor}/5`;
      if (statusText) {
        statusText.textContent = ds.cleared
          ? '🎉 Toàn bộ Bí Cảnh đã được chinh phục thành công!'
          : 'Chọn lối đi phát sáng tiếp theo để tiến sâu vào bí cảnh...';
      }

      mapEl.innerHTML = '';

      for (let f = 1; f <= 5; f++) {
        const floorNodes = ds.nodes.filter(n => n.floor === f);
        const row = document.createElement('div');
        row.className = 'dungeon-floor-row';

        const label = document.createElement('div');
        label.style.fontSize = '11px';
        label.style.fontWeight = 'bold';
        label.style.color = '#94a3b8';
        label.style.minWidth = '50px';
        label.textContent = `Tầng ${f}:`;
        row.appendChild(label);

        floorNodes.forEach(n => {
          const btn = document.createElement('div');
          btn.className = `dungeon-node ${n.status}`;

          let icon = '⚔️';
          if (n.type === 'treasure') icon = '🎁';
          else if (n.type === 'rest') icon = '💧';
          else if (n.type === 'event') icon = '❓';
          else if (n.type === 'elite') icon = '👹';
          else if (n.type === 'boss') icon = '👑';

          btn.innerHTML = `
            <div style="font-size: 16px;">${icon}</div>
            <div style="font-size: 11px; margin-top: 2px;">${n.name}</div>
            <div style="font-size: 9px; color: #94a3b8; text-transform: uppercase;">${n.status === 'cleared' ? '✓ Đã Qua' : (n.status === 'current' ? '▶ Đang Ở' : (n.status === 'available' ? '★ Mở' : 'Khóa'))}</div>
          `;

          if (n.status === 'available') {
            btn.onclick = () => this.enterDungeonNode(n.id);
          }
          row.appendChild(btn);
        });

        mapEl.appendChild(row);
      }
    }

    refreshMarket() {
      const keys = Object.keys(ITEMS);
      for (let i = keys.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [keys[i], keys[j]] = [keys[j], keys[i]];
      }
      this.marketItems = keys.slice(0, 6).map(k => ({ ...JSON.parse(JSON.stringify(ITEMS[k])), stock: 1 }));
      this.renderMarketUI();
    }

    buyItem(itemId) {
      const p = this.player;
      const item = (this.marketItems || []).find(entry => entry && entry.id === itemId);
      if (!item) return;
      if (item.stock !== undefined && item.stock <= 0) {
        this.addLog(`【${item.name}】 đã hết hàng trong Phường Thị.`, 'warning');
        return;
      }

      if (p.spiritStones < item.price) {
        this.addLog(`Linh Thạch không đủ để mua 【${item.name}】 (cần ${item.price} Linh Thạch)!`, 'warning');
        return;
      }

      p.spiritStones -= item.price;
      p.inventory[itemId] = (p.inventory[itemId] || 0) + 1;
      if (item.stock !== undefined) item.stock--;
      sound.playLoot();
      this.addLog(`Đã mua 【${item.name}】 x1 từ Phường Thị với giá ${item.price} Linh Thạch.`, 'loot');
      this.renderMarketUI();
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

      if (p.sectId && p.sectId !== sect.id) {
        const oldSect = SECTS.find(item => item.id === p.sectId);
        const oldManualIds = Array.isArray(p.sectManualsBought) ? p.sectManualsBought : [];
        const oldManualSkills = [];
        oldManualIds.forEach(manualId => {
          const manual = oldSect && oldSect.manuals ? oldSect.manuals.find(item => item.id === manualId) : null;
          if (!manual) return;
          ['atk', 'def', 'hp', 'mp', 'crit', 'lifeSteal', 'lifespanGain'].forEach(key => {
            const targetKey = key === 'lifespanGain' ? 'bonusLifespan' : `bonus${key.charAt(0).toUpperCase()}${key.slice(1)}`;
            if (manual[key]) p[targetKey] = Math.max(0, (p[targetKey] || 0) - manual[key]);
          });
          if (manual.skill && manual.skill.id) oldManualSkills.push(manual.skill.id);
        });
        if (oldManualSkills.length) {
          p.knownSkills = (p.knownSkills || []).filter(skill => skill && !oldManualSkills.includes(skill.id));
          p.skills = (p.skills || []).filter(skill => skill && !oldManualSkills.includes(skill.id));
          p.activeSkill = p.skills[0] || null;
        }
        p.sectContrib = 0;
        p.sectContribTotal = 0;
        p.sectPatrolKills = 0;
        p.sectQuestKills = {};
        p.sectManualsBought = [];
        p.sectSalaryClaimedYear = -1;
        p.lastSectRank = null;
        this.addLog('Đổi tông môn: chức vị, cống hiến và bí tịch của sơn môn cũ đã được thanh toán lại.', 'warning');
      }
      p.sectId = sect.id;
      p.sectContrib = p.sectContrib || 0;
      p.sectContribTotal = p.sectContribTotal || p.sectContrib || 0;
      p.sectPatrolKills = p.sectPatrolKills || 0;
      p.sectQuestKills = p.sectQuestKills || {};
      p.sectManualsBought = p.sectManualsBought || [];
      sound.playBreakthrough();
      this.addLog(`🏯 Đạo hữu chính thức bái nhập 【${sect.name}】! Trở thành môn nhân sơn môn!`, 'golden');
      this.updateUI();
    }

    claimSectSalary() {
      const p = this.player;
      if (!p || !p.sectId) return;

      if (p.sectSalaryClaimedYear === p.age) {
        this.addLog(`Năm ${p.age} đạo hữu đã nhận bổng lộc tông môn rồi!`, 'warning');
        return;
      }

      const curRank = this.getCurrentSectRank();
      const salary = curRank.salary || 10;
      p.sectSalaryClaimedYear = p.age;
      p.spiritStones += salary;
      sound.playLoot();
      this.renderer.addFloatingText(`+${salary} Linh Thạch`, 320, 160, '#38bdf8');
      this.addLog(`Nhận bổng lộc hàng năm của chức vị 【${curRank.rank}】: +${salary} Linh Thạch!`, 'loot');
      this.updateUI();
    }

    completeSectQuest(questId) {
      const p = this.player;
      if (!p || !p.sectId) return;
      const quest = SECT_QUESTS.find(q => q.id === questId);
      if (!quest) return;

      const curRank = this.getCurrentSectRank();
      const sect = SECTS.find(s => s.id === p.sectId);
      const curRankIdx = sect ? sect.ranks.indexOf(curRank) : 0;
      if (quest.minRankIndex !== undefined && curRankIdx < quest.minRankIndex) {
        const reqRankName = sect && sect.ranks[quest.minRankIndex] ? sect.ranks[quest.minRankIndex].rank : 'Cao hơn';
        this.addLog(`Chưa đủ chức vị tông môn để giao nộp nhiệm vụ này (yêu cầu: 【${reqRankName}】)!`, 'warning');
        return;
      }

      if (quest.reqItem) {
        if ((p.inventory[quest.reqItem] || 0) < quest.reqCount) {
          const item = ITEMS[quest.reqItem];
          this.addLog(`Chưa đủ nguyên liệu giao nộp nhiệm vụ (cần ${quest.reqCount} ${item ? item.name : quest.reqItem})!`, 'warning');
          return;
        }
        p.inventory[quest.reqItem] -= quest.reqCount;
      } else if (quest.costStone) {
        if (p.spiritStones < quest.costStone) {
          this.addLog(`Không đủ Linh Thạch để quyên góp (cần ${quest.costStone} Linh Thạch)!`, 'warning');
          return;
        }
        p.spiritStones -= quest.costStone;
      } else if (quest.costMp) {
        if ((p.curMp || 0) < quest.costMp) {
          this.addLog(`Linh lực không đủ để hộ sơn (cần ${quest.costMp} MP, hiện có ${p.curMp || 0}).`, 'warning');
          return;
        }
        p.curMp -= quest.costMp;
      } else if (quest.reqKills) {
        const killCount = quest.reqMonster
          ? ((p.sectQuestKills && p.sectQuestKills[quest.reqMonster]) || 0)
          : (p.sectPatrolKills || 0);
        if (killCount < quest.reqKills) {
          this.addLog(`Chưa hoàn thành nhiệm vụ diệt yêu! (Đã diệt: ${killCount}/${quest.reqKills})`, 'warning');
          return;
        }
        if (quest.reqMonster) {
          p.sectQuestKills[quest.reqMonster] = killCount - quest.reqKills;
        } else {
          p.sectPatrolKills -= quest.reqKills;
        }
      }

      p.sectContrib = (p.sectContrib || 0) + quest.contrib;
      p.sectContribTotal = (p.sectContribTotal || 0) + quest.contrib;
      if (quest.stone) p.spiritStones = (p.spiritStones || 0) + quest.stone;

      sound.playLoot();
      this.renderer.addFloatingText(`+${quest.contrib} Cống Hiến`, 320, 160, '#38bdf8');
      this.addLog(`Hoàn thành nhiệm vụ 【${quest.name}】! Nhận +${quest.contrib} Điểm Cống Hiến${quest.stone ? `, +${quest.stone} Linh Thạch` : ''}!`, 'loot');
      this.checkSectPromotion();
      this.updateUI();
    }

    startSectPatrolFight() {
      const wolfMon = MONSTERS['wolf_novice'];
      if (wolfMon && this.combatEngine) {
        this.addLog(`🌲 Tiến vào sơn cước tuần tra! Phát hiện bầy U Minh Yêu Lang! Chuẩn bị nghênh chiến!`, 'battle');
        this.combatEngine.startCombat(this.player, wolfMon);
      }
    }

    getCurrentSectRank() {
      const p = this.player;
      if (!p || !p.sectId) return null;
      const sect = SECTS.find(s => s.id === p.sectId);
      if (!sect) return null;
      let rank = sect.ranks[0];
      const total = p.sectContribTotal ?? p.sectContrib ?? 0;
      for (let r of sect.ranks) {
        if (total >= r.minContrib) rank = r;
      }
      return rank;
    }

    getNextSectRank() {
      const p = this.player;
      if (!p || !p.sectId) return null;
      const sect = SECTS.find(s => s.id === p.sectId);
      if (!sect) return null;
      const total = p.sectContribTotal ?? p.sectContrib ?? 0;
      for (let r of sect.ranks) {
        if (total < r.minContrib) return r;
      }
      return null;
    }

    checkSectPromotion() {
      const curRank = this.getCurrentSectRank();
      if (curRank && curRank.rank !== this.player.lastSectRank) {
        this.player.lastSectRank = curRank.rank;
        sound.playBreakthrough();
        this.renderer.addFloatingText(`THĂNG CHỨC: ${curRank.rank}!`, 320, 160, '#facc15', true);
        this.addLog(`🎉 Chúc mừng đạo hữu cống hiến vượt bậc, được thăng làm 【${curRank.rank}】 trong tông môn!`, 'golden');
      }
    }

    buySectManual(manualId) {
      const p = this.player;
      if (!p || !p.sectId) return;
      const sect = SECTS.find(s => s.id === p.sectId);
      if (!sect) return;
      const man = sect.manuals.find(m => m.id === manualId);
      if (!man) return;

      p.sectManualsBought = p.sectManualsBought || [];
      if (p.sectManualsBought.includes(manualId)) {
        this.addLog(`Đạo hữu đã lĩnh ngộ bí tịch 【${man.name}】 rồi!`, 'warning');
        return;
      }

      if ((p.sectContrib || 0) < man.cost) {
        this.addLog(`Điểm Cống Hiến không đủ (cần ${man.cost} điểm, hiện có ${p.sectContrib || 0})!`, 'warning');
        return;
      }

      p.sectContrib -= man.cost;
      p.sectManualsBought.push(manualId);

      const effects = [];
      if (man.atk) {
        p.bonusAtk = (p.bonusAtk || 0) + man.atk;
        effects.push(`+${man.atk} Công`);
      }
      if (man.def) {
        p.bonusDef = (p.bonusDef || 0) + man.def;
        effects.push(`+${man.def} Thủ`);
      }
      if (man.hp) {
        p.bonusHp = (p.bonusHp || 0) + man.hp;
        effects.push(`+${man.hp} HP`);
      }
      if (man.mp) {
        p.bonusMp = (p.bonusMp || 0) + man.mp;
        effects.push(`+${man.mp} MP`);
      }
      if (man.crit) {
        p.bonusCrit = (p.bonusCrit || 0) + man.crit;
        effects.push(`+${Math.floor(man.crit * 100)}% Bạo Kích`);
      }
      if (man.lifeSteal) {
        p.bonusLifeSteal = (p.bonusLifeSteal || 0) + man.lifeSteal;
        effects.push(`+${Math.floor(man.lifeSteal * 100)}% Hút Máu`);
      }
      if (man.lifespanGain) {
        p.bonusLifespan = (p.bonusLifespan || 0) + man.lifespanGain;
        effects.push(`+${man.lifespanGain} Năm Thọ Nguyên`);
      }
      if (man.skill) {
        if (!p.skills) p.skills = [p.activeSkill];
        if (!p.knownSkills) p.knownSkills = [];
        if (!p.knownSkills.some(skill => skill && skill.id === man.skill.id)) {
          p.knownSkills.push(JSON.parse(JSON.stringify(man.skill)));
        }
        if (p.skills.length < 2) {
          p.skills.push(JSON.parse(JSON.stringify(man.skill)));
        } else {
          p.skills[1] = JSON.parse(JSON.stringify(man.skill));
        }
        if (!p.skillLevels) p.skillLevels = {};
        p.skillLevels[man.skill.id] = p.skillLevels[man.skill.id] || 1;
        effects.push(`Tuyệt kỹ: 【${man.skill.name}】`);
      }

      this.recalculatePlayerStats();
      sound.playBreakthrough();
      this.renderer.addFloatingText(`LĨNH NGỘ BÍ TỊCH!`, 320, 160, '#facc15', true);
      this.addLog(`📖 Lĩnh ngộ thành công 【${man.name}】 tại Tàng Kinh Các! Thuộc tính tăng vĩnh viễn: ${effects.join(', ')}! (Chức vị tông môn không bị ảnh hưởng)`, 'golden');
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
        if (item.isBreakthrough) {
          this.addLog(`【${item.name}】 là đan dược dùng khi bấm nút [Đột Phá] cảnh giới! Hãy giữ lại trong túi!`, 'warning');
          return;
        }

        if (itemId === 'pill_daotam') {
          p.daoTamBuff = Math.min(0.2, (p.daoTamBuff || 0) + (item.breakBonus || 0.2));
          p.inventory[itemId]--;
          sound.playBreakthrough();
          this.renderer.addFloatingText('ĐẠO TÂM KIÊN ĐỊNH!', 320, 160, '#f8fafc', true);
          this.addLog(`🤍 Nuốt 【${item.name}】! Đạo tâm được củng cố, lần đột phá kế tiếp tăng ${Math.floor((item.breakBonus || 0.2) * 100)}% tỷ lệ thành công.`, 'golden');
        } else if (itemId === 'pill_tay_tuy' || item.compGain) {
          p.comprehension = Math.round((p.comprehension || 100) + (item.compGain || 3));
          p.curHp = p.maxHp;
          p.curMp = p.maxMp;
          p.inventory[itemId]--;
          this.recalculatePlayerStats();
          sound.playBreakthrough();
          this.renderer.addFloatingText(`NGỘ TÍNH +${item.compGain || 3}%!`, 320, 160, '#fbbf24', true);
          this.addLog(`✨ Uống 【${item.name}】! Tẩy kinh phạt tủy, Ngộ Tính tăng vĩnh viễn +${item.compGain || 3}%, Khí Huyết và Linh Lực hồi phục 100%!`, 'golden');
        } else if (itemId === 'pill_quy_nguyen') {
          p.curHp = p.maxHp;
          p.curMp = p.maxMp;
          p.inventory[itemId]--;
          sound.playHeal();
          this.renderer.addFloatingText('QUY NGUYÊN 100%!', 320, 160, '#34d399', true);
          this.addLog(`🌀 Uống 【${item.name}】! Ngũ hành lưu chuyển, toàn bộ Khí Huyết và Linh Lực lập tức hồi phục 100%!`, 'heal');
        } else if (itemId === 'pill_ngung_than' || item.cleanseDebuff) {
          p.curHp = Math.min(p.maxHp, p.curHp + Math.floor(p.maxHp * (item.healPercent || 0.25)));
          p.inventory[itemId]--;
          sound.playHeal();
          this.renderer.addFloatingText('THANH TÂM!', 320, 160, '#38bdf8');
          this.addLog(`🧘 Uống 【${item.name}】! Thần hồn an tĩnh, hồi phục ${Math.floor((item.healPercent || 0.25) * 100)}% Khí Huyết, xua tan mọi tạp niệm!`, 'heal');
        } else if (itemId === 'pill_bao_khi') {
          p.curMp = p.maxMp;
          p.inventory[itemId]--;
          sound.playBreakthrough();
          this.renderer.addFloatingText('BẠO KHÍ!', 320, 160, '#ef4444');
          this.addLog(`🔥 Uống 【${item.name}】! Đan điền cuộn trào sôi sục, hồi phục toàn bộ Linh Lực! (Khuyên dùng trong giao chiến để nhận +35% Công Kích)`, 'golden');
        } else if (item.healPercent) {
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
          gain = this.addCultivationExp(gain);
          p.inventory[itemId]--;
          sound.playLoot();
          this.addLog(`Uống 【${item.name}】, đan khí hóa tu vi tăng +${gain} Tu Vi!`, 'golden');
        } else if (item.lifespanGain) {
          p.bonusLifespan = (p.bonusLifespan || 0) + item.lifespanGain;
          p.inventory[itemId]--;
          this.recalculatePlayerStats();
          sound.playBreakthrough();
          this.addLog(`Nuốt vào 【${item.name}】! Kéo dài thọ nguyên thêm +${item.lifespanGain} năm!`, 'golden');
        }
      } else if (item.type === 'tea') {
        p.inventory[itemId]--;
        p.teaBuffUntil = Date.now() + ((item.teaDuration || 60) * 1000);
        sound.playBreakthrough();
        this.renderer.addFloatingText('NGỘ ĐẠO x2 TU VI!', 320, 160, '#facc15', true);
        this.addLog(`🍵 Thưởng thức một chén 【${item.name}】! Thần trí thanh minh, đốn ngộ thiên địa: Tốc độ tu luyện x2 trong ${item.teaDuration || 60} giây!`, 'golden');
      } else if (item.type === 'talisman') {
        if (itemId === 'talisman_don_dia') {
          p.inventory[itemId]--;
          p.curHp = Math.min(p.maxHp, p.curHp + Math.floor(p.maxHp * 0.3));
          p.curMp = Math.min(p.maxMp, p.curMp + Math.floor(p.maxMp * 0.3));
          sound.playBreakthrough();
          this.renderer.addFloatingText('ĐỘN ĐỊA THỔ HÀNH!', 320, 160, '#38bdf8', true);
          this.addLog(`💨 Kích hoạt 【Độn Địa Phù】! Thân ảnh hóa thành làn khói độn thổ an toàn về động phủ, hồi phục 30% Khí Huyết & Linh Lực!`, 'system');
          switchTab('tab-nhanvat');
        } else if (itemId === 'talisman_kim_cuong') {
          p.inventory[itemId]--;
          p.curHp = Math.min(p.maxHp, p.curHp + Math.floor(p.maxHp * 0.4));
          sound.playBreakthrough();
          this.renderer.addFloatingText('KIM CƯƠNG HỘ THỂ!', 320, 160, '#fbbf24', true);
          this.addLog(`🛡️ Kích hoạt 【Kim Cương Hộ Thể Phù】! Kim quang bảo hộ, hồi phục 40% Khí Huyết! (Khuyên dùng trong giao chiến để nhận 800 Hộ Thuẫn)`, 'golden');
        } else if (itemId === 'talisman_than_hanh') {
          p.agility = (p.agility || 10) + 5;
          p.inventory[itemId]--;
          this.recalculatePlayerStats();
          sound.playBreakthrough();
          this.renderer.addFloatingText('THÂN PHÁP +5!', 320, 160, '#38bdf8', true);
          this.addLog(`⚡ Kích hoạt 【Thần Hành Biến Ảo Phù】! Tốc độ kinh mạch tăng tiến, Thân Pháp vĩnh viễn +5!`, 'golden');
        } else if (itemId === 'talisman_dan_loi' || itemId === 'talisman_liet_hoa' || itemId === 'talisman_bang_phong' || itemId === 'talisman_an_than' || itemId === 'talisman_thien_nhan') {
          this.addLog(`⚡ 【${item.name}】 ẩn chứa uy lực sát phạt hoặc thần thông hộ thể, hãy kích hoạt trong chiến đấu với yêu thú hoặc đối thủ!`, 'warning');
          return;
        }
      } else if (item.type === 'herb') {
        p.inventory[itemId]--;
        sound.playHeal();
        if (itemId === 'herb_linhchi') {
          const heal = Math.floor(p.maxHp * 0.2);
          p.curHp = Math.min(p.maxHp, p.curHp + heal);
          const expGain = this.addCultivationExp(35);
          this.renderer.addFloatingText(`+${heal} HP | +${expGain} Tu Vi`, 320, 160, '#34d399');
          this.addLog(`Nuốt vào Linh Chi Thảo, khí huyết hồi phục ${heal} và nạp +${expGain} Tu Vi!`, 'heal');
        } else if (itemId === 'herb_thanh_u') {
          const mana = Math.floor(p.maxMp * 0.25);
          p.curMp = Math.min(p.maxMp, p.curMp + mana);
          this.renderer.addFloatingText(`+${mana} MP`, 320, 160, '#38bdf8');
          this.addLog(`Nuốt vào Thanh U Thảo, linh lực hồi phục ${mana}!`, 'heal');
        } else if (itemId === 'herb_u_hon') {
          p.bonusSpd = (p.bonusSpd || 0) + 2;
          this.recalculatePlayerStats();
          this.renderer.addFloatingText(`THÂN PHÁP +2!`, 320, 160, '#38bdf8', true);
          this.addLog(`Nuốt vào U Hồn Thảo! Âm khí kích thích kinh mạch, Thân Pháp vĩnh viễn +2!`, 'golden');
        } else if (itemId === 'herb_hoaviem') {
          p.bonusAtk = (p.bonusAtk || 0) + 3;
          this.recalculatePlayerStats();
          this.renderer.addFloatingText(`CÔNG KÍCH +3!`, 320, 160, '#ef4444', true);
          this.addLog(`Nuốt vào Hỏa Viêm Thảo! Dương hỏa rèn đúc đan điền, Công Kích vĩnh viễn +3!`, 'golden');
        } else if (itemId === 'herb_bachnien') {
          p.curHp = Math.min(p.maxHp, p.curHp + Math.floor(p.maxHp * 0.6));
          p.curMp = Math.min(p.maxMp, p.curMp + Math.floor(p.maxMp * 0.6));
          const expGain = this.addCultivationExp(150);
          this.renderer.addFloatingText(`+60% HP/MP | +${expGain} Tu Vi`, 320, 160, '#fbbf24', true);
          this.addLog(`Nuốt vào Bách Niên Linh Dược! Uẩn dưỡng kinh mạch, hồi 60% HP & MP, nạp +${expGain} Tu Vi!`, 'golden');
        } else if (itemId === 'herb_huyen_bang') {
          p.bonusDef = (p.bonusDef || 0) + 3;
          p.curMp = Math.min(p.maxMp, p.curMp + Math.floor(p.maxMp * 0.4));
          this.recalculatePlayerStats();
          this.renderer.addFloatingText(`PHÒNG NGỰ +3!`, 320, 160, '#38bdf8', true);
          this.addLog(`Nuốt vào Huyền Băng Linh Thảo! Băng phách bảo hộ thể xác, Phòng Ngự vĩnh viễn +3!`, 'golden');
        } else if (itemId === 'herb_longhuyet') {
          p.bonusHp = (p.bonusHp || 0) + 100;
          p.bonusAtk = (p.bonusAtk || 0) + 5;
          p.curHp = p.maxHp;
          this.recalculatePlayerStats();
          this.renderer.addFloatingText(`LONG HUYẾT THỐNG THỂ!`, 320, 160, '#ef4444', true);
          this.addLog(`Nuốt vào Long Huyết Thảo! Chân long huyết mạch bùng nổ: Vĩnh viễn +100 Max HP, +5 Công Kích!`, 'golden');
        } else if (itemId === 'herb_cuuchuyen') {
          p.curHp = p.maxHp;
          p.curMp = p.maxMp;
          const expGain = this.addCultivationExp(800);
          this.renderer.addFloatingText(`CỬU CHUYỂN TIÊN KHÍ! +${expGain} Tu Vi`, 320, 160, '#f472b6', true);
          this.addLog(`Nuốt vào Cửu Chuyển Tiên Thảo! Cửu sắc hào quang bao phủ, hồi phục 100% HP & MP, nạp +${expGain} Tu Vi!`, 'golden');
        } else if (itemId === 'herb_thienkiem') {
          p.bonusAtk = (p.bonusAtk || 0) + 15;
          p.bonusCrit = (p.bonusCrit || 0) + 0.01;
          this.recalculatePlayerStats();
          this.renderer.addFloatingText(`KIẾM KHÍ THÔNG MINH!`, 320, 160, '#fbbf24', true);
          this.addLog(`Nuốt vào Thiên Kiếm Thảo! Vô biên kiếm khí tẩm nhuần linh căn: Vĩnh viễn +15 Công Kích, +1% Bạo Kích!`, 'golden');
        } else if (itemId === 'herb_ngo_dao_diep') {
          const expGain = this.addCultivationExp(350);
          p.teaBuffUntil = Date.now() + 30000;
          this.renderer.addFloatingText(`NGỘ ĐẠO 30s! +${expGain} Tu Vi`, 320, 160, '#facc15', true);
          this.addLog(`Nhai nuốt Ngộ Đạo Cổ Trà Diệp! Cảm ngộ thiên đạo: +${expGain} Tu Vi và x2 tốc độ tu vi trong 30 giây!`, 'golden');
        } else {
          p.curHp = Math.min(p.maxHp, p.curHp + Math.floor(p.maxHp * 0.15));
          const expGain = this.addCultivationExp(20);
          this.addLog(`Nuốt vào 【${item.name}】, hồi phục 15% Khí Huyết và tăng +${expGain} Tu Vi!`, 'heal');
        }
      } else if (item.type === 'treasure_map') {
        p.inventory[itemId]--;
        sound.playLoot();
        const stones = 500 + Math.floor(Math.random() * 1001);
        p.spiritStones = (p.spiritStones || 0) + stones;
        const possibleDrops = ['herb_bachnien', 'herb_longhuyet', 'ore_tutinh', 'ore_thai_at', 'core_yeu_dan_3', 'pill_tay_tuy'];
        const drop1 = possibleDrops[Math.floor(Math.random() * possibleDrops.length)];
        const drop2 = possibleDrops[Math.floor(Math.random() * possibleDrops.length)];
        p.inventory[drop1] = (p.inventory[drop1] || 0) + 1;
        p.inventory[drop2] = (p.inventory[drop2] || 0) + 1;

        let extraMsg = '';
        if (Math.random() < 0.4) {
          p.inventory['chest_bi_canh'] = (p.inventory['chest_bi_canh'] || 0) + 1;
          extraMsg = ' và phát hiện 1 Bảo Rương Bí Cảnh Cổ Đại!';
        }
        this.renderer.addFloatingText(`TIÊN PHỦ KHAI QUẬT!`, 320, 160, '#fbbf24', true);
        this.addLog(`🗺️ Giải mã 【${item.name}】! Khai quật động phủ cổ xưa nhận +${stones} Linh Thạch, ${ITEMS[drop1].name} x1, ${ITEMS[drop2].name} x1${extraMsg}!`, 'golden');
      } else if (item.type === 'secret_tome') {
        p.inventory[itemId]--;
        p.bonusAtk = (p.bonusAtk || 0) + 15;
        p.bonusSpd = (p.bonusSpd || 0) + 5;
        this.recalculatePlayerStats();
        sound.playBreakthrough();
        this.renderer.addFloatingText(`KIẾM Ý ĐẠI THÀNH!`, 320, 160, '#fbbf24', true);
        this.addLog(`📜 Tham ngộ thành công 【${item.name}】! Kiếm ý viễn cổ nhập thể: Vĩnh viễn +15 Công Kích, +5 Thân Pháp!`, 'golden');
      } else if (item.type === 'pet_egg') {
        if ((p.curMp || 0) < 100) {
          this.addLog(`Ấp trứng thất bại: Cần tối thiểu 100 Linh Lực để rót vào linh quả noãn (Hiện có: ${p.curMp || 0})!`, 'warning');
          return;
        }
        p.curMp -= 100;
        p.inventory[itemId]--;

        const petKeys = ['pet_thunder', 'pet_fire', 'pet_turtle', 'pet_rabbit'];
        const chosenKey = petKeys[Math.floor(Math.random() * petKeys.length)];
        p.companion = COMPANIONS[chosenKey];

        this.recalculatePlayerStats();
        sound.playBreakthrough();
        this.renderer.addFloatingText(`LINH THÚ NỞ VỎ!`, 320, 160, '#facc15', true);
        this.addLog(`🥚 Rót 100 Linh Lực vào Thái Cổ Linh Thú Noãn! Vỏ trứng rạn nứt, một con 【${p.companion.name} ${p.companion.icon}】 chui ra nhận đạo hữu làm chủ!`, 'golden');
      } else if (item.type === 'chest') {
        p.inventory[itemId]--;
        sound.playLoot();
        if (itemId === 'chest_tu_tru_vat') {
          const stones = 50 + Math.floor(Math.random() * 151);
          p.spiritStones = (p.spiritStones || 0) + stones;
          const drops = ['herb_linhchi', 'herb_thanh_u', 'ore_huyenthiet', 'ore_dong_tinh', 'pill_tukhi', 'core_yeu_dan_1', 'mat_lang_nanh'];
          const dropId = drops[Math.floor(Math.random() * drops.length)];
          const qty = 1 + Math.floor(Math.random() * 2);
          p.inventory[dropId] = (p.inventory[dropId] || 0) + qty;
          this.renderer.addFloatingText(`+${stones} Linh Thạch`, 320, 160, '#fbbf24');
          this.addLog(`🎁 Mở 【Túi Trữ Vật Vô Chủ】: Nhận +${stones} Linh Thạch và ${ITEMS[dropId].name} x${qty}!`, 'golden');
        } else if (itemId === 'chest_bi_canh') {
          const stones = 300 + Math.floor(Math.random() * 501);
          p.spiritStones = (p.spiritStones || 0) + stones;
          const drops = ['herb_hoaviem', 'herb_bachnien', 'ore_tutinh', 'core_yeu_dan_2', 'pill_trucco', 'talisman_don_dia', 'talisman_kim_cuong'];
          const dropId = drops[Math.floor(Math.random() * drops.length)];
          const qty = 1 + Math.floor(Math.random() * 2);
          p.inventory[dropId] = (p.inventory[dropId] || 0) + qty;
          this.renderer.addFloatingText(`+${stones} Linh Thạch`, 320, 160, '#fbbf24', true);
          this.addLog(`🎁 Mở 【Bảo Rương Bí Cảnh Cổ Đại】: Nhận +${stones} Linh Thạch và ${ITEMS[dropId].name} x${qty}!`, 'golden');
        } else if (itemId === 'chest_thien_co') {
          const stones = 1500 + Math.floor(Math.random() * 2501);
          p.spiritStones = (p.spiritStones || 0) + stones;
          const drops = ['herb_cuuchuyen', 'herb_thienkiem', 'ore_thai_at', 'ore_hondon', 'core_yeu_dan_4', 'tea_ngo_dao', 'pill_tay_tuy', 'talisman_dan_loi'];
          const dropId = drops[Math.floor(Math.random() * drops.length)];
          const qty = 1 + Math.floor(Math.random() * 2);
          p.inventory[dropId] = (p.inventory[dropId] || 0) + qty;
          this.renderer.addFloatingText(`CHÍ BẢO THIÊN CƠ!`, 320, 160, '#f87171', true);
          this.addLog(`🎁 Khai mở 【Thiên Cơ Chí Bảo Hạp】 hào quang ngút trời: Nhận +${stones} Linh Thạch và ${ITEMS[dropId].name} x${qty}!`, 'golden');
        }
      } else if (item.type === 'weapon') {
        if (p.equippedWeapon && p.equippedWeapon.id) {
          p.inventory[p.equippedWeapon.id] = (p.inventory[p.equippedWeapon.id] || 0) + 1;
        }
        p.inventory[itemId]--;
        p.equippedWeapon = JSON.parse(JSON.stringify(item));
        this.recalculatePlayerStats();
        sound.playClick();
        this.addLog(`Đã trang bị vũ khí: 【${item.name}】!`, 'system');
      } else if (item.type === 'armor') {
        if (p.equippedArmor && p.equippedArmor.id) {
          p.inventory[p.equippedArmor.id] = (p.inventory[p.equippedArmor.id] || 0) + 1;
        }
        p.inventory[itemId]--;
        p.equippedArmor = JSON.parse(JSON.stringify(item));
        this.recalculatePlayerStats();
        sound.playClick();
        this.addLog(`Đã trang bị hộ giáp: 【${item.name}】!`, 'system');
      } else if (item.type === 'artifact') {
        if (p.equippedArtifact && p.equippedArtifact.id) {
          p.inventory[p.equippedArtifact.id] = (p.inventory[p.equippedArtifact.id] || 0) + 1;
        }
        p.inventory[itemId]--;
        p.equippedArtifact = JSON.parse(JSON.stringify(item));
        this.recalculatePlayerStats();
        sound.playClick();
        this.addLog(`Đã trang bị pháp bảo: 【${item.name}】!`, 'system');
      }

      this.updateUI();
    }

    handleDeathByAge() {
      sound.playHurt();
      this.showAlert(
        '💀 ĐẠI HẠN TỌA HÓA',
        `Đại Hạn Đã Tới! Đạo hữu 【${this.player.name}】 thọ nguyên cạn kiệt, tọa hóa tán tiêu vào thiên địa... Hãy luân hồi chuyển thế!`,
        () => this.resetCharacter()
      );
    }

    resetCharacter() {
      localStorage.removeItem('tutien_savegame');
      localStorage.removeItem('tutien_savegame_backup');
      location.reload();
    }

    saveToLocalStorage() {
      if (!this.player) return;
      try {
        const envelope = {
          schemaVersion: 2,
          timestamp: Date.now(),
          player: this.player,
          marketItems: this.marketItems || []
        };
        const jsonStr = JSON.stringify(envelope);
        const previousPrimary = localStorage.getItem('tutien_savegame');
        localStorage.setItem('tutien_savegame_backup', previousPrimary || jsonStr);
        localStorage.setItem('tutien_savegame', jsonStr);
      } catch (e) {
        const isQuotaError = e && (e.name === 'QuotaExceededError' || e.code === 22);
        const message = isQuotaError
          ? 'Không đủ dung lượng lưu game trên trình duyệt. Hãy xóa bớt dữ liệu trang web rồi lưu lại.'
          : `Lưu game thất bại: ${e && e.message ? e.message : e}`;
        console.error(message, e);
        if (typeof window !== 'undefined' && window.gameDebug && typeof window.gameDebug.capture === 'function') {
          window.gameDebug.capture(e, { source: 'saveToLocalStorage', quota: isQuotaError });
        }
        if (this.addLog) this.addLog(`⚠️ ${message}`, 'danger');
      }
    }

    loadFromLocalStorage() {
      try {
        const saveKeys = ['tutien_savegame', 'tutien_savegame_backup'];
        for (const key of saveKeys) {
          const dataStr = localStorage.getItem(key);
          if (!dataStr) continue;
          const envelope = this.migrateSaveData(dataStr);
          if (envelope && envelope.player) {
            this.player = envelope.player;
            if (envelope.marketItems && envelope.marketItems.length > 0) {
              this.marketItems = envelope.marketItems;
            }
            this.ensureWorldState();
            this.currentRegion = this.getWorldRegion(this.player.worldLocation);

            this.recalculatePlayerStats();
            if (!this.marketItems || this.marketItems.length === 0) {
              this.refreshMarket();
            } else {
              this.renderMarketUI();
            }
            this.startLoops();
            this.addLog(`Đã tự động tải dữ liệu đạo hữu 【${this.player.name}】 thành công! (Dữ liệu v${envelope.schemaVersion || 2})`, 'system');
            return true;
          }
        }
      } catch (e) {
        console.error('Tải game thất bại:', e);
      }
      return false;
    }

    getPillIdByName(name) {
      for (const [id, item] of Object.entries(ITEMS)) {
        if (item.name === name) return id;
      }
      return null;
    }

    updateUI() {
      if (!this.player) return;
      const p = this.player;
      this.ensureWorldState();
      p.realmIndex = Math.max(0, Math.min(REALMS.length - 1, Math.floor(Number(p.realmIndex) || 0)));
      const base = REALMS[p.realmIndex] || REALMS[REALMS.length - 1];

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

      // ================= CẬP NHẬT CHỈ SỐ GOM VÀO TAB NHÂN VẬT =================
      const charHpText = document.getElementById('char-hp-text');
      const charHpBar = document.getElementById('char-hp-bar');
      const charMpText = document.getElementById('char-mp-text');
      const charMpBar = document.getElementById('char-mp-bar');
      const charExpText = document.getElementById('char-exp-text');
      const charExpBar = document.getElementById('char-exp-bar');

      const charAtk = document.getElementById('char-stat-atk');
      const charDef = document.getElementById('char-stat-def');
      const charSpd = document.getElementById('char-stat-spd');
      const charCrit = document.getElementById('char-stat-crit');
      const charRoot = document.getElementById('char-stat-root');
      const charPhy = document.getElementById('char-stat-phy');
      const charComp = document.getElementById('char-stat-comp');
      const charAge = document.getElementById('char-stat-age');
      const charStones = document.getElementById('char-stat-stones');

      const charGearWpn = document.getElementById('char-gear-weapon');
      const charGearArm = document.getElementById('char-gear-armor');
      const charGearArt = document.getElementById('char-gear-artifact');
      const btnBreakthroughSanctum = document.getElementById('btn-breakthrough-sanctum');

      const medStatusBadge = document.getElementById('meditation-status-badge');
      const meridianSpeedText = document.getElementById('meridian-speed-text');
      const dongphuArrayLevel = document.getElementById('dongphu-array-level');
      const dongphuQiDensity = document.getElementById('dongphu-qi-density');
      const charCultRate = document.getElementById('char-cult-rate');

      if (charHpText) charHpText.textContent = `${p.curHp} / ${p.maxHp}`;
      if (charHpBar) charHpBar.style.width = `${Math.max(0, Math.min(100, (p.curHp / p.maxHp) * 100))}%`;

      if (charMpText) charMpText.textContent = `${p.curMp} / ${p.maxMp}`;
      if (charMpBar) charMpBar.style.width = `${Math.max(0, Math.min(100, (p.curMp / p.maxMp) * 100))}%`;

      if (charExpText) charExpText.textContent = `${p.exp} / ${base.maxExp} (${Math.floor((p.exp / base.maxExp) * 100)}%)`;
      if (charExpBar) charExpBar.style.width = `${Math.max(0, Math.min(100, (p.exp / base.maxExp) * 100))}%`;

      if (charAtk) charAtk.textContent = p.totalAtk;
      if (charDef) charDef.textContent = p.totalDef;
      if (charSpd) charSpd.textContent = p.totalSpd;
      if (charCrit) charCrit.textContent = `${Math.floor(p.totalCrit * 100)}%`;

      if (charRoot) charRoot.textContent = p.spiritualRoot ? p.spiritualRoot.name : 'Chưa rõ';
      if (charPhy) charPhy.textContent = p.physique ? p.physique.name : 'Phàm Thể';
      if (charComp) charComp.textContent = `${p.comprehension}% (x${(p.comprehension / 100).toFixed(2)})`;
      if (charAge) charAge.textContent = `${p.age} / ${p.maxLifespan} tuổi (Tháng ${p.month})`;
      if (charStones) charStones.textContent = p.spiritStones || 0;

      if (charGearWpn) charGearWpn.innerHTML = p.equippedWeapon ? `<span class="item-icon-tag">${p.equippedWeapon.icon || '🗡️'}</span>${p.equippedWeapon.name}${p.equippedWeapon.refineLevel ? ' +' + p.equippedWeapon.refineLevel : ''} (+${Math.floor(p.equippedWeapon.atk * (1 + (p.equippedWeapon.refineLevel || 0) * 0.15))} Công)` : 'Chưa có';
      if (charGearArm) charGearArm.innerHTML = p.equippedArmor ? `<span class="item-icon-tag">${p.equippedArmor.icon || '🛡️'}</span>${p.equippedArmor.name}${p.equippedArmor.refineLevel ? ' +' + p.equippedArmor.refineLevel : ''} (+${Math.floor(p.equippedArmor.def * (1 + (p.equippedArmor.refineLevel || 0) * 0.15))} Thủ)` : 'Chưa có';
      if (charGearArt) charGearArt.innerHTML = p.equippedArtifact ? `<span class="item-icon-tag">${p.equippedArtifact.icon || '🔮'}</span>${p.equippedArtifact.name}${p.equippedArtifact.refineLevel ? ' +' + p.equippedArtifact.refineLevel : ''}` : 'Chưa có';

      const compPill = document.getElementById('companion-stat-pill');
      const compVal = document.getElementById('companion-stat-val');
      if (compPill && compVal) {
        if (p.companion) {
          compPill.style.display = 'flex';
          compVal.textContent = `${p.companion.name} ${p.companion.icon}`;
        } else {
          compPill.style.display = 'none';
        }
      }

      // ================= CẬP NHẬT HUD MOBILE =================
      const mobName = document.getElementById('mobile-player-name');
      const mobRealm = document.getElementById('mobile-player-realm');
      const mobHpBar = document.getElementById('mobile-hp-bar');
      const mobHpText = document.getElementById('mobile-hp-text');
      const mobMpBar = document.getElementById('mobile-mp-bar');
      const mobMpText = document.getElementById('mobile-mp-text');
      const mobStones = document.getElementById('mobile-player-stones');

      if (mobName) mobName.textContent = p.name;
      if (mobRealm) mobRealm.textContent = base.name;
      if (mobHpBar) mobHpBar.style.width = `${Math.max(0, Math.min(100, (p.curHp / p.maxHp) * 100))}%`;
      if (mobHpText) mobHpText.textContent = `${p.curHp}/${p.maxHp}`;
      if (mobMpBar) mobMpBar.style.width = `${Math.max(0, Math.min(100, (p.curMp / p.maxMp) * 100))}%`;
      if (mobMpText) mobMpText.textContent = `${p.curMp}/${p.maxMp}`;
      if (mobStones) mobStones.textContent = p.spiritStones || 0;

      const isReadyToBreak = p.exp >= base.maxExp;
      const isBreakthroughInProgress = this.breakthroughInProgress;
      if (btnBreakthrough) {
        if (isBreakthroughInProgress) {
          btnBreakthrough.disabled = true;
          btnBreakthrough.classList.remove('glow-breakthrough');
          btnBreakthrough.innerHTML = '⚡ <span>ĐANG ĐỘ KIẾP...</span>';
        } else if (isReadyToBreak) {
          btnBreakthrough.disabled = false;
          btnBreakthrough.classList.add('glow-breakthrough');
          btnBreakthrough.innerHTML = `⚡ <span>${base.isMajorBreakthrough ? 'ĐỘ KIẾP ĐỘT PHÁ' : 'ĐỘT PHÁ CẢNH GIỚI'}</span> ✨`;
        } else {
          btnBreakthrough.disabled = true;
          btnBreakthrough.classList.remove('glow-breakthrough');
          btnBreakthrough.innerHTML = '<span class="lock-icon">🔒</span> <span class="breakthrough-btn-text">Tu Vi Chưa Đủ</span>';
        }
      }

      if (btnBreakthroughSanctum) {
        if (isBreakthroughInProgress) {
          btnBreakthroughSanctum.disabled = true;
          btnBreakthroughSanctum.classList.remove('glow-breakthrough');
          btnBreakthroughSanctum.innerHTML = '⚡ <span>ĐANG ĐỘ KIẾP...</span>';
        } else if (isReadyToBreak) {
          btnBreakthroughSanctum.disabled = false;
          btnBreakthroughSanctum.classList.add('glow-breakthrough');
          btnBreakthroughSanctum.innerHTML = `⚡ <span>${base.isMajorBreakthrough ? 'ĐỘ KIẾP ĐỘT PHÁ' : 'ĐỘT PHÁ BÌNH CẢNH'}</span> ✨`;
        } else {
          btnBreakthroughSanctum.disabled = true;
          btnBreakthroughSanctum.classList.remove('glow-breakthrough');
          btnBreakthroughSanctum.innerHTML = '<span class="lock-icon">🔒</span> <span class="breakthrough-btn-text">Tu Vi Chưa Đủ</span>';
        }
      }

      if (medStatusBadge) {
        if (isReadyToBreak) {
          medStatusBadge.textContent = '⚡ Bình Cảnh Đỉnh Phong';
          medStatusBadge.className = 'badge-chip stone-chip';
        } else {
          medStatusBadge.textContent = 'Vô Vi Thanh Tịnh';
          medStatusBadge.className = 'badge-chip root-chip';
        }
      }

      // Tốc độ hấp thu tu vi thực tế
      const baseExpPerSec = Math.max(1, Math.floor(Math.sqrt(base.maxExp) * CULTIVATION_BALANCE.passiveRate));
      let expGainRate = baseExpPerSec * (p.comprehension / 100);
      if (p.spiritualRoot && p.spiritualRoot.speedMod) expGainRate *= p.spiritualRoot.speedMod;
      if (p.physique && p.physique.expBonus) expGainRate *= (1 + p.physique.expBonus);
      if (p.cheatCore && p.cheatCore.id === 'proficiency') expGainRate *= 1.25;
      if (p.teaBuffUntil && Date.now() < p.teaBuffUntil) expGainRate *= 2;
      const actualExpSec = Math.max(1, Math.floor(expGainRate));

      if (meridianSpeedText) {
        const teaActive = p.teaBuffUntil && Date.now() < p.teaBuffUntil;
        meridianSpeedText.textContent = `Tốc độ: +${actualExpSec} Tu Vi/giây` + (teaActive ? ' 🔥 (x2 Trà Tiên)' : '');
      }
      if (dongphuArrayLevel) dongphuArrayLevel.textContent = `Tụ Linh Trận Bậc ${Math.min(9, Math.floor(p.realmIndex / 3) + 1)}`;
      if (dongphuQiDensity) dongphuQiDensity.textContent = `Nồng Đậm ${100 + p.realmIndex * 15}%`;
      if (charCultRate) charCultRate.textContent = `${(p.comprehension / 100).toFixed(2)}x`;

      this.renderInventoryUI();
      this.renderCompendiumUI();
      this.renderSectUI();
      this.renderOpenWorldUI();
      this.renderCheatUI();
      this.renderForgeUI();
      this.renderSkillsUI();
    }

    gatherRegionalResources() {
      const p = this.player;
      if (!p) return;
      const selectReg = document.getElementById('select-region');
      const regIdx = selectReg ? Number(selectReg.value || 0) : 0;
      const reg = WORLD_REGIONS[regIdx] || WORLD_REGIONS[0];

      const mpCost = 15;
      if (p.curMp < mpCost) {
        this.addLog(`⚠️ Linh Lực không đủ (${p.curMp}/${mpCost}) để phát động thần thức hái lượm! Hãy đả tọa hồi phục.`, 'warning');
        sound.playHurt();
        return;
      }
      p.curMp -= mpCost;

      const herbs = reg.herbs || ['herb_linhchi'];
      const ores = reg.ores || ['ore_huyenthiet'];
      const isHerb = Math.random() < 0.6;
      const pool = isHerb ? herbs : ores;
      const gatheredId = pool[Math.floor(Math.random() * pool.length)];
      const item = ITEMS[gatheredId];
      if (!item) return;

      const qty = 1 + (Math.random() < 0.3 ? 1 : 0);
      p.inventory[gatheredId] = (p.inventory[gatheredId] || 0) + qty;
      sound.playLoot();
      this.renderer.addFloatingText(`+${qty} ${item.name}`, 320, 160, isHerb ? '#34d399' : '#38bdf8');
      this.addLog(`🌿 Thần thức cảm ứng tại 【${reg.name}】: Thu hái thành công ${item.name} x${qty}! (-${mpCost} Linh Lực)`, 'heal');

      if (Math.random() < 0.35) {
        const bonusStones = 20 + Math.floor(Math.random() * 50);
        p.spiritStones = (p.spiritStones || 0) + bonusStones;
        this.addLog(`💎 Đào trúng một mạch linh thạch nhỏ: +${bonusStones} Linh Thạch!`, 'golden');
      }

      this.updateUI();
    }

    renderInventoryUI() {
      const listEl = document.getElementById('inventory-list');
      if (!listEl || !this.player) return;
      listEl.innerHTML = '';

      const p = this.player;
      let invKeys = Object.keys(p.inventory).filter(k => p.inventory[k] > 0);

      const filter = this.inventoryFilter || 'all';
      if (filter === 'usable') {
        invKeys = invKeys.filter(k => {
          const t = ITEMS[k]?.type;
          return t === 'pill' || t === 'talisman' || t === 'tea' || t === 'chest' || t === 'herb' || t === 'treasure_map' || t === 'secret_tome' || t === 'pet_egg';
        });
      } else if (filter === 'material') {
        invKeys = invKeys.filter(k => {
          const t = ITEMS[k]?.type;
          return t === 'herb' || t === 'ore' || t === 'monster_mat';
        });
      } else if (filter === 'equipment') {
        invKeys = invKeys.filter(k => {
          const t = ITEMS[k]?.type;
          return t === 'weapon' || t === 'armor' || t === 'artifact';
        });
      }

      if (invKeys.length === 0) {
        listEl.innerHTML = '<div class="empty-hint" style="color: var(--text-dim); padding: 12px 0;">Không có vật phẩm nào phù hợp với bộ lọc hiện tại.</div>';
      } else {
        invKeys.forEach(k => {
          const item = ITEMS[k];
          if (!item) return;

          const isUsable = item.type === 'pill' || item.type === 'talisman' || item.type === 'tea' || item.type === 'chest' || item.type === 'herb' || item.type === 'treasure_map' || item.type === 'secret_tome' || item.type === 'pet_egg';
          const isEquip = item.type === 'weapon' || item.type === 'armor' || item.type === 'artifact';
          let actionLabel = 'Bán';
          let actionClass = 'pixel-btn small-btn btn-use';
          if (isUsable) {
            if (item.type === 'chest') actionLabel = 'Mở';
            else if (item.type === 'talisman') actionLabel = 'Phù';
            else if (item.type === 'herb') actionLabel = 'Nuốt';
            else if (item.type === 'treasure_map') actionLabel = 'Tầm bảo';
            else if (item.type === 'secret_tome') actionLabel = 'Lĩnh ngộ';
            else if (item.type === 'pet_egg') actionLabel = 'Ấp trứng';
            else actionLabel = 'Dùng';
            actionClass = 'pixel-btn small-btn btn-use primary-btn';
          } else if (isEquip) {
            actionLabel = 'Trang bị';
            actionClass = 'pixel-btn small-btn btn-use primary-btn';
          }

          const itemCard = document.createElement('div');
          itemCard.className = 'inventory-card pixel-box';
          itemCard.innerHTML = `
            <div class="item-name" style="cursor: pointer;" title="Bấm để xem chi tiết"><span class="item-icon-tag">${item.icon || '💎'}</span>${item.name}${item.refineLevel ? '<span class="refine-badge">+' + item.refineLevel + '</span>' : ''} <span class="item-count">x${p.inventory[k]}</span></div>
            <div class="item-desc">${item.desc}</div>
            <div class="item-actions" style="display: flex; gap: 6px; margin-top: 6px;">
              <button class="pixel-btn small-btn btn-inspect" style="background: rgba(30, 41, 59, 0.7);">🔍 Chi Tiết</button>
              <button class="${actionClass}">${actionLabel}</button>
            </div>
          `;

          itemCard.querySelector('.btn-inspect').onclick = (e) => {
            e.stopPropagation();
            this.showItemDetail(k, 'inventory');
          };

          itemCard.querySelector('.item-name').onclick = (e) => {
            e.stopPropagation();
            this.showItemDetail(k, 'inventory');
          };

          itemCard.querySelector('.btn-use').onclick = (e) => {
            e.stopPropagation();
            if (isUsable || isEquip) {
              this.useInventoryItem(k);
            } else {
              this.sellItem(k);
            }
          };

          listEl.appendChild(itemCard);
        });
      }

      const wpnEl = document.getElementById('equip-weapon');
      const armEl = document.getElementById('equip-armor');
      const artEl = document.getElementById('equip-artifact');

      if (wpnEl) wpnEl.innerHTML = p.equippedWeapon ? `<span class="item-icon-tag">${p.equippedWeapon.icon || '🗡️'}</span>${p.equippedWeapon.name}${p.equippedWeapon.refineLevel ? ' +' + p.equippedWeapon.refineLevel : ''} (+${Math.floor(p.equippedWeapon.atk * (1 + (p.equippedWeapon.refineLevel || 0) * 0.15))} Công)` : 'Chưa có';
      if (armEl) armEl.innerHTML = p.equippedArmor ? `<span class="item-icon-tag">${p.equippedArmor.icon || '🛡️'}</span>${p.equippedArmor.name}${p.equippedArmor.refineLevel ? ' +' + p.equippedArmor.refineLevel : ''} (+${Math.floor(p.equippedArmor.def * (1 + (p.equippedArmor.refineLevel || 0) * 0.15))} Thủ, +${Math.floor(p.equippedArmor.hp * (1 + (p.equippedArmor.refineLevel || 0) * 0.15))} HP)` : 'Chưa có';
      if (artEl) artEl.innerHTML = p.equippedArtifact ? `<span class="item-icon-tag">${p.equippedArtifact.icon || '🔮'}</span>${p.equippedArtifact.name}${p.equippedArtifact.refineLevel ? ' +' + p.equippedArtifact.refineLevel : ''}` : 'Chưa có';
    }

    renderCompendiumUI() {
      const listEl = document.getElementById('compendium-list');
      const countEl = document.getElementById('compendium-unlocked-count');
      if (!listEl || !this.player) return;
      listEl.innerHTML = '';

      const p = this.player;
      const allItemKeys = Object.keys(ITEMS);
      let unlockedCount = 0;

      allItemKeys.forEach(k => {
        if ((p.inventory && p.inventory[k] > 0) ||
            (p.equippedWeapon && p.equippedWeapon.id === k) ||
            (p.equippedArmor && p.equippedArmor.id === k) ||
            (p.equippedArtifact && p.equippedArtifact.id === k)) {
          unlockedCount++;
        }
      });

      if (countEl) {
        countEl.textContent = `${unlockedCount}/${allItemKeys.length}`;
      }

      const filter = this.compendiumFilter || 'all';
      let filteredKeys = allItemKeys;
      if (filter === 'usable') {
        filteredKeys = allItemKeys.filter(k => {
          const t = ITEMS[k].type;
          return t === 'pill' || t === 'talisman' || t === 'tea' || t === 'chest';
        });
      } else if (filter === 'material') {
        filteredKeys = allItemKeys.filter(k => {
          const t = ITEMS[k].type;
          return t === 'herb' || t === 'ore' || t === 'monster_mat';
        });
      } else if (filter === 'equipment') {
        filteredKeys = allItemKeys.filter(k => {
          const t = ITEMS[k].type;
          return t === 'weapon' || t === 'armor' || t === 'artifact';
        });
      }

      filteredKeys.forEach(k => {
        const item = ITEMS[k];
        const owned = (p.inventory && p.inventory[k]) || 0;
        const isEquipped = (p.equippedWeapon && p.equippedWeapon.id === k) ||
                           (p.equippedArmor && p.equippedArmor.id === k) ||
                           (p.equippedArtifact && p.equippedArtifact.id === k);
        const hasOwned = owned > 0 || isEquipped;

        const price = item.price || 50;
        let rarityColor = '#94a3b8';
        if (price > 30000) rarityColor = '#f87171';
        else if (price > 6000) rarityColor = '#fbbf24';
        else if (price > 1500) rarityColor = '#c084fc';
        else if (price > 250) rarityColor = '#38bdf8';
        else if (price > 50) rarityColor = '#34d399';

        const icon = getItemPixelSvg(k, 28);
        let typeName = 'Bảo Vật';
        if (item.type === 'pill') typeName = 'Đan Dược';
        else if (item.type === 'weapon') typeName = 'Binh Khí';
        else if (item.type === 'armor') typeName = 'Hộ Giáp';
        else if (item.type === 'artifact') typeName = 'Pháp Bảo';
        else if (item.type === 'herb') typeName = 'Linh Dược';
        else if (item.type === 'ore') typeName = 'Khoáng Thạch';
        else if (item.type === 'monster_mat') typeName = 'Dị Bảo Thú';
        else if (item.type === 'talisman') typeName = 'Phù Lục';
        else if (item.type === 'tea') typeName = 'Linh Trà';
        else if (item.type === 'chest') typeName = 'Bảo Hạp';
        else if (item.type === 'treasure_map') typeName = 'Cổ Đồ Tầm Bảo';
        else if (item.type === 'secret_tome') typeName = 'Tàn Quyển Bí Tịch';
        else if (item.type === 'pet_egg') typeName = 'Linh Thú Noãn';

        const card = document.createElement('div');
        card.className = `compendium-card ${hasOwned ? '' : 'locked'}`;
        card.innerHTML = `
          <div>
            <div class="compendium-card-top">
              <div class="compendium-card-icon">${icon}</div>
              <div class="compendium-card-info">
                <div class="compendium-card-name" style="color: ${rarityColor};">${item.name}</div>
                <div class="compendium-card-meta">
                  <span class="comp-badge">${typeName}</span>
                  <span class="comp-badge ${hasOwned ? 'comp-badge-owned' : 'comp-badge-unowned'}">
                    ${isEquipped ? 'Đang Đeo' : (owned > 0 ? `Sở Hữu: ${owned}` : 'Chưa Có')}
                  </span>
                </div>
              </div>
            </div>
            <div class="compendium-card-desc">${item.desc}</div>
            ${item.trait ? `<div class="comp-trait-badge">✨ ${item.trait}</div>` : ''}
            ${item.rawEffectDesc ? `<div class="item-stat-badge text-emerald" style="margin-top: 4px; font-size: 0.75rem;">🍃 ${item.rawEffectDesc}</div>` : ''}
            <div class="compendium-card-source">
              <strong>🧭 Cách kiếm:</strong> ${item.howToGet || 'Khám phá Tiên Giới, Phường Thị, Bí Cảnh'}
            </div>
          </div>
          <div style="display: flex; justify-content: flex-end; margin-top: 6px;">
            <button class="pixel-btn small-btn btn-inspect" style="width: 100%; background: rgba(30, 41, 59, 0.7);">🔍 Giám Định & Nguồn Gốc</button>
          </div>
        `;

        card.querySelector('.btn-inspect').onclick = (e) => {
          e.stopPropagation();
          this.showItemDetail(k, 'compendium');
        };

        card.onclick = () => {
          this.showItemDetail(k, 'compendium');
        };

        listEl.appendChild(card);
      });
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
      if (!sect) return;
      const curRank = this.getCurrentSectRank();
      const nextRank = this.getNextSectRank();

      const nameEl = document.getElementById('sect-name-display');
      const typeEl = document.getElementById('sect-type-display');
      const rankEl = document.getElementById('sect-rank-display');
      const contribEl = document.getElementById('sect-contrib-display');
      const rankTargetEl = document.getElementById('sect-rank-target');
      const progressTextEl = document.getElementById('sect-progress-text');
      const progressFillEl = document.getElementById('sect-rank-progress-fill');
      const btnSalary = document.getElementById('btn-sect-salary');

      if (nameEl) nameEl.textContent = sect.name;
      if (typeEl) typeEl.textContent = `${sect.type} • ${sect.desc}`;
      if (rankEl) rankEl.textContent = curRank ? curRank.rank : 'Đệ Tử';
      if (contribEl) contribEl.textContent = p.sectContrib || 0;

      const totalContrib = p.sectContribTotal ?? p.sectContrib ?? 0;
      if (nextRank) {
        if (rankTargetEl) rankTargetEl.textContent = nextRank.rank;
        if (progressTextEl) progressTextEl.textContent = `${totalContrib} / ${nextRank.minContrib} Tổng Tích Lũy`;
        if (progressFillEl) {
          const curMin = (curRank && curRank.minContrib) || 0;
          const range = Math.max(1, nextRank.minContrib - curMin);
          const pct = Math.max(0, Math.min(100, ((totalContrib - curMin) / range) * 100));
          progressFillEl.style.width = `${pct}%`;
        }
      } else {
        if (rankTargetEl) rankTargetEl.textContent = 'Đỉnh Cao Môn Phái';
        if (progressTextEl) progressTextEl.textContent = `${totalContrib} (Tối Đa)`;
        if (progressFillEl) progressFillEl.style.width = '100%';
      }

      // Nút Lĩnh Bổng Lộc Hàng Năm
      if (btnSalary) {
        const salary = (curRank && curRank.salary) || 10;
        if (p.sectSalaryClaimedYear === p.age) {
          btnSalary.disabled = true;
          const remMonths = Math.max(1, 12 - (p.month || 1));
          btnSalary.textContent = `✅ Đã Nhận (Còn ${remMonths} tháng đến niên mới)`;
          btnSalary.classList.remove('primary-btn');
        } else {
          btnSalary.disabled = false;
          btnSalary.textContent = `🎁 Nhận Bổng Lộc (+${salary} Linh Thạch)`;
          btnSalary.classList.add('primary-btn');
        }
      }

      // Danh Sách Nhiệm Vụ Tông Môn
      const questListEl = document.getElementById('sect-quest-list');
      if (questListEl) {
        questListEl.innerHTML = '';
        const curRankIdx = sect.ranks.indexOf(curRank);

        SECT_QUESTS.forEach(q => {
          let isMet = false;
          let progressInfo = '';
          const isRankLocked = q.minRankIndex !== undefined && curRankIdx < q.minRankIndex;
          const reqRankName = q.minRankIndex !== undefined && sect.ranks[q.minRankIndex] ? sect.ranks[q.minRankIndex].rank : null;

          if (isRankLocked) {
            progressInfo = `🔒 Yêu cầu chức vị: ${reqRankName}`;
          } else if (q.reqItem) {
            const count = (p.inventory && p.inventory[q.reqItem]) || 0;
            const itemObj = ITEMS[q.reqItem];
            isMet = count >= q.reqCount;
            progressInfo = `Cần: ${q.reqCount} ${itemObj ? itemObj.name : q.reqItem} (Hiện có: ${count})`;
          } else if (q.costStone) {
            const count = p.spiritStones || 0;
            isMet = count >= q.costStone;
            progressInfo = `Quyên góp: ${q.costStone} Linh Thạch (Hiện có: ${count})`;
          } else if (q.costMp) {
            const count = p.curMp || 0;
            isMet = count >= q.costMp;
            progressInfo = `Vận chuyển: ${q.costMp} MP (Hiện có: ${count})`;
          } else if (q.reqKills) {
            const kills = q.reqMonster
              ? ((p.sectQuestKills && p.sectQuestKills[q.reqMonster]) || 0)
              : (p.sectPatrolKills || 0);
            isMet = kills >= q.reqKills;
            progressInfo = `Chiến tích diệt yêu: ${Math.min(q.reqKills, kills)} / ${q.reqKills}`;
          }

          const card = document.createElement('div');
          card.className = `sect-quest-card ${isRankLocked ? 'locked' : ''}`;
          card.innerHTML = `
            <div style="flex: 1;">
              <div class="sect-quest-title">📜 ${q.name}</div>
              <div class="sect-quest-desc">${q.desc}</div>
              <div class="sect-quest-reward">
                <span>🎁 Thưởng: <strong>+${q.contrib} Cống Hiến</strong></span>
                ${q.stone ? `<span>• <strong>+${q.stone} Linh Thạch</strong></span>` : ''}
              </div>
              <div style="font-size: 11px; margin-top: 4px; font-weight: bold; color: ${isRankLocked ? '#f87171' : (isMet ? '#34d399' : '#f87171')};">
                ${progressInfo}
              </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 5px; align-items: flex-end;">
              ${q.reqKills && !isMet && !isRankLocked ? `<button class="pixel-btn small-btn btn-patrol" style="border-color: #ef4444; color: #fca5a5;">⚔️ Đi Diệt Yêu</button>` : ''}
              <button class="pixel-btn small-btn btn-submit ${isMet ? 'primary-btn' : ''}" ${isMet ? '' : 'disabled'}>
                ${isRankLocked ? 'Chưa Đạt Cấp' : (isMet ? `Giao Nộp (+${q.contrib})` : 'Chưa Đủ ĐK')}
              </button>
            </div>
          `;

          const btnSubmit = card.querySelector('.btn-submit');
          if (btnSubmit && !isRankLocked) btnSubmit.onclick = () => this.completeSectQuest(q.id);

          const btnPatrol = card.querySelector('.btn-patrol');
          if (btnPatrol && !isRankLocked) btnPatrol.onclick = () => this.startSectPatrolFight();

          questListEl.appendChild(card);
        });
      }

      // Danh Sách Bí Tịch Tàng Kinh Các
      const manualListEl = document.getElementById('sect-manual-list');
      if (manualListEl) {
        manualListEl.innerHTML = '';
        p.sectManualsBought = p.sectManualsBought || [];

        sect.manuals.forEach(m => {
          const isBought = p.sectManualsBought.includes(m.id);
          const canAfford = (p.sectContrib || 0) >= m.cost;

          const card = document.createElement('div');
          card.className = 'sect-manual-card';
          card.innerHTML = `
            <div>
              <div class="sect-manual-title">📖 ${m.name}</div>
              <div class="sect-manual-desc">${m.desc}</div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
              <div class="sect-manual-cost">🪙 ${m.cost} Cống Hiến</div>
              <button class="pixel-btn small-btn btn-buy-manual ${isBought ? '' : (canAfford ? 'primary-btn' : '')}" ${isBought || !canAfford ? 'disabled' : ''}>
                ${isBought ? '✅ Đã Lĩnh Ngộ' : (canAfford ? 'Lĩnh Ngộ' : `Thiếu (${p.sectContrib || 0}/${m.cost})`)}
              </button>
            </div>
          `;

          const btnBuy = card.querySelector('.btn-buy-manual');
          if (btnBuy && !isBought && canAfford) {
            btnBuy.onclick = () => this.buySectManual(m.id);
          }

          manualListEl.appendChild(card);
        });
      }
    }

    getWorldTileVisual(x, y) {
      const tiles = [
        { icon: '🌿', name: 'Linh lâm', className: 'forest' },
        { icon: '🌊', name: 'Linh thủy', className: 'water' },
        { icon: '⛰️', name: 'Sơn địa', className: 'mountain' },
        { icon: '🌾', name: 'Bình nguyên', className: 'plain' },
        { icon: '🪨', name: 'Hoang thạch', className: 'rock' }
      ];
      const seed = Math.abs((x * 37) + (y * 61) + (x * y * 11)) % tiles.length;
      return tiles[seed];
    }

    closeWorldCellMenu() {
      const menu = document.getElementById('world-cell-context-menu');
      if (menu) menu.classList.add('hidden');
      this.worldSelectedCell = null;
    }

    openWorldCellMenu(x, y, regionId, clientX, clientY) {
      const p = this.player;
      const menu = document.getElementById('world-cell-context-menu');
      if (!p || !menu) return;
      this.worldSelectedCell = { x, y, regionId };
      const position = p.worldGridPosition || { x: 0, y: 0 };
      const isCurrent = position.x === x && position.y === y;
      const region = regionId ? this.getWorldRegion(regionId) : null;
      const isReachable = !region || p.realmIndex >= region.reqRealmIndex;
      const regionName = region ? region.name : this.getWorldTileVisual(x, y).name;
      const travelText = region && region.id !== p.worldLocation ? `🧭 Đi đến ${region.name}` : (isCurrent ? '📍 Đang đứng tại ô này' : '🧭 Di chuyển đến ô');

      menu.innerHTML = `
        <div class="world-context-title">${region ? '📜 ' + region.name : '🧩 ' + regionName}</div>
        <button type="button" data-cell-action="move" ${isCurrent || !isReachable ? 'disabled' : ''}>${travelText}</button>
        <button type="button" data-cell-action="explore" ${!isReachable ? 'disabled' : ''}>🔍 Khám phá ô đất</button>
        ${isCurrent && region ? '<button type="button" data-cell-action="residence">🏠 Xây cư trú tại đây</button>' : ''}
        ${isCurrent ? '<button type="button" data-cell-action="meet">🤝 Tìm đạo hữu quanh đây</button>' : ''}
      `;
      menu.classList.remove('hidden');
      menu.style.left = `${Math.min(clientX, window.innerWidth - 235)}px`;
      menu.style.top = `${Math.min(clientY, window.innerHeight - 190)}px`;

      menu.querySelectorAll('[data-cell-action]').forEach(button => {
        button.addEventListener('click', () => {
          const action = button.dataset.cellAction;
          this.closeWorldCellMenu();
          if (action === 'move') this.moveToWorldCell(x, y, regionId);
          else if (action === 'explore') this.exploreWorldCell(x, y, regionId);
          else if (action === 'residence') this.buildWorldResidence();
          else if (action === 'meet') this.meetWorldTraveler();
        });
      });
    }

    moveToWorldCell(x, y, regionId) {
      const p = this.player;
      if (!p) return;
      const region = regionId ? this.getWorldRegion(regionId) : null;
      if (region && p.realmIndex < region.reqRealmIndex) {
        this.addLog(`Chưa đủ cảnh giới để tiến vào 【${region.name}】.`, 'warning');
        return;
      }
      if (region && region.id !== p.worldLocation) {
        this.travelToWorldRegion(region.id);
        return;
      }
      const oldPosition = p.worldGridPosition || { x: 0, y: 0 };
      const distance = Math.max(1, Math.abs(x - oldPosition.x) + Math.abs(y - oldPosition.y));
      const cost = distance * 5;
      if ((p.spiritStones || 0) < cost) {
        this.addLog(`Không đủ Linh Thạch để đi đến ô này (cần ${cost}).`, 'warning');
        return;
      }
      p.spiritStones -= cost;
      p.worldGridPosition = { x, y };
      this.worldEncounter = null;
      this.addLog(`🧭 Di chuyển đến ô [${x}, ${y}], tiêu hao ${cost} Linh Thạch.`, 'system');
      sound.playClick();
      this.updateUI();
    }

    exploreWorldCell(x, y, regionId) {
      const p = this.player;
      if (!p) return;
      const position = p.worldGridPosition || { x: 0, y: 0 };
      if (position.x !== x || position.y !== y) {
        this.moveToWorldCell(x, y, regionId);
        return;
      }
      if (regionId && regionId !== p.worldLocation) {
        this.travelToWorldRegion(regionId);
        return;
      }
      this.openWorldExplore();
    }

    renderOpenWorldUI() {
      const p = this.player;
      const mapEl = document.getElementById('world-map');
      if (!p || !mapEl) return;
      this.ensureWorldState();

      const escapeWorldText = value => String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      }[char]));

      const location = this.getWorldRegion(p.worldLocation);
      const locationEl = document.getElementById('world-location-summary');
      const residenceEl = document.getElementById('world-residence-info');
      const factionInfoEl = document.getElementById('world-faction-info');
      const factionCreateEl = document.getElementById('world-faction-create');
      const factionActiveEl = document.getElementById('world-faction-active');
      const allianceListEl = document.getElementById('world-alliance-list');
      const encounterEl = document.getElementById('world-encounter-info');
      const btnExplore = document.getElementById('btn-world-explore');
      const btnBuild = document.getElementById('btn-world-build-residence');
      const btnFactionUpgrade = document.getElementById('btn-world-faction-upgrade');

      const position = p.worldGridPosition || { x: location.gridX, y: location.gridY };
      const mapBounds = { minX: -1, maxX: 6, minY: -5, maxY: 1 };
      const getMapPoint = (x, y) => ({
        left: 10 + ((x - mapBounds.minX) / (mapBounds.maxX - mapBounds.minX)) * 80,
        top: 10 + ((y - mapBounds.minY) / (mapBounds.maxY - mapBounds.minY)) * 80
      });
      const regionIcons = {
        'Sơn lâm': '🌲',
        'Sơn mạch': '⛰️',
        'Kiếm vực': '⚔️',
        'Ma vực': '☠️',
        'Hư không': '🌌'
      };
      const regionPoints = new Map(WORLD_REGIONS.map(region => [region.id, getMapPoint(region.gridX, region.gridY)]));
      const routeHtml = WORLD_REGIONS.slice(1).map((region, index) => {
        const from = regionPoints.get(WORLD_REGIONS[index].id);
        const to = regionPoints.get(region.id);
        const deltaX = to.left - from.left;
        const deltaY = to.top - from.top;
        const length = Math.hypot(deltaX, deltaY);
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        return `<span class="world-map-route ${p.realmIndex >= region.reqRealmIndex ? 'unlocked' : ''}" style="left:${from.left}%;top:${from.top}%;width:${length}%;transform:rotate(${angle}deg)"></span>`;
      }).join('');
      const regionHtml = WORLD_REGIONS.map(region => {
        const point = regionPoints.get(region.id);
        const isCurrent = region.id === p.worldLocation;
        const isLocked = p.realmIndex < region.reqRealmIndex;
        const icon = isLocked ? '🔒' : (regionIcons[region.terrain] || '🗺️');
        const requiredRealm = REALMS[Math.min(region.reqRealmIndex, REALMS.length - 1)];
        return `
          <button type="button" class="world-map-node world-map-interactive ${isCurrent ? 'current' : ''} ${isLocked ? 'locked' : ''}" style="left:${point.left}%;top:${point.top}%" data-grid-x="${region.gridX}" data-grid-y="${region.gridY}" data-region-id="${region.id}" title="Mở bảng thao tác ${region.name}">
            <span class="world-map-node-icon">${isCurrent ? '📍' : icon}</span>
            <span class="world-map-node-label">${region.name}</span>
            <span class="world-map-node-meta">${isLocked ? `Cần ${requiredRealm.name}` : region.dangerLevel.split(' (')[0]}</span>
          </button>
        `;
      }).join('');
      const currentPoint = getMapPoint(position.x, position.y);
      const isAtRegion = position.x === location.gridX && position.y === location.gridY;
      const playerPinHtml = isAtRegion ? '' : `
        <button type="button" class="world-map-player world-map-interactive" style="left:${currentPoint.left}%;top:${currentPoint.top}%" data-grid-x="${position.x}" data-grid-y="${position.y}" data-region-id="" title="Vị trí hiện tại">
          <span>📍</span><small>Đạo hữu</small>
        </button>
      `;
      mapEl.innerHTML = `
        <div class="world-map-titlebar"><span>ATLAS VẠN GIỚI</span><span>Ô [${position.x}, ${position.y}]</span></div>
        <div class="world-map-compass">N</div>
        <div class="world-map-landmark landmark-forest">🌲</div>
        <div class="world-map-landmark landmark-river">〰️</div>
        <div class="world-map-landmark landmark-ruins">✦</div>
        <div class="world-map-routes">${routeHtml}</div>
        ${regionHtml}
        ${playerPinHtml}
        <div class="world-map-legend"><span><i class="legend-dot unlocked"></i> Có thể đến</span><span><i class="legend-dot locked"></i> Chưa đủ cảnh giới</span></div>
      `;
      const getMapCellFromEvent = event => {
        const bounds = mapEl.getBoundingClientRect();
        const normalizedX = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
        const normalizedY = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
        return {
          x: Math.round(mapBounds.minX + ((normalizedX - 0.1) / 0.8) * (mapBounds.maxX - mapBounds.minX)),
          y: Math.round(mapBounds.minY + ((normalizedY - 0.1) / 0.8) * (mapBounds.maxY - mapBounds.minY))
        };
      };
      if (!mapEl._delegated) {
        mapEl.addEventListener('contextmenu', event => {
          const cell = event.target.closest('.world-map-interactive');
          if (!cell && event.target !== mapEl) return;
          event.preventDefault();
          const mapCell = cell ? null : getMapCellFromEvent(event);
          this.openWorldCellMenu(
            cell ? Number(cell.dataset.gridX) : mapCell.x,
            cell ? Number(cell.dataset.gridY) : mapCell.y,
            cell ? (cell.dataset.regionId || null) : null,
            event.clientX,
            event.clientY
          );
        });
        mapEl.addEventListener('click', event => {
          const cell = event.target.closest('.world-map-interactive');
          if (!cell && event.target !== mapEl) return;
          const mapCell = cell ? null : getMapCellFromEvent(event);
          this.openWorldCellMenu(
            cell ? Number(cell.dataset.gridX) : mapCell.x,
            cell ? Number(cell.dataset.gridY) : mapCell.y,
            cell ? (cell.dataset.regionId || null) : null,
            event.clientX,
            event.clientY
          );
        });
        mapEl._delegated = true;
      }

      const travelCost = this.getWorldTravelCost(location);
      if (locationEl) {
        const realm = REALMS[Math.min(location.reqRealmIndex, REALMS.length - 1)];
        locationEl.innerHTML = `
          <div class="world-location-title">📍 ${location.name}</div>
          <div class="world-location-meta">${location.terrain} • ${location.dangerLevel}</div>
          <div class="world-location-desc">${location.desc}</div>
          <div class="world-location-meta">Vị trí ô [${position.x}, ${position.y}] • Lộ phí truyền tống khu vực: ${travelCost} Linh Thạch</div>
        `;
      }

      if (btnExplore) {
        btnExplore.disabled = p.realmIndex < location.reqRealmIndex;
        btnExplore.textContent = btnExplore.disabled ? '🔒 Chưa Đủ Cảnh Giới' : `🧭 Khám Phá ${location.name}`;
      }

      if (residenceEl) {
        const residence = p.worldResidence;
        if (!residence) {
          residenceEl.innerHTML = 'Chưa có cư trú. Dựng động phủ để nhận bonus tu luyện khi ở đúng địa điểm.';
        } else {
          const residenceRegion = this.getWorldRegion(residence.regionId);
          residenceEl.innerHTML = `🏠 <strong>${escapeWorldText(residence.name)}</strong> — Cấp ${residence.level}/3 tại ${residenceRegion.name}<br><span class="world-location-meta">Ở tại cư trú: +${residence.level * 5}% tốc độ hấp thu tu vi.</span>`;
        }
      }
      if (btnBuild) {
        const level = p.worldResidence ? p.worldResidence.level : 0;
        btnBuild.disabled = level >= 3;
        btnBuild.textContent = level === 0 ? '🏠 Dựng Cư Trú' : (level >= 3 ? '✅ Cư Trú Tối Đa' : `🏗️ Nâng Cấp Cư Trú (${level}/3)`);
      }

      if (p.worldFaction) {
        const faction = p.worldFaction;
        if (factionCreateEl) factionCreateEl.classList.add('hidden');
        if (factionActiveEl) factionActiveEl.classList.remove('hidden');
        if (factionInfoEl) factionInfoEl.innerHTML = `🏯 <strong>${escapeWorldText(faction.name)}</strong> • ${escapeWorldText(faction.type)}<br><span class="world-location-meta">“${escapeWorldText(faction.motto)}” • Cấp ${faction.level}/5 • ${faction.members ? faction.members.length : 1} thành viên • Ảnh hưởng ${faction.influence || 0}</span>`;
        if (btnFactionUpgrade) {
          btnFactionUpgrade.disabled = faction.level >= 5;
          btnFactionUpgrade.textContent = faction.level >= 5 ? '✅ Đã Tối Đa' : `🏗️ Mở Rộng Thế Lực (${900 * faction.level} Linh Thạch)`;
        }
      } else {
        if (factionCreateEl) factionCreateEl.classList.remove('hidden');
        if (factionActiveEl) factionActiveEl.classList.add('hidden');
        if (factionInfoEl) factionInfoEl.textContent = 'Chưa có thế lực riêng. Có thể lập thế lực sau khi tích lũy tài nguyên.';
      }

      if (allianceListEl) {
        allianceListEl.innerHTML = WORLD_FACTIONS.map(faction => {
          const isAllied = p.worldAlliances.includes(faction.id);
          const canReach = p.realmIndex >= faction.reqRealmIndex;
          const cost = 500 + faction.influence * 10;
          return `<div class="world-alliance-row"><div><strong>${faction.name}</strong><br><span class="world-location-meta">${faction.type} • ${faction.desc}</span></div><button type="button" class="pixel-btn small-btn ${isAllied ? '' : 'primary-btn'}" data-world-alliance="${faction.id}" ${isAllied || !p.worldFaction || !canReach ? 'disabled' : ''}>${isAllied ? '✅ Đã Kết Minh' : (canReach ? `🤝 Kết Minh (${cost})` : `🔒 Cần ${REALMS[faction.reqRealmIndex].name}`)}</button></div>`;
        }).join('');
        allianceListEl.querySelectorAll('[data-world-alliance]').forEach(button => {
          button.addEventListener('click', () => this.formWorldAlliance(button.dataset.worldAlliance));
        });
      }

      if (encounterEl) {
        const traveler = this.worldEncounter;
        if (!traveler) {
          encounterEl.innerHTML = '<span class="world-location-meta">Chưa gặp đạo hữu nào trong chuyến này. Bấm “Khám Phá” để tìm kiếm kỳ ngộ.</span>';
        } else {
          const travelerRealm = REALMS[Math.min(traveler.realmIndex, REALMS.length - 1)];
          const relation = p.worldRelations[traveler.id] || 0;
          const recruited = !!(p.worldFaction && p.worldFaction.members && p.worldFaction.members.includes(traveler.name));
          const rewardClaimed = !!p.worldEncounterRewardClaimed;
          encounterEl.innerHTML = `
            <div class="world-encounter-title">🤝 ${traveler.name} <span class="world-location-meta">— ${traveler.title}</span></div>
            <div class="world-location-meta">${traveler.faction} • ${travelerRealm.name} • Tâm trạng: ${traveler.mood} • Hảo cảm: ${relation}</div>
            <div class="world-encounter-actions">
              <button type="button" id="btn-world-socialize" class="pixel-btn small-btn primary-btn" ${rewardClaimed ? 'disabled' : ''}>${rewardClaimed ? '✅ Đã Giao Du Lần Này' : '🍵 Giao Du Luận Đạo (+Linh Thạch)'}</button>
              <button type="button" id="btn-world-recruit" class="pixel-btn small-btn" ${!p.worldFaction || recruited ? 'disabled' : ''}>🏳️ ${recruited ? 'Đã Chiêu Mộ' : 'Mời Vào Thế Lực'}</button>
            </div>
            <div class="world-encounter-note">${rewardClaimed ? 'Phần thưởng đã nhận. Một lần gặp chỉ đổi thưởng một lần.' : 'Mỗi lần gặp chỉ có một phần thưởng giao du.'}</div>
          `;
          const socializeButton = document.getElementById('btn-world-socialize');
          const recruitButton = document.getElementById('btn-world-recruit');
          if (socializeButton) socializeButton.onclick = () => this.socializeWorldTraveler();
          if (recruitButton) recruitButton.onclick = () => this.recruitWorldTraveler();
        }
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
          <div class="item-name" style="cursor: pointer;" title="Bấm để xem chi tiết">${item.icon ? `<span class="item-icon-tag">${item.icon}</span> ` : ''}${item.name}</div>
          <div class="item-desc">${item.desc}</div>
          <div class="item-price" style="color: var(--text-gold);">💰 Giá: ${item.price} Linh Thạch</div>
          <div class="item-stock" style="font-size: 11px; color: ${item.stock === 0 ? '#f87171' : '#94a3b8'};">${item.stock === 0 ? 'Hết hàng' : `Còn ${item.stock ?? 1}`}</div>
          <div class="item-actions" style="display: flex; gap: 6px; margin-top: 6px;">
            <button class="pixel-btn small-btn btn-market-inspect" style="background: rgba(30, 41, 59, 0.7);">🔍 Xem</button>
            <button class="pixel-btn small-btn primary-btn btn-market-buy" ${item.stock === 0 ? 'disabled' : ''}>Mua</button>
          </div>
        `;
        card.querySelector('.btn-market-inspect').onclick = (e) => {
          e.stopPropagation();
          this.showItemDetail(item.id, 'market');
        };
        card.querySelector('.item-name').onclick = (e) => {
          e.stopPropagation();
          this.showItemDetail(item.id, 'market');
        };
        card.querySelector('.btn-market-buy').onclick = (e) => {
          e.stopPropagation();
          this.buyItem(item.id);
        };
        container.appendChild(card);
      });
    }
  }

  // ==========================================================================
  // 7. APP CONTROLLER & LOGGING
  // ==========================================================================
  let activeGameSystems = null;
  let activeCombatEngine = null;
  let isLogDrawerOpen = false;
  let logUnreadCount = 0;
  let isLogPinned = false;

  function updateLogUnreadBadges() {
    const badgeHeader = document.getElementById('log-unread-badge');
    const badgeFloat = document.getElementById('floating-unread-badge');
    if (logUnreadCount > 0) {
      const displayTxt = logUnreadCount > 99 ? '99+' : `${logUnreadCount}`;
      if (badgeHeader) {
        badgeHeader.textContent = displayTxt;
        badgeHeader.classList.remove('hidden');
      }
      if (badgeFloat) {
        badgeFloat.textContent = displayTxt;
        badgeFloat.classList.remove('hidden');
      }
    } else {
      if (badgeHeader) badgeHeader.classList.add('hidden');
      if (badgeFloat) badgeFloat.classList.add('hidden');
    }
  }

  function setLogDrawerOpen(isOpen) {
    const rightPanel = document.getElementById('right-log-panel');
    const backdrop = document.getElementById('log-drawer-backdrop');
    if (!rightPanel) return;

    if (isLogPinned) {
      isLogDrawerOpen = false;
      rightPanel.classList.remove('open');
      if (backdrop) backdrop.classList.remove('active');
      logUnreadCount = 0;
      updateLogUnreadBadges();
      return;
    }

    isLogDrawerOpen = !!isOpen;
    if (isLogDrawerOpen) {
      rightPanel.classList.add('open');
      if (backdrop) backdrop.classList.add('active');
      logUnreadCount = 0;
      updateLogUnreadBadges();
      sound.playClick();
      const container = document.getElementById('log-messages');
      if (container) container.scrollTop = container.scrollHeight;
    } else {
      rightPanel.classList.remove('open');
      if (backdrop) backdrop.classList.remove('active');
    }
  }

  function toggleLogDrawer() {
    setLogDrawerOpen(!isLogDrawerOpen);
  }

  function addLog(text, type = 'normal') {
    const container = document.getElementById('log-messages');
    if (!container) return;
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;

    let timeBadge = '';
    if (activeGameSystems && activeGameSystems.player) {
      const p = activeGameSystems.player;
      timeBadge = `[Năm ${p.age} • T.${p.month}]`;
    }
    if (timeBadge) {
      const timestampEl = document.createElement('span');
      timestampEl.className = 'log-timestamp';
      timestampEl.textContent = timeBadge;
      entry.appendChild(timestampEl);
    }
    const textEl = document.createElement('span');
    textEl.textContent = String(text ?? '');
    entry.appendChild(textEl);
    container.appendChild(entry);
    container.scrollTop = container.scrollHeight;

    // Track unread if not open and not pinned
    if (!isLogPinned && !isLogDrawerOpen) {
      logUnreadCount++;
      updateLogUnreadBadges();
    }
  }

  const TAB_ALIASES = {
    'tab-meditate': { tab: 'tab-nhanvat', sub: 'subtab-meditate' },
    'tab-alchemy': { tab: 'tab-nhanvat', sub: 'subtab-alchemy' },
    'tab-dongphu': { tab: 'tab-nhanvat', sub: 'subtab-meditate' },
    'tab-world': { tab: 'tab-tiengioi', sub: 'subtab-world' },
    'tab-sect': { tab: 'tab-tiengioi', sub: 'subtab-sect' },
    'tab-inventory': { tab: 'tab-bachbao', sub: 'subtab-inventory' },
    'tab-market': { tab: 'tab-bachbao', sub: 'subtab-market' },
    'tab-compendium': { tab: 'tab-bachbao', sub: 'subtab-compendium' }
  };

  function switchTab(tabId) {
    const resultOverlay = document.getElementById('combat-result-overlay');
    const hasCombatResult = resultOverlay && !resultOverlay.classList.contains('hidden');

    // Khi đã có kết quả, đóng trận chiến trước khi chuyển tab. Điều này tránh
    // việc click tab đúng lúc modal kết quả đang hiện bị bỏ qua và màn hình bị
    // giữ lại ở canvas combat.
    if (activeCombatEngine && activeCombatEngine.inCombat && tabId !== 'tab-combat' && hasCombatResult) {
      activeCombatEngine.closeResultAndEnd();
    }

    // Tự đồng bộ lại lớp hiển thị nếu một luồng kết thúc combat trước đó bị
    // ngắt giữa chừng, nhưng trạng thái engine đã là không còn chiến đấu.
    if (activeCombatEngine && !activeCombatEngine.inCombat && document.body.classList.contains('combat-active-mode')) {
      document.body.classList.remove('combat-active-mode', 'combat-result-ready');
      const headerEl = document.getElementById('combat-active-header');
      if (headerEl) headerEl.classList.add('hidden');
    }

    if (activeCombatEngine && activeCombatEngine.inCombat && tabId !== 'tab-combat') {
      if (activeGameSystems) activeGameSystems.addLog('⚠️ Đang trong sinh tử chiến! Thần thức tập trung, không thể rời trận!', 'warning');
      sound.playHurt();
      return;
    }

    let targetMainTab = tabId;
    let targetSubTab = null;
    if (TAB_ALIASES[tabId]) {
      targetMainTab = TAB_ALIASES[tabId].tab;
      targetSubTab = TAB_ALIASES[tabId].sub;
    }

    // Quản lý hiển thị Canvas: Phần nhân vật ngồi thiền CHỈ THUỘC tab Nhân Vật
    if (targetMainTab === 'tab-nhanvat') {
      document.body.classList.add('tab-nhanvat-active');
    } else {
      document.body.classList.remove('tab-nhanvat-active');
    }

    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tab') === targetMainTab);
    });
    document.querySelectorAll('.tab-pane').forEach(p => {
      p.classList.toggle('active', p.id === targetMainTab);
    });

    if (targetSubTab) {
      const pane = document.getElementById(targetMainTab);
      if (pane) {
        pane.querySelectorAll('.sub-tab-btn').forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-subtab') === targetSubTab);
        });
        pane.querySelectorAll('.sub-tab-content').forEach(c => {
          c.classList.toggle('active', c.id === targetSubTab);
        });
      }
    }

    if (activeGameSystems && activeGameSystems.renderer) {
      if (targetMainTab === 'tab-combat') {
        activeGameSystems.renderer.setScene(SCENES.COMBAT);
      } else if (targetMainTab === 'tab-nhanvat') {
        const activeSub = document.querySelector('#tab-nhanvat .sub-tab-btn.active')?.getAttribute('data-subtab');
        if (activeSub === 'subtab-alchemy') {
          activeGameSystems.renderer.setScene(SCENES.ALCHEMY);
        } else {
          activeGameSystems.renderer.setScene(SCENES.MEDITATE);
        }
      }
    }
  }
  if (typeof window !== 'undefined') window.switchTab = switchTab;

  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
    const mainCanvas = document.getElementById('main-canvas');
    const renderer = new PixelRenderer(mainCanvas);
    const systems = new GameSystems(renderer, addLog);
    activeGameSystems = systems;
    window.activeGameSystems = systems;
    renderer.setSystems(systems);

    const combatEngine = new CombatEngine(renderer, addLog, () => {
      systems.updateUI();
      switchTab('tab-tiengioi');
    });
    activeCombatEngine = combatEngine;
    window.activeCombatEngine = combatEngine;
    combatEngine.setSystems(systems);
    systems.setCombatEngine(combatEngine);

    const avatarCanvas = document.getElementById('avatar-canvas');
    if (avatarCanvas) {
      const actx = avatarCanvas.getContext('2d');
      actx.imageSmoothingEnabled = false;
      actx.fillStyle = '#0f172a';
      actx.fillRect(0, 0, 48, 48);
      drawPixelSprite(actx, SPRITES.playerMeditate, 0, 0, 3);
    }

    const mobAvatarCanvas = document.getElementById('mobile-avatar-canvas');
    if (mobAvatarCanvas) {
      const mctx = mobAvatarCanvas.getContext('2d');
      mctx.imageSmoothingEnabled = false;
      mctx.fillStyle = '#0f172a';
      mctx.fillRect(0, 0, 32, 32);
      drawPixelSprite(mctx, SPRITES.playerMeditate, 0, 0, 2);
    }

    if (typeof Image !== 'undefined') {
      const avatarImg = new Image();
      avatarImg.onload = () => {
        if (avatarCanvas) {
          const actx = avatarCanvas.getContext('2d');
          actx.clearRect(0, 0, 48, 48);
          actx.drawImage(avatarImg, 0, 0, 48, 48);
        }
        if (mobAvatarCanvas) {
          const mctx = mobAvatarCanvas.getContext('2d');
          mctx.clearRect(0, 0, 32, 32);
          mctx.drawImage(avatarImg, 0, 0, 32, 32);
        }
      };
      avatarImg.src = 'assets/avatar_cultivator.png';
    }

    let creationFlowInitialized = false;
    const creationModal = document.getElementById('creation-modal');

    const showCreationForAuthenticatedPlayer = () => {
      if (systems.player || !window.neonAuth?.getUser()) return;
      document.body.classList.remove('auth-required');
      if (creationModal) creationModal.classList.remove('hidden');
      if (!creationFlowInitialized) {
        initCreationModal(systems);
        creationFlowInitialized = true;
      }
    };

    const requireAuthForNewPlayer = () => {
      document.body.classList.add('auth-required');
      if (creationModal) creationModal.classList.add('hidden');
      window.neonAuth?.open();
    };

    window.addEventListener('neon-auth-change', event => {
      if (event.detail?.user && !systems.player) {
        showCreationForAuthenticatedPlayer();
      } else if (!event.detail?.user && !systems.player) {
        requireAuthForNewPlayer();
      }
    });

    const hasSave = systems.loadFromLocalStorage();
    if (hasSave) {
      creationModal?.classList.add('hidden');
      systems.updateUI();
    } else if (window.neonAuth?.getUser()) {
      showCreationForAuthenticatedPlayer();
    } else {
      requireAuthForNewPlayer();
    }

    setupUIEvents(systems, combatEngine, renderer);
    });
  }

  function setupUIEvents(systems, combatEngine, renderer) {
    document.addEventListener('click', event => {
      if (!event.target.closest('#world-cell-context-menu')) systems.closeWorldCellMenu();
    });
    document.addEventListener('contextmenu', event => {
      if (!event.target.closest('.world-grid-cell') && !event.target.closest('#world-cell-context-menu')) systems.closeWorldCellMenu();
    });

    // Xử lý chuyển tab chính (4 Trụ Cột)
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playClick();
        const tabId = btn.getAttribute('data-tab');
        switchTab(tabId);
      });
    });

    // Xử lý chuyển sub-tab (Phân mục con)
    document.querySelectorAll('.sub-tab-btn').forEach(subBtn => {
      subBtn.addEventListener('click', () => {
        sound.playClick();
        const parentPane = subBtn.closest('.tab-pane');
        if (!parentPane) return;
        const subId = subBtn.getAttribute('data-subtab');

        parentPane.querySelectorAll('.sub-tab-btn').forEach(b => {
          b.classList.toggle('active', b === subBtn);
        });
        parentPane.querySelectorAll('.sub-tab-content').forEach(c => {
          c.classList.toggle('active', c.id === subId);
        });

        if ((parentPane.id === 'tab-nhanvat' || parentPane.id === 'tab-dongphu') && renderer) {
          if (subId === 'subtab-alchemy') {
            renderer.setScene(SCENES.ALCHEMY);
          } else {
            renderer.setScene(SCENES.MEDITATE);
          }
        }
      });
    });

    const btnGatherQi = document.getElementById('btn-gather-qi');
    if (btnGatherQi) {
      btnGatherQi.addEventListener('click', () => {
        systems.activeGatherQi();
        renderer.spawnQiParticles();
        renderer.spawnQiParticles();
      });
    }

    const btnUseExpPill = document.getElementById('btn-use-exp-pill');
    if (btnUseExpPill) btnUseExpPill.addEventListener('click', () => systems.useInventoryItem('pill_tukhi'));

    const btnBreakthrough = document.getElementById('btn-breakthrough');
    if (btnBreakthrough) btnBreakthrough.addEventListener('click', () => systems.breakthrough());

    const btnBreakthroughSanctum = document.getElementById('btn-breakthrough-sanctum');
    if (btnBreakthroughSanctum) btnBreakthroughSanctum.addEventListener('click', () => systems.breakthrough());

    // Xem chi tiết / tháo lắp trang bị khi bấm vào slot
    ['weapon', 'armor', 'artifact'].forEach(slot => {
      const slotEl = document.getElementById(`slot-${slot}`);
      if (slotEl) {
        slotEl.addEventListener('click', () => {
          const p = systems.player;
          if (!p) return;
          const gear = slot === 'weapon' ? p.equippedWeapon : (slot === 'armor' ? p.equippedArmor : p.equippedArtifact);
          if (gear) {
            systems.showItemDetail(gear.id, 'equipped_' + slot);
          } else {
            systems.showAlert('Chưa Trang Bị', `Chưa có ${slot === 'weapon' ? 'vũ khí' : (slot === 'armor' ? 'hộ giáp' : 'pháp bảo')} nào được trang bị! Hãy mở Bách Bảo để trang bị.`);
          }
        });
      }

      const equipTextEl = document.getElementById(`equip-${slot}`);
      if (equipTextEl) {
        equipTextEl.style.cursor = 'pointer';
        equipTextEl.title = 'Bấm để xem chi tiết / tháo trang bị';
        equipTextEl.addEventListener('click', () => {
          const p = systems.player;
          if (!p) return;
          const gear = slot === 'weapon' ? p.equippedWeapon : (slot === 'armor' ? p.equippedArmor : p.equippedArtifact);
          if (gear) {
            systems.showItemDetail(gear.id, 'equipped_' + slot);
          }
        });
      }
    });

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

    const btnGatherResources = document.getElementById('btn-gather-resources');
    if (btnGatherResources) {
      btnGatherResources.addEventListener('click', () => {
        systems.gatherRegionalResources();
      });
    }

    // Bộ lọc danh mục túi đồ
    document.querySelectorAll('.inv-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playClick();
        document.querySelectorAll('.inv-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        systems.inventoryFilter = btn.getAttribute('data-filter') || 'all';
        systems.renderInventoryUI();
      });
    });

    // Bộ lọc danh mục Vạn Vật Quyển
    document.querySelectorAll('.comp-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playClick();
        document.querySelectorAll('.comp-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        systems.compendiumFilter = btn.getAttribute('data-filter') || 'all';
        systems.renderCompendiumUI();
      });
    });

    const btnWorldExplore = document.getElementById('btn-world-explore');
    if (btnWorldExplore) {
      btnWorldExplore.addEventListener('click', () => {
        systems.openWorldExplore();
        if (combatEngine.inCombat) switchTab('tab-combat');
      });
    }

    const btnWorldBuildResidence = document.getElementById('btn-world-build-residence');
    if (btnWorldBuildResidence) btnWorldBuildResidence.addEventListener('click', () => systems.buildWorldResidence());

    const btnWorldCreateFaction = document.getElementById('btn-world-create-faction');
    if (btnWorldCreateFaction) btnWorldCreateFaction.addEventListener('click', () => systems.createWorldFaction());

    const btnWorldFactionUpgrade = document.getElementById('btn-world-faction-upgrade');
    if (btnWorldFactionUpgrade) btnWorldFactionUpgrade.addEventListener('click', () => systems.upgradeWorldFaction());

    const btnAttack = document.getElementById('btn-combat-attack');
    const btnSkill = document.getElementById('btn-combat-skill');
    const btnSkill2 = document.getElementById('btn-combat-skill2');
    const btnArtifact = document.getElementById('btn-combat-artifact');
    const btnPill = document.getElementById('btn-combat-pill');
    const btnFlee = document.getElementById('btn-combat-flee');
    const btnAutoCombat = document.getElementById('btn-combat-auto');
    const btnCombatSpeed = document.getElementById('btn-combat-speed');
    const btnCloseResult = document.getElementById('btn-combat-close-result');

    const btnTalisman = document.getElementById('btn-combat-talisman');

    const picker = document.getElementById('combat-item-picker');
    const openCombatPicker = (type) => {
      if (!combatEngine.isPlayerTurn || combatEngine.isProcessingTurn) return;
      if (!picker) return;
      if (!picker.classList.contains('hidden') && picker.dataset.pickerType === type) {
        picker.classList.add('hidden');
        return;
      }
      picker.innerHTML = '';
      picker.dataset.pickerType = type;
      const pInv = systems.player?.inventory || {};

      let itemKeys = [];
      if (type === 'pill') {
        itemKeys = ['pill_hoixuan', 'pill_tulinh', 'pill_quy_nguyen', 'pill_ngung_than', 'pill_bao_khi'].filter(k => (pInv[k] || 0) > 0);
      } else if (type === 'talisman') {
        itemKeys = ['talisman_dan_loi', 'talisman_liet_hoa', 'talisman_bang_phong', 'talisman_kim_cuong', 'talisman_an_than', 'talisman_thien_nhan', 'talisman_don_dia'].filter(k => (pInv[k] || 0) > 0);
      }

      if (itemKeys.length === 0) {
        picker.innerHTML = `<span style="color: var(--text-dim); font-size: 11px;">Không có ${type === 'pill' ? 'đan dược' : 'phù lục'} phù hợp trong túi!</span>`;
        picker.classList.remove('hidden');
        setTimeout(() => picker.classList.add('hidden'), 2000);
        return;
      }

      itemKeys.forEach(k => {
        const item = ITEMS[k];
        if (!item) return;
        const btn = document.createElement('button');
        btn.className = 'combat-item-pill-btn';
        btn.innerHTML = `${item.icon || '💎'} ${item.name} <span class="pill-badge">x${pInv[k]}</span>`;
        btn.onclick = () => {
          picker.classList.add('hidden');
          if (type === 'pill') {
            combatEngine.playerUsePill(k);
          } else {
            combatEngine.playerUseTalisman(k);
          }
        };
        picker.appendChild(btn);
      });
      picker.classList.remove('hidden');
    };

    if (btnAttack) btnAttack.addEventListener('click', () => combatEngine.playerNormalAttack());
    if (btnSkill) btnSkill.addEventListener('click', () => combatEngine.playerCastSkill(0));
    if (btnSkill2) btnSkill2.addEventListener('click', () => combatEngine.playerCastSkill(1));
    if (btnArtifact) btnArtifact.addEventListener('click', () => combatEngine.playerUseArtifact());
    if (btnPill) btnPill.addEventListener('click', () => openCombatPicker('pill'));
    if (btnTalisman) btnTalisman.addEventListener('click', () => openCombatPicker('talisman'));
    if (btnFlee) btnFlee.addEventListener('click', () => combatEngine.playerFlee());

    if (btnAutoCombat) btnAutoCombat.addEventListener('click', () => combatEngine.toggleAutoCombat());
    if (btnCombatSpeed) btnCombatSpeed.addEventListener('click', () => combatEngine.toggleCombatSpeed());
    if (btnCloseResult) btnCloseResult.addEventListener('click', () => combatEngine.closeResultAndEnd());

    // Nút Luyện Đan Tương Tác & Dược Điển
    const btnOpenHerb = document.getElementById('btn-open-herb-encyclopedia');
    if (btnOpenHerb) btnOpenHerb.addEventListener('click', () => systems.openHerbEncyclopedia());
    const btnCloseHerb = document.getElementById('btn-close-herb-modal');
    if (btnCloseHerb) btnCloseHerb.addEventListener('click', () => systems.closeHerbEncyclopedia());
    const btnFireMartial = document.getElementById('btn-fire-martial');
    if (btnFireMartial) btnFireMartial.addEventListener('click', () => systems.setAlchemyFireMode('martial'));
    const btnFireGentle = document.getElementById('btn-fire-gentle');
    if (btnFireGentle) btnFireGentle.addEventListener('click', () => systems.setAlchemyFireMode('gentle'));
    const btnHarvestPill = document.getElementById('btn-harvest-pill');
    if (btnHarvestPill) btnHarvestPill.addEventListener('click', () => systems.harvestPill());

    // Nút Bí Cảnh Roguelike 5 Tầng
    const btnEnterDungeon = document.getElementById('btn-enter-dungeon');
    if (btnEnterDungeon) {
      btnEnterDungeon.addEventListener('click', () => {
        const selectReg = document.getElementById('select-region');
        const regIdx = selectReg ? Number(selectReg.value || 0) : 0;
        const reg = WORLD_REGIONS[regIdx] || WORLD_REGIONS[0];
        systems.startDungeon(reg.id);
      });
    }
    const btnDungeonRetreat = document.getElementById('btn-dungeon-retreat');
    if (btnDungeonRetreat) btnDungeonRetreat.addEventListener('click', () => systems.retreatDungeon());

    // Unified Keyboard Dispatcher: Combat actions, Modal shortcuts, Drawer toggle
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

      // 1. Phím tắt chiến đấu khi đang trong trận
      if (combatEngine && combatEngine.inCombat) {
        if (['1', '2', '3', '4', '5', '6'].includes(e.key) || e.key === 'e' || e.key === 'E' || e.key === 't' || e.key === 'T') {
          e.preventDefault();
          if (!combatEngine.isPlayerTurn || combatEngine.isProcessingTurn) return;

          if (e.key === '1') combatEngine.playerNormalAttack();
          else if (e.key === '2') combatEngine.playerCastSkill(0);
          else if (e.key === 'e' || e.key === 'E') combatEngine.playerCastSkill(1);
          else if (e.key === '3') combatEngine.playerUseArtifact();
          else if (e.key === '4') openCombatPicker('pill');
          else if (e.key === 't' || e.key === 'T' || e.key === '6') openCombatPicker('talisman');
          else if (e.key === '5') combatEngine.playerFlee();
          return;
        } else if (e.key === 'a' || e.key === 'A') {
          e.preventDefault();
          combatEngine.toggleAutoCombat();
          return;
        } else if (e.key === 's' || e.key === 'S') {
          e.preventDefault();
          combatEngine.toggleCombatSpeed();
          return;
        } else if (e.key === ' ' || e.key === 'Enter') {
          const overlay = document.getElementById('combat-result-overlay');
          if (overlay && !overlay.classList.contains('hidden')) {
            e.preventDefault();
            combatEngine.closeResultAndEnd();
            return;
          }
        }
      }

      // 2. Phím tắt giao diện chung (L: Thiên Cơ Lục, Escape: Đóng Modal, Enter/Space xác nhận)
      if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        if (isLogPinned) {
          const container = document.getElementById('log-messages');
          if (container) container.scrollTop = container.scrollHeight;
        } else {
          toggleLogDrawer();
        }
      } else if (e.key === 'Escape') {
        const mobMenuModal = document.getElementById('mobile-menu-modal');
        if (mobMenuModal && !mobMenuModal.classList.contains('hidden')) {
          e.preventDefault();
          mobMenuModal.classList.add('hidden');
          return;
        }
        const herbModal = document.getElementById('herb-encyclopedia-modal');
        if (herbModal && !herbModal.classList.contains('hidden')) {
          e.preventDefault();
          herbModal.classList.add('hidden');
          return;
        }
        const itemModal = document.getElementById('item-detail-modal');
        const btModal = document.getElementById('breakthrough-modal');
        const confirmModal = document.getElementById('custom-confirm-modal');
        const alertModal = document.getElementById('custom-alert-modal');
        const eventModal = document.getElementById('event-modal');

        if (alertModal && !alertModal.classList.contains('hidden')) {
          e.preventDefault();
          alertModal.classList.add('hidden');
          return;
        }
        if (confirmModal && !confirmModal.classList.contains('hidden')) {
          e.preventDefault();
          const btnNo = document.getElementById('btn-confirm-no');
          if (btnNo) btnNo.click();
          else confirmModal.classList.add('hidden');
          return;
        }
        if (btModal && !btModal.classList.contains('hidden')) {
          e.preventDefault();
          btModal.classList.add('hidden');
          return;
        }
        if (itemModal && !itemModal.classList.contains('hidden')) {
          e.preventDefault();
          itemModal.classList.add('hidden');
          return;
        }
        if (eventModal && !eventModal.classList.contains('hidden')) {
          e.preventDefault();
          eventModal.classList.add('hidden');
          return;
        }

        if (isLogDrawerOpen) {
          e.preventDefault();
          setLogDrawerOpen(false);
        }
      } else if (e.key === 'Enter' || e.key === ' ') {
        const btModal = document.getElementById('breakthrough-modal');
        if (btModal && !btModal.classList.contains('hidden')) {
          e.preventDefault();
          btModal.classList.add('hidden');
          return;
        }
        const alertModal = document.getElementById('custom-alert-modal');
        if (alertModal && !alertModal.classList.contains('hidden')) {
          e.preventDefault();
          const btnOk = document.getElementById('btn-alert-ok');
          if (btnOk) btnOk.click();
          else alertModal.classList.add('hidden');
          return;
        }
      }
    });

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

    const btnReset = document.getElementById('btn-reset-char');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        systems.showConfirm(
          '⚠️ TÁN CÔNG LUÂN HỒI',
          'Đạo hữu có chắc chắn muốn tán công luân hồi, xóa bỏ toàn bộ tu vi để tái sinh không? Mọi căn cơ, đạo hạnh sẽ tán biến vào hư không!',
          () => systems.resetCharacter()
        );
      });
    }

    // ================= XỬ LÝ GIAO DIỆN MOBILE =================
    const mobProfileBtn = document.getElementById('btn-mobile-goto-profile');
    if (mobProfileBtn) {
      mobProfileBtn.addEventListener('click', () => {
        sound.playClick();
        switchTab('tab-nhanvat');
      });
    }

    const btnMobileMenu = document.getElementById('btn-mobile-menu');
    const mobileMenuModal = document.getElementById('mobile-menu-modal');
    const btnCloseMobileMenu = document.getElementById('btn-close-mobile-menu');

    if (btnMobileMenu && mobileMenuModal) {
      btnMobileMenu.addEventListener('click', () => {
        sound.playClick();
        mobileMenuModal.classList.remove('hidden');
      });
    }

    if (btnCloseMobileMenu && mobileMenuModal) {
      btnCloseMobileMenu.addEventListener('click', () => {
        mobileMenuModal.classList.add('hidden');
      });
    }

    const btnMobileSave = document.getElementById('btn-mobile-save');
    if (btnMobileSave) {
      btnMobileSave.addEventListener('click', () => {
        systems.saveToLocalStorage();
        sound.playLoot();
        systems.showAlert('Lưu Thành Công', 'Đã lưu dữ liệu tu tiên vào thần thức (localStorage)!');
        mobileMenuModal.classList.add('hidden');
      });
    }

    const btnMobileSound = document.getElementById('btn-mobile-sound-toggle');
    if (btnMobileSound) {
      btnMobileSound.addEventListener('click', () => {
        const isEnabled = sound.toggleSound();
        btnMobileSound.textContent = isEnabled ? '🔊 Âm Thanh: BẬT' : '🔇 Âm Thanh: TẮT';
        const deskSoundBtn = document.getElementById('btn-sound-toggle');
        if (deskSoundBtn) {
          deskSoundBtn.innerHTML = isEnabled ? '<span class="desktop-text">🔊 Âm Thanh: BẬT</span><span class="mobile-icon">🔊</span>' : '<span class="desktop-text">🔇 Âm Thanh: TẮT</span><span class="mobile-icon">🔇</span>';
        }
      });
    }

    const btnMobileReset = document.getElementById('btn-mobile-reset-char');
    if (btnMobileReset) {
      btnMobileReset.addEventListener('click', () => {
        mobileMenuModal.classList.add('hidden');
        const btnResetDesk = document.getElementById('btn-reset-char');
        if (btnResetDesk) btnResetDesk.click();
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

    // ================= XỬ LÝ THU GỌN / MỞ THIÊN CƠ LỤC =================
    const gameContainer = document.querySelector('.game-container');
    const btnPinLog = document.getElementById('btn-pin-log');
    const btnToggleLog = document.getElementById('btn-toggle-log');
    const btnFloatingLog = document.getElementById('btn-floating-log');
    const btnCloseLog = document.getElementById('btn-close-log');
    const logBackdrop = document.getElementById('log-drawer-backdrop');

    // Khởi tạo trạng thái Ghim từ LocalStorage
    try {
      isLogPinned = localStorage.getItem('tutien_log_pinned') === 'true';
    } catch (e) {
      isLogPinned = false;
    }
    if (gameContainer && isLogPinned) {
      gameContainer.classList.add('log-pinned');
      if (btnPinLog) btnPinLog.textContent = '🔓 Tháo Ghim';
    }

    if (btnToggleLog) {
      btnToggleLog.addEventListener('click', () => {
        if (isLogPinned) {
          const container = document.getElementById('log-messages');
          if (container) container.scrollTop = container.scrollHeight;
        } else {
          toggleLogDrawer();
        }
      });
    }

    if (btnFloatingLog) {
      btnFloatingLog.addEventListener('click', () => {
        toggleLogDrawer();
      });
    }

    if (btnCloseLog) {
      btnCloseLog.addEventListener('click', () => {
        if (isLogPinned) {
          // Khi đang ghim mà bấm nút X: Tháo ghim và thu gọn
          isLogPinned = false;
          try { localStorage.setItem('tutien_log_pinned', 'false'); } catch (e) {}
          if (gameContainer) gameContainer.classList.remove('log-pinned');
          if (btnPinLog) btnPinLog.textContent = '📌 Ghim';
          setLogDrawerOpen(false);
        } else {
          setLogDrawerOpen(false);
        }
      });
    }

    if (logBackdrop) {
      logBackdrop.addEventListener('click', () => {
        setLogDrawerOpen(false);
      });
    }

    if (btnPinLog) {
      btnPinLog.addEventListener('click', () => {
        isLogPinned = !isLogPinned;
        try { localStorage.setItem('tutien_log_pinned', isLogPinned ? 'true' : 'false'); } catch (e) {}
        if (gameContainer) {
          gameContainer.classList.toggle('log-pinned', isLogPinned);
        }
        btnPinLog.textContent = isLogPinned ? '🔓 Tháo Ghim' : '📌 Ghim';
        setLogDrawerOpen(false);
        if (isLogPinned) {
          logUnreadCount = 0;
          updateLogUnreadBadges();
        }
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

    function performRoll() {
      sound.playCheatSystem();
      btnRoll.disabled = true;
      btnRoll.classList.remove('btn-pulse');
      btnRoll.textContent = '🔒 Đã Định Thiên Mệnh';

      const hint = document.getElementById('creation-guide-hint');
      if (hint) {
        hint.innerHTML = '✨ Thiên mệnh đã an bài! Nhấn <strong>[TẠO NHÂN VẬT & BƯỚC VÀO TIÊN ĐỒ]</strong> ở dưới để xuất thế!';
        hint.style.color = '#34d399';
      }

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
    }

    btnRoll.onclick = performRoll;

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
      if (btnStart) {
        btnStart.disabled = false;
        btnStart.classList.add('btn-pulse');
      }
    }
    checkReady();

    btnStart.onclick = () => {
      // Tự động quay thiên mệnh nếu người chơi chưa bấm quay
      if (!rolledDestiny) {
        performRoll();
      }

      sound.playBreakthrough();
      const daoHieuInput = document.getElementById('input-dao-hieu').value.trim() || 'Hàn Lập';
      const cheatNameInput = document.getElementById('input-cheat-name').value.trim() || 'Hệ Thống Vô Địch';

      systems.initNewCharacter(
        daoHieuInput,
        rolledDestiny.root,
        rolledDestiny.physique,
        rolledDestiny.comprehension,
        selectedPathId || 'kiem_tu',
        cheatNameInput,
        selectedCoreId || 'signin',
        selectedPerkId || 'breakthrough_guard'
      );

      modal.classList.add('hidden');
      systems.saveToLocalStorage();
      systems.updateUI();
    };
  }

  if (typeof window !== 'undefined') {
    window.ParticlePool = ParticlePool;
    window.FloatingTextPool = FloatingTextPool;
    window.PixelRenderer = PixelRenderer;
    window.CombatStatusManager = CombatStatusManager;
    window.CombatEngine = CombatEngine;
    window.GameSystems = GameSystems;
    window.CULTIVATION_PATHS = CULTIVATION_PATHS;
    window.HERB_ENCYCLOPEDIA = HERB_ENCYCLOPEDIA;
    window.RECIPES = RECIPES;
    window.SECTS = SECTS;
    window.SECT_QUESTS = SECT_QUESTS;
    window.WORLD_REGIONS = WORLD_REGIONS;
    window.MONSTERS = MONSTERS;
    window.ITEMS = ITEMS;
    window.ITEM_PIXEL_SPRITES = ITEM_PIXEL_SPRITES;
    window.getItemPixelSvg = getItemPixelSvg;
    window.REALMS = REALMS;
    window.SCENES = SCENES;
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      ParticlePool,
      FloatingTextPool,
      PixelRenderer,
      CombatStatusManager,
      CombatEngine,
      GameSystems,
      CULTIVATION_PATHS,
      HERB_ENCYCLOPEDIA,
      RECIPES,
      SECTS,
      SECT_QUESTS,
      WORLD_REGIONS,
      MONSTERS,
      ITEMS,
      ITEM_PIXEL_SPRITES,
      getItemPixelSvg,
      COMPANIONS,
      REALMS,
      SCENES
    };
  }
})();
