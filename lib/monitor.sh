#!/bin/zsh
source /root/.zshrc
cd /var/www/super_pack/current/
rvm use 2.1.5
RAILS_ENV=production bundle exec rake pack_monitor:start
