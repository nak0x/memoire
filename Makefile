# Makefile for the "memoire" research vault.
#
# `make index` walks the research vault and creates/updates a README.md index
# page in every folder: an AI-written abstract (via the `claude` CLI) plus a
# navigation list of the folder's notes and sub-folders.

ROOT  ?= research
MODEL ?= sonnet

.PHONY: index index-force index-no-ai help

index: ## Create missing READMEs, fill empty abstracts and refresh navigation
	ROOT="$(ROOT)" MODEL="$(MODEL)" python3 scripts/generate_index.py

index-force: ## Same as index, but regenerate every AI abstract from scratch
	ROOT="$(ROOT)" MODEL="$(MODEL)" FORCE=1 python3 scripts/generate_index.py

index-no-ai: ## Build indexes without calling claude (placeholder abstracts)
	ROOT="$(ROOT)" NO_AI=1 python3 scripts/generate_index.py

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN{FS=":.*?## "}{printf "  \033[36m%-14s\033[0m %s\n",$$1,$$2}'
