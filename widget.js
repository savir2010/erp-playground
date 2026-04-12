(function () {
    const widgetScriptEl = document.currentScript;

    window.addEventListener('DOMContentLoaded', () => {
        function resolveLogoSrc() {
            const fromAttr =
                widgetScriptEl && widgetScriptEl.getAttribute('data-logo');
            if (fromAttr) return fromAttr;
            if (widgetScriptEl && widgetScriptEl.src) {
                return new URL('image.png', widgetScriptEl.src).href;
            }
            return '/image.png';
        }

        const FLOW_STYLE_ID = 'widget-highlight-flow-style';
        if (!document.getElementById(FLOW_STYLE_ID)) {
            const flowStyle = document.createElement('style');
            flowStyle.id = FLOW_STYLE_ID;
            flowStyle.textContent = `
@keyframes widgetBoxFlowIn {
  from {
    opacity: 0;
    transform: scale(0.94);
    border-color: rgba(59, 130, 246, 0);
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
  45% {
    border-color: rgba(168, 85, 247, 0.9);
    box-shadow: 0 0 10px rgba(236, 72, 153, 0.45);
  }
  to {
    opacity: 1;
    transform: scale(1);
    border-color: rgba(236, 72, 153, 1);
    box-shadow: 0 0 0 0 rgba(236, 72, 153, 0);
  }
}
@keyframes widgetCircleSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes widgetHighlighterReveal {
  from {
    clip-path: inset(0 100% 0 0);
  }
  to {
    clip-path: inset(0 0% 0 0);
  }
}
@keyframes widgetGuidePulse {
  from {
    opacity: 0.4;
  }
  to {
    opacity: 0.95;
  }
}
`;
            document.head.appendChild(flowStyle);
        }

        const circle = document.createElement('div');
        circle.setAttribute('data-widget-chrome', '');
        Object.assign(circle.style, {
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(160deg, #f3f4f6, #d1d5db)',
            border: '1px solid rgba(255, 255, 255, 0.65)',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            cursor: 'pointer',
            zIndex: '10001',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.14)',
            transformOrigin: '50% 50%'
        });

        const logo = document.createElement('img');
        logo.setAttribute('data-widget-chrome', '');
        logo.alt = '';
        logo.draggable = false;
        logo.src = resolveLogoSrc();
        Object.assign(logo.style, {
            width: '64%',
            height: '64%',
            objectFit: 'contain',
            pointerEvents: 'none',
            userSelect: 'none',
            display: 'block'
        });
        circle.appendChild(logo);

        document.body.appendChild(circle);

        let clipHighlightOverlay = null;
        let clipHighlightPositionCleanup = null;
        let clipHighlightHoldTimeoutId = null;

        function disposeClipHighlightPositionListeners() {
            if (clipHighlightPositionCleanup) {
                clipHighlightPositionCleanup();
                clipHighlightPositionCleanup = null;
            }
        }

        function resolveGlobalLogisticsElement() {
            const marked = document.querySelector('[data-widget-global-logistics]');
            if (marked) return marked;
            for (const el of document.querySelectorAll('span,b,strong,i,em,h1,h2,h3,h4,p')) {
                if (el.closest('[data-widget-chrome]')) continue;
                const t = el.textContent && el.textContent.trim();
                if (t && /^Global logistics$/i.test(t)) return el;
            }
            return null;
        }

        function syncClipHighlightBox() {
            if (!clipHighlightOverlay) return;
            const target = clipHighlightOverlay._targetEl;
            if (!target || !document.body.contains(target)) {
                stopClipRevealHighlight();
                return;
            }
            const padX = 2;
            const padY = 1;
            const r = target.getBoundingClientRect();
            Object.assign(clipHighlightOverlay.style, {
                left: `${r.left - padX}px`,
                top: `${r.top - padY}px`,
                width: `${r.width + padX * 2}px`,
                height: `${r.height + padY * 2}px`
            });
        }

        function stopClipRevealHighlight() {
            if (clipHighlightHoldTimeoutId != null) {
                clearTimeout(clipHighlightHoldTimeoutId);
                clipHighlightHoldTimeoutId = null;
            }
            disposeClipHighlightPositionListeners();
            if (clipHighlightOverlay) {
                clipHighlightOverlay.remove();
                clipHighlightOverlay = null;
            }
        }

        function startClipRevealOnTarget(target, options) {
            stopClipRevealHighlight();
            if (!target) return;
            const onAfterHold =
                options && typeof options.onAfterHold === 'function'
                    ? options.onAfterHold
                    : null;

            const overlay = document.createElement('div');
            overlay.id = 'widget-clip-highlight';
            overlay.setAttribute('data-widget-chrome', '');
            overlay._targetEl = target;
            Object.assign(overlay.style, {
                position: 'fixed',
                pointerEvents: 'none',
                zIndex: '10000',
                boxSizing: 'border-box',
                border: 'none',
                borderRadius: '4px',
                background: 'rgba(253, 224, 71, 0.44)',
                clipPath: 'inset(0 100% 0 0)',
                animation:
                    'widgetHighlighterReveal 3s cubic-bezier(0.33, 0.06, 0.15, 1) forwards'
            });
            document.body.appendChild(overlay);
            clipHighlightOverlay = overlay;

            syncClipHighlightBox();
            const onScrollOrResize = () => syncClipHighlightBox();
            window.addEventListener('scroll', onScrollOrResize, true);
            window.addEventListener('resize', onScrollOrResize);
            clipHighlightPositionCleanup = () => {
                window.removeEventListener('scroll', onScrollOrResize, true);
                window.removeEventListener('resize', onScrollOrResize);
            };

            overlay.addEventListener(
                'animationend',
                () => {
                    clipHighlightHoldTimeoutId = window.setTimeout(() => {
                        clipHighlightHoldTimeoutId = null;
                        stopClipRevealHighlight();
                        if (onAfterHold) onAfterHold();
                    }, 2000);
                },
                { once: true }
            );
        }

        function startGlobalLogisticsHighlight() {
            startClipRevealOnTarget(resolveGlobalLogisticsElement());
        }

        function stopGlobalLogisticsHighlight() {
            stopClipRevealHighlight();
        }

        const lastPointer = {
            x: Math.max(40, Math.min(window.innerWidth - 40, 120)),
            y: Math.max(40, window.innerHeight - 100)
        };
        let pointerThrottleT = 0;
        window.addEventListener(
            'pointermove',
            (e) => {
                const t = performance.now();
                if (t - pointerThrottleT < 40) return;
                pointerThrottleT = t;
                if (e.target && e.target.closest && e.target.closest('[data-widget-chrome]'))
                    return;
                lastPointer.x = e.clientX;
                lastPointer.y = e.clientY;
            },
            { passive: true }
        );

        function getActiveTab() {
            const w = window;
            return (w.__ERP_ACTIVE_TAB__ && String(w.__ERP_ACTIVE_TAB__)) || 'dashboard';
        }

        /** Human-readable page context for decide.py — keep aligned with app routes. */
        const ERP_PAGE_CONTEXT = {
            dashboard:
                'Dashboard: KPI cards, recent transactions table, Quick Entry form, and Admin Quick Actions grid including the Export Data button.',
            accounting:
                'Accounting: generic module placeholder page — Export Data is not on this screen; use sidebar to reach Dashboard first if the user needs export.',
            procurement:
                'Procurement: generic module page — no Export Data here.',
            crm: 'CRM: generic module page — no Export Data here.',
            logistics:
                'Logistics: generic module page — no Export Data here.',
            warehouse:
                'Warehouse: generic module page — no Export Data here.',
            hr: 'HR Management: generic module page — no Export Data here.',
            analytics:
                'Analytics: generic module page — no Export Data here.',
            settings:
                'Settings: generic module page — no Export Data here.',
            'api-logs': 'API Logs: generic module page — no Export Data here.'
        };

        function getPageContextForDecide() {
            const tab = getActiveTab();
            return (
                ERP_PAGE_CONTEXT[tab] ||
                'Unknown route — infer navigation only from activeTab and targets.'
            );
        }

        function buildTargetsRoster() {
            const list = [];
            function pushUnique(entry) {
                if (!entry.id || list.some((x) => x.id === entry.id)) return;
                list.push(entry);
            }
            document.querySelectorAll('[data-widget-nav]').forEach((el) => {
                const id = el.getAttribute('data-widget-nav');
                if (!id) return;
                pushUnique({
                    id: 'nav:' + id,
                    kind: 'nav',
                    label: (el.textContent || '').trim().slice(0, 200)
                });
            });
            document.querySelectorAll('[data-widget-action]').forEach((el) => {
                const id = el.getAttribute('data-widget-action');
                if (!id) return;
                pushUnique({
                    id: 'action:' + id,
                    kind: 'action',
                    label: (el.textContent || '').trim().slice(0, 200)
                });
            });
            document.querySelectorAll('[data-widget-highlight]').forEach((el) => {
                const id = el.getAttribute('data-widget-highlight');
                if (!id) return;
                pushUnique({
                    id: 'highlight:' + id,
                    kind: 'highlight',
                    label: (el.textContent || '').trim().slice(0, 200)
                });
            });
            return list;
        }

        function resolveGuideTarget(targetId) {
            if (!targetId || typeof targetId !== 'string') return null;
            if (targetId.startsWith('nav:'))
                return document.querySelector(
                    '[data-widget-nav="' + targetId.slice(4).replace(/"/g, '') + '"]'
                );
            if (targetId.startsWith('action:'))
                return document.querySelector(
                    '[data-widget-action="' +
                        targetId.slice(7).replace(/"/g, '') +
                        '"]'
                );
            if (targetId.startsWith('highlight:'))
                return document.querySelector(
                    '[data-widget-highlight="' +
                        targetId.slice(10).replace(/"/g, '') +
                        '"]'
                );
            return null;
        }

        let guideLineSvg = null;
        let guidePath = null;
        let guidePulseEl = null;
        let guideSteps = [];
        let guideStepIndex = 0;
        let guideClickHandler = null;
        let guideMutationObserver = null;
        let guideWaitRaf = 0;
        let guideAbortController = null;
        let guideScrollCleanup = null;
        let guideHighlightIntroTimeoutId = null;
        const GUIDE_LINE_DRAW_MS = 5000;
        const GUIDED_MAX_PLANS = 25;
        /** Wait after user completes a click before the next step or re-plan. */
        const GUIDED_POST_CLICK_DELAY_MS = 2000;
        let guideLineAnimatedThisStep = false;
        let guidedUtterance = '';
        let guidedPlanGeneration = 0;

        function clearGuideLineAndPulse() {
            if (guideHighlightIntroTimeoutId != null) {
                clearTimeout(guideHighlightIntroTimeoutId);
                guideHighlightIntroTimeoutId = null;
            }
            if (guideScrollCleanup) {
                guideScrollCleanup();
                guideScrollCleanup = null;
            }
            if (guideLineSvg) {
                guideLineSvg.remove();
                guideLineSvg = null;
                guidePath = null;
            }
            if (guidePulseEl) {
                guidePulseEl.remove();
                guidePulseEl = null;
            }
        }

        function updateGuideLineToEl(el, animateDraw) {
            if (!guidePath || !el) return;
            const r = el.getBoundingClientRect();
            const x2 = r.left + r.width / 2;
            const y2 = r.top + r.height / 2;
            const x1 =
                guidePath._frozenLineStartX != null
                    ? guidePath._frozenLineStartX
                    : lastPointer.x;
            const y1 =
                guidePath._frozenLineStartY != null
                    ? guidePath._frozenLineStartY
                    : lastPointer.y;
            const mx = (x1 + x2) / 2;
            const my = Math.min(y1, y2) - Math.max(48, Math.abs(y2 - y1) * 0.25);
            guidePath.setAttribute(
                'd',
                'M ' + x1 + ' ' + y1 + ' Q ' + mx + ' ' + my + ' ' + x2 + ' ' + y2
            );
            const len = Math.max(1, guidePath.getTotalLength());
            guidePath.setAttribute('stroke-dasharray', String(len));
            if (animateDraw) {
                guidePath.style.transition = 'none';
                guidePath.setAttribute('stroke-dashoffset', String(len));
                void guidePath.getBoundingClientRect();
                guidePath.style.transition =
                    'stroke-dashoffset ' +
                    GUIDE_LINE_DRAW_MS / 1000 +
                    's cubic-bezier(0.28, 0.1, 0.18, 1)';
                requestAnimationFrame(function () {
                    requestAnimationFrame(function () {
                        if (guidePath)
                            guidePath.setAttribute('stroke-dashoffset', '0');
                    });
                });
            } else {
                guidePath.style.transition = 'none';
                guidePath.setAttribute('stroke-dashoffset', '0');
            }
        }

        function finishGuideSequence() {
            if (guideAbortController) {
                guideAbortController.abort();
                guideAbortController = null;
            }
            if (guideClickHandler) {
                document.removeEventListener('click', guideClickHandler, true);
                guideClickHandler = null;
            }
            if (guideMutationObserver) {
                guideMutationObserver.disconnect();
                guideMutationObserver = null;
            }
            if (guideWaitRaf) {
                cancelAnimationFrame(guideWaitRaf);
                guideWaitRaf = 0;
            }
            clearGuideLineAndPulse();
            guideSteps = [];
            guideStepIndex = 0;
            guidedUtterance = '';
            guidedPlanGeneration = 0;
        }

        const guidePanel = document.createElement('div');
        guidePanel.id = 'widget-guide-panel';
        guidePanel.setAttribute('data-widget-chrome', '');
        Object.assign(guidePanel.style, {
            position: 'fixed',
            bottom: '92px',
            left: '20px',
            width: 'min(320px, calc(100vw - 40px))',
            maxHeight: 'min(280px, 45vh)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            padding: '12px',
            background: 'rgba(255,255,255,0.97)',
            border: '1px solid rgba(15,23,42,0.12)',
            borderRadius: '12px',
            boxShadow: '0 12px 40px rgba(15,23,42,0.15)',
            zIndex: '10002',
            font: '13px/1.4 system-ui, sans-serif',
            color: '#0f172a',
            boxSizing: 'border-box',
            opacity: '0',
            transform: 'translateY(8px)',
            pointerEvents: 'none',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
            visibility: 'hidden'
        });
        const guideTitle = document.createElement('div');
        guideTitle.textContent = 'Guided task';
        guideTitle.style.fontWeight = '700';
        guideTitle.style.fontSize = '12px';
        guideTitle.style.textTransform = 'uppercase';
        guideTitle.style.letterSpacing = '0.06em';
        guideTitle.style.color = '#64748b';
        const guideTextarea = document.createElement('textarea');
        guideTextarea.rows = 3;
        guideTextarea.placeholder = 'e.g. I want to export data';
        Object.assign(guideTextarea.style, {
            width: '100%',
            resize: 'vertical',
            minHeight: '64px',
            padding: '8px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            font: 'inherit',
            boxSizing: 'border-box'
        });
        const guideStatusEl = document.createElement('div');
        guideStatusEl.style.fontSize = '11px';
        guideStatusEl.style.color = '#64748b';
        guideStatusEl.style.minHeight = '16px';
        const guideRow = document.createElement('div');
        guideRow.style.display = 'flex';
        guideRow.style.gap = '8px';
        guideRow.style.flexWrap = 'wrap';
        const guideSendBtn = document.createElement('button');
        guideSendBtn.type = 'button';
        guideSendBtn.textContent = 'Send';
        Object.assign(guideSendBtn.style, {
            flex: '1',
            minWidth: '72px',
            padding: '8px 12px',
            borderRadius: '8px',
            border: 'none',
            background: '#2563eb',
            color: '#fff',
            fontWeight: '600',
            cursor: 'pointer'
        });
        const guideStopBtn = document.createElement('button');
        guideStopBtn.type = 'button';
        guideStopBtn.textContent = 'Stop';
        Object.assign(guideStopBtn.style, {
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            background: '#f8fafc',
            fontWeight: '600',
            cursor: 'pointer'
        });
        guideRow.appendChild(guideSendBtn);
        guideRow.appendChild(guideStopBtn);
        guidePanel.appendChild(guideTitle);
        guidePanel.appendChild(guideTextarea);
        guidePanel.appendChild(guideStatusEl);
        guidePanel.appendChild(guideRow);
        document.body.appendChild(guidePanel);

        let guidePanelOpen = false;
        function setGuidePanelOpen(open) {
            guidePanelOpen = open;
            guidePanel.style.visibility = open ? 'visible' : 'hidden';
            guidePanel.style.opacity = open ? '1' : '0';
            guidePanel.style.transform = open ? 'translateY(0)' : 'translateY(8px)';
            guidePanel.style.pointerEvents = open ? 'auto' : 'none';
        }

        let glassCircleOpenToken = 0;
        circle.addEventListener('click', () => {
            if (guidePanelOpen) {
                glassCircleOpenToken++;
                setGuidePanelOpen(false);
                stopClipRevealHighlight();
                circle.style.animation = 'none';
                return;
            }

            glassCircleOpenToken++;
            const token = glassCircleOpenToken;

            circle.style.animation = 'none';
            void circle.offsetWidth;
            circle.style.animation =
                'widgetCircleSpin 0.72s cubic-bezier(0.55, 0.06, 0.2, 0.97) forwards';

            circle.addEventListener(
                'animationend',
                () => {
                    if (token !== glassCircleOpenToken) return;
                    setGuidePanelOpen(true);
                    requestAnimationFrame(() => {
                        if (token !== glassCircleOpenToken) return;
                        startGlobalLogisticsHighlight();
                    });
                },
                { once: true }
            );
        });

        async function fetchDecideSteps(utterance, signal) {
            const roster = buildTargetsRoster();
            if (!roster.length) {
                return {
                    ok: false,
                    steps: [],
                    message: 'No widget targets on this page.'
                };
            }
            const res = await fetch('/api/decide', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: signal,
                body: JSON.stringify({
                    utterance: utterance,
                    activeTab: getActiveTab(),
                    pageContext: getPageContextForDecide(),
                    targets: roster
                })
            });
            const text = await res.text();
            let data = null;
            try {
                data = JSON.parse(text);
            } catch (e) {
                return { ok: false, steps: [], message: 'Bad response.' };
            }
            if (!res.ok) {
                let msg = res.statusText || 'Request failed';
                if (data && data.detail != null) {
                    msg = Array.isArray(data.detail)
                        ? data.detail.map(function (x) {
                              return x.msg || x;
                          }).join('; ')
                        : String(data.detail);
                }
                return { ok: false, steps: [], message: msg };
            }
            if (!data.steps || !Array.isArray(data.steps)) {
                return { ok: false, steps: [], message: 'Invalid plan.' };
            }
            return { ok: true, steps: data.steps, message: '' };
        }

        async function continueGuidedPlanningRound() {
            if (!guidedUtterance) {
                finishGuideSequence();
                return;
            }
            guidedPlanGeneration += 1;
            if (guidedPlanGeneration > GUIDED_MAX_PLANS) {
                guideStatusEl.textContent = 'Stopped (too many re-plans).';
                finishGuideSequence();
                return;
            }
            guideStatusEl.textContent =
                'Plan ' + guidedPlanGeneration + ' — reading this page…';
            if (guideAbortController) guideAbortController.abort();
            guideAbortController = new AbortController();
            try {
                const out = await fetchDecideSteps(
                    guidedUtterance,
                    guideAbortController.signal
                );
                guideAbortController = null;
                if (!out.ok) {
                    guideStatusEl.textContent = out.message;
                    finishGuideSequence();
                    return;
                }
                guideSteps = out.steps;
                guideStepIndex = 0;
                if (!guideSteps.length) {
                    guideStatusEl.textContent = 'Done.';
                    finishGuideSequence();
                    return;
                }
                runGuideStep();
            } catch (err) {
                guideAbortController = null;
                if (err.name === 'AbortError') {
                    guideStatusEl.textContent = 'Cancelled.';
                } else {
                    guideStatusEl.textContent =
                        'Network error (is decide.py running?)';
                }
                finishGuideSequence();
            }
        }

        function mountGuideConnector(el) {
            guideLineSvg = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'svg'
            );
            guideLineSvg.setAttribute('data-widget-chrome', '');
            Object.assign(guideLineSvg.style, {
                position: 'fixed',
                left: '0',
                top: '0',
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: '9999'
            });
            guidePath = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'path'
            );
            guidePath.setAttribute('fill', 'none');
            guidePath.setAttribute('stroke', 'rgba(236, 72, 153, 0.92)');
            guidePath.setAttribute('stroke-width', '3');
            guidePath.setAttribute('stroke-linecap', 'round');
            guidePath._frozenLineStartX = lastPointer.x;
            guidePath._frozenLineStartY = lastPointer.y;
            guideLineSvg.appendChild(guidePath);
            document.body.appendChild(guideLineSvg);
            guideLineAnimatedThisStep = false;

            guidePulseEl = document.createElement('div');
            guidePulseEl.setAttribute('data-widget-chrome', '');
            Object.assign(guidePulseEl.style, {
                position: 'fixed',
                pointerEvents: 'none',
                zIndex: '9998',
                border: '2px solid rgba(236, 72, 153, 0.8)',
                borderRadius: '10px',
                boxSizing: 'border-box',
                animation: 'widgetGuidePulse 1.1s ease-in-out infinite alternate'
            });
            document.body.appendChild(guidePulseEl);

            const syncGuide = function () {
                if (!guidePulseEl || !el || !document.body.contains(el)) return;
                const r = el.getBoundingClientRect();
                const pad = 4;
                Object.assign(guidePulseEl.style, {
                    left: r.left - pad + 'px',
                    top: r.top - pad + 'px',
                    width: r.width + pad * 2 + 'px',
                    height: r.height + pad * 2 + 'px'
                });
                const doAnimate = !guideLineAnimatedThisStep;
                updateGuideLineToEl(el, doAnimate);
                guideLineAnimatedThisStep = true;
            };
            syncGuide();
            const onScrollResize = function () {
                syncGuide();
            };
            window.addEventListener('scroll', onScrollResize, true);
            window.addEventListener('resize', onScrollResize);
            guideScrollCleanup = function () {
                window.removeEventListener('scroll', onScrollResize, true);
                window.removeEventListener('resize', onScrollResize);
            };
        }

        function runGuideStep() {
            clearGuideLineAndPulse();
            if (guideClickHandler) {
                document.removeEventListener('click', guideClickHandler, true);
                guideClickHandler = null;
            }
            if (guideMutationObserver) {
                guideMutationObserver.disconnect();
                guideMutationObserver = null;
            }

            const step = guideSteps[guideStepIndex];
            if (!step) {
                guideStatusEl.textContent = 'Done.';
                finishGuideSequence();
                return;
            }

            const el = resolveGuideTarget(step.targetId);
            if (!el || !document.body.contains(el)) {
                guideStatusEl.textContent =
                    'Step ' +
                    (guideStepIndex + 1) +
                    '/' +
                    guideSteps.length +
                    ': find "' +
                    step.targetId +
                    '"…';
                if (!guideMutationObserver) {
                    guideMutationObserver = new MutationObserver(() => {
                        if (guideWaitRaf) cancelAnimationFrame(guideWaitRaf);
                        guideWaitRaf = requestAnimationFrame(() => {
                            guideWaitRaf = 0;
                            if (resolveGuideTarget(step.targetId)) runGuideStep();
                        });
                    });
                    const root = document.getElementById('root') || document.body;
                    guideMutationObserver.observe(root, {
                        childList: true,
                        subtree: true
                    });
                }
                return;
            }

            guideStatusEl.textContent =
                'Plan ' +
                guidedPlanGeneration +
                ' — Step ' +
                (guideStepIndex + 1) +
                '/' +
                guideSteps.length +
                ': ' +
                step.action +
                ' → ' +
                step.targetId;

            if (step.action === 'highlight') {
                mountGuideConnector(el);
                guideHighlightIntroTimeoutId = window.setTimeout(function () {
                    guideHighlightIntroTimeoutId = null;
                    if (guideScrollCleanup) {
                        guideScrollCleanup();
                        guideScrollCleanup = null;
                    }
                    clearGuideLineAndPulse();
                    startClipRevealOnTarget(el, {
                        onAfterHold: function () {
                            guideStatusEl.textContent = 'Done.';
                            finishGuideSequence();
                        }
                    });
                }, GUIDE_LINE_DRAW_MS + 80);
                return;
            }

            mountGuideConnector(el);

            if (step.waitFor === 'click') {
                guideClickHandler = function (ev) {
                    if (
                        ev.target &&
                        ev.target.closest &&
                        ev.target.closest('#widget-guide-panel')
                    )
                        return;
                    if (!el.contains(ev.target)) return;
                    ev.preventDefault();
                    ev.stopPropagation();
                    if (guideScrollCleanup) {
                        guideScrollCleanup();
                        guideScrollCleanup = null;
                    }
                    clearGuideLineAndPulse();
                    document.removeEventListener('click', guideClickHandler, true);
                    guideClickHandler = null;
                    guideStepIndex += 1;
                    if (guideStepIndex < guideSteps.length) {
                        window.setTimeout(runGuideStep, GUIDED_POST_CLICK_DELAY_MS);
                    } else {
                        window.setTimeout(function () {
                            void continueGuidedPlanningRound();
                        }, GUIDED_POST_CLICK_DELAY_MS);
                    }
                };
                document.addEventListener('click', guideClickHandler, true);
            }
        }

        guideSendBtn.addEventListener('click', async function () {
            const utterance = (guideTextarea.value || '').trim();
            if (!utterance) {
                guideStatusEl.textContent = 'Type a goal first.';
                return;
            }
            finishGuideSequence();
            guidedUtterance = utterance;
            guidedPlanGeneration = 1;
            guideStatusEl.textContent = 'Plan 1 — planning…';
            guideAbortController = new AbortController();
            try {
                const out = await fetchDecideSteps(
                    utterance,
                    guideAbortController.signal
                );
                guideAbortController = null;
                if (!out.ok) {
                    guideStatusEl.textContent = out.message;
                    guidedUtterance = '';
                    guidedPlanGeneration = 0;
                    return;
                }
                guideSteps = out.steps;
                guideStepIndex = 0;
                if (!guideSteps.length) {
                    guideStatusEl.textContent = 'Nothing to do.';
                    guidedUtterance = '';
                    guidedPlanGeneration = 0;
                    return;
                }
                runGuideStep();
            } catch (err) {
                guideAbortController = null;
                guidedUtterance = '';
                guidedPlanGeneration = 0;
                if (err.name === 'AbortError') {
                    guideStatusEl.textContent = 'Cancelled.';
                } else {
                    guideStatusEl.textContent =
                        'Network error (is decide.py running?)';
                }
            }
        });

        guideStopBtn.addEventListener('click', function () {
            if (guideAbortController) guideAbortController.abort();
            finishGuideSequence();
            stopClipRevealHighlight();
            guideStatusEl.textContent = 'Stopped.';
        });

        const SKIP_TAGS = new Set([
            'SCRIPT',
            'STYLE',
            'NOSCRIPT',
            'LINK',
            'META',
            'BASE',
            'TEMPLATE',
            'TITLE'
        ]);

        let allHighlightsLayer = null;
        let allHighlightsActive = false;
        let allHighlightsRaf = 0;

        function isPaintable(el) {
            if (!el.getClientRects().length) return false;
            const cs = getComputedStyle(el);
            if (cs.display === 'none' || cs.visibility === 'hidden') return false;
            return true;
        }

        function disposeAllHighlights() {
            if (allHighlightsLayer) {
                allHighlightsLayer.remove();
                allHighlightsLayer = null;
            }
            allHighlightsActive = false;
            if (allHighlightsRaf) {
                cancelAnimationFrame(allHighlightsRaf);
                allHighlightsRaf = 0;
            }
        }

        function paintAllElementBoxes(options) {
            if (!allHighlightsLayer) return;
            const animate = options && options.animate === true;
            allHighlightsLayer.replaceChildren();
            const frag = document.createDocumentFragment();
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const waveDenom = Math.max(360, vw * 0.48 + vh * 0.38);

            for (const el of document.querySelectorAll('*')) {
                if (SKIP_TAGS.has(el.tagName)) continue;
                if (el === allHighlightsLayer || allHighlightsLayer.contains(el))
                    continue;
                if (el.closest('[data-widget-chrome]')) continue;
                if (!isPaintable(el)) continue;

                const r = el.getBoundingClientRect();
                if (r.width < 1 || r.height < 1) continue;
                if (r.bottom < 0 || r.top > vh || r.right < 0 || r.left > vw)
                    continue;

                const o = document.createElement('div');
                Object.assign(o.style, {
                    position: 'fixed',
                    left: `${r.left}px`,
                    top: `${r.top}px`,
                    width: `${r.width}px`,
                    height: `${r.height}px`,
                    boxSizing: 'border-box',
                    border: '1px solid rgba(236, 72, 153, 1)',
                    pointerEvents: 'none',
                    zIndex: '1',
                    transformOrigin: 'center center',
                    willChange: animate ? 'opacity, transform' : 'auto'
                });

                if (animate) {
                    const wave = (r.left + r.top * 0.85) / waveDenom;
                    const delayMs = Math.min(1180, Math.max(0, wave * 1000));
                    o.style.animation = `widgetBoxFlowIn 0.88s cubic-bezier(0.18, 0.82, 0.22, 1) ${delayMs}ms both`;
                } else {
                    o.style.opacity = '1';
                }

                frag.appendChild(o);
            }

            const backdrop = document.createElement('div');
            backdrop.setAttribute('data-widget-dim', '');
            backdrop.setAttribute('data-widget-chrome', '');
            Object.assign(backdrop.style, {
                position: 'fixed',
                inset: '0',
                background: 'rgba(15, 23, 42, 0.48)',
                opacity: animate ? '0' : '1',
                transition: animate ? 'opacity 0.75s ease-out' : 'none',
                pointerEvents: 'none',
                zIndex: '0'
            });
            allHighlightsLayer.appendChild(backdrop);
            if (animate) {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        backdrop.style.opacity = '1';
                    });
                });
            }

            allHighlightsLayer.appendChild(frag);
        }

        function schedulePaintAll() {
            if (!allHighlightsActive) return;
            cancelAnimationFrame(allHighlightsRaf);
            allHighlightsRaf = requestAnimationFrame(() => {
                allHighlightsRaf = 0;
                paintAllElementBoxes({ animate: false });
            });
        }

        function toggleAllHighlights() {
            if (allHighlightsActive) {
                disposeAllHighlights();
                return;
            }
            allHighlightsActive = true;
            allHighlightsLayer = document.createElement('div');
            allHighlightsLayer.id = 'widget-all-highlights-layer';
            allHighlightsLayer.setAttribute('data-widget-chrome', '');
            Object.assign(allHighlightsLayer.style, {
                position: 'fixed',
                inset: '0',
                pointerEvents: 'none',
                zIndex: '9996',
                overflow: 'hidden'
            });
            document.body.appendChild(allHighlightsLayer);
            paintAllElementBoxes({ animate: true });
        }

        window.addEventListener('keydown', (e) => {
            const k = e.key === 'k' || e.key === 'K';
            if (!k || e.repeat) return;
            if (!(e.ctrlKey || e.metaKey)) return;
            e.preventDefault();
            toggleAllHighlights();
        });

        window.addEventListener('resize', schedulePaintAll);
        window.addEventListener('scroll', schedulePaintAll, true);

    });
})();
