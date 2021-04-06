ARG=$(filter-out $@,$(MAKECMDGOALS))

format :
	npx prettier --write index.js || exit $? ; \
	([ $$? -eq 0 ] && echo "✓ Format passed" || exit 1) ;\

.PHONY: example
example :
	make g-g -- dir o-o -c ./example/g-g.config.js || exit $? ;\
	make g-g -- file o-o -c ./example/g-g.config.js || exit $? ;\

g-g : ## Execute program
	node index.js ${ARG} || exit $? ;\

.PHONY: test
test : ## Execute tests
	node -r esm test/test.js || exit $? ;\

test-watch : test ## Execute tests on watch mode
	npx chokidar-cli "**/*.js" -c "make test" || exit $? ;\

# catch anything and do nothing
%:
	@:
