import { useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";
import {
  CHART_COLORS,
  DEFAULT_WEEKLY_STUDY_DATA,
  CHART_ANIMATION,
  formatWeeklyTooltip,
  formatWeeklyTooltipAria,
} from "./weeklyStudyChartConfig";
import {
  createSpeechBubblePath,
  getTooltipLayout,
} from "./weeklyStudyChartTooltip";

const MARGIN = { top: 4, right: 4, bottom: 4, left: 4 };
const HIT_RADIUS = 10;
const DOT_RADIUS = 3;
const DOT_RADIUS_ACTIVE = 5;

const easeOutCubic = (t) => 1 - (1 - t) ** 3;

const lerpSessions = (data, t) =>
  data.map((d) => ({
    ...d,
    sessions: d.sessions * easeOutCubic(t),
  }));

export const WeeklyStudyChart = ({
  data = DEFAULT_WEEKLY_STUDY_DATA,
  className = "",
  animate = true,
  animationDelay = CHART_ANIMATION.delayMs,
  animationDuration = CHART_ANIMATION.durationMs,
}) => {
  const wrapRef = useRef(null);
  const svgRef = useRef(null);

  const chartData = useMemo(
    () => (data.length > 0 ? data : DEFAULT_WEEKLY_STUDY_DATA),
    [data]
  );

  useEffect(() => {
    const wrap = wrapRef.current;
    const svgEl = svgRef.current;
    if (!wrap || !svgEl) return undefined;

    let lastDrawnWidth = 0;
    let resizeRaf = 0;

    const draw = (shouldAnimate) => {
      const width = wrap.clientWidth || 305;
      lastDrawnWidth = width;
      const height = 120;
      const innerWidth = width - MARGIN.left - MARGIN.right;
      const innerHeight = height - MARGIN.top - MARGIN.bottom;

      const svg = d3.select(svgEl);
      svg.selectAll("*").remove();
      svg.attr("width", width).attr("height", height).attr("viewBox", null);

      const g = svg
        .append("g")
        .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

      const maxSessions = d3.max(chartData, (d) => d.sessions) || 1;
      const yMax = Math.max(maxSessions, 5);

      const xScale = d3
        .scalePoint()
        .domain(chartData.map((d) => d.date))
        .range([0, innerWidth])
        .padding(0);

      const yScale = d3
        .scaleLinear()
        .domain([0, yMax])
        .range([innerHeight, 0]);

      const gridTicks = 5;
      const gridLines = d3
        .range(gridTicks)
        .map((i) => (innerHeight / (gridTicks - 1)) * i);

      g.selectAll(".weekly-chart__grid")
        .data(gridLines)
        .join("line")
        .attr("class", "weekly-chart__grid")
        .attr("x1", 0)
        .attr("x2", innerWidth)
        .attr("y1", (d) => d)
        .attr("y2", (d) => d)
        .attr("stroke", CHART_COLORS.grid)
        .attr("stroke-width", 1);

      const defs = svg.append("defs");
      const gradientId = `weekly-area-gradient-${Math.random().toString(36).slice(2, 9)}`;
      const gradient = defs
        .append("linearGradient")
        .attr("id", gradientId)
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");

      gradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", CHART_COLORS.areaStart)
        .attr("stop-opacity", 0.3);
      gradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", CHART_COLORS.areaEnd)
        .attr("stop-opacity", 0);

      const curve = d3.curveMonotoneX;

      const area = d3
        .area()
        .x((d) => xScale(d.date))
        .y0(innerHeight)
        .y1((d) => yScale(d.sessions))
        .curve(curve);

      const line = d3
        .line()
        .x((d) => xScale(d.date))
        .y((d) => yScale(d.sessions))
        .curve(curve);

      const zeroData = lerpSessions(chartData, 0);

      const areaPath = g
        .append("path")
        .attr("class", "weekly-chart__area")
        .attr("fill", `url(#${gradientId})`)
        .attr("d", area(zeroData))
        .attr("opacity", shouldAnimate ? 0.35 : 1);

      const linePath = g
        .append("path")
        .attr("class", "weekly-chart__line")
        .attr("fill", "none")
        .attr("stroke", CHART_COLORS.line)
        .attr("stroke-width", 1.5)
        .attr("d", line(zeroData));

      const setActiveDot = (activeDate) => {
        dots
          .attr("r", (d) =>
            d.date === activeDate ? DOT_RADIUS_ACTIVE : DOT_RADIUS
          )
          .attr("stroke-width", (d) => (d.date === activeDate ? 2 : 1));
      };

      const dots = g
        .append("g")
        .attr("class", "weekly-chart__dots")
        .selectAll("circle")
        .data(chartData)
        .join("circle")
        .attr("class", "weekly-chart__dot")
        .attr("cx", (d) => xScale(d.date))
        .attr("cy", () => yScale(0))
        .attr("r", shouldAnimate ? 0 : DOT_RADIUS)
        .attr("fill", CHART_COLORS.dot)
        .attr("stroke", CHART_COLORS.dot)
        .attr("stroke-width", 1);

      const tooltip = g
        .append("g")
        .attr("class", "weekly-chart__tooltip")
        .attr("pointer-events", "none")
        .attr("opacity", 0);

      const tooltipBubbleFill = tooltip
        .append("path")
        .attr("class", "weekly-chart__tooltip-bubble-fill")
        .attr("fill", CHART_COLORS.tooltipFill)
        .attr("fill-opacity", 1)
        .attr("stroke", "none");

      const tooltipBubble = tooltip
        .append("path")
        .attr("class", "weekly-chart__tooltip-bubble")
        .attr("fill", CHART_COLORS.tooltipFill)
        .attr("fill-opacity", 1)
        .attr("stroke", CHART_COLORS.tooltipBorder)
        .attr("stroke-width", 1)
        .attr("shape-rendering", "geometricPrecision");

      const syncTooltipBubblePath = (d, placement) => {
        const pathD = createSpeechBubblePath(d.width, {
          bodyHeight: d.bodyHeight,
          tailHeight: d.tailHeight,
          tailCenterX: d.tailCenterX,
          placement,
        });
        tooltipBubbleFill.attr("d", pathD);
        tooltipBubble.attr("d", pathD);
      };

      const tooltipText = tooltip
        .append("text")
        .attr("class", "weekly-chart__tooltip-text")
        .attr("y", 14)
        .attr("font-size", 12)
        .attr("font-family", "Pretendard, sans-serif")
        .attr("dominant-baseline", "middle");

      const updateTooltipContent = (layout) => {
        const dateWidth = layout.dateText.length * 6.5;
        const totalWidth = dateWidth + layout.countText.length * 7;
        const startX = (layout.width - totalWidth) / 2;

        tooltipText.selectAll("tspan").remove();
        tooltipText
          .append("tspan")
          .attr("x", startX)
          .attr("fill", CHART_COLORS.tooltipDate)
          .text(layout.dateText);
        tooltipText
          .append("tspan")
          .attr("fill", CHART_COLORS.tooltipCount)
          .text(layout.countText);
      };

      const positionTooltip = (d) => {
        const cx = xScale(d.date);
        const cy = yScale(d.sessions);
        const layout = getTooltipLayout(d.date, d.sessions);

        let tx = cx - layout.width / 2;
        tx = Math.min(Math.max(tx, 0), innerWidth - layout.width);

        const tailCenterX = Math.min(
          Math.max(cx - tx, 12),
          layout.width - 12
        );

        const canPlaceAbove =
          cy >= layout.totalHeight + layout.gapAboveDot;
        const placement = canPlaceAbove ? "above" : "below";

        let ty;
        let textY;

        if (placement === "above") {
          ty = cy - layout.totalHeight - layout.gapAboveDot;
          textY = 14;
        } else {
          ty = cy + layout.gapBelowDot;
          ty = Math.min(ty, innerHeight - layout.totalHeight);
          textY = layout.tailHeight + 14;
        }

        syncTooltipBubblePath(
          {
            width: layout.width,
            bodyHeight: layout.bodyHeight,
            tailHeight: layout.tailHeight,
            tailCenterX,
          },
          placement
        );
        tooltipText.attr("y", textY);
        updateTooltipContent(layout);
        tooltip.attr("transform", `translate(${tx},${ty})`);
      };

      const showTooltip = (d) => {
        positionTooltip(d);
        tooltip.raise();
        tooltip.attr("opacity", 1);
      };

      const hideTooltip = () => {
        tooltip.attr("opacity", 0);
      };

      const hits = g
        .append("g")
        .attr("class", "weekly-chart__hits")
        .selectAll("circle")
        .data(chartData)
        .join("circle")
        .attr("class", "weekly-chart__hit")
        .attr("cx", (d) => xScale(d.date))
        .attr("cy", (d) => yScale(d.sessions))
        .attr("r", HIT_RADIUS)
        .attr("fill", "transparent")
        .style("cursor", "pointer")
        .attr("tabindex", 0)
        .attr("role", "button")
        .attr("aria-label", (d) => formatWeeklyTooltipAria(d.date, d.sessions))
        .on("mouseenter", (_event, d) => {
          showTooltip(d);
          setActiveDot(d.date);
        })
        .on("mouseleave", () => {
          hideTooltip();
          setActiveDot(null);
          dots.attr("r", DOT_RADIUS).attr("stroke-width", 1);
        })
        .on("focus", (_event, d) => {
          showTooltip(d);
          setActiveDot(d.date);
        })
        .on("blur", () => {
          hideTooltip();
          dots.attr("r", DOT_RADIUS).attr("stroke-width", 1);
        });

      const syncHitCy = (d) => yScale(d.sessions);

      if (!shouldAnimate) {
        areaPath.attr("d", area(chartData)).attr("opacity", 1);
        linePath.attr("d", line(chartData));
        dots.attr("cy", syncHitCy);
        hits.attr("cy", syncHitCy);
        return;
      }

      const { dotStaggerMs } = CHART_ANIMATION;
      const ease = d3.easeCubicOut;

      const transition = svg
        .transition()
        .delay(animationDelay)
        .duration(animationDuration)
        .ease(ease);

      areaPath
        .transition(transition)
        .attrTween("d", () => (t) => area(lerpSessions(chartData, t)))
        .attr("opacity", 1);

      linePath
        .transition(transition)
        .attrTween("d", () => (t) => line(lerpSessions(chartData, t)));

      const dotTween = (_, i) => {
        const endY = yScale(chartData[i].sessions);
        const startY = yScale(0);
        return (t) => String(startY + (endY - startY) * easeOutCubic(t));
      };

      dots
        .transition(transition)
        .delay((_, i) => animationDelay + i * dotStaggerMs)
        .attrTween("cy", dotTween)
        .attr("r", DOT_RADIUS);

      hits
        .transition(transition)
        .delay((_, i) => animationDelay + i * dotStaggerMs)
        .attrTween("cy", dotTween);
    };

    draw(animate);

    let skipResizeRedraw = animate;

    if (animate) {
      window.setTimeout(() => {
        skipResizeRedraw = false;
      }, animationDelay + animationDuration + 250);
    }

    const ro = new ResizeObserver(() => {
      if (skipResizeRedraw) return;
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        const nextWidth = wrap.clientWidth || 305;
        if (Math.abs(nextWidth - lastDrawnWidth) < 1) return;
        draw(false);
      });
    });
    ro.observe(wrap);

    return () => {
      cancelAnimationFrame(resizeRaf);
      ro.disconnect();
      d3.select(svgEl).selectAll("*").interrupt();
    };
  }, [chartData, animate, animationDelay, animationDuration]);

  return (
    <div
      ref={wrapRef}
      className={`mypage-summary__chart-wrap weekly-study-chart${className ? ` ${className}` : ""}`}
    >
      <svg
        ref={svgRef}
        className="mypage-summary__chart weekly-study-chart__svg"
        role="img"
        aria-label="최근 7일 주간 학습시간 차트. 각 데이터 포인트에 마우스를 올리면 상세 정보를 확인할 수 있습니다."
      />
    </div>
  );
};
