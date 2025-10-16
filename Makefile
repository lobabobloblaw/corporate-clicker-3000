REMOTE = root@143.110.202.161
REMOTE_DIR = /var/www/clicker

.PHONY: build deploy deploy-remote help

help:
	@echo "Available targets:"
	@echo "  build          - Build production files (npm run build)"
	@echo "  deploy         - Build and deploy to DigitalOcean droplet"
	@echo "  deploy-remote  - Same as deploy (alias)"

build:
	@echo "📦 Building production files..."
	npm run build
	@echo "✅ Build complete!"

deploy-remote: build
	@echo "🚀 Deploying to $(REMOTE)..."
	@echo "📁 Target directory: $(REMOTE_DIR)"
	rsync -avz --delete \
		--exclude='node_modules' \
		--exclude='.git' \
		--exclude='.env*' \
		--exclude='README.md' \
		--exclude='CLAUDE.md' \
		dist/ $(REMOTE):$(REMOTE_DIR)/
	@echo ""
	@echo "✅ Deployed successfully!"
	@echo "🌐 Activity available at: http://143.110.202.161"
	@echo "⚠️  Remember to set up HTTPS for production use!"

deploy: deploy-remote
