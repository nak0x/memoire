#!/usr/bin/env python3
"""Generate and update README.md index pages across the research vault.

For every folder under ROOT this writes a README.md that acts as an index /
navigation page. Each README.md contains two *managed* blocks:

  * ABSTRACT - an AI-generated description of the folder's purpose, produced by
    the `claude` CLI.
  * NAV - a navigation list of the sub-folders and notes living in the folder.

The managed blocks are wrapped in HTML-comment markers, so re-running the
script refreshes them in place without touching anything you write by hand
elsewhere in the file (e.g. under the "Notes" heading).

Usage:
    python3 scripts/generate_index.py [ROOT]

Environment variables (all optional):
    ROOT     directory to index, relative to the repo root (default: research)
    MODEL    claude model alias used for abstracts          (default: sonnet)
    FORCE    "1" -> regenerate every AI abstract, even filled ones
    NO_AI    "1" -> skip the claude CLI and leave placeholder abstracts
"""

from __future__ import annotations

import os
import subprocess
import sys

# --------------------------------------------------------------------------- #
# Configuration                                                               #
# --------------------------------------------------------------------------- #

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT = sys.argv[1] if len(sys.argv) > 1 else os.environ.get("ROOT", "research")
MODEL = os.environ.get("MODEL", "sonnet")
FORCE = os.environ.get("FORCE", "") == "1"
NO_AI = os.environ.get("NO_AI", "") == "1"

# Folders we never descend into or index.
EXCLUDED_DIRS = {".git", ".obsidian", ".trash", "scripts", "node_modules", ".idea"}

# Managed-block markers.
ABS_START = "<!-- AUTO-INDEX:ABSTRACT:START -->"
ABS_END = "<!-- AUTO-INDEX:ABSTRACT:END -->"
NAV_START = "<!-- AUTO-INDEX:NAV:START -->"
NAV_END = "<!-- AUTO-INDEX:NAV:END -->"

PLACEHOLDER_PREFIX = "_Pending AI abstract"

CLAUDE_SYSTEM_PROMPT = (
    "You write the abstract for an index page of a folder inside an Obsidian "
    "research vault. The vault is a student's 'memoire' exploring research "
    "directions, readings and notes. Given a folder and excerpts of its "
    "contents, reply with ONLY a 2 to 4 sentence abstract describing what the "
    "folder contains and its purpose within the research. Match the dominant "
    "language of the excerpts (French or English). Output plain prose: no "
    "preamble, no heading, no bullet points, no markdown, no surrounding quotes."
)


# --------------------------------------------------------------------------- #
# Small helpers                                                               #
# --------------------------------------------------------------------------- #

def log(msg: str) -> None:
    print(msg, file=sys.stderr)


def prettify(name: str) -> str:
    """Turn a folder name like 'readings' into a title 'Readings'."""
    cleaned = name.replace("-", " ").replace("_", " ").strip()
    return cleaned[:1].upper() + cleaned[1:] if cleaned else name


def is_hidden(name: str) -> bool:
    return name.startswith(".")


def list_children(dirpath: str) -> tuple[list[str], list[str]]:
    """Return (subdir_names, file_names) for a folder, filtered and sorted."""
    subdirs, files = [], []
    for entry in os.listdir(dirpath):
        full = os.path.join(dirpath, entry)
        if os.path.isdir(full):
            if is_hidden(entry) or entry in EXCLUDED_DIRS:
                continue
            subdirs.append(entry)
        elif os.path.isfile(full):
            if is_hidden(entry) or entry == "README.md":
                continue
            files.append(entry)
    subdirs.sort(key=str.lower)
    files.sort(key=str.lower)
    return subdirs, files


def read_excerpt(path: str, max_lines: int = 25, max_chars: int = 1200) -> str:
    try:
        with open(path, encoding="utf-8") as fh:
            text = "".join(fh.readlines()[:max_lines])
    except (OSError, UnicodeDecodeError):
        return ""
    return text[:max_chars].strip()


def extract_between(text: str, start: str, end: str) -> str | None:
    s = text.find(start)
    e = text.find(end)
    if s == -1 or e == -1 or e < s:
        return None
    return text[s + len(start):e].strip()


def replace_between(text: str, start: str, end: str, inner: str) -> str:
    s = text.find(start)
    e = text.find(end)
    if s == -1 or e == -1 or e < s:
        return text
    return f"{text[:s + len(start)]}\n{inner.strip()}\n{text[e:]}"


# --------------------------------------------------------------------------- #
# Abstract generation                                                         #
# --------------------------------------------------------------------------- #

def placeholder_abstract(subdirs: list[str], files: list[str]) -> str:
    return (
        f"{PLACEHOLDER_PREFIX} - this folder holds {len(files)} note(s) and "
        f"{len(subdirs)} sub-folder(s). Run `make index` with the `claude` "
        f"CLI available to generate a real abstract._"
    )


def is_placeholder(text: str) -> bool:
    return text.strip().startswith(PLACEHOLDER_PREFIX)


def build_prompt(rel_path: str, subdirs: list[str], files: list[str],
                 dirpath: str) -> str:
    parts = [f"Folder (relative to vault): {rel_path or '.'}", ""]
    if subdirs:
        parts.append("Sub-folders: " + ", ".join(subdirs))
    if files:
        parts.append("Notes: " + ", ".join(files))
    parts.append("")
    parts.append("Excerpts:")
    for fname in files[:12]:
        excerpt = read_excerpt(os.path.join(dirpath, fname))
        if excerpt:
            parts.append(f"\n--- {fname} ---\n{excerpt}")
    if not files:
        parts.append("(This folder currently has no notes of its own.)")
    return "\n".join(parts)


