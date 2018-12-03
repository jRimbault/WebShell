dist/shell.php: dist
	cat src/page.php > $@
	echo "<script>" >> $@
	cat src/code.js >> $@
	echo "</script>" >> $@

dist:
	mkdir $@

.PHONY: clean
clean:
	rm -r dist
