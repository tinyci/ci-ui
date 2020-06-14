from "nginx"

copy "ci-ui.tar.gz", "/"
run "tar -vxz --strip-components=1 -C /usr/share/nginx/html -f ci-ui.tar.gz"
copy "dist-nginx.conf", "/etc/nginx/nginx.conf"
