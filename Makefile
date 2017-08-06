# Concat all files into one exportable file

MAKEFLAGS += --warn-undefined-variables
SHELL := bash
.SHELLFLAGS := -eu -o pipefail -c
.DEFAULT_GOAL := all
.DELETE_ON_ERROR:
.SUFFIXES:

final := shell.php
rmcm := sed -ri ':a; s%(.*)/\*.*\*/%\1%; ta; /\/\*/ !b; N; ba'

IP := 127.0.0.1

.PHONY: clean check
.INTERMEDIATE: javascript.html css.html ip.php

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

ip.php:
	@echo "<?php" > $@
	@echo "    \$$authorized = '$(IP)';" >> $@
	@echo "?>" >> $@

# concat everything
all: javascript.html css.html ip.php
	@echo "- Concatenate all into one file"
	cat \
	ip.php \
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
