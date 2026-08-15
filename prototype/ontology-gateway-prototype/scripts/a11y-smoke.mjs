const debugEndpoint = "http://127.0.0.1:9222";
const baseUrl = "http://127.0.0.1:3000";

const delay = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

async function connectToApplicationPage() {
  const targets = await fetch(`${debugEndpoint}/json/list`).then(response => response.json());
  const target = targets.find(item => item.type === "page");
  if (!target?.webSocketDebuggerUrl) {
    throw new Error("未找到可用的 Chromium 页面调试目标");
  }

  const socket = new WebSocket(target.webSocketDebuggerUrl);
  const pending = new Map();
  let nextId = 1;

  socket.addEventListener("message", event => {
    const message = JSON.parse(event.data);
    if (!message.id) return;
    const waiter = pending.get(message.id);
    if (!waiter) return;
    pending.delete(message.id);
    if (message.error) waiter.reject(new Error(message.error.message));
    else waiter.resolve(message.result);
  });

  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  const send = (method, params = {}) => {
    const id = nextId++;
    socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
  };

  return { socket, send };
}

async function evaluate(send, expression) {
  const result = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text ?? "页面脚本执行失败");
  }
  return result.result.value;
}

async function navigate(send, path) {
  await send("Page.navigate", { url: `${baseUrl}${path}` });
  for (let attempt = 0; attempt < 40; attempt += 1) {
    await delay(150);
    const ready = await evaluate(
      send,
      `document.readyState === "complete" && Boolean(document.querySelector("main h1"))`,
    );
    if (ready) return;
  }
  throw new Error(`页面 ${path} 未在预期时间内完成渲染`);
}

async function pressTab(send) {
  await send("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab", code: "Tab" });
  await send("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab" });
  await delay(60);
}

const report = {
  desktop: {},
  keyboard: {},
  mobile: {},
  interactions: {},
};

const { socket, send } = await connectToApplicationPage();