def generate_abstract(rel_path: str, subdirs: list[str], files: list[str],
                      dirpath: str) -> str | None:
    """Call the claude CLI for an abstract. Returns None on failure."""
    if NO_AI:
        return None
    prompt = build_prompt(rel_path, subdirs, files, dirpath)
    cmd = ["claude", "-p", "--model", MODEL,
           "--append-system-prompt", CLAUDE_SYSTEM_PROMPT]
    try:
        res = subprocess.run(
            cmd, input=prompt, capture_output=True, text=True,
            timeout=180, cwd=REPO_ROOT,
        )
    except FileNotFoundError:
        log("  ! `claude` CLI not found - using placeholder.")
        return None
    except subprocess.TimeoutExpired:
        log("  ! claude timed out - using placeholder.")
        return None
    if res.returncode != 0:
        log(f"  ! claude failed (exit {res.returncode}): "
            f"{res.stderr.strip()[:200]}")
        return None
    out = res.stdout.strip()
    # Strip accidental code fences / wrapping quotes.
    if out.startswith("```"):
        out = out.strip("`").strip()
    if len(out) >= 2 and out[0] == out[-1] and out[0] in "\"'":
        out = out[1:-1].strip()
    return out or None


# --------------------------------------------------------------------------- #
# Rendering                                                                   #
# --------------------------------------------------------------------------- #

def build_nav(subdirs: list[str], files: list[str]) -> str:
    lines: list[str] = []
    if subdirs:
        lines.append("**Folders**")
        lines.append("")
        for d in subdirs:
            lines.append(f"- [{prettify(d)}/](<{d}/README.md>)")
        lines.append("")
    if files:
        lines.append("**Notes**")
        lines.append("")
        for f in files:
            title = f[:-3] if f.endswith(".md") else f
            lines.append(f"- [{title}](<{f}>)")
    if not subdirs and not files:
        lines.append("_No entries yet._")
    return "\n".join(lines).strip()


def render_template(title: str, breadcrumb: str, abstract: str, nav: str) -> str:
    crumb = f"\n{breadcrumb}\n" if breadcrumb else ""
    return (
        f"# {title}\n"
        f"\n"
        f"> *Auto-generated index. The `AUTO-INDEX` blocks are managed by "
        f"`make index`; edit freely outside them.*\n"
        f"{crumb}"
        f"\n## Overview\n\n"
        f"{ABS_START}\n{abstract}\n{ABS_END}\n"
        f"\n## Contents\n\n"
        f"{NAV_START}\n{nav}\n{NAV_END}\n"
        f"\n## Notes\n\n"
        f"<!-- Add your own notes here; this section is never overwritten. -->\n"
        f"\n---\n"
        f"<sub>Generated by <code>make index</code>.</sub>\n"
    )


# --------------------------------------------------------------------------- #
# Per-folder processing                                                       #
# --------------------------------------------------------------------------- #

def process_dir(dirpath: str, root_abspath: str) -> None:
    rel_path = os.path.relpath(dirpath, REPO_ROOT)
    subdirs, files = list_children(dirpath)
    base = os.path.basename(dirpath.rstrip(os.sep)) or rel_path
    title = prettify(base)
    readme_path = os.path.join(dirpath, "README.md")

    existing = None
    if os.path.isfile(readme_path):
        try:
            with open(readme_path, encoding="utf-8") as fh:
                existing = fh.read()
        except OSError:
            existing = None

    # Decide whether to (re)generate the AI abstract.
    current = extract_between(existing, ABS_START, ABS_END) if existing else None
    if FORCE or not current or is_placeholder(current):
        log(f"  - {rel_path}: generating abstract...")
        abstract = generate_abstract(rel_path, subdirs, files, dirpath)
        if abstract is None:
            abstract = current if current and not is_placeholder(current) \
                else placeholder_abstract(subdirs, files)
    else:
        abstract = current  # keep the human/AI text already there

    nav = build_nav(subdirs, files)

    if existing and ABS_START in existing and NAV_START in existing:
        new = replace_between(existing, ABS_START, ABS_END, abstract)
        new = replace_between(new, NAV_START, NAV_END, nav)
    else:
        breadcrumb = ""
        if os.path.abspath(dirpath) != root_abspath:
            breadcrumb = "[Up one level](../README.md)"
        new = render_template(title, breadcrumb, abstract, nav)

    if new == existing:
        log(f"  = {rel_path}: up to date")
        return
    with open(readme_path, "w", encoding="utf-8") as fh:
        fh.write(new)
    log(f"  {'~' if existing else '+'} {rel_path}/README.md written")


def main() -> int:
    root_abspath = os.path.abspath(os.path.join(REPO_ROOT, ROOT))
    if not os.path.isdir(root_abspath):
        log(f"ROOT '{ROOT}' is not a directory (looked in {root_abspath}).")
        return 1

    log(f"Indexing '{ROOT}' (model={MODEL}, force={FORCE}, no_ai={NO_AI})")
    targets: list[str] = []
    for current, dirnames, _ in os.walk(root_abspath):
        dirnames[:] = [d for d in dirnames
                       if not is_hidden(d) and d not in EXCLUDED_DIRS]
        targets.append(current)

    for dirpath in sorted(targets):
        process_dir(dirpath, root_abspath)

    log("Done.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
