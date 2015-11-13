#!/bin/zsh
cd /var/www/super_pack/current/
RAILS_ENV=production bundle exec rake pack_monitor:start
