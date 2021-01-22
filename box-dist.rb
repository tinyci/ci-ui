from "caddy:2.3.0"

skip { copy "ci-ui.tar.gz", "/" }

run "mkdir -p /ci-ui && tar -vxz --strip-components=1 -C /ci-ui -f /ci-ui.tar.gz"
copy "Caddyfile", "/Caddyfile"

cmd %w[caddy run --config /Caddyfile]
