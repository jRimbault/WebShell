# Concat all files into one exportable file

# source files
exec := src/exec.php
style := src/style.css
common := src/common.js
overlay := src/Overlay.js
history := src/History.js
prompt := src/Prompt.js
shell := src/Shell.js
footer := src/footer.php

# target files
final := shell.php
build := build
outjs := $(build)/javascript.html
outcss := $(build)/css.html

# concat everything
concat : javascript css
	@echo "Concatenate all into one file"
	@cat $(exec) \
		$(outcss) \
		$(outjs) \
		$(footer) > $(final)
	@echo "  Done."

# write the css html file
css :
	@echo "Concatenate CSS into HTML"
	@mkdir -p $(build)
	@echo "<style>" > $(outcss)
	@cat $(style) >> $(outcss)
	@echo "</style>" >> $(outcss)
	@echo "  Done."

# write the javascript html file
javascript :
	@echo "Concatenate all JavaScript into HTML"
	@mkdir -p $(build)
	@echo "<script>" > $(outjs)
	@cat $(common) \
		$(overlay) \
		$(history) \
		$(prompt) \
		$(shell) >> $(outjs)
	@echo "</script>" >> $(outjs)
	@echo "  Done."

# erase all build files
clean :
	@rm -f $(outjs)
	@rm -f $(outcss)
	@rmdir $(build)

# erase all build files and final output file²
purge : clean
	@rm -f $(final)