try {
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await navigate(send, "/governance");
  report.desktop = await evaluate(
    send,
    `(() => {
      const interactive = [...document.querySelectorAll("button, a, select, input, textarea")];
      const nameOf = element =>
        element.getAttribute("aria-label") ||
        element.getAttribute("title") ||
        element.textContent?.trim() ||
        element.getAttribute("name") ||
        "";
      const actionButtons = interactive.filter(element => ["批准", "退回"].includes(element.textContent?.trim()));
      return {
        title: document.querySelector("main h1")?.textContent?.trim(),
        landmarks: {
          navigation: document.querySelectorAll("nav").length,
          main: document.querySelectorAll("main").length,
          headings: document.querySelectorAll("h1, h2").length,
        },
        unnamedInteractive: interactive.filter(element => !nameOf(element)).length,
        namedControls: interactive.map(nameOf).filter(Boolean).slice(0, 20),
        demoApprovalButtonsDisabled: actionButtons.length === 6 && actionButtons.every(element => element.disabled),
      };
    })()`,
  );

  await evaluate(send, `document.activeElement instanceof HTMLElement && document.activeElement.blur()`);
  const focusSequence = [];
  for (let step = 0; step < 8; step += 1) {
    await pressTab(send);
    focusSequence.push(
      await evaluate(
        send,
        `(() => {
          const element = document.activeElement;
          const style = element ? getComputedStyle(element) : null;
          return {
            tag: element?.tagName ?? null,
            name: element?.getAttribute("aria-label") || element?.getAttribute("title") || element?.textContent?.trim() || null,
            outlineStyle: style?.outlineStyle ?? null,
            outlineWidth: style?.outlineWidth ?? null,
          };
        })()`,
      ),
    );
  }
  report.keyboard = {
    sequence: focusSequence,
    allFocusVisible: focusSequence.every(item => item.tag && item.outlineStyle !== "none" && item.outlineWidth !== "0px"),
  };

  report.interactions.evidence = await evaluate(
    send,
    `(() => {
      const button = [...document.querySelectorAll("button")].find(element => element.textContent?.includes("查看证据"));
      button?.click();
      return Boolean(button);
    })()`,
  );
  await delay(250);
  report.interactions.evidenceExpanded = await evaluate(
    send,
    `document.body.innerText.includes("模拟摘要") && document.body.innerText.includes("回滚计划")`,
  );

  await send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await delay(200);
  report.mobile.before = await evaluate(
    send,
    `(() => {
      const openButton = document.querySelector('button[aria-label="打开侧边导航"]');
      const aside = document.querySelector("aside");
      return {
        openButtonName: openButton?.getAttribute("aria-label") ?? null,
        asideTransform: aside ? getComputedStyle(aside).transform : null,
        viewportWidth: document.documentElement.clientWidth,
      };
    })()`,
  );
  await evaluate(send, `document.querySelector('button[aria-label="打开侧边导航"]')?.click()`);
  await delay(250);
  report.mobile.opened = await evaluate(
    send,
    `(() => {
      const aside = document.querySelector("aside");
      const closeButton = document.querySelector('button[aria-label="关闭侧边导航"]');
      return {
        closeButtonName: closeButton?.getAttribute("aria-label") ?? null,
        asideTransform: aside ? getComputedStyle(aside).transform : null,
        overlayPresent: Boolean(document.querySelector('button[aria-label="关闭导航"]')),
      };
    })()`,
  );
  await evaluate(send, `document.querySelector('button[aria-label="关闭侧边导航"]')?.click()`);
  await delay(250);
  report.mobile.closed = await evaluate(
    send,
    `(() => {
      const aside = document.querySelector("aside");
      return { asideTransform: aside ? getComputedStyle(aside).transform : null };
    })()`,
  );

  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await navigate(send, "/decision");
  report.interactions.proposalBeforeSimulationDisabled = await evaluate(
    send,
    `[...document.querySelectorAll("button")].find(element => element.textContent?.includes("生成受控提案"))?.disabled ?? null`,
  );
  await evaluate(
    send,
    `[...document.querySelectorAll("button")].find(element => element.textContent?.includes("运行模拟"))?.click()`,
  );
  for (let attempt = 0; attempt < 30; attempt += 1) {
    await delay(100);
    const simulationReady = await evaluate(
      send,
      `document.body.innerText.includes("ERP、MES 共 3 个受影响对象")`,
    );
    if (simulationReady) break;
  }
  report.interactions.simulationVisible = await evaluate(
    send,
    `document.body.innerText.includes("跨系统影响") && document.body.innerText.includes("回滚计划")`,
  );
  report.interactions.proposalAfterSimulationEnabled = await evaluate(
    send,
    `!([...document.querySelectorAll("button")].find(element => element.textContent?.includes("生成受控提案"))?.disabled ?? true)`,
  );
  await evaluate(
    send,
    `[...document.querySelectorAll("button")].find(element => element.textContent?.includes("生成受控提案"))?.click()`,
  );
  for (let attempt = 0; attempt < 40; attempt += 1) {
    await delay(100);
    const submitReady = await evaluate(
      send,
      `!([...document.querySelectorAll("button")].find(element => element.textContent?.includes("提交审批队列"))?.disabled ?? true)`,
    );
    if (submitReady) break;
  }
  report.interactions.submitEnabledAfterPreview = await evaluate(
    send,
    `!([...document.querySelectorAll("button")].find(element => element.textContent?.includes("提交审批队列"))?.disabled ?? true)`,
  );

  const failures = [];
  if (report.desktop.unnamedInteractive !== 0) failures.push("存在无可访问名称的交互控件");
  if (!report.desktop.demoApprovalButtonsDisabled) failures.push("演示提案审批按钮未保持禁用");
  if (!report.keyboard.allFocusVisible) failures.push("键盘焦点环不可见");
  if (!report.interactions.evidenceExpanded) failures.push("证据包未展开");
  if (!report.mobile.opened.overlayPresent) failures.push("移动导航未打开");
  if (!report.interactions.simulationVisible) failures.push("模拟结果未显示");
  if (!report.interactions.proposalAfterSimulationEnabled) failures.push("模拟后提案按钮未启用");
  if (!report.interactions.submitEnabledAfterPreview) failures.push("预览后提交按钮未启用");

  report.passed = failures.length === 0;
  report.failures = failures;
  console.log(JSON.stringify(report, null, 2));
  if (failures.length) process.exitCode = 1;
} finally {
  socket.close();
}
