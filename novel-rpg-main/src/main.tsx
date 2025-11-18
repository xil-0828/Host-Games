// src/main.tsx
import { Assets, Container, Game, PIXI, canvas, narration } from "@drincs/pixi-vn";
import { createRoot } from "react-dom/client";
import startLabel from "./labels/startLabel";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { defineAssets } from "./utils/assets-utility";
import { INTERFACE_DATA_USE_QUEY_KEY } from "./hooks/useQueryInterface";

const body = document.body;
if (!body) throw new Error("body element not found");

Game.init(body, {
  width: 1920,
  height: 1080,
  backgroundAlpha: 0,
}).then(() => {
  // === 定数 ===
  const TILE_SIZE = 32;
  const WIDTH = 10;
  const HEIGHT = 15;

  // === マップ ===
  const tileLayer = new PIXI.Container();
  canvas.addLayer("map", tileLayer);

  const map: number[][] = [];
  for (let y = 0; y < HEIGHT; y++) {
    map[y] = [];
    for (let x = 0; x < WIDTH; x++) {
      const isWall = Math.random() < 0.15 && !(x === 5 && y === 7);
      map[y][x] = isWall ? 1 : 0;

      const g = new PIXI.Graphics();
      g.beginFill(isWall ? 0x333366 : 0x555555);
      g.drawRect(0, 0, TILE_SIZE, TILE_SIZE);
      g.endFill();
      g.x = x * TILE_SIZE;
      g.y = y * TILE_SIZE;
      tileLayer.addChild(g);
    }
  }

  // === キャラ ===
  const charLayer = new PIXI.Container();
  canvas.addLayer("char", charLayer);

  const player = new PIXI.Graphics();
  player.beginFill(0xffcc00);
  player.drawRect(0, 0, TILE_SIZE, TILE_SIZE);
  player.endFill();
  player.x = TILE_SIZE * 5;
  player.y = TILE_SIZE * 7;
  charLayer.addChild(player);

  const app = canvas.app;

  // === マウス移動 ===
  let targetX = player.x;
  let targetY = player.y;
  const moveSpeed = 2.5;

  app.stage.interactive = true;
  app.stage.on("pointerdown", (e) => {
    const pos = e.data.global;
    targetX = pos.x - TILE_SIZE / 2;
    targetY = pos.y - TILE_SIZE / 2;
  });

  // === 中心点での当たり判定 ===
  function isColliding(nx: number, ny: number) {
    const tileX = Math.floor(nx / TILE_SIZE);
    const tileY = Math.floor(ny / TILE_SIZE);

    if (tileX < 0 || tileY < 0 || tileX >= WIDTH || tileY >= HEIGHT) return true;
    return map[tileY][tileX] === 1;
  }

  // === 毎フレーム移動 ===
  app.ticker.add(() => {
    const dx = targetX - player.x;
    const dy = targetY - player.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > moveSpeed) {
      const nx = player.x + (dx / dist) * moveSpeed;
      const ny = player.y + (dy / dist) * moveSpeed;

      const centerX = nx + TILE_SIZE / 2;
      const centerY = ny + TILE_SIZE / 2;

      // 前回位置を保存
      const prevX = player.x;
      const prevY = player.y;

      player.x = nx;
      player.y = ny;

      // 壁にめり込んだら戻す
      if (isColliding(centerX, centerY)) {
        player.x = prevX - (dx / dist) ; // 少し戻す
        player.y = prevY - (dy / dist) ;
      }
    }
  });

  // ドット感
  app.view.style.imageRendering = "pixelated";

  // === React層 ===
  canvas.addLayer("ui", new Container());
  const root = document.getElementById("root");
  if (!root) throw new Error("root element not found");

  const htmlLayout = canvas.addHtmlLayer("ui", root);
  if (!htmlLayout) throw new Error("htmlLayout not found");

  const reactRoot = createRoot(htmlLayout);

  Game.onEnd(async () => {
    Game.clear();
    await narration.jump(startLabel, {});
  });

  Game.onLoadingLabel(async (_stepId, { id }) => await Assets.backgroundLoadBundle(id));
  const queryClient = new QueryClient();

  reactRoot.render(
    <div
      style={{
        color: "black",
        position: "absolute",
        bottom: 0,
        left: 0,
      }}
    >
      Loading...
    </div>
  );

  defineAssets().then(() => {
    Game.clear();
    narration.call(startLabel, {}).then(() => {
      reactRoot.render(
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      );
      queryClient.invalidateQueries({
        queryKey: [INTERFACE_DATA_USE_QUEY_KEY],
      });
    });
  });
});
