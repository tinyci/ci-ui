from "caddy:2.3.0"

skip { copy "ci-ui.tar.gz", "/" }

run "mkdir -p /ci-ui && tar -vxz --strip-components=1 -C /ci-ui -f /ci-ui.tar.gz"
cmd %w[caddy run --config /Caddyfile]

after do
  copy "Caddyfile", "/Caddyfile"
  tag "tinyci/ui:#{getenv("VERSION") || "latest" }"

  copy "Caddyfile.k8s", "/Caddyfile"
  tag "tinyci/ui:#{getenv("VERSION") || "main"}-k8s"
end
