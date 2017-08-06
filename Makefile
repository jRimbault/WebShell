# Concat all files into one exportable file

MAKEFLAGS += --warn-undefined-variables
SHELL := bash
.SHELLFLAGS := -eu -o pipefail -c
.DEFAULT_GOAL := all
.DELETE_ON_ERROR:
.SUFFIXES:

final := shell.php
rmcm := sed -ri ':a; s%(.*)/\*.*\*/%\1%; ta; /\/\*/ !b; N; ba'

.PHONY: clean check
.INTERMEDIATE: javascript.html css.html

# write the javascript html file
javascript.html:
	@echo "- Concatenate all JavaScript into HTML"
	@echo "<script>" > $@
	cat \
	src/common.js \
	src/Overlay.js \
	src/History.js \
	src/Prompt.js \
	src/Shell.js \
	>> $@
	@echo "</script>" >> $@
	@$(rmcm) $@

# write the css html file
css.html:
	@echo "- Concatenate CSS into HTML"
	@echo "<style>" > $@
	cat src/style.css >> $@
	@echo "</style>" >> $@
	@$(rmcm) $@

# concat everything
all: javascript.html css.html
	@echo "- Concatenate all into one file"
	cat \
	src/exec.php \
	css.html \
	javascript.html \
	src/footer.php \
	> $(final)
	@echo "Done: $(final)"

# check files, run tests
check:

# erase build files
clean:
	rm $(final)
