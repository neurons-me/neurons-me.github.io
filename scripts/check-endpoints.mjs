#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const DEFAULT_SOURCE = "README.md";
const DEFAULT_TIMEOUT_MS = 12_000;
const DEFAULT_CONCURRENCY = 6;

function readOption(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;
  return process.argv[index + 1] || fallback;
}

function hasFlag(name) {
  return process.argv.includes(name);
}

function normalizeUrl(raw) {
  return String(raw || "")
    .trim()
    .replace(/[),.;]+$/g, "");
}

function extractUrls(markdown) {
  const matches = markdown.match(/https?:\/\/[^\s<>"']+/g) || [];
  return Array.from(new Set(matches.map(normalizeUrl).filter(Boolean)));
}

async function checkUrl(url, timeoutMs) {
  const startedAt = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "accept": "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
        "user-agent": "neurons-me-endpoint-check/1.0",
      },
    });

    return {
      url,
      ok: response.status >= 200 && response.status < 400,
      status: response.status,
      statusText: response.statusText,
      finalUrl: response.url,
      redirected: response.redirected || response.url !== url,
      contentType: response.headers.get("content-type") || "",
      durationMs: Date.now() - startedAt,
    };
  } catch (error) {
    const cause = error?.cause;
    const causeMessage = cause?.code
      ? `${cause.code}: ${cause.message || error.message}`
      : cause?.message;
    return {
      url,
      ok: false,
      status: 0,
      statusText: error?.name === "AbortError" ? "Timeout" : "Network error",
      finalUrl: "",
      redirected: false,
      contentType: "",
      durationMs: Date.now() - startedAt,
      error: causeMessage || error?.message || String(error),
    };
  } finally {
    clearTimeout(timer);
  }
}

async function mapConcurrent(items, concurrency, worker) {
  const results = new Array(items.length);
  let next = 0;

  async function run() {
    while (next < items.length) {
      const index = next++;
      results[index] = await worker(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, run));
  return results;
}

function truncate(value, max) {
  const text = String(value || "");
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function printTable(results) {
  const rows = results.map((result) => ({
    mark: result.ok ? "OK" : "FAIL",
    status: result.status || "-",
    ms: `${result.durationMs}ms`,
    type: truncate(result.contentType.split(";")[0], 28),
    url: result.url,
    note: result.error
      ? result.error
      : result.redirected
        ? `-> ${result.finalUrl}`
        : "",
  }));

  const widths = {
    mark: 4,
    status: 6,
    ms: 8,
    type: 28,
  };

  console.log(`${"state".padEnd(widths.mark)} ${"status".padEnd(widths.status)} ${"time".padEnd(widths.ms)} ${"content-type".padEnd(widths.type)} url`);
  console.log(`${"-".repeat(widths.mark)} ${"-".repeat(widths.status)} ${"-".repeat(widths.ms)} ${"-".repeat(widths.type)} ${"-".repeat(60)}`);

  for (const row of rows) {
    const prefix = [
      row.mark.padEnd(widths.mark),
      String(row.status).padEnd(widths.status),
      row.ms.padEnd(widths.ms),
      row.type.padEnd(widths.type),
    ].join(" ");
    console.log(`${prefix} ${row.url}${row.note ? ` ${row.note}` : ""}`);
  }
}

function toMarkdown(results, source) {
  const failed = results.filter((result) => !result.ok);
  const generatedAt = new Date().toISOString();
  const lines = [
    "# Endpoint Check",
    "",
    `Source: \`${source}\``,
    `Generated: ${generatedAt}`,
    "",
    `Summary: ${results.length - failed.length}/${results.length} passing`,
    "",
    "| State | Status | Time | URL | Final URL | Content-Type |",
    "|---|---:|---:|---|---|---|",
  ];

  for (const result of results) {
    lines.push([
      result.ok ? "OK" : "FAIL",
      result.status || "-",
      `${result.durationMs}ms`,
      result.url,
      result.finalUrl && result.finalUrl !== result.url ? result.finalUrl : "",
      result.contentType.split(";")[0] || result.error || "",
    ].map((cell) => String(cell).replaceAll("|", "\\|")).join(" | ").replace(/^/, "| ").replace(/$/, " |"));
  }

  return `${lines.join("\n")}\n`;
}

async function main() {
  const source = readOption("--source", DEFAULT_SOURCE);
  const timeoutMs = Number(readOption("--timeout", DEFAULT_TIMEOUT_MS));
  const concurrency = Number(readOption("--concurrency", DEFAULT_CONCURRENCY));
  const jsonPath = readOption("--json", "");
  const markdownPath = readOption("--markdown", "");
  const noFail = hasFlag("--no-fail");

  const markdown = await fs.readFile(source, "utf8");
  const urls = extractUrls(markdown);

  if (urls.length === 0) {
    console.error(`No URLs found in ${source}`);
    process.exit(1);
  }

  console.log(`Checking ${urls.length} endpoints from ${source}...\n`);
  const results = await mapConcurrent(urls, concurrency, (url) => checkUrl(url, timeoutMs));
  const failed = results.filter((result) => !result.ok);

  printTable(results);
  console.log(`\nSummary: ${results.length - failed.length}/${results.length} passing`);

  if (jsonPath) {
    await fs.mkdir(path.dirname(jsonPath), { recursive: true });
    await fs.writeFile(jsonPath, `${JSON.stringify({ source, checkedAt: new Date().toISOString(), results }, null, 2)}\n`);
  }

  if (markdownPath) {
    await fs.mkdir(path.dirname(markdownPath), { recursive: true });
    await fs.writeFile(markdownPath, toMarkdown(results, source));
  }

  if (failed.length > 0 && !noFail) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
